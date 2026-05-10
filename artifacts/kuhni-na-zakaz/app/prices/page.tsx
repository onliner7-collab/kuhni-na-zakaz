import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { PriceQuiz } from "@/components/sections/PriceQuiz";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { regionalLocations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Цены на кухни на заказ в Беларуси",
  description: "Цены на кухни на заказ по Беларуси от 900 BYN. Прямые, угловые, П-образные и кухни с островом. Эконом, стандарт, премиум, расчёт онлайн.",
  alternates: { canonical: "/prices" },
};

// SEGMENTS остаются статическим редакционным контентом:
// в БД нет модели PriceSegment — сегменты (Эконом/Стандарт/Премиум) отражают
// маркетинговые диапазоны, а не отдельные PriceRule. Калькулятор (PriceQuiz ниже)
// использует DB-driven формулу через /kapi/calculator.
const SEGMENTS = [
  {
    name: "Эконом",
    priceFrom: 900,
    priceTo: 2000,
    color: "border-stone-200",
    features: [
      "Корпус ЛДСП EGGER",
      "Фасады МДФ плёнка ПВХ",
      "Столешница постформинг",
      "Фурнитура GTV",
      "Подъёмники и доводчики",
    ],
    examples: [
      "Прямая кухня 2 пог. м — от 900 BYN",
      "Угловая 3+2 пог. м — от 1 600 BYN",
    ],
  },
  {
    name: "Стандарт",
    priceFrom: 2000,
    priceTo: 4000,
    color: "border-primary",
    features: [
      "Корпус ЛДСП Blum",
      "Фасады МДФ плёнка / пластик",
      "Столешница HPL-пластик",
      "Фурнитура Hettich",
      "Полный доводчик, soft-close",
    ],
    examples: [
      "Прямая кухня 3 пог. м — от 2 200 BYN",
      "Угловая 3+2 пог. м — от 2 800 BYN",
    ],
    popular: true,
  },
  {
    name: "Премиум",
    priceFrom: 4000,
    color: "border-amber-400",
    features: [
      "Корпус ЛДСП Egger Premium",
      "Фасады эмаль матовая / шпон",
      "Столешница керамика / акрил",
      "Фурнитура Blum Aventos",
      "Встроенная подсветка, доводчики",
    ],
    examples: [
      "Угловая кухня эмаль — от 4 500 BYN",
      "С островом из шпона — от 6 000 BYN",
    ],
  },
];

// Статический fallback: доп. работы не хранятся в PriceRule — выделены
// в отдельную концепцию (услуги), не входящую в формулу калькулятора.
const EXTRA_WORKS = [
  { item: "Замер и проект",           price: "Бесплатно" },
  { item: "Доставка по городу",       price: "Бесплатно от 3 000 BYN" },
  { item: "Доставка по области",      price: "от 50 BYN" },
  { item: "Доставка в другой город",  price: "по договорённости" },
  { item: "Монтаж",                   price: "от 200 BYN" },
  { item: "Подключение техники",      price: "от 50 BYN" },
  { item: "Разборка старой кухни",    price: "от 100 BYN" },
];

export default function PricesPage() {
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Цены", path: "/prices" },
  ]);
  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Кухни на заказ",
    url: siteUrl("/prices"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    areaServed: { "@type": "Country", name: "Belarus" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Цены на кухни",
      itemListElement: SEGMENTS.map((segment) => ({
        "@type": "Offer",
        name: segment.name,
        priceCurrency: "BYN",
        price: segment.priceFrom,
        url: siteUrl("/prices"),
      })),
    },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService]} />
      <div className="section-padding">
        <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Цены</span>
        </nav>

        <h1 className="font-serif text-4xl font-bold mb-4">Цены на кухни на заказ</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Цена фиксируется в договоре. Никаких скрытых доплат. Ниже — ориентировочные диапазоны по сегментам.
        </p>

        {/* Сегменты — редакционные диапазоны */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {SEGMENTS.map((seg) => (
            <div key={seg.name} className={`card-base p-6 border-t-4 ${seg.color} relative`}>
              {seg.popular && (
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Популярный
                </div>
              )}
              <h2 className="font-serif text-2xl font-bold mb-1">{seg.name}</h2>
              <p className="text-primary font-semibold text-lg mb-4">
                от {seg.priceFrom.toLocaleString("ru")} BYN
                {seg.priceTo ? ` до ${seg.priceTo.toLocaleString("ru")} BYN` : "+"}
              </p>
              <ul className="space-y-2 mb-6">
                {seg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">Примеры:</p>
                {seg.examples.map((e) => (
                  <p key={e} className="text-xs text-muted-foreground">{e}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительные работы — статический fallback */}
        <div className="card-base p-6 mb-16">
          <h2 className="font-serif text-2xl font-bold mb-4">Стоимость дополнительных работ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXTRA_WORKS.map((row) => (
              <div key={row.item} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm">{row.item}</span>
                <span className="text-sm font-medium text-primary">{row.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Калькулятор — DB-driven через /kapi/calculator */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-center mb-4">Рассчитайте стоимость онлайн</h2>
          <p className="text-center text-muted-foreground mb-8">Ответьте на 5 вопросов — получите ориентировочный бюджет</p>
          <PriceQuiz />
        </div>

        <section className="card-base p-6 mb-16">
          <h2 className="font-serif text-2xl font-bold mb-3">Цены по городам</h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-5">
            Базовые принципы расчета одинаковые, но замер, доставка и монтаж зависят от адреса.
            Выберите город, чтобы посмотреть региональные условия без дублей и неподтвержденных обещаний.
          </p>
          <div className="flex flex-wrap gap-3">
            {regionalLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {location.cityName}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-4">Точный расчёт — бесплатно</h2>
          <p className="text-center text-muted-foreground mb-8">Оставьте заявку — рассчитаем под ваши параметры</p>
          <ContactForm source="prices" sourceType="prices" />
        </div>
        </div>
      </div>
    </>
  );
}
