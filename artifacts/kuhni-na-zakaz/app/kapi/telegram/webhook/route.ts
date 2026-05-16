import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMessage } from "@/lib/telegram";

// Telegram Bot API webhook для входящих сообщений.
//
// Ключевые принципы (этап 7):
//  • Не трогаем sendLeadNotifications и POST /kapi/leads — webhook полностью
//    отдельная история.
//  • Базу активных получателей берём из TelegramRecipient (та же, что и для
//    заявок). Отключённые и удалённые — не получают пересылку автоматически.
//  • Webhook отвечает 200 { ok: true } во всех штатных случаях. Любая
//    ошибка отправки одному получателю не должна заставлять Telegram
//    ретраить апдейт — иначе мы получим лавину дубликатов.
//  • Каждая попытка отправки логируется в TelegramNotificationLog
//    (leadId: null), чтобы /admin/notifications/logs показывал и пересылку
//    тоже.
//  • Секрет проверяется только если он задан в env. Это позволяет:
//      – в проде закрыть webhook ключом (Telegram setWebhook с
//        secret_token шлёт заголовок X-Telegram-Bot-Api-Secret-Token);
//      – в локальном dev/CI продолжать вызывать ручку curl-ом без секрета.

interface TelegramMessagePayload {
  chat?: { id?: number | string };
  from?: {
    id?: number | string;
    username?: string;
    first_name?: string;
  };
  text?: string;
  reply_to_message?: {
    text?: string;
    caption?: string;
  };
}

interface TelegramUpdate {
  update_id?: number;
  message?: TelegramMessagePayload;
  // edited_message, channel_post и т.п. умышленно не обрабатываем —
  // спецификация этапа покрывает только обычные входящие message.text.
}

const OK_RESPONSE = NextResponse.json({ ok: true });

function checkSecret(req: NextRequest): NextResponse | null {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!expected) {
    // Секрет не настроен в окружении — пропускаем проверку, чтобы
    // dev-окружение могло работать без дополнительных переменных.
    return null;
  }

  const headerSecret =
    req.headers.get("x-telegram-bot-api-secret-token")?.trim() ?? "";
  const querySecret = req.nextUrl.searchParams.get("secret")?.trim() ?? "";

  if (headerSecret === expected || querySecret === expected) {
    return null;
  }

  return NextResponse.json(
    { ok: false, error: "Forbidden" },
    { status: 403 },
  );
}

export async function POST(req: NextRequest) {
  const forbidden = checkSecret(req);
  if (forbidden) return forbidden;

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    // Невалидный JSON — отвечаем 200, чтобы Telegram не зацикливался
    // ретраями. Telegram сам гарантирует валидный JSON в проде; такие
    // запросы в реальности — это случайные пробинги.
    return OK_RESPONSE;
  }

  const message = update?.message;
  const text =
    typeof message?.text === "string" ? message.text.trim() : "";

  if (!message || !text) {
    return OK_RESPONSE;
  }

  const currentChatId = stringifyId(message.chat?.id);
  const replyTargetTelegramId = extractReplyTargetTelegramId(
    message.reply_to_message,
  );

  if (currentChatId && replyTargetTelegramId) {
    await forwardReplyToClient({
      recipientChatId: currentChatId,
      clientTelegramId: replyTargetTelegramId,
      username:
        typeof message.from?.username === "string"
          ? message.from.username.trim()
          : "",
      firstName:
        typeof message.from?.first_name === "string"
          ? message.from.first_name.trim()
          : "",
      text,
    });
    return OK_RESPONSE;
  }

  if (currentChatId && (await isActiveRecipientChat(currentChatId))) {
    return OK_RESPONSE;
  }

  // ТЗ: userTelegramId берём из message.chat.id. В личном чате с ботом
  // это совпадает с message.from.id; в группе chat.id отрицательный,
  // что для нашего хранилища ОК (поле строковое).
  const userTelegramId = currentChatId;
  const username =
    typeof message.from?.username === "string"
      ? message.from.username.trim()
      : "";
  const firstName =
    typeof message.from?.first_name === "string"
      ? message.from.first_name.trim()
      : "";

  await saveIncomingMessage({
    userTelegramId,
    username,
    firstName,
    messageText: text,
  });

  await forwardToRecipients({
    userTelegramId,
    username,
    firstName,
    text,
  });

  return OK_RESPONSE;
}

async function isActiveRecipientChat(chatId: string) {
  if (!chatId) return false;

  const recipient = await prisma.telegramRecipient
    .findFirst({
      where: { chatId, active: true },
      select: { id: true },
    })
    .catch((err) => {
      console.error("[TELEGRAM WEBHOOK] recipient lookup failed", err);
      return null;
    });

  return Boolean(recipient);
}

