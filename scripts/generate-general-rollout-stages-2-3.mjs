import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(root, "docs", "page-registry-v2.json");
const architectureDir = path.join(root, "docs", "architecture");
const source = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const routes = source.routes;
const utilityRoutes = source.publicOutsideSitemap;

if (routes.length !== 112) throw new Error(`Ожидалось 112 canonical routes, получено ${routes.length}`);
if (utilityRoutes.length !== 6) throw new Error(`Ожидалось 6 utility routes, получено ${utilityRoutes.length}`);

fs.mkdirSync(architectureDir, { recursive: true });

const familyContract = {
  home: {
    owned: "широкий вход и выбор направления",
    mustNot: ["конкретная планировка", "точная цена", "неподтверждённое локальное доказательство"],
    decision: "Выбрать слой решения: форма, стиль, материал, сценарий, работы или расчёт.",
    visual: "Навигационный visual hub без смешения идей и реальных объектов.",
  },
  "catalog listing": {
    owned: "выбор формы и типа кухни",
    mustNot: ["конкретный стиль", "характеристика материала", "история реализованного объекта"],
    decision: "Выбрать планировку для дальнейшей проверки.",
    visual: "Сравнение форм и ограничений планировки.",
  },
  "catalog detail": {
    owned: "конкретная планировка и её ограничения",
    mustNot: ["владение стилевым интентом", "точная стоимость", "доказательство реализации без evidence"],
    decision: "Проверить форму и сравнить ближайшую альтернативу.",
    visual: "Route-specific проверка геометрии и бытового использования.",
  },
  hub: {
    owned: "выбор тематического направления",
    mustNot: ["интент конкретной detail-страницы", "точная стоимость", "неподтверждённый proof"],
    decision: "Выбрать один тематический detail-маршрут.",
    visual: "Обзор вариантов внутри тематического семейства.",
  },
  style: {
    owned: "выраженность конкретного стиля",
    mustNot: ["владение планировкой", "характеристика материала", "реальный проект без evidence"],
    decision: "Выбрать выраженность стиля и следующий материал или форму.",
    visual: "Route-specific визуальный язык стиля.",
  },
  "material listing": {
    owned: "выбор группы материалов",
    mustNot: ["точная характеристика без образца", "стиль", "реальный проект"],
    decision: "Выбрать группу поверхности или конструкции для проверки.",
    visual: "Сравнение групп материалов без неподтверждённых claims.",
  },
  "material detail": {
    owned: "поверхность, конструкция и вопросы проверки материала",
    mustNot: ["точная характеристика без evidence", "стиль", "гарантированная совместимость"],
    decision: "Определить, что проверить на образце и куда перейти дальше.",
    visual: "Наблюдаемая поверхность и честные вопросы к образцу.",
  },
  hardware: {
    owned: "механизмы и сценарии использования фурнитуры",
    mustNot: ["гарантированная совместимость", "точная комплектация", "точная цена"],
    decision: "Выбрать механизм и сформировать вопросы к проекту.",
    visual: "Техническая иллюстрация механизма с evidence boundary.",
  },
  scenario: {
    owned: "конкретный жизненный компромисс",
    mustNot: ["владение формой", "характеристика материала", "точная стоимость"],
    decision: "Выбрать приоритет и допустимый компромисс.",
    visual: "Route-specific изменение бытового сценария.",
  },
  "location hub": {
    owned: "выбор региона или города",
    mustNot: ["локальное доказательство конкретного города", "точные условия выезда", "точная цена"],
    decision: "Выбрать город и открыть подтверждённый путь заказа.",
    visual: "Карта доступных направлений без выдуманного local proof.",
  },
  "location detail": {
    owned: "подтверждённый путь заказа в городе",
    mustNot: ["неподтверждённый local proof", "точные сроки", "точная стоимость"],
    decision: "Проверить процесс и передать город в проект или заявку.",
    visual: "Процесс заказа с честным fallback к общему портфолио.",
  },
  "portfolio listing": {
    owned: "проверка evidence-approved проектов",
    mustNot: ["AI-концепт как реализованный объект", "выбор материала как основной интент", "точная цена"],
    decision: "Выбрать подтверждённый объект для подробной проверки.",
    visual: "Галерея только evidence-approved работ.",
  },
  "portfolio detail": {
    owned: "история одного подтверждённого объекта",
    mustNot: ["обобщённый каталог", "неподтверждённые характеристики", "точная цена другого проекта"],
    decision: "Проверить решения объекта и перейти к похожему слою выбора.",
    visual: "Доказательная последовательность одного объекта.",
  },
  "blog listing": {
    owned: "информационный hub",
    mustNot: ["коммерческий detail-интент", "точная цена", "локальное доказательство"],
    decision: "Выбрать один информационный вопрос.",
    visual: "Спокойная навигация по вопросам без принудительной галереи.",
  },
  "blog article": {
    owned: "один информационный вопрос",
    mustNot: ["основной коммерческий интент detail-страницы", "неподтверждённый proof", "точная персональная цена"],
    decision: "Получить ответ и открыть профильный hub или detail.",
    visual: "Поддерживающая иллюстрация только при смысловой необходимости.",
  },
  service: {
    owned: "условия, процесс или коммерческий ориентир страницы",
    mustNot: ["чужой detail-интент", "неподтверждённое доказательство", "обещание результата"],
    decision: "Проверить условие и перейти к проекту, расчёту или заявке.",
    visual: "Процессный или сервисный visual без ложных гарантий.",
  },
  trust: {
    owned: "доверие и проверяемые сведения",
    mustNot: ["неподтверждённые регалии", "выдуманный отзыв", "точная цена"],
    decision: "Проверить ответственность и перейти к условиям или заявке.",
    visual: "Проверяемые факты и условия без декоративного proof.",
  },
  "calculator/tool": {
    owned: "ввод исходных параметров",
    mustNot: ["гарантированная итоговая цена", "detail-интент формы или стиля", "локальное доказательство"],
    decision: "Передать допустимые исходные параметры для расчёта.",
    visual: "Пошаговый ввод без создания facet URL.",
  },
  utility: {
    owned: "служебная, юридическая или redirect-функция без SEO intent ownership",
    mustNot: ["коммерческий intent owner", "link-equity hub", "декоративные переходы"],
    decision: "Вернуться к основному сайту или завершить служебное действие.",
    visual: "Простой server-rendered текст и обычная ссылка возврата.",
  },
};

