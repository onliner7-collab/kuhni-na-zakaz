import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  city: z.string().max(100).optional().default(""),
  comment: z.string().max(2000).optional().default(""),
  source: z.string().max(100).optional().default("website"),
  formType: z.string().max(50).optional().default("contact"),
  answers: z.record(z.unknown()).optional().default({}),
  honeypot: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Anti-spam: honeypot
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ ok: true }); // Silent ignore
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
        answers: data.answers as Prisma.InputJsonValue,
      },
    });

    // Telegram webhook
    await sendTelegramNotification(lead).catch((err) => {
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
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
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

async function sendTelegramNotification(lead: {
  id: number; name: string; phone: string; city: string; comment: string; source: string;
}) {
  const settings = await prisma.siteSettings.findFirst().catch(() => null);
  if (!settings?.telegramBotToken || !settings?.telegramChatId) return;

  const text = `🆕 Новая заявка #${lead.id}
👤 Имя: ${lead.name}
📞 Телефон: ${lead.phone}
📍 Город: ${lead.city || "не указан"}
💬 Комментарий: ${lead.comment || "—"}
🔗 Источник: ${lead.source}`;

  await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: settings.telegramChatId, text, parse_mode: "HTML" }),
  });
}
