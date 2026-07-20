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
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "SELECTED", userQuestion: "Как использовать пространство угла?", actionType: "DEEPEN", anchorRu: "Проверить хранение в углу", toRoute: "#inside", contextPatch: { layout: "угловая" }, reasonRu: "Показывает доступ к глубокой части шкафа.", priority: 1, requiresEvidence: false, fallbackRoute: "#inside", analyticsEvent: "next_action_click", status: "active" },
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "COMPARE", userQuestion: "Из чего собрать выбранный образ?", actionType: "COMPARE", anchorRu: "Сравнить фасады и материалы", toRoute: "#materials", contextPatch: { layout: "угловая" }, reasonRu: "Связывает форму угла с поверхностью и цветом.", priority: 2, requiresEvidence: false, fallbackRoute: "#materials", analyticsEvent: "next_action_click", status: "active" },
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "PROOF", userQuestion: "Где проверить выполненные решения?", actionType: "PROOF", anchorRu: "Проверить подтверждённые работы", toRoute: "/portfolio", contextPatch: { layout: "угловая", evidencePreference: "real" }, reasonRu: "Ведёт в раздел работ без выдачи AI-концепта за выполненный объект.", priority: 3, requiresEvidence: true, fallbackRoute: "/portfolio", analyticsEvent: "proof_open", status: "active" },
  { fromRoute: "/catalog/uglovye-kuhni", fromState: "DECISION", userQuestion: "Что делать после выбора?", actionType: "CONVERT", anchorRu: "Перейти к расчёту", toRoute: "#calculate", contextPatch: { layout: "угловая", sourceRoute: "/catalog/uglovye-kuhni" }, reasonRu: "Передаёт выбранные параметры в существующую форму.", priority: 4, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/locations/borisov", fromState: "SELECTED", userQuestion: "Какие условия нужно подтвердить?", actionType: "DEEPEN", anchorRu: "Проверить этапы заказа", toRoute: "/locations/borisov#process", contextPatch: { location: "borisov" }, reasonRu: "Показывает порядок без обещания локальных условий.", priority: 1, requiresEvidence: false, fallbackRoute: "/locations/borisov", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/locations/borisov", fromState: "PROOF", userQuestion: "Есть ли локальный реальный проект?", actionType: "PROOF", anchorRu: "Проверить статус локального proof", toRoute: "/locations/borisov#local-proof", contextPatch: { location: "borisov", evidencePreference: "real" }, reasonRu: "Показывает честный fallback до появления exact-city evidence.", priority: 2, requiresEvidence: true, fallbackRoute: "/portfolio", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/locations/borisov", fromState: "DECISION", userQuestion: "Как передать вопрос?", actionType: "CONVERT", anchorRu: "Оставить заявку с городом", toRoute: "/locations/borisov#measure", contextPatch: { location: "borisov", sourceRoute: "/locations/borisov" }, reasonRu: "Передаёт город и выбранные параметры без обещания цены или срока.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/materials/mdf-fasady", fromState: "SELECTED", userQuestion: "Как выглядит поверхность?", actionType: "DEEPEN", anchorRu: "Рассмотреть условные поверхности", toRoute: "/materials/mdf-fasady#surface", contextPatch: { materials: ["МДФ"] }, reasonRu: "Углубляет визуальный вопрос без технических claims.", priority: 1, requiresEvidence: false, fallbackRoute: "/materials/mdf-fasady", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/materials/mdf-fasady", fromState: "COMPARE", userQuestion: "Что сравнить дальше?", actionType: "COMPARE", anchorRu: "Открыть вопросы к образцу", toRoute: "/materials/mdf-fasady#compare", contextPatch: { materials: ["МДФ"] }, reasonRu: "Сравнивает только наблюдаемый вид и необходимые проверки.", priority: 2, requiresEvidence: false, fallbackRoute: "/materials", analyticsEvent: "pilot_transition_click", status: "active" },
  { fromRoute: "/materials/mdf-fasady", fromState: "DECISION", userQuestion: "Как узнать цену?", actionType: "CONVERT", anchorRu: "Передать МДФ в заявку", toRoute: "/materials/mdf-fasady#calculation", contextPatch: { materials: ["МДФ"], sourceRoute: "/materials/mdf-fasady" }, reasonRu: "Сохраняет интерес к материалу без неподтверждённой цены.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/catalog/pryamye-kuhni", fromState: "RESULT", userQuestion: "Когда одной линии достаточно?", actionType: "COMPARE", anchorRu: "Сравнить с угловой планировкой", toRoute: "/catalog/uglovye-kuhni", contextPatch: { layout: "прямая" }, reasonRu: "Показывает ближайшую альтернативу по рабочим зонам.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/pryamye-kuhni", fromState: "RESULT", userQuestion: "Как расставить зоны?", actionType: "DEEPEN", anchorRu: "Сравнить прямую кухню с маленькой", toRoute: "/catalog/malenkie-kuhni", contextPatch: { layout: "прямая" }, reasonRu: "Помогает проверить компромиссы площади без facet URL.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/pryamye-kuhni", fromState: "RESULT", userQuestion: "Как перейти к проекту?", actionType: "CONVERT", anchorRu: "Передать прямую планировку в заявку", toRoute: "#form", contextPatch: { layout: "прямая", sourceRoute: "/catalog/pryamye-kuhni" }, reasonRu: "Сохраняет выбранный формат в существующей форме.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/catalog/p-obraznye-kuhni", fromState: "RESULT", userQuestion: "Хватит ли места для трёх сторон?", actionType: "DEEPEN", anchorRu: "Разобрать размеры и проходы", toRoute: "/blog/p-obraznaya-kuhnya-razmery-prohody-cena", contextPatch: { layout: "П-образная" }, reasonRu: "Статья объясняет измерения, а страница отвечает за выбор формы.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/p-obraznye-kuhni", fromState: "RESULT", userQuestion: "Какая форма проще?", actionType: "COMPARE", anchorRu: "Сравнить с угловой кухней", toRoute: "/catalog/uglovye-kuhni", contextPatch: { layout: "П-образная" }, reasonRu: "Снижает риск выбора трёх сторон без достаточного прохода.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/p-obraznye-kuhni", fromState: "RESULT", userQuestion: "Как передать размеры?", actionType: "CONVERT", anchorRu: "Передать размеры для расчёта", toRoute: "/calculator", contextPatch: { layout: "П-образная", sourceRoute: "/catalog/p-obraznye-kuhni" }, reasonRu: "Калькулятор принимает исходные данные без обещания результата.", priority: 3, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/catalog/kuhni-s-ostrovom", fromState: "RESULT", userQuestion: "Какую роль дать острову?", actionType: "DEEPEN", anchorRu: "Выбрать бытовой сценарий острова", toRoute: "/scenarios/s-ostrovom", contextPatch: { layout: "с островом" }, reasonRu: "Сценарий уточняет использование, не повторяя геометрию каталога.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/kuhni-s-ostrovom", fromState: "RESULT", userQuestion: "Поместится ли остров?", actionType: "COMPARE", anchorRu: "Сравнить с П-образной формой", toRoute: "/catalog/p-obraznye-kuhni", contextPatch: { layout: "с островом" }, reasonRu: "Показывает альтернативу с рабочей третьей стороной.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/kuhni-s-ostrovom", fromState: "RESULT", userQuestion: "Как перейти к расчёту?", actionType: "CONVERT", anchorRu: "Передать островной сценарий", toRoute: "/calculator", contextPatch: { layout: "с островом", sourceRoute: "/catalog/kuhni-s-ostrovom" }, reasonRu: "Передаёт роль острова в существующий расчёт.", priority: 3, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/catalog/malenkie-kuhni", fromState: "RESULT", userQuestion: "Что сохранить в первую очередь?", actionType: "DEEPEN", anchorRu: "Расставить приоритеты маленькой кухни", toRoute: "/scenarios/dlya-malenkoy-kuhni", contextPatch: { scenario: "маленькая кухня" }, reasonRu: "Сценарий помогает выбрать компромисс до заказа.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/malenkie-kuhni", fromState: "RESULT", userQuestion: "Подойдёт ли одна линия?", actionType: "COMPARE", anchorRu: "Проверить прямую планировку", toRoute: "/catalog/pryamye-kuhni", contextPatch: { scenario: "маленькая кухня" }, reasonRu: "Сравнивает компактную задачу и форму гарнитура.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/malenkie-kuhni", fromState: "RESULT", userQuestion: "Как передать ограничения?", actionType: "CONVERT", anchorRu: "Передать параметры маленькой кухни", toRoute: "/calculator", contextPatch: { scenario: "маленькая кухня", sourceRoute: "/catalog/malenkie-kuhni" }, reasonRu: "Расчёт начинается с исходных размеров и приоритетов.", priority: 3, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/catalog/kuhni-do-potolka", fromState: "RESULT", userQuestion: "Что хранить наверху?", actionType: "DEEPEN", anchorRu: "Проверить сценарий хранения до потолка", toRoute: "/scenarios/do-potolka", contextPatch: { scenario: "до потолка" }, reasonRu: "Сценарий объясняет частоту доступа и ограничения.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/kuhni-do-potolka", fromState: "RESULT", userQuestion: "Как проверить высоту?", actionType: "COMPARE", anchorRu: "Сравнить материалы и верхние секции", toRoute: "/materials/furnitura", contextPatch: { scenario: "до потолка" }, reasonRu: "Защищённая страница остаётся исходящим hardware-переходом.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/kuhni-do-potolka", fromState: "RESULT", userQuestion: "Как передать высоту?", actionType: "CONVERT", anchorRu: "Передать высоту для расчёта", toRoute: "/calculator", contextPatch: { scenario: "до потолка", sourceRoute: "/catalog/kuhni-do-potolka" }, reasonRu: "Калькулятор получает исходные размеры без ложной точности.", priority: 3, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/catalog/kuhni-bez-ruchek", fromState: "RESULT", userQuestion: "Как выбрать открывание?", actionType: "COMPARE", anchorRu: "Сравнить механизмы и фурнитуру", toRoute: "/materials/furnitura", contextPatch: { hardware: ["без ручек"] }, reasonRu: "Защищённая страница остаётся источником подробного hardware-контекста.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/kuhni-bez-ruchek", fromState: "RESULT", userQuestion: "Как сохранить чистую линию?", actionType: "DEEPEN", anchorRu: "Проверить минималистичный стиль", toRoute: "/styles/minimalizm", contextPatch: { hardware: ["без ручек"] }, reasonRu: "Стиль уточняет визуальную задачу после выбора механизма.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "layout_transition_click", status: "active" },
  { fromRoute: "/catalog/kuhni-bez-ruchek", fromState: "RESULT", userQuestion: "Как передать выбранный механизм?", actionType: "CONVERT", anchorRu: "Передать открывание в заявку", toRoute: "/calculator", contextPatch: { hardware: ["без ручек"], sourceRoute: "/catalog/kuhni-bez-ruchek" }, reasonRu: "Сохраняет выбранный сценарий без утверждения совместимости.", priority: 3, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "lead_open_with_context", status: "active" },
];

for (const config of [...Object.values(STYLE_FAMILY), ...Object.values(SCENARIO_FAMILY)]) {
  const family = "visualLanguage" in config ? "styles" : "scenarios";
  const fromRoute = `/${family}/${config.slug}`;
  config.links.forEach((link, index) => registry.push({
    fromRoute,
    fromState: "RESULT",
    userQuestion: config.question,
    actionType: link.type,
    anchorRu: link.label,
    toRoute: link.href,
    contextPatch: family === "styles" ? { style: config.h1, sourceRoute: fromRoute } : { scenario: config.h1, sourceRoute: fromRoute },
    reasonRu: link.reason,
    priority: index + 1,
    requiresEvidence: link.type === "PROOF",
    fallbackRoute: link.type === "CONVERT" ? "/calculator" : family === "styles" ? "/styles" : "/scenarios",
    analyticsEvent: `${family.slice(0, -1)}_family_transition_click`,
    status: "active",
  }));
}

export function readTransitions(fromRoute: string, fromState?: string) {
  return registry
    .filter((item) => item.status === "active" && item.fromRoute === fromRoute && (!fromState || item.fromState === fromState))
    .sort((a, b) => a.priority - b.priority);
}

export function getTransitionRegistry() {
  return registry.slice();
}
import { SCENARIO_FAMILY, STYLE_FAMILY } from "@/data/exploration-families";