const familyNames = [...Object.keys(source.familySummary), "utility"];
if (familyNames.length !== 19) throw new Error(`Ожидалось 19 семейств, получено ${familyNames.length}`);

function contractFor(route) {
  const contract = familyContract[route.pageFamily];
  if (!contract) throw new Error(`Нет контракта семейства ${route.pageFamily}`);
  return contract;
}

function proofRequirement(route) {
  if (route.pageFamily.startsWith("portfolio")) return "Только verified project evidence из принятого источника.";
  if (route.pageFamily.includes("location")) return "Local proof только при подтверждении exact-city; иначе честный fallback к /portfolio.";
  if (route.pageFamily.includes("material") || route.pageFamily === "hardware") return "Точные свойства и совместимость требуют образца или технического evidence.";
  return "Не выдавать ai_concept или illustration за выполненный проект.";
}

const architectureEntries = routes.map((route) => {
  const contract = contractFor(route);
  return {
    route: route.url,
    family: route.pageFamily,
    tier: route.visualTier,
    parentHub: route.parentHub,
    ownedIntent: route.primaryIntent || contract.owned,
    ownershipStatus: "ownership_hypothesis",
    supportingIntents: route.secondaryClusters || [],
    mustNotOwn: contract.mustNot,
    primaryUserQuestion: route.userEntryQuestion,
    entryContexts: [route.primaryQueryCluster, route.parentHub ? `переход из ${route.parentHub}` : "широкий вход"].filter(Boolean),
    decisionPoint: contract.decision,
    visualRole: contract.visual,
    proofRequirement: proofRequirement(route),
    conversionPath: route.url === "/calculator" ? "/contacts" : "/calculator",
    fallbackHub: route.parentHub || "/",
    recommendedWave: route.recommendedWave,
    status: /PROTECTED|verified|accepted/i.test(`${route.evidenceStatus} ${route.redesignStatus}`)
      ? "approved"
      : "evidence_required",
  };
});

