import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Столешницы" };

export default async function AdminCountertopsPage() {
  const items = await prisma.kitchenCountertop
    .findMany({ orderBy: [{ material: "asc" }, { sortOrder: "asc" }] })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Столешницы</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Ламинат, камень, кварц, дерево — толщина и цвета
          </p>
        </div>
        <Link
          href="/admin/configurator-visual/countertops/new"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить столешницу
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 p-12 text-center text-muted-foreground">
          Столешницы ещё не добавлены.
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Материал</th>
                <th className="text-left px-4 py-3 font-medium">Толщина</th>
                <th className="text-left px-4 py-3 font-medium">Цена/пм</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.material}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.thicknessMm} мм</td>
                  <td className="px-4 py-3">{c.pricePerMeter.toLocaleString("ru-RU")} ₽/пм</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isEnabled ? "default" : "secondary"}>
                      {c.isEnabled ? "Активна" : "Отключена"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/configurator-visual/countertops/${c.id}`}
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
