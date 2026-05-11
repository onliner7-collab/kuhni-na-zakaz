import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/sections/ContactForm";
import { renderContent } from "@/lib/render-content";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { isPreoptimizedRasterSrc, optimizedImageSrc } from "@/lib/image-optimization";
import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import {
  JsonLd,
  breadcrumbJsonLd,
  compactJsonLd,
  siteUrl,
} from "@/lib/schema-org";
import { BLOG_POSTS, BLOG_POSTS_BY_SLUG } from "@/lib/blog-static";

const STATIC_POSTS = BLOG_POSTS_BY_SLUG;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRelatedContent(
  relatedCaseSlugs: string[],
  relatedStyleSlugs: string[],
  relatedScenarioSlugs: string[],
) {
  try {
    const [cases, styles, scenarios] = await Promise.all([
      relatedCaseSlugs.length > 0
        ? prisma.portfolioCase.findMany({
            where: { slug: { in: relatedCaseSlugs }, published: true },
            select: {
              id: true,
              slug: true,
              title: true,
              city: true,
              area: true,
              priceFrom: true,
              mainImage: true,
              style: true,
            },
          })
        : Promise.resolve([]),
      relatedStyleSlugs.length > 0
        ? prisma.stylePage.findMany({
            where: { slug: { in: relatedStyleSlugs }, published: true },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              image: true,
              priceFrom: true,
            },
          })
        : Promise.resolve([]),
      relatedScenarioSlugs.length > 0
        ? prisma.scenarioPage.findMany({
            where: { slug: { in: relatedScenarioSlugs }, published: true },
            select: {
              id: true,
              slug: true,
              title: true,
              icon: true,
              intro: true,
            },
          })
        : Promise.resolve([]),
    ]);
    return { cases, styles, scenarios };
  } catch {
    return { cases: [], styles: [], scenarios: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } });
    if (p?.published)
      return {
        title: cleanSeoTitle(p.seoTitle, p.title),
        description: trimMetaDescription(p.seoDescription, p.excerpt),
        alternates: { canonical: `/blog/${slug}` },
      };
  } catch {}
  const s = STATIC_POSTS[slug];
  if (s)
    return {
      title: cleanSeoTitle(s.title, s.title),
      description: trimMetaDescription(s.excerpt, s.excerpt),
      alternates: { canonical: `/blog/${slug}` },
    };
  return { title: "Статья" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let data: {
    title: string;
    excerpt: string;
    category: string;
    readTime: number;
    content: string;
    coverImage?: string;
    publishedAt?: Date | null;
    updatedAt?: Date | null;
    relatedCaseSlugs?: string[];
    relatedStyleSlugs?: string[];
    relatedScenarioSlugs?: string[];
  } | null = null;
  try {
    const p = await prisma.blogPost.findUnique({ where: { slug } });
    if (p && p.published)
      data = {
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        readTime: p.readTime,
        content: p.content,
        coverImage: p.coverImage,
        publishedAt: p.publishedAt,
        updatedAt: p.updatedAt,
        relatedCaseSlugs: p.relatedCaseSlugs,
        relatedStyleSlugs: p.relatedStyleSlugs,
        relatedScenarioSlugs: p.relatedScenarioSlugs,
      };
  } catch {}
  if (!data) data = STATIC_POSTS[slug] || null;
  if (!data) notFound();

  const { cases, styles, scenarios } = await getRelatedContent(
    data.relatedCaseSlugs ?? [],
    data.relatedStyleSlugs ?? [],
    data.relatedScenarioSlugs ?? [],
  );
  const coverDisclosure = getImageDisclosure(data.coverImage);

  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Блог", path: "/blog" },
    { name: data.title, path: `/blog/${slug}` },
  ]);

  const jsonLdArticle = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.excerpt,
    articleSection: data.category,
    image: data.coverImage ? siteUrl(data.coverImage) : undefined,
    mainEntityOfPage: siteUrl(`/blog/${slug}`),
    url: siteUrl(`/blog/${slug}`),
    datePublished: data.publishedAt?.toISOString(),
    dateModified: data.updatedAt?.toISOString(),
    author: { "@type": "Organization", name: "КухниBY" },
    publisher: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdArticle]} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">
              Главная
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">
              Блог
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{data.title}</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <article className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge>{data.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {data.readTime} мин чтения
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold mb-6 leading-tight">
                {data.title}
              </h1>
              <div className="relative mb-8 h-64 overflow-hidden rounded-xl bg-gradient-to-br from-stone-200 to-amber-50">
                {data.coverImage ? (
                  <Image
                    src={optimizedImageSrc(data.coverImage) || data.coverImage}
                    alt={buildImageAlt(data.coverImage, `Иллюстрация к статье: ${data.title}`)}
                    width={960}
                    height={540}
                    unoptimized={isPreoptimizedRasterSrc(optimizedImageSrc(data.coverImage))}
                    priority
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-stone-400">Иллюстрация к статье</span>
                  </div>
                )}
                {data.coverImage && coverDisclosure.kind === "generated" && (
                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {coverDisclosure.label}
                  </span>
                )}
              </div>
              <div className="space-y-4">{renderContent(data.content)}</div>

              {/* Похожие проекты */}
              {cases.length > 0 && (
                <section className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-serif text-xl font-bold">
                      Похожие проекты из портфолио
                    </h2>
                    <Link
                      href="/portfolio"
                      className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      Все работы <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cases.map((c) => {
                      const disclosure = getImageDisclosure(c.mainImage);

                      return (
                      <Link
                        key={c.slug}
                        href={`/portfolio/${c.slug}`}
                        className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all bg-white"
                      >
                        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-stone-100 to-violet-50">
                          {c.mainImage ? (
                            <Image
                              src={optimizedImageSrc(c.mainImage) || c.mainImage}
                              alt={buildImageAlt(c.mainImage, c.title)}
                              width={640}
                              height={360}
                              loading="lazy"
                              sizes="(max-width: 1024px) 100vw, 420px"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-3xl">
                              🏠
                            </div>
                          )}
                          {c.mainImage && (
                            <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm">
                              {disclosure.label}
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {c.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            {c.city && <span>{c.city}</span>}
                            {c.area > 0 && <span>{c.area} п.м</span>}
                          </div>
                          {c.priceFrom > 0 && (
                            <p className="text-primary font-semibold text-xs mt-1">
                              от {c.priceFrom.toLocaleString("ru")} BYN
                            </p>
                          )}
                        </div>
                      </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Подходящие стили */}
              {styles.length > 0 && (
                <section className="mt-10 pt-8 border-t border-border">
                  <h2 className="font-serif text-xl font-bold mb-5">
                    Стили кухонь по теме
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {styles.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/styles/${s.slug}`}
                        className="group flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md bg-white transition-all"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-stone-200 to-amber-100">
                          {s.image && (
                            <Image
                              src={s.image}
                              alt={s.title}
                              width={112}
                              height={112}
                              sizes="56px"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {s.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {s.description}
                          </p>
                          {s.priceFrom > 0 && (
                            <p className="text-primary text-xs font-medium mt-1">
                              от {s.priceFrom.toLocaleString("ru")} BYN
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 self-center" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Сценарии */}
              {scenarios.length > 0 && (
                <section className="mt-10 pt-8 border-t border-border">
                  <h2 className="font-serif text-xl font-bold mb-5">
                    Подходит для вашего сценария
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scenarios.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/scenarios/${s.slug}`}
                        className="group flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md bg-white transition-all"
                      >
                        {s.icon && (
                          <span className="text-2xl flex-shrink-0">
                            {s.icon}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {s.title}
                          </p>
                          {s.intro && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {s.intro}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside>
              <div className="space-y-5 sticky top-20">
                <div className="card-base p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">
                    Нужна консультация?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Замер и проект — бесплатно
                  </p>
                  <ContactForm source={`blog/${slug}`} />
                </div>

                <div className="card-base p-5">
                  <h3 className="font-semibold text-sm mb-3">Перейти к подбору кухни</h3>
                  <div className="space-y-1">
                    {[
                      { href: "/catalog", label: "Каталог кухонь" },
                      { href: "/prices", label: "Цены и расчет" },
                      { href: "/materials", label: "Материалы" },
                      { href: "/portfolio", label: "Портфолио работ" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="card-base p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Другие статьи
                  </h3>
                  <div className="space-y-1">
                    {BLOG_POSTS.filter((p) => p.slug !== slug)
                      .slice(0, 3)
                      .map((p) => (
                        <Link
                          key={p.slug}
                          href={`/blog/${p.slug}`}
                          className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <span className="line-clamp-1">{p.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                        </Link>
                      ))}
                    <Link
                      href="/blog"
                      className="block text-center mt-2 text-xs text-primary hover:underline"
                    >
                      Все статьи →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
