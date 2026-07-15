import { after, NextRequest, NextResponse } from "next/server";
import { handleTelegramUpdate, type TelegramUpdate } from "@/lib/leads/telegram-bot";
import { processTelegramOutbox } from "@/lib/leads/telegram-outbox";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const forbidden = verifyWebhookSecret(req);
  if (forbidden) return forbidden;

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    await handleTelegramUpdate(update);
    after(() => processTelegramOutbox(20));
  } catch (error) {
    console.error("[TELEGRAM WEBHOOK]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function verifyWebhookSecret(req: NextRequest): NextResponse | null {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || "";
  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      console.error("[TELEGRAM WEBHOOK] TELEGRAM_WEBHOOK_SECRET is required in production");
      return NextResponse.json({ ok: false, error: "Webhook is not configured" }, { status: 503 });
    }
    return null;
  }

  const actual = req.headers.get("x-telegram-bot-api-secret-token")?.trim() || "";
  if (actual !== expected) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}
