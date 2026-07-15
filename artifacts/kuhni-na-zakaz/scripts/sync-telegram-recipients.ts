import { prisma } from "../lib/db";

interface RecipientConfig {
  telegramUserId: string;
  label: string;
  role: "owner" | "manager";
}

function readConfig(): RecipientConfig[] {
  const ownerId = process.env.TELEGRAM_OWNER_ID?.trim() || "";
  const managerId = process.env.TELEGRAM_MANAGER_ID?.trim() || "";
  const configs: RecipientConfig[] = [];
  if (ownerId) {
    configs.push({
      telegramUserId: ownerId,
      label: process.env.TELEGRAM_OWNER_NAME?.trim() || "Владелец",
      role: "owner",
    });
  }
  if (managerId) {
    configs.push({
      telegramUserId: managerId,
      label: process.env.TELEGRAM_MANAGER_NAME?.trim() || "Менеджер",
      role: "manager",
    });
  }
  return configs;
}

async function main() {
  const configs = readConfig();
  if (configs.length === 0) {
    console.warn("[telegram-recipients] environment configuration is empty; existing recipients were preserved");
    return;
  }

  for (const config of configs) {
    const recipient = await prisma.telegramRecipient.upsert({
      where: { chatId: config.telegramUserId },
      create: {
        chatId: config.telegramUserId,
        telegramUserId: config.telegramUserId,
        label: config.label,
        role: config.role,
        active: true,
      },
      update: {
        telegramUserId: config.telegramUserId,
        label: config.label,
        role: config.role,
        active: true,
      },
    });
    await prisma.lead.updateMany({
      where: { assignedManagerId: null, assignedTo: config.label },
      data: { assignedManagerId: recipient.id },
    });
  }
  console.log(`[telegram-recipients] synchronized=${configs.length}`);
}

main()
  .catch((error) => {
    console.error("[telegram-recipients] fatal", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
