import fs from "node:fs";
import path from "node:path";
import { scanSeoSurfaces } from "./seo-surface-scanner.js";
import { readJsonFile, writeJsonReport, writeTextReport } from "./shared/fs-utils.js";
import { getAiPoliciesDir, getAiReportsDir, getProjectRoot } from "./shared/paths.js";
import type {
  PrismaEntityMapReport,
  SeoMetadataAuditReport,
  SeoMetadataAuditSurface,
  SeoMetadataEntityAudit,
  SeoMetadataRiskLevel,
  SeoMetadataRiskMapEntry,
  SeoMetadataRiskMapReport,
  SeoSurfaceMapReport,
} from "./shared/types.js";

type EntitiesPolicyFile = {
  entities: Array<{
    name: string;
    field_groups?: {
      draft_safe?: string[];
      review_required?: string[];
    };
  }>;
};

const FIRST_WAVE_ENTITIES = ["LocationPage", "Kitchen", "BlogPost", "PortfolioCase"] as const;

const ENTITY_ROUTE_MAP: Record<(typeof FIRST_WAVE_ENTITIES)[number], string> = {
  LocationPage: "artifacts/kuhni-na-zakaz/app/locations/[city]/page.tsx",
  Kitchen: "artifacts/kuhni-na-zakaz/app/catalog/[slug]/page.tsx",
  BlogPost: "artifacts/kuhni-na-zakaz/app/blog/[slug]/page.tsx",
  PortfolioCase: "artifacts/kuhni-na-zakaz/app/portfolio/[slug]/page.tsx",
};

function getSeoReportsDir(): string {
  return path.join(getAiReportsDir(), "seo");
}

function getEntitiesPolicy(): EntitiesPolicyFile {
  return readJsonFile<EntitiesPolicyFile>(path.join(getAiPoliciesDir(), "entities.json"));
}

function getEntityMap(): PrismaEntityMapReport {
  return readJsonFile<PrismaEntityMapReport>(path.join(getAiReportsDir(), "prisma-entity-map.json"));
}

function readProjectFile(projectRelativePath: string): string {
  return fs.readFileSync(path.join(getProjectRoot(), projectRelativePath), "utf8");
}

function getRiskLevel(signals: string[]): SeoMetadataRiskLevel {
  if (signals.some((signal) => ["robots_control", "sitemap_control", "base_url_mismatch", "slug_sensitive_logic"].includes(signal))) {
    return "critical";
  }
  if (
    signals.some((signal) =>
      ["canonical_logic", "publish_sensitive_logic", "live_metadata_override", "unpublished_metadata_fetch"].includes(signal),
    )
  ) {
    return "high";
  }
  if (signals.some((signal) => ["route_metadata", "entity_seo_fields_live"].includes(signal))) {
    return "medium";
  }
  return "low";
}

function collectMetadataKeys(text: string): string[] {
  const keys: string[] = [];
  if (/title\s*:/.test(text)) keys.push("title");
  if (/description\s*:/.test(text)) keys.push("description");
  if (/keywords\s*:/.test(text)) keys.push("keywords");
  if (/openGraph\s*:/.test(text)) keys.push("openGraph");
  if (/twitter\s*:/.test(text)) keys.push("twitter");
  if (/robots\s*:/.test(text)) keys.push("robots");
  if (/alternates\s*:/.test(text)) keys.push("alternates");
  if (/canonical/.test(text)) keys.push("canonical");
  if (/metadataBase/.test(text)) keys.push("metadataBase");
  return [...new Set(keys)];
}

function collectSourceOfTruth(pathname: string, text: string): string[] {
  const sources: string[] = [];
  if (pathname.endsWith("layout.tsx") && /export const metadata/.test(text)) sources.push("layout metadata export");
  if (pathname.endsWith("robots.ts")) sources.push("robots metadata route");
  if (pathname.endsWith("sitemap.ts")) sources.push("sitemap metadata route");
  if (/generateMetadata/.test(text)) sources.push("route-level generateMetadata");
  if (/process\.env\.NEXT_PUBLIC_SITE_URL/.test(text)) sources.push("NEXT_PUBLIC_SITE_URL");
  if (/prisma\./.test(text)) sources.push("prisma-backed metadata");
  if (/STATIC_[A-Z_]+/.test(text)) sources.push("static fallback metadata");
  return [...new Set(sources)];
}

