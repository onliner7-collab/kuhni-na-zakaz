import path from "node:path";
import { mapPrismaEntities } from "./prisma-entity-mapper.js";
import { scanSeoSurfaces } from "./seo-surface-scanner.js";
import { getAiPoliciesDir, getAiReportsDir, getAppRoot, getProjectRoot } from "./shared/paths.js";
import {
  readJsonFile,
  safeReadText,
  toProjectRelative,
  writeJsonReport,
  writeTextReport,
} from "./shared/fs-utils.js";
import type {
  LocationPageContentPlansReport,
  LocationPageInventoryEntry,
  LocationPagePlan,
  LocationPageSeoAuditReport,
} from "./shared/types.js";

type LocationPagePolicy = {
  allowed_modes: string[];
  review_required_fields: string[];
  minimum_quality_targets: {
    title_max_chars: number;
    meta_description_target_chars: [number, number];
    body_min_words: number;
    faq_min_items: number;
  };
  non_fabrication_rules: string[];
};

type SourceLocation = {
  source: "seed" | "admin-template";
  status: "existing" | "proposed";
  slug: string;
  city: string;
  region: string | null;
  published: boolean | null;
  fields: Record<string, string | boolean | null>;
  counts: Record<string, number>;
};

function extractBlock(source: string, startToken: string, openChar: string, closeChar: string): string {
  const start = source.indexOf(startToken);
  if (start === -1) return "";
  const openIndex = source.indexOf(openChar, start);
  if (openIndex === -1) return "";

  let depth = 0;
  let inString = false;
  let quoteChar = "";

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const previous = index > 0 ? source[index - 1] : "";

    if ((char === '"' || char === "'" || char === "`") && previous !== "\\") {
      if (!inString) {
        inString = true;
        quoteChar = char;
      } else if (quoteChar === char) {
        inString = false;
        quoteChar = "";
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
  let quoteChar = "";
  let objectStart = -1;

  for (let index = 0; index < arrayBlock.length; index += 1) {
    const char = arrayBlock[index];
    const previous = index > 0 ? arrayBlock[index - 1] : "";

    if ((char === '"' || char === "'" || char === "`") && previous !== "\\") {
      if (!inString) {
        inString = true;
        quoteChar = char;
      } else if (quoteChar === char) {
        inString = false;
        quoteChar = "";
      }
    }

    if (inString) continue;

    if (char === "{") {
      if (depth === 0) objectStart = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && objectStart >= 0) {
        blocks.push(arrayBlock.slice(objectStart, index + 1));
      }
    }
  }

  return blocks;
}

function extractStringField(block: string, field: string): string | null {
  return block.match(new RegExp(`${field}:\\s*"([^"]*)"`, "m"))?.[1] ?? null;
}

function extractBooleanField(block: string, field: string): boolean | null {
  const match = block.match(new RegExp(`${field}:\\s*(true|false)`, "m"));
  return match ? match[1] === "true" : null;
}

function extractArrayBlock(block: string, field: string): string {
  return extractBlock(block, `${field}:`, "[", "]");
}

function countQuotedItems(arrayBlock: string): number {
  return arrayBlock.match(/"([^"]*)"/g)?.length ?? 0;
}

function countObjectItems(arrayBlock: string, discriminator: RegExp): number {
  return arrayBlock.match(discriminator)?.length ?? 0;
}

function countNumberItems(arrayBlock: string): number {
  return arrayBlock
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0).length;
}

function estimateWordCount(values: Array<string | null>): number {
  return values
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(/\s+/))
    .map((word) => word.trim())
    .filter((word) => word.length > 0).length;
}

function extractLocationDataFields(locationFormContent: string): string[] {
  const match = locationFormContent.match(/interface\s+LocationData\s+\{([\s\S]*?)\n\}/m);
  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => line.split(":")[0]?.replace("?", "").trim())
    .filter((field): field is string => Boolean(field))
    .sort();
}

