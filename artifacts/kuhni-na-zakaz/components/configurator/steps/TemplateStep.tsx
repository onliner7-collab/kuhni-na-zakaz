"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { CatalogTemplate } from "@/lib/kitchen-configurator";

interface TemplateStepProps {
  templates: CatalogTemplate[];
  selectedSlug?: string;
  onSelect: (template: CatalogTemplate) => void;
}

const LAYOUT_LABELS: Record<string, string> = {
  STRAIGHT: "Прямая",
  CORNER: "Угловая",
  U_SHAPE: "П-образная",
  ISLAND: "С островом",
  PENINSULA: "С полуостровом",
  LINEAR_COLUMNS: "Линейная + колонны",
  COMPACT: "Компактная",
};

const LAYOUT_ICONS: Record<string, string> = {
  STRAIGHT: "━",
  CORNER: "┗",
  U_SHAPE: "┗━┛",
  ISLAND: "⊡",
  PENINSULA: "⊏",
  LINEAR_COLUMNS: "┣┫",
  COMPACT: "▤",
};

// Fallback SVG previews when no image
function TemplatePreviewSVG({ layoutType }: { layoutType: string }) {
  const paths: Record<string, React.ReactNode> = {
    STRAIGHT: <rect x="10" y="35" width="80" height="30" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />,
    CORNER: (
      <g>
        <rect x="10" y="35" width="50" height="25" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />
        <rect x="10" y="10" width="25" height="50" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />
      </g>
    ),
    U_SHAPE: (
      <g>
        <rect x="10" y="35" width="80" height="20" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />
        <rect x="10" y="10" width="20" height="50" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />
        <rect x="70" y="10" width="20" height="50" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />
      </g>
    ),
    ISLAND: (
      <g>
        <rect x="10" y="10" width="80" height="20" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />
        <rect x="20" y="45" width="60" height="18" rx="3" fill="#e8e4e0" stroke="#a8a29e" strokeWidth="1.5" strokeDasharray="4 2" />
      </g>
    ),
    COMPACT: <rect x="20" y="20" width="60" height="60" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />,
  };
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="#f5f3f0" />
      {paths[layoutType] ?? <rect x="15" y="35" width="70" height="30" rx="3" fill="#d6cfc5" stroke="#a8a29e" strokeWidth="1.5" />}
    </svg>
  );
}

export function TemplateStep({ templates, selectedSlug, onSelect }: TemplateStepProps) {
  if (templates.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/40 p-12 text-center">
        <p className="text-muted-foreground text-sm">
          Шаблоны ещё не добавлены администратором.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Перейдите в Администрирование → Визуальный конфигуратор → Шаблоны.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Выберите стартовую планировку. Вы сможете изменить расстановку модулей в следующем шаге.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((t, idx) => {
          const selected = t.slug === selectedSlug;
          return (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onSelect(t)}
              className={`relative rounded-xl border-2 overflow-hidden text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                selected
                  ? "border-amber-500 shadow-md shadow-amber-100"
                  : "border-transparent hover:border-stone-300 hover:shadow-sm"
              }`}
            >
              <div className="aspect-square bg-stone-100">
                {t.previewImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.previewImageUrl} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <TemplatePreviewSVG layoutType={t.layoutType} />
                )}
              </div>
              <div className="p-2.5 bg-white">
                <p className="font-semibold text-xs text-stone-800 leading-tight">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {LAYOUT_ICONS[t.layoutType]} {LAYOUT_LABELS[t.layoutType] ?? t.layoutType}
                </p>
                {t.minWidthCm && (
                  <p className="text-xs text-muted-foreground">от {t.minWidthCm} см</p>
                )}
              </div>
              {selected && (
                <div className="absolute top-2 right-2 bg-amber-500 rounded-full text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
