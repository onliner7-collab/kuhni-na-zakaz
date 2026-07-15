import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { TELEGRAM_LINK_TTL_MS } from "@/lib/leads/constants";

export function hashTelegramLinkToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
export async function createTelegramLeadLink(leadId: number): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  const tokenHash = hashTelegramLinkToken(token);

  await prisma.leadTelegramLinkToken.create({
    data: {
      leadId,
      tokenHash,
      expiresAt: new Date(Date.now() + TELEGRAM_LINK_TTL_MS),
    },
  });

  const username = (process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "kuhniminsk_bot")
    .trim()
    .replace(/^@/, "");
  return `https://t.me/${encodeURIComponent(username)}?start=${token}`;
}
