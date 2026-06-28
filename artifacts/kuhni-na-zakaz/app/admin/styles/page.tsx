import Link from "@/components/navigation/Link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Стили кухонь — Админ" };

export default async function AdminStylesPage() {
  await requireAdmin();
  const styles = await prisma.stylePage.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });

  const budgetColor: Record<string, string> = {
    "Экономный": "bg-green-100 text-green-800",
    "Средний": "bg-blue-100 text-blue-800",
    "Выше среднего": "bg-orange-100 text-orange-800",
    "Премиум": "bg-purple-100 text-purple-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Стили кухонь</h1>
          <p className="text-gray-500 text-sm mt-1">{styles.length} стилей в базе</p>
        </div>
        <Link href="/admin/styles/new"
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          + Добавить стиль
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-600">Стиль</th>
              <th className="text-left p-4 font-semibold text-gray-600">Slug</th>
              <th className="text-left p-4 font-semibold text-gray-600">Бюджет</th>
              <th className="text-left p-4 font-semibold text-gray-600">Цена от</th>
              <th className="text-left p-4 font-semibold text-gray-600">Материалы</th>
              <th className="text-left p-4 font-semibold text-gray-600">Статус</th>
              <th className="text-right p-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {styles.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{s.title}</div>
                  {s.headline && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{s.headline}</div>}
                </td>
                <td className="p-4 text-gray-500 font-mono text-xs">{s.slug}</td>
                <td className="p-4">
                  {s.budgetLevel && (
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${budgetColor[s.budgetLevel] || "bg-gray-100 text-gray-600"}`}>
                      {s.budgetLevel}
                    </span>
                  )}
                </td>
                <td className="p-4 text-gray-700">
                  {s.priceFrom > 0 ? `${s.priceFrom.toLocaleString("ru")} BYN` : "—"}
                </td>
                <td className="p-4 text-gray-500 text-xs">
                  {s.relatedMaterials.length > 0 ? s.relatedMaterials.join(", ") : "—"}
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.published ? "Опубликован" : "Черновик"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/styles/${s.slug}`} target="_blank"
                      className="text-xs text-gray-400 hover:text-primary transition-colors">Просмотр</Link>
                    <Link href={`/admin/styles/${s.id}`}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
                      Редактировать
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {styles.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">Стилей пока нет</p>
            <Link href="/admin/styles/new" className="text-primary hover:underline text-sm">Добавить первый стиль</Link>
          </div>
        )}
      </div>
    </div>
  );
}
