import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Factory, FileCheck, MapPin, Phone, Shield, Star, Wrench } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { HomeKitchenIdeas3DSection } from "@/components/sections/KitchenIdeas3DSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { JsonLd, aggregateRatingJsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, productReviewsJsonLd } from "@/lib/schema-org";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import { CatalogCategoryImage } from "@/components/catalog/CatalogCategoryImage";
import { resolveCatalogCategoryImage } from "@/lib/catalog-category-images";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { regionalLocations } from "@/data/locations";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { CANONICAL_SITE_URL, SITE_ALTERNATE_NAMES, SITE_NAME, canonicalSiteUrl } from "@/lib/seo";

type HomeAdvantage = {
  id: number;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  href?: string;
};

type HomeStep = {
  id: number;
  icon: string;
  title: string;
  description: string;
  badge?: string;
};

/** Подписи для эмодзи в блоке «Почему выбирают нас» (доступность / SEO). */
function advantageEmojiAriaLabel(icon: string, title: string): string {
  const labels: Record<string, string> = {
    "🏭": "Собственный завод по производству кухонь",
    "🛡️": "Гарантийные условия по договору",
    "📐": "Замер и 3D-проект кухни по условиям заявки",
    "📋": "Фиксированная цена в договоре",
    "🇧🇾": "Работаем по всей Беларуси",
    "⏱️": "Сроки изготовления кухни",
  };
  return labels[icon.trim()] ?? title;
}

const CATALOG_CATEGORIES = [
  { slug: "uglovye-kuhni", title: "Угловые кухни", price: "от 1 800 BYN" },
  { slug: "pryamye-kuhni", title: "Прямые кухни", price: "от 1 200 BYN" },
  { slug: "p-obraznye-kuhni", title: "П-образные кухни", price: "от 3 500 BYN" },
  { slug: "kuhni-s-ostrovom", title: "Кухни с островом", price: "от 4 500 BYN" },
  { slug: "malenkie-kuhni", title: "Маленькие кухни", price: "от 900 BYN" },
  { slug: "kuhni-do-potolka", title: "Кухни до потолка", price: "от 2 200 BYN" },
];

const MATERIAL_GUIDES = [
  {
    href: "/materials/furnitura",
    title: "Фурнитура для кухни",
    text: "Петли, направляющие, доводчики, подъемники и системы хранения для удобной кухни.",
  },
  {
    href: "/materials/mdf-fasady",
    title: "МДФ фасады",
    text: "Для кухонь с фрезеровкой, эмалью, пленкой и гибким подбором внешнего вида.",
  },
  {
    href: "/materials/ldsp",
    title: "ЛДСП",
    text: "Для корпусов, простых фасадов и бюджетных кухонь с понятным уходом.",
  },
  {
    href: "/materials/plastik-hpl",
    title: "Пластик HPL",
    text: "Для практичных гладких фасадов, активной кухни и современных декоров.",
  },
];

const LOCAL_BUSINESS_IMAGE =
  "/uploads/seo-showcase/home-hero-dark-kitchen-2026.webp";
const MOBILE_HERO_IMAGE =
  "/uploads/seo-showcase/home-hero-mobile-kitchen-2026.webp";
const HOME_ORIGIN = CANONICAL_SITE_URL;
const HOME_URL = canonicalSiteUrl("/");

/** Alt для витринного фото в первом экране (SEO / доступность). */
const HERO_KITCHEN_ALT =
  "Темная современная кухня с островом и подсветкой в Минске";

const HOME_TITLE = "Кухни на заказ в Минске: цены от 900 BYN";
const HOME_DESCRIPTION =
  "Кухни под заказ в Минске и Беларуси: замер по заявке, 3D-проект, производство, монтаж и смета в договоре. Рассчитаем цену под ваши размеры.";

