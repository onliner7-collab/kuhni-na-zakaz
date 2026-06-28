import Link from "@/components/navigation/Link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function VisualProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const projects = await prisma.visualProject
    .findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { lead: { select: { id: true, name: true, phone: true } } },
    })
    .catch(() => []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Проекты пользователей</h1>
          <p className="mt-1 text-sm text-gray-500">
            Сохранённые конфигурации кухонь
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <p className="mb-3 text-4xl">Проектов пока нет</p>
          <p>Сохранённые проекты появятся здесь после первых заявок.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Название</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Клиент</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Статус</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Обновлён</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{project.id}</td>
                  <td className="px-4 py-3 font-medium">
                    {project.name || "Без названия"}
                  </td>
                  <td className="px-4 py-3">
                    {project.lead ? (
                      <Link
                        href={`/admin/leads/${project.lead.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {project.lead.name || project.lead.phone}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {project.isDraft ? "Черновик" : "Готов"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/configurator-visual/projects/${project.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Просмотр
                    </Link>
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
