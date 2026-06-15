import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { PriceQuiz } from "@/components/sections/PriceQuiz";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { regionalLocations } from "@/data/locations";
import { buildOpenGraph, buildTwitterMetadata } from "@/lib/seo";

const title = "Цены на кухни на заказ в Минске от 900 BYN";
const description =
  "Цены на кухни на заказ в Минске и Беларуси от 900 BYN: прямые, угловые, П-образные и с островом. Рассчитайте ориентир онлайн.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/prices" },
  openGraph: buildOpenGraph("/prices", title, description),
  twitter: buildTwitterMetadata(title, description),
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
  { item: "Замер и проект",           price: "по условиям заявки" },
  { item: "Доставка по городу",       price: "уточняется при расчете" },
  { item: "Доставка по области",      price: "от 50 BYN" },
  { item: "Доставка в другой город",  price: "по договорённости" },
  { item: "Монтаж",                   price: "от 200 BYN" },
  { item: "Подключение техники",      price: "от 50 BYN" },
  { item: "Разборка старой кухни",    price: "от 100 BYN" },
];

const PRICE_FACTORS = [
  {
    title: "Размер и планировка",
    text: "Прямая кухня обычно дешевле угловой, П-образной или островной: меньше сложных узлов, проще столешница и монтаж.",
  },
  {
    title: "Фасады и корпус",
    text: "ЛДСП помогает удержать бюджет, МДФ, пластик HPL, эмаль и шпон меняют внешний вид, износостойкость и итоговую смету.",
  },
  {
    title: "Фурнитура и хранение",
    text: "Выдвижные ящики, подъемники, доводчики, угловые механизмы и системы хранения считаются отдельно, чтобы смета была прозрачной.",
  },
  {
    title: "Доставка и монтаж",
    text: "Адрес, этаж, занос столешницы, готовность ремонта и подключение техники влияют на финальную стоимость работ.",
  },
];

const PRICE_FAQ = [
  {
    question: "Почему цена кухни на заказ указана как ориентир?",
    answer:
      "Без точных размеров, материалов, фурнитуры, техники, доставки и монтажных условий нельзя честно назвать финальную цену. После замера и комплектации смета фиксируется в договоре.",
  },
  {
    question: "Что дешевле: прямая, угловая или П-образная кухня?",
    answer:
      "Чаще всего дешевле прямая кухня: в ней проще столешница и нет угловых узлов. Угловая и П-образная дают больше хранения, но обычно требуют больше модулей и фурнитуры.",
  },
  {
    question: "Можно ли рассчитать кухню по фото и размерам?",
    answer:
      "Да, для предварительного ориентира достаточно фото, примерных размеров, списка техники и пожеланий по фасадам. Точная смета появляется после замера и согласования проекта.",
  },
];

const PRICE_CITY_SLUGS = [
  "minsk",
  "borisov",
  "zhodino",
  "molodechno",
  "soligorsk",
  "slutsk",
  "fanipol",
  "smolevichi",
  "minskaya-oblast",
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
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICE_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const priceCities = PRICE_CITY_SLUGS
    .map((slug) => regionalLocations.find((location) => location.slug === slug))
    .filter((location): location is (typeof regionalLocations)[number] => Boolean(location));

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService, jsonLdFaq]} />
      <div className="section-padding">
        <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Цены</span>
        </nav>

        <h1 className="font-serif text-4xl font-bold mb-4">Цены на кухни на заказ</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Цена кухни на заказ в Минске зависит от размеров, материалов, фурнитуры, техники, доставки и монтажа.
          После замера и согласования комплектации смета фиксируется в договоре.
        </p>

        <section className="mb-12 rounded-xl border bg-muted/20 p-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">Что входит в расчет кухни</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PRICE_FACTORS.map((item) => (
              <div key={item.title} className="rounded-lg border bg-white p-5">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

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
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Перед расчётом можем подготовить{" "}
            <Link href="/design-proekt-kuhni" className="font-semibold text-primary hover:underline">
              дизайн-проект кухни
            </Link>
            , чтобы точнее согласовать планировку, материалы и встроенную технику.
          </p>
        </div>

        <section className="card-base p-6 mb-16">
          <h2 className="font-serif text-2xl font-bold mb-3">Цены по городам</h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-5">
            Базовые принципы расчета одинаковые, но адрес влияет на замер, доставку,
            занос, монтажный день и итоговую логистику. Выберите город, чтобы
            посмотреть региональные условия перед заявкой.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {priceCities.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                className="rounded-lg border border-border bg-white p-4 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="font-semibold text-foreground">{location.cityName}</span>
                <span className="mt-1 block leading-5 text-muted-foreground">
                  Ориентир от {location.priceFrom.toLocaleString("ru")} BYN, точная смета после размеров и комплектации.
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/locations"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Смотреть все города <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <section className="card-base p-6 mb-16">
          <h2 className="font-serif text-2xl font-bold mb-3">Как комплектация влияет на цену</h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            На итоговую смету влияет не только длина гарнитура, но и фурнитура для кухни:
            петли с доводчиками, направляющие полного выдвижения, подъемные механизмы,
            системы хранения, профильные ручки и подсветка.
          </p>
          <Link href="/materials/furnitura" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Подобрать фурнитуру для кухни
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>

        <section className="card-base p-6 mb-16">
          <h2 className="font-serif text-2xl font-bold mb-3">Частые вопросы о цене кухни</h2>
          <div className="divide-y">
            {PRICE_FAQ.map((item) => (
              <div key={item.question} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-4">Точный расчёт по вашей заявке</h2>
          <p className="text-center text-muted-foreground mb-8">Оставьте заявку — рассчитаем под ваши параметры</p>
          <ContactForm source="prices" sourceType="prices" />
        </div>
        </div>
      </div>
    </>
  );
}
