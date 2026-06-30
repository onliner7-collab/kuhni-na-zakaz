import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendLeadNotifications } from "@/lib/telegram";
import { sendEmailNotification } from "@/lib/email";

const MAX_LEADS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_LEAD_FILE_SIZE = 8 * 1024 * 1024;
const leadAttempts = new Map<string, { count: number; resetAt: number }>();

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Введите корректный номер")
  .max(30, "Слишком длинный номер")
  .refine((value) => value.replace(/\D/g, "").length >= 7, "Введите корректный номер");

const booleanField = z.preprocess((value) => {
  if (value === true || value === "true" || value === "on" || value === "1") return true;
  if (value === false || value === "false" || value === "0" || value === "") return false;
  return value;
}, z.boolean());

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: phoneSchema,
  city: z.string().trim().max(100).optional().default(""),
  kitchenType: z.string().trim().max(80).optional().default(""),
  comment: z.string().trim().max(2000).optional().default(""),
  messenger: z.string().trim().max(80).optional().default(""),
  uploadNote: z.string().trim().max(300).optional().default(""),
  hasMeasurements: booleanField.optional().default(false),
  agreement: booleanField.refine(Boolean, "Нужно согласие на обработку данных"),
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
    const { body, file } = await readLeadRequest(req);

    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (file && file.size > MAX_LEAD_FILE_SIZE) {
      return NextResponse.json({ error: "Файл слишком большой. Максимум 8 МБ." }, { status: 400 });
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
      hasMeasurements: data.hasMeasurements || undefined,
      messenger: data.messenger || undefined,
      uploadNote: data.uploadNote || undefined,
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
    const fileComment = file
      ? `\nФайл помещения: ${file.name} (${Math.round(file.size / 1024)} КБ).`
      : data.uploadNote
        ? `\nФайл помещения: ${data.uploadNote}.`
        : "";
    const messengerComment = data.messenger ? `\nМессенджер: ${data.messenger}.` : "";

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city || "",
        comment: `${data.comment || ""}${messengerComment}${fileComment}`.trim(),
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

    if (file) {
      try {
        const storedFile = await saveLeadFile(lead.id, file);
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            answers: {
              ...(answers as Record<string, unknown>),
              uploadedPlan: storedFile,
            } as Prisma.InputJsonValue,
          },
        }).catch(() => {});
      } catch (err) {
        console.error("[LEAD FILE]", getSafeErrorMessage(err));
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            answers: {
              ...(answers as Record<string, unknown>),
              uploadError: "file_storage_failed",
            } as Prisma.InputJsonValue,
          },
        }).catch(() => {});
      }
    }

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

async function readLeadRequest(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return { body: await req.json(), file: null as File | null };
  }

  const formData = await req.formData();
  const body: Record<string, unknown> = {};
  let file: File | null = null;

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (key === "roomFile" && value.size > 0) {
        file = value;
      }
      continue;
    }

    if (key === "answers") {
      body.answers = parseJsonField(value);
      continue;
    }

    body[key] = value;
  }

  return { body, file };
}

function parseJsonField(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

async function saveLeadFile(leadId: number, file: File) {
  const safeExt = getSafeFileExt(file);
  const uploadDir = path.join(process.cwd(), "storage", "lead-uploads", String(leadId));
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}${safeExt}`;
  const absolutePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return {
    originalName: file.name,
    size: file.size,
    type: file.type,
    storage: `storage/lead-uploads/${leadId}/${filename}`,
  };
}

function getSafeFileExt(file: File) {
  const nameExt = path.extname(file.name).toLowerCase();
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".pdf"]);

  if (allowed.has(nameExt)) return nameExt;
  if (file.type === "application/pdf") return ".pdf";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  return ".jpg";
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
