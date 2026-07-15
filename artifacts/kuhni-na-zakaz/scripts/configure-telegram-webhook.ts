import { getTelegramBotToken, callTelegramApi } from "../lib/telegram-api";

async function main() {
  const token = getTelegramBotToken();
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || "";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kuhni.minsk.by").replace(/\/$/, "");
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is required");
  if (!secret) throw new Error("TELEGRAM_WEBHOOK_SECRET is required");

  await callTelegramApi("setWebhook", {
    url: `${siteUrl}/kapi/telegram/webhook`,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  }, token);
  console.log("[telegram-webhook] configured");
}

main().catch((error) => {
  console.error("[telegram-webhook] failed", error);
  process.exitCode = 1;
});
