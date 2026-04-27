"use client";

import { motion } from "framer-motion";
import { Check, Box, Cuboid, Home, Palette, Ruler, Sparkles } from "lucide-react";
import type { ConfiguratorStep } from "@/lib/kitchen-configurator";

interface StepMeta {
  key: ConfiguratorStep;
  label: string;
  shortLabel: string;
  Icon: typeof Ruler;
}

export const STEPS: StepMeta[] = [
  { key: "room", label: "Помещение", shortLabel: "Размеры", Icon: Ruler },
  { key: "template", label: "Планировка", shortLabel: "Шаблон", Icon: Home },
  { key: "modules", label: "Модули", shortLabel: "Модули", Icon: Box },
  { key: "materials", label: "Стиль", shortLabel: "Стиль", Icon: Palette },
  { key: "view3d", label: "3D-просмотр", shortLabel: "3D", Icon: Cuboid },
  { key: "summary", label: "Итог", shortLabel: "Итог", Icon: Sparkles },
];

interface ConfiguratorStepperProps {
  currentStep: ConfiguratorStep;
  canProceed: (step: ConfiguratorStep) => boolean;
  onStepClick: (step: ConfiguratorStep) => void;
}

export function ConfiguratorStepper({ currentStep, canProceed, onStepClick }: ConfiguratorStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav className="w-full overflow-x-auto" aria-label="Шаги конфигуратора">
      <ol className="flex min-w-max items-center px-1">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isReachable = canProceed(step.key);
          const Icon = step.Icon;

          return (
            <li key={step.key} className="flex items-center">
              <button
                type="button"
                onClick={() => isReachable && onStepClick(step.key)}
                disabled={!isReachable}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isCurrent
                    ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                    : isCompleted
                    ? "text-stone-700 hover:bg-stone-100"
                    : isReachable
                    ? "text-stone-500 hover:bg-stone-50"
                    : "cursor-not-allowed text-stone-300"
                }`}
              >
                <motion.span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isCurrent
                      ? "bg-white text-amber-700"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={isCurrent ? { duration: 0.6, repeat: Infinity, repeatDelay: 3 } : {}}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </motion.span>
                <span className="hidden sm:inline">{step.shortLabel}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <div className={`mx-1 h-0.5 w-6 rounded-full ${idx < currentIdx ? "bg-emerald-400" : "bg-stone-200"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
