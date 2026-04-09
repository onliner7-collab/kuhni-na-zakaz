import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Модули кухни" };

const TYPE_LABELS: Record<string, string> = {
  LOWER: "Нижний",
  UPPER: "Верхний",
  TALL: "Пенал",
  CORNER: "Угловой",
  SINK: "Под мойку",
  DRAWER: "С ящиками",
  GLASS_DOOR: "С витриной",
  LIFT_MECHANISM: "С подъёмным мех.",
};

export default async function AdminModulesPage() {
  const modules = await prisma.kitchenModule
    .findMany({ orderBy: [{ moduleType: "asc" }, { sortOrder: "asc" }] })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Модули кухни</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Строительные блоки конфигуратора — нижние, верхние, пеналы, угловые
          </p>
        </div>
        <Link
          href="/admin/configurator-visual/modules/new"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить модуль
        </Link>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 p-12 text-center text-muted-foreground">
          Модули ещё не добавлены. Нажмите «Добавить модуль».
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Тип</th>
                <th className="text-left px-4 py-3 font-medium">Размеры (Ш×В×Г)</th>
                <th className="text-left px-4 py-3 font-medium">Цена</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {TYPE_LABELS[m.moduleType] ?? m.moduleType}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {m.widthCm}×{m.heightCm}×{m.depthCm} см
                  </td>
                  <td className="px-4 py-3">{m.priceBase.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-3">
                    <Badge variant={m.isEnabled ? "default" : "secondary"}>
                      {m.isEnabled ? "Активен" : "Отключён"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/configurator-visual/modules/${m.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      <Edit className="w-3 h-3 mr-1" />Изменить
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
