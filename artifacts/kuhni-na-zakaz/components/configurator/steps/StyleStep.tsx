"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { BUILTIN_PRESETS, type StylePreset } from "@/lib/kitchen-configurator/style-presets";
import type { MaterialsConfig } from "@/lib/kitchen-configurator";

interface StyleStepProps {
  config: MaterialsConfig;
  onApplyPreset: (preset: StylePreset) => void;
  activePresetId?: string;
}

export function StyleStep({ onApplyPreset, activePresetId }: StyleStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Выберите готовую стилистическую связку. После применения можно вручную заменить фасады,
        столешницу, скиналь, ручки и технику.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BUILTIN_PRESETS.map((preset, idx) => {
          const active = preset.id === activePresetId;
          return (
            <motion.button
              key={preset.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onApplyPreset(preset)}
              className={`relative overflow-hidden rounded-lg border-2 bg-white text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                active ? "border-amber-500 shadow-lg shadow-amber-100" : "border-stone-200 hover:border-stone-300 hover:shadow-md"
              }`}
            >
              <div className="h-28 w-full" style={{ background: preset.previewGradient }}>
                <div className="flex h-full w-full items-center justify-center text-4xl font-black text-white/85">
                  {preset.icon}
                </div>
              </div>

              <div className="space-y-2 p-3">
                <p className="text-sm font-extrabold text-stone-900">{preset.name}</p>
                <p className="min-h-10 text-xs leading-snug text-muted-foreground">{preset.description}</p>
                <div className="flex flex-wrap gap-1">
                  {preset.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {active && (
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
