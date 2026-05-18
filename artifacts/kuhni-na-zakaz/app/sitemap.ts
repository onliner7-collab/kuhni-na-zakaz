import type { MetadataRoute } from "next";
import { regionalLocations } from "@/data/locations";
import { prisma } from "@/lib/db";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { getSiteUrl } from "@/lib/site-url";

const BASE_URL = getSiteUrl();
const STATIC_LAST_MODIFIED = new Date("2026-05-11T00:00:00.000Z");

export const dynamic = "force-dynamic";
export const revalidate = 0;
const STATIC_PATHS = [
  "/",
  "/about",
  "/catalog",
  "/calculator",
  "/design-proekt-kuhni",
  "/prices",
  "/contacts",
  "/portfolio",
  "/reviews",
  "/blog",
  "/delivery-installation",
  "/styles",
  "/materials",
  "/materials/ldsp",
  "/materials/mdf-fasady",
  "/materials/plastik-hpl",
  "/scenarios",
  "/locations",
  "/warranty",
] as const;

const STATIC_LOCATION_SLUGS = [
  ...regionalLocations.map((location) => location.slug),
  "brest",
  "grodno",
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
  const staticPages = STATIC_PATHS.map((path) =>
    sitemapEntry(path, STATIC_LAST_MODIFIED, path === "/" ? 1 : 0.8, "weekly"),
  );

  let portfolioPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  let locationPages: MetadataRoute.Sitemap = [];
  let stylePages: MetadataRoute.Sitemap = [];
  let materialPages: MetadataRoute.Sitemap = [];
  let scenarioPages: MetadataRoute.Sitemap = [];

  try {
    const [cases, posts, locations, styles, materials, scenarios] = await Promise.all([
      prisma.portfolioCase.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.locationPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.stylePage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.materialPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.scenarioPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
    ]);

    portfolioPages = cases.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/portfolio/${item.slug}`, item.updatedAt, 0.7));
    blogPages = posts.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/blog/${item.slug}`, item.updatedAt, 0.7));
    locationPages = locations.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/locations/${item.slug}`, item.updatedAt, 0.8));
    stylePages = styles.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/styles/${item.slug}`, item.updatedAt, 0.7));
    materialPages = materials.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/materials/${item.slug}`, item.updatedAt, 0.7));
    scenarioPages = scenarios.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/scenarios/${item.slug}`, item.updatedAt, 0.7));
  } catch {}

  const staticCatalogPages = STATIC_CATALOG_SLUGS.map((slug) =>
    sitemapEntry(`/catalog/${slug}`, STATIC_LAST_MODIFIED, 0.8),
  );
  const staticLocationPages = STATIC_LOCATION_SLUGS.map((slug) =>
    sitemapEntry(`/locations/${slug}`, STATIC_LAST_MODIFIED, 0.8),
  );

  return uniqueIndexableEntries([
    ...staticPages,
    ...staticCatalogPages,
    ...stylePages,
    ...materialPages,
    ...scenarioPages,
    ...portfolioPages,
    ...blogPages,
    ...locationPages,
    ...staticLocationPages,
  ]);
}

function sitemapEntry(
  path: string,
  lastModified: Date | undefined,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
): MetadataRoute.Sitemap[number] {
  const entry: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  };

  if (lastModified) {
    entry.lastModified = lastModified;
  }

  return entry;
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
