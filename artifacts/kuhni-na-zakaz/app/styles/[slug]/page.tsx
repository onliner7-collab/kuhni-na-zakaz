import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/navigation/Link";
import { notFound } from "next/navigation";
import { CheckCircle, XCircle, Droplets, ArrowRight, Layers, Users, Wallet, Camera, HelpCircle, Lightbulb, Link2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { CatalogImageGallery } from "@/components/catalog/CatalogImageGallery";
import { buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { renderContent } from "@/lib/render-content";
import { getStyleEnrichment } from "@/lib/kitchen-page-enrichment";
import { breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { STYLE_FAMILY } from "@/data/exploration-families";
import { StyleFamilyPage } from "@/components/exploration/StyleFamilyPage";

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 3600;
export const dynamic = "force-static";

const STATIC_STYLE_PAGES = [
  {
    slug: "neoklassika",
    title: "Кухни в стиле неоклассика",
    headline: "Кухня неоклассика на заказ",
    description: "Неоклассическая кухня на заказ: рамочные фасады, спокойные цвета, фурнитура и расчет под размеры помещения.",
    intro: "Неоклассика подходит, когда нужна кухня с мягкой классической линией без тяжелого декора. Для расчета важны фасады, фрезеровка, столешница, ручки и техника.",
    image: "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya.webp",
    budgetLevel: "Выше среднего",
    priceFrom: 2800,
    suitableFor: ["квартиры и дома со спокойным интерьером", "проекты с рамочными фасадами", "кухни-гостиные"],
    pros: ["выглядит теплее минимализма", "хорошо сочетается с МДФ и эмалью", "долго не устаревает визуально"],
    cons: ["фрезеровка и эмаль повышают цену", "важна аккуратная фурнитура", "требует бережного ухода"],
    careGuide: ["протирать фасады мягкой тканью", "не использовать абразивы", "сразу убирать жир и влагу"],
    pairsWith: ["МДФ эмаль", "шпон", "каменная столешница", "ручки в спокойном металле"],
    relatedMaterials: ["mdf-fasady", "mdf-emal", "shpon"],
  },
  {
    slug: "hay-tek",
    title: "Кухни в стиле хай-тек",
    headline: "Кухня хай-тек на заказ",
    description: "Кухня хай-тек: ровные фасады, техника, подсветка, практичные материалы и расчет под размеры.",
    intro: "Хай-тек строится на ровных линиях, технике, подсветке и функциональности. До расчета важно понять, какая техника будет встроена и где нужны розетки.",
    image: "/uploads/seo-showcase/kuhnya-plastik-hpl-1.webp",
    budgetLevel: "Выше среднего",
    priceFrom: 3000,
    suitableFor: ["современные квартиры", "кухни-гостиные", "проекты со встроенной техникой"],
    pros: ["удобно интегрировать технику", "легко поддерживать строгий вид", "хорошо работает с подсветкой"],
    cons: ["ошибки монтажа заметны", "дешевая фурнитура портит впечатление", "глянец требует ухода"],
    careGuide: ["выбирать неабразивную химию", "следить за отпечатками", "проверять вентиляцию техники"],
    pairsWith: ["HPL", "акрил", "профиль без ручек", "LED-подсветка"],
    relatedMaterials: ["plastik-hpl", "akril", "furnitura"],
  },
  {
    slug: "provans",
    title: "Кухни в стиле прованс",
    headline: "Кухня прованс на заказ",
    description: "Кухня прованс на заказ: светлые фасады, уютные детали, материалы и расчет под помещение.",
    intro: "Прованс лучше раскрывается в светлых фасадах, мягких оттенках и аккуратных декоративных деталях. Важно не перегрузить кухню декором.",
    image: "/uploads/seo-showcase/kuhnya-neoklassika-1.webp",
    budgetLevel: "Средний",
    priceFrom: 2400,
    suitableFor: ["частные дома", "светлые квартиры", "уютные семейные кухни"],
    pros: ["теплый визуальный образ", "много вариантов ручек и фасадов", "подходит для светлых интерьеров"],
    cons: ["декор усложняет уход", "важно не переборщить с деталями", "не всегда подходит маленьким кухням"],
    careGuide: ["протирать фасады без жестких губок", "беречь фрезеровку от влаги", "проверять ручки и петли"],
    pairsWith: ["МДФ фасады", "эмаль", "светлая столешница", "витринные элементы"],
    relatedMaterials: ["mdf-fasady", "mdf-emal"],
  },
  {
    slug: "loft",
    title: "Кухни в стиле лофт",
    headline: "Кухня лофт на заказ",
    description: "Кухня лофт: темные фасады, дерево, металл, открытые акценты и расчет под размеры.",
    intro: "Лофт хорошо работает в кухнях-гостиных, где нужны выразительные материалы и спокойная практичная компоновка без лишнего декора.",
    image: "/uploads/seo-showcase/home-hero-dark-kitchen-2026.webp",
    budgetLevel: "Средний",
    priceFrom: 2600,
    suitableFor: ["кухни-гостиные", "частные дома", "современные квартиры"],
    pros: ["выразительный вид", "хорошо сочетается с деревом", "практичен в темных оттенках"],
    cons: ["темные фасады требуют света", "металл и открытые элементы нужно дозировать", "важна аккуратная подсветка"],
    careGuide: ["убирать следы на темных фасадах", "следить за стыками столешницы", "подбирать мягкое освещение"],
    pairsWith: ["HPL", "шпон", "темная столешница", "черная фурнитура"],
    relatedMaterials: ["plastik-hpl", "shpon", "furnitura"],
  },
  {
    slug: "sovremennye",
    title: "Современные кухни",
    headline: "Современная кухня на заказ",
    description: "Современная кухня на заказ: ровные фасады, хранение, встроенная техника и расчет под размеры.",
    intro: "Современный стиль закрывает большинство практичных задач: ровные фасады, удобное хранение, встроенная техника и спокойная палитра.",
    image: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    budgetLevel: "Средний",
    priceFrom: 2200,
    suitableFor: ["квартиры", "студии", "новостройки", "кухни-гостиные"],
    pros: ["универсальный вид", "много материалов на выбор", "легко адаптировать под бюджет"],
    cons: ["слишком простая комплектация может выглядеть бедно", "нужна точная эргономика", "фурнитура сильно влияет на комфорт"],
    careGuide: ["выбирать практичные фасады", "закладывать хранение заранее", "не экономить на часто используемых ящиках"],
    pairsWith: ["ЛДСП", "МДФ", "HPL", "фурнитура с доводчиками"],
    relatedMaterials: ["ldsp", "mdf-fasady", "plastik-hpl", "furnitura"],
  },
  {
    slug: "skandinavskie",
    title: "Скандинавские кухни",
    headline: "Скандинавская кухня на заказ",
    description: "Скандинавская кухня: светлые фасады, дерево, простые формы, хранение и расчет под размеры.",
    intro: "Скандинавский стиль подходит для небольших и средних кухонь: светлые фасады, древесные фактуры и простая эргономика.",
    image: "/uploads/seo-showcase/kuhnya-skandi-svetlaya-1.avif",
    budgetLevel: "Средний",
    priceFrom: 2000,
    suitableFor: ["маленькие кухни", "студии", "семейные квартиры"],
    pros: ["визуально облегчает помещение", "хорошо сочетается с деревом", "можно собрать в умеренном бюджете"],
    cons: ["светлые фасады требуют ухода", "важно продумать хранение", "декор лучше держать минимальным"],
    careGuide: ["протирать светлые фасады регулярно", "использовать практичную столешницу", "закладывать закрытое хранение"],
    pairsWith: ["ЛДСП", "МДФ", "светлая столешница", "деревянные декоры"],
    relatedMaterials: ["ldsp", "mdf-fasady"],
  },
  {
    slug: "klassicheskie",
    title: "Классические кухни",
    headline: "Классическая кухня на заказ",
    description: "Классическая кухня на заказ: фасады, фрезеровка, витрины, ручки и расчет под размеры.",
    intro: "Классический стиль уместен там, где нужны симметрия, спокойные фасады и более традиционный вид кухни.",
    image: "/uploads/seo-showcase/kuhnya-neoklassika-1.avif",
    budgetLevel: "Выше среднего",
    priceFrom: 3000,
    suitableFor: ["просторные кухни", "частные дома", "интерьеры с классической мебелью"],
    pros: ["солидный вид", "много декоративных решений", "хорошо работает с эмалью"],
    cons: ["декор повышает стоимость", "требует места", "сложнее в уходе"],
    careGuide: ["бережно ухаживать за фрезеровкой", "не перегружать витринами", "проверять качество ручек"],
    pairsWith: ["МДФ эмаль", "шпон", "витрины", "декоративные ручки"],
    relatedMaterials: ["mdf-emal", "shpon", "mdf-fasady"],
  },
  {
    slug: "minimalizm",
    title: "Кухни в стиле минимализм",
    headline: "Кухня минимализм на заказ",
    description: "Кухня минимализм: ровные фасады, скрытые ручки, хранение, встроенная техника и расчет под размеры.",
    intro: "Минимализм требует точного проекта: ровные плоскости, скрытое хранение, встроенная техника и аккуратные зазоры.",
    image: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    budgetLevel: "Средний",
    priceFrom: 2400,
    suitableFor: ["современные квартиры", "студии", "кухни-гостиные"],
    pros: ["чистый визуальный ряд", "меньше визуального шума", "хорошо сочетается с техникой"],
    cons: ["требует точного монтажа", "все зазоры заметны", "нужно продумать скрытое хранение"],
    careGuide: ["выбирать практичные матовые фасады", "следить за профилями", "не перегружать открытыми полками"],
    pairsWith: ["HPL", "акрил", "профиль без ручек", "встроенная техника"],
    relatedMaterials: ["plastik-hpl", "akril", "furnitura"],
  },
].map((style, index) => ({
  id: -(index + 1),
  externalId: null,
  content: "",
  relatedCaseSlugs: [],
  relatedScenarioSlugs: [],
  seoTitle: style.headline,
  seoDescription: style.description,
  seoKeywords: "",
  order: index + 1,
  published: true,
  updatedAt: new Date("2026-05-11T00:00:00.000Z"),
  ...style,
}));

const STATIC_STYLE_BY_SLUG = new Map(STATIC_STYLE_PAGES.map((style) => [style.slug, style]));

async function getStyle(slug: string) {
  if (!isPublicContentSlug(slug)) return null;

  try {
    return (await prisma.stylePage.findFirst({ where: { slug, published: true } })) ?? STATIC_STYLE_BY_SLUG.get(slug) ?? null;
  } catch {
    return STATIC_STYLE_BY_SLUG.get(slug) ?? null;
  }
}

async function getRelatedData(s: Awaited<ReturnType<typeof getStyle>>) {
  if (!s) return { materials: [], scenarios: [], cases: [] };
  try {
    const [materials, scenarios, cases] = await Promise.all([
      s.relatedMaterials.length > 0
        ? prisma.materialPage.findMany({ where: { slug: { in: s.relatedMaterials }, published: true } })
        : Promise.resolve([]),
      s.relatedScenarioSlugs.length > 0
        ? prisma.scenarioPage.findMany({
            where: { slug: { in: s.relatedScenarioSlugs }, published: true },
            select: { slug: true, icon: true, title: true, intro: true, seoDescription: true },
          })
        : Promise.resolve([]),
      s.relatedCaseSlugs.length > 0
        ? prisma.portfolioCase.findMany({
            where: { slug: { in: s.relatedCaseSlugs }, published: true },
            select: { id: true, slug: true, title: true, city: true, area: true, priceFrom: true, mainImage: true, style: true, days: true },
          })
        : Promise.resolve([]),
    ]);
    return { materials, scenarios, cases };
  } catch { return { materials: [], scenarios: [], cases: [] }; }
}

async function getOtherStyles(currentSlug: string) {
  try {
    return await prisma.stylePage.findMany({
      where: { published: true, slug: { ...publicSlugWhere(), not: currentSlug } },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      take: 5,
      select: { slug: true, title: true },
    });
  } catch {
    return STATIC_STYLE_PAGES.filter((style) => style.slug !== currentSlug)
      .slice(0, 5)
      .map((style) => ({ slug: style.slug, title: style.title }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const family = STYLE_FAMILY[slug];
  if (family) {
    const image = family.media[0];
    return {
      title: family.title,
      description: family.description,
      alternates: { canonical: `/styles/${slug}` },
      openGraph: buildOpenGraph(`/styles/${slug}`, family.title, family.description, { images: [{ url: image.avif || image.webp, alt: image.alt }] }),
      twitter: buildTwitterMetadata(family.title, family.description, image.avif || image.webp),
    };
  }
  const s = await getStyle(slug);
  if (!s) return { title: "Стиль кухни" };
  const title = cleanSeoTitle(s.seoTitle, s.title);
  const description = trimMetaDescription(s.seoDescription, s.description);
  const image = s.image ? [{ url: s.image, alt: s.title }] : undefined;
  return {
    title,
    description,
    keywords: s.seoKeywords || undefined,
    alternates: { canonical: `/styles/${slug}` },
    openGraph: buildOpenGraph(`/styles/${slug}`, title, description, { images: image }),
    twitter: buildTwitterMetadata(title, description, s.image || undefined),
  };
}

export default async function StylePage({ params }: Props) {
  const { slug } = await params;
  const family = STYLE_FAMILY[slug];
  if (family) {
    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: family.h1,
      name: family.title,
      description: family.description,
      url: siteUrl(`/styles/${slug}`),
      inLanguage: "ru-BY",
    };
    const familyBreadcrumbJsonLd = breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Стили", path: "/styles" },
      { name: family.h1, path: `/styles/${slug}` },
    ]);

    return (
      <>
        {family.visualFrames?.[0]?.avif ? (
          <link
            rel="preload"
            as="image"
            href={family.visualFrames[0].avif}
            type="image/avif"
            fetchPriority="high"
          />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyBreadcrumbJsonLd) }} />
        <StyleFamilyPage config={family} />
      </>
    );
  }
  const s = await getStyle(slug);
  if (!s) notFound();
  const heroImage = slug === "neoklassika" ? "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya.webp" : s.image;
  const neoclassicProjectImages = [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya.webp",
      alt: "3D-визуализация неоклассической кухни со светлыми фасадами",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya-rakurs-1.webp",
      alt: "3D-визуализация неоклассической кухни, вид на рабочую зону слева",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya-rakurs-2.webp",
      alt: "3D-визуализация неоклассической кухни с обеденной зоной",
    },
  ];
  const neoclassicExampleImages = [
    {
      src: "/uploads/seo-showcase/kuhnya-neoklassika-1.webp",
      alt: "Дополнительный пример кухни в стиле неоклассика",
    },
    {
      src: "/uploads/seo-showcase/portfolio-vitebsk-neoklassika-1.webp",
      alt: "Дополнительный пример светлой неоклассической кухни",
    },
  ];
  const [{ materials, scenarios, cases }, otherStyles] = await Promise.all([
    getRelatedData(s),
    getOtherStyles(slug),
  ]);
  const enrichment = getStyleEnrichment(slug, s.title, s.priceFrom);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.headline || s.title,
    description: s.seoDescription || s.description,
    name: s.title,
    url: siteUrl(`/styles/${slug}`),
  };
  const styleBreadcrumbJsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Стили", path: "/styles" },
    { name: s.title, path: `/styles/${slug}` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(styleBreadcrumbJsonLd) }} />

      <div className="section-padding">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <Link href="/styles" className="hover:text-primary">Стили кухонь</Link><span>/</span>
            <span className="text-foreground">{s.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Hero */}
              <div>
                {s.budgetLevel && (
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                    {s.budgetLevel} сегмент
                  </span>
                )}
                <h1 className="font-serif text-4xl font-bold mb-4 leading-tight">
                  {s.headline || s.title}
                </h1>
                {slug === "neoklassika" ? (
                  <CatalogImageGallery
                    title={s.title}
                    projectImages={neoclassicProjectImages}
                    exampleImages={neoclassicExampleImages}
                  />
                ) : (
                  <div className="h-72 bg-gradient-to-br from-stone-200 to-amber-100 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                    {heroImage ? (
                      <Image
                        src={heroImage}
                        alt={s.title}
                        width={1280}
                        height={720}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="w-full h-full object-contain object-center"
                      />
                    ) : (
                      <span className="text-stone-400">Фото стиля</span>
                    )}
                  </div>
                )}
                {s.intro && (
                  <p className="text-muted-foreground leading-relaxed text-lg">{s.intro}</p>
                )}
                {s.content && !s.intro && (
                  <p className="text-muted-foreground leading-relaxed">{s.content}</p>
                )}
              </div>

              {slug === "provans" && (
                <section className="rounded-2xl border border-border bg-white p-6">
                  <h2 className="font-serif text-2xl font-bold mb-4">Кухня прованс: покупка и расчет</h2>
                  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      Если нужен запрос кухня прованс купить Минск, сначала сравните фасады, фурнитуру,
                      столешницу и декор: стиль должен быть уютным, но не перегруженным. В Минске такую кухню
                      можно купить после замера и согласования материалов.
                    </p>
                    <p>
                      Мы помогаем купить кухню в стиле прованс под квартиру, дом или дачу: показываем примеры,
                      считаем цену и объясняем, какие элементы лучше заказать сразу, а какие можно упростить.
                    </p>
                  </div>
                </section>
              )}

              {s.content && s.intro && (
                <section className="prose prose-stone max-w-none rounded-2xl border border-border bg-white p-6">
                  {renderContent(s.content)}
                </section>
              )}

              {/* Price block */}
              {s.priceFrom > 0 && (
                <div id="style-prices" className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary text-lg">от {s.priceFrom.toLocaleString("ru")} BYN</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Точная цена — после замера и согласования условий</p>
                  </div>
                  <Link href="/calculator" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
                    Рассчитать стоимость <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <section id="style-projects">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold">Как спроектировать без шаблона</h2>
                </div>
                <div className="card-base p-5 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{enrichment.angle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {enrichment.selectionTips.map((tip, i) => (
                      <div key={i} className="rounded-xl bg-violet-50/70 border border-violet-100 p-4 text-sm text-foreground leading-relaxed">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl font-bold mb-4">Что влияет на цену</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {enrichment.priceNotes.map((note, i) => (
                    <div key={i} className="card-base p-4">
                      <span className="text-xs font-semibold text-primary">Фактор {i + 1}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">{note}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Кому подходит */}
              {s.suitableFor.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Кому подходит</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.suitableFor.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                        <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Плюсы и минусы */}
              {(s.pros.length > 0 || s.cons.length > 0) && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Плюсы и минусы</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {s.pros.length > 0 && (
                      <div className="card-base p-5">
                        <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" /> Преимущества
                        </h3>
                        <ul className="space-y-2.5">
                          {s.pros.map((p, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">{i + 1}</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {s.cons.length > 0 && (
                      <div className="card-base p-5">
                        <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5" /> Недостатки
                        </h3>
                        <ul className="space-y-2.5">
                          {s.cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Уход */}
              {s.careGuide.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                      <Droplets className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Советы по уходу</h2>
                  </div>
                  <div className="card-base p-5">
                    <ul className="space-y-3">
                      {s.careGuide.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                          <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs flex items-center justify-center shrink-0 font-semibold">{i + 1}</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* Сочетается с */}
              {s.pairsWith.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold">Сочетается с</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {s.pairsWith.map((item, i) => (
                      <span key={i} className="px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-sm text-amber-800">{item}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Реальные работы в этом стиле */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-rose-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold">Фото и кейсы: на что смотреть</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enrichment.photoBrief.map((item, i) => (
                    <div key={i} className="rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground leading-relaxed">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {cases.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-2xl font-bold">Наши работы в этом стиле</h2>
                    <Link href={`/portfolio?style=${slug}`} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                      Все работы <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {cases.map((c) => (
                      <Link key={c.slug} href={`/portfolio/${c.slug}`}
                        className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all bg-white">
                        <div className="h-44 overflow-hidden bg-gradient-to-br from-stone-100 to-violet-50">
                          {c.mainImage
                            ? <Image src={c.mainImage} alt={c.title} width={720} height={480} loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500" />
                            : <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl">🏠</div>
                          }
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors mb-1 line-clamp-2">{c.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {c.city && <span>{c.city}</span>}
                            {c.area > 0 && <span>{c.area} п.м</span>}
                            {c.days > 0 && <span>{c.days} дн.</span>}
                          </div>
                          {c.priceFrom > 0 && (
                            <p className="text-primary font-semibold text-sm mt-1">от {c.priceFrom.toLocaleString("ru")} BYN</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Рекомендуемые материалы */}
              {materials.length > 0 && (
                <section id="style-materials">
                  <h2 className="font-serif text-2xl font-bold mb-4">Рекомендуемые материалы</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {materials.map((m) => (
                      <Link key={m.slug} href={`/materials/${m.slug}`}
                        className="card-base p-4 flex gap-4 hover:shadow-md transition-shadow group">
                        <div className="w-16 h-16 bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg shrink-0 overflow-hidden">
                          {m.image && <Image src={m.image} alt={m.title} width={128} height={128} loading="lazy" sizes="64px" className="w-full h-full object-contain object-center" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{m.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>
                          <p className="text-xs text-primary font-medium mt-1">от {m.priceFrom.toLocaleString("ru")} BYN</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Сценарии */}
              {scenarios.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl font-bold mb-4">Подходящие сценарии</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scenarios.map((sc) => (
                      <Link key={sc.slug} href={`/scenarios/${sc.slug}`}
                        className="card-base p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-3 mb-2">
                          {sc.icon && <span className="text-2xl">{sc.icon}</span>}
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{sc.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{sc.intro || sc.seoDescription}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold">FAQ по этому стилю</h2>
                </div>
                <div className="space-y-3">
                  {enrichment.faq.map((item, i) => (
                    <details key={i} className="group card-base p-5" open={i === 0}>
                      <summary className="cursor-pointer list-none font-semibold flex items-start justify-between gap-4">
                        <span>{item.question}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform shrink-0 mt-1" />
                      </summary>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold">Куда перейти дальше</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enrichment.internalLinks.map((item) => (
                    <Link key={`${item.href}-${item.label}`} href={item.href} className="card-base p-4 hover:shadow-md transition-shadow group">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center justify-between gap-3">
                        {item.label}
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <div id="form" className="card-base p-6">
                  <h2 className="font-serif text-xl font-semibold mb-4">Заказать замер</h2>
                  <p className="text-sm text-muted-foreground mb-4">Условия замера уточняются при заявке. Выезд согласуем по адресу.</p>
                  <ContactForm source={`styles/${slug}`} />
                </div>

                {/* Quick info */}
                <div className="card-base p-5 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Быстрые факты</h3>
                  {s.budgetLevel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Сегмент</span>
                      <span className="font-medium">{s.budgetLevel}</span>
                    </div>
                  )}
                  {s.priceFrom > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Цена от</span>
                      <span className="font-medium text-primary">{s.priceFrom.toLocaleString("ru")} BYN</span>
                    </div>
                  )}
                  {materials.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Материалы</span>
                      <span className="font-medium">{materials.length} варианта</span>
                    </div>
                  )}
                </div>
                {otherStyles.length > 0 && (
                  <div className="card-base p-5">
                    <h3 className="font-semibold text-sm mb-3">Другие стили</h3>
                    <div className="space-y-1">
                      {otherStyles.map((item) => (
                        <Link key={item.slug} href={`/styles/${item.slug}`}
                          className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          {item.title}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
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
