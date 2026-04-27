export const SITE_NAME = "КухниBY";

export function cleanSeoTitle(title: string | null | undefined, fallback: string) {
  const value = title?.trim() || fallback;

  return value
    .replace(new RegExp(`\\s*[|—-]\\s*${SITE_NAME}\\b`, "gi"), "")
    .replace(new RegExp(`\\b${SITE_NAME}\\s*[|—-]\\s*`, "gi"), "")
    .replace(new RegExp(`\\s+${SITE_NAME}\\s+`, "gi"), " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function trimMetaDescription(description: string | null | undefined, fallback: string) {
  const provided = description?.trim();
  const value = provided && provided.length >= 70 ? provided : fallback;

  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}...` : value;
}
