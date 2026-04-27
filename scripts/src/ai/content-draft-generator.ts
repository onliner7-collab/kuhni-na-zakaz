import path from "node:path";
import { getAiPoliciesDir, getAiReportsDir, getAppRoot, getProjectRoot } from "./shared/paths.js";
import { readJsonFile, safeReadText, toProjectRelative, writeJsonReport, writeTextReport } from "./shared/fs-utils.js";
import type { ContentDraftPacket, ContentDraftReport } from "./shared/types.js";

type EntityPolicy = {
  name: string;
  field_groups?: {
    draft_safe?: string[];
    review_required?: string[];
  };
};

type EntitiesPolicyFile = {
  entities: EntityPolicy[];
};

type SourceRecord = {
  identifier: string;
  source: "seed" | "admin-template" | "static-template" | "form-template";
  status: "existing" | "proposed" | "template";
  titleLike: string;
  slugLike: string;
  categoryOrRegion: string | null;
  trustedFacts: string[];
  draftHint?: string | null;
  riskFlags: string[];
  dataNeeds: string[];
};

function extractBlock(source: string, startToken: string, openChar: string, closeChar: string): string {
  const start = source.indexOf(startToken);
  if (start === -1) return "";
  const openIndex = source.indexOf(openChar, start);
  if (openIndex === -1) return "";

  let depth = 0;
  let inString = false;
  let quote = "";

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const previous = index > 0 ? source[index - 1] : "";

    if ((char === '"' || char === "'" || char === "`") && previous !== "\\") {
      if (!inString) {
        inString = true;
        quote = char;
      } else if (quote === char) {
        inString = false;
        quote = "";
      }
    }

    if (inString) continue;

    if (char === openChar) depth += 1;
    if (char === closeChar) depth -= 1;
    if (depth === 0) return source.slice(openIndex, index + 1);
  }

  return "";
}

function extractObjectBlocks(arrayBlock: string): string[] {
  const blocks: string[] = [];
  let depth = 0;
  let inString = false;
  let quote = "";
  let start = -1;

  for (let index = 0; index < arrayBlock.length; index += 1) {
    const char = arrayBlock[index];
    const previous = index > 0 ? arrayBlock[index - 1] : "";

    if ((char === '"' || char === "'" || char === "`") && previous !== "\\") {
      if (!inString) {
        inString = true;
        quote = char;
      } else if (quote === char) {
        inString = false;
        quote = "";
      }
    }

    if (inString) continue;

    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        blocks.push(arrayBlock.slice(start, index + 1));
      }
    }
  }

  return blocks;
}

function extractStringField(block: string, field: string): string | null {
  return block.match(new RegExp(`${field}:\\s*"([^"]*)"`, "m"))?.[1] ?? null;
}

