import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

interface P { params: Promise<{ id: string }> }

export default async function VisualProjectDetailPage({ params }: P) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const project = await prisma.visualProject.findUnique({
    where: { id: parseInt(id) },
    include: { lead: { select: { id: true, name: true, phone: true, email: true } } },
  });
  if (!project) notFound();

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/configurator-visual/projects" className="text-gray-500 hover:text-gray-700">← Назад</Link>
        <h1 className="text-2xl font-bold">Проект #{project.id}: {project.name ?? "Без названия"}</h1>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Клиент</h2>
          {project.lead ? (
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Имя:</span> {project.lead.name ?? "—"}</p>
              <p><span className="text-gray-500">Телефон:</span> {project.lead.phone}</p>
              {project.lead.email && <p><span className="text-gray-500">Email:</span> {project.lead.email}</p>}
              <Link href={`/admin/leads/${project.lead.id}`} className="text-blue-600 hover:underline text-xs block mt-2">Открыть заявку</Link>
            </div>
          ) : <p className="text-gray-400 text-sm">Нет привязанного клиента</p>}
        </div>
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Информация</h2>
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-500">Шаблон:</span> {project.templateSlug ?? "—"}</p>
            <p><span className="text-gray-500">Создан:</span> {new Date(project.createdAt).toLocaleString("ru-RU")}</p>
            <p><span className="text-gray-500">Обновлён:</span> {new Date(project.updatedAt).toLocaleString("ru-RU")}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-3">Конфигурация комнаты</h2>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">{JSON.stringify(project.roomConfig, null, 2)}</pre>
      </div>
      <div className="bg-white border rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-3">Размещение модулей</h2>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">{JSON.stringify(project.modulePlacement, null, 2)}</pre>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Материалы</h2>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">{JSON.stringify(project.materialsConfig, null, 2)}</pre>
      </div>
    </div>
  );
}
