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
  { fromRoute: "/locations/borisov", fromState: "SELECTED", userQuestion: "Какие условия нужно подтвердить?", actionType: "DEEPEN", anchorRu: "Проверить этапы заказа", toRoute: "/locations/borisov#process", reasonRu: "Показывает порядок без обещания локальных условий.", priority: 1, requiresEvidence: false, fallbackRoute: "/locations/borisov", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/locations/borisov", fromState: "PROOF", userQuestion: "Есть ли локальный реальный проект?", actionType: "PROOF", anchorRu: "Проверить статус локального proof", toRoute: "/locations/borisov#local-proof", reasonRu: "Показывает честный fallback до появления exact-city evidence.", priority: 2, requiresEvidence: true, fallbackRoute: "/portfolio", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/locations/borisov", fromState: "DECISION", userQuestion: "Как передать вопрос?", actionType: "CONVERT", anchorRu: "Оставить заявку с городом", toRoute: "/locations/borisov#measure", contextPatch: { location: "borisov", sourceRoute: "/locations/borisov" }, reasonRu: "Передаёт город и выбранные параметры без обещания цены или срока.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/materials/mdf-fasady", fromState: "SELECTED", userQuestion: "Как выглядит поверхность?", actionType: "DEEPEN", anchorRu: "Рассмотреть условные поверхности", toRoute: "/materials/mdf-fasady#surface", contextPatch: { materials: ["МДФ"] }, reasonRu: "Углубляет визуальный вопрос без технических claims.", priority: 1, requiresEvidence: false, fallbackRoute: "/materials/mdf-fasady", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/materials/mdf-fasady", fromState: "COMPARE", userQuestion: "Что сравнить дальше?", actionType: "COMPARE", anchorRu: "Открыть вопросы к образцу", toRoute: "/materials/mdf-fasady#compare", contextPatch: { materials: ["МДФ"] }, reasonRu: "Сравнивает только наблюдаемый вид и необходимые проверки.", priority: 2, requiresEvidence: false, fallbackRoute: "/materials", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/materials/mdf-fasady", fromState: "DECISION", userQuestion: "Как узнать цену?", actionType: "CONVERT", anchorRu: "Передать МДФ в заявку", toRoute: "/materials/mdf-fasady#calculation", contextPatch: { materials: ["МДФ"], sourceRoute: "/materials/mdf-fasady" }, reasonRu: "Сохраняет интерес к материалу без неподтверждённой цены.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
];

export function readTransitions(fromRoute: string, fromState?: string) {
  return registry
    .filter((item) => item.status === "active" && item.fromRoute === fromRoute && (!fromState || item.fromState === fromState))
    .sort((a, b) => a.priority - b.priority);
}

export function getTransitionRegistry() {
  return registry.slice();
}
