import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Square, Paintbrush, Layers, Clock, ArrowRight, CheckCircle, AlertTriangle, Lightbulb, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import {
  getPortfolioProjectBySlug,
  portfolioProjects,
  type PortfolioProject,
} from "@/data/portfolio-projects";
import { ReviewStatus } from "@prisma/client";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";

interface Props { params: Promise<{ slug: string }> }

function parseProjectNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toStaticPortfolioCase(project: PortfolioProject, index = 0) {
  const createdAt = new Date(project.createdAt);

  return {
    id: index + 1,
    externalId: project.id,
    title: project.title,
    slug: project.slug,
    city: project.city,
    region: project.region,
    area: parseProjectNumber(project.size),
    layout: project.kitchenType,
    style: project.style,
    styleSlug: "",
    material: project.materials.join(", "),
    materialSlugs: [],
    scenarioSlugs: [],
    priceFrom: 0,
    priceTo: 0,
    days: parseProjectNumber(project.workDuration),
    completedAt: "",
    description: project.description,
    task: project.task,
    constraints: "",
    solution: project.solution,
    result: project.features.join(". "),
    mainImage: project.mainImage,
    images: project.images.map((image) => image.src),
    photosBefore: [],
    photosAfter: [],
    reviewIds: [],
    featured: project.isFeatured,
    order: index,
    seoTitle: project.title,
    seoDescription: project.description,
    seoKeywords: [
      project.kitchenType,
      project.style,
      project.city,
      ...project.materials,
    ].filter(Boolean).join(", "),
    published: true,
    createdAt,
    updatedAt: createdAt,
  };
}

async function getCase(slug: string) {
  try {
    const dbCase = await prisma.portfolioCase.findFirst({ where: { slug, published: true } });
    if (dbCase) return dbCase;
  } catch {}

  const project = getPortfolioProjectBySlug(slug);
  if (!project) return null;

  return toStaticPortfolioCase(project, portfolioProjects.findIndex((item) => item.slug === slug));
}

async function getRelated(c: Awaited<ReturnType<typeof getCase>>) {
  if (!c) return { style: null, materials: [], scenarios: [], reviews: [], locationPage: null };
  try {
    const [style, materials, scenarios, reviews, locationPage] = await Promise.all([
      c.styleSlug ? prisma.stylePage.findUnique({ where: { slug: c.styleSlug, published: true } }) : Promise.resolve(null),
      c.materialSlugs.length > 0 ? prisma.materialPage.findMany({ where: { slug: { in: c.materialSlugs }, published: true } }) : Promise.resolve([]),
      c.scenarioSlugs.length > 0 ? prisma.scenarioPage.findMany({ where: { slug: { in: c.scenarioSlugs }, published: true } }) : Promise.resolve([]),
      c.reviewIds.length > 0 ? prisma.review.findMany({ where: { id: { in: c.reviewIds }, status: ReviewStatus.PUBLISHED } }) : Promise.resolve([]),
      c.city ? prisma.locationPage.findFirst({ where: { city: c.city, published: true }, select: { slug: true, city: true, h1: true } }) : Promise.resolve(null),
    ]);
    return { style, materials, scenarios, reviews, locationPage };
  } catch { return { style: null, materials: [], scenarios: [], reviews: [], locationPage: null }; }
}

async function getOtherCases(slug: string) {
  try {
    const dbCases = await prisma.portfolioCase.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take: 3,
    });
    if (dbCases.length > 0) return dbCases;
  } catch {}

  return portfolioProjects
    .filter((project) => project.slug !== slug)
    .slice(0, 3)
    .map(toStaticPortfolioCase);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCase(slug);
  if (!c) return { title: "Проект кухни" };
  return {
    title: cleanSeoTitle(c.seoTitle, c.title),
    description: trimMetaDescription(c.seoDescription, c.description),
    keywords: c.seoKeywords || undefined,
    alternates: { canonical: `/portfolio/${slug}` },
  };
}

