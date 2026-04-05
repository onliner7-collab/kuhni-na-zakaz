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
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${body}`);
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
