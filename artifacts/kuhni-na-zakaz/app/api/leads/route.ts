import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  city: z.string().max(100).optional().default(""),
  comment: z.string().max(2000).optional().default(""),
  source: z.string().max(100).optional().default("website"),
  formType: z.string().max(50).optional().default("contact"),
  answers: z
    .record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()]))
    .optional()
    .default({}),
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
        answers: data.answers || {},
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
    await requireAdmin();
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(leads);
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }
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
