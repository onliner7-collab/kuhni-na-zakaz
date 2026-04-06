import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Кухни" };

export default async function AdminKitchensPage() {
  const kitchens = await prisma.kitchen.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-black">Кухни в каталоге</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Каждая кухня отображается на странице <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">/catalog/[slug]</span>
          </p>
        </div>
        <Link
          href="/admin/kitchens/new"
          data-testid="add-kitchen"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить кухню
        </Link>
      </div>

      <div className="mb-6 mt-4 p-3 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
        💡 Опубликованные кухни видны на сайте. Черновики скрыты от посетителей, но доступны по прямой ссылке.
      </div>

      {kitchens.length === 0 ? (
        <div className="rounded-2xl border border-border p-12 text-center bg-white">
          <p className="text-muted-foreground mb-4">Кухонь пока нет. Добавьте первую позицию в каталог.</p>
          <Link href="/admin/kitchens/new" className={buttonVariants()}><Plus className="w-4 h-4 mr-2" />Добавить первую кухню</Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden bg-white">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Название</th>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Категория</th>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Цена от</th>
                <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Статус</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {kitchens.map((k) => (
                <tr key={k.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <span className="font-semibold">{k.title}</span>
                    <span className="text-xs text-muted-foreground block mt-0.5 font-mono">/catalog/{k.slug}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{k.category}</td>
                  <td className="p-3 font-semibold">{k.priceFrom.toLocaleString("ru")} BYN</td>
                  <td className="p-3">
                    <Badge variant={k.published ? "success" : "secondary"}>
                      {k.published ? "✓ Опубликована" : "⊘ Черновик"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 justify-end">
                      {k.published && (
                        <Link
                          href={`/catalog/${k.slug}`}
                          target="_blank"
                          title="Открыть на сайте"
                          className={buttonVariants({ variant: "ghost", size: "sm" })}
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/kitchens/${k.id}`}
                        title="Редактировать"
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