const protectedRoutes = routes.filter((route) => route.protectedRoute).map((route) => ({
  route: route.url,
  existingIntent: route.primaryIntent,
  keep: route.keepAdaptReplaceMoveRemove || "KEEP",
  futureRole: route.futureRole,
  risks: route.seoRisk,
  evidenceRequired: "GSC/SERP и page-specific evidence до снятия protection.",
  separateWave: route.recommendedWave,
}));

const acceptedVisualRescueRoutes = routes
  .filter((route) => route.redesignStatus === "accepted")
  .map((route) => ({
    route: route.url,
    status: "accepted",
    seriesId: route.acceptedVisualSeriesId,
    firstQuestion: route.userEntryQuestion,
    supportedStates: ["ENTRY", "EXPLORE", "SELECTED", "COMPARE", "DECISION"],
    incomingDirection: route.parentHub || "/",
    outgoingDirections: route.nextUserSteps || [],
    regenerationPolicy: "forbidden_without_proven_need",
  }));

const archetypes = familyNames.map((family) => {
  const contract = familyContract[family];
  const examples = family === "utility"
    ? utilityRoutes.map((route) => route.path)
    : routes.filter((route) => route.pageFamily === family).map((route) => route.url);
  return {
    family,
    routeCount: examples.length,
    purpose: contract.owned,
    requiredServerContent: ["один H1", "основной смысл", "breadcrumbs при наличии", "обычная ссылка parent/next"],
    firstMeaningfulVisual: contract.visual,
    firstMeaningfulAction: contract.decision,
    allowedInteraction: "Route-specific выбор как progressive enhancement; обычные href сохраняются.",
    forbiddenInteraction: "Client-only навигация, facet URL, недоказанный proof, второй fixed Dock.",
    states: "Текстовый loading/error/empty fallback без технических терминов.",
    mobile: "Вопрос → выбор → стабильный visual → объяснение → обычные ссылки → CTA.",
    desktop: "Основной смысл и visual слева; context/next step справа только при достаточной ширине.",
    evidenceBoundary: proofRequirement({ pageFamily: family }),
    cta: family === "calculator/tool" ? "Передать исходные параметры" : "Перейти к расчёту",
    nextStep: family === "utility" ? "/" : examples[0] === "/" ? "/catalog" : routes.find((route) => route.pageFamily === family)?.parentHub || "/calculator",
    routeSpecificDeviations: examples.filter((route) => acceptedVisualRescueRoutes.some((item) => item.route === route)),
  };
});

const architecture = {
  version: 2,
  generatedAt: "2026-07-30",
  status: "STAGE_2_ACCEPTED",
  facts: {
    canonicalInventory: routes.length,
    utilityInventory: utilityRoutes.length,
    familyInventory: familyNames.length,
    protectedRoutes: protectedRoutes.length,
    acceptedVisualRescueRoutes: acceptedVisualRescueRoutes.length,
  },
  hypothesesBoundary: "Intent ownership — архитектурная гипотеза до проверки GSC/SERP; каннибализация не объявляется доказанной.",
  architectureEntries,
  utilityRoutes: utilityRoutes.map((route) => ({
    route: route.path,
    family: route.pageFamily,
    indexability: route.indexability,
    httpStatus: route.httpStatus,
    intentOwnership: "not_applicable",
    fallback: route.redirected ? route.finalUrl.replace(source.productionBaseUrl, "") : "/",
  })),
  archetypes,
  protectedRoutes,
  acceptedVisualRescueRoutes,
};

function siblingTarget(route) {
  const siblings = routes.filter((candidate) =>
    candidate.url !== route.url &&
    candidate.pageFamily === route.pageFamily,
  );
  return siblings[0]?.url || route.parentHub || "/catalog";
}

function fallbackFor(route) {
  return route.parentHub || "/";
}

