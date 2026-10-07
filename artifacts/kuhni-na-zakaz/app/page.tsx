import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, isTrustedReviewForSchema } from "@/lib/schema-org";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { regionalLocations } from "@/data/locations";
import { isPublicContentSlug, publicSlugWhere } from "@/lib/public-content";
import { CANONICAL_SITE_URL, SITE_ALTERNATE_NAMES, SITE_NAME, canonicalSiteUrl } from "@/lib/seo";
import { ExploreContextProvider, RelatedExplorationRail } from "@/components/exploration";
import { HomeMobileShowroom } from "@/components/home/HomeMobileShowroom";

const HOME_SEO_FAQ_ITEMS = [
  {
    id: 10_001,
    question: "Как купить кухню на заказ по своим размерам?",
    answer:
      "Начните с плана помещения, размеров и списка техники. Затем согласуем замер, планировку, материалы, смету, доставку и монтаж. Перед производством фиксируем комплектацию и условия в договоре.",
  },
  {
    id: 10_002,
    question: "Чем кухня на заказ отличается от готовой кухни?",
    answer:
      "Готовая кухня собирается из типовых модулей и часто требует компромиссов по размерам. Кухня на заказ проектируется под конкретное помещение, расположение коммуникаций, технику, хранение и выбранные материалы.",
  },
  {
    id: 10_003,
    question: "Сколько стоит кухня на заказ?",
    answer:
      "Стоимость зависит от размера, фасадов, столешницы, фурнитуры, встроенной техники, сложности монтажа и доставки. Точный расчет делаем после размеров и выбора комплектации.",
  },
  {
    id: 10_004,
    question: "Можно ли заказать кухню с доставкой и монтажом?",
    answer:
      "Да. В проект можно включить доставку, сборку, монтаж, установку фурнитуры и согласованные работы по подключению техники. Условия зависят от адреса и комплектации кухни.",
  },
  {
    id: 10_005,
    question: "Что подготовить для расчёта кухни?",
    answer: "План помещения или примерные длины стен, расположение воды и вентиляции, список техники и пожелания по хранению. Если размеров нет, при заявке согласуем замер. Предварительный расчёт уточняется после проверки помещения.",
  },
  {
    id: 10_006,
    question: "Как согласуются сроки и гарантия?",
    answer: "Срок изготовления зависит от материалов и сложности проекта. Дату доставки и монтажа, гарантию на выбранную комплектацию и порядок обращения согласуем до заказа и фиксируем в договоре.",
  },
];

const LOCAL_BUSINESS_IMAGE =
  "/uploads/seo-showcase/home-hero-dark-kitchen-2026.webp";
const HOME_ORIGIN = CANONICAL_SITE_URL;
const HOME_URL = canonicalSiteUrl("/");

const HOME_TITLE = "Купить кухню на заказ — по вашим размерам";
const HOME_DESCRIPTION =
  "Кухни на заказ по индивидуальным размерам. Выберите планировку, фасады и хранение, посмотрите примеры комплектаций и отправьте заявку на расчёт.";

export const metadata: Metadata = {
  title: { absolute: `${HOME_TITLE} | ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  alternates: { canonical: HOME_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: HOME_URL,
    images: [
      {
        url: `${HOME_ORIGIN}${LOCAL_BUSINESS_IMAGE}`,
        width: 1717,
        height: 916,
        alt: "Визуализация кухни на заказ — КухниBY",
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
    const [cases, reviews, locations] = await Promise.all([
      prisma.portfolioCase.findMany({
        where: { published: true, slug: publicSlugWhere() },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 12,
      }),
      prisma.review.findMany({ where: { status: "PUBLISHED" }, take: 12, orderBy: { createdAt: "desc" } }),
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
      locations: locations.filter((item) => isPublicContentSlug(item.slug)),
    };
  } catch {
    return { cases: [], reviews: [], locations: [] };
  }
}

export default async function HomePage() {
  const { cases, reviews, locations } = await getHomeData();
  const trustedReviews = reviews.filter(isTrustedReviewForSchema).slice(0, 4);

  const displayFaqs = HOME_SEO_FAQ_ITEMS;

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
    "@id": `${HOME_URL}#localbusiness`,
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
    sameAs: [CONTACT_DEFAULTS.telegram, CONTACT_DEFAULTS.instagram],
  });
  const jsonLdBreadcrumb = breadcrumbJsonLd([{ name: "Главная", path: "/" }]);
  const jsonLdFaq = faqJsonLd(displayFaqs);
  const jsonLdItems = [
    websiteJsonLd,
    localBusinessJsonLd,
    jsonLdBreadcrumb,
    ...(jsonLdFaq ? [jsonLdFaq] : []),
  ];

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

      <ExploreContextProvider sourceRoute="/">
      <HomeMobileShowroom
        projects={cases.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          city: item.city,
          kitchenType: item.kitchenType,
          style: item.style,
          material: item.material,
          area: item.area,
          size: item.size,
          priceFrom: item.priceFrom,
          mainImage: item.mainImage,
          images: item.images,
          imageAlts: item.imageAlts,
        }))}
        reviews={trustedReviews.map((item) => ({
          id: item.id,
          name: item.name,
          city: item.city,
          date: item.date,
          text: item.text,
          rating: item.rating,
        }))}
        faqs={displayFaqs.map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
        }))}
        locations={primaryLocationLinks.map((item) => ({
          slug: item.slug,
          city: item.city,
          region: item.region,
          priceFrom: item.priceFrom,
        }))}
      />
      <section className="bg-[#f6f1ea] py-8 text-[#201912]"><div className="container-site"><RelatedExplorationRail route="/" state="RESULT" /></div></section>
      </ExploreContextProvider>

    </>
  );
}
