export interface TelegramInlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}
export interface TelegramInlineKeyboard {
  inline_keyboard: TelegramInlineButton[][];
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

interface TelegramMessageResult {
  message_id: number;
}

const TELEGRAM_TIMEOUT_MS = 7000;

export function getTelegramBotToken(): string {
  return (process.env.TELEGRAM_BOT_TOKEN || "").trim();
}

export async function callTelegramApi<T>(
  method: string,
  payload: Record<string, unknown>,
  token = getTelegramBotToken(),
): Promise<T> {
  if (!token) throw new Error("Telegram bot token is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });
  const body = (await response.json().catch(() => ({}))) as TelegramApiResponse<T>;

  if (!response.ok || !body.ok || body.result === undefined) {
    throw new Error(formatTelegramApiError(response.status, body.description || ""));
  }

  return body.result;
}

export async function sendTelegramText(input: {
  chatId: string;
  text: string;
  replyMarkup?: TelegramInlineKeyboard;
}): Promise<number> {
  const result = await callTelegramApi<TelegramMessageResult>("sendMessage", {
    chat_id: input.chatId,
    text: input.text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(input.replyMarkup ? { reply_markup: input.replyMarkup } : {}),
  });
  return result.message_id;
}

export async function editTelegramText(input: {
  chatId: string;
  messageId: string;
  text: string;
  replyMarkup?: TelegramInlineKeyboard;
}): Promise<void> {
  await callTelegramApi("editMessageText", {
    chat_id: input.chatId,
    message_id: Number(input.messageId),
    text: input.text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(input.replyMarkup ? { reply_markup: input.replyMarkup } : {}),
  });
}

export async function answerTelegramCallback(
  callbackQueryId: string,
  text = "",
): Promise<void> {
  await callTelegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text } : {}),
  });
}

function formatTelegramApiError(status: number, description: string): string {
  const normalized = description.toLowerCase();
  if (status === 401 || normalized.includes("unauthorized")) return "Telegram API: неверный токен";
  if (normalized.includes("chat not found")) return "Telegram API: чат не найден";
  if (normalized.includes("bot was blocked")) return "Telegram API: бот заблокирован пользователем";
  if (normalized.includes("message is not modified")) return "Telegram API: сообщение не изменилось";
  return `Telegram API ${status}: ${description || "неизвестная ошибка"}`;
}

export function escapeTelegramHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
