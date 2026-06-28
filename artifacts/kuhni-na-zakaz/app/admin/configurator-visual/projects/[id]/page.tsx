import Link from "@/components/navigation/Link";
import { notFound, redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface P {
  params: Promise<{ id: string }>;
}

export default async function VisualProjectDetailPage({ params }: P) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const project = await prisma.visualProject.findUnique({
    where: { id: parseInt(id, 10) },
    include: { lead: { select: { id: true, name: true, phone: true } } },
  });

  if (!project) notFound();

  return (
    <div className="max-w-4xl p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/configurator-visual/projects"
          className="text-gray-500 hover:text-gray-700"
        >
          Назад
        </Link>
        <h1 className="text-2xl font-bold">
          Проект #{project.id}: {project.name || "Без названия"}
        </h1>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 font-semibold">Клиент</h2>
          {project.lead ? (
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Имя:</span> {project.lead.name || "—"}
              </p>
              <p>
                <span className="text-gray-500">Телефон:</span> {project.lead.phone}
              </p>
              <Link
                href={`/admin/leads/${project.lead.id}`}
                className="mt-2 block text-xs text-blue-600 hover:underline"
              >
                Открыть заявку
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Нет привязанного клиента</p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 font-semibold">Информация</h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">Session ID:</span> {project.sessionId || "—"}
            </p>
            <p>
              <span className="text-gray-500">Статус:</span>{" "}
              {project.isDraft ? "Черновик" : "Готов"}
            </p>
            <p>
              <span className="text-gray-500">Оценка цены:</span>{" "}
              {project.priceEstimate.toLocaleString("ru-RU")} BYN
            </p>
            <p>
              <span className="text-gray-500">Создан:</span>{" "}
              {new Date(project.createdAt).toLocaleString("ru-RU")}
            </p>
            <p>
              <span className="text-gray-500">Обновлён:</span>{" "}
              {new Date(project.updatedAt).toLocaleString("ru-RU")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Конфигурация комнаты</h2>
        <pre className="max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs">
          {JSON.stringify(project.roomConfig, null, 2)}
        </pre>
      </div>

      <div className="mb-4 rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Размещение модулей</h2>
        <pre className="max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs">
          {JSON.stringify(project.modulePlacement, null, 2)}
        </pre>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Материалы</h2>
        <pre className="max-h-64 overflow-auto rounded bg-gray-50 p-3 text-xs">
          {JSON.stringify(project.materialsConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
}