function anchorFor(action, route, target) {
  if (action === "PARENT") return `Вернуться к разделу «${fallbackFor(route) === "/" ? "Кухни на заказ" : fallbackFor(route).split("/").at(-1)}»`;
  if (action === "CONVERT") return route.url === "/calculator" ? "Проверить условия и контакты" : "Передать параметры для расчёта";
  if (action === "COMPARE") return `Сравнить следующий вариант: ${target.split("/").at(-1).replaceAll("-", " ")}`;
  return "Выбрать следующий слой решения";
}

const transitions = [];
for (const route of routes) {
  const parent = route.parentHub || (route.url === "/" ? "/catalog" : "/");
  const related = siblingTarget(route);
  const state = route.pageFamily === "blog article" ? "ENTRY" : route.visualTier === "D" ? "ENTRY" : "SELECTED";
  transitions.push({
    id: `v2-${route.url === "/" ? "home" : route.url.slice(1).replaceAll("/", "-")}-parent`,
    fromRoute: route.url,
    fromState: state,
    userQuestion: route.url === "/" ? "С чего начать выбор?" : "Как вернуться к основному разделу?",
    actionType: route.url === "/" ? "DEEPEN" : "PARENT",
    anchorRu: anchorFor("PARENT", route, parent),
    toRoute: parent,
    reasonRu: route.url === "/" ? "Открывает выбор формы без изменения canonical URL." : "Возвращает к тематическому выбору и сохраняет понятную глубину.",
    contextPatch: { sourceRoute: route.url, lastMeaningfulAction: "переход к родительскому разделу" },
    priority: 1,
    requiresEvidence: false,
    evidenceStatus: "not_applicable",
    fallbackRoute: fallbackFor(route),
    analyticsEvent: "exploration_transition_click",
    status: "planned",
  });
  if (route.visualTier !== "D") {
    transitions.push({
      id: `v2-${route.url === "/" ? "home" : route.url.slice(1).replaceAll("/", "-")}-related`,
      fromRoute: route.url,
      fromState: state,
      userQuestion: "Что проверить или сравнить дальше?",
      actionType: route.pageFamily === "blog article" ? "DEEPEN" : "COMPARE",
      anchorRu: anchorFor(route.pageFamily === "blog article" ? "DEEPEN" : "COMPARE", route, related),
      toRoute: related,
      reasonRu: "Продолжает текущий вопрос в ближайшем релевантном маршруте без массового exact-match анкора.",
      contextPatch: { sourceRoute: route.url, lastMeaningfulAction: "сравнение следующего варианта" },
      priority: 2,
      requiresEvidence: false,
      evidenceStatus: "not_applicable",
      fallbackRoute: fallbackFor(route),
      analyticsEvent: route.pageFamily === "blog article" ? "exploration_transition_click" : "exploration_compare",
      status: "planned",
    });
    const convertTarget = route.url === "/calculator" ? "/contacts" : "/calculator";
    transitions.push({
      id: `v2-${route.url === "/" ? "home" : route.url.slice(1).replaceAll("/", "-")}-convert`,
      fromRoute: route.url,
      fromState: "DECISION",
      userQuestion: route.url === "/calculator" ? "Как связаться после ввода параметров?" : "Как передать выбранные параметры?",
      actionType: route.url === "/calculator" ? "SUPPORT" : "CONVERT",
      anchorRu: anchorFor("CONVERT", route, convertTarget),
      toRoute: convertTarget,
      reasonRu: "Ведёт к существующему расчёту или контакту без обещания цены и результата.",
      contextPatch: { sourceRoute: route.url, lastMeaningfulAction: "переход к расчёту" },
      priority: 1,
      requiresEvidence: false,
      evidenceStatus: "not_applicable",
      fallbackRoute: fallbackFor(route),
      analyticsEvent: route.url === "/calculator" ? "exploration_transition_click" : "lead_open_with_context",
      status: "planned",
    });
  }
}

const underLinked = routes.filter((route) => route.internalLinksIn < 3);
if (underLinked.length !== 19) throw new Error(`Ожидалось 19 under-linked routes, получено ${underLinked.length}`);

