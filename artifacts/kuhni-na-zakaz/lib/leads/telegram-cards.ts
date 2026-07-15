import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  type LeadSourceType,
  type LeadStatus,
} from "@/lib/leads/constants";
import { escapeTelegramHtml, type TelegramInlineKeyboard } from "@/lib/telegram-api";

export interface TelegramOutboxPayload {
  action: "upsert_card" | "send_text";
  text: string;
  replyMarkup?: TelegramInlineKeyboard;
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
        replyMarkup: buildLeadKeyboard(lead, recipient.role),
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
  const statusLabel = LEAD_STATUS_LABELS[lead.status as LeadStatus] || lead.status;
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
    `<b>Статус:</b> ${escapeTelegramHtml(statusLabel)}`,
    `<b>Источник:</b> ${escapeTelegramHtml(sourceLabel)}`,
    `<b>Telegram подключён:</b> ${lead.telegramConnected ? "да" : "нет"}`,
    `<b>Ответ через бота:</b> ${lead.telegramConnected ? "доступен" : "недоступен"}`,
    "",
    `<b>Клиент:</b> ${escapeTelegramHtml(lead.name || "не указано")}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(lead.phone || "не указан")}`,
    `<b>Email:</b> ${escapeTelegramHtml(lead.email || "не указан")}`,
    `<b>Город:</b> ${escapeTelegramHtml(lead.city || "не указан")}`,
  ];

  if (lead.kitchenType) lines.push(`<b>Кухня:</b> ${escapeTelegramHtml(lead.kitchenType)}`);
  if (lead.dimensions) lines.push(`<b>Размеры:</b> ${escapeTelegramHtml(lead.dimensions)}`);
  if (lead.kitchenId) lines.push(`<b>ID кухни:</b> ${escapeTelegramHtml(lead.kitchenId)}`);
  if (lead.imageId) lines.push(`<b>Ракурс:</b> ${escapeTelegramHtml(lead.imageId)}`);
  if (lead.imageUrl) lines.push(`<b>Изображение:</b> <a href="${escapeTelegramHtml(lead.imageUrl)}">открыть ссылку</a>`);
  lines.push("", `<b>Комментарий:</b> ${escapeTelegramHtml(lead.comment || "не указан")}`);
  if (lead.sourcePage) lines.push("", `<b>Страница:</b> ${escapeTelegramHtml(lead.sourcePage)}`);
  lines.push(
    "",
    `<b>Менеджер:</b> ${escapeTelegramHtml(lead.assignedManager?.label || "не назначен")}`,
    `<b>Создана:</b> ${escapeTelegramHtml(date)}`,
  );
  return lines.join("\n");
}

function buildLeadKeyboard(
  lead: NonNullable<LeadCardData>,
  recipientRole: string,
): TelegramInlineKeyboard {
  const id = lead.id;
  const rows: TelegramInlineKeyboard["inline_keyboard"] = [];
  if (!lead.assignedManagerId) rows.push([{ text: "✅ Взять в работу", callback_data: `l:${id}:take` }]);
  if (lead.telegramConnected) rows.push([{ text: "✍️ Ответить", callback_data: `l:${id}:reply` }]);
  if (lead.phone || lead.email) rows.push([{ text: "📞 Контакты клиента", callback_data: `l:${id}:contacts` }]);
  rows.push([
    { text: "🔄 Статус", callback_data: `l:${id}:statuses` },
    { text: "📝 Заметка", callback_data: `l:${id}:note` },
  ]);
  if (recipientRole === "owner") rows.push([{ text: "👤 Назначить менеджера", callback_data: `l:${id}:assign` }]);
  rows.push([{ text: "📋 История", callback_data: `l:${id}:history` }]);
  if (lead.sourcePage.startsWith("https://") || lead.sourcePage.startsWith("http://")) {
    rows.push([{ text: "🔗 Открыть страницу", url: lead.sourcePage }]);
  }
  if (lead.imageUrl.startsWith("https://") || lead.imageUrl.startsWith("http://")) {
    rows.push([{ text: "🖼 Открыть изображение", url: lead.imageUrl }]);
  }
  return { inline_keyboard: rows };
}