function collectEntityHits(text: string): string[] {
  const hits: string[] = [];
  if (/prisma\.locationPage/.test(text)) hits.push("LocationPage");
  if (/prisma\.kitchen/.test(text)) hits.push("Kitchen");
  if (/prisma\.blogPost/.test(text)) hits.push("BlogPost");
  if (/prisma\.portfolioCase/.test(text)) hits.push("PortfolioCase");
  return hits;
}

function analyzeSurface(pathname: string, text: string): SeoMetadataAuditSurface {
  const riskSignals: string[] = [];
  const notes: string[] = [];
  const nextActions: string[] = [];

  if (/generateMetadata/.test(text)) riskSignals.push("route_metadata");
  if (/alternates\s*:\s*\{\s*canonical/.test(text)) {
    riskSignals.push("canonical_logic");
    notes.push("Route controls canonical output.");
    nextActions.push("Treat canonical changes as review_required.");
  }
  if (/slug/.test(text)) {
    riskSignals.push("slug_sensitive_logic");
    notes.push("Surface depends on slug-derived routing or canonical behavior.");
    nextActions.push("Keep slug-linked metadata work in review_required.");
  }
  if (/published/.test(text) || /status:\s*ReviewStatus\.PUBLISHED/.test(text)) {
    riskSignals.push("publish_sensitive_logic");
    notes.push("Surface depends on published/indexable state.");
    nextActions.push("Review publish-sensitive metadata changes manually.");
  }
  if (pathname.endsWith("robots.ts")) {
    riskSignals.push("robots_control");
    notes.push("Robots behavior affects crawl and indexing policy.");
    nextActions.push("Audit robots changes under review_required only.");
  }
  if (pathname.endsWith("sitemap.ts")) {
    riskSignals.push("sitemap_control");
    notes.push("Sitemap behavior affects live discovery and indexing.");
    nextActions.push("Audit sitemap generation changes before any proposal.");
  }
  if (/seoTitle|seoDescription|keywords/.test(text)) {
    riskSignals.push("live_metadata_override");
    notes.push("Surface can override live title/description/keywords from entity data.");
  }
  if (/findUnique\(\{\s*where:\s*\{\s*slug\s*\}\s*\}\)/s.test(text) && !/published\s*:\s*true/.test(text)) {
    riskSignals.push("unpublished_metadata_fetch");
    notes.push("Metadata path can read entity by slug without explicit published filter.");
    nextActions.push("Verify whether unpublished entities can affect live metadata.");
  }

  return {
    path: pathname,
    surfaceType: pathname.endsWith("layout.tsx")
      ? "global-metadata"
      : pathname.endsWith("robots.ts")
        ? "robots"
        : pathname.endsWith("sitemap.ts")
          ? "sitemap"
          : "route-generateMetadata",
    metadataKeys: collectMetadataKeys(text),
    metadataSourceOfTruth: collectSourceOfTruth(pathname, text),
    affectedEntities: collectEntityHits(text),
    riskSignals: [...new Set(riskSignals)],
    riskLevel: getRiskLevel(riskSignals),
    reviewRequired: riskSignals.some((signal) =>
      ["slug_sensitive_logic", "canonical_logic", "publish_sensitive_logic", "robots_control", "sitemap_control"].includes(signal),
    ),
    notes,
    suggestedNextActions: [...new Set(nextActions)],
  };
}

function getAppLevelConflicts(surfaces: SeoMetadataAuditSurface[]): { conflicts: string[]; gaps: string[] } {
  const conflicts: string[] = [];
  const gaps: string[] = [];

  const layoutText = readProjectFile("artifacts/kuhni-na-zakaz/app/layout.tsx");
  const robotsText = readProjectFile("artifacts/kuhni-na-zakaz/app/robots.ts");
  const sitemapText = readProjectFile("artifacts/kuhni-na-zakaz/app/sitemap.ts");

  const layoutBase = layoutText.match(/NEXT_PUBLIC_SITE_URL\s*\|\|\s*"([^"]+)"/)?.[1] ?? null;
  const robotsBase = robotsText.match(/NEXT_PUBLIC_SITE_URL\s*\|\|\s*"([^"]+)"/)?.[1] ?? null;
  const sitemapBase = sitemapText.match(/NEXT_PUBLIC_SITE_URL\s*\|\|\s*"([^"]+)"/)?.[1] ?? null;

  if (layoutBase && robotsBase && layoutBase !== robotsBase) {
    conflicts.push(`Base URL mismatch: layout uses "${layoutBase}" but robots uses "${robotsBase}".`);
  }
  if (layoutBase && sitemapBase && layoutBase !== sitemapBase) {
    conflicts.push(`Base URL mismatch: layout uses "${layoutBase}" but sitemap uses "${sitemapBase}".`);
  }

  const routeSurfaces = surfaces.filter((surface) => surface.surfaceType === "route-generateMetadata");
  const routesWithoutCanonical = routeSurfaces.filter((surface) => !surface.metadataKeys.includes("canonical"));
  if (routesWithoutCanonical.length > 0) {
    gaps.push(`Some route-level metadata surfaces do not declare canonical output: ${routesWithoutCanonical.map((surface) => surface.path).join(", ")}.`);
  }

  if (!/metadataBase/.test(layoutText)) {
    gaps.push("Global layout metadata does not declare metadataBase.");
  }

  return { conflicts, gaps };
}

