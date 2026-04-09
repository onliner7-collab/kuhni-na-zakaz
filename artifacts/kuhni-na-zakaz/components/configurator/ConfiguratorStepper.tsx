"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ConfiguratorStep } from "@/lib/kitchen-configurator";

interface StepMeta {
  key: ConfiguratorStep;
  label: string;
  shortLabel: string;
  emoji: string;
}

export const STEPS: StepMeta[] = [
  { key: "room",      label: "Помещение",   shortLabel: "Размеры",  emoji: "📐" },
  { key: "template",  label: "Планировка",  shortLabel: "Шаблон",   emoji: "🗺️" },
  { key: "modules",   label: "Модули",      shortLabel: "Модули",   emoji: "🔲" },
  { key: "materials", label: "Стиль",       shortLabel: "Стиль",    emoji: "🎨" },
  { key: "view3d",    label: "3D",          shortLabel: "3D",       emoji: "🏠" },
  { key: "summary",   label: "Итог",        shortLabel: "Итог",     emoji: "✅" },
];

interface ConfiguratorStepperProps {
  currentStep: ConfiguratorStep;
  canProceed: (step: ConfiguratorStep) => boolean;
  onStepClick: (step: ConfiguratorStep) => void;
}

export function ConfiguratorStepper({ currentStep, canProceed, onStepClick }: ConfiguratorStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav className="w-full overflow-x-auto scrollbar-none">
      <ol className="flex items-center min-w-max px-1">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isReachable = canProceed(step.key);

          return (
            <li key={step.key} className="flex items-center">
              {/* Step button */}
              <button
                onClick={() => isReachable && onStepClick(step.key)}
                disabled={!isReachable}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isCurrent
                    ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                    : isCompleted
                    ? "text-stone-600 hover:bg-stone-100"
                    : isReachable
                    ? "text-stone-400 hover:bg-stone-50"
                    : "text-stone-300 cursor-not-allowed"
                }`}
              >
                {/* Circle */}
                <motion.span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isCurrent ? "bg-white text-amber-700"
                    : isCompleted ? "bg-green-500 text-white"
                    : "bg-stone-200 text-stone-500"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={isCurrent ? { duration: 0.6, repeat: Infinity, repeatDelay: 3 } : {}}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : step.emoji}
                </motion.span>
                {/* Label — hidden on very small screens */}
                <span className="hidden sm:inline">{step.shortLabel}</span>
              </button>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 rounded-full transition-colors ${
                  idx < currentIdx ? "bg-green-400" : "bg-stone-200"
                }`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