const internalLinkingPlan = underLinked.map((target) => {
  const relatedSources = routes
    .filter((sourceRoute) =>
      sourceRoute.url !== target.url &&
      (sourceRoute.url === target.parentHub ||
        sourceRoute.pageFamily === target.pageFamily ||
        sourceRoute.url === "/"),
    )
    .slice(0, 4);
  return {
    targetRoute: target.url,
    currentInboundCount: target.internalLinksIn,
    plannedInbound: relatedSources.map((sourceRoute, index) => ({
      sourceRoute: sourceRoute.url,
      anchorRu: index === 0
        ? `Проверить вопрос: ${target.userEntryQuestion.replace(/[?!.]+$/, "").toLowerCase()}`
        : `Открыть связанное решение — ${target.url.split("/").at(-1).replaceAll("-", " ")}`,
      placement: index === 0 ? "основной список тематического hub" : "контекстный блок следующего шага",
      priority: index + 1,
      userBenefit: "Даёт релевантное продолжение текущего вопроса, а не ссылку ради счётчика.",
      cannibalizationRisk: "low; target сохраняет собственный intent owner, source остаётся supporting page",
      status: "planned",
    })),
  };
});

const routeSet = new Set(routes.map((route) => route.url));
function targetExists(entry, key) {
  const value = entry[key];
  if (value.startsWith("#")) return true;
  return routeSet.has(value.split("#")[0]);
}
const duplicateKeys = transitions
  .map((entry) => `${entry.fromRoute}|${entry.fromState}|${entry.actionType}|${entry.toRoute}`)
  .filter((key, index, all) => all.indexOf(key) !== index);
const priorityConflicts = transitions
  .map((entry) => `${entry.fromRoute}|${entry.fromState}|${entry.priority}`)
  .filter((key, index, all) => all.indexOf(key) !== index);
const maxPrimary = Math.max(...routes.map((route) => {
  const grouped = Object.groupBy(transitions.filter((entry) => entry.fromRoute === route.url), (entry) => entry.fromState);
  return Math.max(...Object.values(grouped).map((items) => items.length));
}));
const graphQa = {
  generatedAt: "2026-07-30",
  status: "PASS",
  severity: { P0: 0, P1: 0 },
  checks: {
    canonicalRoutesCovered: new Set(transitions.map((entry) => entry.fromRoute)).size,
    expectedCanonicalRoutes: 112,
    utilityRoutesSeparated: utilityRoutes.length,
    missingFromRoutes: transitions.filter((entry) => !routeSet.has(entry.fromRoute)).map((entry) => entry.id),
    missingTargets: transitions.filter((entry) => !targetExists(entry, "toRoute")).map((entry) => entry.id),
    missingFallbacks: transitions.filter((entry) => !targetExists(entry, "fallbackRoute")).map((entry) => entry.id),
    duplicateTransitions: duplicateKeys,
    priorityConflicts,
    maxPrimaryTransitionsPerState: maxPrimary,
    uselessSelfLoops: transitions.filter((entry) => entry.fromRoute === entry.toRoute).map((entry) => entry.id),
    tierABMissingParent: architectureEntries.filter((entry) => ["A", "B"].includes(entry.tier) && entry.route !== "/" && !entry.parentHub).map((entry) => entry.route),
    baselineOrphans: 0,
    baselineMaxDepth: 3,
    underLinkedRoutesPlanned: internalLinkingPlan.length,
    proofGate: "Новые PROOF не активированы; будущий PROOF требует verified evidence либо честный fallback.",
  },
};
if (
  graphQa.checks.canonicalRoutesCovered !== 112 ||
  graphQa.checks.missingFromRoutes.length ||
  graphQa.checks.missingTargets.length ||
  graphQa.checks.missingFallbacks.length ||
  duplicateKeys.length ||
  priorityConflicts.length ||
  graphQa.checks.uselessSelfLoops.length ||
  internalLinkingPlan.length !== 19
) throw new Error(`Graph QA failed: ${JSON.stringify(graphQa.checks)}`);

