import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Phone, Tag } from "lucide-react";

export const metadata: Metadata = { title: "Сохранённые подборы — КухниBY" };

const STYLE_LABELS: Record<string, string> = {
  minimalizm: "Минимализм", sovremennye: "Современный", skandinavskie: "Скандинавский",
  klassicheskie: "Классика", loft: "Лофт", provansskie: "Прованс",
};
const MATERIAL_LABELS: Record<string, string> = {
  mdf: "МДФ плёнка", plastik: "Пластик", emal: "Эмаль", shpon: "Шпон", massiv: "Массив",
};
const BUDGET_LABELS: Record<string, string> = {
  economy: "Эконом", standard: "Стандарт", comfort: "Комфорт", premium: "Премиум",
};

export default async function AdminSavedConfigsPage() {
  const configs = await prisma.savedConfig.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  }).catch(() => []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Сохранённые подборы</h1>
        <span className="text-sm text-muted-foreground">{configs.length} всего</span>
      </div>

      <p className="text-sm text-muted-foreground">
        Анонимные конфигурации, сохранённые пользователями через конфигуратор. Если пользователь оставил заявку — видна заявка.
      </p>

      {configs.length === 0 ? (
        <div className="card-base p-12 text-center">
          <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Сохранённых подборов пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map(cfg => (
            <div key={cfg.id} className="card-base p-4 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-sm">{cfg.label || "Без описания"}</span>
                    <span className="text-xs text-muted-foreground font-mono">{cfg.sessionId.slice(0, 16)}…</span>
                    {cfg.leadId && (
                      <Badge variant="outline" className="text-xs text-green-700 border-green-200 bg-green-50">
                        Заявка #{cfg.leadId}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {cfg.styleSlug && (
                      <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 rounded-lg px-2 py-0.5">
                        Стиль: {STYLE_LABELS[cfg.styleSlug] ?? cfg.styleSlug}
                      </span>
                    )}
                    {cfg.materialSlug && (
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-2 py-0.5">
                        Материал: {MATERIAL_LABELS[cfg.materialSlug] ?? cfg.materialSlug}
                      </span>
                    )}
                    {cfg.budgetLevel && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg px-2 py-0.5">
                        Бюджет: {BUDGET_LABELS[cfg.budgetLevel] ?? cfg.budgetLevel}
                      </span>
                    )}
                    {cfg.scenarioSlug && (
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-0.5">
                        Сценарий: {cfg.scenarioSlug}
                      </span>
                    )}
                  </div>

                  {cfg.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      {cfg.tags.slice(0, 6).map(tag => (
                        <span key={tag} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(cfg.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {cfg.phone && (
                    <a href={`tel:${cfg.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Phone className="w-3 h-3" /> {cfg.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
