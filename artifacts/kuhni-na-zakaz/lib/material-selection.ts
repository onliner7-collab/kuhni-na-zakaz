import { MATERIAL_ROUTES, materialById } from "@/data/material-solutions";
export const MATERIAL_STORAGE_KEY = "kuhni-materials-v1";
export const MATERIAL_TTL = 30 * 24 * 60 * 60 * 1000;
export type MaterialState = {
  version: 1;
  comparisonIds: string[];
  preferredId: string | null;
  updatedAt: number;
  recentViews: string[];
  galleryFilters: Record<string, string>;
  galleryLimit: number;
  activePhoto: string | null;
  mdfGallery: { material: string; layout: string; limit: number; activePhoto: string | null };
  onlyDifferences: boolean;
  scenarioId: string;
  returnTo: string;
};
export const EMPTY_MATERIAL_STATE: MaterialState = {
  version: 1,
  comparisonIds: [],
  preferredId: null,
  updatedAt: 0,
  recentViews: [],
  galleryFilters: {},
  galleryLimit: 12,
  activePhoto: null,
  mdfGallery: { material: "", layout: "", limit: 6, activePhoto: null },
  onlyDifferences: false,
  scenarioId: "straight-3m",
  returnTo: "/materials#compare",
};
export function safeMaterialReturn(input: unknown) {
  if (
    typeof input !== "string" ||
    !input.startsWith("/") ||
    input.startsWith("//") ||
    input.length > 1000
  )
    return "/materials#compare";
  try {
    const u = new URL(input, "https://internal.invalid");
    if (
      u.origin !== "https://internal.invalid" ||
      !(MATERIAL_ROUTES as readonly string[]).includes(u.pathname)
    )
      return "/materials#compare";
    const out = new URL(u.pathname, "https://internal.invalid");
    for (const k of ["compare", "preferred"])
      if (u.searchParams.has(k))
        out.searchParams.set(k, (u.searchParams.get(k) || "").slice(0, 120));
    if (["#compare", "#gallery", "#solutions", "#plenka", ""].includes(u.hash))
      out.hash = u.hash;
    return out.pathname + out.search + out.hash;
  } catch {
    return "/materials#compare";
  }
}
export function sanitizeMaterialState(
  input: unknown,
  now = Date.now(),
): MaterialState {
  const v =
    input && typeof input === "object" ? (input as Partial<MaterialState>) : {};
  if (v.version !== 1) return { ...EMPTY_MATERIAL_STATE };
  const ids = Array.isArray(v.comparisonIds)
    ? [
        ...new Set(
          v.comparisonIds.filter(
            (x) => typeof x === "string" && materialById(x),
          ),
        ),
      ].slice(0, 3)
    : [];
  const updatedAt =
    typeof v.updatedAt === "number" && Number.isFinite(v.updatedAt)
      ? v.updatedAt
      : 0;
  const valid =
    updatedAt > 0 && updatedAt <= now + 60000 && now - updatedAt < MATERIAL_TTL;
  const recentViews = Array.isArray(v.recentViews)
    ? v.recentViews
        .filter(
          (x) =>
            typeof x === "string" &&
            ((MATERIAL_ROUTES as readonly string[]).includes(x) ||
              /^[a-z0-9-]{1,100}$/.test(x)),
        )
        .slice(0, 10)
    : [];
  const galleryFilters: Record<string, string> = {};
  for (const [k, value] of Object.entries(v.galleryFilters || {}))
    if (
      ["material", "color", "finish", "texture", "milling", "layout"].includes(
        k,
      ) &&
      typeof value === "string" &&
      value.length < 50
    )
      galleryFilters[k] = value;
  return {
    ...EMPTY_MATERIAL_STATE,
    comparisonIds: valid ? ids : [],
    preferredId:
      valid && typeof v.preferredId === "string" && ids.includes(v.preferredId)
        ? v.preferredId
        : null,
    updatedAt: valid ? updatedAt : 0,
    recentViews,
    galleryFilters,
    galleryLimit:
      typeof v.galleryLimit === "number"
        ? Math.min(120, Math.max(12, v.galleryLimit))
        : 12,
    activePhoto:
      typeof v.activePhoto === "string" &&
      /^[a-z0-9-]{1,100}$/.test(v.activePhoto)
        ? v.activePhoto
        : null,
    onlyDifferences: v.onlyDifferences === true,
    mdfGallery: {
      material: ["mdf-film", "mdf-enamel"].includes(v.mdfGallery?.material || "") ? v.mdfGallery!.material : "",
      layout: ["Прямая", "Угловая", "Деталь"].includes(v.mdfGallery?.layout || "") ? v.mdfGallery!.layout : "",
      limit: typeof v.mdfGallery?.limit === "number" && Number.isFinite(v.mdfGallery.limit) ? Math.min(60, Math.max(6, Math.floor(v.mdfGallery.limit))) : 6,
      activePhoto: typeof v.mdfGallery?.activePhoto === "string" && /^mdf-20261015-[a-z-]+$/.test(v.mdfGallery.activePhoto) ? v.mdfGallery.activePhoto : null,
    },
    scenarioId:
      v.scenarioId === "corner-24-18" ? "corner-24-18" : "straight-3m",
    returnTo: safeMaterialReturn(v.returnTo),
  };
}
export function reconcileMaterialUrl(
  state: MaterialState,
  url: string,
  now = Date.now(),
) {
  const p = new URL(url, "https://internal.invalid").searchParams;
  if (!p.has("compare")) return state;
  const ids = [
    ...new Set(
      (p.get("compare") || "").split(",").filter((id) => materialById(id)),
    ),
  ].slice(0, 3);
  return {
    ...state,
    comparisonIds: ids,
    preferredId: ids.includes(p.get("preferred") || "")
      ? p.get("preferred")
      : null,
    updatedAt: state.updatedAt || now,
    returnTo: safeMaterialReturn(p.get("returnTo") || state.returnTo),
  };
}
let memory: MaterialState = EMPTY_MATERIAL_STATE;
export function readMaterialState(url?: string) {
  if (typeof window === "undefined") return EMPTY_MATERIAL_STATE;
  let value = memory;
  try {
    const raw = localStorage.getItem(MATERIAL_STORAGE_KEY);
    if (raw) value = sanitizeMaterialState(JSON.parse(raw));
  } catch {
    /* Memory and URL remain usable. */
  }
  return reconcileMaterialUrl(value, url || window.location.href);
}
export function writeMaterialState(state: MaterialState) {
  memory = state;
  try {
    const raw = JSON.stringify(state);
    if (localStorage.getItem(MATERIAL_STORAGE_KEY) !== raw)
      localStorage.setItem(MATERIAL_STORAGE_KEY, raw);
  } catch {
    /* Optional storage. */
  }
}
export function comparisonHref(
  state: MaterialState,
  base = "/materials",
  hash = "#compare",
) {
  const u = new URL(base, "https://internal.invalid");
  u.searchParams.set("compare", state.comparisonIds.join(","));
  if (state.preferredId) u.searchParams.set("preferred", state.preferredId);
  else u.searchParams.delete("preferred");
  u.hash = hash;
  return u.pathname + u.search + u.hash;
}
export function buildMaterialLink(
  state: MaterialState,
  href: string,
  fromComparison = false,
) {
  const u = new URL(href, "https://internal.invalid");
  const link = new URL(
    comparisonHref(state, u.pathname, u.hash),
    "https://internal.invalid",
  );
  if (fromComparison) link.searchParams.set("returnTo", comparisonHref(state));
  return link.pathname + link.search + link.hash;
}
export function materialSelectionForLead(state = readMaterialState()) {
  return {
    version: 1,
    comparisonIds: state.comparisonIds,
    comparisonNames: state.comparisonIds.map((id) => materialById(id)!.title),
    preferredId: state.preferredId,
    preferredName: state.preferredId
      ? materialById(state.preferredId)?.title
      : null,
    scenarioId: state.scenarioId,
  };
}
export function normalizeMaterialLead(input: unknown) {
  const v =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const ids = Array.isArray(v.comparisonIds)
    ? [
        ...new Set(
          v.comparisonIds.filter(
            (id): id is string =>
              typeof id === "string" && Boolean(materialById(id)),
          ),
        ),
      ].slice(0, 3)
    : [];
  return materialSelectionForLead({
    ...EMPTY_MATERIAL_STATE,
    comparisonIds: ids,
    preferredId:
      typeof v.preferredId === "string" && ids.includes(v.preferredId)
        ? v.preferredId
        : null,
    scenarioId:
      v.scenarioId === "corner-24-18" ? "corner-24-18" : "straight-3m",
  });
}
