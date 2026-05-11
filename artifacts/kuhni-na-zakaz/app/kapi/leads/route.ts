import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendLeadNotifications } from "@/lib/telegram";
import { sendEmailNotification } from "@/lib/email";

const MAX_LEADS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const leadAttempts = new Map<string, { count: number; resetAt: number }>();

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Введите корректный номер")
  .max(30, "Слишком длинный номер")
  .refine((value) => value.replace(/\D/g, "").length >= 7, "Введите корректный номер");

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: phoneSchema,
  city: z.string().trim().max(100).optional().default(""),
  kitchenType: z.string().trim().max(80).optional().default(""),
  comment: z.string().trim().max(2000).optional().default(""),
  agreement: z.boolean().refine(Boolean, "Нужно согласие на обработку данных"),
  source: z.string().trim().max(100).optional().default("website"),
  formType: z.string().trim().max(50).optional().default("contact"),
  sourcePage: z.string().trim().max(500).optional().default(""),
  sourceType: z.string().trim().max(100).optional().default(""),
  projectSlug: z.string().trim().max(150).optional().default(""),
  cityKey: z.string().trim().max(100).optional().default(""),
  utmSource: z.string().trim().max(150).optional().default(""),
  utmMedium: z.string().trim().max(150).optional().default(""),
  utmCampaign: z.string().trim().max(150).optional().default(""),
  utmTerm: z.string().trim().max(150).optional().default(""),
  utmContent: z.string().trim().max(150).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),
  answers: z.record(z.unknown()).optional().default({}),
  configSessionId: z.string().max(100).optional(),
  scenarioSlug: z.string().max(100).optional().default(""),
  styleSlug: z.string().max(100).optional().default(""),
  materialSlug: z.string().max(100).optional().default(""),
  budgetLevel: z.string().max(100).optional().default(""),
  honeypot: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const rateLimitKey = getRateLimitKey(req);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже." }, { status: 429 });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Проверьте поля формы", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const answers = {
      ...(data.answers || {}),
      kitchenType: data.kitchenType || undefined,
      sourcePage: data.sourcePage || undefined,
      sourceType: data.sourceType || undefined,
      projectSlug: data.projectSlug || undefined,
      cityKey: data.cityKey || undefined,
      referrer: data.referrer || undefined,
      utm: {
        source: data.utmSource || undefined,
        medium: data.utmMedium || undefined,
        campaign: data.utmCampaign || undefined,
        term: data.utmTerm || undefined,
        content: data.utmContent || undefined,
      },
      agreement: data.agreement ? "accepted" : undefined,
    } as Prisma.InputJsonValue;

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city || "",
        comment: data.comment || "",
        source: data.source || "website",
        formType: data.formType || "contact",
        answers,
        configSessionId: data.configSessionId || null,
        scenarioSlug: data.scenarioSlug || "",
        styleSlug: data.styleSlug || "",
        materialSlug: data.materialSlug || "",
        budgetLevel: data.budgetLevel || "",
      },
    });

    if (data.configSessionId) {
      prisma.savedConfig.updateMany({
        where: { sessionId: data.configSessionId },
        data: { leadId: lead.id, phone: data.phone },
      }).catch(() => {});
    }

    await sendLeadNotifications(lead).catch((err) => {
      console.error("[TELEGRAM]", getSafeErrorMessage(err));
    });

    sendEmailNotification(lead).catch((err) => {
      console.error("[EMAIL]", getSafeErrorMessage(err));
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("[LEADS POST]", getSafeErrorMessage(err));
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Ошибка БД" }, { status: 500 });
  }
}

function getRateLimitKey(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = leadAttempts.get(key);

  if (!current || current.resetAt < now) {
    leadAttempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_LEADS_PER_WINDOW;
}

function getSafeErrorMessage(err: unknown) {
  if (err instanceof Error) {
    return err.message;
  }

  return String(err);
}
