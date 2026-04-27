import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReviewStatus, type LocationPage } from "@prisma/client";
import { ContactForm } from "@/components/sections/ContactForm";
import {
  CheckCircle, MapPin, Clock, Ruler, Wrench, ChevronRight,
  Star, Phone, CalendarDays, ArrowRight, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { optimizedImageSrc } from "@/lib/image-optimization";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ city: string }> }

type UniquePoint = { emoji: string; title: string; text: string };
type ContentBlock = { title: string; text: string; type: "text" | "highlight" };
type FaqItem = { q: string; a: string };
type PortfolioCase = { id: number; title: string; slug: string; mainImage: string; style: string; priceFrom: number; area: number; days: number; city: string };
type ReviewItem = { id: number; name: string; city: string; rating: number; text: string; date: string; region: string; source: string };

const catalogLinks = [
  { href: "/catalog", title: "Каталог кухонь", text: "Все форматы кухонь по размерам, стилю и бюджету." },
  { href: "/catalog/uglovye-kuhni", title: "Угловые кухни", text: "Практичный вариант для квартир и частных домов." },
  { href: "/catalog/kuhni-do-potolka", title: "Кухни до потолка", text: "Больше хранения и аккуратная линия фасадов." },
];

const FALLBACK_LOCATIONS: Record<string, Record<string, unknown>> = {
  minsk: { city: "Минск", region: "Минск", h1: "Кухни на заказ в Минске" },
  brest: { city: "Брест", region: "Брестская область", h1: "Кухни на заказ в Бресте" },
  grodno: { city: "Гродно", region: "Гродненская область", h1: "Кухни на заказ в Гродно" },
  vitebsk: { city: "Витебск", region: "Витебская область", h1: "Кухни на заказ в Витебске" },
  gomel: { city: "Гомель", region: "Гомельская область", h1: "Кухни на заказ в Гомеле" },
  mogilev: { city: "Могилёв", region: "Могилёвская область", h1: "Кухни на заказ в Могилёве" },
  "minskaya-oblast": { city: "Минская область", region: "Минская область", h1: "Кухни на заказ по Минской области" },
};

