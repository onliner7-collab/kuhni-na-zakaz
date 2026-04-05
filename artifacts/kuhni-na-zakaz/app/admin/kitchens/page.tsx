import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <Button asChild data-testid="add-kitchen" style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }} className="text-white">
          <Link href="/admin/kitchens/new"><Plus className="w-4 h-4 mr-2" />Добавить кухню</Link>
        </Button>
      </div>

      <div className="mb-6 mt-4 p-3 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
        💡 Опубликованные кухни видны на сайте. Черновики скрыты от посетителей, но доступны по прямой ссылке.
      </div>

      {kitchens.length === 0 ? (
        <div className="rounded-2xl border border-border p-12 text-center bg-white">
          <p className="text-muted-foreground mb-4">Кухонь пока нет. Добавьте первую позицию в каталог.</p>
          <Button asChild><Link href="/admin/kitchens/new"><Plus className="w-4 h-4 mr-2" />Добавить первую кухню</Link></Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden bg-white">
          <table className="w-full text-sm">
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
                        <Button asChild variant="ghost" size="sm" title="Открыть на сайте">
                          <Link href={`/catalog/${k.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="sm" title="Редактировать">
                        <Link href={`/admin/kitchens/${k.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
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
