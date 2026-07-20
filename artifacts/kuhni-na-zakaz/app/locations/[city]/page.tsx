import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { notFound } from "next/navigation";
import { getRegionalLocation, type RegionalLocationData } from "@/data/locations";
import {
  RegionalLocationPage,
  type PortfolioCasePreview,
} from "@/components/locations/RegionalLocationPage";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { prisma } from "@/lib/db";
import { ReviewStatus, type LocationPage } from "@prisma/client";
import { ContactForm } from "@/components/sections/ContactForm";
import {
  CheckCircle, MapPin, Clock, Ruler, Wrench, ChevronRight,
  Star, CalendarDays, ArrowRight, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME, buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { GENERATED_MINSK_PORTFOLIO_CASES } from "@/data/portfolio-projects";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, offerJsonLd, siteUrl } from "@/lib/schema-org";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { PhoneReveal } from "@/components/layout/PhoneReveal";

export const revalidate = 3600;
export const dynamic = "force-static";

interface Props { params: Promise<{ city: string }> }

type UniquePoint = { emoji: string; title: string; text: string };
type ContentBlock = { title: string; text: string; type: "text" | "highlight" };
type FaqItem = { q: string; a: string };
type PortfolioCase = { id: number; title: string; slug: string; mainImage: string; style: string; priceFrom: number; area: number; days: number; city: string };
type ReviewItem = { id: number; name: string; city: string; rating: number; text: string; date: string; region: string; source: string };

function isJsonLdObject<T>(value: T | null): value is T {
  return value !== null;
}

function normalizeCityName(value: string | null | undefined) {
  return (value ?? "").trim().toLocaleLowerCase("ru").replace(/ё/g, "е");
}

function isSameCity(value: string | null | undefined, expected: string) {
  return normalizeCityName(value) === normalizeCityName(expected);
}

const catalogLinks = [
  { href: "/catalog", title: "Каталог кухонь", text: "Все форматы кухонь по размерам, стилю и бюджету." },
  { href: "/catalog/uglovye-kuhni", title: "Угловые кухни", text: "Практичный вариант для квартир и частных домов." },
  { href: "/catalog/kuhni-do-potolka", title: "Кухни до потолка", text: "Больше хранения и аккуратная линия фасадов." },
];

const LOCATION_PAGE_FALLBACK_IMAGE =
  "https://kuhni.minsk.by/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp";

function fallbackLocation(slug: string): LocationPage | null {
  const item = getRegionalLocation(slug);
  if (!item) return legacyFallbackLocation(slug);

  return regionalLocationToPage(item);
}

