import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Read-only журнал отправок Telegram-уведомлений.
// Доступ только для SUPER_ADMIN — соответствует остальным /telegram-ручкам.
// Лимит 100 совпадает с /admin/activity-log и держит ответ компактным.

const MAX_LOGS = 100;

async function requireSuperAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = await requireSuperAdmin();
  if (denied) return denied;

  const logs = await prisma.telegramNotificationLog.findMany({
    orderBy: { createdAt: "desc" },
    take: MAX_LOGS,
    select: {
      id: true,
      leadId: true,
      recipientId: true,
      chatId: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
  });

  // Между TelegramNotificationLog и TelegramRecipient нет Prisma-relation,
  // поэтому подтягиваем получателей отдельным запросом и мёржим на сервере.
  // Логи по env-получателям (recipientId === null) остаются без relation — это ок.
  const recipientIds = Array.from(
    new Set(
      logs
        .map((log) => log.recipientId)
        .filter((id): id is number => typeof id === "number"),
    ),
  );

  const recipients = recipientIds.length
    ? await prisma.telegramRecipient.findMany({
        where: { id: { in: recipientIds } },
        select: { id: true, label: true, role: true, chatId: true },
      })
    : [];

  const recipientMap = new Map(recipients.map((r) => [r.id, r]));

  const data = logs.map((log) => ({
    id: log.id,
    leadId: log.leadId,
    recipientId: log.recipientId,
    chatId: log.chatId,
    status: log.status,
    errorMessage: log.errorMessage,
    createdAt: log.createdAt,
    recipient: log.recipientId ? recipientMap.get(log.recipientId) ?? null : null,
  }));

  return NextResponse.json({ logs: data });
}
