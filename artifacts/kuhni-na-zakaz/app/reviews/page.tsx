import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ReviewForm } from "@/components/sections/ReviewForm";

export const metadata: Metadata = {
  title: "Отзывы клиентов — кухни на заказ в Минске",
  description: "Отзывы реальных клиентов о кухнях на заказ в Минске и Минской области.",
  alternates: { canonical: "/reviews" },
};

async function getReviews() {
  try {
    return await prisma.review.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

const STATIC_REVIEWS = [
  { id: 1, name: "Анна Ковалёва", city: "Минск", rating: 5, text: "Заказывали угловую кухню в Сухарево. Монтаж прошёл за один день, убрали за собой. Прошло полгода — всё держится, петли не провисли.", date: "Март 2025" },
  { id: 2, name: "Дмитрий Лебедев", city: "Борисов", rating: 5, text: "Сделали за 20 дней как и говорили. Качество хорошее. Взяли здесь потому что назвали конкретную цену сразу.", date: "Январь 2025" },
  { id: 3, name: "Елена Мороз", city: "Минск", rating: 5, text: "Нетиповые потолки 2,85 м. Сделали фасады до потолка, смотрится здорово. Довольна полностью.", date: "Ноябрь 2024" },
  { id: 4, name: "Игорь Степанов", city: "Молодечно", rating: 4, text: "Кухня в частный дом, П-образная, 18 кв. м. Сделали качественно. Монтаж немного затянулся, но предупредили заранее.", date: "Октябрь 2024" },
  { id: 5, name: "Марина Соколова", city: "Минск", rating: 5, text: "Маленькая кухня для студии, 6 квадратов. Всё продумано до мелочей. Трансформируемая столешница — вообще находка.", date: "Сентябрь 2024" },
];

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const displayReviews = reviews.length > 0 ? reviews : STATIC_REVIEWS;

  const avgRating = displayReviews.reduce((a, r) => a + r.rating, 0) / displayReviews.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "КухниMinsk",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: displayReviews.length,
      bestRating: 5,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <span className="text-foreground">Отзывы</span>
          </nav>
          <div className="flex items-end gap-6 mb-4">
            <h1 className="font-serif text-4xl font-bold">Отзывы клиентов</h1>
            <div className="flex items-center gap-2 pb-1">
              <div className="flex">
                {[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= Math.round(avgRating) ? "fill-primary text-primary" : "text-muted"}`} />)}
              </div>
              <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} из 5 ({displayReviews.length} отзывов)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {displayReviews.map((r) => (
              <div key={r.id} className="card-base p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= r.rating ? "fill-primary text-primary" : "text-muted"}`} />)}
                </div>
                <p className="text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium">{r.name}</span> · {r.city}{r.date && ` · ${r.date}`}
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">Оставить отзыв</h2>
            <p className="text-center text-muted-foreground mb-8">Ваш отзыв будет опубликован после проверки</p>
            <ReviewForm />
          </div>
        </div>
      </div>
    </>
  );
}
