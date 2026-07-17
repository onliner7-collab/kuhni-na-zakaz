import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  LEAD_SOURCE_LABELS,
  type LeadSourceType,
} from "@/lib/leads/constants";
import { escapeTelegramHtml, type TelegramInlineKeyboard } from "@/lib/telegram-api";

export interface TelegramOutboxPayload {
  action: "upsert_card" | "send_text";
  text: string;
  replyMarkup?: TelegramInlineKeyboard;
  removeReplyMarkup?: boolean;
}

export async function enqueueLeadCardSync(leadId: number): Promise<void> {
  const [lead, recipients] = await Promise.all([
    prisma.lead.findUnique({
      where: { id: leadId },
      include: { assignedManager: true },
    }),
    prisma.telegramRecipient.findMany({ where: { active: true } }),
  ]);
  if (!lead || recipients.length === 0) return;

  await prisma.telegramOutbox.createMany({
    data: recipients.map((recipient) => ({
      leadId: lead.id,
      recipientId: recipient.id,
      chatId: recipient.chatId,
      kind: "lead_card",
      payload: {
        action: "upsert_card",
        text: formatLeadCard(lead),
        removeReplyMarkup: true,
      } as unknown as Prisma.InputJsonValue,
    })),
  });
}

export async function enqueueTelegramText(input: {
  chatId: string;
  text: string;
  leadId?: number;
  recipientId?: number;
  replyMarkup?: TelegramInlineKeyboard;
  kind?: string;
}): Promise<void> {
  await prisma.telegramOutbox.create({
    data: {
      chatId: input.chatId,
      leadId: input.leadId,
      recipientId: input.recipientId,
      kind: input.kind || "text",
      payload: {
        action: "send_text",
        text: input.text,
        ...(input.replyMarkup ? { replyMarkup: input.replyMarkup } : {}),
      } as unknown as Prisma.InputJsonValue,
    },
  });
}

type LeadCardData = Awaited<ReturnType<typeof getLeadCardShape>>;

async function getLeadCardShape() {
  return prisma.lead.findFirst({ include: { assignedManager: true } });
}

export function formatLeadCard(lead: NonNullable<LeadCardData>): string {
  const sourceLabel =
    LEAD_SOURCE_LABELS[lead.sourceType as LeadSourceType] || lead.sourceType || "Форма сайта";
  const date = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Minsk",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(lead.createdAt);

  const lines = [
    `<b>🟢 ЗАЯВКА №${lead.publicNumber}</b>`,
    "",
    `<b>Источник:</b> ${escapeTelegramHtml(sourceLabel)}`,
    "",
    `<b>Клиент:</b> ${escapeTelegramHtml(lead.name || "не указано")}`,
    `<b>Телефон:</b> ${formatPhoneContact(lead.phone)}`,
    `<b>Telegram:</b> ${formatTelegramContact(lead)}`,
    `<b>Город:</b> ${escapeTelegramHtml(lead.city || "не указан")}`,
  ];

  if (lead.email) lines.push(`<b>Email:</b> ${escapeTelegramHtml(lead.email)}`);
  if (lead.kitchenType) lines.push(`<b>Кухня:</b> ${escapeTelegramHtml(lead.kitchenType)}`);
  if (lead.dimensions) lines.push(`<b>Размеры:</b> ${escapeTelegramHtml(lead.dimensions)}`);
  lines.push("", `<b>Комментарий:</b> ${escapeTelegramHtml(lead.comment || "не указан")}`);
  const sourcePageUrl = normalizePublicUrl(lead.sourcePage);
  const imageUrl = normalizePublicUrl(lead.imageUrl);
  if (sourcePageUrl || imageUrl) lines.push("");
  if (sourcePageUrl) lines.push(`<b>Страница:</b> <a href="${escapeTelegramHtml(sourcePageUrl)}">открыть ссылку</a>`);
  if (imageUrl) lines.push(`<b>Выбранная кухня:</b> <a href="${escapeTelegramHtml(imageUrl)}">открыть изображение</a>`);
  lines.push("", `<b>Создана:</b> ${escapeTelegramHtml(date)}`);
  return lines.join("\n");
}

export function formatTelegramContact(input: {
  telegramConnected: boolean;
  telegramUsername?: string | null;
  telegramUserId?: string | null;
}): string {
  if (!input.telegramConnected) return "не подключён";
  const username = String(input.telegramUsername || "").replace(/^@/, "").trim();
  if (/^[A-Za-z0-9_]{5,32}$/.test(username)) {
    return `<a href="https://t.me/${username}">@${escapeTelegramHtml(username)} — написать в ЛС</a>`;
  }
  const userId = String(input.telegramUserId || "").trim();
  if (/^\d{5,20}$/.test(userId)) {
    return `<a href="tg://user?id=${userId}">написать клиенту в ЛС</a>`;
  }
  return "подключён, но прямая ссылка недоступна";
}

export function formatPhoneContact(phone: string): string {
  const label = escapeTelegramHtml(phone || "не указан");
  const normalized = String(phone || "").replace(/[^+\d]/g, "");
  if (!/^\+\d{7,15}$/.test(normalized)) return label;
  return `<a href="tel:${normalized}">${label}</a>`;
}

function normalizePublicUrl(value: string): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw, "https://kuhni.minsk.by");
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    if (url.hostname !== "kuhni.minsk.by" && url.hostname !== "www.kuhni.minsk.by") return "";
    return url.href;
  } catch {
    return "";
  }
}
