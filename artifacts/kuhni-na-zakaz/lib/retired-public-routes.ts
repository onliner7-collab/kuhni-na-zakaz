/** Retained for old links; not a standalone public landing page anymore. */
export const RETIRED_SMALL_SCENARIO = "/scenarios/dlya-malenkoy-kuhni";
export const SMALL_KITCHEN_CANONICAL = "/catalog/malenkie-kuhni";

export function resolvePublicPath(href: string): string {
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (match?.[1].replace(/\/$/, "") !== RETIRED_SMALL_SCENARIO) return href;
  return SMALL_KITCHEN_CANONICAL + (match[2] ?? "");
}

export function isRetiredScenario(slug: string): boolean {
  return slug === "dlya-malenkoy-kuhni";
}
