import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Шаблоны планировок" };

const LAYOUT_LABELS: Record<string, string> = {
  STRAIGHT: "Прямая",
  CORNER: "Угловая",
  U_SHAPE: "П-образная",
  ISLAND: "С островом",
  PENINSULA: "С полуостровом",
  LINEAR_COLUMNS: "Линейная + колонны",
  COMPACT: "Компактная",
};

export default async function AdminTemplatesPage() {
  const templates = await prisma.kitchenTemplate
    .findMany({ orderBy: [{ layoutType: "asc" }, { sortOrder: "asc" }] })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Шаблоны планировок</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Готовые конфигурации для быстрого старта пользователя
          </p>
        </div>
        <Link
          href="/admin/configurator-visual/templates/new"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить шаблон
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 p-12 text-center text-muted-foreground">
          Шаблоны ещё не добавлены. Нажмите «Добавить шаблон».
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-4 flex flex-col gap-3">
              {t.previewImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.previewImageUrl}
                  alt={t.name}
                  className="rounded-lg object-cover w-full h-36 bg-muted"
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold leading-tight">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {LAYOUT_LABELS[t.layoutType] ?? t.layoutType}
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  <Badge variant={t.isPublished ? "default" : "secondary"}>
                    {t.isPublished ? "Опубликован" : "Черновик"}
                  </Badge>
                  <Badge variant={t.isEnabled ? "outline" : "secondary"} className="text-xs">
                    {t.isEnabled ? "Активен" : "Отключён"}
                  </Badge>
                </div>
              </div>
              {t.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
              )}
              <Link
                href={`/admin/configurator-visual/templates/${t.id}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-auto")}
              >
                <Edit className="w-3 h-3 mr-1" />Изменить
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
