import type { ExploreContextState } from "./exploration-types";

export type EvidencePreference = "ideas" | "real";
export type ExploreContextValue = ExploreContextState;

export const EXPLORE_CONTEXT_VERSION = 2;
export const EXPLORE_CONTEXT_STORAGE_KEY = "kuhni-explore-context-v2";
export const LEGACY_EXPLORE_CONTEXT_STORAGE_KEY = "kuhni-explore-context";

const textKeys = [
  "layout",
  "style",
  "scenario",
  "location",
  "budgetIntent",
  "sourceRoute",
  "lastMeaningfulAction",
] as const;

interface StoredExploreContext {
  version: typeof EXPLORE_CONTEXT_VERSION;
  value: ExploreContextValue;
}

export const emptyExploreContext = (sourceRoute = "/"): ExploreContextValue => ({
  sourceRoute,
  lastMeaningfulAction: "",
});

function cleanText(value: unknown) {
  return typeof value === "string" && value.length <= 160 ? value.trim() : undefined;
}

function cleanList(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
  return items.length ? items : undefined;
}

export function sanitizeExploreContext(value: unknown, sourceRoute = "/"): ExploreContextValue {
  const candidate = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const result: ExploreContextValue = emptyExploreContext(sourceRoute);
  for (const key of textKeys) {
    const cleaned = cleanText(candidate[key]);
    if (cleaned !== undefined) result[key] = cleaned;
  }
  result.sourceRoute = cleanText(candidate.sourceRoute) || sourceRoute;
  result.lastMeaningfulAction = cleanText(candidate.lastMeaningfulAction) || "";
  result.materials = cleanList(candidate.materials);
  result.hardware = cleanList(candidate.hardware);
  if (candidate.evidencePreference === "ideas" || candidate.evidencePreference === "real") {
    result.evidencePreference = candidate.evidencePreference;
  }
  return result;
}

export function migrateExploreContext(value: unknown, sourceRoute = "/"): ExploreContextValue {
  if (value && typeof value === "object" && "version" in value && "value" in value) {
    return sanitizeExploreContext((value as Partial<StoredExploreContext>).value, sourceRoute);
  }
  return sanitizeExploreContext(value, sourceRoute);
}

export function readExploreContext(sourceRoute = "/"): ExploreContextValue {
  if (typeof window === "undefined") return emptyExploreContext(sourceRoute);
  try {
    const raw = window.sessionStorage.getItem(EXPLORE_CONTEXT_STORAGE_KEY)
      || window.sessionStorage.getItem(LEGACY_EXPLORE_CONTEXT_STORAGE_KEY);
    if (!raw) return emptyExploreContext(sourceRoute);
    const migrated = migrateExploreContext(JSON.parse(raw), sourceRoute);
    writeExploreContext(migrated);
    window.sessionStorage.removeItem(LEGACY_EXPLORE_CONTEXT_STORAGE_KEY);
    return migrated;
  } catch {
    return emptyExploreContext(sourceRoute);
  }
}

export function writeExploreContext(value: ExploreContextValue) {
  if (typeof window === "undefined") return;
  const stored: StoredExploreContext = {
    version: EXPLORE_CONTEXT_VERSION,
    value: sanitizeExploreContext(value, value.sourceRoute),
  };
  window.sessionStorage.setItem(EXPLORE_CONTEXT_STORAGE_KEY, JSON.stringify(stored));
}

export function serializeExploreContextForLead(value: ExploreContextValue) {
  const sanitized = sanitizeExploreContext(value, value.sourceRoute);
  const hasSelection = Boolean(
    sanitized.layout
      || sanitized.style
      || sanitized.materials?.length
      || sanitized.hardware?.length
      || sanitized.scenario
      || sanitized.location
      || sanitized.budgetIntent
      || sanitized.evidencePreference,
  );
  return hasSelection ? sanitized : null;
}
