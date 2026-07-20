export type TransitionActionType = "DEEPEN" | "COMPARE" | "PROOF" | "CONVERT";

export interface TransitionRecord {
  fromRoute: string;
  fromState: string;
  userQuestion: string;
  actionType: TransitionActionType;
  anchorRu: string;
  toRoute: string;
  contextPatch?: Record<string, string | string[]>;
  reasonRu: string;
  priority: number;
  requiresEvidence: boolean;
  fallbackRoute: string;
  analyticsEvent: string;
  status: "active" | "draft";
}

const registry: TransitionRecord[] = [
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "SELECTED", userQuestion: "Как использовать пространство угла?", actionType: "DEEPEN", anchorRu: "Проверить хранение в углу", toRoute: "#inside", reasonRu: "Показывает доступ к глубокой части шкафа.", priority: 1, requiresEvidence: false, fallbackRoute: "#inside", analyticsEvent: "next_action_click", status: "active" },
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "COMPARE", userQuestion: "Из чего собрать выбранный образ?", actionType: "COMPARE", anchorRu: "Сравнить фасады и материалы", toRoute: "#materials", reasonRu: "Связывает форму угла с поверхностью и цветом.", priority: 2, requiresEvidence: false, fallbackRoute: "#materials", analyticsEvent: "next_action_click", status: "active" },
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "PROOF", userQuestion: "Как выглядит выполненное решение?", actionType: "PROOF", anchorRu: "Открыть подтверждённый проект", toRoute: "/portfolio/uglovaya-kuhnya-sovremennaya-001", reasonRu: "Ведёт к отдельной странице реального проекта.", priority: 3, requiresEvidence: true, fallbackRoute: "/portfolio", analyticsEvent: "proof_open", status: "active" },
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "DECISION", userQuestion: "Что делать после выбора?", actionType: "CONVERT", anchorRu: "Перейти к расчёту", toRoute: "#calculate", reasonRu: "Передаёт выбранные параметры в существующую форму.", priority: 4, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
];

export function readTransitions(fromRoute: string, fromState?: string) {
  return registry
    .filter((item) => item.status === "active" && item.fromRoute === fromRoute && (!fromState || item.fromState === fromState))
    .sort((a, b) => a.priority - b.priority);
}

export function getTransitionRegistry() {
  return registry.slice();
}
