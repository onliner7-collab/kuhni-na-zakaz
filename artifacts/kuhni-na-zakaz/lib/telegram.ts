import { prisma } from "@/lib/db";

export interface LeadData {
  id: number;
  name: string;
  phone: string;
  city: string;
  comment: string;
  source: string;
  formType: string;
  answers: Record<string, unknown>;
  createdAt: Date;
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
  const formLabel = FORM_TYPE_LABELS[lead.formType] ?? lead.formType;
  const date = new Date(lead.createdAt).toLocaleString("ru-RU", {
    timeZone: "Europe/Minsk",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  let text = `🆕 <b>Новая заявка #${lead.id}</b>\n`;
  text += `📋 Форма: ${formLabel}\n`;
  text += `📅 Время: ${date}\n`;
  text += `\n`;
  text += `👤 <b>Имя:</b> ${escapeHtml(lead.name)}\n`;
  text += `📞 <b>Телефон:</b> ${escapeHtml(lead.phone)}\n`;
  if (lead.city) text += `📍 <b>Город:</b> ${escapeHtml(lead.city)}\n`;
  if (lead.comment) text += `💬 <b>Комментарий:</b> ${escapeHtml(lead.comment)}\n`;

  const answers = lead.answers as Record<string, unknown>;
  const answerKeys = Object.keys(answers);
  if (answerKeys.length > 0) {
    text += `\n📝 <b>Ответы на вопросы:</b>\n`;
    for (const key of answerKeys) {
      const val = answers[key];
      text += `  • ${escapeHtml(key)}: ${escapeHtml(String(val))}\n`;
    }
  }

  text += `\n🔗 Источник: ${escapeHtml(lead.source)}`;
  return text;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendLeadNotifications(lead: LeadData): Promise<void> {
  const [settings, recipients] = await Promise.all([
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.telegramRecipient.findMany({ where: { active: true } }).catch(() => []),
  ]);

  if (!settings?.telegramBotToken) {
    console.warn("[TELEGRAM] Bot token not configured in Settings");
    return;
  }

  if (recipients.length === 0) {
    console.warn("[TELEGRAM] No active recipients configured");
    return;
  }

  const token = settings.telegramBotToken;
  const text = buildMessage(lead);

  const results = await Promise.allSettled(
    recipients.map((r) => sendMessage(token, r.chatId, text))
  );

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`[TELEGRAM] Failed to send to recipient #${recipients[i].id} (${recipients[i].chatId}):`, result.reason);
    }
  });
}

async function sendMessage(botToken: string, chatId: string, text: string): Promise<void> {
  const token = botToken.trim();
  const recipient = chatId.trim();
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: recipient, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(formatTelegramError(res.status, body));
  }
}

export async function testTelegramMessage(botToken: string, chatId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendMessage(botToken, chatId, `✅ <b>КухниBY</b> — тест уведомлений\n\nЭтот получатель будет получать уведомления о новых заявках с сайта.`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function formatTelegramError(status: number, body: string) {
  const description = getTelegramDescription(body).toLowerCase();

  if (status === 401 || description.includes("unauthorized")) {
    return "Неверный токен Telegram-бота. Проверьте, что токен полностью скопирован из @BotFather и сохранен без пробелов.";
  }

  if (status === 400 && description.includes("chat not found")) {
    return "Chat ID не найден. Сначала напишите этому боту любое сообщение в Telegram, затем проверьте правильный Chat ID.";
  }

  if (status === 400 && description.includes("can't parse")) {
    return "Telegram не смог разобрать текст сообщения. Проверьте формат тестового сообщения или HTML-разметку.";
  }

  if (status === 403 && description.includes("bot was blocked")) {
    return "Пользователь заблокировал бота. Разблокируйте бота в Telegram и отправьте ему /start.";
  }

  if (status === 404) {
    return "Telegram API не нашел такого бота. Обычно это значит, что токен введен неверно.";
  }

  return `Telegram API error ${status}: ${body}`;
}

function getTelegramDescription(body: string) {
  try {
    const parsed = JSON.parse(body) as { description?: unknown };
    return typeof parsed.description === "string" ? parsed.description : body;
  } catch {
    return body;
  }
}
