import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { ArrowLeft, History, ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Журнал отправок Telegram",
};

const MAX_LOGS = 100;

type StatusKind = "sent" | "failed" | "unknown";

function classifyStatus(raw: string): StatusKind {
  const normalized = raw.trim().toLowerCase();
  if (normalized === "sent" || normalized === "ok" || normalized === "success") {
    return "sent";
  }
  if (
    normalized === "failed" ||
    normalized === "error" ||
    normalized === "fail"
  ) {
    return "failed";
  }
  return "unknown";
}

function formatDate(value: Date) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TelegramLogsPage() {
  const session = await requireAdmin();

  if (session.role !== "SUPER_ADMIN") {
    return (
      <div className="max-w-xl">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3"
        >
          <ShieldAlert
            className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-semibold text-red-800">Доступ запрещён</p>
            <p className="text-sm text-red-700">
              Журнал отправок Telegram-уведомлений доступен только
              супер-администратору.
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-900 underline underline-offset-2 mt-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Вернуться в панель
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const logs = await prisma.telegramNotificationLog
    .findMany({
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
    })
    .catch(() => []);

  const recipientIds = Array.from(
    new Set(
      logs
        .map((log) => log.recipientId)
        .filter((id): id is number => typeof id === "number"),
    ),
  );

  const recipients = recipientIds.length
    ? await prisma.telegramRecipient
        .findMany({
          where: { id: { in: recipientIds } },
          select: { id: true, label: true, role: true },
        })
        .catch(() => [])
    : [];

  const recipientMap = new Map(recipients.map((r) => [r.id, r]));

  const sentCount = logs.filter(
    (log) => classifyStatus(log.status) === "sent",
  ).length;
  const failedCount = logs.filter(
    (log) => classifyStatus(log.status) === "failed",
  ).length;

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <History
              className="w-5 h-5 text-violet-600"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="font-bold text-2xl">Журнал отправок Telegram</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Последние {MAX_LOGS} попыток отправки уведомлений по заявкам.
              Сортировка — от свежих к старым.
            </p>
          </div>
        </div>
        <Link
          href="/admin/notifications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          К настройкам уведомлений
        </Link>
      </div>

      {logs.length > 0 && (
        <div
          className="flex flex-wrap gap-2 text-xs"
          role="status"
          aria-live="polite"
        >
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            Всего: <strong className="text-foreground">{logs.length}</strong>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            Отправлено: <strong>{sentCount}</strong>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            Ошибок: <strong>{failedCount}</strong>
          </span>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-white p-10 text-center">
          <History
            className="w-8 h-8 text-muted-foreground mx-auto mb-2"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            Уведомлений ещё не было. После первой новой заявки записи появятся
            здесь автоматически.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Журнал последних {MAX_LOGS} попыток отправки Telegram-уведомлений
              </caption>
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 font-medium">
                    Дата
                  </th>
                  <th scope="col" className="text-left px-4 py-3 font-medium">
                    Заявка
                  </th>
                  <th scope="col" className="text-left px-4 py-3 font-medium">
                    Получатель
                  </th>
                  <th scope="col" className="text-left px-4 py-3 font-medium">
                    Chat ID
                  </th>
                  <th scope="col" className="text-left px-4 py-3 font-medium">
                    Статус
                  </th>
                  <th scope="col" className="text-left px-4 py-3 font-medium">
                    Ошибка
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const status = classifyStatus(log.status);
                  const recipient = log.recipientId
                    ? recipientMap.get(log.recipientId) ?? null
                    : null;
                  const recipientName =
                    recipient?.label?.trim() ||
                    (log.recipientId ? `Получатель #${log.recipientId}` : null);

                  return (
                    <tr
                      key={log.id}
                      className="border-t border-border align-top hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        <time dateTime={new Date(log.createdAt).toISOString()}>
                          {formatDate(log.createdAt)}
                        </time>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.leadId ? (
                          <Link
                            href={`/admin/leads?q=${log.leadId}`}
                            className="font-mono text-xs text-violet-700 hover:text-violet-900 underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                            title={`Открыть заявку #${log.leadId}`}
                          >
                            #{log.leadId}
                          </Link>
                        ) : (
                          <span
                            className="text-muted-foreground"
                            title="Отправка без привязки к заявке (например, тест)"
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {recipientName ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{recipientName}</span>
                            {recipient?.role && (
                              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                {recipient.role}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span
                            className="text-muted-foreground"
                            title="Получатель из переменной окружения или удалён"
                          >
                            Внешний / удалён
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">
                        {log.chatId || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {status === "sent" && (
                          <Badge variant="success" aria-label="Статус: отправлено">
                            Отправлено
                          </Badge>
                        )}
                        {status === "failed" && (
                          <Badge
                            variant="destructive"
                            aria-label="Статус: ошибка"
                          >
                            Ошибка
                          </Badge>
                        )}
                        {status === "unknown" && (
                          <Badge
                            variant="secondary"
                            aria-label={`Статус: ${log.status}`}
                          >
                            {log.status || "—"}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 min-w-[220px] max-w-[420px]">
                        {log.errorMessage ? (
                          <details className="group">
                            <summary
                              className="cursor-pointer list-none text-red-700 hover:text-red-900 marker:hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                              title={log.errorMessage}
                            >
                              <span className="block truncate group-open:hidden">
                                {log.errorMessage}
                              </span>
                              <span className="hidden group-open:inline text-xs uppercase tracking-wide text-muted-foreground">
                                Скрыть подробности
                              </span>
                            </summary>
                            <p className="mt-2 whitespace-pre-wrap break-words text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                              {log.errorMessage}
                            </p>
                          </details>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Показываются последние {MAX_LOGS} записей. Журнал заполняется
        автоматически при отправке уведомлений на все Telegram-получатели.
      </p>
    </div>
  );
}
