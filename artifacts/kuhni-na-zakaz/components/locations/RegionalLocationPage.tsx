import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  ClipboardList,
  Hammer,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Truck,
} from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";
import { KitchenIdeas3DSection } from "@/components/sections/KitchenIdeas3DSection";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import {
  minskRegionLocations,
  regionalLocations,
  type PopularSolution,
  type RegionalInternalLink,
  type RegionalLocationData,
} from "@/data/locations";
import { getKitchenIdeas3DForCity } from "@/data/kitchen-ideas-3d";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, faqJsonLd, siteUrl } from "@/lib/schema-org";
import { PhoneReveal } from "@/components/layout/PhoneReveal";
import { RegionalVisualStoryGallery } from "@/components/locations/RegionalVisualStoryGallery";

export interface PortfolioCasePreview {
  id: number | string;
  title: string;
  slug: string;
  mainImage: string;
  style: string;
  priceFrom: number;
  area: number;
  days: number;
  city: string;
}

interface RegionalLocationPageProps {
  location: RegionalLocationData;
  cases: PortfolioCasePreview[];
  hasLocalCases: boolean;
}

function isJsonLdObject<T>(value: T | null): value is T {
  return value !== null;
}

const orderSteps = [
  "Заявка",
  "Консультация",
  "Замер",
  "3D-проект",
  "Расчет",
  "Изготовление",
  "Доставка и монтаж",
];

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>}
    </div>
  );
}