export default async function PortfolioCasePage({ params }: Props) {
  const { slug } = await params;
  const c = await getCase(slug);
  if (!c) notFound();
  const [{ style, materials, scenarios, reviews, locationPage }, others] = await Promise.all([getRelated(c), getOtherCases(slug)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.seoDescription || c.description,
    url: siteUrl(`/portfolio/${slug}`),
    datePublished: c.createdAt.toISOString(),
    dateModified: c.updatedAt.toISOString(),
    breadcrumb: breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Портфолио", path: "/portfolio" },
      { name: c.title, path: `/portfolio/${slug}` },
    ]),
  };

  const allPhotos = [...(c.images.length > 0 ? c.images : c.mainImage ? [c.mainImage] : [])];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="section-padding">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <Link href="/portfolio" className="hover:text-primary">Портфолио</Link><span>/</span>
            <span className="text-foreground">{c.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">
              {/* Hero */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {c.style && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">{c.style}</span>}
                  {c.layout && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">{c.layout}</span>}
                  {c.featured && <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1"><Star className="w-3 h-3" />Избранный проект</span>}
                </div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h1 className="font-serif text-4xl font-bold leading-tight">{c.title}</h1>
                  <FavoriteButton caseSlug={c.slug} className="flex-shrink-0 mt-1" />
                </div>

                {/* Specs strip */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary shrink-0" />{c.city}{c.region && c.region !== c.city && `, ${c.region}`}</span>
                  <span className="flex items-center gap-1.5"><Square className="w-4 h-4 text-primary shrink-0" />{c.area} п.м</span>
                  {c.layout && <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary shrink-0" />{c.layout}</span>}
                  <span className="flex items-center gap-1.5"><Paintbrush className="w-4 h-4 text-primary shrink-0" />{c.material}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary shrink-0" />{c.days} дней</span>
                  {c.completedAt && <span className="flex items-center gap-1.5 text-muted-foreground">📅 {c.completedAt}</span>}
                </div>

                {/* Main photo */}
                <div className="h-80 bg-gradient-to-br from-stone-200 to-amber-100 rounded-2xl overflow-hidden mb-4">
                  {c.mainImage ? (
                    <Image
                      src={optimizedImageSrc(c.mainImage) || c.mainImage}
                      alt={c.title}
                      width={1280}
                      height={720}
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 820px"
                      className="w-full h-full object-contain object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">Фото проекта</div>
                  )}
                </div>

                {/* Gallery */}
                {allPhotos.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {allPhotos.slice(1, 4).map((img, i) => (
                      <div key={i} className="h-28 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src={optimizedImageSrc(img) || img}
                          alt={`${c.title} фото ${i + 2}`}
                          width={480}
                          height={320}
                          loading="lazy"
                          sizes="(max-width: 1024px) 33vw, 240px"
                          className="w-full h-full object-contain object-center"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {c.description && <p className="text-muted-foreground leading-relaxed text-lg">{c.description}</p>}
              </div>

              {/* Price */}
              {c.priceFrom > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Стоимость этого проекта</p>
                    <p className="font-bold text-primary text-2xl">
                      {c.priceTo > 0 ? `${c.priceFrom.toLocaleString("ru")}–${c.priceTo.toLocaleString("ru")} BYN` : `от ${c.priceFrom.toLocaleString("ru")} BYN`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Точная цена — после бесплатного замера</p>
                  </div>
                  <Link href="/calculator" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shrink-0">
                    Рассчитать свой проект <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Task */}
              {c.task && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">01</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Задача клиента</h2>
                  </div>
                  <div className="card-base p-5">
                    <p className="text-muted-foreground leading-relaxed">{c.task}</p>
                  </div>
                </section>
              )}

              {/* Constraints */}
              {c.constraints && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Ограничения</h2>
                  </div>
                  <div className="card-base p-5 border-l-4 border-orange-300">
                    <p className="text-muted-foreground leading-relaxed">{c.constraints}</p>
                  </div>
                </section>
              )}

              {/* Solution */}
              {c.solution && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Наше решение</h2>
                  </div>
                  <div className="card-base p-5">
                    <p className="text-muted-foreground leading-relaxed">{c.solution}</p>
                  </div>
                </section>
              )}

              {/* Before / After */}
              {(c.photosBefore.length > 0 || c.photosAfter.length > 0) && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">До и после</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {c.photosBefore.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2 text-center uppercase tracking-wide">До</p>
                        <div className="rounded-xl overflow-hidden aspect-[4/3] bg-stone-200">
                          <Image
                            src={c.photosBefore[0]}
                            alt="До"
                            width={800}
                            height={600}
                            sizes="(max-width: 1024px) 50vw, 400px"
                            className="w-full h-full object-contain object-center"
                          />
                        </div>
                      </div>
                    )}
                    {c.photosAfter.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-primary mb-2 text-center uppercase tracking-wide">После</p>
                        <div className="rounded-xl overflow-hidden aspect-[4/3] bg-stone-200">
                          <Image
                            src={c.photosAfter[0]}
                            alt="После"
                            width={800}
                            height={600}
                            sizes="(max-width: 1024px) 50vw, 400px"
                            className="w-full h-full object-contain object-center"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Result */}
              {c.result && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Результат</h2>
                  </div>
                  <div className="card-base p-5 border-l-4 border-green-300 bg-green-50/30">
                    <p className="text-foreground leading-relaxed">{c.result}</p>
                  </div>
                </section>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Отзыв клиента</h2>
                  {reviews.map(r => (
                    <div key={r.id} className="card-base p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.city}{r.date && `, ${r.date}`}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </section>
              )}

              {/* Related */}
              {(style || materials.length > 0 || scenarios.length > 0) && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Использованные стиль и материалы</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {style && (
                      <Link href={`/styles/${style.slug}`} className="card-base p-4 flex gap-3 hover:shadow-md transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-stone-200 to-amber-100 shrink-0 overflow-hidden">
                          {style.image && <Image src={style.image} alt={style.title} width={96} height={96} sizes="48px" className="w-full h-full object-contain object-center" />}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Стиль</p>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{style.title}</p>
                          <p className="text-xs text-primary font-medium">от {style.priceFrom.toLocaleString("ru")} BYN</p>
                        </div>
                      </Link>
                    )}
                    {materials.map(m => (
                      <Link key={m.slug} href={`/materials/${m.slug}`} className="card-base p-4 flex gap-3 hover:shadow-md transition-shadow group">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-stone-200 to-stone-300 shrink-0 overflow-hidden">
                          {m.image && <Image src={m.image} alt={m.title} width={96} height={96} sizes="48px" className="w-full h-full object-contain object-center" />}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Материал</p>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{m.title}</p>
                          <p className="text-xs text-primary font-medium">от {m.priceFrom.toLocaleString("ru")} BYN</p>
                        </div>
                      </Link>
                    ))}
                    {scenarios.map(s => (
                      <Link key={s.slug} href={`/scenarios/${s.slug}`} className="card-base p-4 hover:shadow-md transition-shadow group">
                        <p className="text-xs text-muted-foreground mb-1">Сценарий</p>
                        <div className="flex items-center gap-2">
                          {s.icon && <span className="text-xl">{s.icon}</span>}
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Other cases */}
              {others.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Другие проекты</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {others.map(o => (
                      <Link key={o.slug} href={`/portfolio/${o.slug}`} className="card-base overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="h-36 bg-gradient-to-br from-stone-200 to-amber-100 overflow-hidden">
                          {o.mainImage ? <Image src={optimizedImageSrc(o.mainImage) || o.mainImage} alt={o.title} width={640} height={360} loading="lazy" sizes="(max-width: 1024px) 100vw, 320px" className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300" />
                            : <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">Фото</div>}
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-xs group-hover:text-primary transition-colors line-clamp-2">{o.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{o.city} · {o.area} п.м</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <div className="card-base p-6">
                  <h2 className="font-serif text-xl font-semibold mb-2">Хотите похожий проект?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Расскажите о вашей кухне — пришлём смету.</p>
                  <ContactForm source={`portfolio/${slug}`} />
                </div>

                {/* Technical card */}
                <div className="card-base p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Характеристики</h3>
                  {[
                    { label: "Город", value: c.city },
                    { label: "Длина гарнитура", value: `${c.area} п.м` },
                    c.layout && { label: "Планировка", value: c.layout },
                    { label: "Стиль", value: c.style },
                    { label: "Материал", value: c.material },
                    { label: "Срок", value: `${c.days} рабочих дней` },
                    c.completedAt && { label: "Завершён", value: c.completedAt },
                    c.priceFrom > 0 && { label: "Стоимость", value: c.priceTo > 0 ? `${c.priceFrom.toLocaleString("ru")}–${c.priceTo.toLocaleString("ru")} BYN` : `от ${c.priceFrom.toLocaleString("ru")} BYN`, primary: true },
                  ].filter(Boolean).map((row: any) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-medium text-right ${row.primary ? "text-primary" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="card-base p-5">
                  <h3 className="font-semibold text-sm mb-3">Другие проекты</h3>
                  {others.slice(0, 4).map(o => (
                    <Link key={o.slug} href={`/portfolio/${o.slug}`}
                      className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <span className="line-clamp-1">{o.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                    </Link>
                  ))}
                  <Link href="/portfolio" className="block text-center mt-3 text-xs text-primary hover:underline">
                    Все проекты →
                  </Link>
                </div>

                {locationPage && (
                  <div className="card-base p-5 bg-primary/5 border-primary/20">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Кухни в {c.city}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Смотрите другие проекты, цены на доставку и замер в вашем городе
                    </p>
                    <Link href={`/locations/${locationPage.slug}`}
                      className="flex items-center justify-between text-sm text-primary font-semibold hover:gap-2 transition-all gap-1">
                      {locationPage.h1 || `Кухни в ${c.city}`}
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
