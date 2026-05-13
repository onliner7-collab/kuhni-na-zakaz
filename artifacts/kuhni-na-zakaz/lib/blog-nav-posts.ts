import { BLOG_POSTS } from "@/lib/blog-static";
import { SEO_BLOG_POSTS_FALLBACK } from "@/lib/blog-seo-fallback";

export function getOtherBlogPostLinks(currentSlug: string, limit = 3) {
  const map = new Map<string, string>();
  for (const p of BLOG_POSTS) map.set(p.slug, p.title);
  for (const p of SEO_BLOG_POSTS_FALLBACK) map.set(p.slug, p.title);
  return [...map.entries()]
    .filter(([slug]) => slug !== currentSlug)
    .slice(0, limit)
    .map(([slug, title]) => ({ slug, title }));
}
