import { prisma } from "@/lib/db";

export interface LeadData {
  id: number;
  name: string;
  phone: string;
  city: string;
  comment: string;
  source: string;
  formType: string;
  answers: unknown;
  createdAt: Date;
}

interface TelegramRecipientConfig {
  id: string;
  chatId: string;
  recipientId: number;
}

const FORM_TYPE_LABELS: Record<string, string> = {
  contact: "Обратная связь",
  measurement: "Замер",
  calculator: "Калькулятор",
  catalog: "Каталог",
  portfolio: "Портфолио",
  price: "Цены",
  quiz: "Квиз",
  popup: "Поп-ап форма",
  header: "Шапка сайта",
  footer: "Подвал сайта",
};

function buildMessage(lead: LeadData): string {
  const answers = normalizeAnswers(lead.answers);
  const formLabel = FORM_TYPE_LABELS[lead.formType] ?? lead.formType;
  const date = new Date(lead.createdAt).toLocaleString("ru-RU", {
    timeZone: "Europe/Minsk",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const utm = normalizeAnswers(answers.utm);

  let text = `<b>Новая заявка #${lead.id}</b>\n`;
  text += `Форма: ${escapeHtml(formLabel)}\n`;
  text += `Дата/время: ${escapeHtml(date)}\n\n`;
  text += `<b>Имя:</b> ${escapeHtml(lead.name)}\n`;
  text += `<b>Телефон:</b> ${escapeHtml(lead.phone)}\n`;
  text += `<b>Город:</b> ${escapeHtml(lead.city || "не указан")}\n`;
  text += `<b>Страница:</b> ${escapeHtml(String(answers.sourcePage || "не указана"))}\n`;
  if (answers.kitchenType) text += `<b>Тип кухни:</b> ${escapeHtml(String(answers.kitchenType))}\n`;
  text += `<b>Комментарий:</b> ${escapeHtml(lead.comment || "не указан")}\n`;
  text += `<b>Источник:</b> ${escapeHtml(lead.source)}\n`;

  const utmText = formatUtm(utm);
  if (utmText) {
    text += `\n<b>UTM:</b>\n${utmText}`;
  }

  if (answers.referrer) {
    text += `\n<b>Referrer:</b> ${escapeHtml(String(answers.referrer))}`;
  }

  return text;
}

function formatUtm(utm: Record<string, unknown>) {
  const entries = [
    ["source", utm.source],
    ["medium", utm.medium],
    ["campaign", utm.campaign],
    ["term", utm.term],
    ["content", utm.content],
  ].filter(([, value]) => typeof value === "string" && value.length > 0);

  if (entries.length === 0) {
    return "";
  }

  return entries.map(([key, value]) => `${escapeHtml(String(key))}: ${escapeHtml(String(value))}`).join("\n");
}

function normalizeAnswers(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendLeadNotifications(lead: LeadData): Promise<void> {
  const [settings, dbRecipients] = await Promise.all([
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.telegramRecipient.findMany({ where: { active: true } }).catch(() => []),
  ]);

  const token = (process.env.TELEGRAM_BOT_TOKEN || settings?.telegramBotToken || "").trim();
  const recipients: TelegramRecipientConfig[] = dbRecipients
    .map((recipient) => ({
      id: `db:${recipient.id}`,
      chatId: recipient.chatId,
      recipientId: recipient.id,
    }))
    .filter((recipient) => recipient.chatId.trim().length > 0);

  if (!token) {
    console.warn("[TELEGRAM] Bot token is not configured");
    return;
  }

  if (recipients.length === 0) {
    console.warn("[TELEGRAM] No active recipients configured");
    return;
  }

  const text = buildMessage(lead);
  const results = await Promise.allSettled(
    recipients.map((recipient) => sendMessage(token, recipient.chatId, text)),
  );

  // Логируем каждую попытку в TelegramNotificationLog, чтобы
  // /admin/notifications/logs показывал реальную картину отправок
  // (вебхук уже делает то же самое). Запись через .catch — БД не должна
  // валить пользовательский путь POST /kapi/leads.
  await Promise.all(
    results.map((result, index) => {
      const recipient = recipients[index];
      const status = result.status === "fulfilled" ? "sent" : "failed";
      const errorMessage =
        result.status === "rejected" ? formatLogError(result.reason) : "";

      if (result.status === "rejected") {
        console.error(
          `[TELEGRAM] Failed to send lead notification to recipient ${recipient.id}:`,
          result.reason,
        );
      }

      return prisma.telegramNotificationLog
        .create({
          data: {
            leadId: lead.id,
            recipientId: recipient.recipientId,
            chatId: recipient.chatId.trim(),
            status,
            errorMessage,
          },
        })
        .catch((err) => {
          console.error("[TELEGRAM] log lead notification failed", err);
        });
    }),
  );
}

function formatLogError(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message;
  }
  return String(reason);
}

// Низкоуровневая отправка сообщения. Экспортируется, чтобы webhook
// (этап 7) мог пересылать входящие сообщения, переиспользуя тот же
// форматтер ошибок и parse_mode. Поведение и сигнатура для существующих
// вызовов (sendLeadNotifications, testTelegramMessage) не меняются.
export async function sendMessage(botToken: string, chatId: string, text: string): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId.trim(), text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(formatTelegramError(res.status, body));
  }
}

export async function testTelegramMessage(botToken: string, chatId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendMessage(botToken, chatId, `<b>КухниBY</b> — тест уведомлений\n\nЭтот получатель будет получать уведомления о новых заявках с сайта.`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function formatTelegramError(status: number, body: string) {
  const description = getTelegramDescription(body).toLowerCase();

  if (status === 401 || description.includes("unauthorized")) {
    return "Неверный токен Telegram-бота. Проверьте токен из @BotFather.";
  }

  if (status === 400 && description.includes("chat not found")) {
    return "Chat ID не найден. Сначала напишите боту в Telegram, затем проверьте Chat ID.";
  }

  if (status === 400 && description.includes("can't parse")) {
    return "Telegram не смог разобрать HTML-разметку сообщения.";
  }

  if (status === 403 && description.includes("bot was blocked")) {
    return "Пользователь заблокировал Telegram-бота.";
  }

  if (status === 404) {
    return "Telegram API не нашёл такого бота. Обычно это означает неверный токен.";
  }

  return `Telegram API error ${status}`;
}

function getTelegramDescription(body: string) {
  try {
    const parsed = JSON.parse(body) as { description?: unknown };
    return typeof parsed.description === "string" ? parsed.description : body;
  } catch {
    return body;
  }
}
