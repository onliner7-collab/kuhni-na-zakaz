// Explicit maintenance operation: edit existing messages only, never send replacements.
import { prisma } from "../lib/db";
import { formatLeadCard } from "../lib/leads/telegram-cards";
import { editTelegramText } from "../lib/telegram-api";

async function main() {
  const cards = await prisma.leadTelegramCard.findMany({ include: { lead: { include: { assignedManager: true } } }, orderBy: { id: "asc" } });
  if (!process.argv.includes("--apply")) { console.log(JSON.stringify({ existingCards: cards.length, leads: new Set(cards.map(card => card.leadId)).size, mode: "preview" })); return; }
  const pending = await prisma.telegramOutbox.findMany({ where: { status: "pending", kind: "lead_card" }, include: { lead: { include: { assignedManager: true } } } });
  for (const job of pending) {
    if (!job.lead || !job.payload || typeof job.payload !== "object" || Array.isArray(job.payload)) continue;
    await prisma.telegramOutbox.updateMany({ where: { id: job.id, status: "pending" }, data: { payload: { ...job.payload, text: formatLeadCard(job.lead) } } });
  }
  let updated = 0; let unchanged = 0; const failed: { cardId: number; reason: string }[] = [];
  for (const card of cards) {
    try { await editTelegramText({ chatId: card.chatId, messageId: card.telegramMessageId, text: formatLeadCard(card.lead), replyMarkup: { inline_keyboard: [] } }); updated++; }
    catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      if (reason.includes("сообщение не изменилось")) unchanged++;
      else failed.push({ cardId: card.id, reason: reason.slice(0, 180) });
    }
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  console.log(JSON.stringify({ updated, unchanged, failed }));
}
main().catch(() => { console.error("Не удалось обновить ссылки заявок"); process.exitCode = 1; }).finally(() => prisma.$disconnect());
