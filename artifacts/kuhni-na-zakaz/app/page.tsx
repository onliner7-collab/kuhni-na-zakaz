import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Phone, Star, Shield, Clock, MapPin, FileCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { HomeKitchenIdeas3DSection } from "@/components/sections/KitchenIdeas3DSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd } from "@/lib/schema-org";
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
  "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp";
const HOME_ORIGIN = CANONICAL_SITE_URL;
const HOME_URL = canonicalSiteUrl("/");

/** Alt для витринного фото в первом экране (SEO / доступность). */
const HERO_KITCHEN_ALT =
  "Современная кухня на заказ с фасадами МДФ в Минске";

const HOME_TITLE =
  "Кухни на заказ в Минске и по Беларуси — завод, замер и 3D | КухниBY";
const HOME_DESCRIPTION =
  "Кухни на заказ от производителя: Минск, Брест, Гродно, Гомель, Витебск, Могилёв. Завод, замер и 3D-проект по согласованным условиям. Гарантия фиксируется в договоре, от 1200 BYN.";

export const metadata: Metadata = {
  title: HOME_TITLE,
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
        alt: "Современная кухня на заказ от КухниBY",
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

async function getHomeData() {
  try {
    const [cases, reviews, faqs, scenarios, steps, advantages, trust, locations] = await Promise.all([
      prisma.portfolioCase.findMany({ where: { published: true, slug: publicSlugWhere() }, take: 3, orderBy: { createdAt: "desc" } }),
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
    publisher: {
      "@id": `${HOME_URL}#organization`,
    },
  };
  const localBusinessJsonLd = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${HOME_URL}#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    description: "Кухни на заказ по всей Беларуси. Собственное производство.",
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
          name: "Кухни на заказ",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(avgRating),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : null;
  const jsonLdItems = [
    websiteJsonLd,
    localBusinessJsonLd,
    jsonLdBreadcrumb,
    ...(jsonLdFaq ? [jsonLdFaq] : []),
    ...(jsonLdProduct ? [jsonLdProduct] : []),
  ];

  const FALLBACK_SCENARIOS = [
    { id: 1, icon: "🏠", title: "Подобрать кухню", subtitle: "по образу жизни", description: "Угловая, прямая, с островом — подберём под вашу планировку и привычки", href: "/catalog", badge: "" },
    { id: 2, icon: "💰", title: "Узнать стоимость", subtitle: "без обязательств", description: "Ответьте на несколько вопросов и получите примерный диапазон цены", href: "/prices", badge: "Быстро" },
    { id: 3, icon: "📸", title: "Посмотреть работы", subtitle: "портфолио", description: "Фото, 3D-визуализации и заполненные данные по проектам кухонь", href: "/portfolio", badge: "" },
    { id: 4, icon: "🎨", title: "Выбрать стиль", subtitle: "и материалы", description: "Современный, классика, минимализм, скандинавский — с примерами и ценами", href: "/styles", badge: "" },
    { id: 5, icon: "📐", title: "3D-проект кухни", subtitle: "по вашим размерам", description: "Специалист подготовит планировку, материалы и визуализацию перед расчетом", href: "/design-proekt-kuhni", badge: "" },
    { id: 6, icon: "✏️", title: "Собрать кухню", subtitle: "под свои задачи", description: "Расскажите о планировке, мы предложим решение и согласуем условия замера", href: "/contacts#form", badge: "Старт" },
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

  const FALLBACK_TRUST = [
    { id: 1, icon: "🏆", title: "Частные заказы", subtitle: "по Беларуси" },
    { id: 2, icon: "🛡️", title: "5 лет гарантии", subtitle: "на фурнитуру" },
    { id: 3, icon: "🗺️", title: "6 областей", subtitle: "по всей Беларуси" },
    { id: 4, icon: "📄", title: "Договор и смета", subtitle: "до начала работ" },
  ];

  const displayScenarios = scenarios.length > 0 ? scenarios : FALLBACK_SCENARIOS;
  const displayAdvantages = advantages.length > 0 ? advantages : FALLBACK_ADVANTAGES;
  const displaySteps = steps.length > 0 ? steps : FALLBACK_STEPS;
  const displayTrust = trust.length > 0 ? trust : FALLBACK_TRUST;
  const dbLocationsBySlug = new Map(locations.map((location) => [location.slug, location]));
  const displayLocations = regionalLocations.map((location, index) => {
    const dbLocation = dbLocationsBySlug.get(location.slug);

    return {
      id: dbLocation?.id ?? index + 1,
      slug: location.slug,
      city: location.cityName,
      region: location.regionName,
      priceFrom: dbLocation?.priceFrom && dbLocation.priceFrom > 0 ? dbLocation.priceFrom : location.priceFrom,
    };
  });

  return (
    <>
      <JsonLd data={jsonLdItems} />

      {/* ===== HERO ===== */}
      <section
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1060 40%, #0f1a3d 100%)" }}
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }} />

        <div className="container-site relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-200 border border-violet-500/30 bg-violet-500/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden />
              Работаем по Беларуси — сроки зависят от проекта
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Кухни на заказ в Беларуси —{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                проектирование, производство и установка под ключ
              </span>
            </h1>

            <p className="mt-5 text-lg text-white/65 leading-relaxed max-w-xl">
              Проектируем, производим и устанавливаем кухни в Минске, Бресте, Гродно, Витебске, Гомеле и Могилёве.
              Условия замера и 3D-проекта согласуем при заявке. Цена фиксируется в договоре.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contacts#form"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-violet-900/40 transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
                data-testid="hero-cta-order"
              >
                Согласовать замер
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all active:scale-95"
                data-testid="hero-cta-portfolio"
              >
                Смотреть работы
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5">
              {["Замер по заявке", "Срок проекта зависит от сложности", "Гарантия в договоре", "Вся Беларусь"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle className="w-4 h-4 text-violet-400 shrink-0" aria-hidden />
                  {t}
                </div>
              ))}
            </div>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/30 lg:mx-0 lg:max-w-none">
              <Image
                src={optimizedImageSrc(LOCAL_BUSINESS_IMAGE) || LOCAL_BUSINESS_IMAGE}
                alt={buildImageAlt(LOCAL_BUSINESS_IMAGE, HERO_KITCHEN_ALT)}
                fill
                priority
                fetchPriority="high"
                quality={85}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                {getImageDisclosure(LOCAL_BUSINESS_IMAGE).label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SCENARIOS — С чего хотите начать? ===== */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">С чего хотите начать?</h2>
            <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto">
              Выберите удобный путь — мы проведём вас от идеи до готовой кухни
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {displayScenarios.map((s, index) => (
              <Link
                key={`${s.id}-${index}`}
                href={s.href || "#"}
                className="group relative flex flex-col p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 transition-all bg-white hover:-translate-y-1"
              >
                {s.badge && (
                  <span className="absolute top-3 right-3 text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">
                    {s.badge}
                  </span>
                )}
                <span className="text-3xl mb-3" role="img" aria-label={s.title}>
                  {s.icon}
                </span>
                <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{s.title}</h3>
                {s.subtitle && <p className="text-xs text-muted-foreground mb-2">{s.subtitle}</p>}
                {s.description && <p className="text-xs text-muted-foreground leading-relaxed mt-1 flex-1">{s.description}</p>}
                <div className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold">
                  Перейти{" "}
                  <ArrowRight
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST STATS ===== */}
      {displayTrust.length > 0 && (
        <section className="py-6 sm:py-10 bg-gradient-to-r from-primary/5 via-violet-50 to-primary/5 border-y border-primary/10 overflow-hidden">
          <div className="container-site">

            {/* Mobile: вертикальный столбик */}
            <div className="flex flex-col gap-2 sm:hidden">
              {displayTrust.map((t, index) => (
                <div
                  key={`${t.id}-${index}`}
                  className="flex items-center gap-3 bg-white border border-border rounded-2xl px-4 py-3 shadow-sm"
                >
                  <span className="text-xl leading-none flex-shrink-0" role="img" aria-label={t.title}>
                    {t.icon}
                  </span>
                  <div>
                    <p className="text-sm font-black text-foreground leading-tight">{t.title}</p>
                    {t.subtitle && (
                      <p className="text-xs text-muted-foreground leading-tight mt-0.5">{t.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet+: сетка */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {displayTrust.map((t, index) => (
                <div key={`${t.id}-${index}`} className="text-center">
                  <div className="text-3xl mb-1.5" role="img" aria-label={t.title}>
                    {t.icon}
                  </div>
                  <p className="text-2xl font-black text-foreground">{t.title}</p>
                  {t.subtitle && <p className="text-sm text-muted-foreground mt-0.5">{t.subtitle}</p>}
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ===== PORTFOLIO preview ===== */}
      {cases.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl font-bold">Последние работы</h2>
                <p className="text-muted-foreground mt-1 text-sm">Фото из портфолио и визуальные примеры с понятными подписями</p>
              </div>
              <Link href="/portfolio" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Все проекты <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cases.map((c) => {
                const disclosure = getImageDisclosure(c.mainImage);

                return (
                <Link key={c.id} href={`/portfolio/${c.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all bg-white">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-stone-100 to-violet-50">
                    {c.mainImage
                      ? (
                        <Image
                          src={optimizedImageSrc(c.mainImage) || c.mainImage}
                          alt={buildImageAlt(c.mainImage, `${c.title}, ${c.city}`)}
                          fill
                          loading="lazy"
                          decoding="async"
                          quality={85}
                          sizes="(max-width: 768px) 100vw, 360px"
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
                      <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                        {disclosure.label}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} п.м</p>
                    {c.priceFrom > 0 && (
                      <p className="text-primary font-bold text-sm mt-1">
                        от {c.priceFrom.toLocaleString("ru")} BYN {c.priceTo > 0 && `— ${c.priceTo.toLocaleString("ru")} BYN`}
                      </p>
                    )}
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== CATALOG ===== */}
      <section className="section-padding bg-background">
        <div className="container-site">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Каталог кухонь</h2>
              <p className="text-muted-foreground mt-1 text-sm">По конфигурации и назначению</p>
            </div>
            <Link href="/catalog" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Все категории <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATALOG_CATEGORIES.map((cat, index) => {
              const image = resolveCatalogCategoryImage({
                slug: cat.slug,
                title: cat.title,
              });

              return (
                <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all bg-white">
                  <CatalogCategoryImage src={image.src} alt={image.alt} />
                  <div className="p-5">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-primary font-bold mt-1 text-sm">{cat.price}</p>
                  </div>
                </Link>
              );
            })}
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
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
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
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Популярные материалы фасадов</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Сравните МДФ, ЛДСП и пластик HPL до расчета кухни: где каждый материал уместен, какие есть ограничения и на что смотреть в проекте.
              </p>
            </div>
            <Link href="/materials" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Все материалы <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {MATERIAL_GUIDES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">{item.title}</h3>
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
            Изготовление кухонь на заказ от производителя: цены, сроки, гарантии
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
                  <h3 className="font-bold text-white">{s.title}</h3>
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
                <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors">{adv.title}</h3>
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
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">
              Работаем по Минску, Минской области и крупным городам Беларуси
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Изготавливаем кухни на заказ по индивидуальным размерам. Условия замера,
              доставки и монтажа уточняются при расчёте проекта.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {regionalLocations.map((region) => (
                <Link
                  key={region.slug}
                  href={`/locations/${region.slug}`}
                  className="rounded-full border border-border bg-white px-4 py-2 font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {region.cityName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Кухни на заказ в городах Беларуси</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Перейдите на страницу города, чтобы посмотреть условия, сроки, релевантные кейсы и популярные категории.
              </p>
            </div>
            <Link href="/contacts" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Уточнить выезд <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayLocations.map((loc, index) => (
              <Link
                key={`${loc.slug}-${loc.id}-${index}`}
                href={`/locations/${loc.slug}`}
                className="group rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Кухни в {loc.city}</h3>
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
              <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">Гарантии и сроки</h2>
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
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Гарантийные обязательства →</h3>
                <p className="text-sm text-muted-foreground">Подробно о том, что входит в гарантию и как её получить</p>
              </Link>
              <Link href="/delivery-installation" className="block rounded-2xl overflow-hidden border border-border bg-white p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Доставка и монтаж →</h3>
                <p className="text-sm text-muted-foreground">Как организована доставка в ваш город и что входит в монтаж</p>
              </Link>
              <Link href="/prices" className="block rounded-2xl overflow-hidden border border-border bg-white p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Примерные цены →</h3>
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
                <h2 className="font-serif text-3xl lg:text-4xl font-bold">Отзывы и примеры обратной связи</h2>
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
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Хотите точный расчёт?</h2>
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
          <h2 className="font-serif text-3xl font-bold text-center mb-2">Оставить заявку</h2>
          <p className="text-center text-muted-foreground mb-8">Условия замера и консультации уточняются при заявке</p>
          <ContactForm source="home" sourceType="home" />
        </div>
      </section>
    </>
  );
}