function extractTemplateLocations(locationFormContent: string): SourceLocation[] {
  const templatesBlock = extractBlock(locationFormContent, "const CITY_TEMPLATES", "{", "}");
  const keyRegex = /"([^"]+)"\s*:\s*\{/g;
  const results: SourceLocation[] = [];
  let keyMatch: RegExpExecArray | null;

  while ((keyMatch = keyRegex.exec(templatesBlock)) !== null) {
    const slug = keyMatch[1];
    const objectStart = templatesBlock.indexOf("{", keyMatch.index);
    let depth = 0;
    let objectEnd = objectStart;
    for (; objectEnd < templatesBlock.length; objectEnd += 1) {
      const char = templatesBlock[objectEnd];
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
      if (depth === 0) break;
    }
    const objectBlock = templatesBlock.slice(objectStart, objectEnd + 1);

    results.push({
      source: "admin-template",
      status: "proposed",
      slug,
      city: extractStringField(objectBlock, "city") ?? slug,
      region: extractStringField(objectBlock, "region"),
      published: extractBooleanField(objectBlock, "published"),
      fields: {
        title: extractStringField(objectBlock, "title"),
        h1: extractStringField(objectBlock, "h1"),
        intro: extractStringField(objectBlock, "intro"),
        description: extractStringField(objectBlock, "description"),
        localIntro: extractStringField(objectBlock, "localIntro"),
        seoTitle: extractStringField(objectBlock, "seoTitle"),
        seoDescription: extractStringField(objectBlock, "seoDescription"),
        ctaHeadline: extractStringField(objectBlock, "ctaHeadline"),
        ctaSubtext: extractStringField(objectBlock, "ctaSubtext"),
      },
      counts: {
        features: 0,
        faq: 0,
        uniquePoints: 0,
        contentBlocks: 0,
        images: 0,
        areas: 0,
        caseSlugs: 0,
        reviewIds: 0,
      },
    });
  }

  return results;
}

