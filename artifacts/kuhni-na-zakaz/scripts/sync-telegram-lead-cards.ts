import { prisma } from "../lib/db";
import { enqueueLeadCardSync } from "../lib/leads/telegram-cards";

async function main() {
  const leads = await prisma.lead.findMany({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  for (const lead of leads) {
    await enqueueLeadCardSync(lead.id);
  }

  console.log(`Карточки заявок поставлены в очередь обновления: ${leads.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
