import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Страницы — Админ" };

const STATIC_PAGES = [
  { title: "Главная", path: "/", editable: false },
  { title: "Каталог кухонь", path: "/catalog", editable: false },
  { title: "Портфолио", path: "/portfolio", editable: false },
  { title: "Блог", path: "/blog", editable: false },
  { title: "Цены", path: "/prices", editable: false },
  { title: "О нас", path: "/about", editable: true },
  { title: "Контакты", path: "/contacts", editable: true },
  { title: "Доставка и установка", path: "/delivery-installation", editable: true },
  { title: "Гарантия", path: "/warranty", editable: true },
  { title: "Политика конфиденциальности", path: "/privacy-policy", editable: false },
  { title: "Условия использования", path: "/terms", editable: false },
  { title: "Обработка персональных данных", path: "/personal-data", editable: false },
];

export default async function AdminPagesPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Страницы сайта</h1>
        <p className="text-muted-foreground mt-1">Обзор всех страниц сайта</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
          <p className="text-sm text-amber-700">
            ℹ️ Редактирование контента страниц через CMS будет доступно в следующей версии. Сейчас используйте текстовый редактор.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-foreground">Название</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">URL</th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {STATIC_PAGES.map((page) => (
              <tr key={page.path} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{page.title}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{page.path}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={page.path}
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
      </div>
    </div>
  );
}
