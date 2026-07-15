import { after, NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createTelegramLeadLink } from "@/lib/leads/telegram-link";
import { enqueueLeadCardSync } from "@/lib/leads/telegram-cards";
import { processTelegramOutbox } from "@/lib/leads/telegram-outbox";
import {
  leadInputSchema,
  normalizeImageUrl,
  normalizePhone,
  normalizeSourceType,
  normalizeSiteUrl,
} from "@/lib/leads/validation";
import { sendEmailNotification } from "@/lib/email";

const MAX_LEADS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const leadAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await readLeadRequest(req);
    if (typeof body.honeypot === "string" && body.honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const rateLimitKey = getRateLimitKey(req);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже." }, { status: 429 });
    }

    const parsed = leadInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Проверьте поля формы", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const sourceType = normalizeSourceType(data.sourceType);
    const phone = normalizePhone(data.phone);
    const canSubmitWithoutPhone =
      data.continueInTelegram &&
      (sourceType === "kitchen_card" || sourceType === "kitchen_gallery");
    if (!phone && !canSubmitWithoutPhone) {
      return NextResponse.json(
        { error: "Введите корректный номер телефона" },
        { status: 400 },
      );
    }

    const sourcePage = normalizeSiteUrl(data.sourcePage);
    const imageUrl = normalizeImageUrl(data.imageUrl);
    const answers = {
      ...data.answers,
      kitchenType: data.kitchenType || undefined,
      hasMeasurements: data.hasMeasurements || undefined,
      sourcePage: sourcePage || undefined,
      sourceType,
      projectSlug: data.projectSlug || undefined,
      cityKey: data.cityKey || undefined,
      utm: {
        source: data.utmSource || undefined,
        medium: data.utmMedium || undefined,
        campaign: data.utmCampaign || undefined,
        term: data.utmTerm || undefined,
        content: data.utmContent || undefined,
      },
      agreement: "accepted",
    } as Prisma.InputJsonValue;

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: phone || "",
        email: data.email,
        preferredContact: data.continueInTelegram ? "telegram" : data.preferredContact,
        city: data.city,
        kitchenType: data.kitchenType,
        dimensions: data.dimensions,
        comment: data.comment,
        source: data.source || "website",
        formType: data.formType || "contact",
        sourceType,
        sourcePage,
        sourceBlock: data.sourceBlock,
        kitchenId: data.kitchenId,
        imageId: data.imageId,
        imageUrl,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        referrer: normalizeSiteUrl(data.referrer),
        answers,
        configSessionId: data.configSessionId || null,
        scenarioSlug: data.scenarioSlug,
        styleSlug: data.styleSlug,
        materialSlug: data.materialSlug,
        budgetLevel: data.budgetLevel,
        auditLogs: {
          create: {
            actorType: "website",
            action: "lead_created",
            payload: { sourceType } as Prisma.InputJsonValue,
          },
        },
      },
    });

    if (data.configSessionId) {
      await prisma.savedConfig.updateMany({
        where: { sessionId: data.configSessionId },
        data: { leadId: lead.id, phone: phone || "" },
      }).catch(() => undefined);
    }

    const telegramUrl = data.continueInTelegram
      ? await createTelegramLeadLink(lead.id)
      : "";

    await enqueueLeadCardSync(lead.id);
    after(async () => {
      await Promise.allSettled([
        processTelegramOutbox(10),
        sendEmailNotification(lead),
      ]);
    });

    return NextResponse.json({
      ok: true,
      id: lead.id,
      publicNumber: lead.publicNumber,
      ...(telegramUrl ? { telegramUrl } : {}),
    });
  } catch (error) {
    console.error("[LEADS POST]", getSafeErrorMessage(error));
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}

async function readLeadRequest(req: NextRequest): Promise<Record<string, unknown>> {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return (await req.json()) as Record<string, unknown>;
  }

  const formData = await req.formData();
  const body: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) throw new Error("Загрузка файлов отключена");
      continue;
    }
    if (key === "answers") {
      body.answers = parseJsonField(value);
      continue;
    }
    body[key] = value;
  }
  return body;
}

function parseJsonField(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return {};
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(leads);
}

function getRateLimitKey(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "local"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  if (leadAttempts.size > 10_000) {
    for (const [attemptKey, attempt] of leadAttempts) {
      if (attempt.resetAt < now) leadAttempts.delete(attemptKey);
    }
  }
  const current = leadAttempts.get(key);
  if (!current || current.resetAt < now) {
    leadAttempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_LEADS_PER_WINDOW;
}

function getSafeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
