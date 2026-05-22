import type { MetadataRoute } from "next";
import { regionalLocations } from "@/data/locations";
import { prisma } from "@/lib/db";
import { BLOG_POSTS } from "@/lib/blog-static";
import { SEO_BLOG_POSTS_FALLBACK } from "@/lib/blog-seo-fallback";
import { GENERATED_MINSK_PORTFOLIO_CASES } from "@/data/portfolio-projects";
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

const NON_CANONICAL_DYNAMIC_PATHS = new Set([
  "/locations/zhodzina",
  "/scenarios/kuhnya-dlya-studii",
  "/catalog/kuhnya-bez-ruchek-minsk",
  "/catalog/kuhnya-do-potolka-minsk",
  "/catalog/malenkaya-kuhnya-minsk",
  "/catalog/pryamaya-kuhnya-minsk",
  "/catalog/uglovaya-kuhnya-minsk",
  "/catalog/p-obraznaya-kuhnya-minsk",
  "/catalog/kuhnya-s-ostrovom-minsk",
  "/catalog/kuhnya-dlya-studii-minsk",
  "/catalog/sovremennaya-kuhnya-minsk",
  "/catalog/kuhnya-ekonom-minsk",
]);

const SECONDARY_SCENARIO_SLUGS = new Set([
  "kuhnya-do-potolka",
  "kuhnya-s-ostrovom",
  "kuhnya-bez-ruchek",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = STATIC_PATHS.map((path) =>
    sitemapEntry(path, STATIC_LAST_MODIFIED, path === "/" ? 1 : 0.8, "weekly"),
  );

  let catalogPages: MetadataRoute.Sitemap = [];
  let portfolioPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  let locationPages: MetadataRoute.Sitemap = [];
  let stylePages: MetadataRoute.Sitemap = [];
  let materialPages: MetadataRoute.Sitemap = [];
  let scenarioPages: MetadataRoute.Sitemap = [];

  try {
    const [kitchens, cases, posts, locations, styles, materials, scenarios] = await Promise.all([
      prisma.kitchen.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.portfolioCase.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.locationPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.stylePage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.materialPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
      prisma.scenarioPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true, updatedAt: true } }),
    ]);

    catalogPages = kitchens.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/catalog/${item.slug}`, item.updatedAt, 0.65));
    portfolioPages = cases.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/portfolio/${item.slug}`, item.updatedAt, 0.65));
    blogPages = posts.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/blog/${item.slug}`, item.updatedAt, 0.65));
    locationPages = locations.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/locations/${item.slug}`, item.updatedAt, 0.8));
    stylePages = styles.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/styles/${item.slug}`, item.updatedAt, 0.55));
    materialPages = materials.filter((item) => isPublicContentSlug(item.slug)).map((item) => sitemapEntry(`/materials/${item.slug}`, item.updatedAt, 0.55));
    scenarioPages = scenarios
      .filter((item) => isPublicContentSlug(item.slug) && !SECONDARY_SCENARIO_SLUGS.has(item.slug))
      .map((item) => sitemapEntry(`/scenarios/${item.slug}`, item.updatedAt, 0.55));
  } catch (error) {
    console.error("Failed to load dynamic sitemap URLs from database", error);
  }

  const staticCatalogPages = STATIC_CATALOG_SLUGS.map((slug) =>
    sitemapEntry(`/catalog/${slug}`, STATIC_LAST_MODIFIED, 0.8),
  );
  const staticLocationPages = STATIC_LOCATION_SLUGS.map((slug) =>
    sitemapEntry(`/locations/${slug}`, STATIC_LAST_MODIFIED, 0.8),
  );
  const staticBlogPages = [...SEO_BLOG_POSTS_FALLBACK, ...BLOG_POSTS]
    .filter((post) => post.published !== false && isPublicContentSlug(post.slug))
    .map((post) =>
      sitemapEntry(
        `/blog/${post.slug}`,
        post.publishedAt ? new Date(post.publishedAt) : STATIC_LAST_MODIFIED,
        0.65,
      ),
    );
  const staticPortfolioPages = GENERATED_MINSK_PORTFOLIO_CASES.map((project) =>
    sitemapEntry(`/portfolio/${project.slug}`, project.updatedAt, 0.65),
  );

  return uniqueIndexableEntries([
    ...staticPages,
    ...staticCatalogPages,
    ...catalogPages,
    ...stylePages,
    ...materialPages,
    ...scenarioPages,
    ...staticPortfolioPages,
    ...portfolioPages,
    ...staticBlogPages,
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
    if (NON_CANONICAL_DYNAMIC_PATHS.has(pathname)) return false;

    return !blockedPathPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  } catch {
    return false;
  }
}
