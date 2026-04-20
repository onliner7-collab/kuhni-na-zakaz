import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { z } from "zod";

import { prisma } from "@/lib/db";

type ImportEntity =
  | "kitchens"
  | "styles"
  | "materials"
  | "scenarios"
  | "portfolio"
  | "locations";

type ImportOperation = "create" | "update" | "unchanged" | "invalid";
type IssueSeverity = "error" | "warning";

type ImportIssue = {
  severity: IssueSeverity;
  sheet: string;
  rowNumber?: number;
  field?: string;
  message: string;
};

type ImportRowPreview = {
  sheet: string;
  entity: ImportEntity;
  rowNumber: number;
  externalId: string | null;
  slug: string | null;
  title: string | null;
  operation: ImportOperation;
  issues: ImportIssue[];
  changedFields: string[];
};

type ImportSummary = {
  totalRows: number;
  create: number;
  update: number;
  unchanged: number;
  invalid: number;
  errors: number;
  warnings: number;
  bySheet: Record<
    string,
    {
      totalRows: number;
      create: number;
      update: number;
      unchanged: number;
      invalid: number;
    }
  >;
};

type SheetSessionState<T> = {
  entity: ImportEntity;
  sheetName: string;
  rows: Array<{
    rowNumber: number;
    preview: ImportRowPreview;
    payload: T | null;
  }>;
};

type ImportSessionRecord = {
  id: string;
  version: "bulk-import-v1";
  fileName: string;
  createdAt: string;
  expiresAt: string;
  appliedAt: string | null;
  workbookSheets: string[];
  summary: ImportSummary;
  issues: ImportIssue[];
  rows: ImportRowPreview[];
  data: {
    kitchens: SheetSessionState<KitchenPayload>;
    styles: SheetSessionState<StylePayload>;
    materials: SheetSessionState<MaterialPayload>;
    scenarios: SheetSessionState<ScenarioPayload>;
    portfolio: SheetSessionState<PortfolioPayload>;
    locations: SheetSessionState<LocationPayload>;
  };
  applyResult?: ApplyImportResult;
};

type ApplyImportResult = {
  appliedAt: string;
  summary: {
    created: number;
    updated: number;
    unchanged: number;
    invalid: number;
  };
};

type PreviewResponse = {
  sessionId: string;
  version: "bulk-import-v1";
  fileName: string;
  createdAt: string;
  expiresAt: string;
  appliedAt: string | null;
  workbookSheets: string[];
  summary: ImportSummary;
  issues: ImportIssue[];
  rows: ImportRowPreview[];
  applyResult?: ApplyImportResult;
};

type RawSheetRow = Record<string, unknown>;
type ComparableRow = Record<string, unknown>;

const SESSION_TTL_MS = 1000 * 60 * 60;
const SESSIONS_DIR = path.join(process.cwd(), ".tmp", "bulk-import-sessions");
const DIRECT_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".bmp",
  ".ico",
  ".tif",
  ".tiff",
]);
const BLOCKED_IMAGE_PAGE_HOSTS = new Set([
  "postimg.cc",
  "www.postimg.cc",
  "postimages.org",
  "www.postimages.org",
]);
const IMAGE_FETCH_TIMEOUT_MS = 8000;

const transliterationMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "j",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s.-]+/g, "")
    .replace(/[()[\]]+/g, "");
}

function canonicalizeRow(row: RawSheetRow) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(String(key)), value])
  );
}

function getField(row: RawSheetRow, aliases: string[]) {
  for (const alias of aliases) {
    const value = row[normalizeHeader(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return undefined;
}

function asString(value: unknown, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function asNullableString(value: unknown) {
  const normalized = asString(value, "");
  return normalized === "" ? null : normalized;
}

function asInt(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  const normalized = asString(value, "");
  if (normalized === "") return fallback;
  const parsed = Number(normalized.replace(/\s+/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  const normalized = asString(value, "").toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "yes", "y", "да", "published", "опубликовано"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "n", "нет", "draft", "черновик"].includes(normalized)) {
    return false;
  }
  return fallback;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }

  const normalized = asString(value, "");
  if (!normalized) return [];
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    try {
      const parsed = JSON.parse(normalized);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => asString(item)).filter(Boolean);
      }
    } catch {
      // fallback to split
    }
  }

  return normalized
    .split(/\r?\n|[,;|]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asNumberArray(value: unknown) {
  return asStringArray(value)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))
    .map((item) => Math.trunc(item));
}

function asObjectArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
  }

  const normalized = asString(value, "");
  if (!normalized) return [];

  try {
    const parsed = JSON.parse(normalized);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is Record<string, unknown> => !!item && typeof item === "object"
      );
    }
  } catch {
    // ignore invalid JSON
  }

  return [];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => transliterationMap[char] ?? char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function defaultSummary(): ImportSummary {
  return {
    totalRows: 0,
    create: 0,
    update: 0,
    unchanged: 0,
    invalid: 0,
    errors: 0,
    warnings: 0,
    bySheet: {},
  };
}

function ensureSheetSummary(summary: ImportSummary, sheetName: string) {
  if (!summary.bySheet[sheetName]) {
    summary.bySheet[sheetName] = {
      totalRows: 0,
      create: 0,
      update: 0,
      unchanged: 0,
      invalid: 0,
    };
  }

  return summary.bySheet[sheetName];
}

function addPreviewToSummary(summary: ImportSummary, preview: ImportRowPreview) {
  summary.totalRows += 1;
  const bySheet = ensureSheetSummary(summary, preview.sheet);
  bySheet.totalRows += 1;

  if (preview.operation === "create") {
    summary.create += 1;
    bySheet.create += 1;
  } else if (preview.operation === "update") {
    summary.update += 1;
    bySheet.update += 1;
  } else if (preview.operation === "unchanged") {
    summary.unchanged += 1;
    bySheet.unchanged += 1;
  } else {
    summary.invalid += 1;
    bySheet.invalid += 1;
  }

  for (const issue of preview.issues) {
    if (issue.severity === "error") summary.errors += 1;
    if (issue.severity === "warning") summary.warnings += 1;
  }
}

async function ensureSessionsDir() {
  await mkdir(SESSIONS_DIR, { recursive: true });
}

function sessionPath(sessionId: string) {
  return path.join(SESSIONS_DIR, `${sessionId}.json`);
}

async function saveSession(session: ImportSessionRecord) {
  await ensureSessionsDir();
  await writeFile(sessionPath(session.id), JSON.stringify(session, null, 2), "utf8");
}

async function loadSession(sessionId: string) {
  const raw = await readFile(sessionPath(sessionId), "utf8");
  const session = JSON.parse(raw) as ImportSessionRecord;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    throw new Error("Import preview session expired. Upload the file again.");
  }

  return session;
}

const kitchenSchema = z.object({
  externalId: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().default(""),
  category: z.string().default(""),
  style: z.string().default(""),
  material: z.string().default(""),
  priceFrom: z.number().int().min(0).default(0),
  priceTo: z.number().int().min(0).nullable().default(null),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  mainImage: z.string().default(""),
  seoTitle: z.string().nullable().default(null),
  seoDescription: z.string().nullable().default(null),
  published: z.boolean().default(false),
});