function LinkPills({ links }: { links: RegionalInternalLink[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function getServiceItems(location: RegionalLocationData) {
  return [
    {
      title: "Проектирование",
      text: `Подбираем планировку под помещение в ${location.cityPrepositional}, технику, хранение и сценарии готовки.`,
    },
    {
      title: "Подбор материалов",
      text: "Помогаем сравнить фасады, столешницы, фурнитуру и механизмы под бюджет и ежедневную нагрузку.",
    },
    {
      title: "Изготовление",
      text: "Перед запуском фиксируем размеры, комплектацию и смету, чтобы кухня изготавливалась по утвержденному проекту.",
    },
    {
      title: "Доставка",
      text: location.deliveryText,
    },
    {
      title: "Монтаж",
      text: location.installationText,
    },
    {
      title: "Техника и фурнитура",
      text: "Помогаем предусмотреть встроенную технику, петли, направляющие, подъемники, подсветку и доступ к коммуникациям.",
    },
  ];
}

function getPopularSolutions(location: RegionalLocationData) {
  const required: PopularSolution[] = [
    {
      title: "Угловые кухни",
      text: "Подходят для большинства квартир: удобно развести мойку, варочную поверхность, холодильник и рабочую зону.",
    },
    {
      title: "Прямые кухни",
      text: "Практичный вариант для узких помещений, студий и проектов, где важны понятная смета и компактный монтаж.",
    },
    {
      title: "Кухни до потолка",
      text: "Добавляют хранение, закрывают верхнюю линию шкафов и требуют точного замера высоты и вентиляции.",
    },
    {
      title: "Кухни для маленькой кухни",
      text: "Считаем каждый модуль: хранение, рабочую поверхность, сушку, технику и удобство проходов.",
    },
    {
      title: "Кухни с островом",
      text: "Уместны в просторных кухнях-гостиных и частных домах, если хватает проходов и есть понятная электрика.",
    },
    {
      title: "Кухни с встроенной техникой",
      text: "Заранее проверяем размеры приборов, вентиляцию, розетки, зазоры и доступ для обслуживания.",
    },
  ];
  const byTitle = new Map<string, PopularSolution>();

  for (const item of [...required, ...location.popularSolutions]) {
    byTitle.set(item.title, item);
  }

  return Array.from(byTitle.values()).slice(0, 8);
}

function getFaqItems(location: RegionalLocationData) {
  const cityCommercialFaq: RegionalLocationData["faq"] =
    location.isMinskRegionCity && location.slug !== "minskaya-oblast"
      ? [
          {
            question: `Можно ли купить кухню в ${location.cityPrepositional} с доставкой и монтажом?`,
            answer:
              "Да, можно заказать кухню под размер с доставкой и монтажом. Логистику, дату выезда и условия установки согласуем после предварительного расчета и проверки адреса.",
          },
          {
            question: `Сколько стоит кухня в ${location.cityPrepositional}?`,
            answer:
              "Точная стоимость зависит от размеров, фасадов, столешницы, фурнитуры, техники, доставки и монтажных условий. Ориентир можно подготовить по размерам и фото.",
          },
          {
            question: "Можно ли начать с расчета по фото и размерам?",
            answer:
              "Да, для первого расчета достаточно фото помещения, примерных размеров, списка техники и пожеланий по планировке. Финальная смета фиксируется после замера.",
          },
        ]
      : [];
  const extra: RegionalLocationData["faq"] = [
    {
      question: `Можно ли рассчитать кухню в ${location.cityPrepositional} до замера?`,
      answer:
        "Да, можно подготовить ориентир по размерам, фото помещения и списку техники. Точная цена фиксируется после замера и выбора материалов.",
    },
    {
      question: "Что нужно подготовить для консультации?",
      answer:
        "Желательно прислать примерные размеры, фото кухни, пожелания по стилю, список техники и ограничения по бюджету. Если данных мало, менеджер подскажет, что уточнить.",
    },
    {
      question: "Помогаете ли с подбором техники и фурнитуры?",
      answer:
        "Да, в проекте учитываем встроенную технику, петли, направляющие, подъемные механизмы, ручки, подсветку и доступ к коммуникациям.",
    },
    {
      question: "Почему цена на странице указана ориентировочно?",
      answer:
        "Без точного замера нельзя честно учесть длину кухни, высоту шкафов, фасады, столешницу, фурнитуру, технику, доставку и монтажные условия.",
    },
  ];
  const byQuestion = new Map<string, RegionalLocationData["faq"][number]>();

  for (const item of [...cityCommercialFaq, ...location.faq, ...extra]) {
    if (!byQuestion.has(item.question)) byQuestion.set(item.question, item);
  }

  return Array.from(byQuestion.values()).slice(0, 7);
}

function getHubCityOrderText(city: RegionalLocationData) {
  const objectHint = city.popularSolutions[0]?.title.toLocaleLowerCase("ru") ?? "кухню под размер";

  return `Кухню под размер: ${objectHint}, замер, проект, доставку и монтаж.`;
}

function getHubDeliveryText(city: RegionalLocationData) {
  const area = city.areas[1] ?? city.regionName;

  return `${area}; маршрут и стоимость уточняются по адресу, объему кухни и условиям разгрузки.`;
}

const hubDirections = [
  {
    title: "Север",
    text: "Логойск, Вилейка и Мядель: чаще встречаются частные дома, дачи, кухни с большим хранением и отдельной логистикой выезда.",
    links: ["logoisk", "vileyka", "myadel"],
  },
  {
    title: "Запад",
    text: "Молодечно, Воложин, Заславль и Дзержинск: удобно начинать с удаленного расчета, затем подтверждать размеры на объекте.",
    links: ["molodechno", "volozhin", "zaslavl", "dzerzhinsk"],
  },
  {
    title: "Юг",
    text: "Слуцк, Солигорск, Несвиж, Клецк, Копыль, Любань, Узда и Старые Дороги: заранее планируем рейс, занос столешницы и монтажный день.",
    links: ["slutsk", "soligorsk", "nesvizh", "kletsk", "kopyl", "lyuban", "uzda", "starye-dorogi"],
  },
  {
    title: "Восток",
    text: "Борисов, Жодино, Смолевичи, Березино, Червень и Крупки: проект удобно согласовать дистанционно, а замер привязать к маршруту.",
    links: ["borisov", "zhodino", "smolevichi", "berezino", "cherven", "krupki"],
  },
  {
    title: "Ближние города к Минску",
    text: "Фаниполь, Заславль, Смолевичи и Дзержинск: часто заказывают кухни для новостроек, таунхаусов и квартир после ремонта.",
    links: ["fanipol", "zaslavl", "smolevichi", "dzerzhinsk"],
  },
];

const hubKitchenTypes = [
  {
    title: "Для квартиры",
    text: "Считаем хранение, рабочую поверхность, встроенную технику, проходы и удобный занос деталей.",
    href: "/catalog/malenkie-kuhni",
  },
  {
    title: "Для частного дома",
    text: "Учитываем котел, вентиляцию, крупную технику, большие шкафы и место сборки на объекте.",
    href: "/catalog/kuhni-s-ostrovom",
  },
  {
    title: "Для дачи",
    text: "Подбираем практичные материалы и согласуем монтаж с учетом сезонности, доступа и готовности помещения.",
    href: "/materials",
  },
  {
    title: "До потолка",
    text: "Добавляет хранение, но требует точного замера высоты, вентиляции, верхних доборов и открывания фасадов.",
    href: "/catalog/kuhni-do-potolka",
  },
  {
    title: "Угловая",
    text: "Подходит для большинства квартир и домов, помогает собрать удобный рабочий треугольник.",
    href: "/catalog/uglovye-kuhni",
  },
  {
    title: "Прямая",
    text: "Хороший вариант для узких помещений, студий, дачных кухонь и проектов с понятной сметой.",
    href: "/catalog/pryamye-kuhni",
  },
];

const minskOblastStoryImages = [
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-kuhnya-dalniy-vid.webp",
    alt: "3D-визуализация кухни на заказ в Минской области, общий вид",
    caption: "Готовая кухня: общий вид",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-stoleshnica-fasady-krupno.webp",
    alt: "Крупный план столешницы и фасадов кухни на заказ",
    caption: "Фасады, столешница и подсветка",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-materialy-fasadov.webp",
    alt: "Образцы фасадов, ЛДСП, столешницы и кромки для кухни",
    caption: "Материалы перед расчетом",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-zamer-kuhni.webp",
    alt: "Замер кухни лазерной рулеткой перед изготовлением мебели",
    caption: "Замер помещения",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-raspil-ldsp.webp",
    alt: "Распил ЛДСП для корпуса кухни на заказ",
    caption: "Распил ЛДСП",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-okleyka-kromki.webp",
    alt: "Оклейка кромки на детали кухни из ЛДСП",
    caption: "Оклейка кромки",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-sborka-korpusov.webp",
    alt: "Сборка корпусов кухни и установка фурнитуры",
    caption: "Сборка корпусов",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-kuhnya-do-potolka.webp",
    alt: "Кухня до потолка для квартиры в Минской области",
    caption: "Кухня до потолка",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-yashchik-furnitura.webp",
    alt: "Кухонный ящик с направляющими и органайзером",
    caption: "Ящики и направляющие",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-montazh-kuhni.webp",
    alt: "Монтаж кухни на заказ с выравниванием нижних модулей",
    caption: "Монтаж на объекте",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-kuhnya-s-ostrovom.webp",
    alt: "Кухня с островом для частного дома в Минской области",
    caption: "Кухня с островом",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-zona-moyki.webp",
    alt: "Зона мойки в кухне на заказ с доступом к коммуникациям",
    caption: "Мойка и коммуникации",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-p-obraznaya-kuhnya.webp",
    alt: "П-образная кухня на заказ для частного дома",
    caption: "П-образная планировка",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-petli-regulirovka.webp",
    alt: "Регулировка петель и доводчиков на кухонном фасаде",
    caption: "Петли и доводчики",
  },
  {
    src: "/uploads/locations/minskaya-oblast/minskaya-oblast-soglasovanie-proekta.webp",
    alt: "Согласование проекта кухни с материалами и размерами",
    caption: "Согласование проекта",
  },
];

const minskOblastRouteSteps = [
  {
    eyebrow: "Шаг 1",
    title: "Замер помещения",
    text: "Сначала проверяем размеры, углы, высоту, выводы воды, электрику и условия монтажа.",
    images: [minskOblastStoryImages[3]],
  },
  {
    eyebrow: "Шаг 2",
    title: "Выбор комплектующих",
    text: "Показываем фасады, столешницы, кромку, ящики, направляющие, петли и рабочие детали до запуска в производство.",
    images: [
      minskOblastStoryImages[2],
      minskOblastStoryImages[1],
      minskOblastStoryImages[8],
      minskOblastStoryImages[13],
    ],
  },
  {
    eyebrow: "Шаг 3",
    title: "Варианты планировки",
    text: "Сравниваем решения под квартиру, дом или дачу: до потолка, с островом, П-образную компоновку и рабочую зону.",
    images: [
      minskOblastStoryImages[7],
      minskOblastStoryImages[10],
      minskOblastStoryImages[12],
      minskOblastStoryImages[11],
    ],
  },
  {
    eyebrow: "Шаг 4",
    title: "Производство и монтаж",
    text: "После согласования проекта идут распил, кромка, сборка корпусов и монтаж на объекте.",
    images: [
      minskOblastStoryImages[14],
      minskOblastStoryImages[4],
      minskOblastStoryImages[5],
      minskOblastStoryImages[6],
      minskOblastStoryImages[9],
    ],
  },
  {
    eyebrow: "Шаг 5",
    title: "Готовый результат",
    text: "В конце маршрута показываем общий вид кухни, чтобы было понятно, к чему ведут замер, материалы и производство.",
    images: [minskOblastStoryImages[0]],
  },
].map((step) => ({ ...step, images: step.images.filter(Boolean) }));

const minskHeroStoryImages = [
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-light-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-light-20260619-mobile.webp",
    alt: "Светлая кухня на заказ в Минске для первого экрана сайта",
    caption: "Светлая кухня для первого экрана",
  },
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-dark-wood-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-dark-wood-20260619-mobile.webp",
    alt: "Темная кухня на заказ в Минске с древесной фактурой для первого экрана",
    caption: "Темная кухня с древесной фактурой",
  },
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-island-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-island-20260619-mobile.webp",
    alt: "Кухня-гостиная с островом на заказ в Минске для первого экрана",
    caption: "Кухня-гостиная с островом",
  },
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-floor-to-ceiling-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-floor-to-ceiling-20260619-mobile.webp",
    alt: "Кухня до потолка на заказ в Минске для первого экрана",
    caption: "Кухня до потолка",
  },
];

