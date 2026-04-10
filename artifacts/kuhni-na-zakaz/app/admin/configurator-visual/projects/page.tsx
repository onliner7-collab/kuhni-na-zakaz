import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function VisualProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const projects = await prisma.visualProject.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: { lead: { select: { id: true, name: true, phone: true } } },
  }).catch(() => []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Проекты пользователей</h1>
          <p className="text-gray-500 text-sm mt-1">Сохранённые конфигурации кухонь</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>Пока нет сохранённых проектов</p>
          <p className="text-sm mt-1">Проекты появятся здесь, когда пользователи сохранят конфигурации</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Название</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Клиент</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Шаблон</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Обновлён</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.name ?? "Без названия"}</td>
                  <td className="px-4 py-3">
                    {p.lead ? (
                      <Link href={`/admin/leads/${p.lead.id}`} className="text-blue-600 hover:underline">
                        {p.lead.name ?? p.lead.phone}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.templateSlug ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(p.updatedAt).toLocaleDateString("ru-RU")}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/configurator-visual/projects/${p.id}`} className="text-blue-600 hover:underline text-xs">Просмотр</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
