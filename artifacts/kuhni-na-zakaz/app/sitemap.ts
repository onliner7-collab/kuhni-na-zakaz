import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kuhniby.by";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/catalog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/styles`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/materials`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/prices`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/delivery-installation`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/warranty`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/configure`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const catalogSlugs = [
    "uglovye-kuhni", "pryamye-kuhni", "p-obraznye-kuhni",
    "kuhni-s-ostrovom", "malenkie-kuhni", "kuhni-do-potolka", "kuhni-bez-ruchek",
  ];
  const catalogPages: MetadataRoute.Sitemap = catalogSlugs.map((slug) => ({
    url: `${BASE_URL}/catalog/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8,
  }));

  const stylesSlugs = ["sovremennye", "klassicheskie", "skandinavskie", "minimalizm", "loft"];
  const stylesPages: MetadataRoute.Sitemap = stylesSlugs.map((slug) => ({
    url: `${BASE_URL}/styles/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7,
  }));

  const materialsSlugs = ["mdf", "plastik", "emal", "shpon", "egger"];
  const materialsPages: MetadataRoute.Sitemap = materialsSlugs.map((slug) => ({
    url: `${BASE_URL}/materials/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7,
  }));

  let portfolioPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  let locationPages: MetadataRoute.Sitemap = [];
  let staticCmsPages: MetadataRoute.Sitemap = [];

  try {
    const [cases, posts, locations, staticPgs] = await Promise.all([
      prisma.portfolioCase.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.locationPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.staticPage.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    portfolioPages = cases.map((c) => ({
      url: `${BASE_URL}/portfolio/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "monthly" as const, priority: 0.7,
    }));

    blogPages = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.7,
    }));

    locationPages = locations.map((l) => ({
      url: `${BASE_URL}/locations/${l.slug}`, lastModified: l.updatedAt, changeFrequency: "monthly" as const, priority: 0.8,
    }));

    staticCmsPages = staticPgs.map((p) => ({
      url: `${BASE_URL}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.5,
    }));
  } catch {}

  return [
    ...staticPages,
    ...catalogPages,
    ...stylesPages,
    ...materialsPages,
    ...portfolioPages,
    ...blogPages,
    ...locationPages,
    ...staticCmsPages,
  ];
}