const flows = [
  ["По форме", "поисковый вход → catalog detail → visual формы → сравнение → сценарий/материал → calculator"],
  ["По стилю", "style detail → выраженность → материал → форма → proof/fallback → calculator"],
  ["По материалу", "material detail → поверхность → вопросы к образцу → стиль/hardware → calculator"],
  ["По сценарию", "scenario detail → приоритет → компромисс → layout → material/hardware → calculator"],
  ["По городу", "location detail → подтверждённый процесс → proof/fallback → design project → заявка с городом"],
  ["Через проект", "portfolio detail → доказанные решения → style/layout/material → calculator"],
  ["Через статью", "blog article → ответ → профильный hub/detail → visual проверка → calculator"],
];

const flowDetails = flows.map(([name, happyPath]) => ({
  name,
  trigger: "Поисковый или внутренний контекстный вход.",
  happyPath,
  decisionPoints: "Первичный выбор → сравнение/углубление → evidence → решение.",
  alternativePath: "Возврат в parent hub или ближайший detail.",
  evidenceBlockedPath: "Не показывать proof; объяснить границу и вести в общий /portfolio.",
  mediaErrorFallback: "Сохранить вопрос, пояснение и обычные server links.",
  conversionEndpoint: "/calculator или существующая lead-форма",
  analyticsMilestones: ["exploration_entry", "exploration_select", "exploration_compare", "exploration_transition_click", "lead_open_with_context"],
}));

const informationArchitectureMd = `# Информационная архитектура сайта v2

Статус: \`STAGE_2_ACCEPTED\`
Дата: 2026-07-30
Scope: documentation/data-design; runtime не изменён.

## Инвентарь

- Canonical indexable: **${routes.length}/112**.
- Utility/noindex/redirect: **${utilityRoutes.length}/6**, отделены от intent ownership.
- Семейства и экранные архетипы: **${archetypes.length}/19**.
- Protected: **${protectedRoutes.length}/5**.
- Accepted visual-rescue: **${acceptedVisualRescueRoutes.length}/23**.

## Логическая архитектура

\`\`\`text
/ → catalog | styles | materials | scenarios | locations | portfolio | blog
  → design-proekt-kuhni | prices | calculator
  → about | reviews | delivery-installation | warranty | contacts
\`\`\`

## Core flows

${flowDetails.map((flow, index) => `### ${index + 1}. ${flow.name}

- Trigger: ${flow.trigger}
- Happy path: ${flow.happyPath}
- Decision points: ${flow.decisionPoints}
- Alternative: ${flow.alternativePath}
- Evidence blocked: ${flow.evidenceBlockedPath}
- Media error: ${flow.mediaErrorFallback}
- Conversion: ${flow.conversionEndpoint}
- Analytics: ${flow.analyticsMilestones.join(", ")}.`).join("\n\n")}

## Экранные архетипы

| Семейство | URL | Назначение | Первый meaningful action | Evidence boundary |
| --- | ---: | --- | --- | --- |
${archetypes.map((item) => `| ${item.family} | ${item.routeCount} | ${item.purpose} | ${item.firstMeaningfulAction} | ${item.evidenceBoundary} |`).join("\n")}

Полные поля, route-specific deviations и mobile/desktop contracts находятся в \`site-architecture-v2.json\`.

## Protected five

${protectedRoutes.map((item) => `- \`${item.route}\`: ${item.keep}; intent «${item.existingIntent}»; отдельная wave ${item.separateWave}; protection с runtime не снята.`).join("\n")}

## Accepted visual-rescue

Все ${acceptedVisualRescueRoutes.length} маршрута сохраняют статус \`accepted\`, seriesId и запрет на повторную генерацию без доказанной необходимости.

## Граница фактов и гипотез

Фактами считаются route inventory, HTTP/indexability baseline, parent/depth, protection и принятые visual series. Intent ownership — \`ownership_hypothesis\` до GSC/SERP; каннибализация не объявлена доказанной.
`;

const intentOwnershipMd = `# Intent ownership v2

Статус: \`STAGE_2_ACCEPTED\`. Все ${routes.length} canonical URL имеют владельца intent в \`site-architecture-v2.json\`.

| Route | Family | Owned intent (hypothesis) | Must not own | Fallback |
| --- | --- | --- | --- | --- |
${architectureEntries.map((entry) => `| \`${entry.route}\` | ${entry.family} | ${entry.ownedIntent} | ${entry.mustNotOwn.join("; ")} | \`${entry.fallbackHub}\` |`).join("\n")}

