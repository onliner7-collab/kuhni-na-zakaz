import { processTelegramOutbox } from "../lib/leads/telegram-outbox";
import { prisma } from "../lib/db";

async function main() {
  const result = await processTelegramOutbox(50);
  console.log(`[telegram-outbox] sent=${result.sent} failed=${result.failed}`);
}

main()
  .catch((error) => {
    console.error("[telegram-outbox] fatal", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
