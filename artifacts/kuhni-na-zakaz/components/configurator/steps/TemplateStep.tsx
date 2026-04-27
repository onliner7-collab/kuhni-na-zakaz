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
  LINEAR_COLUMNS: "Линия и пеналы",
  COMPACT: "Компактная",
};

function TemplatePreviewSVG({ layoutType }: { layoutType: string }) {
  const common = { fill: "#d8cec1", stroke: "#9b8f82", strokeWidth: 1.5, rx: 4 };
  const layouts: Record<string, React.ReactNode> = {
    STRAIGHT: <rect x="12" y="38" width="76" height="24" {...common} />,
    CORNER: (
      <g>
        <rect x="12" y="38" width="58" height="24" {...common} />
        <rect x="12" y="16" width="24" height="46" {...common} />
      </g>
    ),
    U_SHAPE: (
      <g>
        <rect x="12" y="40" width="76" height="20" {...common} />
        <rect x="12" y="18" width="20" height="42" {...common} />
        <rect x="68" y="18" width="20" height="42" {...common} />
      </g>
    ),
    ISLAND: (
      <g>
        <rect x="12" y="18" width="76" height="20" {...common} />
        <rect x="24" y="56" width="52" height="18" fill="#efe7dd" stroke="#9b8f82" strokeWidth="1.5" strokeDasharray="4 3" rx="4" />
      </g>
    ),
    LINEAR_COLUMNS: (
      <g>
        <rect x="12" y="34" width="58" height="24" {...common} />
        <rect x="74" y="18" width="14" height="56" {...common} />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <rect width="100" height="100" fill="#f7f3ee" />
      <path d="M14 84H86" stroke="#d5c8bb" strokeWidth="2" strokeLinecap="round" />
      {layouts[layoutType] ?? <rect x="18" y="30" width="64" height="38" {...common} />}
    </svg>
  );
}

export function TemplateStep({ templates, selectedSlug, onSelect }: TemplateStepProps) {
  if (templates.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">Шаблоны пока не добавлены. Можно перейти к модулям и собрать планировку вручную.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Выберите стартовую планировку. На следующем шаге модули можно удалить, добавить или переместить.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, idx) => {
          const selected = template.slug === selectedSlug;
          return (
            <motion.button
              key={template.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onSelect(template)}
              className={`relative overflow-hidden rounded-lg border-2 bg-white text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                selected ? "border-amber-500 shadow-lg shadow-amber-100" : "border-stone-200 hover:border-stone-300 hover:shadow-md"
              }`}
            >
              <div className="aspect-[4/3] bg-stone-100">
                {template.previewImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={template.previewImageUrl} alt={template.name} className="h-full w-full object-cover" />
                ) : (
                  <TemplatePreviewSVG layoutType={template.layoutType} />
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="font-extrabold text-stone-900">{template.name}</p>
                <p className="text-sm text-muted-foreground">{LAYOUT_LABELS[template.layoutType] ?? template.layoutType}</p>
                {template.description && <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{template.description}</p>}
                {template.minWidthCm && <p className="text-xs font-semibold text-stone-600">от {template.minWidthCm} см</p>}
              </div>
              {selected && (
                <div className="absolute right-2 top-2 rounded-full bg-amber-500 text-white shadow">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