function getHubDirectionLinks(slugs: string[]) {
  return slugs
    .map((slug) => minskRegionLocations.find((city) => city.slug === slug))
    .filter((city): city is RegionalLocationData => Boolean(city))
    .map((city) => ({ href: `/locations/${city.slug}`, label: city.cityName }));
}

function getBuyKitchenAnchor(location: RegionalLocationData) {
  if (location.slug === "minskaya-oblast") return "Купить кухню в Минской области";

  return `Купить кухню в ${location.cityPrepositional}`;
}

function getPurchaseScenarioCards(location: RegionalLocationData) {
  return [
    {
      title: "По размерам помещения",
      text: `Начинаем с фото, примерных размеров и списка техники. После замера в ${location.cityPrepositional} уточняем стены, углы, выводы воды, электрику и вентиляцию.`,
    },
    {
      title: "С доставкой и монтажом",
      text: "Смета собирается вместе с логистикой: учитываем адрес, этажность, занос деталей, столешницу, готовность ремонта и монтажный день.",
    },
    {
      title: "Для квартиры, дома или дачи",
      text: "Подбираем прямую, угловую, П-образную кухню, вариант до потолка или решение с островом под реальный сценарий, а не под случайный набор модулей.",
    },
    {
      title: "С понятной комплектацией",
      text: "До запуска в производство фиксируем фасады, корпус, столешницу, фурнитуру, встроенную технику, подсветку и гарантийные условия.",
    },
  ];
}