export const metadata: Metadata = {
  title: `${HOME_TITLE} | ${SITE_NAME}`,
  description: HOME_DESCRIPTION,
  alternates: { canonical: HOME_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: HOME_URL,
    images: [
      {
        url: `${HOME_ORIGIN}${LOCAL_BUSINESS_IMAGE}`,
        width: 1200,
        height: 900,
        alt: "Современный гарнитур от КухниBY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [`${HOME_ORIGIN}${LOCAL_BUSINESS_IMAGE}`],
  },
};

export const revalidate = 3600;

async function getHomeData() {
  try {
    const [cases, reviews, faqs, scenarios, steps, advantages, trust, locations] = await Promise.all([
      prisma.portfolioCase.findMany({ where: { published: true, slug: publicSlugWhere() }, take: 4, orderBy: { createdAt: "desc" } }),
      prisma.review.findMany({ where: { status: "PUBLISHED" }, take: 4, orderBy: { createdAt: "desc" } }),
      prisma.fAQItem.findMany({ where: { page: "home" }, orderBy: { order: "asc" } }),
      prisma.homepageBlock.findMany({ where: { type: "scenario", published: true }, orderBy: { order: "asc" } }),
      prisma.homepageBlock.findMany({ where: { type: "step", published: true }, orderBy: { order: "asc" } }),
      prisma.homepageBlock.findMany({ where: { type: "advantage", published: true }, orderBy: { order: "asc" } }),
      prisma.homepageBlock.findMany({ where: { type: "trust", published: true }, orderBy: { order: "asc" } }),
      prisma.locationPage.findMany({
        where: { published: true, slug: publicSlugWhere() },
        take: 8,
        orderBy: [{ region: "asc" }, { city: "asc" }],
        select: { id: true, slug: true, city: true, region: true, priceFrom: true },
      }),
    ]);
    return {
      cases: cases.filter((item) => isPublicContentSlug(item.slug)),
      reviews,
      faqs,
      scenarios,
      steps,
      advantages,
      trust,
      locations: locations.filter((item) => isPublicContentSlug(item.slug)),
    };
  } catch {
    return { cases: [], reviews: [], faqs: [], scenarios: [], steps: [], advantages: [], trust: [], locations: [] };
  }
}

export default async function HomePage() {
  const { cases, reviews, faqs, scenarios, steps, advantages, trust, locations } = await getHomeData();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${HOME_URL}#website`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: HOME_URL,
    inLanguage: "ru-BY",
  };
  const localBusinessJsonLd = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${HOME_URL}#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    description: "Кухонные гарнитуры под размеры по всей Беларуси. Собственное производство.",
    url: HOME_URL,
    logo: `${HOME_ORIGIN}/logo.png`,
    telephone: CONTACT_DEFAULTS.phone,
    email: CONTACT_DEFAULTS.email,
    image: `${HOME_ORIGIN}${LOCAL_BUSINESS_IMAGE}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Дзержинского, д. 90, каб. 1а",
      postalCode: "222520",
      addressLocality: "Борисов",
      addressCountry: "BY",
    },
    areaServed: [
      { "@type": "Country", name: "Беларусь" },
      { "@type": "City", name: "Минск" },
      { "@type": "AdministrativeArea", name: "Минская область" },
      { "@type": "City", name: "Гомель" },
      { "@type": "City", name: "Гродно" },
      { "@type": "City", name: "Брест" },
      { "@type": "City", name: "Витебск" },
      { "@type": "City", name: "Могилёв" },
    ],
    priceRange: "от 1200 BYN",
  });
  const jsonLdBreadcrumb = breadcrumbJsonLd([{ name: "Главная", path: "/" }]);
  const jsonLdFaq = faqJsonLd(faqs);
  const jsonLdProduct =
    reviews.length > 0 && avgRating
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Кухонные гарнитуры под размеры",
          aggregateRating: aggregateRatingJsonLd(reviews),
          review: productReviewsJsonLd(reviews),
        }
      : null;
  const jsonLdItems = [
    websiteJsonLd,
    localBusinessJsonLd,
    jsonLdBreadcrumb,
    ...(jsonLdProduct ? [jsonLdProduct] : []),
  ];

  const FALLBACK_ADVANTAGES: HomeAdvantage[] = [
    { id: 1, icon: "🏭", title: "Собственный завод", description: "Производим в своём цеху — контролируем качество на каждом этапе" },
    { id: 2, icon: "🛡️", title: "Гарантия по договору", description: "Гарантийные условия фиксируются в договоре и зависят от комплектации" },
    { id: 3, icon: "📐", title: "Замер и проект по заявке", description: "Согласуем удобное время замера и подготовим 3D-проект по условиям заказа" },
    { id: 4, icon: "📋", title: "Фиксированная цена", description: "Цена прописана в договоре до начала работ. Никаких доплат" },
    { id: 5, icon: "🇧🇾", title: "По всей Беларуси", description: "Минск, Брест, Гродно, Витебск, Гомель, Могилёв и районы — условия выезда согласуем по заявке" },
    { id: 6, icon: "⏱️", title: "От 14 рабочих дней", description: "Минимальный срок для стандартных кухонь. Сложные — 30–45 дней" },
  ];

  const FALLBACK_STEPS: HomeStep[] = [
    { id: 1, icon: "01", title: "Заявка", description: "Оставьте заявку или позвоните — ответим за 30 минут в рабочее время" },
    { id: 2, icon: "02", title: "Консультация", description: "Обсуждаем вашу планировку, бюджет и стиль. Без давления" },
    { id: 3, icon: "03", title: "Выезд на замер", description: "Условия замера уточняются при заявке. Время выезда согласуем с менеджером" },
    { id: 4, icon: "04", title: "Проект и цена", description: "Срок подготовки проекта зависит от сложности кухни. Цена фиксируется в договоре" },
    { id: 5, icon: "05", title: "Производство", description: "Изготовление на собственном заводе. 14–30 дней" },
    { id: 6, icon: "06", title: "Монтаж под ключ", description: "Доставка, сборка, подключение техники. Убираем мусор сами" },
  ];

  const displayAdvantages = advantages.length > 0 ? advantages : FALLBACK_ADVANTAGES;
  const displaySteps = steps.length > 0 ? steps : FALLBACK_STEPS;
  const dbLocationsBySlug = new Map(locations.map((location) => [location.slug, location]));
  const displayLocations = regionalLocations.map((location, index) => {
    const dbLocation = dbLocationsBySlug.get(location.slug);

    return {
      id: dbLocation?.id ?? index + 1,
      slug: location.slug,
      city: location.cityName,
      cityPrepositional: location.cityPrepositional,
      region: location.regionName,
      priceFrom: dbLocation?.priceFrom && dbLocation.priceFrom > 0 ? dbLocation.priceFrom : location.priceFrom,
    };
  });
  const primaryLocationLinks = displayLocations.slice(0, 8);

  return (
    <>
      <JsonLd data={jsonLdItems} />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#17130f] pt-32 text-white lg:pt-40">
        <picture className="absolute inset-0 block">
          <source media="(min-width: 1024px)" srcSet={LOCAL_BUSINESS_IMAGE} />
          <img
            src={MOBILE_HERO_IMAGE}
            alt={HERO_KITCHEN_ALT}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center opacity-76 lg:object-contain lg:object-right lg:opacity-72"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,14,10,0.94)_0%,rgba(18,14,10,0.76)_34%,rgba(18,14,10,0.30)_66%,rgba(18,14,10,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
        <BrandedImageWatermark show={getImageDisclosure(LOCAL_BUSINESS_IMAGE).kind === "generated"} />

        <div className="container-site relative z-10">
          <div className="min-h-[560px] max-w-2xl pb-16 lg:min-h-[640px] lg:pb-24">
            <p className="mb-5 inline-flex rounded-full border border-white/18 bg-black/18 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78">
              Кухни на заказ
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Кухни на заказ в Минске и Беларуси под ваш размер, стиль и бюджет
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/78 sm:text-lg">
              Проектируем, изготавливаем и устанавливаем кухни под ключ: замер, 3D-проект, производство, доставка и монтаж с фиксацией цены в договоре.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contacts#form"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c99a62] px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-black/25 transition-all hover:bg-[#b9874f] active:scale-95"
                data-testid="hero-cta-order"
              >
                Рассчитать кухню
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-lg border border-white/38 bg-black/12 px-7 py-4 text-sm font-extrabold text-white transition-all hover:bg-white/12 active:scale-95"
                data-testid="hero-cta-portfolio"
              >
                Смотреть проекты
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS STRIP ===== */}
      <section className="border-b border-[#eee8df] bg-white py-6">
        <div className="container-site">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Factory, title: "Собственное производство" },
              { icon: FileCheck, title: "Цена фиксируется в договоре" },
              { icon: Wrench, title: "Монтаж под ключ" },
              { icon: MapPin, title: "Работаем по всей Беларуси" },
              { icon: Shield, title: "Гарантия по договору" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-center justify-center gap-3 text-center sm:text-left">
                  <Icon className="h-8 w-8 shrink-0 stroke-[1.5] text-[#201b16]" aria-hidden />
                  <p className="max-w-[9rem] text-xs font-extrabold leading-tight text-[#201b16]">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO preview ===== */}
      {cases.length > 0 && (
        <section className="bg-white py-10 lg:py-14">
          <div className="container-site">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-[#201b16] lg:text-3xl">
                  Реальные проекты кухонь
                </h2>
                <p className="mt-2 text-sm text-[#6f665d]">
                  Фотографии кухонь, которые мы изготовили и установили
                </p>
              </div>
              <Link href="/portfolio" className="hidden items-center gap-2 text-sm font-semibold text-[#7d5431] hover:underline sm:flex">
                Смотреть все проекты <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cases.map((c) => {
                const disclosure = getImageDisclosure(c.mainImage);

                return (
                <Link key={c.id} href={`/portfolio/${c.slug}`} className="group overflow-hidden rounded-lg border border-[#e8e1d8] bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(39,32,25,0.12)]">
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#f3eee8]">
                    {c.mainImage
                      ? (
                        <Image
                          src={optimizedImageSrc(c.mainImage) || c.mainImage}
                          alt={buildImageAlt(c.mainImage, `${c.title}, ${c.city}`)}
                          fill
                          loading="lazy"
                          decoding="async"
                          quality={75}
                          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 45vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )
                      : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          <span role="img" aria-label="Нет фото проекта, значок дома">
                            🏠
                          </span>
                        </div>
                      )
                    }
                    {c.mainImage && (
                      <>
                        <BrandedImageWatermark show={disclosure.kind === "generated"} compact />
                        <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#201b16] shadow-sm">
                          {disclosure.label}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-black text-[#201b16] transition-colors group-hover:text-[#7d5431]">{c.city || "Минск"}</p>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#6f665d]">{c.title}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#6f665d]">
                      <div>
                        <p>Площадь</p>
                        <p className="mt-1 font-black text-[#201b16]">{c.area || "8,2"} п.м</p>
                      </div>
                      <div>
                        <p>Срок изготовления</p>
                        <p className="mt-1 font-black text-[#201b16]">от 21 дня</p>
                      </div>
                    </div>
                    {c.priceFrom > 0 && (
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-[#201b16]">
                          {c.priceFrom.toLocaleString("ru")} BYN
                        </p>
                        <span className="rounded-md border border-[#c99a62] px-3 py-2 text-xs font-bold text-[#9b6b3e]">
                          Хочу такую
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== PRICE TYPES ===== */}
      <section className="bg-[#f7f4ef] py-10 lg:py-12">
        <div className="container-site">
          <div className="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-stretch">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black leading-tight text-[#201b16]">
                Сколько стоит кухня на заказ
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6f665d]">
                Ориентировочные цены на кухни разных форм. Точная стоимость рассчитывается после замера.
              </p>
              <Link href="/prices" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#7d5431] hover:underline">
                Все цены <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {CATALOG_CATEGORIES.map((cat, index) => {
              const image = resolveCatalogCategoryImage({
                slug: cat.slug,
                title: cat.title,
              });

              return (
                <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="group overflow-hidden rounded-lg border border-[#e8e1d8] bg-white p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(39,32,25,0.10)]">
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-[8rem] overflow-hidden rounded-md bg-[#f3eee8]">
                    <CatalogCategoryImage src={image.src} alt={image.alt} />
                  </div>
                  <div className="pt-3">
                    <p className="text-sm font-black leading-tight text-[#201b16] transition-colors group-hover:text-[#7d5431]">{cat.title}</p>
                    <p className="mt-2 text-sm font-black text-[#201b16]">{cat.price}</p>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <HomeKitchenIdeas3DSection limit={4} />

      {/* ===== COMMERCIAL HUBS ===== */}
      <section className="section-padding bg-white border-y border-border/60">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[
              { href: "/catalog", title: "Категории кухонь", text: "Угловые, прямые, П-образные, с островом и до потолка." },
              { href: "/prices", title: "Цены и расчет", text: "Ориентиры по бюджету и быстрый переход к заявке на расчет." },
              { href: "/portfolio", title: "Портфолио", text: "Фото и визуализации кухонь с заполненными характеристиками." },
              { href: "/materials", title: "Материалы", text: "Фасады, корпуса, столешницы и практичные варианты отделки." },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Перейти{" "}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30 border-b border-border/60">
        <div className="container-site">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Популярные фасады</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Сравните МДФ, ЛДСП и пластик HPL до расчета кухни: где каждый материал уместен, какие есть ограничения и на что смотреть в проекте.
              </p>
            </div>
            <Link href="/materials" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Все материалы <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {MATERIAL_GUIDES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <p className="font-bold text-foreground transition-colors group-hover:text-primary">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Подробнее <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Производитель: цены / сроки / гарантии — перед этапами заказа ===== */}
      <section
        className="section-padding bg-white border-t border-border/60"
        aria-labelledby="home-manufacturing-heading"
      >
        <div className="container-site">
          <h2
            id="home-manufacturing-heading"
            className="text-3xl lg:text-4xl font-black text-foreground text-center max-w-4xl mx-auto leading-tight"
          >
            Кухни от производителя
          </h2>
        </div>
      </section>

      {/* ===== HOW WE WORK — STEPS ===== */}
      <section
        className="section-padding"
        style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1030 60%, #0c1a30 100%)" }}
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-white">Как проходит заказ</h2>
            <p className="mt-3 text-white/40 text-base">От первого звонка до сданной кухни</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displaySteps.map((s, i) => (
              <div key={`${s.id}-${i}`} className="flex gap-4 p-5 rounded-2xl border border-white/8 bg-white/4 hover:border-violet-500/30 hover:bg-white/8 transition-all">
                <div
                  className="text-2xl font-black shrink-0 leading-none mt-0.5"
                  style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  role="img"
                  aria-label={s.title}
                >
                  {s.icon || String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-bold text-white">{s.title}</p>
                  <p className="text-sm text-white/50 mt-1 leading-relaxed">{s.description}</p>
                  {s.badge && <span className="mt-2 inline-block text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">{s.badge}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADVANTAGES ===== */}
      <section className="section-padding bg-background">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">Почему выбирают нас</h2>
            <p className="mt-3 text-muted-foreground text-base">Причины доверить кухню КухниBY</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayAdvantages.map((adv, index) => (
              <div key={`${adv.id}-${index}`} className="group rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all bg-white">
                <div className="flex items-start gap-4 mb-3">
                  <span
                    className="text-2xl flex-shrink-0"
                    role="img"
                    aria-label={advantageEmojiAriaLabel(adv.icon, adv.title)}
                  >
                    {adv.icon}
                  </span>
                  {adv.badge && <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{adv.badge}</span>}
                </div>
                <p className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">{adv.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{adv.description}</p>
                {adv.href && (
                  <Link href={adv.href} className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold hover:gap-2 transition-all">
                    Подробнее <ArrowRight className="w-3 h-3" aria-hidden />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATIONS ===== */}
      <section className="section-padding bg-muted/30 border-y border-border/60">
        <div className="container-site">
          <div className="max-w-4xl">
            <p className="font-serif text-3xl lg:text-4xl font-bold">
              Работаем по Минску, Минской области и крупным городам Беларуси
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Проектируем гарнитуры под индивидуальные размеры. Условия замера,
              доставки и монтажа уточняются при расчёте конкретного проекта.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {primaryLocationLinks.map((region) => (
                <Link
                  key={region.slug}
                  href={`/locations/${region.slug}`}
                  className="rounded-full border border-border bg-white px-4 py-2 font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {region.city}
                </Link>
              ))}
              <Link
                href="/locations"
                className="rounded-full border border-border bg-white px-4 py-2 font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                Все города
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p className="font-serif text-3xl lg:text-4xl font-bold">Условия работы по городам Беларуси</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Перейдите на страницу региона, чтобы посмотреть условия выезда, сроки, локальные примеры и популярные решения.
              </p>
            </div>
            <Link href="/contacts" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Уточнить выезд <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {primaryLocationLinks.map((loc, index) => (
              <Link
                key={`${loc.slug}-${loc.id}-${index}`}
                href={`/locations/${loc.slug}`}
                className="group rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">Проекты в {loc.cityPrepositional}</p>
                    {loc.region && <p className="mt-1 text-xs text-muted-foreground">{loc.region}</p>}
                  </div>
                  <MapPin className="h-5 w-5 text-primary/70 shrink-0" aria-hidden />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">от {loc.priceFrom.toLocaleString("ru")} BYN</span>
                  <ArrowRight
                    className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE BLOCK ===== */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-violet-50">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-3xl lg:text-4xl font-black text-foreground mb-4">Гарантии и сроки</p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Мы не даём пустых обещаний. Все условия прописаны в договоре до начала работ.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: <Shield className="w-5 h-5 text-primary" aria-hidden />,
                    title: "Гарантия по договору",
                    desc: "На фурнитуру Blum/Hettich. На корпус и фасады — 2 года. Письменно.",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-primary" aria-hidden />,
                    title: "Сроки в договоре",
                    desc: "Даём конкретную дату монтажа. Нарушение срока — пересчёт цены.",
                  },
                  {
                    icon: <FileCheck className="w-5 h-5 text-primary" aria-hidden />,
                    title: "Смета до предоплаты",
                    desc: "Сначала видите полную смету — потом подписываете договор.",
                  },
                  {
                    icon: <MapPin className="w-5 h-5 text-primary" aria-hidden />,
                    title: "По всей Беларуси",
                    desc: "Собственные замерщики и монтажники в Минске и регионах.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Link href="/warranty" className="block rounded-2xl overflow-hidden border border-border bg-white p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <p className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Гарантийные обязательства →</p>
                <p className="text-sm text-muted-foreground">Подробно о том, что входит в гарантию и как её получить</p>
              </Link>
              <Link href="/delivery-installation" className="block rounded-2xl overflow-hidden border border-border bg-white p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <p className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Доставка и монтаж →</p>
                <p className="text-sm text-muted-foreground">Как организована доставка в ваш город и что входит в монтаж</p>
              </Link>
              <Link href="/prices" className="block rounded-2xl overflow-hidden border border-border bg-white p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <p className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Примерные цены →</p>
                <p className="text-sm text-muted-foreground">Диапазоны стоимости по конфигурациям и материалам</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      {reviews.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="font-serif text-3xl lg:text-4xl font-bold">Отзывы и примеры обратной связи</p>
                <p className="text-muted-foreground mt-1 text-sm">Публикуем только подтверждённые отзывы. Новые отзывы добавляются после проверки.</p>
              </div>
              <Link href="/reviews" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Все отзывы <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {reviews.map((r, index) => (
                <div key={`${r.id}-${index}`} className="card-base p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-4">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{r.name}</span>
                    <span className="mx-1">·</span>{r.city}
                    {r.date && <><span className="mx-1">·</span>{r.date}</>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {faqs.length > 0 && <FAQSection items={faqs} generateSchema={false} />}

      {/* ===== CTA BANNER ===== */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #0891b2 100%)" }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 40%)" }} />
        <div className="container-site text-center relative z-10">
          <p className="text-3xl lg:text-4xl font-black text-white mb-3">Хотите точный расчёт?</p>
          <p className="text-white/75 mb-8 text-lg">Оставьте заявку — перезвоним в течение 30 минут</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacts#form"
              className="bg-white text-violet-700 hover:bg-white/90 px-8 py-3.5 rounded-xl font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-xl"
              data-testid="banner-cta"
            >
              Согласовать замер
            </Link>
            <a
              href={`tel:${CONTACT_DEFAULTS.phone}`}
              className="flex items-center justify-center gap-2 text-white border-2 border-white/30 hover:border-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold transition-all"
            >
              <Phone className="w-4 h-4" aria-hidden />
              {CONTACT_DEFAULTS.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section id="form" className="section-padding bg-background">
        <div className="container-site max-w-2xl">
          <p className="font-serif text-3xl font-bold text-center mb-2">Оставить заявку</p>
          <p className="text-center text-muted-foreground mb-8">Условия замера и консультации уточняются при заявке</p>
          <ContactForm source="home" sourceType="home" />
        </div>
      </section>
    </>
  );
}
