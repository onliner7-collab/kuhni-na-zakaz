import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "@/components/navigation/Link";
import { ArrowRight, CheckCircle, Lightbulb, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { STATIC_SCENARIO_FALLBACKS, getStaticScenarioFallback } from "@/data/scenario-fallbacks";
import { SCENARIO_FAMILY } from "@/data/exploration-families";
import { ScenarioFamilyPage } from "@/components/exploration/ScenarioFamilyPage";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const SECONDARY_SCENARIO_CANONICALS: Record<string, string> = {
  "kuhnya-dlya-studii": "/scenarios/dlya-studii",
  "kuhnya-do-potolka": "/catalog/kuhni-do-potolka",
  "kuhnya-s-ostrovom": "/catalog/kuhni-s-ostrovom",
  "kuhnya-bez-ruchek": "/catalog/kuhni-bez-ruchek",
};

const SCENARIO_LANDING_GUIDES: Record<string, {
  planning: string[];
  materials: string[];
  budget: string;
  mistakes: string[];
  faq: { question: string; answer: string }[];
}> = {
  "dlya-semi": {
    planning: [
      "разделить хранение на ежедневную посуду, запасы, детские вещи и редко используемую технику",
      "оставить безопасные проходы и не ставить острые ручки в зоне активного движения",
      "заранее определить место посудомойки, мусорной системы и большой рабочей поверхности",
    ],
    materials: [
      "матовые фасады МДФ, пластик или ЛДСП с практичной фактурой",
      "направляющие полного выдвижения и доводчики на ящиках с ежедневной нагрузкой",
      "столешница HPL или качественный постформинг для простой уборки",
    ],
    budget: "Семейная кухня чаще дорожает из-за количества ящиков, высоких пеналов и встроенной техники. Экономить лучше на декоративных деталях, а не на фурнитуре ежедневного пользования.",
    mistakes: [
      "делать слишком мало закрытого хранения и оставлять технику на столешнице",
      "выбирать глянец без учета следов от рук и детской активности",
      "не закладывать место для сортировки, запасов и крупной посуды",
    ],
    faq: [
      { question: "Какая кухня удобнее для семьи с детьми?", answer: "Обычно лучше работают закрытые нижние ящики, доводчики, стойкие фасады и понятная рабочая зона между мойкой и плитой." },
      { question: "Можно ли сделать семейную кухню недорого?", answer: "Да, если выбрать простую форму, ЛДСП или практичный МДФ и оставить бюджет на хорошие ящики в самых используемых местах." },
    ],
  },
  "byudzhetnaya-kuhnya": {
    planning: [
      "оставить простую прямую или угловую форму без дорогих радиусов и сложных стыков",
      "сначала рассчитать обязательные модули, а декоративные элементы добавлять только после сметы",
      "использовать стандартные размеры там, где это не ухудшает посадку кухни",
    ],
    materials: [
      "ЛДСП для корпуса и простых фасадов, если нужен честный стартовый бюджет",
      "постформинг для столешницы вместо дорогого камня на первом этапе",
      "базовые петли и направляющие с доводчиками в самых важных ящиках",
    ],
    budget: "Бюджетная кухня не означает случайный набор модулей. Главная экономия — простая геометрия, рациональные материалы и отказ от механизмов, которыми редко пользуются.",
    mistakes: [
      "экономить на кромке, крепеже и зоне мойки",
      "покупать модули без проверки стен, труб и вентиляции",
      "сравнивать только цену за метр без состава фурнитуры и монтажа",
    ],
    faq: [
      { question: "От чего сильнее всего зависит цена бюджетной кухни?", answer: "От формы, длины, количества ящиков, фасадов, столешницы, фурнитуры и сложности монтажа." },
      { question: "Можно ли потом улучшить такую кухню?", answer: "Часть решений можно обновить позже, но корпус, размеры, мойку и технику лучше продумать сразу." },
    ],
  },
  "dlya-malenkoy-kuhni": {
    planning: [
      "использовать высоту до потолка, если нужно больше хранения без расширения кухни",
      "выбирать технику компактного размера и заранее считать открывание дверей",
      "оставлять рабочую поверхность между мойкой и плитой, даже если кухня маленькая",
    ],
    materials: [
      "светлые матовые фасады или спокойные древесные фактуры без визуального шума",
      "узкие карго, выдвижные ящики и органайзеры вместо глубоких пустых полок",
      "тонкая практичная столешница и фартук, который легко мыть",
    ],
    budget: "В маленькой кухне цена растет не из-за метров, а из-за плотной комплектации: пеналов, выдвижных систем, встроенной техники и точной подгонки к стенам.",
    mistakes: [
      "ставить слишком крупную технику и терять рабочую поверхность",
      "делать много открытых полок, которые быстро создают визуальный беспорядок",
      "забывать про вентиляцию, розетки и доступ к счетчикам",
    ],
    faq: [
      { question: "Какая планировка лучше для маленькой кухни?", answer: "Чаще всего прямая или компактная угловая. Выбор зависит от коммуникаций, окна, двери и места под холодильник." },
      { question: "Стоит ли делать шкафы до потолка?", answer: "Да, если нужно хранение. Но важно проверить высоту, вентиляцию и доступ к верхним секциям." },
    ],
  },
  "dlya-studii": {
    planning: [
      "сделать кухню визуально спокойной, потому что она постоянно видна из жилой зоны",
      "спрятать хранение, вытяжку и мелкую технику за закрытыми фасадами",
      "продумать шум, запахи, свет и место для обеденной группы",
    ],
    materials: [
      "матовые фасады, древесные ниши и скрытые ручки для цельного вида",
      "столешница и фартук без сложного ухода, особенно рядом с диваном или рабочим местом",
      "доводчики и качественные направляющие, чтобы кухня не мешала жилой зоне",
    ],
    budget: "Кухня для студии может быть компактной, но требует аккуратной деталировки: видимые боковины, подсветка, вытяжка и встроенная техника часто важнее лишних модулей.",
    mistakes: [
      "делать кухонный гарнитур слишком ярким и перегружать маленькое пространство",
      "оставлять вытяжку и технику без проверки шума",
      "не предусмотреть место для хранения ежедневных вещей вне столешницы",
    ],
    faq: [
      { question: "Как сделать кухню в студии незаметной?", answer: "Помогают гладкие фасады, скрытые ручки, закрытое хранение и цвет, близкий к отделке комнаты." },
      { question: "Нужна ли мощная вытяжка?", answer: "Да, но важно смотреть не только мощность, а также шум, вывод вентиляции и режим готовки." },
    ],
  },
  "dlya-gotovki": {
    planning: [
      "собрать рабочий треугольник без лишних шагов между мойкой, плитой и холодильником",
      "заложить широкие ящики для посуды, кастрюль, специй и кухонных приборов",
      "оставить большую непрерывную рабочую поверхность для подготовки продуктов",
    ],
    materials: [
      "износостойкая столешница HPL, компакт-плита или другой материал под активную готовку",
      "практичные фасады, которые легко очищать от следов и пара",
      "направляющие полного выдвижения, подъемники и доводчики в зонах ежедневной нагрузки",
    ],
    budget: "Для активной готовки разумно вкладываться в столешницу, фурнитуру и удобные ящики. Декор можно упростить, если он не влияет на сценарий пользования.",
    mistakes: [
      "делать мало розеток и ставить технику далеко от рабочей зоны",
      "экономить на ящиках, которыми пользуются каждый день",
      "разрывать рабочую поверхность высоким пеналом или техникой",
    ],
    faq: [
      { question: "Что важнее всего для кухни, где много готовят?", answer: "Рабочая поверхность, удобные ящики, стойкая столешница, хорошая вытяжка и правильное расположение мойки, плиты и холодильника." },
      { question: "Какие фасады практичнее?", answer: "Матовые МДФ, пластик или HPL обычно проще в уходе, чем капризный глянец и сложные фактуры." },
    ],
  },
  "do-potolka": {
    planning: [
      "проверить высоту потолка, вентиляцию, перепады стен и место для верхних доборов",
      "разделить верхние секции на ежедневные и редкие зоны хранения",
      "заранее продумать доступ к верхним шкафам и визуальную легкость фасадов",
    ],
    materials: [
      "ровные фасады МДФ, ЛДСП или пластик без лишнего дробления по высоте",
      "надежные петли и подъемники для высоких верхних секций",
      "доборы и карнизы под реальную геометрию потолка",
    ],
    budget: "Кухня до потолка дороже из-за дополнительных фасадов, корпуса, доборов и точной подгонки. Зато она дает больше хранения и выглядит собраннее.",
    mistakes: [
      "не проверить кривизну потолка до запуска в производство",
      "делать слишком темные высокие фасады в маленьком помещении",
      "забывать про вентиляцию, трубы и доступ к техническим зонам",
    ],
    faq: [
      { question: "Всегда ли кухня до потолка лучше обычной?", answer: "Нет. Она хороша, когда нужно хранение и есть возможность аккуратно решить доборы, вентиляцию и доступ к верхним секциям." },
      { question: "Как снизить цену кухни до потолка?", answer: "Упростить фасады, отказаться от дорогих механизмов в редких секциях и оставить качественную фурнитуру в ежедневных модулях." },
    ],
  },
  "s-ostrovom": {
    planning: [
      "проверить проходы вокруг острова, чтобы дверцы и ящики открывались без конфликта",
      "решить, нужен ли остров для готовки, хранения, мойки, варочной поверхности или посадки",
      "заранее продумать электрику, вытяжку, подсветку и покрытие пола",
    ],
    materials: [
      "износостойкая столешница, потому что остров часто становится главной рабочей зоной",
      "фасады, которые согласуются с кухней-гостиной и видны со всех сторон",
      "надежные ящики и механизмы для хранения посуды, приборов и техники",
    ],
    budget: "Остров увеличивает стоимость за счет дополнительных модулей, столешницы, электрики, видимых боковин и монтажа. Его стоит делать, когда проходы и сценарий действительно это поддерживают.",
    mistakes: [
      "ставить остров в помещении, где не хватает проходов",
      "не предусмотреть розетки и подсветку",
      "делать остров только ради картинки, без понятной функции",
    ],
    faq: [
      { question: "Сколько места нужно для кухни с островом?", answer: "Желательно оставить комфортные проходы вокруг острова. Точный размер зависит от дверей, техники, ящиков и посадочных мест." },
      { question: "Можно ли сделать остров в квартире?", answer: "Можно, если позволяют площадь, проходы, электрика и сценарий кухни-гостиной." },
    ],
  },
};

const SCENARIO_CATALOG_CTA: Record<string, {
  href: string;
  title: string;
  text: string;
  label: string;
}> = {
  "s-ostrovom": {
    href: "/catalog/kuhni-s-ostrovom",
    title: "Если остров подходит — переходите к расчету",
    text: "Эта страница помогает понять проходы, функции и ограничения. Коммерческие варианты, цена от, фото и заявка собраны на странице кухонь с островом.",
    label: "Смотреть кухни с островом",
  },
  "do-potolka": {
    href: "/catalog/kuhni-do-potolka",
    title: "Если нужен высокий гарнитур — смотрите каталог",
    text: "Здесь разобраны плюсы, ограничения и ошибки. Купить кухню до потолка, посмотреть цену от и отправить заявку можно на отдельной коммерческой странице.",
    label: "Смотреть кухни до потолка",
  },
  "dlya-malenkoy-kuhni": {
    href: "/catalog/malenkie-kuhni",
    title: "Если формат понятен — переходите к маленьким кухням",
    text: "Сценарий помогает выбрать решения для компактного помещения, а коммерческая страница показывает цены, фото, материалы и форму расчета.",
    label: "Смотреть маленькие кухни",
  },
};

const DEFAULT_SCENARIO_GUIDE = {
  planning: [
    "начать с размеров, коммуникаций, техники и того, как вы готовите каждый день",
    "сравнить простую, угловую и высокую компоновку до выбора фасадов",
    "сразу проверить хранение, проходы, свет, розетки и доступ к важным зонам",
  ],
  materials: [
    "корпус ЛДСП с качественной кромкой для базовой прочности",
    "фасады МДФ, пластик, HPL или ЛДСП под бюджет и уход",
    "фурнитура с доводчиками в модулях ежедневного пользования",
  ],
  budget: "Финальная цена зависит от формы кухни, размеров, фасадов, столешницы, фурнитуры, доставки и монтажа. После замера смету можно упростить без потери главной функции.",
  mistakes: [
    "выбирать фасады до проверки планировки и техники",
    "сравнивать предложения без состава материалов и фурнитуры",
    "не учитывать монтаж, доставку, подсветку и подготовку помещения",
  ],
  faq: [
    { question: "С чего начать выбор кухни?", answer: "С размеров, коммуникаций, техники, бюджета и сценария: кто готовит, сколько нужно хранения и как часто кухня используется." },
    { question: "Когда можно назвать точную цену?", answer: "После замера и согласования материалов, фурнитуры, столешницы, техники и условий монтажа." },
  ],
};

function getScenarioGuide(slug: string) {
  return SCENARIO_LANDING_GUIDES[slug] ?? DEFAULT_SCENARIO_GUIDE;
}

function buildScenarioMetaTitle(scenario: { title: string; seoTitle: string | null; slug: string }) {
  const fallback = `${scenario.title} под размер в Минске`;
  const cleaned = cleanSeoTitle(scenario.seoTitle, fallback);
  return cleaned.length < 30 ? fallback : cleaned;
}

async function getScenario(slug: string) {
  if (!isPublicContentSlug(slug)) return null;

  try {
    return (await prisma.scenarioPage.findFirst({ where: { slug, published: true } })) ?? getStaticScenarioFallback(slug);
  } catch { return getStaticScenarioFallback(slug); }
}

async function getRelatedData(scenario: {
  relatedCaseSlugs: string[];
  relatedStyles: string[];
  relatedMaterials: string[];
}) {
  try {
    const [cases, styles, materials] = await Promise.all([
      scenario.relatedCaseSlugs.length > 0
        ? prisma.portfolioCase.findMany({
            where: { slug: { in: scenario.relatedCaseSlugs }, published: true },
            select: { id: true, slug: true, title: true, city: true, area: true, priceFrom: true, priceTo: true, mainImage: true, style: true },
          })
        : [],
      scenario.relatedStyles.length > 0
        ? prisma.stylePage.findMany({
            where: { slug: { in: scenario.relatedStyles }, published: true },
            select: { id: true, slug: true, title: true, description: true, image: true, priceFrom: true },
          })
        : [],
      scenario.relatedMaterials.length > 0
        ? prisma.materialPage.findMany({
            where: { slug: { in: scenario.relatedMaterials }, published: true },
            select: { id: true, slug: true, title: true, description: true, image: true, priceFrom: true },
          })
        : [],
    ]);
    return { cases, styles, materials };
  } catch { return { cases: [], styles: [], materials: [] }; }
}

export async function generateStaticParams() {
  try {
    const scenarios = await prisma.scenarioPage.findMany({ where: { published: true, slug: publicSlugWhere() }, select: { slug: true } });
    const slugs = new Set([...Object.keys(SCENARIO_FAMILY), ...STATIC_SCENARIO_FALLBACKS.map((item) => item.slug), ...scenarios.map((item) => item.slug)]);
    return Array.from(slugs).filter(isPublicContentSlug).map((slug) => ({ slug }));
  } catch { return Array.from(new Set([...Object.keys(SCENARIO_FAMILY), ...STATIC_SCENARIO_FALLBACKS.map((item) => item.slug)])).map((slug) => ({ slug })); }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const family = SCENARIO_FAMILY[slug];
  if (family) {
    return {
      title: family.title,
      description: family.description,
      alternates: { canonical: `/scenarios/${slug}` },
      openGraph: buildOpenGraph(`/scenarios/${slug}`, family.title, family.description, { images: [{ url: family.visual.avif || family.visual.webp, alt: family.visual.alt }] }),
      twitter: buildTwitterMetadata(family.title, family.description, family.visual.avif || family.visual.webp),
      robots: { index: true, follow: true },
    };
  }
  const s = await getScenario(slug);
  if (!s) return { title: "Сценарий не найден" };
  const canonical = SECONDARY_SCENARIO_CANONICALS[s.slug] ?? `/scenarios/${s.slug}`;
  const isSecondaryScenario = Boolean(SECONDARY_SCENARIO_CANONICALS[s.slug]);
  const title = isSecondaryScenario
    ? cleanSeoTitle(null, `${s.title} — дополнительный сценарий кухни`)
    : buildScenarioMetaTitle(s);
  const description = trimMetaDescription(
    isSecondaryScenario ? null : s.seoDescription,
    isSecondaryScenario ? `${s.intro} Основная индексируемая версия страницы указана через canonical.` : s.intro,
  );

  return {
    title,
    description,
    keywords: s.seoKeywords || undefined,
    alternates: { canonical },
    openGraph: buildOpenGraph(canonical, title, description, { type: "article" }),
    twitter: buildTwitterMetadata(title, description),
    robots: isSecondaryScenario
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function ScenarioDetailPage({ params }: Props) {
  const { slug } = await params;
  const family = SCENARIO_FAMILY[slug];
  if (family) {
    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: family.h1,
      name: family.title,
      description: family.description,
      url: siteUrl(`/scenarios/${slug}`),
      inLanguage: "ru-BY",
      publisher: { "@type": "Organization", name: "КухниBY" },
    };
    const familyBreadcrumbJsonLd = breadcrumbJsonLd([
      { name: "Главная", path: "/" },
      { name: "Сценарии", path: "/scenarios" },
      { name: family.h1, path: `/scenarios/${slug}` },
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
        <ScenarioFamilyPage config={family} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyBreadcrumbJsonLd) }} />
      </>
    );
  }
  const scenario = await getScenario(slug);
  if (!scenario) notFound();

  const { cases, styles, materials } = await getRelatedData(scenario);
  const landingGuide = getScenarioGuide(scenario.slug);
  const catalogCta = SCENARIO_CATALOG_CTA[scenario.slug];

  const features = Array.isArray(scenario.features)
    ? (scenario.features as { icon: string; title: string; description: string }[])
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: scenario.headline || scenario.title,
    description: scenario.seoDescription || scenario.intro,
    url: siteUrl(`/scenarios/${scenario.slug}`),
    publisher: { "@type": "Organization", name: "КухниBY" },
  };
  const scenarioBreadcrumbJsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Как выбрать кухню", path: "/scenarios" },
    { name: scenario.title, path: `/scenarios/${scenario.slug}` },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landingGuide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scenarioBreadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section
        className="py-16 lg:py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1060 50%, #0f1a3d 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 70% 50%, #7C3AED, transparent)" }} />
        <div className="container-site relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
            <Link href="/" className="hover:text-white/80 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/scenarios" className="hover:text-white/80 transition-colors">Как выбрать кухню</Link>
            <span>/</span>
            <span className="text-white/70">{scenario.title}</span>
          </nav>
          <div className="max-w-3xl">
            {scenario.badge && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-violet-200 border border-violet-500/30 mb-4">
                {scenario.badge}
              </span>
            )}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-6xl">{scenario.icon}</span>
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                {scenario.headline || scenario.title}
              </h1>
            </div>
            {scenario.intro && (
              <p className="text-white/65 text-lg leading-relaxed max-w-2xl">{scenario.intro}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={scenario.ctaHref || "/contacts#form"}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                {scenario.ctaText || "Согласовать замер"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                Смотреть работы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEEDS */}
      {scenario.needs.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-6">
                  Что важно для вас?
                </h2>
                <div className="space-y-3">
                  {scenario.needs.map((need, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground text-base">{need}</p>
                    </div>
                  ))}
                </div>
              </div>
              {scenario.solutions.length > 0 && (
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-6">
                    Как мы решаем это
                  </h2>
                  <div className="space-y-3">
                    {scenario.solutions.map((sol, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <span className="text-primary font-black text-sm w-6 flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                        <p className="text-foreground text-sm leading-relaxed">{sol}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <h2 className="text-2xl lg:text-3xl font-black text-foreground text-center mb-10">
              Ключевые особенности этой кухни
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-background">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-foreground">
                Планировка под этот сценарий
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                На замере проверяем не только длину стен, но и реальный сценарий: кто пользуется кухней, сколько нужно хранения, где будет техника и какие зоны должны быть под рукой.
              </p>
            </div>
            <div className="grid gap-3">
              {landingGuide.planning.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-lg border border-border bg-white p-4">
                  <span className="font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-site">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-black text-foreground">Материалы и бюджет</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{landingGuide.budget}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {landingGuide.materials.map((item) => (
              <article key={item} className="rounded-xl border border-border bg-white p-5">
                <h3 className="font-bold text-foreground">Что заложить в смету</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/calculator" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90">
              Рассчитать стоимость <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/prices" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-bold hover:border-primary/40">
              Посмотреть цены
            </Link>
          </div>
          {catalogCta && (
            <div className="mt-8 rounded-xl border border-primary/20 bg-white p-5">
              <h3 className="text-lg font-bold text-foreground">{catalogCta.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{catalogCta.text}</p>
              <Link
                href={catalogCta.href}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90"
              >
                {catalogCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-foreground">Частые ошибки</h2>
              <div className="mt-5 space-y-3">
                {landingGuide.mistakes.map((item) => (
                  <p key={item} className="rounded-lg bg-red-50 p-4 text-sm leading-6 text-red-900">{item}</p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-foreground">Вопросы по сценарию</h2>
              <div className="mt-5 space-y-3">
                {landingGuide.faq.map((item) => (
                  <article key={item.question} className="rounded-lg border border-border p-4">
                    <h3 className="font-bold text-foreground">{item.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED CASES */}
      {cases.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-site">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-foreground">Примеры таких кухонь</h2>
              <Link href="/portfolio" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Все работы <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cases.map((c) => (
                <Link key={c.id} href={`/portfolio/${c.slug}`} className="group rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all bg-white">
                  <div className="h-52 overflow-hidden bg-gradient-to-br from-stone-100 to-violet-50">
                    {c.mainImage
                      ? <Image
                        src={c.mainImage}
                        alt={c.title}
                        width={720}
                        height={520}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">{scenario.icon}</div>
                    }
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.city} · {c.area} п.м</p>
                    {c.priceFrom > 0 && (
                      <p className="text-primary font-bold text-sm mt-1">
                        от {c.priceFrom.toLocaleString("ru")} BYN
                        {c.priceTo > 0 && ` — ${c.priceTo.toLocaleString("ru")} BYN`}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED STYLES */}
      {styles.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-site">
            <h2 className="text-2xl font-black text-foreground mb-8">Подходящие стили</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {styles.map((s) => (
                <Link key={s.id} href={`/styles/${s.slug}`} className="group flex gap-4 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg bg-white transition-all">
                  {s.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={s.image}
                        alt={s.title}
                        width={160}
                        height={160}
                        sizes="80px"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                    {s.priceFrom > 0 && <p className="text-primary text-sm font-semibold mt-1">от {s.priceFrom.toLocaleString("ru")} BYN</p>}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED MATERIALS */}
      {materials.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-site">
            <h2 className="text-2xl font-black text-foreground mb-8">Рекомендуемые материалы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {materials.map((m) => (
                <Link key={m.id} href={`/materials/${m.slug}`} className="group flex gap-4 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg bg-white transition-all">
                  {m.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={m.image}
                        alt={m.title}
                        width={160}
                        height={160}
                        sizes="80px"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                    {m.priceFrom > 0 && <p className="text-primary text-sm font-semibold mt-1">от {m.priceFrom.toLocaleString("ru")} BYN</p>}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIPS */}
      {scenario.tips.length > 0 && (
        <section
          className="section-padding"
          style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1030 60%, #0c1a30 100%)" }}
        >
          <div className="container-site max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-black text-white text-center mb-8">
              Советы и лайфхаки
            </h2>
            <div className="space-y-4">
              {scenario.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OTHER SCENARIOS */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-foreground">Другие сценарии</h2>
            <Link href="/scenarios" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              Все сценарии <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <OtherScenariosSection currentSlug={slug} />
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section-padding bg-muted/30">
        <div className="container-site max-w-2xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-2">Обсудить вашу кухню</h2>
          <p className="text-center text-muted-foreground mb-8">
            Расскажите о своей ситуации — подберём решение и согласуем условия замера.
          </p>
          <ContactForm source={`scenario-${slug}`} />
        </div>
      </section>
    </>
  );
}

async function OtherScenariosSection({ currentSlug }: { currentSlug: string }) {
  let others: { slug: string; icon: string; title: string }[] = [];
  try {
    others = await prisma.scenarioPage.findMany({
      where: { published: true, slug: { not: currentSlug } },
      orderBy: [{ order: "asc" }],
      take: 3,
      select: { slug: true, icon: true, title: true },
    });
  } catch {}

  if (others.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {others.map((s) => (
        <Link
          key={s.slug}
          href={`/scenarios/${s.slug}`}
          className="group flex items-center gap-3 p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:bg-primary/5 transition-all"
        >
          <span className="text-3xl">{s.icon}</span>
          <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex-1">{s.title}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
      ))}
    </div>
  );
}
