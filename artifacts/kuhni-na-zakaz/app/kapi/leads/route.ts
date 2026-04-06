import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendLeadNotifications } from "@/lib/telegram";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  city: z.string().max(100).optional().default(""),
  comment: z.string().max(2000).optional().default(""),
  source: z.string().max(100).optional().default("website"),
  formType: z.string().max(50).optional().default("contact"),
  answers: z.record(z.unknown()).optional().default({}),
  // Этап 10: персонализация
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

    // Anti-spam: honeypot
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Неверный формат данных", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city || "",
        comment: data.comment || "",
        source: data.source || "website",
        formType: data.formType || "contact",
        answers: data.answers || {},
        configSessionId: data.configSessionId || null,
        scenarioSlug: data.scenarioSlug || "",
        styleSlug: data.styleSlug || "",
        materialSlug: data.materialSlug || "",
        budgetLevel: data.budgetLevel || "",
      },
    });

    // Если есть сессия с сохранённым конфигом — обновляем leadId
    if (data.configSessionId) {
      prisma.savedConfig.updateMany({
        where: { sessionId: data.configSessionId },
        data: { leadId: lead.id, phone: data.phone },
      }).catch(() => {});
    }

    await sendLeadNotifications(lead).catch((err) => {
      console.error("[TELEGRAM]", err);
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("[LEADS POST]", err);
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Ошибка БД" }, { status: 500 });
  }
}
