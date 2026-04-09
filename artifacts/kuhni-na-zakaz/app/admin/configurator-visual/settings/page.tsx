import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Настройки конфигуратора" };

export default async function AdminConfiguratorSettingsPage() {
  const settings = await prisma.kitchenConfiguratorSettings
    .findUnique({ where: { id: 1 } })
    .catch(() => null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Настройки конфигуратора</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Глобальные параметры визуального конструктора кухни
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 max-w-xl">
        {settings ? (
          <div className="space-y-4 text-sm">
            <Row label="Конфигуратор включён" value={settings.isEnabled ? "Да" : "Нет"} />
            <Row label="Ширина помещения по умолч." value={`${settings.defaultRoomWidthCm} см`} />
            <Row label="Глубина помещения по умолч." value={`${settings.defaultRoomDepthCm} см`} />
            <Row label="Высота потолка по умолч." value={`${settings.defaultRoomHeightCm} см`} />
            <Row label="Текст шаринга" value={settings.shareTextTemplate} />
            <Row label="Брендинг экспорта" value={settings.exportBrandingText} />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Настройки не инициализированы. Запустите миграцию и seed.
          </p>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          Форма редактирования будет добавлена в следующем этапе.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