function fallbackLocation(slug: string): LocationPage | null {
  const item = FALLBACK_LOCATIONS[slug];
  if (!item) return null;

  const city = String(item.city);
  const h1 = String(item.h1);

  return {
    id: 0,
    externalId: null,
    slug,
    city,
    region: String(item.region),
    title: h1,
    h1,
    seoTitle: h1,
    seoDescription: `Проектируем, изготавливаем и устанавливаем кухни на заказ: замер, 3D-проект, производство и монтаж.`,
    description: `Кухни на заказ для клиентов в регионе ${city}: индивидуальный проект, подбор материалов, изготовление и монтаж.`,
    intro: "Подберём планировку, материалы и комплектацию под помещение, бюджет и сроки.",
    localIntro: "",
    features: ["Бесплатный замер", "3D-проект", "Договор и гарантия"],
    uniquePoints: [],
    contentBlocks: [],
    timelineText: "",
    visitDetails: "",
    installDetails: "",
    faq: [],
    images: [],
    areas: [city],
    workZone: "",
    deliveryCost: "",
    mapEmbed: "",
    phone: "+375291234567",
    address: "",
    priceFrom: 0,
    deliveryDays: 1,
    measureCost: "Бесплатно",
    ctaHeadline: `Заказать кухню в ${city}`,
    ctaSubtext: "Оставьте заявку, и специалист свяжется с вами для консультации и записи на замер.",
    caseSlugs: [],
    reviewIds: [],
    published: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

async function getLocation(slug: string): Promise<LocationPage | null> {
  return prisma.locationPage
    .findFirst({ where: { slug, published: true } })
    .then((location) => location ?? fallbackLocation(slug))
    .catch(() => fallbackLocation(slug));
}

async function getPageData(loc: NonNullable<Awaited<ReturnType<typeof getLocation>>>) {
  const pinnedSlugs = loc.caseSlugs ?? [];
  const pinnedIds = loc.reviewIds ?? [];

  const [pinnedCases, autoCases, pinnedReviews, autoReviews] = await Promise.all([
    pinnedSlugs.length > 0
      ? prisma.portfolioCase.findMany({
          where: { published: true, slug: { in: pinnedSlugs } },
          select: { id: true, title: true, slug: true, mainImage: true, style: true, priceFrom: true, area: true, days: true, city: true },
        }).catch(() => [])
      : [],
    prisma.portfolioCase.findMany({
      where: { published: true, city: { contains: loc.city, mode: "insensitive" } },
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
    if (!seenCaseIds.has(c.id) && cases.length < 4) {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const loc = await getLocation(city);
  if (!loc) return { title: "Не найдено" };
  const title = cleanSeoTitle(loc.seoTitle, loc.title);
  const description = trimMetaDescription(loc.seoDescription, loc.description);
  return {
    title,
    description,
    alternates: { canonical: `/locations/${city}` },
    openGraph: {
      title,
      description,
      images: loc.images[0] ? [{ url: loc.images[0] }] : [],
    },
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
  const loc = await getLocation(city);
  if (!loc) notFound();

  const { cases, reviews } = await getPageData(loc);

  const faqItems = (loc.faq as FaqItem[]) ?? [];
  const uniquePoints: UniquePoint[] = Array.isArray(loc.uniquePoints) ? (loc.uniquePoints as UniquePoint[]) : [];
  const contentBlocks: ContentBlock[] = Array.isArray(loc.contentBlocks) ? (loc.contentBlocks as ContentBlock[]) : [];
  const timelineSteps = loc.timelineText ? loc.timelineText.split("→").map(s => s.trim()).filter(Boolean) : [];
  const cityGen = cityGenitive(loc.city);

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://kuhni.minsk.by/locations/${loc.slug}`,
    name: "КухниBY",
    description: loc.description,
    telephone: loc.phone || "+375291234567",
    address: {
      "@type": "PostalAddress",
      addressLocality: loc.city,
      addressRegion: loc.region,
      addressCountry: "BY",
    },
    areaServed: loc.areas,
    priceRange: `от ${loc.priceFrom} BYN`,
    image: loc.images[0] || undefined,
    url: `https://kuhni.minsk.by/locations/${loc.slug}`,
  };

  const jsonLdFaq = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://kuhni.minsk.by/" },
      { "@type": "ListItem", position: 2, name: "Города", item: "https://kuhni.minsk.by/locations/" },
      { "@type": "ListItem", position: 3, name: loc.city, item: `https://kuhni.minsk.by/locations/${loc.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
      {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#1a0533] via-[#2d0a5e] to-[#0f1525] text-white overflow-hidden">
        {loc.images[0] && (
          <div className="absolute inset-0 opacity-15">
            <Image src={optimizedImageSrc(loc.images[0]) || loc.images[0]} alt={loc.city} fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
          </div>
        )}
        <div className="relative container-site section-padding py-16 md:py-24">
          <nav className="text-sm text-white/60 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Кухни в {loc.city}</span>
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
              <a
                href={`tel:${(loc.phone || "+375291234567").replace(/\D/g, "").replace(/^/, "+")}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#2d0a5e] font-bold hover:bg-white/90 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Бесплатный замер
              </a>
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
                <p className="text-2xl font-bold">{loc.measureCost || "Бесплатно"}</p>
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
                  Наши работы в {cityGen}
                </h2>
                <p className="text-muted-foreground mt-1">Реализованные проекты для жителей региона</p>
              </div>
              <Link href="/portfolio" className="hidden md:inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all">
                Все работы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cases.map(c => (
                <Link key={c.id} href={`/portfolio/${c.slug}`} className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {c.mainImage ? (
                      <Image
                        src={optimizedImageSrc(c.mainImage) || c.mainImage}
                        alt={c.title}
                        width={640}
                        height={480}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 280px"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl">🏠</div>
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
              ))}
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

      <section className="section-padding bg-white">
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
              Фото работ в регионе
            </h2>
            <p className="text-muted-foreground mb-8">Кухни, изготовленные и установленные для жителей {loc.region || loc.city}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loc.images.map((img, i) => (
                <div key={i} className={`rounded-xl overflow-hidden bg-muted ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <Image
                    src={optimizedImageSrc(img) || img}
                    alt={`Кухня в ${loc.city} — фото ${i + 1}`}
                    width={900}
                    height={900}
                    loading="lazy"
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="w-full h-full object-cover aspect-square"
                  />
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
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Отзывы клиентов из {cityGen}
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
        <section className="section-padding bg-muted/30">
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
                {loc.ctaSubtext || "Оставьте заявку — перезвоним в течение 15 минут и запишем на бесплатный выезд замерщика."}
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Clock className="w-5 h-5" />, text: "Перезвоним в течение 15 минут" },
                  { icon: <CalendarDays className="w-5 h-5" />, text: `Выезд замерщика — ${loc.deliveryDays === 1 ? "в день обращения" : `в течение ${loc.deliveryDays} дней`}` },
                  { icon: <MessageSquare className="w-5 h-5" />, text: "3D-проект бесплатно после замера" },
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
                <a href={`tel:${loc.phone.replace(/\D/g, "")}`} className="mt-8 inline-flex items-center gap-2 text-white/90 font-semibold hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  {loc.phone}
                </a>
              )}
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <ContactForm city={loc.city} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