function getEntityAudit(
  entity: (typeof FIRST_WAVE_ENTITIES)[number],
  entityMap: PrismaEntityMapReport,
  entitiesPolicy: EntitiesPolicyFile,
): SeoMetadataEntityAudit {
  const routeFile = ENTITY_ROUTE_MAP[entity];
  const routeText = readProjectFile(routeFile);
  const model = entityMap.focusedEntities.find((item) => item.name === entity);
  const policy = entitiesPolicy.entities.find((item) => item.name === entity);
  const seoFieldsPresent =
    model?.fields
      .map((field) => field.name)
      .filter((field) => ["seoTitle", "seoDescription", "seoKeywords", "slug", "published", "publishedAt", "title", "description", "excerpt"].includes(field)) ?? [];

  const liveMetadataFields = seoFieldsPresent.filter((field) => routeText.includes(field));
  const dependencies: string[] = [];
  if (/seoTitle/.test(routeText)) dependencies.push("seoTitle overrides title");
  if (/seoDescription/.test(routeText)) dependencies.push("seoDescription overrides description");
  if (/seoKeywords/.test(routeText)) dependencies.push("seoKeywords affects live keywords");
  if (/slug/.test(routeText)) dependencies.push("slug affects canonical or route lookup");
  if (/published/.test(routeText)) dependencies.push("published affects metadata eligibility");
  if (/title/.test(routeText) && /seoTitle\s*\|\|/.test(routeText)) dependencies.push("title is fallback for live title");
  if (/description/.test(routeText) || /excerpt/.test(routeText)) dependencies.push("body copy is fallback for live description");

  const reviewOnly = [
    ...new Set(
      [
        ...((policy?.field_groups?.review_required ?? []).filter((field) =>
          ["slug", "seoTitle", "seoDescription", "published", "publishedAt", "title"].includes(field),
        )),
        "canonical behavior",
        "route-level generateMetadata",
      ].filter(Boolean),
    ),
  ];

  const safeToDraft = [
    "draft SEO title suggestions in report artifacts only",
    "draft meta description suggestions in report artifacts only",
    "draft title/excerpt copy suggestions without applying live metadata changes",
  ];

  const riskSignals: string[] = [];
  if (/slug/.test(routeText)) riskSignals.push("slug_sensitive_logic");
  if (/published/.test(routeText)) riskSignals.push("publish_sensitive_logic");
  if (/alternates\s*:\s*\{\s*canonical/.test(routeText)) riskSignals.push("canonical_logic");
  if (/seoTitle|seoDescription|seoKeywords/.test(routeText)) riskSignals.push("entity_seo_fields_live");
  if (/findUnique\(\{\s*where:\s*\{\s*slug\s*\}\s*\}\)/s.test(routeText) && !/published\s*:\s*true/.test(routeText)) {
    riskSignals.push("unpublished_metadata_fetch");
  }

  const notes: string[] = [];
  if (entity === "Kitchen" && /findUnique\(\{\s*where:\s*\{\s*slug\s*\}\s*\}\)/s.test(routeText)) {
    notes.push("Kitchen generateMetadata resolves by slug before published check in page render.");
  }
  if (entity === "BlogPost" && /findUnique\(\{\s*where:\s*\{\s*slug\s*\}\s*\}\)/s.test(routeText)) {
    notes.push("BlogPost generateMetadata resolves by slug before published check in page render.");
  }
  if (entity === "LocationPage") {
    notes.push("LocationPage live metadata uses seoTitle/seoDescription with title/description fallback and canonical based on route param.");
  }
  if (entity === "PortfolioCase") {
    notes.push("PortfolioCase also drives live keywords through seoKeywords.");
  }

  return {
    entity,
    routeFile,
    seoFieldsPresent,
    liveMetadataFields: [...new Set(liveMetadataFields)],
    liveMetadataDependencies: [...new Set(dependencies)],
    metadataSourceOfTruth: collectSourceOfTruth(routeFile, routeText),
    riskLevel: getRiskLevel(riskSignals),
    safeToDraft,
    reviewOnly,
    notes,
  };
}

function buildRiskMap(appSurfaces: SeoMetadataAuditSurface[], entityAudits: SeoMetadataEntityAudit[]): SeoMetadataRiskMapEntry[] {
  const entries: SeoMetadataRiskMapEntry[] = [];

  for (const surface of appSurfaces) {
    for (const signal of surface.riskSignals) {
      entries.push({
        surface: surface.path,
        entity: surface.affectedEntities[0] ?? null,
        category: "app-level",
        riskLevel: surface.riskLevel,
        trigger: signal,
        requiredMode: surface.reviewRequired ? "review_required" : "read_only",
        reasons: surface.notes.length > 0 ? surface.notes : [`Detected ${signal} in ${surface.path}.`],
      });
    }
  }

  for (const entity of entityAudits) {
    const signals = [
      ...entity.liveMetadataDependencies.filter((item) => /slug|canonical|published/i.test(item)),
      ...entity.reviewOnly,
    ];
    for (const signal of [...new Set(signals)]) {
      entries.push({
        surface: entity.routeFile,
        entity: entity.entity,
        category: "entity-level",
        riskLevel: entity.riskLevel,
        trigger: signal,
        requiredMode: /draft/i.test(signal) ? "read_only" : "review_required",
        reasons: entity.notes,
      });
    }
  }

  return entries.sort((left, right) => left.surface.localeCompare(right.surface));
}

function buildMarkdownSummary(report: SeoMetadataAuditReport): string {
  const lines = [
    "# SEO Metadata Audit Summary",
    "",
    `Generated: ${report.generatedAt}`,
    `Mode: ${report.mode}`,
    "",
    "## App-Level",
    "",
    `- Affected files: ${report.appLevel.affectedFiles.length}`,
    `- Risky surfaces: ${report.appLevel.riskySurfaces.length}`,
    "",
  ];

  if (report.appLevel.conflicts.length > 0) {
    lines.push("### Conflicts", "");
    for (const conflict of report.appLevel.conflicts) lines.push(`- ${conflict}`);
    lines.push("");
  }

  if (report.appLevel.gaps.length > 0) {
    lines.push("### Gaps", "");
    for (const gap of report.appLevel.gaps) lines.push(`- ${gap}`);
    lines.push("");
  }

  lines.push("## Entity-Level", "");
  for (const entity of report.entityLevel.entities) {
    lines.push(`- ${entity.entity}: live fields -> ${entity.liveMetadataFields.join(", ") || "none"}; risk=${entity.riskLevel}`);
  }

  lines.push("", "## Safe To Draft", "");
  for (const item of report.summary.safeToDraft) lines.push(`- ${item}`);

  lines.push("", "## Review Only", "");
  for (const item of report.summary.reviewOnly) lines.push(`- ${item}`);

  lines.push("", "## Suggested Next Actions", "");
  for (const action of report.summary.suggestedNextActions) lines.push(`- ${action}`);

  return lines.join("\n");
}

export function runSeoMetadataAudit(): {
  metadataAudit: SeoMetadataAuditReport;
  riskMap: SeoMetadataRiskMapReport;
} {
  const projectRoot = getProjectRoot();
  const seoReportsDir = getSeoReportsDir();
  const surfaceMap = scanSeoSurfaces() as SeoSurfaceMapReport;
  const entityMap = getEntityMap();
  const entitiesPolicy = getEntitiesPolicy();

  const appFiles = [
    "artifacts/kuhni-na-zakaz/app/layout.tsx",
    "artifacts/kuhni-na-zakaz/app/robots.ts",
    "artifacts/kuhni-na-zakaz/app/sitemap.ts",
    ...surfaceMap.surfaces.filter((surface) => surface.type === "route-generateMetadata").map((surface) => surface.path),
  ];

  const uniqueAppFiles = [...new Set(appFiles)].filter((file) => fs.existsSync(path.join(projectRoot, file)));
  const appSurfaces = uniqueAppFiles
    .map((file) => analyzeSurface(file, readProjectFile(file)))
    .sort((left, right) => left.path.localeCompare(right.path));

  const { conflicts, gaps } = getAppLevelConflicts(appSurfaces);
  const entityAudits = FIRST_WAVE_ENTITIES.map((entity) => getEntityAudit(entity, entityMap, entitiesPolicy));
  const riskMapEntries = buildRiskMap(appSurfaces, entityAudits);

  const summaryRisk = getRiskLevel([
    ...appSurfaces.flatMap((surface) => surface.riskSignals),
    ...entityAudits.flatMap((entity) => entity.liveMetadataDependencies),
  ]);

  const metadataAudit: SeoMetadataAuditReport = {
    generatedAt: new Date().toISOString(),
    mode: "read_only",
    sourceInputs: [
      "artifacts/kuhni-na-zakaz/app/layout.tsx",
      "artifacts/kuhni-na-zakaz/app/robots.ts",
      "artifacts/kuhni-na-zakaz/app/sitemap.ts",
      "ai/reports/prisma-entity-map.json",
      "ai/policies/entities.json",
      "ai/reports/seo-surface-map.json",
    ],
    appLevel: {
      affectedFiles: uniqueAppFiles,
      globalMetadataFiles: [
        "artifacts/kuhni-na-zakaz/app/layout.tsx",
        "artifacts/kuhni-na-zakaz/app/robots.ts",
        "artifacts/kuhni-na-zakaz/app/sitemap.ts",
      ],
      routeMetadataFiles: appSurfaces
        .filter((surface) => surface.surfaceType === "route-generateMetadata")
        .map((surface) => surface.path),
      metadataSourceOfTruth: [...new Set(appSurfaces.flatMap((surface) => surface.metadataSourceOfTruth))],
      conflicts,
      gaps,
      riskySurfaces: appSurfaces.filter((surface) => surface.reviewRequired).map((surface) => surface.path),
      surfaces: appSurfaces,
    },
    entityLevel: {
      affectedEntities: [...FIRST_WAVE_ENTITIES],
      entities: entityAudits,
    },
    summary: {
      affectedFiles: uniqueAppFiles,
      affectedEntities: [...FIRST_WAVE_ENTITIES],
      metadataSourceOfTruth: [
        "layout metadata export",
        "route-level generateMetadata",
        "robots metadata route",
        "sitemap metadata route",
        "prisma-backed metadata",
        "static fallback metadata",
      ],
      riskLevel: summaryRisk,
      suggestedNextActions: [
        "Review base URL consistency across layout, robots, and sitemap.",
        "Review Kitchen and BlogPost metadata fetch paths for unpublished slug behavior.",
        "Keep canonical, slug, publish, robots, and sitemap proposals in review_required.",
      ],
      safeToDraft: [
        "Draft SEO title suggestions in report artifacts only.",
        "Draft meta description suggestions in report artifacts only.",
        "Draft entity-level SEO recommendation packets without applying live metadata changes.",
      ],
      reviewOnly: [
        "slug-linked route metadata behavior",
        "canonical behavior",
        "published/indexing behavior",
        "robots policy",
        "sitemap generation",
        "live route-level generateMetadata changes",
      ],
    },
  };

  const riskMap: SeoMetadataRiskMapReport = {
    generatedAt: metadataAudit.generatedAt,
    mode: "read_only",
    entries: riskMapEntries,
  };

  writeJsonReport(path.join(seoReportsDir, "metadata-audit.json"), metadataAudit);
  writeJsonReport(path.join(seoReportsDir, "live-seo-risk-map.json"), riskMap);
  writeTextReport(path.join(seoReportsDir, "metadata-audit-summary.md"), buildMarkdownSummary(metadataAudit));

  return { metadataAudit, riskMap };
}
