import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "@/components/navigation/Link";
import { ExternalLink, Pencil, FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Страницы — Админ" };

export default async function AdminPagesPage() {
  await requireAdmin();

  const pages = await prisma.staticPage.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> Статические страницы
        </h1>
        <p className="text-muted-foreground mt-1">
          Редактирование инфостраниц сайта: О компании, Доставка, Гарантия и других
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {pages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>Страниц пока нет.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-foreground">Заголовок</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">URL</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Статус</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{page.title}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/{page.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        page.published
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {page.published ? "Опубликована" : "Скрыта"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
                        title="Открыть"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
