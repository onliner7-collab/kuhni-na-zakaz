import type { TransitionAction } from "@/lib/exploration-types";

export const TRANSITION_ACTION_LABELS = {
  PARENT: "К разделу",
  DEEPEN: "Изучить подробнее",
  COMPARE: "Сравнить",
  PROOF: "Посмотреть примеры",
  CROSS_FAMILY: "Связанное решение",
  CONVERT: "Перейти к расчёту",
  SUPPORT: "Условия и помощь",
} satisfies Record<TransitionAction, string>;

export function getTransitionActionLabel(action: string): string | null {
  return Object.prototype.hasOwnProperty.call(TRANSITION_ACTION_LABELS, action)
    ? TRANSITION_ACTION_LABELS[action as TransitionAction]
    : null;
}
