import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { testTelegramMessage } from "@/lib/telegram";
import { getTelegramBotToken } from "@/lib/telegram-api";
import { getEmailNotificationStatus, testEmailNotification } from "@/lib/email";

const chatIdSchema = z
  .string()
  .trim()
  .min(1, "Chat ID обязателен")
  .max(100, "Chat ID слишком длинный")
  .regex(
    /^-?\d+$/,
    "Chat ID должен содержать только цифры (можно с минусом для групповых чатов)",
  );

const recipientCreateSchema = z.object({
  label: z.string().trim().max(100).optional().default(""),
  role: z.enum(["owner", "manager"]).optional().default("manager"),
  chatId: chatIdSchema,
});

async function requireSuperAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = await requireSuperAdmin();
  if (denied) return denied;

  const recipients = await prisma.telegramRecipient.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    recipients,
    botConfigured: Boolean(getTelegramBotToken()),
    email: getEmailNotificationStatus(),
  });
}

export async function POST(req: NextRequest) {
  const denied = await requireSuperAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));

  if (body?._action === "test") {
    return handleTestAction(body);
  }

  if (body?._action === "testEmail") {
    return NextResponse.json(await testEmailNotification());
  }

  if (body?._action === "saveBotToken") {
    return NextResponse.json(
      { error: "Токен настраивается только в защищённом окружении сервера" },
      { status: 400 },
    );
  }

  const parsed = recipientCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.errors[0]?.message ?? "Неверные данные",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const existing = await prisma.telegramRecipient.findUnique({
    where: { chatId: data.chatId },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Этот Chat ID уже добавлен" },
      { status: 400 },
    );
  }

  try {
    const recipient = await prisma.telegramRecipient.create({
      data: {
        ...data,
        telegramUserId: data.chatId.startsWith("-") ? null : data.chatId,
      },
    });
    return NextResponse.json(recipient, { status: 201 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Этот Chat ID уже добавлен" },
        { status: 400 },
      );
    }
    console.error("[TELEGRAM RECIPIENTS POST]", err);
    return NextResponse.json(
      { error: "Не удалось добавить получателя" },
      { status: 500 },
    );
  }
}

async function handleTestAction(body: Record<string, unknown>) {
  const botToken = getTelegramBotToken();
  const chatIdRaw =
    typeof body.chatId === "string" ? body.chatId.trim() : "";

  if (!botToken) {
    return NextResponse.json(
      { ok: false, error: "Укажите токен бота" },
      { status: 400 },
    );
  }

  const chatIdCheck = chatIdSchema.safeParse(chatIdRaw);
  if (!chatIdCheck.success) {
    return NextResponse.json(
      {
        ok: false,
        error: chatIdCheck.error.errors[0]?.message ?? "Некорректный Chat ID",
      },
      { status: 400 },
    );
  }

  const result = await testTelegramMessage(botToken, chatIdCheck.data);
  // testTelegramMessage уже возвращает { ok, error? } с понятными сообщениями
  // (chat not found / unauthorized / bot was blocked / token invalid → 404),
  // см. formatTelegramError в lib/telegram.ts.
  return NextResponse.json(result);
}
