"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { BUILTIN_PRESETS, type StylePreset } from "@/lib/kitchen-configurator/style-presets";
import type { MaterialsConfig } from "@/lib/kitchen-configurator";

interface StyleStepProps {
  config: MaterialsConfig;
  onApplyPreset: (preset: StylePreset) => void;
  /** Слаг последнего применённого пресета */
  activePresetId?: string;
}

export function StyleStep({ onApplyPreset, activePresetId }: StyleStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Выберите стиль — он заполнит фасады, столешницу и ручки. После можно изменить любой параметр вручную.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {BUILTIN_PRESETS.map((preset, idx) => {
          const active = preset.id === activePresetId;
          return (
            <motion.button
              key={preset.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onApplyPreset(preset)}
              className={`relative rounded-2xl overflow-hidden text-left border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                active
                  ? "border-amber-500 shadow-lg shadow-amber-100"
                  : "border-transparent hover:border-stone-300 hover:shadow-md"
              }`}
            >
              {/* Color swatch */}
              <div
                className="h-24 w-full"
                style={{ background: preset.previewGradient }}
              >
                <div className="h-full w-full flex items-center justify-center text-4xl">
                  {preset.emoji}
                </div>
              </div>

              <div className="p-3 bg-white">
                <p className="font-semibold text-sm text-stone-800">{preset.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                  {preset.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.tags.slice(0, 2).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {active && (
                <div className="absolute top-2 right-2 bg-amber-500 rounded-full text-white shadow">
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
