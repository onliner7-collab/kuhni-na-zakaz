import type { Metadata } from "next";
import Link from "next/link";
import { Star, ExternalLink, Globe, Send } from "lucide-react";
import { prisma } from "@/lib/db";
import { ReviewForm } from "@/components/sections/ReviewForm";
import { cn } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Отзывы клиентов о кухнях",
  description: "Отзывы клиентов о кухнях на заказ по Беларуси: Минск, Брест, Гродно, Витебск, Гомель, Могилёв. Все отзывы проходят модерацию перед появлением на сайте.",
  alternates: { canonical: "/reviews" },
};

const SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  yandex: "Яндекс",
  telegram: "Telegram",
  instagram: "Instagram",
  vk: "ВКонтакте",
  direct: "Напрямую",
  website: "Сайт",
};

async function getData() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    const slugs = [...new Set(reviews.map((r) => r.caseSlug).filter(Boolean))];
    const cases = slugs.length
      ? await prisma.portfolioCase.findMany({
          where: { slug: { in: slugs } },
          select: { slug: true, title: true, mainImage: true },
        })
      : [];
    const caseMap = Object.fromEntries(cases.map((c) => [c.slug, c]));

    return { reviews, caseMap };
  } catch {
    return { reviews: [], caseMap: {} };
  }
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(cls, i <= rating ? "fill-primary text-primary" : "text-muted-foreground/20")} />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const { reviews, caseMap } = await getData();

  const featured = reviews.filter((r) => r.featured);
  const regular = reviews.filter((r) => !r.featured);

  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? reviews.reduce((a, r) => a + r.rating, 0) / totalCount
    : 4.9;

  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Отзывы", path: "/reviews" },
  ]);

  const jsonLdBusiness = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "КухниBY",
    url: siteUrl(),
    aggregateRating: totalCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: totalCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: reviews.length > 0 ? reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
      datePublished: r.createdAt.toISOString().split("T")[0],
    })) : undefined,
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdBusiness]} />
      <div className="section-padding">
        <div className="container-site">

          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <span className="text-foreground">Отзывы</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            <h1 className="font-serif text-4xl font-bold">Отзывы клиентов</h1>
            <div className="flex items-center gap-2 pb-1">
              <StarRow rating={Math.round(avgRating)} size="md" />
              <span className="text-muted-foreground text-sm">
                {avgRating.toFixed(1)} / 5{totalCount > 0 ? ` · ${totalCount} отзывов` : ""}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Все отзывы проходят модерацию перед появлением на сайте — без накруток и анонимных публикаций.
          </p>

          {featured.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-semibold mb-5">Избранные отзывы</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((r) => {
                  const kase = r.caseSlug ? caseMap[r.caseSlug] : null;
                  return (
                    <div key={r.id} className="card-base p-6 border-2 border-primary/20 relative">
                      <div className="absolute top-4 right-4">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </div>
                      <StarRow rating={r.rating} />
                      <p className="text-sm leading-relaxed mt-3 mb-4 text-foreground">&ldquo;{r.text}&rdquo;</p>
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.city}{r.region ? `, ${r.region}` : ""}{r.date ? ` · ${r.date}` : ""}
                          </p>
                          {r.source && r.source !== "website" && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Globe className="w-3 h-3" /> {SOURCE_LABELS[r.source] || r.source}
                            </p>
                          )}
                        </div>
                        {kase && (
                          <Link
                            href={`/portfolio/${kase.slug}`}
                            className="flex-shrink-0 text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Смотреть проект <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {regular.length > 0 && (
            <section className="mb-16">
              {featured.length > 0 && (
                <h2 className="font-serif text-2xl font-semibold mb-5">Все отзывы</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((r) => {
                  const kase = r.caseSlug ? caseMap[r.caseSlug] : null;
                  return (
                    <div key={r.id} className="card-base p-5">
                      <StarRow rating={r.rating} />
                      <p className="text-sm leading-relaxed mt-3 mb-4 text-muted-foreground line-clamp-4">
                        &ldquo;{r.text}&rdquo;
                      </p>
                      <div className="border-t border-border pt-3 flex items-end justify-between gap-2">
                        <div>
                          <p className="font-medium text-xs">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.city}{r.region ? `, ${r.region}` : ""}{r.date ? ` · ${r.date}` : ""}
                          </p>
                          {r.source && r.source !== "website" && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              {r.source === "telegram" ? <Send className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                              {SOURCE_LABELS[r.source] || r.source}
                            </span>
                          )}
                        </div>
                        {kase && (
                          <Link
                            href={`/portfolio/${kase.slug}`}
                            className="flex-shrink-0 text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Проект <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {reviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground mb-16">
              <p className="text-lg mb-2">Отзывы пока не опубликованы</p>
              <p className="text-sm">Будьте первым — оставьте отзыв ниже.</p>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">Оставить отзыв</h2>
            <p className="text-center text-muted-foreground mb-8">
              Ваш отзыв будет опубликован после проверки модератором — обычно в течение 24 часов.
            </p>
            <ReviewForm />
          </div>

        </div>
      </div>
    </>
  );
}