function regionalLocationToPage(item: RegionalLocationData): LocationPage {
  const city = item.cityName;
  const cityPrep = cityGenitive(city);

  return {
    id: 0,
    externalId: null,
    slug: item.slug,
    city,
    region: item.regionName,
    title: item.title,
    h1: item.h1,
    seoTitle: item.title,
    seoDescription: item.description,
    description: item.description,
    intro: item.introText,
    localIntro: "",
    features: [
      item.measurementText,
      item.deliveryText,
      item.installationText,
      item.warrantyText,
    ],
    uniquePoints: [
      { emoji: "📐", title: "Замер", text: item.measurementText },
      { emoji: "🚚", title: "Доставка", text: item.deliveryText },
      { emoji: "🔧", title: "Монтаж", text: item.installationText },
      { emoji: "✅", title: "Гарантия", text: item.warrantyText },
    ],
    contentBlocks: [
      { type: "highlight", title: `Особенности работы: ${city}`, text: item.seoText },
      { type: "text", title: "Замер и доставка", text: `${item.measurementText} ${item.deliveryText}` },
      { type: "text", title: "Монтаж и гарантия", text: `${item.installationText} ${item.warrantyText}` },
    ],
    timelineText: `Заявка → Замер в ${cityPrep} → 3D-проект → Производство → Доставка и монтаж`,
    visitDetails: item.measurementText,
    installDetails: item.installationText,
    faq: item.faq.map(({ question, answer }) => ({ q: question, a: answer })),
    images: [],
    areas: item.areas,
    workZone: `Работаем в регионе: ${item.regionName}.`,
    deliveryCost: item.deliveryText,
    mapEmbed: "",
    phone: CONTACT_DEFAULTS.phone,
    address: "",
    priceFrom: item.priceFrom,
    deliveryDays: 1,
    measureCost: "Условия замера — по заявке",
    ctaHeadline: city === "Минская область" ? "Заказать кухню по Минской области" : `Заказать кухню в ${cityPrep}`,
    ctaSubtext: "Оставьте заявку, и специалист свяжется с вами для консультации и записи на замер.",
    caseSlugs: [],
    reviewIds: [],
    published: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

function legacyFallbackLocation(slug: string): LocationPage | null {
  const legacyLocations: Record<string, { city: string; region: string; h1: string }> = {
    brest: { city: "Брест", region: "Брестская область", h1: "Кухни на заказ в Бресте" },
    grodno: { city: "Гродно", region: "Гродненская область", h1: "Кухни на заказ в Гродно" },
  };
  const item = legacyLocations[slug];
  if (!item) return null;

  const cityPrep = cityGenitive(item.city);

  return {
    id: 0,
    externalId: null,
    slug,
    city: item.city,
    region: item.region,
    title: item.h1,
    h1: item.h1,
    seoTitle: item.h1,
    seoDescription: "Проектируем, изготавливаем и устанавливаем кухни на заказ: замер, 3D-проект, производство и монтаж.",
    description: `Кухни на заказ для клиентов в регионе ${item.city}: индивидуальный проект, подбор материалов, изготовление и монтаж.`,
    intro: "Подберём планировку, материалы и комплектацию под помещение, бюджет и сроки.",
    localIntro: "",
    features: ["Замер по заявке", "3D-проект по условиям заказа", "Договор и гарантия"],
    uniquePoints: [],
    contentBlocks: [],
    timelineText: "",
    visitDetails: "",
    installDetails: "",
    faq: [],
    images: [],
    areas: [item.city],
    workZone: "",
    deliveryCost: "",
    mapEmbed: "",
    phone: CONTACT_DEFAULTS.phone,
    address: "",
    priceFrom: 0,
    deliveryDays: 1,
    measureCost: "Условия замера — по заявке",
    ctaHeadline: `Заказать кухню в ${cityPrep}`,
    ctaSubtext: "Оставьте заявку, и специалист свяжется с вами для консультации и записи на замер.",
    caseSlugs: [],
    reviewIds: [],
    published: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

async function getLocation(slug: string): Promise<LocationPage | null> {
  if (!isPublicContentSlug(slug)) return null;

  return prisma.locationPage
    .findFirst({ where: { slug, published: true } })
    .then((location) => normalizeLocationCopy(location ?? fallbackLocation(slug)))
    .catch(() => normalizeLocationCopy(fallbackLocation(slug)));
}

async function getPageData(loc: NonNullable<Awaited<ReturnType<typeof getLocation>>>) {
  const pinnedSlugs = loc.caseSlugs ?? [];
  const pinnedIds = loc.reviewIds ?? [];

  const [pinnedCases, autoCases, pinnedReviews, autoReviews] = await Promise.all([
    pinnedSlugs.length > 0
      ? prisma.portfolioCase.findMany({
          where: {
            published: true,
            slug: { in: pinnedSlugs.filter(isPublicContentSlug) },
            city: { equals: loc.city, mode: "insensitive" },
          },
          select: { id: true, title: true, slug: true, mainImage: true, style: true, priceFrom: true, area: true, days: true, city: true },
        }).catch(() => [])
      : [],
    prisma.portfolioCase.findMany({
      where: { published: true, slug: publicSlugWhere(), city: { equals: loc.city, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, slug: true, mainImage: true, style: true, priceFrom: true, area: true, days: true, city: true },
    }).catch(() => []),
    pinnedIds.length > 0
      ? prisma.review.findMany({
          where: { status: ReviewStatus.PUBLISHED, id: { in: pinnedIds } },
          select: { id: true, name: true, city: true, rating: true, text: true, date: true, region: true, source: true },
        }).catch(() => [])
      : [],
    prisma.review.findMany({
      where: { status: ReviewStatus.PUBLISHED, city: { contains: loc.city, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, city: true, rating: true, text: true, date: true, region: true, source: true },
    }).catch(() => []),
  ]);

  const seenCaseIds = new Set<number>();
  const cases: PortfolioCase[] = [];
  for (const c of [...pinnedCases, ...autoCases]) {
    if (isPublicContentSlug(c.slug) && isSameCity(c.city, loc.city) && !seenCaseIds.has(c.id) && cases.length < 4) {
      seenCaseIds.add(c.id);
      cases.push(c as PortfolioCase);
    }
  }

  const seenReviewIds = new Set<number>();
  const reviews: ReviewItem[] = [];
  for (const r of [...pinnedReviews, ...autoReviews]) {
    if (!seenReviewIds.has(r.id) && reviews.length < 3) {
      seenReviewIds.add(r.id);
      reviews.push(r as ReviewItem);
    }
  }

  return { cases, reviews };
}

async function getRegionalPortfolioCases(location: RegionalLocationData) {
  const localCases = await prisma.portfolioCase.findMany({
    where: {
      published: true,
      slug: publicSlugWhere(),
      city: { equals: location.portfolioCityKey, mode: "insensitive" },
    },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      mainImage: true,
      style: true,
      priceFrom: true,
      area: true,
      days: true,
      city: true,
    },
  }).catch(() => []);

  const confirmedLocalCases = localCases.filter(
    (item) => isPublicContentSlug(item.slug) && isSameCity(item.city, location.portfolioCityKey),
  ) as PortfolioCasePreview[];

  const generatedMinskCases: PortfolioCasePreview[] =
    location.slug === "minsk"
      ? GENERATED_MINSK_PORTFOLIO_CASES.slice(0, 3).map((item) => ({
          id: item.externalId || item.slug,
          title: item.title,
          slug: item.slug,
          mainImage: item.mainImage,
          style: item.style,
          priceFrom: item.priceFrom,
          area: item.area,
          days: item.days,
          city: item.city,
        }))
      : [];

  const cases = [...generatedMinskCases, ...confirmedLocalCases].slice(0, 4);

  return { cases, hasLocalCases: cases.length > 0 };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const regionalLocation = getRegionalLocation(city);
  if (regionalLocation) {
    const path = `/locations/${city}`;
    const isBorisov = city === "borisov";
    const title = isBorisov
      ? "Как проходит заказ кухни для Борисова"
      : regionalLocation.title;
    const description = isBorisov
      ? "Этапы обсуждения заказа кухни для Борисова, условия, которые нужно подтвердить, честный fallback локальных проектов и заявка с контекстом."
      : regionalLocation.description;
    const regionalImage =
      city === "minsk"
        ? [
            {
              url: "/uploads/locations/minsk-3d/minsk-hero-light-20260619-desktop.webp",
              width: 1200,
              height: 675,
              alt: "Светлая кухня на заказ в Минске",
            },
          ]
        : undefined;

    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: buildOpenGraph(path, title, description, {
        images: regionalImage,
      }),
      twitter: buildTwitterMetadata(
        title,
        description,
        regionalImage?.[0]?.url,
      ),
    };
  }

  const loc = await getLocation(city);
  if (!loc) return { title: "Не найдено" };
  const title = cleanSeoTitle(loc.seoTitle, loc.title);
  const description = trimMetaDescription(loc.seoDescription, loc.description);
  const path = `/locations/${city}`;
  const image = loc.images[0] ? [{ url: loc.images[0], alt: loc.title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: buildOpenGraph(path, title, description, { images: image }),
    twitter: buildTwitterMetadata(title, description, loc.images[0] || undefined),
  };
}

function cityGenitive(city: string) {
  if (city === "Минск") return "Минске";
  if (city === "Минская область") return "Минской области";
  if (city === "Борисов") return "Борисове";
  if (city === "Молодечно") return "Молодечно";
  if (city === "Брест") return "Бресте";
  if (city === "Гродно") return "Гродно";
  if (city === "Гомель") return "Гомеле";
  if (city === "Витебск") return "Витебске";
  if (city === "Могилёв") return "Могилёве";
  return city;
}

function citySourceForm(city: string) {
  if (city === "Минск") return "Минска";
  if (city === "Минская область") return "Минской области";
  if (city === "Борисов") return "Борисова";
  if (city === "Молодечно") return "Молодечно";
  if (city === "Брест") return "Бреста";
  if (city === "Гродно") return "Гродно";
  if (city === "Гомель") return "Гомеля";
  if (city === "Витебск") return "Витебска";
  if (city === "Могилёв") return "Могилёва";
  return city;
}

function normalizeLocationCopy(location: LocationPage | null): LocationPage | null {
  if (!location) return null;

  const normalized = { ...location };
  const stringFields = [
    "title",
    "h1",
    "seoTitle",
    "seoDescription",
    "description",
    "intro",
    "localIntro",
    "timelineText",
    "visitDetails",
    "installDetails",
    "workZone",
    "deliveryCost",
    "measureCost",
    "ctaHeadline",
    "ctaSubtext",
  ] as const;
  const jsonFields = ["features", "uniquePoints", "contentBlocks", "faq", "areas"] as const;

  for (const field of stringFields) {
    normalized[field] = normalizeLocationText(normalized[field], location.city) as never;
  }

  for (const field of jsonFields) {
    normalized[field] = normalizeLocationJson(normalized[field], location.city) as never;
  }

  if (!normalized.phone || normalized.phone === "+375296261547") {
    normalized.phone = CONTACT_DEFAULTS.phone;
  }

  return normalized;
}

function normalizeLocationJson(value: unknown, city: string): unknown {
  if (typeof value === "string") return normalizeLocationText(value, city);
  if (Array.isArray(value)) return value.map((item) => normalizeLocationJson(item, city));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeLocationJson(item, city)]),
    );
  }

  return value;
}

function normalizeLocationText(value: string | null, city: string): string | null {
  if (!value) return value;

  const cityPrep = cityGenitive(city);
  const measurementText =
    city === "Минск"
      ? "Замерщик приезжает по Минску в согласованное время и учитывает особенности помещения."
      : "Замерщик приезжает по указанному адресу в согласованное время и учитывает особенности помещения.";

  return value
    .replace(
      new RegExp(`Замерщик приезжает в ${escapeRegExp(cityPrep)} в согласованное время и учитывает особенности помещения\\.`, "g"),
      measurementText,
    )
    .replace(/Сколько стоит кухня на заказ в Минская область\?/g, "Сколько стоит кухня на заказ по Минской области?")
    .replace(/кухни в Минск(?!е)/gi, "кухни в Минске")
    .replace(/кухню в Минск(?!е)/gi, "кухню в Минске")
    .replace(/в городе Минск(?!е)/gi, "в городе Минске");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );
}

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const regionalLocation = getRegionalLocation(city);
  if (regionalLocation) {
    const { cases, hasLocalCases } = await getRegionalPortfolioCases(regionalLocation);

    return (
      <RegionalLocationPage
        location={regionalLocation}
        cases={cases}
        hasLocalCases={hasLocalCases}
      />
    );
  }

  const loc = await getLocation(city);
  if (!loc) notFound();

  const { cases, reviews } = await getPageData(loc);

  const faqItems = (loc.faq as FaqItem[]) ?? [];
  const uniquePoints: UniquePoint[] = Array.isArray(loc.uniquePoints) ? (loc.uniquePoints as UniquePoint[]) : [];
  const contentBlocks: ContentBlock[] = Array.isArray(loc.contentBlocks) ? (loc.contentBlocks as ContentBlock[]) : [];
  const timelineSteps = loc.timelineText ? loc.timelineText.split("→").map(s => s.trim()).filter(Boolean) : [];
  const cityGen = cityGenitive(loc.city);
  const cityFrom = citySourceForm(loc.city);
  const locationUrl = `/locations/${loc.slug}`;
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": siteUrl(locationUrl),
    name: loc.h1 || loc.title || `Кухни на заказ в ${loc.city}`,
    description: loc.description || loc.intro,
    url: siteUrl(locationUrl),
    inLanguage: "ru-BY",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl("/")}#website`,
      name: SITE_NAME,
      url: siteUrl("/"),
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: siteUrl(loc.images[0] || LOCATION_PAGE_FALLBACK_IMAGE),
    },
  };
  const jsonLdFaq = faqJsonLd(faqItems.map((item) => ({ question: item.q, answer: item.a })));
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl(locationUrl)}#service`,
    name: loc.h1 || `Кухни на заказ в ${loc.city}`,
    description: loc.description || loc.intro,
    serviceType: "Кухни на заказ",
    areaServed: compactJsonLd({
      "@type": "AdministrativeArea",
      name: loc.region || loc.city,
    }),
    provider: compactJsonLd({
      "@type": "LocalBusiness",
      "@id": `${siteUrl("/")}#localbusiness`,
      name: SITE_NAME,
      url: siteUrl("/"),
      telephone: CONTACT_DEFAULTS.phone,
      address: compactJsonLd({
        "@type": "PostalAddress",
        streetAddress: "ул. Дзержинского, д. 90, каб. 1а",
        postalCode: "222520",
        addressLocality: "Борисов",
        addressCountry: "BY",
      }),
      areaServed: compactJsonLd({
        "@type": "AdministrativeArea",
        name: loc.region || loc.city,
      }),
    }),
    offers: offerJsonLd(loc.priceFrom, locationUrl),
  });

  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Города", path: "/locations" },
    { name: loc.city, path: `/locations/${loc.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[jsonLdWebPage, jsonLdBreadcrumb, jsonLdService, jsonLdFaq].filter(isJsonLdObject)} />

      {/* HERO */}
      <section id="location-prices" className="relative bg-gradient-to-br from-[#1a0533] via-[#2d0a5e] to-[#0f1525] text-white overflow-hidden">
        {loc.images[0] && (
          <div className="absolute inset-0 opacity-15">
            <Image src={optimizedImageSrc(loc.images[0]) || loc.images[0]} alt={buildImageAlt(loc.images[0], loc.city)} fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
          </div>
        )}
        <div className="relative container-site section-padding py-16 md:py-24">
          <nav className="text-sm text-white/60 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Кухни в {cityGen}</span>
          </nav>

          <div className="max-w-3xl">
            {loc.region && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4 border border-white/20">
                <MapPin className="w-3 h-3" />
                {loc.region}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">{loc.h1}</h1>
            {loc.intro && <p className="text-lg text-white/80 mb-8 leading-relaxed">{loc.intro}</p>}

            <div className="flex flex-wrap gap-3 mb-10">
              <PhoneReveal
                phone={loc.phone || CONTACT_DEFAULTS.phoneDisplay}
                phoneHref={`tel:${(loc.phone || CONTACT_DEFAULTS.phone).replace(/\D/g, "").replace(/^/, "+")}`}
                source={`city-${loc.slug}-hero`}
                compact
                className="bg-white px-6 py-3 text-[#2d0a5e]"
              />
              <a
                href="#form"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors text-sm border border-white/20"
              >
                Оставить заявку
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              {loc.priceFrom > 0 && (
                <div>
                  <p className="text-2xl font-bold">от {loc.priceFrom} BYN</p>
                  <p className="text-xs text-white/60">за погонный метр</p>
                </div>
              )}
              <div>
                <p className="text-2xl font-bold">{loc.measureCost || "Условия замера — по заявке"}</p>
                <p className="text-xs text-white/60">выезд на замер</p>
              </div>
              {loc.deliveryDays > 0 && (
                <div>
                  <p className="text-2xl font-bold">{loc.deliveryDays === 1 ? "1 день" : `${loc.deliveryDays} дня`}</p>
                  <p className="text-xs text-white/60">срок выезда</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {loc.features.length > 0 && (
        <section className="bg-white border-b border-border">
          <div className="container-site py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loc.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCAL INTRO — unique per location */}
      {loc.localIntro && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <div className="max-w-3xl">
              <p className="text-base md:text-lg text-foreground leading-relaxed">{loc.localIntro}</p>
            </div>
          </div>
        </section>
      )}

      {/* UNIQUE POINTS — local selling points */}
      {uniquePoints.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Как мы работаем в {cityGen}
            </h2>
            <p className="text-muted-foreground mb-8">Особенности нашей работы в этом регионе</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {uniquePoints.map((pt, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border flex gap-4">
                  <div className="text-3xl flex-shrink-0">{pt.emoji}</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{pt.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{pt.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCAL CASES */}
      {cases.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Работы, связанные с {cityGen}
                </h2>
                <p className="text-muted-foreground mt-1">Показываем только проекты, где город совпадает с данными карточки</p>
              </div>
              <Link href="/portfolio" className="hidden md:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all">
                Все работы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cases.map(c => {
                const disclosure = getImageDisclosure(c.mainImage);

                return (
                <Link key={c.id} href={`/portfolio/${c.slug}`} className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-lg transition-all">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {c.mainImage ? (
                      <Image
                        src={optimizedImageSrc(c.mainImage) || c.mainImage}
                        alt={buildImageAlt(c.mainImage, c.title)}
                        width={640}
                        height={480}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 280px"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl">🏠</div>
                    )}
                    {c.mainImage && (
                      <>
                        <BrandedImageWatermark show={disclosure.kind === "generated"} compact />
                        <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                          {disclosure.label}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground text-sm mb-2 line-clamp-2">{c.title}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {c.area > 0 && <span>{c.area} п.м</span>}
                      {c.priceFrom > 0 && <span>от {c.priceFrom.toLocaleString("ru")} BYN</span>}
                      {c.days > 0 && <span>{c.days} дн.</span>}
                    </div>
                    {c.style && <span className="mt-2 inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{c.style}</span>}
                  </div>
                </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
                Все работы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTENT BLOCKS — unique editorial blocks */}
      {contentBlocks.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <div className="max-w-3xl space-y-6">
              {contentBlocks.map((block, i) => (
                <div
                  key={i}
                  className={cn("rounded-2xl p-6 border", {
                    "bg-primary/5 border-primary/20": block.type === "highlight",
                    "bg-white border-border": block.type !== "highlight",
                  })}
                >
                  <h3 className={cn("font-serif font-bold text-xl mb-3", {
                    "text-primary": block.type === "highlight",
                    "text-foreground": block.type !== "highlight",
                  })}>
                    {block.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{block.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="location-projects" className="section-padding bg-white">
        <div className="container-site">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Что посмотреть перед заказом
              </h2>
              <p className="text-muted-foreground mt-1">
                Подберите формат кухни и сравните реальные проекты перед замером в {cityGen}
              </p>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
              Перейти в портфолио <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/portfolio" className="rounded-2xl border border-border bg-muted/30 p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors">
              <h3 className="font-semibold text-foreground mb-2">Портфолио</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Посмотрите кухни, которые уже изготовили и установили для клиентов.
              </p>
            </Link>
            {catalogLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-border bg-muted/30 p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">{link.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{link.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      {loc.images.length > 1 && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Изображения для этого региона
            </h2>
            <p className="text-muted-foreground mb-8">Показываем только изображения, добавленные в данные страницы города</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loc.images.map((img, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden bg-muted ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <Image
                    src={optimizedImageSrc(img) || img}
                    alt={buildImageAlt(img, `Кухня в ${loc.city}, изображение ${i + 1}`)}
                    width={900}
                    height={900}
                    loading="lazy"
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="w-full h-full object-cover aspect-square"
                  />
                  <BrandedImageWatermark show={getImageDisclosure(img).kind === "generated"} compact={i !== 0} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {timelineSteps.length > 0 && (
        <section className="section-padding bg-gradient-to-br from-primary/5 to-violet-50">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2 text-center">
              Как это работает
            </h2>
            <p className="text-muted-foreground mb-10 text-center">От звонка до готовой кухни в {cityGen}</p>
            <div className="flex flex-col md:flex-row items-start gap-0 md:gap-0 max-w-4xl mx-auto">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex md:flex-col items-start md:items-center flex-1 relative">
                  <div className="flex md:flex-col items-center gap-3 md:gap-2 w-full">
                    <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center flex-shrink-0 z-10">
                      {i + 1}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className="hidden md:block absolute top-5 left-1/2 right-0 h-0.5 bg-primary/20" style={{ width: "100%" }} />
                    )}
                    <p className="text-sm font-medium text-foreground md:text-center mt-0 md:mt-3">{step}</p>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <ChevronRight className="md:hidden w-4 h-4 text-muted-foreground/40 mt-3 mx-2 flex-shrink-0 rotate-90 md:rotate-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VISIT + INSTALL DETAILS */}
      {(loc.visitDetails || loc.installDetails) && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">
              Замер и монтаж в {cityGen}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loc.visitDetails && (
                <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Выезд на замер</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{loc.visitDetails}</p>
                </div>
              )}
              {loc.installDetails && (
                <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Монтаж</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{loc.installDetails}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* LOCAL REVIEWS */}
      {reviews.length > 0 && (
        <section id="location-reviews" className="section-padding bg-muted/30">
          <div className="container-site">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Отзывы клиентов из {cityFrom}
                </h2>
                <p className="text-muted-foreground mt-1">Что говорят наши клиенты в регионе</p>
              </div>
              <Link href="/reviews" className="hidden md:inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
                Все отзывы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-5 border border-border">
                  <StarRow rating={r.rating} />
                  <p className="text-muted-foreground text-sm leading-relaxed my-3 line-clamp-4">{r.text}</p>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.city}{r.region ? `, ${r.region}` : ""}
                      </p>
                    </div>
                    {r.date && <span className="text-xs text-muted-foreground">{r.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WORK ZONES + MAP */}
      {(loc.areas.length > 0 || loc.mapEmbed) && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Зона работы
            </h2>
            {loc.workZone && <p className="text-muted-foreground mb-8">{loc.workZone}</p>}
            <div className={`grid gap-8 ${loc.mapEmbed ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
              {loc.areas.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Районы и населённые пункты
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {loc.areas.map((area, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                  {loc.deliveryCost && (
                    <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Доставка</p>
                      <p className="text-sm text-foreground">{loc.deliveryCost}</p>
                    </div>
                  )}
                </div>
              )}
              {loc.mapEmbed && (
                <div className="rounded-2xl overflow-hidden border border-border h-72 lg:h-auto">
                  <iframe
                    src={loc.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "280px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section id="location-faq" className="section-padding bg-muted/30">
          <div className="container-site">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Частые вопросы о кухнях в {cityGen}
            </h2>
            <p className="text-muted-foreground mb-8">Отвечаем на самые популярные вопросы жителей региона</p>
            <div className="max-w-3xl space-y-4">
              {faqItems.map((item, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-border overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground pr-4">{item.q}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA + FORM */}
      <section id="form" className="section-padding bg-gradient-to-br from-[#1a0533] via-[#2d0a5e] to-[#0f1525] text-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                {loc.ctaHeadline || `Заказать кухню в ${cityGen}`}
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                {loc.ctaSubtext || "Оставьте заявку — свяжемся в рабочее время, уточним задачу и согласуем следующий шаг."}
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Clock className="w-5 h-5" />, text: "Свяжемся в рабочее время" },
                  { icon: <CalendarDays className="w-5 h-5" />, text: "Выезд замерщика согласуем по адресу и готовности объекта" },
                  { icon: <MessageSquare className="w-5 h-5" />, text: "3D-проект после замера по условиям заявки" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              {loc.phone && (
                <PhoneReveal
                  phone={loc.phone}
                  phoneHref={`tel:+${loc.phone.replace(/\D/g, "")}`}
                  source={`city-${loc.slug}-form`}
                  compact
                  dark
                  className="mt-8"
                />
              )}
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <ContactForm
                source={`location-${loc.slug}`}
                sourceType="location-region"
                city={loc.city}
                cityKey={loc.slug}
                submitLabel="Рассчитать кухню"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