function extractStringArray(block: string, field: string): string[] {
  const arrayBlock = extractBlock(block, `${field}:`, "[", "]");
  return [...arrayBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function extractAssignedObjectBlock(source: string, declaration: string): string {
  const start = source.indexOf(declaration);
  if (start === -1) return "";
  const equalsIndex = source.indexOf("=", start);
  if (equalsIndex === -1) return "";
  const openIndex = source.indexOf("{", equalsIndex);
  if (openIndex === -1) return "";

  let depth = 0;
  let inString = false;
  let quote = "";

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const previous = index > 0 ? source[index - 1] : "";

    if ((char === '"' || char === "'" || char === "`") && previous !== "\\") {
      if (!inString) {
        inString = true;
        quote = char;
      } else if (quote === char) {
        inString = false;
        quote = "";
      }
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(openIndex, index + 1);
  }

  return "";
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function getEntityPolicyMap(): Map<string, EntityPolicy> {
  const entities = readJsonFile<EntitiesPolicyFile>(path.join(getAiPoliciesDir(), "entities.json"));
  return new Map(entities.entities.map((entity) => [entity.name, entity]));
}

function getReviewRequiredFields(entity: string, policies: Map<string, EntityPolicy>): string[] {
  return policies.get(entity)?.field_groups?.review_required ?? [];
}

function extractLocationPageSources(appRoot: string): SourceRecord[] {
  const locationForm = safeReadText(path.join(appRoot, "components", "admin", "LocationForm.tsx"));
  const seedLocations = safeReadText(path.join(appRoot, "prisma", "seed-locations.ts"));
  const seedArray = extractBlock(seedLocations, "const LOCATIONS", "[", "]");
  const seedRecords = extractObjectBlocks(seedArray).map((block) => ({
    identifier: extractStringField(block, "slug") ?? "location",
    source: "seed" as const,
    status: "existing" as const,
    titleLike: extractStringField(block, "title") ?? "",
    slugLike: extractStringField(block, "slug") ?? "",
    categoryOrRegion: extractStringField(block, "region"),
    trustedFacts: unique([
      extractStringField(block, "city") ?? "",
      extractStringField(block, "region") ?? "",
      ...extractStringArray(block, "areas").slice(0, 3),
      ...extractStringArray(block, "features").slice(0, 2),
    ].filter(Boolean)),
    draftHint: extractStringField(block, "localIntro") ?? extractStringField(block, "description"),
    riskFlags: [],
    dataNeeds: [
      "verified_local_images",
      "verified_case_links",
      "verified_review_links",
    ],
  }));

  const templatesBlock = extractBlock(locationForm, "const CITY_TEMPLATES", "{", "}");
  const templateKeys = [...templatesBlock.matchAll(/"([^"]+)"\s*:\s*\{/g)].map((match) => match[1]);
  const templateRecords = templateKeys
    .filter((slug) => !seedRecords.some((seed) => seed.slugLike === slug))
    .map((slug) => ({
      identifier: slug,
      source: "admin-template" as const,
      status: "proposed" as const,
      titleLike: `Кухни на заказ в ${slug}`,
      slugLike: slug,
      categoryOrRegion: null,
      trustedFacts: [slug],
      draftHint: null,
      riskFlags: ["proposal_without_verified_local_content"],
      dataNeeds: ["city_specific_intro", "verified_local_proof", "verified_images"],
    }));

  return [...seedRecords, ...templateRecords];
}

function extractKitchenSources(appRoot: string): SourceRecord[] {
  const catalogPage = safeReadText(path.join(appRoot, "app", "catalog", "[slug]", "page.tsx"));
  const staticCategoriesBlock = extractAssignedObjectBlock(catalogPage, "const STATIC_CATEGORIES");
  const categoryKeys = [...staticCategoriesBlock.matchAll(/"([^"]+)"\s*:\s*\{/g)].map((match) => match[1]);

  return categoryKeys.map((slug) => {
    const start = staticCategoriesBlock.indexOf(`"${slug}"`);
    const block = extractBlock(staticCategoriesBlock.slice(start), "{", "{", "}");
    const title = extractStringField(block, "title") ?? slug;
    const description = extractStringField(block, "description");
    const features = extractStringArray(block, "features");

    return {
      identifier: slug,
      source: "static-template",
      status: "existing",
      titleLike: title,
      slugLike: slug,
      categoryOrRegion: title,
      trustedFacts: unique([title, ...(description ? [description] : []), ...features.slice(0, 3)]),
      draftHint: extractStringField(block, "content"),
      riskFlags: ["pricing_requires_review"],
      dataNeeds: ["verified_image_set", "reviewed_price_positioning"],
    } as SourceRecord;
  });
}

function extractBlogSources(appRoot: string): SourceRecord[] {
  const seedBlog = safeReadText(path.join(appRoot, "prisma", "seed-blog.ts"));
  const postsArray = extractBlock(seedBlog, "const POSTS", "[", "]");
  return extractObjectBlocks(postsArray).map((block) => ({
    identifier: extractStringField(block, "slug") ?? "blog-post",
    source: "seed",
    status: "existing",
    titleLike: extractStringField(block, "title") ?? "",
    slugLike: extractStringField(block, "slug") ?? "",
    categoryOrRegion: extractStringField(block, "category"),
    trustedFacts: unique([
      extractStringField(block, "category") ?? "",
      ...extractStringArray(block, "tags").slice(0, 4),
    ].filter(Boolean)),
    draftHint: extractStringField(block, "excerpt"),
    riskFlags: ["no_autopublish"],
    dataNeeds: ["cover_image", "reviewed_related_links"],
  }));
}

function extractPortfolioSources(appRoot: string): SourceRecord[] {
  const formFile = safeReadText(path.join(appRoot, "components", "admin", "PortfolioCaseForm.tsx"));
  const styleFacts = unique([...formFile.matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)].slice(0, 4).map((match) => match[1]));

  return [
    {
      identifier: "portfolio-case-template",
      source: "form-template",
      status: "template",
      titleLike: "Кейс кухни на заказ",
      slugLike: "portfolio-case-template",
      categoryOrRegion: "portfolio",
      trustedFacts: ["portfolio case", ...styleFacts],
      draftHint: "Use a factual project story with task, constraints, solution, and result.",
      riskFlags: ["no_fabricated_results", "no_fabricated_timeline", "no_fabricated_budget"],
      dataNeeds: ["city", "layout", "style", "materials", "timeline", "budget", "result", "images"],
    },
  ];
}

function makeAltSuggestions(entity: ContentDraftPacket["entity"], source: SourceRecord): string[] {
  if (entity === "LocationPage") {
    return [
      `Кухня на заказ в ${source.titleLike}`,
      `Интерьер кухни для клиентов из ${source.identifier}`,
      `Пример кухни на заказ для страницы ${source.slugLike}`,
    ];
  }
  if (entity === "Kitchen") {
    return [
      `${source.titleLike} - общий вид`,
      `${source.titleLike} - фасады и планировка`,
      `${source.titleLike} - пример конфигурации кухни`,
    ];
  }
  if (entity === "BlogPost") {
    return [
      `Иллюстрация к статье ${source.titleLike}`,
      `Схема или пример для статьи ${source.slugLike}`,
      `Обложка статьи ${source.titleLike}`,
    ];
  }
  return [
    `Проект кухни ${source.titleLike}`,
    `Результат проекта ${source.identifier}`,
    `Фото кейса кухни ${source.slugLike}`,
  ];
}

function buildLocationPacket(source: SourceRecord, reviewRequiredFields: string[], mode: "read_only" | "draft_safe"): ContentDraftPacket {
  const cityLike = source.identifier.replace(/-/g, " ");
  return {
    entity: "LocationPage",
    identifier: source.identifier,
    source: source.source,
    status: source.status,
    safeMode: mode,
    inputSummary: {
      titleLike: source.titleLike,
      slugLike: source.slugLike,
      categoryOrRegion: source.categoryOrRegion,
      trustedFacts: source.trustedFacts,
    },
    drafts: {
      title: `Кухни на заказ в ${cityLike} | КухниBY`,
      h1: `Кухни на заказ в ${cityLike}`,
      metaDescription: `Кухни на заказ в ${cityLike}: подготовьте страницу под локальный спрос, кейсы и FAQ. Перед публикацией проверьте локальные факты и коммерческие данные.`,
      bodySections: [
        { heading: "Почему клиенты в городе выбирают кухни на заказ", purpose: "Local intent intro", draft: `Опишите, почему заказ кухни в ${cityLike} требует локального подхода: замер, проект, логистика и монтаж. Используйте только подтверждённые факты.` },
        { heading: "Как проходит работа по городу", purpose: "Operational clarity", draft: "Соберите блок про замер, сроки согласования проекта, монтаж и зону обслуживания. Если данные не подтверждены, оставьте на review." },
        { heading: "Что важно клиентам в этом регионе", purpose: "Local differentiation", draft: "Добавьте 2–3 локально релевантных тезиса: типы квартир, типичные запросы, районные особенности, реальные примеры обращений." },
      ],
      faq: [
        `Сколько стоит кухня на заказ в ${cityLike}?`,
        `Как проходит замер и проектирование в ${cityLike}?`,
        `Есть ли примеры работ и отзывы по ${cityLike}?`,
      ],
      cta: [
        `Записаться на замер в ${cityLike}`,
        "Получить черновой проект кухни",
        "Уточнить доступные материалы и варианты планировки",
      ],
      altTextSuggestions: makeAltSuggestions("LocationPage", source),
      internalLinks: [
        { href: "/catalog", anchor: "Смотреть каталог кухонь", reason: "Commercial support" },
        { href: "/portfolio", anchor: "Посмотреть реальные проекты", reason: "Proof block" },
        { href: "/contacts", anchor: "Связаться с менеджером", reason: "Conversion support" },
      ],
    },
    reviewRequiredFields: reviewRequiredFields.filter((field) => ["slug", "title", "h1", "seoTitle", "seoDescription", "priceFrom", "published"].includes(field)),
    riskFlags: source.riskFlags,
    dataNeeds: source.dataNeeds,
  };
}

function buildKitchenPacket(source: SourceRecord, reviewRequiredFields: string[], mode: "read_only" | "draft_safe"): ContentDraftPacket {
  return {
    entity: "Kitchen",
    identifier: source.identifier,
    source: source.source,
    status: source.status,
    safeMode: mode,
    inputSummary: {
      titleLike: source.titleLike,
      slugLike: source.slugLike,
      categoryOrRegion: source.categoryOrRegion,
      trustedFacts: source.trustedFacts,
    },
    drafts: {
      title: source.titleLike,
      h1: source.titleLike,
      metaDescription: `Подготовьте страницу категории "${source.titleLike}" без ценовых обещаний. Сделайте акцент на сценариях использования, планировке и материалах.`,
      bodySections: [
        { heading: "Для каких помещений подходит", purpose: "Selection intent", draft: `Опишите, в каких кухнях и сценариях лучше всего работает категория "${source.titleLike}".` },
        { heading: "Особенности конструкции и удобства", purpose: "Commercial value", draft: "Соберите 3–5 преимуществ: хранение, эргономика, сочетание с техникой, удобство монтажа." },
        { heading: "Материалы и стили", purpose: "Cross-links", draft: "Объясните, с какими стилями и материалами лучше сочетать этот тип кухни, без ценовых обещаний." },
      ],
      faq: [
        `Кому подходит ${source.titleLike.toLowerCase()}?`,
        "Какие материалы и фасады чаще выбирают для этой категории?",
        "На что обратить внимание перед заказом такой кухни?",
      ],
      cta: [
        "Получить подборку решений по этой категории",
        "Заказать замер и консультацию по планировке",
      ],
      altTextSuggestions: makeAltSuggestions("Kitchen", source),
      internalLinks: [
        { href: "/calculator", anchor: "Рассчитать проект кухни", reason: "Lead support" },
        { href: "/portfolio", anchor: "Посмотреть похожие проекты", reason: "Proof support" },
        { href: "/blog", anchor: "Читать советы по выбору кухни", reason: "Informational support" },
      ],
    },
    reviewRequiredFields: reviewRequiredFields.filter((field) => ["slug", "priceFrom", "priceTo", "seoTitle", "seoDescription", "published"].includes(field)),
    riskFlags: source.riskFlags,
    dataNeeds: source.dataNeeds,
  };
}

function buildBlogPacket(source: SourceRecord, reviewRequiredFields: string[], mode: "read_only" | "draft_safe"): ContentDraftPacket {
  return {
    entity: "BlogPost",
    identifier: source.identifier,
    source: source.source,
    status: source.status,
    safeMode: mode,
    inputSummary: {
      titleLike: source.titleLike,
      slugLike: source.slugLike,
      categoryOrRegion: source.categoryOrRegion,
      trustedFacts: source.trustedFacts,
    },
    drafts: {
      title: source.titleLike,
      h1: source.titleLike,
      metaDescription: `Подготовьте читабельную статью по теме "${source.titleLike}" с практической пользой, внутренними ссылками и review-safe формулировками.`,
      bodySections: [
        { heading: "Что важно знать до выбора", purpose: "Search intent match", draft: `Сформулируйте основной вопрос статьи и коротко объясните, какую проблему читатель решает.` },
        { heading: "Практические критерии выбора", purpose: "Main value", draft: "Дайте структурированный список критериев, на что смотреть и какие ошибки избегать." },
        { heading: "Как это связано с проектом кухни", purpose: "Commercial bridge", draft: "Свяжите тему статьи с реальным выбором кухни, материалами, стилями или кейсами без навязчивого SEO." },
      ],
      faq: [
        `Что важно учесть по теме "${source.titleLike}"?`,
        "Какие ошибки встречаются чаще всего?",
        "Какие страницы сайта помогут углубиться в тему?",
      ],
      cta: [
        "Получить консультацию по своей кухне",
        "Посмотреть связанные кейсы и стили",
      ],
      altTextSuggestions: makeAltSuggestions("BlogPost", source),
      internalLinks: [
        { href: "/catalog", anchor: "Каталог кухонь", reason: "Commercial bridge" },
        { href: "/portfolio", anchor: "Реальные проекты", reason: "Proof bridge" },
        { href: "/contacts", anchor: "Задать вопрос менеджеру", reason: "Conversion support" },
      ],
    },
    reviewRequiredFields: reviewRequiredFields.filter((field) => ["slug", "seoTitle", "seoDescription", "published", "publishedAt"].includes(field)),
    riskFlags: source.riskFlags,
    dataNeeds: source.dataNeeds,
  };
}

function buildPortfolioPacket(source: SourceRecord, reviewRequiredFields: string[], mode: "read_only" | "draft_safe"): ContentDraftPacket {
  return {
    entity: "PortfolioCase",
    identifier: source.identifier,
    source: source.source,
    status: source.status,
    safeMode: mode,
    inputSummary: {
      titleLike: source.titleLike,
      slugLike: source.slugLike,
      categoryOrRegion: source.categoryOrRegion,
      trustedFacts: source.trustedFacts,
    },
    drafts: {
      title: "Кейс кухни на заказ: обзор проекта",
      h1: "Кейс кухни на заказ",
      metaDescription: "Черновой кейс для review: заполните факты проекта, задачи клиента, ограничения, решение и подтверждённый результат перед публикацией.",
      bodySections: [
        { heading: "Задача клиента", purpose: "Problem statement", draft: "Опишите исходный запрос клиента: помещение, пожелания, ограничения и ожидаемый результат. Не добавляйте непроверенные детали." },
        { heading: "Ограничения проекта", purpose: "Credibility", draft: "Зафиксируйте реальные ограничения: размеры, бюджетные рамки, сроки ремонта, инженерные особенности." },
        { heading: "Наше решение", purpose: "Case story", draft: "Покажите, как команда решила задачу: планировка, материалы, механизмы, стилистика. Только подтверждённые решения." },
        { heading: "Результат", purpose: "Outcome proof", draft: "Заполнить после подтверждения фактического результата, сроков, стоимости и отзыва клиента." },
      ],
      faq: [
        "Какие вводные были у этого проекта?",
        "За счёт чего удалось решить ограничения клиента?",
        "Какие материалы и стиль использовались в проекте?",
      ],
      cta: [
        "Обсудить похожий проект со специалистом",
        "Получить консультацию по планировке кухни",
      ],
      altTextSuggestions: makeAltSuggestions("PortfolioCase", source),
      internalLinks: [
        { href: "/portfolio", anchor: "Смотреть другие кейсы", reason: "Portfolio navigation" },
        { href: "/catalog", anchor: "Выбрать подходящий тип кухни", reason: "Commercial bridge" },
        { href: "/contacts", anchor: "Оставить заявку на проект", reason: "Conversion support" },
      ],
    },
    reviewRequiredFields: reviewRequiredFields.filter((field) =>
      ["title", "slug", "city", "priceFrom", "priceTo", "days", "result", "seoTitle", "seoDescription", "published"].includes(field),
    ),
    riskFlags: source.riskFlags,
    dataNeeds: source.dataNeeds,
  };
}

function writeEntityReport(reportsDir: string, filename: string, report: ContentDraftReport): void {
  writeJsonReport(path.join(reportsDir, "drafts", filename), report);
}

export function generateContentDraftReports(mode: "read_only" | "draft_safe" = "draft_safe"): {
  locationPage: ContentDraftReport;
  kitchen: ContentDraftReport;
  blogPost: ContentDraftReport;
  portfolioCase: ContentDraftReport;
  summary: string;
} {
  const appRoot = getAppRoot();
  const reportsDir = getAiReportsDir();
  const policies = getEntityPolicyMap();

  const locationPage: ContentDraftReport = {
    generatedAt: new Date().toISOString(),
    entity: "LocationPage",
    mode,
    packets: extractLocationPageSources(appRoot).map((source) =>
      buildLocationPacket(source, getReviewRequiredFields("LocationPage", policies), mode),
    ),
  };

  const kitchen: ContentDraftReport = {
    generatedAt: new Date().toISOString(),
    entity: "Kitchen",
    mode,
    packets: extractKitchenSources(appRoot).map((source) =>
      buildKitchenPacket(source, getReviewRequiredFields("Kitchen", policies), mode),
    ),
  };

  const blogPost: ContentDraftReport = {
    generatedAt: new Date().toISOString(),
    entity: "BlogPost",
    mode,
    packets: extractBlogSources(appRoot).map((source) =>
      buildBlogPacket(source, getReviewRequiredFields("BlogPost", policies), mode),
    ),
  };

  const portfolioCase: ContentDraftReport = {
    generatedAt: new Date().toISOString(),
    entity: "PortfolioCase",
    mode,
    packets: extractPortfolioSources(appRoot).map((source) =>
      buildPortfolioPacket(source, getReviewRequiredFields("PortfolioCase", policies), mode),
    ),
  };

  writeEntityReport(reportsDir, "locationpage-drafts.json", locationPage);
  writeEntityReport(reportsDir, "kitchen-drafts.json", kitchen);
  writeEntityReport(reportsDir, "blogpost-drafts.json", blogPost);
  writeEntityReport(reportsDir, "portfoliocase-drafts.json", portfolioCase);

  const summary = [
    "# Content Draft Summary",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Entities",
    "",
    `- LocationPage packets: ${locationPage.packets.length}`,
    `- Kitchen packets: ${kitchen.packets.length}`,
    `- BlogPost packets: ${blogPost.packets.length}`,
    `- PortfolioCase packets: ${portfolioCase.packets.length}`,
    "",
    "## Guardrails",
    "",
    "- No DB writes",
    "- No publish changes",
    "- No slug changes",
    "- No metadata core changes",
    "- No fabricated prices, guarantees, timelines, or outcomes",
  ].join("\n");

  writeTextReport(path.join(reportsDir, "drafts", "content-draft-summary.md"), summary);

  return { locationPage, kitchen, blogPost, portfolioCase, summary };
}
