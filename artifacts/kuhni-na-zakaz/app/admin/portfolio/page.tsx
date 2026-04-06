import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Портфолио — Админ" };

export default async function AdminPortfolioPage() {
  const session = await requireAdmin();
  const cases = await prisma.portfolioCase.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Портфолио</h1>
          <p className="text-muted-foreground mt-1">Управление выполненными проектами</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          data-testid="btn-new-case"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый проект
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {cases.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">Проектов пока нет</p>
            <p className="text-sm mt-1">Добавьте первый выполненный проект</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Название</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">Город</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden md:table-cell">Стиль</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Статус</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground hidden sm:table-cell">Дата</th>
                  <th className="text-right px-4 py-3 font-medium text-foreground">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground line-clamp-1">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.area} м² · {c.days} дней</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.city}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.style || "—"}</td>
                    <td className="px-4 py-3">
                      {c.published ? (
                        <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs w-fit">
                          <Eye className="w-3 h-3" /> Опубликовано
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs w-fit">
                          <EyeOff className="w-3 h-3" /> Скрыто
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(c.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portfolio/${c.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                          title="На сайте"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/portfolio/${c.id}`}
                          data-testid={`btn-edit-case-${c.id}`}
                          className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                          title="Редактировать"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
