export type EvidencePreference = "ideas" | "real";

export interface ExploreContextValue {
  layout?: string;
  style?: string;
  materials?: string[];
  hardware?: string[];
  scenario?: string;
  location?: string;
  budgetIntent?: string;
  evidencePreference?: EvidencePreference;
  sourceRoute: string;
  lastMeaningfulAction: string;
}

export const EXPLORE_CONTEXT_STORAGE_KEY = "kuhni-explore-context";

export const emptyExploreContext = (sourceRoute = "/"): ExploreContextValue => ({
  sourceRoute,
  lastMeaningfulAction: "",
});

export function readExploreContext(sourceRoute = "/"): ExploreContextValue {
  if (typeof window === "undefined") return emptyExploreContext(sourceRoute);
  try {
    const raw = window.sessionStorage.getItem(EXPLORE_CONTEXT_STORAGE_KEY);
    if (!raw) return emptyExploreContext(sourceRoute);
    const parsed = JSON.parse(raw) as Partial<ExploreContextValue>;
    return {
      ...emptyExploreContext(sourceRoute),
      ...parsed,
      sourceRoute: parsed.sourceRoute || sourceRoute,
    };
  } catch {
    return emptyExploreContext(sourceRoute);
  }
}

export function writeExploreContext(value: ExploreContextValue) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(EXPLORE_CONTEXT_STORAGE_KEY, JSON.stringify(value));
}
