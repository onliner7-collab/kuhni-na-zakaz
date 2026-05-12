import { CANONICAL_SITE_URL } from "@/lib/seo";

export const DEFAULT_SITE_URL = CANONICAL_SITE_URL;

export function getSiteUrl(value = DEFAULT_SITE_URL) {
  const rawUrl = value || DEFAULT_SITE_URL;

  try {
    const url = new URL(rawUrl);
    url.hostname = url.hostname.replace(/^www\./i, "");
    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}