async function forwardReplyToClient(input: {
  recipientChatId: string;
  clientTelegramId: string;
  username: string;
  firstName: string;
  text: string;
}) {
  const [recipient, settings] = await Promise.all([
    prisma.telegramRecipient
      .findFirst({
        where: { chatId: input.recipientChatId, active: true },
        select: { id: true, label: true },
      })
      .catch((err) => {
        console.error("[TELEGRAM WEBHOOK] recipient lookup failed", err);
        return null;
      }),
    prisma.siteSettings
      .findFirst({ select: { telegramBotToken: true } })
      .catch(() => null),
  ]);

  if (!recipient) {
    return;
  }

  const token = (
    process.env.TELEGRAM_BOT_TOKEN ||
    settings?.telegramBotToken ||
    ""
  ).trim();

  if (!token) {
    console.warn("[TELEGRAM WEBHOOK] Bot token is not configured");
    return;
  }

  const formatted = formatManagerReply({
    username: input.username,
    firstName: input.firstName,
    text: input.text,
  });

  try {
    await sendMessage(token, input.clientTelegramId, formatted);
    await logAttempt({
      recipientId: recipient.id,
      chatId: input.clientTelegramId,
      status: "sent",
      errorMessage: "",
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await logAttempt({
      recipientId: recipient.id,
      chatId: input.clientTelegramId,
      status: "failed",
      errorMessage,
    });
  }
}

async function saveIncomingMessage(input: {
  userTelegramId: string;
  username: string;
  firstName: string;
  messageText: string;
}) {
  try {
    await prisma.telegramMessage.create({
      data: {
        userTelegramId: input.userTelegramId,
        username: input.username,
        firstName: input.firstName,
        messageText: input.messageText,
      },
    });
  } catch (err) {
    // Не валим webhook: даже если сохранить не удалось, продолжаем
    // пересылку, чтобы модератор хотя бы увидел сообщение в Telegram.
    console.error("[TELEGRAM WEBHOOK] save incoming message failed", err);
  }
}

async function forwardToRecipients(input: {
  userTelegramId: string;
  username: string;
  firstName: string;
  text: string;
}) {
  const [recipients, settings] = await Promise.all([
    prisma.telegramRecipient
      .findMany({
        where: { active: true },
        select: { id: true, chatId: true },
      })
      .catch((err) => {
        console.error(
          "[TELEGRAM WEBHOOK] failed to load active recipients",
          err,
        );
        return [] as { id: number; chatId: string }[];
      }),
    prisma.siteSettings
      .findFirst({ select: { telegramBotToken: true } })
      .catch(() => null),
  ]);

  const token = (
    process.env.TELEGRAM_BOT_TOKEN ||
    settings?.telegramBotToken ||
    ""
  ).trim();

  if (!token) {
    console.warn("[TELEGRAM WEBHOOK] Bot token is not configured");
    return;
  }

  // Удалённые получатели физически отсутствуют в выборке, отключённые
  // отсечены фильтром { active: true } — отдельно ничего фильтровать
  // не нужно.
  if (recipients.length === 0) {
    return;
  }

  const formatted = formatIncomingMessage(input);

  await Promise.allSettled(
    recipients.map(async (recipient) => {
      const chatId = recipient.chatId.trim();
      if (!chatId) {
        return;
      }

      try {
        await sendMessage(token, chatId, formatted);
        await logAttempt({
          recipientId: recipient.id,
          chatId,
          status: "sent",
          errorMessage: "",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : String(err);
        await logAttempt({
          recipientId: recipient.id,
          chatId,
          status: "failed",
          errorMessage,
        });
      }
    }),
  );
}

async function logAttempt(input: {
  recipientId: number;
  chatId: string;
  status: "sent" | "failed";
  errorMessage: string;
}) {
  try {
    await prisma.telegramNotificationLog.create({
      data: {
        leadId: null,
        recipientId: input.recipientId,
        chatId: input.chatId,
        status: input.status,
        errorMessage: input.errorMessage,
      },
    });
  } catch (err) {
    // Лог-таблица не должна валить webhook. Ошибку фиксируем в console,
    // чтобы операторская команда могла отследить проблему вручную.
    console.error("[TELEGRAM WEBHOOK] log attempt failed", err);
  }
}

function formatIncomingMessage(input: {
  userTelegramId: string;
  username: string;
  firstName: string;
  text: string;
}): string {
  const fromParts: string[] = [];
  if (input.firstName) fromParts.push(escapeHtml(input.firstName));
  if (input.username) fromParts.push(`@${escapeHtml(input.username)}`);
  const fromLine = fromParts.length > 0 ? fromParts.join(" / ") : "—";

  return [
    "<b>Новое сообщение в Telegram-боте</b>",
    `От: ${fromLine}`,
    `Telegram ID: <code>${escapeHtml(input.userTelegramId || "—")}</code>`,
    `Текст: ${escapeHtml(input.text)}`,
  ].join("\n");
}

function formatManagerReply(input: {
  username: string;
  firstName: string;
  text: string;
}): string {
  const managerParts: string[] = [];
  if (input.firstName) managerParts.push(escapeHtml(input.firstName));
  if (input.username) managerParts.push(`@${escapeHtml(input.username)}`);
  const managerLine = managerParts.length > 0 ? managerParts.join(" / ") : "менеджер";

  return [
    "<b>Ответ менеджера КухниBY</b>",
    `От: ${managerLine}`,
    "",
    escapeHtml(input.text),
  ].join("\n");
}

function extractReplyTargetTelegramId(
  replyToMessage: TelegramMessagePayload["reply_to_message"],
): string {
  const source = `${replyToMessage?.text ?? ""}\n${replyToMessage?.caption ?? ""}`;
  const match = source.match(/Telegram ID:\s*(?:<code>)?(-?\d+)(?:<\/code>)?/i);
  return match?.[1] ?? "";
}

function stringifyId(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