export function RegionalLocationPage({
  location,
  cases,
  hasLocalCases,
}: RegionalLocationPageProps) {
  const isMinskRegionHub = location.slug === "minskaya-oblast";
  const serviceItems = getServiceItems(location);
  const popularSolutions = getPopularSolutions(location);
  const faqItems = getFaqItems(location);
  const cityIdeas = getKitchenIdeas3DForCity(location.slug);
  const heroIdea = cityIdeas[0];
  const isMinsk = location.slug === "minsk";
  const isBorisov = location.slug === "borisov";
  const minskHeroImage = "/uploads/locations/minsk-3d/minsk-hero-light-20260619-desktop.webp";
  const minskHeroMobileImage = "/uploads/locations/minsk-3d/minsk-hero-light-20260619-mobile.webp";
  const borisovHeroImage = "/uploads/locations/borisov-3d/borisov-hero-distinctive-20260617.webp";
  const borisovHeroMobileImage = "/uploads/locations/borisov-3d/borisov-hero-distinctive-mobile-20260617.webp";
  const heroImage = isMinsk ? minskHeroImage : isBorisov ? borisovHeroImage : heroIdea?.image ?? "/images/hero.webp";
  const heroAlt = isMinsk
    ? "Светлая кухня на заказ в Минске, фоновая визуализация первого экрана"
    : isBorisov
    ? "Купить кухню на заказ в Борисове, фоновая визуализация гарнитура"
    : heroIdea?.alt ?? `Кухня на заказ в ${location.cityPrepositional}`;
  const phoneHref = `tel:${CONTACT_DEFAULTS.phone}`;
  const buyKitchenAnchor = getBuyKitchenAnchor(location);
  const purchaseScenarioCards = getPurchaseScenarioCards(location);
  const workSectionTitle =
    location.slug === "minsk"
      ? "Купить кухню в Минске с замером, проектом и монтажом"
      : isBorisov
        ? "Купить кухню на заказ в Борисове под размер квартиры или дома"
      : location.isMinskRegionCity && !isMinskRegionHub
        ? `Купить кухню в ${location.cityPrepositional} под размер квартиры или дома`
        : `Как работаем в ${location.cityPrepositional}`;
  const popularSectionTitle =
    location.slug === "minsk"
      ? "Популярные решения в Минске"
      : location.isMinskRegionCity && !isMinskRegionHub
        ? `Популярные решения в ${location.cityPrepositional}`
        : `Популярные решения для ${location.cityGenitive}`;
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Города", path: "/locations" },
    { name: location.cityName, path: `/locations/${location.slug}` },
  ]);
  const jsonLdFaq = faqJsonLd(
    faqItems.map((item) => ({ question: item.question, answer: item.answer })),
  );
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl(`/locations/${location.slug}`)}#service`,
    name: location.h1,
    description: location.description,
    url: siteUrl(`/locations/${location.slug}`),
    serviceType: "Кухни на заказ",
    areaServed: [
      {
        "@type": location.isMinskRegionCity ? "City" : "AdministrativeArea",
        name: location.cityName,
      },
      {
        "@type": "AdministrativeArea",
        name: location.regionName,
      },
    ],
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl("/")}#organization`,
      name: "КухниBY",
      url: siteUrl("/"),
      telephone: CONTACT_DEFAULTS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Дзержинского, д. 90, каб. 1а",
        postalCode: "222520",
        addressLocality: "Борисов",
        addressCountry: "BY",
      },
    },
    offers: {
      "@type": "Offer",
      url: siteUrl(`/locations/${location.slug}`),
      priceCurrency: "BYN",
      price: location.priceFrom,
      availability: "https://schema.org/InStock",
    },
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdFaq, jsonLdService].filter(isJsonLdObject)} />

      <section className="relative overflow-hidden bg-stone-950 text-white">
        {isMinskRegionHub ? (
          <div className="absolute inset-0">
            <picture>
              <img
                src="/uploads/locations/minskaya-oblast/minskaya-oblast-hero-desktop.webp"
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                className="h-full w-full object-contain object-top md:object-right"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-black/42 via-black/34 to-black/78 md:bg-gradient-to-r md:from-black/42 md:via-black/18 md:to-black/24" />
          </div>
        ) : (
          <div className="absolute inset-0 opacity-28">
            {isMinsk ? (
              <picture>
                <source media="(max-width: 767px)" srcSet={minskHeroMobileImage} />
                <img
                  src={heroImage}
                  alt={heroAlt}
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
            ) : isBorisov ? (
              <>
                <Image
                  src={borisovHeroMobileImage}
                  alt={heroAlt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                  className="object-cover md:hidden"
                />
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                  className="hidden object-contain md:block"
                />
              </>
            ) : (
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="object-cover"
              />
            )}
            {(heroIdea || isMinsk || isBorisov) && <BrandedImageWatermark compact />}
          </div>
        )}
        <div className="relative container-site py-10 md:py-16 lg:py-20">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/72">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span>/</span>
            <Link href="/locations" className="hover:text-white">
              Города
            </Link>
            <span>/</span>
            <span className="text-white">{location.cityName}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.72fr)] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/85">
                <MapPin className="h-4 w-4" />
                {location.regionName}
              </div>
              <h1 className="mb-5 font-serif text-3xl font-bold leading-tight md:text-5xl">
                {location.h1}
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-8 text-white/82">{location.intro}</p>
              <div className="mb-8 flex flex-wrap gap-3">
                <Link
                  href="#form"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-white/90"
                >
                  Рассчитать стоимость
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4" />
                  Получить консультацию
                </Link>
                <Link
                  href="/calculator"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <Calculator className="h-4 w-4" />
                  Онлайн-калькулятор
                </Link>
              </div>
              <p className="mb-5 max-w-2xl text-sm leading-6 text-white/72">{location.serviceAreaText}</p>
              <div className="inline-flex flex-wrap items-end gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                <span className="text-sm text-white/65">Ориентировочно, зависит от проекта</span>
                <span className="text-3xl font-bold">от {location.priceFrom.toLocaleString("ru")} BYN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isMinskRegionHub && (
        <section className="bg-white py-10 md:py-14">
          <div className="container-site">
            <div className="mb-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Визуальный маршрут
                </p>
                <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                  От замера до готовой кухни
                </h2>
              </div>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                Картинки идут в рабочем порядке: замер, выбор комплектующих, варианты планировки,
                производство и готовый результат.
              </p>
            </div>
            <div className="space-y-12">
              {minskOblastRouteSteps.map((step) => (
                <div key={step.title}>
                  <SectionTitle eyebrow={step.eyebrow} title={step.title} text={step.text} />
                  <RegionalVisualStoryGallery images={step.images} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isMinskRegionHub && (
      <section className="bg-white section-padding">
        <div className="container-site grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionTitle
              eyebrow="Региональная страница"
              title={workSectionTitle}
              text={location.seoText}
            />
            <p className="text-base leading-7 text-muted-foreground">{location.serviceAreaText}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="mb-3 font-serif text-2xl font-bold">Быстрый старт</h2>
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              Напишите город, размеры и список техники. Мы подскажем порядок замера, ориентир по бюджету
              и какие данные нужны для точной сметы.
            </p>
            <LinkPills links={location.internalLinks.slice(0, 4)} />
          </div>
        </div>
      </section>
      )}

      {isMinsk && (
        <section className="bg-white pb-12 md:pb-16">
          <div className="container-site">
            <SectionTitle
              eyebrow="Визуальная концепция"
              title="Изображения для первого экрана кухни на заказ в Минске"
              text="Подобрали четыре направления для первого экрана: светлая кухня, темная кухня с древесной фактурой, кухня-гостиная с островом и кухня до потолка."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {minskHeroStoryImages.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-lg border border-border bg-muted/20"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-900 md:aspect-[16/10]">
                    <picture>
                      <source media="(max-width: 767px)" srcSet={image.mobileSrc} />
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </picture>
                    <BrandedImageWatermark compact />
                  </div>
                  <figcaption className="px-4 py-3 text-sm font-semibold text-foreground">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Состав услуги"
            title="Что вы получите"
            text="Показываем реальный состав работ: от проектирования и материалов до доставки, монтажа и помощи с комплектацией."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-border bg-white p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Процесс"
            title="Как проходит заказ"
            text={`Для ${location.cityGenitive} порядок не меняется по смыслу, но логистика замера и доставки согласуется отдельно.`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {orderSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <ClipboardList className="mb-4 h-5 w-5 text-primary" />
                <p className="mb-2 text-sm font-semibold text-primary">Шаг {index + 1}</p>
                <p className="text-sm leading-6 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Перед заказом"
            title={`${buyKitchenAnchor}: что важно учесть до расчета`}
            text="На одной странице собраны условия покупки, замера, доставки, монтажа и комплектации, чтобы до заявки было понятно, от чего зависит смета."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {purchaseScenarioCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-muted/30 p-5">
                <h3 className="mb-3 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Выбрать тип кухни
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/prices"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Посмотреть цены
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#form"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Получить расчет
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {location.isMinskRegionCity && !isMinskRegionHub && (
        <section className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Каталог и цена"
              title={`Купить кухню в ${location.cityPrepositional}: каталог, угловые варианты и расчет цены`}
              text={`Для ${location.cityGenitive} удобнее начинать не с общей фразы, а с формата кухни: угловая, прямая, маленькая, до потолка или со встроенной техникой. Каталог помогает выбрать направление, а расчет показывает реальную цену под размеры помещения.`}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/catalog"
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  Каталог кухонь
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Посмотрите основные типы кухонь и выберите основу для проекта в {location.cityPrepositional}.
                </p>
              </Link>
              <Link
                href="/catalog/uglovye-kuhni"
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  Угловая кухня недорого
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Сравним цену угловой кухни по размерам, фасадам, столешнице, фурнитуре и монтажу.
                </p>
              </Link>
              <Link
                href="/prices"
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  Цена кухни в {location.cityPrepositional}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Ориентир начинается от {location.priceFrom.toLocaleString("ru")} BYN, точная смета зависит от комплектации.
                </p>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Стоимость"
            title="Что влияет на стоимость"
            text={`Ориентир на сайте — от ${location.priceFrom.toLocaleString("ru")} BYN, но точную цену нельзя честно назвать без замера и комплектации. ${location.priceNote}`}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Размер и форма", "Фасады и столешница", "Фурнитура и механизмы", "Техника, доставка и монтаж"].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-white p-5">
                <CheckCircle className="mb-4 h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">{item}</p>
              </div>
            ))}
          </div>
          <Link
            href="/prices"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Смотреть цены и примеры расчетов <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {isBorisov && (
        <section className="bg-white section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Смета"
              title="Как сделать расчет точнее"
              text="Перед предварительной оценкой важно собрать не только длину стен, но и данные по отделке, технике, фурнитуре и доступу к помещению."
            />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Исходные данные</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Для первого ориентира пригодятся фото помещения, длина стен, высота потолка, расположение воды,
                  электрики, вентиляции и список техники. Если ремонт еще идет, лучше указать, какие работы уже
                  завершены и что может измениться до монтажа.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Материалы и комплектация</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  На смету влияют фасады, корпус, столешница, кромка, петли, направляющие, подъемники, ручки,
                  подсветка, сушка, встроенные приборы и дополнительные доборы. Один и тот же проект можно собрать
                  в более практичной или более премиальной комплектации.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Условия установки</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Перед запуском проверяем готовность стен, пола, розеток, выводов воды, подъезд, этажность,
                  возможность заноса длинной столешницы и место для сборки. Так проще согласовать срок,
                  логистику и финальную стоимость без неприятных сюрпризов.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <KitchenIdeas3DSection
        cityName={location.cityName}
        citySlug={location.slug}
        cityPrepositional={location.cityPrepositional}
        titleSubject={location.cityGenitive}
      />

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Логистика"
            title="Замер, доставка и монтаж"
            text="Каждый региональный заказ считаем по фактическому адресу, готовности ремонта и составу кухни."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "Замер", text: location.measurementText, icon: Ruler },
              { title: "Доставка", text: location.deliveryText, icon: Truck },
              { title: "Монтаж", text: location.installationText, icon: Hammer },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-border bg-muted/30 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <div className="grid gap-6 rounded-2xl border border-border bg-white p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Локальная заявка
              </p>
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                Работаем с заявками из {location.cityGenitive}
              </h2>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-3">
                <p>Расчет стоимости по размерам</p>
                <p>Доставка и монтаж обсуждаются при расчете</p>
                <p>Условия замера, доставки и монтажа уточняются индивидуально</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <PhoneReveal
                phone={CONTACT_DEFAULTS.phoneDisplay}
                phoneHref={`tel:${CONTACT_DEFAULTS.phone}`}
                source={`regional-${location.slug}-cta`}
                compact
                className="min-h-11 px-5 py-3"
              />
              <Link
                href="#form"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Рассчитать по размерам
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Решения"
            title={popularSectionTitle}
            text="Это не фиктивные кейсы, а типы кухонь, которые можно рассмотреть для похожих помещений."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {popularSolutions.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Портфолио"
            title={`Проекты в ${location.cityPrepositional}`}
            text={
              hasLocalCases
                ? "Показываем только проекты, где город в данных портфолио совпадает с этой страницей."
                : "Пока нет подтверждённых проектов из этого города. Ниже можно посмотреть примеры решений и 3D-визуализации."
            }
          />
          {hasLocalCases ? (
            <div className="grid gap-5 md:grid-cols-3">
            {cases.slice(0, 3).map((item) => {
              const disclosure = getImageDisclosure(item.mainImage);

              return (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-primary/40 hover:shadow-lg"
                >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={optimizedImageSrc(item.mainImage) || item.mainImage || "/images/hero.webp"}
                    alt={buildImageAlt(item.mainImage, item.title)}
                    width={640}
                    height={480}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <BrandedImageWatermark show={disclosure.kind === "generated"} compact />
                  <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {disclosure.label}
                  </span>
                </div>
                <div className="p-5">
                  <p className="mb-2 font-semibold text-foreground">{item.title}</p>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {item.city}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.area > 0 && <span>{item.area} п.м</span>}
                    {item.priceFrom > 0 && <span>от {item.priceFrom.toLocaleString("ru")} BYN</span>}
                    {item.days > 0 && <span>{item.days} дн.</span>}
                  </div>
                </div>
              </Link>
              );
            })}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
              Пока нет подтверждённых проектов из этого города. Ниже можно посмотреть примеры решений и 3D-визуализации.
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle eyebrow="FAQ" title={`Частые вопросы о кухнях в ${location.cityPrepositional}`} />
          <div className="max-w-3xl space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-foreground">
                  {item.question}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {isMinskRegionHub && (
        <section className="bg-white section-padding">
          <div className="container-site">
            <div className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <SectionTitle
                  eyebrow="Региональное направление"
                  title="Купить кухню в Минской области: города, доставка и монтаж"
                  text={location.seoText}
                />
                <p className="text-base leading-7 text-muted-foreground">{location.serviceAreaText}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <h2 className="mb-3 font-serif text-2xl font-bold">Быстрый старт</h2>
                <p className="mb-5 text-sm leading-6 text-muted-foreground">
                  Напишите город, размеры и список техники. Мы подскажем порядок замера, ориентир по бюджету
                  и какие данные нужны для точной сметы.
                </p>
                <LinkPills links={location.internalLinks.slice(0, 4)} />
              </div>
            </div>

            <SectionTitle
              eyebrow="Города"
              title="Города Минской области"
              text={location.hubText}
            />

            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="hidden grid-cols-[0.8fr_1.2fr_1.4fr] border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground md:grid">
                <span>Город</span>
                <span>Что можно заказать</span>
                <span>Особенности доставки и замера</span>
              </div>
              <div className="divide-y divide-border">
                {minskRegionLocations.map((city) => (
                  <div key={city.slug} className="grid gap-3 px-4 py-4 text-sm md:grid-cols-[0.8fr_1.2fr_1.4fr] md:items-start">
                    <Link
                      href={`/locations/${city.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                    >
                      {city.cityName}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <p className="leading-6 text-foreground">{getHubCityOrderText(city)}</p>
                    <p className="leading-6 text-muted-foreground">{getHubDeliveryText(city)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle
                eyebrow="Направления"
                title="Направления по Минской области"
                text="Выберите направление, чтобы быстрее согласовать маршрут замера, доставку и монтаж."
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {hubDirections.map((direction) => (
                  <div key={direction.title} className="rounded-lg border border-border bg-muted/30 p-5">
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{direction.title}</h3>
                    <p className="mb-4 text-sm leading-6 text-muted-foreground">{direction.text}</p>
                    <LinkPills links={getHubDirectionLinks(direction.links)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <SectionTitle
                eyebrow="Типы кухонь"
                title="Типы кухонь для Минской области"
                text="Выбор зависит от объекта: квартира, дом, дача, кухня-гостиная или компактное помещение после ремонта."
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hubKitchenTypes.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-lg border border-border bg-muted/30 p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Перелинковка"
            title="Соседние города и полезные разделы"
            text="Внутренние ссылки ведут на соседние направления и основные коммерческие страницы."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Соседние города</h3>
              <LinkPills links={location.nearbyAreas.length > 0 ? location.nearbyAreas : regionalLocations.slice(0, 5).map((item) => ({ href: `/locations/${item.slug}`, label: item.cityName }))} />
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Важные услуги</h3>
              <LinkPills links={location.internalLinks} />
            </div>
          </div>
        </div>
      </section>

      <section id="form" className="bg-stone-950 text-white section-padding">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
              Рассчитать кухню в {location.cityPrepositional}
            </h2>
            <p className="mb-6 leading-7 text-white/72">
              Оставьте заявку: менеджер уточнит размеры, город, технику и подскажет следующий шаг.
              Точные сроки замера и доставки нужно подтверждать по конкретному адресу.
            </p>
            <div className="flex flex-wrap gap-3">
              <PhoneReveal
                phone={CONTACT_DEFAULTS.phoneDisplay}
                phoneHref={phoneHref}
                source={`regional-${location.slug}-form`}
                compact
                className="min-h-11 px-5 py-3"
              />
              <a
                href="#form"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Написать размеры
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">Рассчитать кухню</h3>
            <ContactForm
              source={`location-${location.slug}`}
              sourcePage={`/locations/${location.slug}`}
              sourceType="location-region"
              city={location.cityName}
              cityKey={location.slug}
              submitLabel="Рассчитать кухню"
            />
          </div>
        </div>
      </section>
    </>
  );
}
