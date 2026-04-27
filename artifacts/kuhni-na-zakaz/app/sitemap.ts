import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";

const BASE_URL = getSiteUrl();
const STATIC_PATHS = [
  "/",
  "/about",
  "/catalog",
  "/prices",
  "/contacts",
  "/portfolio",
  "/blog",
  "/delivery-installation",
  "/styles",
  "/materials",
  "/scenarios",
  "/locations",
  "/warranty",
] as const;

const STATIC_CATALOG_SLUGS = [
  "uglovye-kuhni",
  "pryamye-kuhni",
  "p-obraznye-kuhni",
  "kuhni-s-ostrovom",
  "malenkie-kuhni",
  "kuhni-do-potolka",
  "kuhni-bez-ruchek",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  let kitchenPages: MetadataRoute.Sitemap = [];
  let portfolioPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  let locationPages: MetadataRoute.Sitemap = [];
  let stylePages: MetadataRoute.Sitemap = [];
  let materialPages: MetadataRoute.Sitemap = [];
  let scenarioPages: MetadataRoute.Sitemap = [];

  try {
    const [kitchens, cases, posts, locations, styles, materials, scenarios] = await Promise.all([
      prisma.kitchen.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.portfolioCase.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.locationPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.stylePage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.materialPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.scenarioPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    kitchenPages = kitchens.map((item) => sitemapEntry(`/catalog/${item.slug}`, item.updatedAt, 0.8));
    portfolioPages = cases.map((item) => sitemapEntry(`/portfolio/${item.slug}`, item.updatedAt, 0.7));
    blogPages = posts.map((item) => sitemapEntry(`/blog/${item.slug}`, item.updatedAt, 0.7));
    locationPages = locations.map((item) => sitemapEntry(`/locations/${item.slug}`, item.updatedAt, 0.8));
    stylePages = styles.map((item) => sitemapEntry(`/styles/${item.slug}`, item.updatedAt, 0.7));
    materialPages = materials.map((item) => sitemapEntry(`/materials/${item.slug}`, item.updatedAt, 0.7));
    scenarioPages = scenarios.map((item) => sitemapEntry(`/scenarios/${item.slug}`, item.updatedAt, 0.7));
  } catch {}

  const staticCatalogPages = STATIC_CATALOG_SLUGS.map((slug) =>
    sitemapEntry(`/catalog/${slug}`, now, 0.8),
  );

  return uniqueIndexableEntries([
    ...staticPages,
    ...staticCatalogPages,
    ...kitchenPages,
    ...stylePages,
    ...materialPages,
    ...scenarioPages,
    ...portfolioPages,
    ...blogPages,
    ...locationPages,
  ]);
}

function sitemapEntry(
  path: string,
  lastModified: Date,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly",
    priority,
  };
}

function absoluteUrl(path: string) {
  const normalizedPath = normalizePath(path);
  return `${BASE_URL}${normalizedPath}`;
}

function uniqueIndexableEntries(entries: MetadataRoute.Sitemap) {
  const seen = new Set<string>();
  const result: MetadataRoute.Sitemap = [];

  for (const entry of entries) {
    const url = typeof entry.url === "string" ? entry.url : "";
    const canonicalUrl = canonicalizeSitemapUrl(url);

    if (!canonicalUrl || seen.has(canonicalUrl)) {
      continue;
    }

    seen.add(canonicalUrl);
    result.push({ ...entry, url: canonicalUrl });
  }

  return result;
}

function canonicalizeSitemapUrl(url: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    parsed.protocol = "https:";
    parsed.hostname = parsed.hostname.replace(/^www\./i, "");
    parsed.pathname = normalizePath(parsed.pathname);
    parsed.search = "";
    parsed.hash = "";

    const canonicalUrl = parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
    return isIndexableUrl(canonicalUrl) ? canonicalUrl : null;
  } catch {
    return null;
  }
}

function normalizePath(path: string) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  if (pathname === "/") return "/";

  return pathname.replace(/\/+$/g, "");
}

function isIndexableUrl(url: string) {
  const blockedPathPrefixes = ["/admin", "/login", "/api", "/kapi", "/search"];

  try {
    const { pathname, search } = new URL(url);
    if (search) return false;
    if (pathname.includes("/draft")) return false;
    if (pathname.includes("/preview")) return false;
    if (pathname.includes("//")) return false;

    return !blockedPathPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  } catch {
    return false;
  }
}