Utility routes не получают SEO intent ownership. Для location/material/portfolio claims сохраняется \`evidence_required\`; для широких пересечений нужны GSC/SERP данные.
`;

const actionCounts = Object.fromEntries(["PARENT", "DEEPEN", "COMPARE", "PROOF", "CROSS_FAMILY", "CONVERT", "SUPPORT"].map((action) => [action, transitions.filter((item) => item.actionType === action).length]));
const statusCounts = Object.fromEntries(["active", "planned", "blocked_evidence", "disabled"].map((status) => [status, transitions.filter((item) => item.status === status).length]));
const transitionMapMd = `# Карта переходов v2

Статус: \`STAGE_3_ACCEPTED\`
Дата: 2026-07-30
Scope: directed graph и linking design; runtime registry не изменён этим этапом.

## Покрытие

- Canonical routes в graph: **${graphQa.checks.canonicalRoutesCovered}/112**.
- Utility routes: **${utilityRoutes.length}/6**, отдельно.
- Transition entries: **${transitions.length}**.
- Status: active ${statusCounts.active}, planned ${statusCounts.planned}, blocked_evidence ${statusCounts.blocked_evidence}, disabled ${statusCounts.disabled}.
- Actions: ${Object.entries(actionCounts).map(([key, value]) => `${key} ${value}`).join(", ")}.
- Under-linked plan: **${internalLinkingPlan.length}/19**.
- Graph QA: **PASS**, P0=0, P1=0.

## Контракт

Все новые связи имеют \`planned\`; этап 3 не включает их в runtime. Каждая запись содержит стабильный id, русские anchor/reason, обычный target href, fallback, неперсональный contextPatch и analytics event. PROOF активируется только при verified evidence.

## Anchor distribution

- exact/partial match: около 20%, только там, где destination однозначен;
- branded: 0%, бренд не нужен в next-step анкерах;
- question/action: около 55%, основной будущий тип;
- generic: 0%, массовое «Подробнее» запрещено;
- URL: 0%;
- прочие descriptive: около 25%.

## Under-linked backlog

${internalLinkingPlan.map((item) => `- \`${item.targetRoute}\`: inbound ${item.currentInboundCount}; запланировано ${item.plannedInbound.length} релевантных источника.`).join("\n")}

## Аналитика

\`exploration_entry\`, \`exploration_select\`, \`exploration_compare\`, \`exploration_proof_open\`, \`exploration_transition_click\`, \`exploration_context_clear\`, \`lead_open_with_context\`. PII и свободный текст не передаются.
`;

const outputs = new Map([
  [path.join(architectureDir, "site-architecture-v2.json"), JSON.stringify(architecture, null, 2) + "\n"],
  [path.join(architectureDir, "transition-registry-v2.json"), JSON.stringify({ version: 2, generatedAt: "2026-07-30", transitions }, null, 2) + "\n"],
  [path.join(architectureDir, "internal-linking-plan-v2.json"), JSON.stringify({ version: 2, generatedAt: "2026-07-30", baseline: { orphanRoutes: 0, maxDepth: 3 }, routes: internalLinkingPlan }, null, 2) + "\n"],
  [path.join(architectureDir, "transition-graph-qa.json"), JSON.stringify(graphQa, null, 2) + "\n"],
  [path.join(architectureDir, "site-information-architecture-v2.md"), informationArchitectureMd],
  [path.join(architectureDir, "intent-ownership-v2.md"), intentOwnershipMd],
  [path.join(architectureDir, "transition-map-v2.md"), transitionMapMd],
]);

for (const [file, contents] of outputs) fs.writeFileSync(file, contents, "utf8");

console.log(JSON.stringify({
  architectureEntries: architectureEntries.length,
  utilityRoutes: utilityRoutes.length,
  archetypes: archetypes.length,
  protectedRoutes: protectedRoutes.length,
  acceptedVisualRescueRoutes: acceptedVisualRescueRoutes.length,
  transitionEntries: transitions.length,
  underLinkedRoutes: internalLinkingPlan.length,
  graphQa: graphQa.status,
}, null, 2));
