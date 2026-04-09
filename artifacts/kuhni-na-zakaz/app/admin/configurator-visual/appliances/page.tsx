import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Встраиваемая техника" };

const TYPE_LABELS: Record<string, string> = {
  oven: "Духовой шкаф",
  hob: "Варочная панель",
  dishwasher: "Посудомойка",
  fridge: "Холодильник",
  microwave: "Микроволновка",
  hood: "Вытяжка",
};

export default async function AdminAppliancesPage() {
  const items = await prisma.kitchenAppliance
    .findMany({ orderBy: [{ applianceType: "asc" }, { sortOrder: "asc" }] })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Встраиваемая техника</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Духовки, варочные панели, посудомойки, холодильники, вытяжки
          </p>
        </div>
        <Link
          href="/admin/configurator-visual/appliances/new"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить технику
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 p-12 text-center text-muted-foreground">
          Техника ещё не добавлена.
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Тип</th>
                <th className="text-left px-4 py-3 font-medium">Бренд</th>
                <th className="text-left px-4 py-3 font-medium">Размеры (Ш×В)</th>
                <th className="text-left px-4 py-3 font-medium">Цена</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {TYPE_LABELS[a.applianceType] ?? a.applianceType}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.brand || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {a.widthCm ? `${a.widthCm}×${a.heightCm ?? "?"} см` : "—"}
                  </td>
                  <td className="px-4 py-3">{a.priceBase.toLocaleString("ru-RU")} ₽</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.isEnabled ? "default" : "secondary"}>
                      {a.isEnabled ? "Активна" : "Отключена"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/configurator-visual/appliances/${a.id}`}
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
