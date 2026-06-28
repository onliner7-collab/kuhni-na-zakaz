import Link from "@/components/navigation/Link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Материалы для кухонь — Админ" };

export default async function AdminMaterialsPage() {
  await requireAdmin();
  const materials = await prisma.materialPage.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });

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
          <h1 className="text-2xl font-bold text-gray-900">Материалы для кухонь</h1>
          <p className="text-gray-500 text-sm mt-1">{materials.length} материалов в базе</p>
        </div>
        <Link href="/admin/materials/new"
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          + Добавить материал
        </Link>
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-600">Материал</th>
              <th className="text-left p-4 font-semibold text-gray-600">Slug</th>
              <th className="text-left p-4 font-semibold text-gray-600">Бюджет</th>
              <th className="text-left p-4 font-semibold text-gray-600">Цена от</th>
              <th className="text-left p-4 font-semibold text-gray-600">Стили</th>
              <th className="text-left p-4 font-semibold text-gray-600">Статус</th>
              <th className="text-right p-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{m.title}</div>
                  {m.headline && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{m.headline}</div>}
                </td>
                <td className="p-4 text-gray-500 font-mono text-xs">{m.slug}</td>
                <td className="p-4">
                  {m.budgetLevel && (
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${budgetColor[m.budgetLevel] || "bg-gray-100 text-gray-600"}`}>
                      {m.budgetLevel}
                    </span>
                  )}
                </td>
                <td className="p-4 text-gray-700">
                  {m.priceFrom > 0 ? `${m.priceFrom.toLocaleString("ru")} BYN` : "—"}
                </td>
                <td className="p-4 text-gray-500 text-xs">
                  {m.relatedStyles.length > 0 ? m.relatedStyles.join(", ") : "—"}
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${m.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {m.published ? "Опубликован" : "Черновик"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/materials/${m.slug}`} target="_blank"
                      className="text-xs text-gray-400 hover:text-primary transition-colors">Просмотр</Link>
                    <Link href={`/admin/materials/${m.id}`}
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
        {materials.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">Материалов пока нет</p>
            <Link href="/admin/materials/new" className="text-primary hover:underline text-sm">Добавить первый материал</Link>
          </div>
        )}
      </div>
    </div>
  );
}