function extractSeedLocations(seedContent: string): SourceLocation[] {
  const arrayBlock = extractBlock(seedContent, "const LOCATIONS", "[", "]");
  return extractObjectBlocks(arrayBlock).map((block) => {
    const intro = extractStringField(block, "intro");
    const description = extractStringField(block, "description");
    const localIntro = extractStringField(block, "localIntro");
    const contentBlocks = extractArrayBlock(block, "contentBlocks");

    return {
      source: "seed",
      status: "existing",
      slug: extractStringField(block, "slug") ?? "unknown",
      city: extractStringField(block, "city") ?? "unknown",
      region: extractStringField(block, "region"),
      published: extractBooleanField(block, "published"),
      fields: {
        title: extractStringField(block, "title"),
        h1: extractStringField(block, "h1"),
        intro,
        description,
        localIntro,
        seoTitle: extractStringField(block, "seoTitle"),
        seoDescription: extractStringField(block, "seoDescription"),
        ctaHeadline: extractStringField(block, "ctaHeadline"),
        ctaSubtext: extractStringField(block, "ctaSubtext"),
      },
      counts: {
        features: countQuotedItems(extractArrayBlock(block, "features")),
        faq: countObjectItems(extractArrayBlock(block, "faq"), /\{\s*q:/g),
        uniquePoints: countObjectItems(extractArrayBlock(block, "uniquePoints"), /\{\s*emoji:/g),
        contentBlocks: countObjectItems(contentBlocks, /\{\s*type:/g),
        images: countQuotedItems(extractArrayBlock(block, "images")),
        areas: countQuotedItems(extractArrayBlock(block, "areas")),
        caseSlugs: countQuotedItems(extractArrayBlock(block, "caseSlugs")),
        reviewIds: countNumberItems(extractArrayBlock(block, "reviewIds")),
        estimatedBodyWords: estimateWordCount([intro, description, localIntro]) + countObjectItems(contentBlocks, /text:/g) * 30,
      },
    };
  });
}

function extractRouteFields(routeContent: string): string[] {
  return Array.from(new Set([...routeContent.matchAll(/loc\.([A-Za-z0-9_]+)/g)].map((match) => match[1]))).sort();
}

function extractRouteLinks(routeContent: string): string[] {
  return Array.from(new Set([...routeContent.matchAll(/href="([^"]+)"/g)].map((match) => match[1]))).sort();
}

function buildInventoryEntry(page: SourceLocation, policy: LocationPagePolicy, routeFields: string[]): LocationPageInventoryEntry {
  const title = ((page.fields.title as string | null) ?? "").trim();
  const metaDescription = (((page.fields.seoDescription as string | null) ?? (page.fields.description as string | null) ?? "")).trim();
  const estimatedBodyWords = page.counts.estimatedBodyWords ?? estimateWordCount([
    page.fields.intro as string | null,
    page.fields.description as string | null,
    page.fields.localIntro as string | null,
  ]);
  const gaps: string[] = [];
  const riskFlags: string[] = [];

  if (estimatedBodyWords < policy.minimum_quality_targets.body_min_words) gaps.push("body_below_target");
  if (page.counts.faq < policy.minimum_quality_targets.faq_min_items) gaps.push("faq_below_target");
  if (page.counts.caseSlugs === 0) gaps.push("missing_case_links");
  if (page.counts.images === 0) gaps.push("missing_location_images");
  if (!page.fields.localIntro && page.counts.contentBlocks === 0) gaps.push("missing_local_story");
  if (title.length === 0 || title.length > policy.minimum_quality_targets.title_max_chars) gaps.push("title_needs_review");
  if (
    metaDescription.length < policy.minimum_quality_targets.meta_description_target_chars[0] ||
    metaDescription.length > policy.minimum_quality_targets.meta_description_target_chars[1]
  ) {
    gaps.push("meta_description_needs_review");
  }

  if (page.counts.uniquePoints + page.counts.contentBlocks + page.counts.caseSlugs + page.counts.reviewIds < 2) {
    riskFlags.push("low_local_proof");
  }
  if (!page.fields.seoTitle || !page.fields.seoDescription) riskFlags.push("review_required_metadata_gap");
  if (page.status === "proposed") riskFlags.push("proposal_without_verified_content");
  if (policy.review_required_fields.some((field) => routeFields.includes(field))) {
    riskFlags.push("route_uses_review_required_fields");
  }

  return {
    source: page.source,
    status: page.status,
    slug: page.slug,
    city: page.city,
    region: page.region,
    published: page.published,
    fieldPresence: {
      title: Boolean(page.fields.title),
      h1: Boolean(page.fields.h1),
      intro: Boolean(page.fields.intro),
      description: Boolean(page.fields.description),
      localIntro: Boolean(page.fields.localIntro),
      seoTitle: Boolean(page.fields.seoTitle),
      seoDescription: Boolean(page.fields.seoDescription),
      ctaHeadline: Boolean(page.fields.ctaHeadline),
      ctaSubtext: Boolean(page.fields.ctaSubtext),
    },
    contentCounts: {
      features: page.counts.features,
      faq: page.counts.faq,
      uniquePoints: page.counts.uniquePoints,
      contentBlocks: page.counts.contentBlocks,
      images: page.counts.images,
      areas: page.counts.areas,
      caseSlugs: page.counts.caseSlugs,
      reviewIds: page.counts.reviewIds,
    },
    metrics: {
      titleLength: title.length,
      metaDescriptionLength: metaDescription.length,
      estimatedBodyWords,
    },
    gaps,
    riskFlags,
  };
}

function buildPlan(entry: LocationPageInventoryEntry): LocationPagePlan {
  const dataNeeds: string[] = [];
  if (entry.contentCounts.images === 0) dataNeeds.push("verified_location_images");
  if (entry.contentCounts.caseSlugs === 0) dataNeeds.push("verified_local_case_links");
  if (entry.contentCounts.reviewIds === 0) dataNeeds.push("verified_local_review_links");
  if (!entry.fieldPresence.localIntro) dataNeeds.push("city_specific_local_intro");
  if (!entry.fieldPresence.seoTitle || !entry.fieldPresence.seoDescription) dataNeeds.push("reviewed_metadata_copy");

  return {
    slug: entry.slug,
    city: entry.city,
    region: entry.region,
    source: entry.source,
    status: entry.status,
    pageIntent: "commercial_local_service_page",
    targetLocation: { city: entry.city, region: entry.region },
    recommendedDrafts: {
      title: `Кухни на заказ в ${entry.city} | КухниBY`,
      h1: `Кухни на заказ в ${entry.city}`,
      metaDescription: `Кухни на заказ в ${entry.city}: замер, проектирование и установка под задачи клиента. Проверьте локальные условия и факты перед публикацией.`,
    },
    recommendedBodyOutline: [
      `Hero section for ${entry.city} with verified local offer`,
      "City-specific intro with local service proof and work zone",
      "Portfolio and trust section with real cases and reviews",
      "Operational block for measurement, delivery, and installation",
      "FAQ block answering local commercial concerns",
      "CTA block with measurement request and consultation form",
    ],
    recommendedFaqOutline: [
      `Сколько стоит кухня на заказ в ${entry.city}?`,
      `Как проходит замер и проектирование в ${entry.city}?`,
      `Какие сроки изготовления и монтажа для ${entry.city}?`,
      `Есть ли реальные проекты кухни для клиентов из ${entry.city}?`,
    ],
    recommendedCtaBlocks: [
      `Request a measurement in ${entry.city}`,
      "Ask for project consultation and layout discussion",
      "Request a draft estimate only after human-reviewed pricing confirmation",
    ],
    recommendedInternalLinks: [
      { href: "/catalog", reason: "Connect local intent to commercial catalog pages.", priority: "high" },
      { href: "/portfolio", reason: "Support conversion with proof-oriented examples.", priority: "high" },
      { href: "/contacts", reason: "Reinforce local trust and conversion readiness.", priority: "medium" },
    ],
    riskFlags: entry.riskFlags,
    dataNeeds,
  };
}

function buildGapReport(
  audit: LocationPageSeoAuditReport,
  routeLinks: string[],
  locationDataFields: string[],
  policy: LocationPagePolicy,
): string {
  const topRisk = [...audit.inventory].sort((left, right) => right.gaps.length - left.gaps.length).slice(0, 5);
  const lines = [
    "# LocationPage Gap Report",
    "",
    `Generated: ${audit.generatedAt}`,
    "",
    "## Scope",
    "",
    `- Allowed modes: ${policy.allowed_modes.join(", ")}`,
    `- LocationData fields discovered: ${locationDataFields.length}`,
    `- Live route links discovered: ${routeLinks.join(", ")}`,
    `- Review-required fields used by route: ${audit.liveSurface.reviewRequiredFields.join(", ") || "none"}`,
    "",
    "## Summary",
    "",
    `- Existing pages: ${audit.summary.existingPages}`,
    `- Proposed pages: ${audit.summary.proposedPages}`,
    `- Thin content pages: ${audit.summary.thinContentPages}`,
    `- FAQ gaps: ${audit.summary.pagesMissingFaq}`,
    `- Local proof gaps: ${audit.summary.pagesMissingLocalProof}`,
    "",
    "## Priority Pages",
    "",
  ];

  for (const entry of topRisk) {
    lines.push(`### ${entry.city} (${entry.slug})`);
    lines.push(`- Status: ${entry.status}`);
    lines.push(`- Gaps: ${entry.gaps.join(", ") || "none"}`);
    lines.push(`- Risks: ${entry.riskFlags.join(", ") || "none"}`);
    lines.push(`- Estimated body words: ${entry.metrics.estimatedBodyWords}`);
    lines.push("");
  }

  lines.push("## Non-Fabrication Rules", "");
  for (const rule of policy.non_fabrication_rules) {
    lines.push(`- ${rule}`);
  }

  return lines.join("\n");
}

export function generateLocationPagePlannerReports(mode: "read_only" | "draft_safe" = "read_only"): {
  audit: LocationPageSeoAuditReport;
  plans: LocationPageContentPlansReport;
  gapReport: string;
} {
  const projectRoot = getProjectRoot();
  const appRoot = getAppRoot();
  const reportsDir = getAiReportsDir();
  const policyPath = path.join(getAiPoliciesDir(), "locationpage.json");
  const sources = {
    adminFormPath: path.join(appRoot, "components", "admin", "LocationForm.tsx"),
    routePath: path.join(appRoot, "app", "locations", "[city]", "page.tsx"),
    seedPath: path.join(appRoot, "prisma", "seed-locations.ts"),
    strategyPath: path.join(projectRoot, "project-docs", "SEO_STRATEGY.md"),
  };

  const policy = readJsonFile<LocationPagePolicy>(policyPath);
  const prismaMap = mapPrismaEntities();
  const seoMap = scanSeoSurfaces();
  const adminFormContent = safeReadText(sources.adminFormPath);
  const routeContent = safeReadText(sources.routePath);
  const seedContent = safeReadText(sources.seedPath);
  safeReadText(sources.strategyPath);

  const locationDataFields = extractLocationDataFields(adminFormContent);
  const routeFields = extractRouteFields(routeContent);
  const routeLinks = extractRouteLinks(routeContent);
  const seeds = extractSeedLocations(seedContent);
  const templates = extractTemplateLocations(adminFormContent).filter(
    (template) => !seeds.some((seed) => seed.slug === template.slug),
  );

  const inventory = [...seeds, ...templates]
    .map((page) => buildInventoryEntry(page, policy, routeFields))
    .sort((left, right) => left.city.localeCompare(right.city));

  const locationEntity = prismaMap.focusedEntities.find((entity) => entity.name === "LocationPage");
  const routeRelativePath = toProjectRelative(projectRoot, sources.routePath);
  const routeSeoSurface = seoMap.surfaces.find((surface) => surface.path === routeRelativePath);

  const audit: LocationPageSeoAuditReport = {
    generatedAt: new Date().toISOString(),
    allowedModes: policy.allowed_modes,
    inputs: {
      prismaEntitySource: prismaMap.schemaPath,
      routeSource: routeRelativePath,
      adminFormSource: toProjectRelative(projectRoot, sources.adminFormPath),
      seedSource: toProjectRelative(projectRoot, sources.seedPath),
      seoStrategySource: toProjectRelative(projectRoot, sources.strategyPath),
      policySource: toProjectRelative(projectRoot, policyPath),
    },
    liveSurface: {
      routePath: routeRelativePath,
      metadataPath: routeSeoSurface?.path ?? routeRelativePath,
      usedFields: routeFields,
      reviewRequiredFields:
        locationEntity?.fields
          .filter((field) => field.safety === "review_required")
          .map((field) => field.name)
          .filter((field) => routeFields.includes(field))
          .sort() ?? [],
    },
    inventory,
    summary: {
      existingPages: inventory.filter((entry) => entry.status === "existing").length,
      proposedPages: inventory.filter((entry) => entry.status === "proposed").length,
      thinContentPages: inventory.filter((entry) => entry.gaps.includes("body_below_target")).length,
      metadataReviewCandidates: inventory.filter((entry) =>
        entry.gaps.includes("title_needs_review") || entry.gaps.includes("meta_description_needs_review"),
      ).length,
      pagesMissingFaq: inventory.filter((entry) => entry.gaps.includes("faq_below_target")).length,
      pagesMissingLocalProof: inventory.filter((entry) => entry.riskFlags.includes("low_local_proof")).length,
    },
  };

  const plans: LocationPageContentPlansReport = {
    generatedAt: new Date().toISOString(),
    mode,
    plans: inventory.map((entry) => buildPlan(entry)),
  };

  const gapReport = buildGapReport(audit, routeLinks, locationDataFields, policy);

  writeJsonReport(path.join(reportsDir, "locationpage-seo-audit.json"), audit);
  writeJsonReport(path.join(reportsDir, "locationpage-content-plans.json"), plans);
  writeTextReport(path.join(reportsDir, "locationpage-gap-report.md"), gapReport);

  return { audit, plans, gapReport };
}
