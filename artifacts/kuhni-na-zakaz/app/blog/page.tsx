import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { BLOG_POSTS } from "@/lib/blog-static";
import { SEO_BLOG_POSTS_FALLBACK } from "@/lib/blog-seo-fallback";
import { mergeBlogCover } from "@/lib/blog-cover-meta";
import { isPreoptimizedRasterSrc, optimizedImageSrc } from "@/lib/image-optimization";
import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { ExploreContextProvider } from "@/components/exploration";
import { RelatedExplorationRail } from "@/components/exploration/RelatedExplorationRail";

function publishedTime(p: { publishedAt?: Date | null }) {
  return p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
}

const COMMERCIAL_LINKS = [
  { href: "/catalog", title: "Подобрать тип кухни", text: "Сравните угловые, прямые, П-образные кухни и варианты с островом." },
  { href: "/prices", title: "Посмотреть цены", text: "Ориентиры по стоимости и быстрый переход к расчету проекта." },
  { href: "/locations/minsk", title: "Кухни в Минске", text: "Замер, проект, доставка и монтаж для квартир, новостроек и домов." },
  { href: "/locations/minskaya-oblast", title: "Минская область", text: "Городские страницы, доставка, монтаж и расчет кухни по адресу." },
  { href: "/materials", title: "Выбрать материалы", text: "Фасады, столешницы, корпуса и решения для ежедневной нагрузки." },
  { href: "/portfolio", title: "Открыть портфолио", text: "Фото и визуализации с городом и параметрами, если они заполнены." },
];

const title = "Блог: кухни на заказ, цены и материалы";
const description =
  "Советы по выбору кухни, материалов и стилей. Полезные статьи для тех, кто планирует кухню на заказ.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: buildOpenGraph("/blog", title, description),
  twitter: buildTwitterMetadata(title, description),
};

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const databaseSlugs = new Set(posts.map((post) => post.slug));
  const staticPosts = [...SEO_BLOG_POSTS_FALLBACK, ...BLOG_POSTS].filter(
    (post) => post.published !== false && !databaseSlugs.has(post.slug),
  );
  const raw = [...posts, ...staticPosts].sort(
    (a, b) => publishedTime(b) - publishedTime(a),
  );
  const display = raw.map((p) => mergeBlogCover(p));
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Блог", path: "/blog" },
  ]);
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Блог",
    url: siteUrl("/blog"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: display.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: siteUrl(`/blog/${post.slug}`),
      })),
    },
  };

  return (
    <ExploreContextProvider sourceRoute="/blog">
      <JsonLd data={[jsonLdBreadcrumb, jsonLdCollection]} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">
              Главная
            </Link>
            <span>/</span>
            <span className="text-foreground">Блог</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold mb-4">Блог</h1>
          <p className="text-muted-foreground mb-10">
            Советы по выбору кухни, материалов и дизайна
          </p>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {COMMERCIAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </Link>
            ))}
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {display.map((p, index) => {
              const disclosure = getImageDisclosure(p.coverImage);

              return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card-base hover:shadow-md transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-stone-200 to-amber-50">
                  {p.coverImage ? (
                    <Image
                      src={optimizedImageSrc(p.coverImage) || p.coverImage}
                      alt={
                        p.coverImageAlt?.trim() ||
                        buildImageAlt(p.coverImage, p.title)
                      }
                      width={p.coverImageWidth ?? 1200}
                      height={p.coverImageHeight ?? 800}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      unoptimized={isPreoptimizedRasterSrc(optimizedImageSrc(p.coverImage))}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-stone-400 text-sm">
                        Иллюстрация статьи
                      </span>
                    </div>
                  )}
                  {p.coverImage && disclosure.kind === "generated" && (
                    <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                      {disclosure.label}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>{p.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {p.readTime} мин
                    </span>
                  </div>
                  <h2 className="font-serif font-semibold text-xl group-hover:text-primary transition-colors leading-tight mb-2">
                    {p.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.excerpt}
                  </p>
                  {p.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-4">
                      {new Date(p.publishedAt).toLocaleDateString("ru-BY", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </Link>
              );
            })}
          </div>
          <RelatedExplorationRail route="/blog" state="RESULT" />
        </div>
      </div>
    </ExploreContextProvider>
  );
}
