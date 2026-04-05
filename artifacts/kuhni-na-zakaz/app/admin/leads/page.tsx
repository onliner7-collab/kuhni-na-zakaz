import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Заявки" };

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Заявки ({leads.length})</h1>
      {leads.length === 0 ? (
        <div className="card-base p-12 text-center">
          <p className="text-muted-foreground">Заявок пока нет</p>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">#</th>
                <th className="text-left p-3 font-medium">Имя</th>
                <th className="text-left p-3 font-medium">Телефон</th>
                <th className="text-left p-3 font-medium">Город</th>
                <th className="text-left p-3 font-medium">Источник</th>
                <th className="text-left p-3 font-medium">Дата</th>
                <th className="text-left p-3 font-medium">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 text-muted-foreground">{lead.id}</td>
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td className="p-3"><a href={`tel:${lead.phone}`} className="text-primary hover:underline">{lead.phone}</a></td>
                  <td className="p-3 text-muted-foreground">{lead.city || "—"}</td>
                  <td className="p-3"><Badge variant="outline">{lead.source}</Badge></td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(lead.createdAt).toLocaleString("ru")}</td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">{lead.comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
