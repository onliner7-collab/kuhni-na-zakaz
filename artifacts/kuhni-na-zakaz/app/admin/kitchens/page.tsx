import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Управление кухнями" };

export default async function AdminKitchensPage() {
  const kitchens = await prisma.kitchen.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Кухни в каталоге</h1>
        <Button asChild data-testid="add-kitchen">
          <Link href="/admin/kitchens/new"><Plus className="w-4 h-4 mr-2" />Добавить</Link>
        </Button>
      </div>
      {kitchens.length === 0 ? (
        <div className="card-base p-12 text-center">
          <p className="text-muted-foreground mb-4">Кухонь пока нет</p>
          <Button asChild><Link href="/admin/kitchens/new">Добавить первую</Link></Button>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Название</th>
                <th className="text-left p-3 font-medium">Категория</th>
                <th className="text-left p-3 font-medium">Цена от</th>
                <th className="text-left p-3 font-medium">Статус</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {kitchens.map((k) => (
                <tr key={k.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-medium">{k.title}</td>
                  <td className="p-3 text-muted-foreground">{k.category}</td>
                  <td className="p-3">{k.priceFrom.toLocaleString("ru")} BYN</td>
                  <td className="p-3"><Badge variant={k.published ? "success" : "secondary"}>{k.published ? "Опубликована" : "Черновик"}</Badge></td>
                  <td className="p-3 text-right">
                    <Button asChild variant="ghost" size="sm"><Link href={`/admin/kitchens/${k.id}`}><Edit className="w-4 h-4" /></Link></Button>
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
