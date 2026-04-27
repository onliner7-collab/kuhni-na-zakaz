import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { BLOG_POSTS } from "@/lib/blog-static";

const COMMERCIAL_LINKS = [
  { href: "/catalog", title: "Подобрать тип кухни", text: "Сравните угловые, прямые, П-образные кухни и варианты с островом." },
  { href: "/prices", title: "Посмотреть цены", text: "Ориентиры по стоимости и быстрый переход к расчету проекта." },
  { href: "/materials", title: "Выбрать материалы", text: "Фасады, столешницы, корпуса и решения для ежедневной нагрузки." },
  { href: "/portfolio", title: "Открыть портфолио", text: "Реальные проекты с городом, метражом, стилем и бюджетом." },
];

export const metadata: Metadata = {
  title: "Блог о кухнях на заказ",
  description:
    "Советы по выбору кухни, материалов и стилей. Полезные статьи для тех, кто планирует кухню на заказ.",
  alternates: { canonical: "/blog" },
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
  const display = posts.length > 0 ? posts : BLOG_POSTS;
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
    <>
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
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
            {display.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card-base hover:shadow-md transition-shadow group"
              >
                <div className="h-48 bg-gradient-to-br from-stone-200 to-amber-50 flex items-center justify-center">
                  <span className="text-stone-400 text-sm">
                    Иллюстрация статьи
                  </span>
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
