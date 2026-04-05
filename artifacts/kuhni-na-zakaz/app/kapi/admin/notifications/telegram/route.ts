import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { testTelegramMessage } from "@/lib/telegram";
import { z } from "zod";

const addSchema = z.object({
  label: z.string().max(100).default(""),
  chatId: z.string().min(1).max(100),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const recipients = await prisma.telegramRecipient.findMany({
    orderBy: { createdAt: "asc" },
  });

  const settings = await prisma.siteSettings.findFirst({
    select: { telegramBotToken: true },
  });

  return NextResponse.json({ recipients, botToken: settings?.telegramBotToken ?? "" });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await req.json();

  if (body._action === "test") {
    const { botToken, chatId } = body;
    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Укажите токен бота и Chat ID" }, { status: 400 });
    }
    const result = await testTelegramMessage(botToken, chatId);
    return NextResponse.json(result);
  }

  if (body._action === "saveBotToken") {
    const token = String(body.botToken ?? "").trim();
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1, telegramBotToken: token },
      update: { telegramBotToken: token },
    });
    return NextResponse.json({ ok: true });
  }

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.telegramRecipient.findFirst({
    where: { chatId: parsed.data.chatId },
  });
  if (existing) {
    return NextResponse.json({ error: "Этот Chat ID уже добавлен" }, { status: 400 });
  }

  const recipient = await prisma.telegramRecipient.create({ data: parsed.data });
  return NextResponse.json(recipient, { status: 201 });
}
