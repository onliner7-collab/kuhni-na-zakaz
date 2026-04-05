import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Журнал активности" };

export default async function ActivityLogPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true } } },
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Журнал активности</h1>
      {logs.length === 0 ? (
        <p className="text-muted-foreground">Действий пока нет</p>
      ) : (
        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Время</th>
                <th className="text-left p-3 font-medium">Пользователь</th>
                <th className="text-left p-3 font-medium">Действие</th>
                <th className="text-left p-3 font-medium">Объект</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground text-xs">{new Date(log.createdAt).toLocaleString("ru")}</td>
                  <td className="p-3">{log.user?.name || "Гость"}</td>
                  <td className="p-3"><Badge variant="secondary">{log.action}</Badge></td>
                  <td className="p-3 text-muted-foreground">{log.entity}{log.entityId ? ` #${log.entityId}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
