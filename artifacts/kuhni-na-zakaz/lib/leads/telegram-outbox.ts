import { prisma } from "@/lib/db";
import {
  editTelegramText,
  sendTelegramText,
  type TelegramInlineKeyboard,
} from "@/lib/telegram-api";
import type { TelegramOutboxPayload } from "@/lib/leads/telegram-cards";

const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000, 3 * 60 * 60_000];
const MAX_ATTEMPTS = 8;

export async function processTelegramOutbox(limit = 20): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  await prisma.telegramOutbox.updateMany({
    where: {
      status: "processing",
      updatedAt: { lt: new Date(Date.now() - 10 * 60_000) },
    },
    data: { status: "pending", nextAttemptAt: new Date() },
  });

  const candidates = await prisma.telegramOutbox.findMany({
    where: { status: "pending", nextAttemptAt: { lte: new Date() } },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  for (const candidate of candidates) {
    const claimed = await prisma.telegramOutbox.updateMany({
      where: { id: candidate.id, status: "pending" },
      data: { status: "processing", attemptCount: { increment: 1 } },
    });
    if (claimed.count !== 1) continue;

    try {
      await deliverOutboxItem(candidate);
      await prisma.telegramOutbox.update({
        where: { id: candidate.id },
        data: { status: "sent", sentAt: new Date(), lastError: "" },
      });
      await logAttempt(candidate, "sent", "");
      sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 1000) : String(error).slice(0, 1000);
      const attempt = candidate.attemptCount + 1;
      const isFinal = attempt >= MAX_ATTEMPTS;
      const delay = RETRY_DELAYS_MS[Math.min(attempt - 1, RETRY_DELAYS_MS.length - 1)];
      await prisma.telegramOutbox.update({
        where: { id: candidate.id },
        data: {
          status: isFinal ? "failed" : "pending",
          lastError: message,
          nextAttemptAt: new Date(Date.now() + delay),
        },
      });
      await logAttempt(candidate, "failed", message);
      failed += 1;
    }
  }

  return { sent, failed };
}

async function deliverOutboxItem(candidate: {
  id: number;
  leadId: number | null;
  recipientId: number | null;
  chatId: string;
  payload: unknown;
}) {
  const payload = parsePayload(candidate.payload);
  if (payload.action === "send_text") {
    await sendTelegramText({ chatId: candidate.chatId, text: payload.text, replyMarkup: payload.replyMarkup });
    return;
  }

  if (!candidate.leadId || !candidate.recipientId) throw new Error("Lead card outbox item is incomplete");
  const existing = await prisma.leadTelegramCard.findUnique({
    where: { leadId_recipientId: { leadId: candidate.leadId, recipientId: candidate.recipientId } },
  });

  if (existing) {
    try {
      await editTelegramText({
        chatId: existing.chatId,
        messageId: existing.telegramMessageId,
        text: payload.text,
        replyMarkup: payload.removeReplyMarkup ? { inline_keyboard: [] } : payload.replyMarkup,
      });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("сообщение не изменилось")) return;
      if (!message.toLowerCase().includes("message to edit not found")) throw error;
    }
  }

  const messageId = await sendTelegramText({
    chatId: candidate.chatId,
    text: payload.text,
    replyMarkup: payload.replyMarkup,
  });
  await prisma.leadTelegramCard.upsert({
    where: { leadId_recipientId: { leadId: candidate.leadId, recipientId: candidate.recipientId } },
    create: {
      leadId: candidate.leadId,
      recipientId: candidate.recipientId,
      chatId: candidate.chatId,
      telegramMessageId: String(messageId),
    },
    update: { chatId: candidate.chatId, telegramMessageId: String(messageId) },
  });
}

function parsePayload(value: unknown): TelegramOutboxPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid Telegram outbox payload");
  const payload = value as Record<string, unknown>;
  if ((payload.action !== "send_text" && payload.action !== "upsert_card") || typeof payload.text !== "string") {
    throw new Error("Invalid Telegram outbox payload");
  }
  return {
    action: payload.action,
    text: payload.text,
    ...(payload.replyMarkup && typeof payload.replyMarkup === "object"
      ? { replyMarkup: payload.replyMarkup as TelegramInlineKeyboard }
      : {}),
    ...(payload.removeReplyMarkup === true ? { removeReplyMarkup: true } : {}),
  };
}

async function logAttempt(
  item: { leadId: number | null; recipientId: number | null; chatId: string },
  status: string,
  errorMessage: string,
) {
  await prisma.telegramNotificationLog.create({
    data: {
      leadId: item.leadId,
      recipientId: item.recipientId,
      chatId: item.chatId,
      status,
      errorMessage,
    },
  }).catch(() => undefined);
}
