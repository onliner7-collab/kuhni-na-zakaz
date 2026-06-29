import { prisma } from "@/lib/db";
import { mergeBlogCover, type BlogPostWithCover } from "@/lib/blog-cover-meta";
import { SEO_BLOG_POSTS_BY_SLUG } from "@/lib/blog-seo-fallback";
import { BLOG_POSTS_BY_SLUG } from "@/lib/blog-static";

export type MergedBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  relatedCaseSlugs?: string[];
  relatedStyleSlugs?: string[];
  relatedScenarioSlugs?: string[];
} & BlogPostWithCover;

export async function getMergedPublishedBlogPost(
  slug: string,
): Promise<MergedBlogPost | null> {
  const staticPost = BLOG_POSTS_BY_SLUG[slug] ?? SEO_BLOG_POSTS_BY_SLUG[slug];

  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } });
    if (p?.published) {
      return mergeBlogCover({
        slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        readTime: p.readTime,
        content: p.content,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: p.publishedAt,
        updatedAt: p.updatedAt,
        relatedCaseSlugs:
          p.relatedCaseSlugs.length > 0
            ? p.relatedCaseSlugs
            : staticPost?.relatedCaseSlugs,
        relatedStyleSlugs:
          p.relatedStyleSlugs.length > 0
            ? p.relatedStyleSlugs
            : staticPost?.relatedStyleSlugs,
        relatedScenarioSlugs:
          p.relatedScenarioSlugs.length > 0
            ? p.relatedScenarioSlugs
            : staticPost?.relatedScenarioSlugs,
        coverImage: p.coverImage,
      }) as MergedBlogPost;
    }
  } catch {
    /* БД недоступна — ниже статический fallback */
  }

  const s = staticPost;
  if (s?.published) {
    return mergeBlogCover({
      slug,
      title: s.title,
      excerpt: s.excerpt,
      category: s.category,
      readTime: s.readTime,
      content: s.content,
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      publishedAt: s.publishedAt,
      updatedAt: undefined,
      relatedCaseSlugs: s.relatedCaseSlugs,
      relatedStyleSlugs: s.relatedStyleSlugs,
      relatedScenarioSlugs: s.relatedScenarioSlugs,
      coverImage: s.coverImage,
    }) as MergedBlogPost;
  }

  return null;
}
