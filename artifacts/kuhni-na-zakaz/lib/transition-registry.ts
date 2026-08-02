import { z } from "zod";
import { SCENARIO_FAMILY, STYLE_FAMILY } from "@/data/exploration-families";
import type {
  EvidenceStatus,
  ExplorationAnalyticsEvent,
  TransitionAction,
  TransitionEntryV2,
  TransitionStatus,
} from "@/lib/exploration-types";

interface LegacyTransitionRecord {
  fromRoute: string;
  fromState: string;
  userQuestion: string;
  actionType: Extract<TransitionAction, "DEEPEN" | "COMPARE" | "PROOF" | "CONVERT">;
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

const legacyRegistry: LegacyTransitionRecord[] = [
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

legacyRegistry.push(
  { fromRoute: "/catalog", fromState: "RESULT", userQuestion: "Какая форма подходит помещению?", actionType: "COMPARE", anchorRu: "Сравнить материалы после выбора формы", toRoute: "/materials", contextPatch: { sourceRoute: "/catalog" }, reasonRu: "Материал уточняется после геометрии и не подменяет выбор планировки.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "exploration_compare", status: "active" },
  { fromRoute: "/catalog", fromState: "RESULT", userQuestion: "Как проверить выбранную форму?", actionType: "DEEPEN", anchorRu: "Проверить ограничения в дизайн-проекте", toRoute: "/design-proekt-kuhni", contextPatch: { sourceRoute: "/catalog" }, reasonRu: "Проект связывает форму с размерами, техникой и коммуникациями.", priority: 2, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "exploration_transition_click", status: "active" },
  { fromRoute: "/catalog", fromState: "RESULT", userQuestion: "Как получить расчёт?", actionType: "CONVERT", anchorRu: "Передать выбранную форму для расчёта", toRoute: "/calculator", contextPatch: { sourceRoute: "/catalog" }, reasonRu: "Калькулятор получает контекст выбора без обещания точной цены.", priority: 3, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/", fromState: "RESULT", userQuestion: "Как углубить выбранную форму?", actionType: "DEEPEN", anchorRu: "Сравнить идеи кухонь по планировке", toRoute: "/catalog", contextPatch: { sourceRoute: "/" }, reasonRu: "Каталог продолжает выбор формы и не дублирует коммерческую роль главной.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "home_transition_click", status: "active" },
  { fromRoute: "/", fromState: "RESULT", userQuestion: "Как проверить выбранное на реальных примерах?", actionType: "PROOF", anchorRu: "Посмотреть подтверждённые работы", toRoute: "/portfolio", contextPatch: { evidencePreference: "real", sourceRoute: "/" }, reasonRu: "Портфолио отделяет подтверждённые работы от визуальных идей.", priority: 2, requiresEvidence: true, fallbackRoute: "/portfolio", analyticsEvent: "home_transition_click", status: "active" },
  { fromRoute: "/", fromState: "RESULT", userQuestion: "Как перейти от выбора к проекту?", actionType: "CONVERT", anchorRu: "Передать выбор в дизайн-проект", toRoute: "/design-proekt-kuhni", contextPatch: { sourceRoute: "/" }, reasonRu: "Проект уточняет помещение, ограничения и комплектацию до расчёта.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/design-proekt-kuhni", fromState: "RESULT", userQuestion: "Как проверить выбранную форму?", actionType: "COMPARE", anchorRu: "Сравнить формы в каталоге", toRoute: "/catalog", contextPatch: { sourceRoute: "/design-proekt-kuhni" }, reasonRu: "Каталог даёт отдельные ограничения и примеры для каждой планировки.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "design_transition_click", status: "active" },
  { fromRoute: "/design-proekt-kuhni", fromState: "RESULT", userQuestion: "Как уточнить поверхность и механизмы?", actionType: "DEEPEN", anchorRu: "Перейти к материалам и фурнитуре", toRoute: "/materials", contextPatch: { sourceRoute: "/design-proekt-kuhni" }, reasonRu: "Материалы продолжают выбранную визуальную и бытовую задачу.", priority: 2, requiresEvidence: false, fallbackRoute: "/materials", analyticsEvent: "design_transition_click", status: "active" },
  { fromRoute: "/design-proekt-kuhni", fromState: "RESULT", userQuestion: "Как передать исходные данные?", actionType: "CONVERT", anchorRu: "Перейти к расчёту по выбранным параметрам", toRoute: "/calculator", contextPatch: { sourceRoute: "/design-proekt-kuhni" }, reasonRu: "Калькулятор принимает исходные параметры без обещания точного проекта.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/locations/minsk", fromState: "RESULT", userQuestion: "Как выбрать решение под помещение?", actionType: "DEEPEN", anchorRu: "Сравнить планировки для Минска", toRoute: "/catalog", contextPatch: { location: "Минск", sourceRoute: "/locations/minsk" }, reasonRu: "Городская страница передаёт локальный контекст в общий выбор формы.", priority: 1, requiresEvidence: false, fallbackRoute: "/catalog", analyticsEvent: "location_transition_click", status: "active" },
  { fromRoute: "/locations/minsk", fromState: "RESULT", userQuestion: "Как подготовить помещение?", actionType: "DEEPEN", anchorRu: "Подготовиться к замеру и проекту", toRoute: "/design-proekt-kuhni", contextPatch: { location: "Минск", sourceRoute: "/locations/minsk" }, reasonRu: "Проект объясняет необходимые размеры и ограничения без выдуманного local proof.", priority: 2, requiresEvidence: false, fallbackRoute: "/contacts", analyticsEvent: "location_transition_click", status: "active" },
  { fromRoute: "/locations/minsk", fromState: "RESULT", userQuestion: "Как согласовать следующий шаг?", actionType: "CONVERT", anchorRu: "Оставить заявку с контекстом Минска", toRoute: "/locations/minsk#form", contextPatch: { location: "Минск", sourceRoute: "/locations/minsk" }, reasonRu: "Форма получает город и уже выбранные параметры.", priority: 3, requiresEvidence: false, fallbackRoute: "/contacts", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/locations/minskaya-oblast", fromState: "RESULT", userQuestion: "Где находится объект?", actionType: "DEEPEN", anchorRu: "Выбрать город Минской области", toRoute: "/locations", contextPatch: { location: "Минская область", sourceRoute: "/locations/minskaya-oblast" }, reasonRu: "Областной хаб ведёт к отдельным городским страницам без создания SEO-дублей.", priority: 1, requiresEvidence: false, fallbackRoute: "/locations", analyticsEvent: "location_transition_click", status: "active" },
  { fromRoute: "/locations/minskaya-oblast", fromState: "RESULT", userQuestion: "Что уточнить для выезда?", actionType: "DEEPEN", anchorRu: "Проверить доставку и монтаж", toRoute: "/delivery-installation", contextPatch: { location: "Минская область", sourceRoute: "/locations/minskaya-oblast" }, reasonRu: "Условия подтверждаются по адресу, а не обещаются одинаковыми для всей области.", priority: 2, requiresEvidence: false, fallbackRoute: "/contacts", analyticsEvent: "location_transition_click", status: "active" },
  { fromRoute: "/locations/minskaya-oblast", fromState: "RESULT", userQuestion: "Как передать город и адрес?", actionType: "CONVERT", anchorRu: "Оставить заявку по Минской области", toRoute: "/locations/minskaya-oblast#form", contextPatch: { location: "Минская область", sourceRoute: "/locations/minskaya-oblast" }, reasonRu: "Форма сохраняет географический контекст без обещания срока или стоимости выезда.", priority: 3, requiresEvidence: false, fallbackRoute: "/contacts", analyticsEvent: "lead_open_with_context", status: "active" },
  { fromRoute: "/materials/furnitura", fromState: "RESULT", userQuestion: "Как проверить механизм в проекте?", actionType: "DEEPEN", anchorRu: "Проверить фурнитуру в дизайн-проекте", toRoute: "/design-proekt-kuhni", contextPatch: { sourceRoute: "/materials/furnitura" }, reasonRu: "Совместимость механизма зависит от фасада, корпуса и размеров.", priority: 1, requiresEvidence: false, fallbackRoute: "/materials", analyticsEvent: "hardware_transition_click", status: "active" },
  { fromRoute: "/materials/furnitura", fromState: "RESULT", userQuestion: "С чем сравнить выбранный механизм?", actionType: "COMPARE", anchorRu: "Сравнить материалы кухни", toRoute: "/materials", contextPatch: { sourceRoute: "/materials/furnitura" }, reasonRu: "Материал и масса фасада влияют на дальнейшее техническое уточнение.", priority: 2, requiresEvidence: false, fallbackRoute: "/materials", analyticsEvent: "hardware_transition_click", status: "active" },
  { fromRoute: "/materials/furnitura", fromState: "RESULT", userQuestion: "Как передать выбранную задачу?", actionType: "CONVERT", anchorRu: "Передать фурнитуру в расчёт", toRoute: "/materials/furnitura#calculation", contextPatch: { sourceRoute: "/materials/furnitura" }, reasonRu: "Форма получает whitelisted контекст без неподтверждённых характеристик и цены.", priority: 3, requiresEvidence: false, fallbackRoute: "/calculator", analyticsEvent: "lead_open_with_context", status: "active" },
);

for (const config of [...Object.values(STYLE_FAMILY), ...Object.values(SCENARIO_FAMILY)]) {
  const family = "visualLanguage" in config ? "styles" : "scenarios";
  const fromRoute = `/${family}/${config.slug}`;
  config.links.forEach((link, index) => legacyRegistry.push({
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

const routeTargetSchema = z.string().min(1).refine(
  (value) => value.startsWith("#") || /^\/(?:[^?#\s]+\/?)*(?:#[^#\s]+)?$/.test(value),
  "Target должен быть внутренним route или fragment.",
);
const contextPatchSchema = z.object({
  layout: z.string().max(160).optional(),
  style: z.string().max(160).optional(),
  materials: z.array(z.string().max(160)).max(12).optional(),
  hardware: z.array(z.string().max(160)).max(12).optional(),
  scenario: z.string().max(160).optional(),
  location: z.string().max(160).optional(),
  budgetIntent: z.string().max(160).optional(),
  evidencePreference: z.enum(["ideas", "real"]).optional(),
  sourceRoute: z.string().max(200).optional(),
  lastMeaningfulAction: z.string().max(160).optional(),
}).strict();
const transitionSchema: z.ZodType<TransitionEntryV2> = z.object({
  id: z.string().min(1),
  fromRoute: routeTargetSchema,
  fromState: z.string().min(1),
  userQuestion: z.string().min(1),
  actionType: z.enum(["PARENT", "DEEPEN", "COMPARE", "PROOF", "CROSS_FAMILY", "CONVERT", "SUPPORT"]),
  anchorRu: z.string().min(1),
  toRoute: routeTargetSchema,
  contextPatch: contextPatchSchema.optional(),
  reasonRu: z.string().min(1),
  priority: z.number().int().positive(),
  requiresEvidence: z.boolean(),
  evidenceStatus: z.enum(["verified", "ai_concept", "technical_illustration", "process_illustration", "unknown", "evidence_required", "not_applicable"]),
  fallbackRoute: routeTargetSchema,
  analyticsEvent: z.enum(["exploration_entry", "exploration_select", "exploration_compare", "exploration_proof_open", "exploration_transition_click", "exploration_context_clear", "lead_open_with_context"]),
  status: z.enum(["active", "planned", "blocked_evidence", "disabled"]),
});

function stableTransitionId(item: LegacyTransitionRecord) {
  return [
    item.fromRoute === "/" ? "home" : item.fromRoute.slice(1),
    item.fromState,
    item.actionType,
    item.toRoute,
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/giu, "-")
    .replace(/^-|-$/g, "");
}

function normalizeAnalyticsEvent(item: LegacyTransitionRecord): ExplorationAnalyticsEvent {
  if (item.analyticsEvent === "lead_open_with_context") return "lead_open_with_context";
  if (item.actionType === "COMPARE") return "exploration_compare";
  if (item.actionType === "PROOF") return "exploration_proof_open";
  return "exploration_transition_click";
}

function evidenceStatusFor(item: LegacyTransitionRecord): EvidenceStatus {
  if (!item.requiresEvidence) return "not_applicable";
  if (item.toRoute === "/portfolio") return "verified";
  return "evidence_required";
}

function statusFor(item: LegacyTransitionRecord): TransitionStatus {
  if (item.status !== "active") return "disabled";
  if (item.actionType === "PROOF" && evidenceStatusFor(item) !== "verified") return "blocked_evidence";
  return "active";
}

const registry = legacyRegistry.map((item) => transitionSchema.parse({
  ...item,
  id: stableTransitionId(item),
  evidenceStatus: evidenceStatusFor(item),
  analyticsEvent: normalizeAnalyticsEvent(item),
  status: statusFor(item),
}));

const duplicateIds = registry
  .map((item) => item.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
if (duplicateIds.length) throw new Error(`Повторяющиеся transition IDs: ${duplicateIds.join(", ")}`);

export function readTransitions(fromRoute: string, fromState?: string) {
  return registry
    .filter((item) => item.status === "active" && item.fromRoute === fromRoute && (!fromState || item.fromState === fromState))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4);
}

export function getTransitionRegistry() {
  return registry.slice();
}