const styleSchema = z.object({
  externalId: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  headline: z.string().default(""),
  description: z.string().default(""),
  intro: z.string().default(""),
  content: z.string().default(""),
  suitableFor: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  careGuide: z.array(z.string()).default([]),
  pairsWith: z.array(z.string()).default([]),
  budgetLevel: z.string().default(""),
  priceFrom: z.number().int().min(0).default(0),
  image: z.string().default(""),
  relatedMaterials: z.array(z.string()).default([]),
  relatedCaseSlugs: z.array(z.string()).default([]),
  relatedScenarioSlugs: z.array(z.string()).default([]),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const materialSchema = z.object({
  externalId: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  headline: z.string().default(""),
  description: z.string().default(""),
  intro: z.string().default(""),
  content: z.string().default(""),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  suitableFor: z.array(z.string()).default([]),
  careGuide: z.array(z.string()).default([]),
  budgetLevel: z.string().default(""),
  pricePer: z.string().default(""),
  priceFrom: z.number().int().min(0).default(0),
  image: z.string().default(""),
  relatedStyles: z.array(z.string()).default([]),
  relatedCaseSlugs: z.array(z.string()).default([]),
  relatedScenarioSlugs: z.array(z.string()).default([]),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const scenarioSchema = z.object({
  externalId: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  icon: z.string().default(""),
  badge: z.string().default(""),
  title: z.string().min(1),
  headline: z.string().default(""),
  intro: z.string().default(""),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  needs: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  features: z.array(z.record(z.unknown())).default([]),
  tips: z.array(z.string()).default([]),
  relatedStyles: z.array(z.string()).default([]),
  relatedMaterials: z.array(z.string()).default([]),
  relatedCaseSlugs: z.array(z.string()).default([]),
  ctaText: z.string().default(""),
  ctaHref: z.string().default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

const portfolioSchema = z.object({
  externalId: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  city: z.string().default(""),
  region: z.string().default(""),
  area: z.number().int().min(0).default(0),
  layout: z.string().default(""),
  style: z.string().default(""),
  styleSlug: z.string().default(""),
  material: z.string().default(""),
  materialSlugs: z.array(z.string()).default([]),
  scenarioSlugs: z.array(z.string()).default([]),
  priceFrom: z.number().int().min(0).default(0),
  priceTo: z.number().int().min(0).default(0),
  days: z.number().int().min(0).default(0),
  completedAt: z.string().default(""),
  description: z.string().default(""),
  task: z.string().default(""),
  constraints: z.string().default(""),
  solution: z.string().default(""),
  result: z.string().default(""),
  mainImage: z.string().default(""),
  images: z.array(z.string()).default([]),
  photosBefore: z.array(z.string()).default([]),
  photosAfter: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  published: z.boolean().default(true),
});

const locationSchema = z.object({
  externalId: z.string().min(1),
  city: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  region: z.string().default(""),
  title: z.string().min(1),
  h1: z.string().default(""),
  intro: z.string().default(""),
  description: z.string().default(""),
  priceFrom: z.number().int().min(0).default(900),
  deliveryCost: z.string().default(""),
  deliveryDays: z.number().int().min(0).default(1),
  measureCost: z.string().default(""),
  timelineText: z.string().default(""),
  visitDetails: z.string().default(""),
  installDetails: z.string().default(""),
  images: z.array(z.string()).default([]),
  areas: z.array(z.string()).default([]),
  workZone: z.string().default(""),
  mapEmbed: z.string().default(""),
  features: z.array(z.string()).default([]),
  faq: z.array(z.record(z.unknown())).default([]),
  localIntro: z.string().default(""),
  uniquePoints: z.array(z.record(z.unknown())).default([]),
  contentBlocks: z.array(z.record(z.unknown())).default([]),
  caseSlugs: z.array(z.string()).default([]),
  reviewIds: z.array(z.number().int()).default([]),
  ctaHeadline: z.string().default(""),
  ctaSubtext: z.string().default(""),
  phone: z.string().default(""),
  address: z.string().default(""),
  seoTitle: z.string().nullable().default(null),
  seoDescription: z.string().nullable().default(null),
  published: z.boolean().default(true),
});

type KitchenPayload = z.infer<typeof kitchenSchema>;
type StylePayload = z.infer<typeof styleSchema>;
type MaterialPayload = z.infer<typeof materialSchema>;
type ScenarioPayload = z.infer<typeof scenarioSchema>;
type PortfolioPayload = z.infer<typeof portfolioSchema>;
type LocationPayload = z.infer<typeof locationSchema>;
type SupportedPayload =
  | KitchenPayload
  | StylePayload
  | MaterialPayload
  | ScenarioPayload
  | PortfolioPayload
  | LocationPayload;
type ExistingRow = Record<string, unknown>;
type LegacyBackfillMatch = {
  existing: ExistingRow | null;
  matchedBySlug: boolean;
};
type BackfillResult = "backfilled" | "already-set";
type ImageValidationResult =
  | { valid: true }
  | { valid: false; message: string };
type ImageValidationCache = Map<string, Promise<ImageValidationResult>>;

type ScopedImportEntity = Extract<
  ImportEntity,
  "kitchens" | "styles" | "materials" | "scenarios" | "portfolio" | "locations"
>;

type EntityValidationRules = {
  textMax: Partial<Record<string, number>>;
  arrayMax: Partial<Record<string, number>>;
};

const SLUG_REGEX = /^[a-z0-9-]+$/;
const KITCHEN_CREATE_FIELDS = [
  "externalId",
  "slug",
  "title",
  "description",
  "category",
  "style",
  "material",
  "priceFrom",
  "priceTo",
  "features",
  "images",
  "mainImage",
  "seoTitle",
  "seoDescription",
  "published",
] as const satisfies readonly (keyof KitchenPayload)[];
const KITCHEN_UPDATE_FIELDS = [
  "title",
  "description",
  "category",
  "style",
  "material",
  "priceFrom",
  "priceTo",
  "features",
  "images",
  "mainImage",
  "seoTitle",
  "seoDescription",
  "published",
] as const satisfies readonly (keyof KitchenPayload)[];
const STYLE_CREATE_FIELDS = [
  "externalId",
  "slug",
  "title",
  "headline",
  "description",
  "intro",
  "content",
  "suitableFor",
  "pros",
  "cons",
  "careGuide",
  "pairsWith",
  "budgetLevel",
  "priceFrom",
  "image",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "order",
  "published",
] as const satisfies readonly (keyof StylePayload)[];
const STYLE_UPDATE_FIELDS = [
  "title",
  "headline",
  "description",
  "intro",
  "content",
  "suitableFor",
  "pros",
  "cons",
  "careGuide",
  "pairsWith",
  "budgetLevel",
  "priceFrom",
  "image",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "order",
  "published",
] as const satisfies readonly (keyof StylePayload)[];
const MATERIAL_CREATE_FIELDS = [
  "externalId",
  "slug",
  "title",
  "headline",
  "description",
  "intro",
  "content",
  "pros",
  "cons",
  "suitableFor",
  "careGuide",
  "budgetLevel",
  "pricePer",
  "priceFrom",
  "image",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "order",
  "published",
] as const satisfies readonly (keyof MaterialPayload)[];
const MATERIAL_UPDATE_FIELDS = [
  "title",
  "headline",
  "description",
  "intro",
  "content",
  "pros",
  "cons",
  "suitableFor",
  "careGuide",
  "budgetLevel",
  "pricePer",
  "priceFrom",
  "image",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "order",
  "published",
] as const satisfies readonly (keyof MaterialPayload)[];
const SCENARIO_CREATE_FIELDS = [
  "externalId",
  "slug",
  "icon",
  "badge",
  "title",
  "headline",
  "intro",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "needs",
  "solutions",
  "features",
  "tips",
  "ctaText",
  "ctaHref",
  "order",
  "published",
] as const satisfies readonly (keyof ScenarioPayload)[];
const SCENARIO_UPDATE_FIELDS = [
  "icon",
  "badge",
  "title",
  "headline",
  "intro",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "needs",
  "solutions",
  "features",
  "tips",
  "ctaText",
  "ctaHref",
  "order",
  "published",
] as const satisfies readonly (keyof ScenarioPayload)[];
const PORTFOLIO_CREATE_FIELDS = [
  "externalId",
  "slug",
  "title",
  "city",
  "region",
  "area",
  "layout",
  "style",
  "material",
  "priceFrom",
  "priceTo",
  "days",
  "completedAt",
  "description",
  "task",
  "constraints",
  "solution",
  "result",
  "mainImage",
  "images",
  "photosBefore",
  "photosAfter",
  "featured",
  "order",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "published",
] as const satisfies readonly (keyof PortfolioPayload)[];
const PORTFOLIO_UPDATE_FIELDS = [
  "title",
  "city",
  "region",
  "area",
  "layout",
  "style",
  "material",
  "priceFrom",
  "priceTo",
  "days",
  "completedAt",
  "description",
  "task",
  "constraints",
  "solution",
  "result",
  "mainImage",
  "images",
  "photosBefore",
  "photosAfter",
  "featured",
  "order",
  "seoTitle",
  "seoDescription",
  "seoKeywords",
  "published",
] as const satisfies readonly (keyof PortfolioPayload)[];
const LOCATION_CREATE_FIELDS = [
  "externalId",
  "slug",
  "city",
  "region",
  "title",
  "h1",
  "intro",
  "description",
  "priceFrom",
  "deliveryCost",
  "deliveryDays",
  "measureCost",
  "timelineText",
  "visitDetails",
  "installDetails",
  "images",
  "areas",
  "workZone",
  "mapEmbed",
  "features",
  "faq",
  "localIntro",
  "uniquePoints",
  "contentBlocks",
  "ctaHeadline",
  "ctaSubtext",
  "phone",
  "address",
  "seoTitle",
  "seoDescription",
  "published",
] as const satisfies readonly (keyof LocationPayload)[];
const LOCATION_UPDATE_FIELDS = [
  "city",
  "region",
  "title",
  "h1",
  "intro",
  "description",
  "priceFrom",
  "deliveryCost",
  "deliveryDays",
  "measureCost",
  "timelineText",
  "visitDetails",
  "installDetails",
  "images",
  "areas",
  "workZone",
  "mapEmbed",
  "features",
  "faq",
  "localIntro",
  "uniquePoints",
  "contentBlocks",
  "ctaHeadline",
  "ctaSubtext",
  "phone",
  "address",
  "seoTitle",
  "seoDescription",
  "published",
] as const satisfies readonly (keyof LocationPayload)[];
const STYLE_IGNORED_FIELDS = [
  "relatedMaterials",
  "relatedCaseSlugs",
  "relatedScenarioSlugs",
] as const satisfies readonly (keyof StylePayload)[];
const MATERIAL_IGNORED_FIELDS = [
  "relatedStyles",
  "relatedCaseSlugs",
  "relatedScenarioSlugs",
] as const satisfies readonly (keyof MaterialPayload)[];
const SCENARIO_IGNORED_FIELDS = [
  "relatedStyles",
  "relatedMaterials",
  "relatedCaseSlugs",
] as const satisfies readonly (keyof ScenarioPayload)[];
const PORTFOLIO_IGNORED_FIELDS = [
  "styleSlug",
  "materialSlugs",
  "scenarioSlugs",
] as const satisfies readonly (keyof PortfolioPayload)[];
const LOCATION_IGNORED_FIELDS = [
  "caseSlugs",
  "reviewIds",
] as const satisfies readonly (keyof LocationPayload)[];

const BULK_IMPORT_V1_RULES: Record<ScopedImportEntity, EntityValidationRules> = {
  kitchens: {
    textMax: {},
    arrayMax: {
      images: 24,
    },
  },
  styles: {
    textMax: {
      title: 120,
      headline: 120,
      description: 500,
      intro: 400,
      content: 12000,
      budgetLevel: 40,
      seoTitle: 70,
      seoDescription: 170,
      seoKeywords: 255,
    },
    arrayMax: {
      suitableFor: 8,
      pros: 8,
      cons: 8,
      careGuide: 8,
      pairsWith: 8,
      relatedMaterials: 12,
      relatedCaseSlugs: 12,
      relatedScenarioSlugs: 12,
    },
  },
  materials: {
    textMax: {
      title: 120,
      headline: 120,
      description: 500,
      intro: 400,
      content: 12000,
      budgetLevel: 40,
      pricePer: 80,
      seoTitle: 70,
      seoDescription: 170,
      seoKeywords: 255,
    },
    arrayMax: {
      suitableFor: 8,
      pros: 8,
      cons: 8,
      careGuide: 8,
      relatedStyles: 12,
      relatedCaseSlugs: 12,
      relatedScenarioSlugs: 12,
    },
  },
  scenarios: {
    textMax: {
      icon: 8,
      badge: 40,
      title: 120,
      headline: 120,
      intro: 400,
      ctaText: 80,
      ctaHref: 500,
      seoTitle: 70,
      seoDescription: 170,
      seoKeywords: 255,
    },
    arrayMax: {
      needs: 8,
      solutions: 8,
      features: 8,
      tips: 8,
      relatedStyles: 12,
      relatedMaterials: 12,
      relatedCaseSlugs: 12,
    },
  },
  portfolio: {
    textMax: {
      title: 140,
      city: 80,
      region: 80,
      layout: 60,
      style: 60,
      material: 120,
      completedAt: 50,
      description: 600,
      task: 2000,
      constraints: 2000,
      solution: 2000,
      result: 2000,
      seoTitle: 70,
      seoDescription: 170,
      seoKeywords: 255,
    },
    arrayMax: {
      materialSlugs: 6,
      scenarioSlugs: 6,
      images: 12,
      photosBefore: 6,
      photosAfter: 6,
    },
  },
  locations: {
    textMax: {},
    arrayMax: {
      images: 24,
    },
  },
};

const NUMERIC_FIELD_ALIASES: Partial<Record<ImportEntity, Record<string, string[]>>> = {
  styles: {
    priceFrom: ["priceFrom", "price_from"],
    order: ["order", "sortOrder"],
  },
  materials: {
    priceFrom: ["priceFrom", "price_from"],
    order: ["order", "sortOrder"],
  },
  scenarios: {
    order: ["order", "sortOrder"],
  },
  portfolio: {
    area: ["area", "РґР»РёРЅР°"],
    priceFrom: ["priceFrom", "price_from"],
    priceTo: ["priceTo", "price_to"],
    days: ["days", "СЃСЂРѕРєРґРЅРµР№"],
    order: ["order", "sortOrder"],
  },
};

function createIssue(
  severity: IssueSeverity,
  sheet: string,
  rowNumber: number,
  field: string | undefined,
  message: string
): ImportIssue {
  return { severity, sheet, rowNumber, field, message };
}

function isIntegerLike(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  const normalized = asString(value, "");
  if (!normalized) return true;
  const compact = normalized.replace(/\s+/g, "");
  return /^-?\d+(?:[.,]\d+)?$/.test(compact);
}

function isValidImageUrl(value: string) {
  if (!value) return false;
  if (value.startsWith("/")) {
    return DIRECT_IMAGE_EXTENSIONS.has(path.extname(value).toLowerCase());
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidHref(value: string) {
  if (!value) return false;
  if (value.startsWith("/") || value.startsWith("#")) return true;
  if (value.startsWith("tel:") || value.startsWith("mailto:")) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validateTextLimits(
  sheetName: string,
  rowNumber: number,
  payload: Record<string, unknown>,
  textMax: Partial<Record<string, number>>
) {
  const issues: ImportIssue[] = [];

  for (const [field, max] of Object.entries(textMax)) {
    if (max === undefined) continue;
    const value = payload[field];
    if (typeof value !== "string" || value.length <= max) continue;
    issues.push(
      createIssue(
        "warning",
        sheetName,
        rowNumber,
        field,
        `Text is too long for "${field}" (${value.length}/${max}) and may break layout or metadata`
      )
    );
  }

  return issues;
}

function validateArrayLimits(
  sheetName: string,
  rowNumber: number,
  payload: Record<string, unknown>,
  arrayMax: Partial<Record<string, number>>
) {
  const issues: ImportIssue[] = [];

  for (const [field, max] of Object.entries(arrayMax)) {
    if (max === undefined) continue;
    const value = payload[field];
    if (!Array.isArray(value) || value.length <= max) continue;
    issues.push(
      createIssue(
        "warning",
        sheetName,
        rowNumber,
        field,
        `Array "${field}" has ${value.length} items (recommended max: ${max})`
      )
    );
  }

  return issues;
}

function validateNumericInputs(
  entity: ImportEntity,
  sheetName: string,
  rowNumber: number,
  row: RawSheetRow
) {
  const issues: ImportIssue[] = [];
  const aliases = NUMERIC_FIELD_ALIASES[entity];
  if (!aliases) return issues;

  for (const [field, fieldAliases] of Object.entries(aliases)) {
    const rawValue = getField(row, fieldAliases);
    if (rawValue === undefined || rawValue === null || asString(rawValue, "") === "") continue;
    if (isIntegerLike(rawValue)) continue;
    issues.push(
      createIssue("error", sheetName, rowNumber, field, `Field "${field}" must be a valid number`)
    );
  }

  return issues;
}

function hasDirectImageExtension(value: string) {
  return DIRECT_IMAGE_EXTENSIONS.has(path.extname(value).toLowerCase());
}

function isBlockedImagePageUrl(parsed: URL) {
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_IMAGE_PAGE_HOSTS.has(hostname)) return true;

  const pathname = parsed.pathname.toLowerCase();
  if (pathname.startsWith("/gallery/") || pathname.startsWith("/share/")) return true;

  return false;
}

async function fetchImageContentType(url: string, method: "HEAD" | "GET") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: method === "GET" ? { Range: "bytes=0-0" } : undefined,
    });

    return {
      ok: response.ok,
      contentType: response.headers.get("content-type"),
    };
  } catch {
    return {
      ok: false,
      contentType: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function validateImageUrlStrict(
  value: string,
  cache: ImageValidationCache
): Promise<ImageValidationResult> {
  if (!value) {
    return { valid: false, message: "Ссылка на изображение пустая" };
  }

  const normalized = value.trim();
  if (normalized.startsWith("/")) {
    return hasDirectImageExtension(normalized)
      ? { valid: true }
      : {
          valid: false,
          message:
            "Ссылка не выглядит как прямой путь к изображению. Укажите direct image URL или путь к файлу с расширением изображения",
        };
  }

  if (!isValidImageUrl(normalized)) {
    return {
      valid: false,
      message:
        "Ссылка на изображение некорректна или использует неподдерживаемый протокол. Разрешены только http/https direct image URL",
    };
  }

  const cached = cache.get(normalized);
  if (cached) return cached;

  const validationPromise = (async () => {
    let parsed: URL;

    try {
      parsed = new URL(normalized);
    } catch {
      return {
        valid: false as const,
        message: "Ссылка на изображение некорректна. Укажите прямую ссылку на файл изображения",
      };
    }

    if (isBlockedImagePageUrl(parsed)) {
      return {
        valid: false as const,
        message:
          "Ссылка ведет на страницу просмотра/шеринга, а не на сам файл изображения. Вставьте direct image URL",
      };
    }

    const headCheck = await fetchImageContentType(normalized, "HEAD");
    const headType = headCheck.contentType?.toLowerCase() ?? "";
    if (headCheck.ok && headType.startsWith("image/")) {
      return { valid: true as const };
    }
    if (headCheck.ok && headType && !headType.startsWith("image/")) {
      return {
        valid: false as const,
        message:
          "Ссылка не является прямой ссылкой на изображение: сервер возвращает HTML или другой не-image content-type. Вставьте direct image URL",
      };
    }

    const getCheck = await fetchImageContentType(normalized, "GET");
    const getType = getCheck.contentType?.toLowerCase() ?? "";
    if (getCheck.ok && getType.startsWith("image/")) {
      return { valid: true as const };
    }
    if (getCheck.ok && getType && !getType.startsWith("image/")) {
      return {
        valid: false as const,
        message:
          "Ссылка не является прямой ссылкой на изображение: сервер возвращает HTML или другой не-image content-type. Вставьте direct image URL",
      };
    }

    return hasDirectImageExtension(parsed.pathname)
      ? {
          valid: false as const,
          message:
            "Не удалось подтвердить, что ссылка ведет прямо на изображение. Проверьте URL и используйте direct image URL, который открывает сам файл",
        }
      : {
          valid: false as const,
          message:
            "Ссылка не выглядит как прямая ссылка на изображение. Используйте direct image URL, который открывает сам файл изображения",
        };
  })();

  cache.set(normalized, validationPromise);
  return validationPromise;
}

async function validateSingleImageField(
  sheetName: string,
  rowNumber: number,
  field: string,
  value: string,
  cache: ImageValidationCache
) {
  if (!value) return [] as ImportIssue[];

  const validation = await validateImageUrlStrict(value, cache);
  if (validation.valid) return [] as ImportIssue[];

  return [createIssue("error", sheetName, rowNumber, field, validation.message)];
}

async function validateImageList(
  sheetName: string,
  rowNumber: number,
  field: string,
  values: string[],
  cache: ImageValidationCache
) {
  const issues: ImportIssue[] = [];
  const seen = new Set<string>();

  for (const [index, value] of values.entries()) {
    const validation = await validateImageUrlStrict(value, cache);
    if (!validation.valid) {
      issues.push(createIssue("error", sheetName, rowNumber, field, `${field}[${index}]: ${validation.message}`));
    }

    if (seen.has(value)) {
      issues.push(
        createIssue(
          "warning",
          sheetName,
          rowNumber,
          field,
          `Duplicate image URL found in "${field}"`
        )
      );
      return;
    }

    seen.add(value);
  }

  return issues;
}

function validateSlugReferences(
  sheetName: string,
  rowNumber: number,
  field: string,
  values: string[]
) {
  return values.flatMap((value, index) => {
    if (SLUG_REGEX.test(value)) return [];
    return [
      createIssue(
        "error",
        sheetName,
        rowNumber,
        field,
        `Reference at ${field}[${index}] must be a slug in format "a-z0-9-"`
      ),
    ];
  });
}

function validateScenarioFeatures(sheetName: string, rowNumber: number, payload: ScenarioPayload) {
  const issues: ImportIssue[] = [];

  payload.features.forEach((feature, index) => {
    const title = typeof feature.title === "string" ? feature.title.trim() : "";
    const description = typeof feature.description === "string" ? feature.description.trim() : "";
    const icon = typeof feature.icon === "string" ? feature.icon.trim() : "";

    if (!title) {
      issues.push(
        createIssue(
          "warning",
          sheetName,
          rowNumber,
          "features",
          `Feature #${index + 1} has no title`
        )
      );
    }

    if (!description) {
      issues.push(
        createIssue(
          "warning",
          sheetName,
          rowNumber,
          "features",
          `Feature #${index + 1} has no description`
        )
      );
    }

    if (icon.length > 8) {
      issues.push(
        createIssue(
          "warning",
          sheetName,
          rowNumber,
          "features",
          `Feature #${index + 1} icon is too long and may render poorly`
        )
      );
    }
  });

  return issues;
}

async function validateScopedEntityRow(
  entity: ScopedImportEntity,
  sheetName: string,
  rowNumber: number,
  row: RawSheetRow,
  payload: SupportedPayload,
  imageValidationCache: ImageValidationCache
) {
  const rules = BULK_IMPORT_V1_RULES[entity];
  const issues: ImportIssue[] = [
    ...validateNumericInputs(entity, sheetName, rowNumber, row),
    ...validateTextLimits(sheetName, rowNumber, payload as Record<string, unknown>, rules.textMax),
    ...validateArrayLimits(sheetName, rowNumber, payload as Record<string, unknown>, rules.arrayMax),
  ];

  switch (entity) {
    case "kitchens": {
      const kitchen = payload as KitchenPayload;
      issues.push(
        ...(await validateSingleImageField(
          sheetName,
          rowNumber,
          "mainImage",
          kitchen.mainImage,
          imageValidationCache
        ))
      );
      issues.push(
        ...(await validateImageList(
          sheetName,
          rowNumber,
          "images",
          kitchen.images,
          imageValidationCache
        ))
      );
      break;
    }
    case "styles": {
      const style = payload as StylePayload;
      if (style.published && !style.image) {
        issues.push(
          createIssue("warning", sheetName, rowNumber, "image", "У опубликованного style нет hero image")
        );
      }
      issues.push(
        ...(await validateSingleImageField(
          sheetName,
          rowNumber,
          "image",
          style.image,
          imageValidationCache
        ))
      );
      if (style.published && !style.intro && !style.description && !style.content) {
        issues.push(
          createIssue(
            "warning",
            sheetName,
            rowNumber,
            "intro",
            "Published style has no intro/description/content"
          )
        );
      }
      issues.push(...validateSlugReferences(sheetName, rowNumber, "relatedMaterials", style.relatedMaterials));
      issues.push(...validateSlugReferences(sheetName, rowNumber, "relatedCaseSlugs", style.relatedCaseSlugs));
      issues.push(
        ...validateSlugReferences(
          sheetName,
          rowNumber,
          "relatedScenarioSlugs",
          style.relatedScenarioSlugs
        )
      );
      break;
    }
    case "materials": {
      const material = payload as MaterialPayload;
      if (material.published && !material.image) {
        issues.push(
          createIssue(
            "warning",
            sheetName,
            rowNumber,
            "image",
            "У опубликованного material нет hero image"
          )
        );
      }
      issues.push(
        ...(await validateSingleImageField(
          sheetName,
          rowNumber,
          "image",
          material.image,
          imageValidationCache
        ))
      );
      if (material.published && !material.intro && !material.description && !material.content) {
        issues.push(
          createIssue(
            "warning",
            sheetName,
            rowNumber,
            "intro",
            "Published material has no intro/description/content"
          )
        );
      }
      issues.push(...validateSlugReferences(sheetName, rowNumber, "relatedStyles", material.relatedStyles));
      issues.push(...validateSlugReferences(sheetName, rowNumber, "relatedCaseSlugs", material.relatedCaseSlugs));
      issues.push(
        ...validateSlugReferences(
          sheetName,
          rowNumber,
          "relatedScenarioSlugs",
          material.relatedScenarioSlugs
        )
      );
      break;
    }
    case "scenarios": {
      const scenario = payload as ScenarioPayload;
      if (scenario.ctaHref && !isValidHref(scenario.ctaHref)) {
        issues.push(
          createIssue("error", sheetName, rowNumber, "ctaHref", "CTA link is invalid")
        );
      }
      if (scenario.published && !scenario.intro) {
        issues.push(
          createIssue("warning", sheetName, rowNumber, "intro", "Published scenario has no intro")
        );
      }
      issues.push(...validateScenarioFeatures(sheetName, rowNumber, scenario));
      issues.push(...validateSlugReferences(sheetName, rowNumber, "relatedStyles", scenario.relatedStyles));
      issues.push(
        ...validateSlugReferences(sheetName, rowNumber, "relatedMaterials", scenario.relatedMaterials)
      );
      issues.push(...validateSlugReferences(sheetName, rowNumber, "relatedCaseSlugs", scenario.relatedCaseSlugs));
      break;
    }
    case "portfolio": {
      const portfolio = payload as PortfolioPayload;
      if (portfolio.published && !portfolio.mainImage) {
        issues.push(
          createIssue(
            "error",
            sheetName,
            rowNumber,
            "mainImage",
            "У опубликованного portfolio-кейса должна быть главная картинка"
          )
        );
      }
      issues.push(
        ...(await validateSingleImageField(
          sheetName,
          rowNumber,
          "mainImage",
          portfolio.mainImage,
          imageValidationCache
        ))
      );
      issues.push(
        ...(await validateImageList(
          sheetName,
          rowNumber,
          "images",
          portfolio.images,
          imageValidationCache
        ))
      );
      issues.push(
        ...(await validateImageList(
          sheetName,
          rowNumber,
          "photosBefore",
          portfolio.photosBefore,
          imageValidationCache
        ))
      );
      issues.push(
        ...(await validateImageList(
          sheetName,
          rowNumber,
          "photosAfter",
          portfolio.photosAfter,
          imageValidationCache
        ))
      );
      if (portfolio.images.length > 0 && portfolio.mainImage && !portfolio.images.includes(portfolio.mainImage)) {
        issues.push(
          createIssue(
            "warning",
            sheetName,
            rowNumber,
            "mainImage",
            "Главная картинка отсутствует в gallery images"
          )
        );
      }
      if (portfolio.priceTo > 0 && portfolio.priceTo < portfolio.priceFrom) {
        issues.push(
          createIssue(
            "error",
            sheetName,
            rowNumber,
            "priceTo",
            "priceTo cannot be lower than priceFrom"
          )
        );
      }
      if (portfolio.order < 0) {
        issues.push(
          createIssue("error", sheetName, rowNumber, "order", "Order cannot be negative")
        );
      }
      if (portfolio.area <= 0) {
        issues.push(
          createIssue("warning", sheetName, rowNumber, "area", "Area is empty or zero")
        );
      }
      if (portfolio.days <= 0) {
        issues.push(
          createIssue("warning", sheetName, rowNumber, "days", "Production timeline is empty or zero")
        );
      }
      if (portfolio.published && !portfolio.description) {
        issues.push(
          createIssue(
            "warning",
            sheetName,
            rowNumber,
            "description",
            "Published portfolio case has no description"
          )
        );
      }
      if (portfolio.styleSlug && !SLUG_REGEX.test(portfolio.styleSlug)) {
        issues.push(
          createIssue(
            "error",
            sheetName,
            rowNumber,
            "styleSlug",
            `Field "styleSlug" must be a slug in format "a-z0-9-"`
          )
        );
      }
      issues.push(...validateSlugReferences(sheetName, rowNumber, "materialSlugs", portfolio.materialSlugs));
      issues.push(...validateSlugReferences(sheetName, rowNumber, "scenarioSlugs", portfolio.scenarioSlugs));
      break;
    }
    case "locations": {
      const location = payload as LocationPayload;
      issues.push(
        ...(await validateImageList(
          sheetName,
          rowNumber,
          "images",
          location.images,
          imageValidationCache
        ))
      );
      break;
    }
  }

  return issues;
}

function createReferenceSet(
  snapshotRows: Array<Record<string, unknown>>,
  importedRows: Array<{ payload: Record<string, unknown> | null }>
) {
  const values = new Set<string>();

  snapshotRows.forEach((item) => {
    if (typeof item.slug === "string" && item.slug) {
      values.add(item.slug);
    }
  });

  importedRows.forEach((item) => {
    const slug = item.payload && typeof item.payload.slug === "string" ? item.payload.slug : "";
    if (slug) {
      values.add(slug);
    }
  });

  return values;
}

function createRelationIssues(
  sheetName: string,
  rowNumber: number,
  field: string,
  values: string[],
  available: Set<string>,
  entityLabel: string
) {
  return values.flatMap((value) => {
    if (!value || available.has(value)) return [];
    return [
      createIssue(
        "warning",
        sheetName,
        rowNumber,
        field,
        `${entityLabel} "${value}" was not found in existing data or current import session`
      ),
    ];
  });
}

const SHEET_ALIASES: Record<ImportEntity, string[]> = {
  kitchens: ["kitchens", "kitchen", "кухни", "кухня"],
  styles: ["styles", "style", "стили", "стиль"],
  materials: ["materials", "material", "материалы", "материал"],
  scenarios: ["scenarios", "scenario", "сценарии", "сценарий"],
  portfolio: ["portfolio", "cases", "портфолио", "кейсы"],
  locations: ["locations", "location", "локации", "локация"],
};

const SHEET_ORDER: ImportEntity[] = [
  "kitchens",
  "styles",
  "materials",
  "scenarios",
  "portfolio",
  "locations",
];

function inferEntity(sheetName: string): ImportEntity | null {
  const normalized = normalizeHeader(sheetName);
  for (const entity of SHEET_ORDER) {
    if (SHEET_ALIASES[entity].some((alias) => normalizeHeader(alias) === normalized)) {
      return entity;
    }
  }
  return null;
}

function normalizeWithIssues<T>(sheetName: string, rowNumber: number, fn: () => T) {
  try {
    return { payload: fn(), issues: [] as ImportIssue[] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        payload: null,
        issues: error.issues.map((issue) => ({
          severity: "error" as const,
          sheet: sheetName,
          rowNumber,
          field: issue.path.join(".") || undefined,
          message: issue.message,
        })),
      };
    }

    return {
      payload: null,
      issues: [
        {
          severity: "error" as const,
          sheet: sheetName,
          rowNumber,
          message: error instanceof Error ? error.message : "Unknown normalization error",
        },
      ],
    };
  }
}

function normalizeKitchenRow(row: RawSheetRow) {
  return kitchenSchema.parse({
    externalId: asString(getField(row, ["externalId", "external_id", "id"])),
    title: asString(getField(row, ["title", "name", "название"])),
    slug:
      asString(getField(row, ["slug", "url"])) ||
      slugify(asString(getField(row, ["title", "name", "название"]))),
    description: asString(getField(row, ["description", "описание"])),
    category: asString(getField(row, ["category", "категория"])),
    style: asString(getField(row, ["style", "стиль"])),
    material: asString(getField(row, ["material", "материал"])),
    priceFrom: asInt(getField(row, ["priceFrom", "price_from", "ценаот"])),
    priceTo:
      asString(getField(row, ["priceTo", "price_to", "ценадо"])) === ""
        ? null
        : asInt(getField(row, ["priceTo", "price_to", "ценадо"])),
    features: asStringArray(getField(row, ["features", "особенности"])),
    images: asStringArray(getField(row, ["images", "gallery", "изображения"])),
    mainImage:
      asString(getField(row, ["mainImage", "main_image"])) ||
      asStringArray(getField(row, ["images", "gallery", "изображения"]))[0] ||
      "",
    seoTitle: asNullableString(getField(row, ["seoTitle", "metaTitle"])),
    seoDescription: asNullableString(getField(row, ["seoDescription", "metaDescription"])),
    published: asBoolean(getField(row, ["published", "isPublished", "опубликовано"]), false),
  });
}

function normalizeStyleRow(row: RawSheetRow) {
  return styleSchema.parse({
    externalId: asString(getField(row, ["externalId", "external_id", "id"])),
    slug:
      asString(getField(row, ["slug", "url"])) ||
      slugify(asString(getField(row, ["title", "name", "название"]))),
    title: asString(getField(row, ["title", "name", "название"])),
    headline: asString(getField(row, ["headline", "h1"])),
    description: asString(getField(row, ["description", "описание"])),
    intro: asString(getField(row, ["intro", "введение"])),
    content: asString(getField(row, ["content", "контент"])),
    suitableFor: asStringArray(getField(row, ["suitableFor", "suitable_for"])),
    pros: asStringArray(getField(row, ["pros", "плюсы"])),
    cons: asStringArray(getField(row, ["cons", "минусы"])),
    careGuide: asStringArray(getField(row, ["careGuide", "care_guide"])),
    pairsWith: asStringArray(getField(row, ["pairsWith", "pairs_with"])),
    budgetLevel: asString(getField(row, ["budgetLevel", "budget_level"])),
    priceFrom: asInt(getField(row, ["priceFrom", "price_from"])),
    image: asString(getField(row, ["image", "imageUrl", "изображение"])),
    relatedMaterials: asStringArray(getField(row, ["relatedMaterials", "related_materials"])),
    relatedCaseSlugs: asStringArray(getField(row, ["relatedCaseSlugs", "related_case_slugs"])),
    relatedScenarioSlugs: asStringArray(
      getField(row, ["relatedScenarioSlugs", "related_scenario_slugs"])
    ),
    seoTitle: asString(getField(row, ["seoTitle", "metaTitle"])),
    seoDescription: asString(getField(row, ["seoDescription", "metaDescription"])),
    seoKeywords: asString(getField(row, ["seoKeywords", "metaKeywords"])),
    order: asInt(getField(row, ["order", "sortOrder"])),
    published: asBoolean(getField(row, ["published", "isPublished", "опубликовано"]), true),
  });
}

function normalizeMaterialRow(row: RawSheetRow) {
  return materialSchema.parse({
    externalId: asString(getField(row, ["externalId", "external_id", "id"])),
    slug:
      asString(getField(row, ["slug", "url"])) ||
      slugify(asString(getField(row, ["title", "name", "название"]))),
    title: asString(getField(row, ["title", "name", "название"])),
    headline: asString(getField(row, ["headline", "h1"])),
    description: asString(getField(row, ["description", "описание"])),
    intro: asString(getField(row, ["intro", "введение"])),
    content: asString(getField(row, ["content", "контент"])),
    pros: asStringArray(getField(row, ["pros", "плюсы"])),
    cons: asStringArray(getField(row, ["cons", "минусы"])),
    suitableFor: asStringArray(getField(row, ["suitableFor", "suitable_for"])),
    careGuide: asStringArray(getField(row, ["careGuide", "care_guide"])),
    budgetLevel: asString(getField(row, ["budgetLevel", "budget_level"])),
    pricePer: asString(getField(row, ["pricePer", "price_per"])),
    priceFrom: asInt(getField(row, ["priceFrom", "price_from"])),
    image: asString(getField(row, ["image", "imageUrl", "изображение"])),
    relatedStyles: asStringArray(getField(row, ["relatedStyles", "related_styles"])),
    relatedCaseSlugs: asStringArray(getField(row, ["relatedCaseSlugs", "related_case_slugs"])),
    relatedScenarioSlugs: asStringArray(
      getField(row, ["relatedScenarioSlugs", "related_scenario_slugs"])
    ),
    seoTitle: asString(getField(row, ["seoTitle", "metaTitle"])),
    seoDescription: asString(getField(row, ["seoDescription", "metaDescription"])),
    seoKeywords: asString(getField(row, ["seoKeywords", "metaKeywords"])),
    order: asInt(getField(row, ["order", "sortOrder"])),
    published: asBoolean(getField(row, ["published", "isPublished", "опубликовано"]), true),
  });
}

function normalizeScenarioRow(row: RawSheetRow) {
  return scenarioSchema.parse({
    externalId: asString(getField(row, ["externalId", "external_id", "id"])),
    slug:
      asString(getField(row, ["slug", "url"])) ||
      slugify(asString(getField(row, ["title", "name", "название"]))),
    icon: asString(getField(row, ["icon", "иконка"])),
    badge: asString(getField(row, ["badge", "бейдж"])),
    title: asString(getField(row, ["title", "name", "название"])),
    headline: asString(getField(row, ["headline", "h1"])),
    intro: asString(getField(row, ["intro", "введение"])),
    seoTitle: asString(getField(row, ["seoTitle", "metaTitle"])),
    seoDescription: asString(getField(row, ["seoDescription", "metaDescription"])),
    seoKeywords: asString(getField(row, ["seoKeywords", "metaKeywords"])),
    needs: asStringArray(getField(row, ["needs", "потребности"])),
    solutions: asStringArray(getField(row, ["solutions", "решения"])),
    features: asObjectArray(getField(row, ["features", "особенности"])),
    tips: asStringArray(getField(row, ["tips", "советы"])),
    relatedStyles: asStringArray(getField(row, ["relatedStyles", "related_styles"])),
    relatedMaterials: asStringArray(getField(row, ["relatedMaterials", "related_materials"])),
    relatedCaseSlugs: asStringArray(getField(row, ["relatedCaseSlugs", "related_case_slugs"])),
    ctaText: asString(getField(row, ["ctaText", "cta_text"])),
    ctaHref: asString(getField(row, ["ctaHref", "cta_href"])),
    order: asInt(getField(row, ["order", "sortOrder"])),
    published: asBoolean(getField(row, ["published", "isPublished", "опубликовано"]), true),
  });
}

function normalizePortfolioRow(row: RawSheetRow) {
  const materialSlugs = asStringArray(getField(row, ["materialSlugs", "material_slugs"]));
  return portfolioSchema.parse({
    externalId: asString(getField(row, ["externalId", "external_id", "id"])),
    title: asString(getField(row, ["title", "name", "название"])),
    slug:
      asString(getField(row, ["slug", "url"])) ||
      slugify(asString(getField(row, ["title", "name", "название"]))),
    city: asString(getField(row, ["city", "город"])),
    region: asString(getField(row, ["region", "регион"])),
    area: asInt(getField(row, ["area", "длина"])),
    layout: asString(getField(row, ["layout", "планировка"])),
    style: asString(getField(row, ["style", "стиль"])),
    styleSlug: asString(getField(row, ["styleSlug", "style_slug"])),
    material: asString(getField(row, ["material", "материал"])) || materialSlugs.join(", "),
    materialSlugs,
    scenarioSlugs: asStringArray(getField(row, ["scenarioSlugs", "scenario_slugs"])),
    priceFrom: asInt(getField(row, ["priceFrom", "price_from"])),
    priceTo: asInt(getField(row, ["priceTo", "price_to"])),
    days: asInt(getField(row, ["days", "срокдней"])),
    completedAt: asString(getField(row, ["completedAt", "completed_at"])),
    description: asString(getField(row, ["description", "описание"])),
    task: asString(getField(row, ["task", "задача"])),
    constraints: asString(getField(row, ["constraints", "ограничения"])),
    solution: asString(getField(row, ["solution", "решение"])),
    result: asString(getField(row, ["result", "результат"])),
    mainImage:
      asString(getField(row, ["mainImage", "main_image"])) ||
      asStringArray(getField(row, ["images", "gallery"]))[0] ||
      "",
    images: asStringArray(getField(row, ["images", "gallery"])),
    photosBefore: asStringArray(getField(row, ["photosBefore", "photos_before"])),
    photosAfter: asStringArray(getField(row, ["photosAfter", "photos_after"])),
    featured: asBoolean(getField(row, ["featured", "isFeatured"]), false),
    order: asInt(getField(row, ["order", "sortOrder"])),
    seoTitle: asString(getField(row, ["seoTitle", "metaTitle"])),
    seoDescription: asString(getField(row, ["seoDescription", "metaDescription"])),
    seoKeywords: asString(getField(row, ["seoKeywords", "metaKeywords"])),
    published: asBoolean(getField(row, ["published", "isPublished", "опубликовано"]), true),
  });
}

function normalizeLocationRow(row: RawSheetRow) {
  return locationSchema.parse({
    externalId: asString(getField(row, ["externalId", "external_id", "id"])),
    city: asString(getField(row, ["city", "город"])),
    slug:
      asString(getField(row, ["slug", "url"])) ||
      slugify(asString(getField(row, ["city", "город"]))),
    region: asString(getField(row, ["region", "регион"])),
    title: asString(getField(row, ["title", "name", "название"])),
    h1: asString(getField(row, ["h1", "headline"])),
    intro: asString(getField(row, ["intro", "введение"])),
    description: asString(getField(row, ["description", "описание"])),
    priceFrom: asInt(getField(row, ["priceFrom", "price_from"])),
    deliveryCost: asString(getField(row, ["deliveryCost", "delivery_cost"])),
    deliveryDays: asInt(getField(row, ["deliveryDays", "delivery_days"]), 1),
    measureCost: asString(getField(row, ["measureCost", "measure_cost"])),
    timelineText: asString(getField(row, ["timelineText", "timeline_text"])),
    visitDetails: asString(getField(row, ["visitDetails", "visit_details"])),
    installDetails: asString(getField(row, ["installDetails", "install_details"])),
    images: asStringArray(getField(row, ["images", "gallery"])),
    areas: asStringArray(getField(row, ["areas", "районы"])),
    workZone: asString(getField(row, ["workZone", "work_zone"])),
    mapEmbed: asString(getField(row, ["mapEmbed", "map_embed"])),
    features: asStringArray(getField(row, ["features", "особенности"])),
    faq: asObjectArray(getField(row, ["faq"])),
    localIntro: asString(getField(row, ["localIntro", "local_intro"])),
    uniquePoints: asObjectArray(getField(row, ["uniquePoints", "unique_points"])),
    contentBlocks: asObjectArray(getField(row, ["contentBlocks", "content_blocks"])),
    caseSlugs: asStringArray(getField(row, ["caseSlugs", "case_slugs"])),
    reviewIds: asNumberArray(getField(row, ["reviewIds", "review_ids"])),
    ctaHeadline: asString(getField(row, ["ctaHeadline", "cta_headline"])),
    ctaSubtext: asString(getField(row, ["ctaSubtext", "cta_subtext"])),
    phone: asString(getField(row, ["phone", "телефон"])),
    address: asString(getField(row, ["address", "адрес"])),
    seoTitle: asNullableString(getField(row, ["seoTitle", "metaTitle"])),
    seoDescription: asNullableString(getField(row, ["seoDescription", "metaDescription"])),
    published: asBoolean(getField(row, ["published", "isPublished", "опубликовано"]), true),
  });
}

async function getExistingSnapshot() {
  const [kitchens, styles, materials, scenarios, portfolio, locations] = await Promise.all([
    prisma.kitchen.findMany({
      select: {
        id: true,
        externalId: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        style: true,
        material: true,
        priceFrom: true,
        priceTo: true,
        features: true,
        images: true,
        mainImage: true,
        seoTitle: true,
        seoDescription: true,
        published: true,
      },
    }),
    prisma.stylePage.findMany({
      select: {
        id: true,
        externalId: true,
        slug: true,
        title: true,
        headline: true,
        description: true,
        intro: true,
        content: true,
        suitableFor: true,
        pros: true,
        cons: true,
        careGuide: true,
        pairsWith: true,
        budgetLevel: true,
        priceFrom: true,
        image: true,
        relatedMaterials: true,
        relatedCaseSlugs: true,
        relatedScenarioSlugs: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        order: true,
        published: true,
      },
    }),
    prisma.materialPage.findMany({
      select: {
        id: true,
        externalId: true,
        slug: true,
        title: true,
        headline: true,
        description: true,
        intro: true,
        content: true,
        pros: true,
        cons: true,
        suitableFor: true,
        careGuide: true,
        budgetLevel: true,
        pricePer: true,
        priceFrom: true,
        image: true,
        relatedStyles: true,
        relatedCaseSlugs: true,
        relatedScenarioSlugs: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        order: true,
        published: true,
      },
    }),
    prisma.scenarioPage.findMany({
      select: {
        id: true,
        externalId: true,
        slug: true,
        icon: true,
        badge: true,
        title: true,
        headline: true,
        intro: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        needs: true,
        solutions: true,
        features: true,
        tips: true,
        relatedStyles: true,
        relatedMaterials: true,
        relatedCaseSlugs: true,
        ctaText: true,
        ctaHref: true,
        order: true,
        published: true,
      },
    }),
    prisma.portfolioCase.findMany({
      select: {
        id: true,
        externalId: true,
        slug: true,
        title: true,
        city: true,
        region: true,
        area: true,
        layout: true,
        style: true,
        styleSlug: true,
        material: true,
        materialSlugs: true,
        scenarioSlugs: true,
        priceFrom: true,
        priceTo: true,
        days: true,
        completedAt: true,
        description: true,
        task: true,
        constraints: true,
        solution: true,
        result: true,
        mainImage: true,
        images: true,
        photosBefore: true,
        photosAfter: true,
        featured: true,
        order: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        published: true,
      },
    }),
    prisma.locationPage.findMany({
      select: {
        id: true,
        externalId: true,
        slug: true,
        city: true,
        region: true,
        title: true,
        h1: true,
        intro: true,
        description: true,
        priceFrom: true,
        deliveryCost: true,
        deliveryDays: true,
        measureCost: true,
        timelineText: true,
        visitDetails: true,
        installDetails: true,
        images: true,
        areas: true,
        workZone: true,
        mapEmbed: true,
        features: true,
        faq: true,
        localIntro: true,
        uniquePoints: true,
        contentBlocks: true,
        caseSlugs: true,
        reviewIds: true,
        ctaHeadline: true,
        ctaSubtext: true,
        phone: true,
        address: true,
        seoTitle: true,
        seoDescription: true,
        published: true,
      },
    }),
  ]);

  return { kitchens, styles, materials, scenarios, portfolio, locations };
}

function comparableExisting(row: Record<string, unknown>) {
  const { id: _id, ...rest } = row;
  return rest;
}

function pickFields<T extends Record<string, unknown>, K extends keyof T>(
  payload: T,
  fields: readonly K[]
) {
  return Object.fromEntries(fields.map((field) => [field, payload[field]])) as Pick<T, K>;
}

function hasMeaningfulValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return value !== 0;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return JSON.stringify(value) !== "{}" && JSON.stringify(value) !== "[]";
  return true;
}

function ignoredFieldNames(entity: ImportEntity, isCreate: boolean) {
  switch (entity) {
    case "kitchens":
      return [] as string[];
    case "styles":
      return [...STYLE_IGNORED_FIELDS];
    case "materials":
      return [...MATERIAL_IGNORED_FIELDS];
    case "scenarios":
      return [...SCENARIO_IGNORED_FIELDS];
    case "portfolio":
      return [...PORTFOLIO_IGNORED_FIELDS];
    case "locations":
      return [...LOCATION_IGNORED_FIELDS];
    default:
      return [] as string[];
  }
}

function createDataForEntity(entity: ImportEntity, payload: SupportedPayload): ComparableRow {
  switch (entity) {
    case "kitchens":
      return pickFields(payload as KitchenPayload, KITCHEN_CREATE_FIELDS);
    case "styles":
      return pickFields(payload as StylePayload, STYLE_CREATE_FIELDS);
    case "materials":
      return pickFields(payload as MaterialPayload, MATERIAL_CREATE_FIELDS);
    case "scenarios":
      return pickFields(payload as ScenarioPayload, SCENARIO_CREATE_FIELDS);
    case "portfolio":
      return pickFields(payload as PortfolioPayload, PORTFOLIO_CREATE_FIELDS);
    case "locations":
      return pickFields(payload as LocationPayload, LOCATION_CREATE_FIELDS);
  }
}

function updateDataForEntity(entity: ImportEntity, payload: SupportedPayload): ComparableRow {
  switch (entity) {
    case "kitchens":
      return pickFields(payload as KitchenPayload, KITCHEN_UPDATE_FIELDS);
    case "styles":
      return pickFields(payload as StylePayload, STYLE_UPDATE_FIELDS);
    case "materials":
      return pickFields(payload as MaterialPayload, MATERIAL_UPDATE_FIELDS);
    case "scenarios":
      return pickFields(payload as ScenarioPayload, SCENARIO_UPDATE_FIELDS);
    case "portfolio":
      return pickFields(payload as PortfolioPayload, PORTFOLIO_UPDATE_FIELDS);
    case "locations":
      return pickFields(payload as LocationPayload, LOCATION_UPDATE_FIELDS);
  }
}

function createIgnoredFieldIssue(
  sheetName: string,
  rowNumber: number,
  fieldNames: string[],
  mode: "create" | "update"
) {
  if (fieldNames.length === 0) return null;

  const message = mode === "create"
    ? `Fields ${fieldNames.join(", ")} are outside safe bulk import v1 scope and will be skipped on create`
    : `Fields ${fieldNames.join(", ")} are outside safe bulk import v1 update scope and will be ignored`;

  return createIssue("warning", sheetName, rowNumber, fieldNames[0], message);
}

function canonicalizeComparableValue(value: unknown): unknown {
  if (value === undefined || value === null) return null;

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeComparableValue(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, canonicalizeComparableValue(nestedValue)])
    );
  }

  return value;
}

function comparePayload(existing: ComparableRow | null, payload: ComparableRow) {
  if (!existing) return { operation: "create" as const, changedFields: Object.keys(payload) };

  const changedFields = Object.keys(payload).filter(
    (key) =>
      JSON.stringify(canonicalizeComparableValue(existing[key])) !==
      JSON.stringify(canonicalizeComparableValue(payload[key]))
  );

  return {
    operation: changedFields.length === 0 ? ("unchanged" as const) : ("update" as const),
    changedFields,
  };
}

export const __bulkImportV1Internal = {
  canonicalizeComparableValue,
  comparePayload,
};

function findExistingImportRow(
  byExternalId: Map<string, ExistingRow>,
  bySlug: Map<string, ExistingRow>,
  payload: { externalId: string; slug?: string | null }
): LegacyBackfillMatch {
  const existingByExternalId = byExternalId.get(String(payload.externalId)) ?? null;
  if (existingByExternalId) {
    return {
      existing: existingByExternalId,
      matchedBySlug: false,
    };
  }

  const slug = payload.slug ? String(payload.slug) : null;
  if (!slug) {
    return {
      existing: null,
      matchedBySlug: false,
    };
  }

  const existingBySlug = bySlug.get(slug) ?? null;
  if (!existingBySlug) {
    return {
      existing: null,
      matchedBySlug: false,
    };
  }

  const existingExternalId =
    typeof existingBySlug.externalId === "string" && existingBySlug.externalId.trim() !== ""
      ? String(existingBySlug.externalId)
      : null;

  if (existingExternalId && existingExternalId !== payload.externalId) {
    return {
      existing: null,
      matchedBySlug: false,
    };
  }

  return {
    existing: existingBySlug,
    matchedBySlug: existingExternalId === null,
  };
}

function createLegacyBackfillIssue(sheetName: string, rowNumber: number, slug: string, externalId: string) {
  return createIssue(
    "warning",
    sheetName,
    rowNumber,
    "externalId",
    `Legacy record with slug "${slug}" has no externalId yet; import will backfill "${externalId}" before update`
  );
}

function duplicateIssues(
  previews: ImportRowPreview[],
  sheetName: string,
  field: "externalId" | "slug",
  getValue?: (preview: ImportRowPreview) => string | null
) {
  const seen = new Map<string, ImportRowPreview[]>();
  for (const preview of previews) {
    const value = getValue
      ? getValue(preview)
      : field === "externalId"
        ? preview.externalId
        : preview.slug;
    if (!value) continue;
    const list = seen.get(value) ?? [];
    list.push(preview);
    seen.set(value, list);
  }

  for (const [value, list] of seen.entries()) {
    if (list.length < 2) continue;
    for (const preview of list) {
      preview.issues.push({
        severity: "error",
        sheet: sheetName,
        rowNumber: preview.rowNumber,
        field,
        message: `Duplicate ${field} "${value}" found in the same sheet`,
      });
      preview.operation = "invalid";
    }
  }
}

function createSheetState<T>(entity: ImportEntity, sheetName: string): SheetSessionState<T> {
  return { entity, sheetName, rows: [] };
}

function toPreviewResponse(session: ImportSessionRecord): PreviewResponse {
  return {
    sessionId: session.id,
    version: session.version,
    fileName: session.fileName,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    appliedAt: session.appliedAt,
    workbookSheets: session.workbookSheets,
    summary: session.summary,
    issues: session.issues,
    rows: session.rows,
    applyResult: session.applyResult,
  };
}

async function buildSession(buffer: Buffer, fileName: string): Promise<ImportSessionRecord> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const snapshot = await getExistingSnapshot();
  const summary = defaultSummary();
  const issues: ImportIssue[] = [];
  const rows: ImportRowPreview[] = [];
  const imageValidationCache: ImageValidationCache = new Map();

  const data = {
    kitchens: createSheetState<KitchenPayload>("kitchens", "Kitchens"),
    styles: createSheetState<StylePayload>("styles", "Styles"),
    materials: createSheetState<MaterialPayload>("materials", "Materials"),
    scenarios: createSheetState<ScenarioPayload>("scenarios", "Scenarios"),
    portfolio: createSheetState<PortfolioPayload>("portfolio", "Portfolio"),
    locations: createSheetState<LocationPayload>("locations", "Locations"),
  };

  for (const sheetName of workbook.SheetNames) {
    const entity = inferEntity(sheetName);
    if (!entity) {
      issues.push({
        severity: "warning",
        sheet: sheetName,
        message: "Sheet skipped: not part of bulk import v1",
      });
      continue;
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<RawSheetRow>(worksheet, { defval: "", raw: false });
    const target = data[entity] as SheetSessionState<unknown>;
    target.sheetName = sheetName;

    const snapshotRows = snapshot[entity] as Array<Record<string, unknown>>;
    const byExternalId = new Map<string, Record<string, unknown>>(
      snapshotRows
        .filter((item) => typeof item.externalId === "string" && item.externalId)
        .map((item) => [String(item.externalId), item])
    );
    const bySlug = new Map<string, Record<string, unknown>>(
      snapshotRows
        .filter((item) => typeof item.slug === "string" && item.slug)
        .map((item) => [String(item.slug), item])
    );

    for (const [index, rawRow] of rawRows.entries()) {
      const rowNumber = index + 2;
      const row = canonicalizeRow(rawRow);

      const normalized = (() => {
        switch (entity) {
          case "kitchens":
            return normalizeWithIssues(sheetName, rowNumber, () => normalizeKitchenRow(row));
          case "styles":
            return normalizeWithIssues(sheetName, rowNumber, () => normalizeStyleRow(row));
          case "materials":
            return normalizeWithIssues(sheetName, rowNumber, () => normalizeMaterialRow(row));
          case "scenarios":
            return normalizeWithIssues(sheetName, rowNumber, () => normalizeScenarioRow(row));
          case "portfolio":
            return normalizeWithIssues(sheetName, rowNumber, () => normalizePortfolioRow(row));
          case "locations":
            return normalizeWithIssues(sheetName, rowNumber, () => normalizeLocationRow(row));
        }
      })();

      const payload = normalized.payload as Record<string, unknown> | null;
      const preview: ImportRowPreview = {
        sheet: sheetName,
        entity,
        rowNumber,
        externalId: payload?.externalId ? String(payload.externalId) : null,
        slug: payload?.slug ? String(payload.slug) : null,
        title: typeof payload?.title === "string"
          ? payload.title
          : typeof payload?.city === "string"
            ? payload.city
            : null,
        operation: payload ? "unchanged" : "invalid",
        issues: [...normalized.issues],
        changedFields: [],
      };

      if (payload) {
        if (
          entity === "kitchens" ||
          entity === "styles" ||
          entity === "materials" ||
          entity === "scenarios" ||
          entity === "portfolio" ||
          entity === "locations"
        ) {
          preview.issues.push(
            ...(await validateScopedEntityRow(
              entity,
              sheetName,
              rowNumber,
              row,
              payload as SupportedPayload,
              imageValidationCache
            ))
          );
        }

        const match = findExistingImportRow(
          byExternalId,
          bySlug,
          payload as { externalId: string; slug?: string | null }
        );
        const existing = match.existing;
        const isCreate = !existing;
        const nextData = isCreate
          ? createDataForEntity(entity, payload as SupportedPayload)
          : updateDataForEntity(entity, payload as SupportedPayload);
        const ignoredFields = ignoredFieldNames(entity, isCreate).filter((fieldName) =>
          hasMeaningfulValue(payload[fieldName])
        );
        const ignoredFieldIssue = createIgnoredFieldIssue(
          sheetName,
          rowNumber,
          ignoredFields,
          isCreate ? "create" : "update"
        );
        if (ignoredFieldIssue) {
          preview.issues.push(ignoredFieldIssue);
        }
        if (match.matchedBySlug && preview.slug) {
          preview.issues.push(
            createLegacyBackfillIssue(sheetName, rowNumber, preview.slug, String(payload.externalId))
          );
        }
        const existingComparable = existing
          ? pickFields(
              comparableExisting(existing),
              Object.keys(nextData) as Array<keyof typeof nextData>
            )
          : null;
        const diff = comparePayload(existingComparable, nextData);
        preview.operation = diff.operation;
        preview.changedFields = diff.changedFields;

        if (isCreate && preview.slug) {
          const slugOwner = bySlug.get(preview.slug);
          const slugOwnerExternalId =
            slugOwner && typeof slugOwner.externalId === "string"
              ? String(slugOwner.externalId)
              : null;

          if (slugOwner && slugOwnerExternalId !== preview.externalId) {
            preview.issues.push({
              severity: "error",
              sheet: sheetName,
              rowNumber: preview.rowNumber,
              field: "slug",
              message: slugOwnerExternalId
                ? `Slug "${preview.slug}" already belongs to another externalId (${slugOwnerExternalId})`
                : `Slug "${preview.slug}" already belongs to another existing record`,
            });
            preview.operation = "invalid";
          }
        } else if (!isCreate && preview.slug && preview.slug !== String(existing.slug ?? "")) {
          preview.issues.push(
            createIssue(
              "warning",
              sheetName,
              rowNumber,
              "slug",
              "Slug changes are ignored for existing records in bulk import v1"
            )
          );
        }
      }

      rows.push(preview);
      target.rows.push({ rowNumber, preview, payload: normalized.payload as never });
    }

    duplicateIssues(target.rows.map((item) => item.preview), sheetName, "externalId");
    duplicateIssues(
      target.rows.map((item) => item.preview),
      sheetName,
      "slug",
      (preview) => {
        const rowState = target.rows.find((item) => item.preview === preview);
        if (!rowState?.payload) return null;
        const rowPayload = rowState.payload as Record<string, unknown>;
        return byExternalId.has(String(rowPayload.externalId)) ? null : preview.slug;
      }
    );
  }

  if (!Object.values(data).some((sheetState) => sheetState.rows.length > 0)) {
    issues.push({
      severity: "error",
      sheet: "workbook",
      message: "No supported sheets found in workbook",
    });
  }

  for (const row of rows) {
    if (row.issues.some((issue) => issue.severity === "error")) {
      row.operation = "invalid";
    }
    addPreviewToSummary(summary, row);
  }

  for (const issue of issues) {
    if (issue.severity === "error") summary.errors += 1;
    if (issue.severity === "warning") summary.warnings += 1;
  }

  const createdAt = nowIso();
  return {
    id: randomUUID(),
    version: "bulk-import-v1",
    fileName,
    createdAt,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    appliedAt: null,
    workbookSheets: workbook.SheetNames,
    summary,
    issues,
    rows,
    data,
  };
}

export async function createBulkImportSession(buffer: Buffer, fileName: string) {
  const session = await buildSession(buffer, fileName);
  await saveSession(session);
  return toPreviewResponse(session);
}

export async function getBulkImportSession(sessionId: string) {
  const session = await loadSession(sessionId);
  return toPreviewResponse(session);
}

async function backfillKitchenExternalId(payload: KitchenPayload): Promise<BackfillResult> {
  const existing = await prisma.kitchen.findUnique({ where: { externalId: payload.externalId } });
  if (existing) return "already-set";

  const legacy = await prisma.kitchen.findUnique({ where: { slug: payload.slug } });
  if (!legacy || legacy.externalId) return "already-set";

  await prisma.kitchen.update({
    where: { id: legacy.id },
    data: { externalId: payload.externalId },
  });
  return "backfilled";
}

async function backfillStyleExternalId(payload: StylePayload): Promise<BackfillResult> {
  const existing = await prisma.stylePage.findUnique({ where: { externalId: payload.externalId } });
  if (existing) return "already-set";

  const legacy = await prisma.stylePage.findUnique({ where: { slug: payload.slug } });
  if (!legacy || legacy.externalId) return "already-set";

  await prisma.stylePage.update({
    where: { id: legacy.id },
    data: { externalId: payload.externalId },
  });
  return "backfilled";
}

async function backfillMaterialExternalId(payload: MaterialPayload): Promise<BackfillResult> {
  const existing = await prisma.materialPage.findUnique({ where: { externalId: payload.externalId } });
  if (existing) return "already-set";

  const legacy = await prisma.materialPage.findUnique({ where: { slug: payload.slug } });
  if (!legacy || legacy.externalId) return "already-set";

  await prisma.materialPage.update({
    where: { id: legacy.id },
    data: { externalId: payload.externalId },
  });
  return "backfilled";
}

async function backfillScenarioExternalId(payload: ScenarioPayload): Promise<BackfillResult> {
  const existing = await prisma.scenarioPage.findUnique({ where: { externalId: payload.externalId } });
  if (existing) return "already-set";

  const legacy = await prisma.scenarioPage.findUnique({ where: { slug: payload.slug } });
  if (!legacy || legacy.externalId) return "already-set";

  await prisma.scenarioPage.update({
    where: { id: legacy.id },
    data: { externalId: payload.externalId },
  });
  return "backfilled";
}

async function backfillPortfolioExternalId(payload: PortfolioPayload): Promise<BackfillResult> {
  const existing = await prisma.portfolioCase.findUnique({ where: { externalId: payload.externalId } });
  if (existing) return "already-set";

  const legacy = await prisma.portfolioCase.findUnique({ where: { slug: payload.slug } });
  if (!legacy || legacy.externalId) return "already-set";

  await prisma.portfolioCase.update({
    where: { id: legacy.id },
    data: { externalId: payload.externalId },
  });
  return "backfilled";
}

async function backfillLocationExternalId(payload: LocationPayload): Promise<BackfillResult> {
  const existing = await prisma.locationPage.findUnique({ where: { externalId: payload.externalId } });
  if (existing) return "already-set";

  const legacy = await prisma.locationPage.findUnique({ where: { slug: payload.slug } });
  if (!legacy || legacy.externalId) return "already-set";

  await prisma.locationPage.update({
    where: { id: legacy.id },
    data: { externalId: payload.externalId },
  });
  return "backfilled";
}

async function applyKitchen(payload: KitchenPayload) {
  await backfillKitchenExternalId(payload);
  const existing = await prisma.kitchen.findUnique({ where: { externalId: payload.externalId } });
  if (!existing) {
    await prisma.kitchen.create({ data: pickFields(payload, KITCHEN_CREATE_FIELDS) });
    return "create" as const;
  }
  const updateData = pickFields(payload, KITCHEN_UPDATE_FIELDS);
  const diff = comparePayload(pickFields(comparableExisting(existing as unknown as ComparableRow), KITCHEN_UPDATE_FIELDS), updateData);
  if (diff.operation === "unchanged") return "unchanged" as const;
  await prisma.kitchen.update({ where: { externalId: payload.externalId }, data: updateData });
  return "update" as const;
}

async function applyStyle(payload: StylePayload) {
  await backfillStyleExternalId(payload);
  const existing = await prisma.stylePage.findUnique({ where: { externalId: payload.externalId } });
  if (!existing) {
    await prisma.stylePage.create({ data: pickFields(payload, STYLE_CREATE_FIELDS) });
    return "create" as const;
  }
  const updateData = pickFields(payload, STYLE_UPDATE_FIELDS);
  const diff = comparePayload(pickFields(comparableExisting(existing as unknown as ComparableRow), STYLE_UPDATE_FIELDS), updateData);
  if (diff.operation === "unchanged") return "unchanged" as const;
  await prisma.stylePage.update({ where: { externalId: payload.externalId }, data: updateData });
  return "update" as const;
}

async function applyMaterial(payload: MaterialPayload) {
  await backfillMaterialExternalId(payload);
  const existing = await prisma.materialPage.findUnique({
    where: { externalId: payload.externalId },
  });
  if (!existing) {
    await prisma.materialPage.create({ data: pickFields(payload, MATERIAL_CREATE_FIELDS) });
    return "create" as const;
  }
  const updateData = pickFields(payload, MATERIAL_UPDATE_FIELDS);
  const diff = comparePayload(
    pickFields(comparableExisting(existing as unknown as ComparableRow), MATERIAL_UPDATE_FIELDS),
    updateData
  );
  if (diff.operation === "unchanged") return "unchanged" as const;
  await prisma.materialPage.update({ where: { externalId: payload.externalId }, data: updateData });
  return "update" as const;
}

async function applyScenario(payload: ScenarioPayload) {
  await backfillScenarioExternalId(payload);
  const existing = await prisma.scenarioPage.findUnique({
    where: { externalId: payload.externalId },
  });
  if (!existing) {
    const createData = pickFields(payload, SCENARIO_CREATE_FIELDS);
    await prisma.scenarioPage.create({
      data: { ...createData, features: payload.features as Prisma.InputJsonValue },
    });
    return "create" as const;
  }
  const updateData = pickFields(payload, SCENARIO_UPDATE_FIELDS);
  const diff = comparePayload(
    pickFields(comparableExisting(existing as unknown as ComparableRow), SCENARIO_UPDATE_FIELDS),
    updateData
  );
  if (diff.operation === "unchanged") return "unchanged" as const;
  await prisma.scenarioPage.update({
    where: { externalId: payload.externalId },
    data: { ...updateData, features: payload.features as Prisma.InputJsonValue },
  });
  return "update" as const;
}

async function applyPortfolio(payload: PortfolioPayload) {
  await backfillPortfolioExternalId(payload);
  const existing = await prisma.portfolioCase.findUnique({
    where: { externalId: payload.externalId },
  });
  if (!existing) {
    await prisma.portfolioCase.create({ data: pickFields(payload, PORTFOLIO_CREATE_FIELDS) });
    return "create" as const;
  }
  const updateData = pickFields(payload, PORTFOLIO_UPDATE_FIELDS);
  const diff = comparePayload(
    pickFields(comparableExisting(existing as unknown as ComparableRow), PORTFOLIO_UPDATE_FIELDS),
    updateData
  );
  if (diff.operation === "unchanged") return "unchanged" as const;
  await prisma.portfolioCase.update({ where: { externalId: payload.externalId }, data: updateData });
  return "update" as const;
}

async function applyLocation(payload: LocationPayload) {
  await backfillLocationExternalId(payload);
  const existing = await prisma.locationPage.findUnique({
    where: { externalId: payload.externalId },
  });
  if (!existing) {
    const createData = pickFields(payload, LOCATION_CREATE_FIELDS);
    await prisma.locationPage.create({
      data: {
        ...createData,
        faq: payload.faq as Prisma.InputJsonValue,
        uniquePoints: payload.uniquePoints as Prisma.InputJsonValue,
        contentBlocks: payload.contentBlocks as Prisma.InputJsonValue,
      },
    });
    return "create" as const;
  }
  const updateData = pickFields(payload, LOCATION_UPDATE_FIELDS);
  const diff = comparePayload(
    pickFields(comparableExisting(existing as unknown as ComparableRow), LOCATION_UPDATE_FIELDS),
    updateData
  );
  if (diff.operation === "unchanged") return "unchanged" as const;
  await prisma.locationPage.update({
    where: { externalId: payload.externalId },
    data: {
      ...updateData,
      faq: payload.faq as Prisma.InputJsonValue,
      uniquePoints: payload.uniquePoints as Prisma.InputJsonValue,
      contentBlocks: payload.contentBlocks as Prisma.InputJsonValue,
    },
  });
  return "update" as const;
}

export async function applyBulkImportSession(sessionId: string) {
  const session = await loadSession(sessionId);
  if (session.appliedAt) {
    return toPreviewResponse(session);
  }

  const applySummary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    invalid: 0,
  };

  for (const entity of SHEET_ORDER) {
    for (const row of session.data[entity].rows) {
      if (!row.payload || row.preview.operation === "invalid") {
        applySummary.invalid += 1;
        continue;
      }

      let result: "create" | "update" | "unchanged";
      switch (entity) {
        case "kitchens":
          result = await applyKitchen(row.payload as KitchenPayload);
          break;
        case "styles":
          result = await applyStyle(row.payload as StylePayload);
          break;
        case "materials":
          result = await applyMaterial(row.payload as MaterialPayload);
          break;
        case "scenarios":
          result = await applyScenario(row.payload as ScenarioPayload);
          break;
        case "portfolio":
          result = await applyPortfolio(row.payload as PortfolioPayload);
          break;
        case "locations":
          result = await applyLocation(row.payload as LocationPayload);
          break;
      }

      if (result === "create") applySummary.created += 1;
      if (result === "update") applySummary.updated += 1;
      if (result === "unchanged") applySummary.unchanged += 1;
    }
  }

  session.appliedAt = nowIso();
  session.applyResult = {
    appliedAt: session.appliedAt,
    summary: applySummary,
  };

  await saveSession(session);
  return toPreviewResponse(session);
}
