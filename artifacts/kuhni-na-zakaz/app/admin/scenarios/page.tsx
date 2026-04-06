import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Сценарии выбора кухни — Админ" };

async function togglePublished(id: number, current: boolean) {
  "use server";
  const { prisma: db } = await import("@/lib/db");
  await db.scenarioPage.update({ where: { id }, data: { published: !current } });
}

export default async function AdminScenariosPage() {
  await requireAdmin();
  const scenarios = await prisma.scenarioPage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Сценарии выбора кухни</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Публичные страницы для разных типов покупателей — {scenarios.length} сценариев,{" "}
            {scenarios.filter((s) => s.published).length} опубликовано
          </p>
        </div>
        <Link
          href="/admin/scenarios/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый сценарий
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {scenarios.length === 0 ? (
          <div className="p-14 text-center text-muted-foreground">
            <p className="text-lg font-medium">Сценариев пока нет</p>
            <p className="text-sm mt-1">Создайте первый сценарий выбора кухни</p>
            <Link href="/admin/scenarios/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold">
              <Plus className="w-4 h-4" />Создать
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold text-muted-foreground w-8">#</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Сценарий</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">URL</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Стили / Материалы</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Кейсы</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Статус</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scenarios.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-muted-foreground">{s.order || s.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{s.title}</p>
                        {s.badge && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s.badge}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <a
                      href={`/scenarios/${s.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs hover:underline font-mono"
                    >
                      /scenarios/{s.slug}
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {s.relatedStyles.slice(0, 2).map((sl) => (
                        <span key={sl} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">{sl}</span>
                      ))}
                      {s.relatedMaterials.slice(0, 2).map((m) => (
                        <span key={m} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{m}</span>
                      ))}
                      {(s.relatedStyles.length + s.relatedMaterials.length) > 4 && (
                        <span className="text-xs text-muted-foreground">+ещё</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    {s.relatedCaseSlugs.length > 0 ? `${s.relatedCaseSlugs.length} кейс${s.relatedCaseSlugs.length > 1 ? "а" : ""}` : "—"}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      s.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {s.published ? <><Eye className="w-3 h-3" />Опубликован</> : <><EyeOff className="w-3 h-3" />Скрыт</>}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/scenarios/${s.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 text-primary text-xs font-medium transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <div className="bg-muted/30 rounded-xl border border-border p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Как это работает:</strong>{" "}
          Каждый сценарий — это отдельная публичная страница по адресу <code className="bg-white px-1 rounded text-xs">/scenarios/[slug]</code>.
          Страницы оптимизированы под разные поисковые запросы и содержат уникальный контент для каждого типа покупателя.
        </p>
      </div>
    </div>
  );
}
