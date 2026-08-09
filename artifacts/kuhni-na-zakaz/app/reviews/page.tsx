import type { Metadata } from "next";
import { ServiceExplorationRail } from "@/components/exploration";
import Link from "@/components/navigation/Link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ReviewForm } from "@/components/sections/ReviewForm";
import { cn } from "@/lib/utils";
import { JsonLd, aggregateRatingJsonLd, breadcrumbJsonLd, compactJsonLd, isTrustedReviewForSchema, productReviewsJsonLd, siteUrl } from "@/lib/schema-org";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";
import { ReviewExplorer } from "@/components/reviews/ReviewExplorer";

const title = "Отзывы о кухнях на заказ в Минске";
const description =
  "Отзывы клиентов о кухнях на заказ в Минске и Беларуси: оценки, города, связанные проекты, фото в портфолио и форма для нового отзыва.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/reviews" },
  openGraph: buildOpenGraph("/reviews", title, description),
  twitter: buildTwitterMetadata(title, description),
};

export const revalidate = 3600;

const REVIEW_ANALYSIS_POINTS = [
  {
    title: "На что смотреть в отзывах",
    text: "Для запроса «Проанализируй отзывы о Kuhni.minsk.by — на что жалуются клиенты» проверяйте не отдельную эмоцию, а повторяющиеся темы: сроки, комплектацию, монтаж, коммуникацию, гарантийные вопросы и совпадение сметы с договором.",
  },
  {
    title: "Как не ошибиться с выводами",
    text: "Мы не добавляем фиктивные жалобы или оценки. Если отзывов мало, честнее смотреть портфолио, условия договора, состав сметы и то, как компания отвечает на уточнения до заказа.",
  },
  {
    title: "Что сравнить перед заказом",
    text: "Для выбора компании по кухням на заказ в Минске полезно сопоставить опубликованные отзывы с проектами, ценами, сроками изготовления, доставкой, монтажом и гарантийными обязательствами.",
  },
];

const TRUST_GUIDE = [
  { title: "Город и объект", text: "Смотрите, указан ли город, тип кухни и связанный проект. Такой отзыв легче сопоставить с реальной задачей." },
  { title: "Смета и сроки", text: "Полезны отзывы, где клиент пишет о совпадении цены, сроках изготовления, доставке и монтаже." },
  { title: "Сервис после монтажа", text: "Для кухни важна не только установка, но и готовность ответить на вопрос по регулировке или гарантии." },
];

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
          select: { slug: true, title: true, mainImage: true, kitchenType: true },
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

  const schemaReviews = reviews.filter(isTrustedReviewForSchema);
  const reviewExplorerItems = reviews.map((review) => ({
    id: review.id,
    name: review.name,
    city: review.city,
    region: review.region,
    rating: review.rating,
    text: review.text,
    date: review.date,
    source: review.source,
    featured: review.featured,
    project: review.caseSlug ? caseMap[review.caseSlug] ?? null : null,
  }));

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
    aggregateRating: aggregateRatingJsonLd(schemaReviews),
    review: productReviewsJsonLd(schemaReviews),
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
            Отзывы клиентов публикуются автоматически. Администратор может снять отзыв с публикации или удалить его из выдачи сайта.
          </p>

          <section className="mb-12 rounded-xl border bg-muted/20 p-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Как анализировать отзывы о Kuhni.minsk.by
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Страница помогает не только читать отзывы, но и правильно оценивать риски перед заказом кухни:
              отделяйте подтвержденные факты от неподтвержденных пересказов.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {REVIEW_ANALYSIS_POINTS.map((item) => (
                <div key={item.title} className="rounded-lg border bg-white p-5">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 grid gap-5 md:grid-cols-3">
            {TRUST_GUIDE.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </section>

          <ReviewExplorer reviews={reviewExplorerItems} />

          <section className="mb-16 grid gap-4 md:grid-cols-3">
            {[
              { href: "/portfolio", title: "Портфолио", text: "Откройте проекты кухонь с фото, материалами, городом и параметрами." },
              { href: "/warranty", title: "Гарантия", text: "Проверьте условия сервиса и порядок обращения после монтажа." },
              { href: "/about", title: "О компании", text: "Узнайте, как строится работа от замера до передачи кухни." },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-border p-5 transition-shadow hover:shadow-md">
                <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </Link>
            ))}
          </section>

          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">Оставить отзыв</h2>
            <p className="text-center text-muted-foreground mb-8">
              Ваш отзыв появится на сайте автоматически. Телефон не публикуется и нужен только для связи при уточнениях.
            </p>
            <ReviewForm />
          </div>
          <ServiceExplorationRail route="/reviews" />
        </div>
      </div>
    </>
  );
}
