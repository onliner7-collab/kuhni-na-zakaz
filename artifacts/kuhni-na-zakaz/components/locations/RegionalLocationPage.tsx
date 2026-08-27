import Image from "next/image";
import Link from "@/components/navigation/Link";
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
import { ExploreContextProvider } from "@/components/exploration/ExploreContext";
import { RelatedExplorationRail } from "@/components/exploration/RelatedExplorationRail";
import { LocationVisualExplorer } from "@/components/locations/LocationVisualExplorer";
import { LocationVisualInitialStage } from "@/components/locations/LocationVisualInitialStage";
import { getLocationVisualSeries } from "@/data/location-visual-series";
import { Stage6LocationDecision } from "@/components/locations/Stage6LocationDecision";
import { BorisovPilotPage } from "@/components/locations/borisov/BorisovPilotPage";

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

function getLocalProofItems(location: RegionalLocationData, hasLocalCases: boolean) {
  return [
    {
      title: "Маршрут и выезд",
      text: location.isMinskRegionCity
        ? `${location.cityName}: дату замера и доставки согласуем по адресу, готовности ремонта и составу кухни.`
        : "Для удаленных городов сначала собираем размеры, фото и список техники, затем согласуем замер и логистику.",
    },
    {
      title: "Смета без угадывания",
      text: location.priceNote,
    },
    {
      title: "Что проверяем на замере",
      text: location.measurementText,
    },
    {
      title: "Фото и кейсы",
      text: hasLocalCases
        ? "На странице показываются только проекты, где город в данных портфолио совпадает с этой локацией."
        : "Локальные кейсы не подменяются чужими фото. Пока их нет, страница показывает условия работы и визуальные примеры без ложной привязки.",
    },
  ];
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
    text: "В конце маршрута показываем общий вид гарнитура, чтобы было понятно, к чему ведут замер, материалы и производство.",
    images: [minskOblastStoryImages[0]],
  },
].map((step) => ({ ...step, images: step.images.filter(Boolean) }));

const minskHeroStoryImages = [
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-light-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-light-20260619-mobile.webp",
    mobileSmallSrc: "/uploads/locations/minsk-3d/minsk-hero-light-20260619-mobile-480.webp",
    alt: "Светлый гарнитур на заказ в Минске",
    caption: "Светлый гарнитур",
  },
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-dark-wood-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-dark-wood-20260619-mobile.webp",
    mobileSmallSrc: "/uploads/locations/minsk-3d/minsk-hero-dark-wood-20260619-mobile-480.webp",
    alt: "Темный гарнитур на заказ в Минске с древесной фактурой",
    caption: "Темный гарнитур с древесной фактурой",
  },
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-island-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-island-20260619-mobile.webp",
    mobileSmallSrc: "/uploads/locations/minsk-3d/minsk-hero-island-20260619-mobile-480.webp",
    alt: "Гарнитур для кухни-гостиной с островом на заказ в Минске",
    caption: "Гостиная с островом",
  },
  {
    src: "/uploads/locations/minsk-3d/minsk-hero-floor-to-ceiling-20260619-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-3d/minsk-hero-floor-to-ceiling-20260619-mobile.webp",
    mobileSmallSrc: "/uploads/locations/minsk-3d/minsk-hero-floor-to-ceiling-20260619-mobile-480.webp",
    alt: "Гарнитур до потолка на заказ в Минске",
    caption: "Гарнитур до потолка",
  },
];

const minskSeoDemandClusters = [
  {
    title: "Купить кухню в Минске",
    text: "Базовый сценарий для тех, кто сравнивает магазины, цены и варианты мебели для кухни в Минске.",
    queries: ["купить кухню в минске", "кухня купить минск цена", "где купить кухню минск"],
    links: [
      { href: "/catalog", label: "Каталог кухонь" },
      { href: "/prices", label: "Цены" },
    ],
  },
  {
    title: "Кухни на заказ по размерам",
    text: "Индивидуальный проект, замер, подбор фасадов, столешницы, фурнитуры и монтаж под помещение.",
    queries: ["кухни на заказ в минске", "кухни на заказ в минске цены", "купить кухню модулями минск"],
    links: [
      { href: "/design-proekt-kuhni", label: "3D-проект" },
      { href: "#form", label: "Расчет по размерам" },
    ],
  },
  {
    title: "Недорогие и готовые решения",
    text: "Объясняем, чем отличается готовый гарнитур, модульный набор и проект на заказ в бюджетной комплектации.",
    queries: ["купить кухню в минске недорого", "готовые кухни купить в минске", "кухня дешевая купить минск"],
    links: [
      { href: "/prices", label: "Бюджет и смета" },
      { href: "/catalog/pryamye-kuhni", label: "Прямые кухни" },
    ],
  },
  {
    title: "Угловые кухни",
    text: "Самый частый формат для квартир: угол, рабочий треугольник, хранение и встроенная техника.",
    queries: ["кухня угловая купить в минске", "купить угловую кухню минске недорого", "угловая кухня купить в минске фото"],
    links: [
      { href: "/catalog/uglovye-kuhni", label: "Угловые кухни" },
      { href: "/portfolio", label: "Фото работ" },
    ],
  },
  {
    title: "Материалы, фасады и дизайн",
    text: "Показываем белые, деревянные, МДФ, каменные и минималистичные решения без верхних шкафов.",
    queries: ["кухня мдф купить минск", "кухня деревянная купить минск", "купить белую кухню минск"],
    links: [
      { href: "/materials", label: "Материалы" },
      { href: "/styles", label: "Стили" },
    ],
  },
  {
    title: "Маленькие кухни",
    text: "Решения для студий, узких помещений, кухонь 2,1 метра, линейных гарнитуров и шкафов до потолка.",
    queries: ["купить небольшую кухню в минске", "кухня линейная купить минск", "кухня под потолок маленькая купить минск"],
    links: [
      { href: "/catalog/malenkie-kuhni", label: "Маленькие кухни" },
      { href: "/catalog/kuhni-do-potolka", label: "Кухни до потолка" },
    ],
  },
  {
    title: "Фурнитура и механизмы",
    text: "Показываем, как работают доводчики, выдвижные системы, угловое хранение, подъемные фасады, подсветка и встроенная техника.",
    queries: ["кухня с доводчиками минск", "кухня с выдвижными ящиками на заказ минск", "фурнитура для кухни на заказ минск"],
    links: [
      { href: "/materials/furnitura", label: "Фурнитура" },
      { href: "#minsk-mechanisms", label: "Механизмы кухни" },
    ],
  },
  {
    title: "Замер кухни в Минске",
    text: "Перед расчетом проверяем размеры, углы, высоту, воду, розетки, вентиляцию и обсуждаем планировку с учетом техники.",
    queries: ["замер кухни минск", "кухня на заказ с замером минск", "расчет кухни после замера минск"],
    links: [
      { href: "#minsk-measurement", label: "Как проходит замер" },
      { href: "#form", label: "Заказать расчет" },
    ],
  },
  {
    title: "Производство и монтаж",
    text: "Показываем раскрой, сборку, упаковку, доставку, монтаж шкафов и регулировку фасадов перед сдачей.",
    queries: ["производство кухонь на заказ минск", "монтаж кухни на заказ минск", "кухня с доставкой и установкой минск"],
    links: [
      { href: "#minsk-production", label: "Производство и монтаж" },
      { href: "#form", label: "Заказать расчет" },
    ],
  },
];

const minskAiSearchClusters = [
  {
    title: "Лучший вариант для маленькой кухни",
    text: "Если запрос звучит «Действуй как эксперт и выбери лучший вариант кухни на заказ в Минске для маленькой кухни», сначала проверяем прямую или угловую планировку, шкафы до потолка, встроенную технику, светлые фасады и удобство проходов.",
    queries: [
      "лучший вариант кухни на заказ в Минске для маленькой кухни",
      "кухня на заказ для квартиры-студии Минск",
      "маленькая кухня Минск готовая или на заказ",
    ],
    href: "/catalog/malenkie-kuhni",
  },
  {
    title: "Недорого, быстро и под ключ",
    text: "Для запроса «Найди кухни на заказ в Минске с условием: недорого, быстро и с установкой под ключ» важно считать простую комплектацию, сроки производства, доставку, монтаж и готовность помещения.",
    queries: [
      "кухни на заказ в Минске недорого быстро с установкой под ключ",
      "компания по кухням на заказ в Минске с замером дизайном и монтажом",
      "кухни на заказ Минск под ключ",
    ],
    href: "/prices",
  },
  {
    title: "Сравнение Kuhni.minsk.by и ЗОВ Кухни",
    text: "Запросы «Сравни Kuhni.minsk.by и ЗОВ Кухни в Минске» и «Сравни Kuhni.minsk.by и Кухни ЗОВ по цене, срокам и качеству» лучше разбирать по одинаковой смете: размеры, фасады, столешница, фурнитура, монтаж, гарантия и сроки.",
    queries: [
      "сравнить Kuhni.minsk.by и ЗОВ Кухни в Минске",
      "Kuhni.minsk.by и Кухни ЗОВ цена сроки качество",
      "плюсы и минусы кухонь на заказ от Kuhni.minsk.by",
    ],
    href: "/prices",
  },
  {
    title: "ТОП компаний и чек-лист выбора",
    text: "Для запросов «Составь ТОП-5 компаний по кухням на заказ в Минске» и «Чек-лист: как правильно выбрать компанию по кухням на заказ в Минске» сравнивайте портфолио, договор, прозрачность цены, монтаж, гарантию и реальные условия работы.",
    queries: [
      "топ компаний по кухням на заказ в Минске",
      "чек-лист выбора компании по кухням на заказ в Минске",
      "лучший производитель кухонь на заказ в Минске с рассрочкой",
    ],
    href: "/portfolio",
  },
];

const minskRealProjectSeries = [
  {
    title: "Светлый прямой гарнитур для квартиры",
    text: "Прямой проект в минской квартире: общий вид, второй ракурс, фасады, столешница, открытые ящики и техника с подсветкой.",
    images: [
      ["minsk-project-01-light-straight-obshchiy-vid.webp", "Светлый прямой гарнитур на заказ в Минске, общий вид", "Общий вид"],
      ["minsk-project-01-light-straight-vtoroy-rakurs.webp", "Светлый прямой гарнитур в квартире Минска, второй ракурс", "Второй ракурс"],
      ["minsk-project-01-light-straight-fasady-krupno.webp", "Матовые фасады светлого прямого гарнитура крупным планом", "Фасады крупно"],
      ["minsk-project-01-light-straight-stoleshnitsa-krupno.webp", "Столешница и фартук светлого проекта крупным планом", "Столешница и фартук"],
      ["minsk-project-01-light-straight-otkrytye-yashchiki.webp", "Открытые ящики светлого гарнитура на заказ", "Открытые ящики"],
      ["minsk-project-01-light-straight-tehnika-podsvetka.webp", "Встроенная техника и подсветка светлого гарнитура", "Техника и подсветка"],
    ],
  },
  {
    title: "Угловой гарнитур до потолка",
    text: "Формат для новостройки: угловая компоновка, высокие шкафы, рабочая зона и встроенная техника.",
    images: [
      ["minsk-project-02-corner-ceiling-obshchiy-vid.webp", "Угловой гарнитур до потолка в Минске, общий вид", "Общий вид"],
      ["minsk-project-02-corner-ceiling-vtoroy-rakurs.webp", "Угловой гарнитур до потолка в Минске, второй ракурс", "Второй ракурс"],
      ["minsk-project-02-corner-ceiling-fasady-krupno.webp", "Фасады гарнитура до потолка крупным планом", "Фасады крупно"],
      ["minsk-project-02-corner-ceiling-stoleshnitsa-krupno.webp", "Столешница и фартук углового гарнитура крупным планом", "Столешница и фартук"],
      ["minsk-project-02-corner-ceiling-hranenie-otkryto.webp", "Открытое хранение углового гарнитура до потолка", "Открытое хранение"],
      ["minsk-project-02-corner-ceiling-tehnika-podsvetka.webp", "Встроенная техника и подсветка гарнитура до потолка", "Техника и подсветка"],
    ],
  },
  {
    title: "Темный гарнитур с древесными фасадами",
    text: "Темный проект с древесной фактурой для тех, кто ищет выразительный, но практичный интерьер.",
    images: [
      ["minsk-project-03-dark-wood-obshchiy-vid.webp", "Темный гарнитур с древесными фасадами в Минске, общий вид", "Общий вид"],
      ["minsk-project-03-dark-wood-vtoroy-rakurs.webp", "Темный гарнитур с древесными фасадами, второй ракурс", "Второй ракурс"],
      ["minsk-project-03-dark-wood-fasady-krupno.webp", "Древесные и темные матовые фасады гарнитура крупным планом", "Фасады крупно"],
      ["minsk-project-03-dark-wood-stoleshnitsa-krupno.webp", "Темная столешница гарнитура крупным планом", "Столешница крупно"],
      ["minsk-project-03-dark-wood-otkrytye-yashchiki.webp", "Открытые ящики темного гарнитура на заказ", "Открытые ящики"],
      ["minsk-project-03-dark-wood-tehnika-podsvetka.webp", "Встроенная техника и теплая подсветка темного гарнитура", "Техника и подсветка"],
    ],
  },
  {
    title: "Маленький функциональный гарнитур",
    text: "Компактное решение для студии или небольшой квартиры: хранение, рабочая зона и встроенная техника без перегруза.",
    images: [
      ["minsk-project-04-small-functional-obshchiy-vid.webp", "Маленький функциональный гарнитур на заказ в Минске, общий вид", "Общий вид"],
      ["minsk-project-04-small-functional-vtoroy-rakurs.webp", "Маленький функциональный гарнитур в Минске, второй ракурс", "Второй ракурс"],
      ["minsk-project-04-small-functional-fasady-krupno.webp", "Фасады маленького гарнитура крупным планом", "Фасады крупно"],
      ["minsk-project-04-small-functional-stoleshnitsa-krupno.webp", "Столешница маленького гарнитура крупным планом", "Столешница крупно"],
      ["minsk-project-04-small-functional-hranenie-otkryto.webp", "Открытое хранение маленького гарнитура", "Открытое хранение"],
      ["minsk-project-04-small-functional-tehnika-podsvetka.webp", "Встроенная техника и подсветка маленького гарнитура", "Техника и подсветка"],
    ],
  },
  {
    title: "Гостиная с островом",
    text: "Островной проект для просторной кухни-гостиной: общий вид, детали фасадов, столешница и хранение в острове.",
    images: [
      ["minsk-project-05-island-living-obshchiy-vid.webp", "Гостиная с островом в Минске, общий вид", "Общий вид"],
      ["minsk-project-05-island-living-vtoroy-rakurs.webp", "Гостиная с островом, второй ракурс", "Второй ракурс"],
      ["minsk-project-05-island-living-fasady-krupno.webp", "Фасады островного гарнитура крупным планом", "Фасады крупно"],
      ["minsk-project-05-island-living-ostrov-stoleshnitsa.webp", "Столешница острова и рабочая зона крупным планом", "Остров и столешница"],
      ["minsk-project-05-island-living-yashchiki-ostrova.webp", "Выдвижные ящики острова в гостиной зоне", "Ящики острова"],
      ["minsk-project-05-island-living-tehnika-podsvetka.webp", "Встроенная техника и подсветка островного проекта", "Техника и подсветка"],
    ],
  },
  {
    title: "Современный гарнитур в частном доме",
    text: "Просторное решение для дома рядом с Минском: древесные фасады, каменная столешница и много закрытого хранения.",
    images: [
      ["minsk-project-06-private-house-obshchiy-vid.webp", "Современный гарнитур в частном доме рядом с Минском, общий вид", "Общий вид"],
      ["minsk-project-06-private-house-vtoroy-rakurs.webp", "Современный гарнитур в частном доме, второй ракурс", "Второй ракурс"],
      ["minsk-project-06-private-house-fasady-derevo.webp", "Древесные фасады гарнитура в частном доме крупным планом", "Фасады дерево"],
      ["minsk-project-06-private-house-stoleshnitsa-kamen.webp", "Каменная столешница гарнитура в частном доме крупным планом", "Каменная столешница"],
      ["minsk-project-06-private-house-hranenie-otkryto.webp", "Открытое хранение гарнитура в частном доме", "Открытое хранение"],
      ["minsk-project-06-private-house-tehnika-podsvetka.webp", "Встроенная техника и подсветка гарнитура в частном доме", "Техника и подсветка"],
    ],
  },
].map((project) => ({
  ...project,
  images: project.images.map(([fileName, alt, caption]) => ({
    src: `/uploads/locations/minsk-stage34/${fileName}`,
    alt,
    caption,
  })),
}));

const minskDistrictGroups = [
  {
    title: "Центр и север",
    text: "Центральный, Советский и Первомайский районы: заранее проверяем подъезд, лифт, высоту потолка и доступ к коммуникациям.",
    areas: ["Центральный", "Советский", "Первомайский", "Уручье"],
  },
  {
    title: "Запад Минска",
    text: "Фрунзенский и Московский районы: часто считаем кухни для новостроек, студий и квартир с большим хранением до потолка.",
    areas: ["Фрунзенский", "Московский", "Каменная Горка", "Сухарево"],
  },
  {
    title: "Юг и восток",
    text: "Заводской, Ленинский, Октябрьский и Партизанский районы: согласуем доставку, занос столешницы и монтажный день по адресу.",
    areas: ["Заводской", "Ленинский", "Октябрьский", "Партизанский"],
  },
  {
    title: "Новые кварталы рядом с Минском",
    text: "Новая Боровая и ближайшие жилые комплексы: можно начать с плана застройщика, но производство запускаем после точного замера.",
    areas: ["Новая Боровая", "Копище", "Сеница", "Боровляны"],
  },
];

const minskProcessCards = [
  {
    title: "Замер в Минске",
    text: "Проверяем стены, углы, высоту, воду, электрику, вентиляцию, газовые ограничения и условия заноса деталей.",
    icon: Ruler,
  },
  {
    title: "Доставка по адресу",
    text: "Дату доставки согласуем ближе к монтажу, чтобы комплект не мешал ремонту и приехал к готовому объекту.",
    icon: Truck,
  },
  {
    title: "Монтаж и регулировка",
    text: "Собираем корпуса, навешиваем фасады, устанавливаем столешницу, регулируем механизмы и проверяем открывание.",
    icon: Hammer,
  },
  {
    title: "Сроки по проекту",
    text: "Ориентир зависит от материалов, фурнитуры и сложности кухни; дату производства и монтажа фиксируем после комплектации.",
    icon: ClipboardList,
  },
];

const minskCloseDetailImages = [
  ["minsk-detail-01-matovyy-fasad.webp", "Матовый фасад гарнитура на заказ крупным планом", "Матовый фасад"],
  ["minsk-detail-02-drevesnaya-tekstura.webp", "Древесная текстура фасада крупным планом", "Древесная текстура"],
  ["minsk-detail-03-kamennaya-stoleshnitsa.webp", "Каменная столешница гарнитура крупным планом", "Каменная столешница"],
  ["minsk-detail-04-kromka-fasada.webp", "Кромка кухонного фасада крупным планом", "Кромка фасада"],
  ["minsk-detail-05-profil-bez-ruchek.webp", "Профиль фасада без ручек крупным планом", "Профиль без ручек"],
  ["minsk-detail-06-ruchka-krupno.webp", "Ручка кухонного фасада крупным планом", "Ручка крупным планом"],
  ["minsk-detail-07-petlya-shkafa.webp", "Петля кухонного шкафа крупным планом", "Петля шкафа"],
  ["minsk-detail-08-napravlyayushchie-yashchika.webp", "Направляющие кухонного ящика крупным планом", "Направляющие ящика"],
  ["minsk-detail-09-vydvizhnoy-yashchik-vnutri.webp", "Выдвижной ящик гарнитура внутри", "Выдвижной ящик внутри"],
  ["minsk-detail-10-hranenie-pod-moykoy.webp", "Система хранения под мойкой в гарнитуре на заказ", "Хранение под мойкой"],
  ["minsk-detail-11-yashchik-dlya-priborov.webp", "Внутренний ящик для приборов в гарнитуре на заказ", "Ящик для приборов"],
  ["minsk-detail-12-podsvetka-rabochey-zony.webp", "Подсветка рабочей зоны крупным планом", "Подсветка рабочей зоны"],
  ["minsk-detail-13-styk-stoleshnitsy.webp", "Стык столешницы гарнитура крупным планом", "Стык столешницы"],
  ["minsk-detail-14-vstroennaya-rozetka.webp", "Встроенная розетка в столешнице крупным планом", "Встроенная розетка"],
  ["minsk-detail-15-fasad-i-svet-pod-uglom.webp", "Фасад и теплый свет под углом", "Фасад и свет под углом"],
].map(([fileName, alt, caption]) => ({
  src: `/uploads/locations/minsk-stage34/${fileName}`,
  alt,
  caption,
}));

const minskMechanismImages = [
  {
    title: "Ящики с плавным закрыванием",
    text: "Направляющие и доводчики помогают закрывать тяжелые ящики мягко, без хлопка и перекоса фасада.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-01-plavnoe-zakryvanie-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-01-plavnoe-zakryvanie-square.webp",
    alt: "Ящик с плавным закрыванием в гарнитуре на заказ в Минске",
  },
  {
    title: "Высокий выдвижной шкаф",
    text: "Пенал-карго подходит для запасов, бутылок и круп, когда нужно использовать высоту мебели до потолка.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-02-vysokiy-vydvizhnoy-shkaf-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-02-vysokiy-vydvizhnoy-shkaf-square.webp",
    alt: "Высокий выдвижной шкаф для гарнитура на заказ в Минске",
  },
  {
    title: "Угловой механизм хранения",
    text: "Выдвижные полки в углу дают доступ к глубокой зоне, где обычные полки быстро становятся неудобными.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-03-uglovoy-mehanizm-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-03-uglovoy-mehanizm-square.webp",
    alt: "Угловой механизм хранения в гарнитуре на заказ",
  },
  {
    title: "Подъемный фасад",
    text: "Верхний фасад поднимается вверх и не мешает у рабочей зоны, особенно в компактном помещении.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-04-podemnyy-fasad-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-04-podemnyy-fasad-square.webp",
    alt: "Подъемный фасад верхнего шкафа гарнитура",
  },
  {
    title: "Хранение под мойкой",
    text: "Под раковиной заранее учитываем сифон, фильтр, мусорные контейнеры и бытовую химию.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-05-hranenie-pod-moykoy-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-05-hranenie-pod-moykoy-square.webp",
    alt: "Система хранения под мойкой в нижнем модуле",
  },
  {
    title: "Органайзер для приборов",
    text: "Внутреннее наполнение подбирается под столовые приборы, ножи и ежедневные мелочи, а не случайный размер ящика.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-06-organayzer-dlya-priborov-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-06-organayzer-dlya-priborov-square.webp",
    alt: "Органайзер для приборов в выдвижном ящике гарнитура",
  },
  {
    title: "Встроенный холодильник",
    text: "Фасад закрывает технику в одну линию с мебелью, а проект учитывает вентиляционные зазоры и открывание.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-07-vstroennyy-holodilnik-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-07-vstroennyy-holodilnik-square.webp",
    alt: "Встроенный холодильник за фасадом гарнитура",
  },
  {
    title: "Встроенная посудомойка",
    text: "Посудомоечную машину привязываем к воде, электрике, фасаду и соседним модулям еще на этапе проекта.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-08-vstroennaya-posudomoyka-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-08-vstroennaya-posudomoyka-square.webp",
    alt: "Встроенная посудомоечная машина за фасадом гарнитура",
  },
  {
    title: "Подсветка рабочей зоны",
    text: "Подсветка под верхними шкафами помогает готовить без тени от человека и делает рабочую зону спокойнее вечером.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-09-podsvetka-rabochey-zony-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-09-podsvetka-rabochey-zony-square.webp",
    alt: "Подсветка рабочей зоны гарнитура на заказ",
  },
  {
    title: "Выдвижная корзина",
    text: "Узкие модули можно использовать под масла, соусы, бутылки и хозяйственные мелочи рядом с рабочей зоной.",
    mobileSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-10-vydvizhnaya-korzina-mobile.webp",
    squareSrc: "/uploads/locations/minsk-stage56/minsk-mechanism-10-vydvizhnaya-korzina-square.webp",
    alt: "Выдвижная корзина в нижнем шкафу гарнитура",
  },
];

const minskMeasurementImages = [
  {
    title: "Выезд на адрес",
    text: "Замерщик приезжает в квартиру или дом, уточняет готовность стен и фиксирует исходные условия помещения.",
    src: "/uploads/locations/minsk-stage56/minsk-measurement-01-vhod-v-kvartiru-mobile.webp",
    alt: "Замерщик входит в квартиру для замера мебели в Минске",
  },
  {
    title: "Лазерный замер стен",
    text: "Проверяем длину стен, проемы, выступы и расстояния, чтобы проект не расходился с реальным помещением.",
    src: "/uploads/locations/minsk-stage56/minsk-measurement-02-lazernaya-ruletka-mobile.webp",
    alt: "Замер стен лазерной рулеткой перед проектом гарнитура",
  },
  {
    title: "Углы и высота",
    text: "Отдельно смотрим углы, высоту потолка, перепады и места, где шкафы до потолка требуют запаса.",
    src: "/uploads/locations/minsk-stage56/minsk-measurement-03-ugly-i-vysota-mobile.webp",
    alt: "Проверка углов и высоты потолка перед заказом гарнитура",
  },
  {
    title: "Вода, розетки, вентиляция",
    text: "Сверяем выводы воды, электрику и вентиляционный канал, чтобы техника, мойка и вытяжка встали без переделок.",
    src: "/uploads/locations/minsk-stage56/minsk-measurement-04-kommunikatsii-mobile.webp",
    alt: "Проверка воды, розеток и вентиляции перед проектом гарнитура",
  },
  {
    title: "Обсуждение планировки",
    text: "После замера согласуем логику хранения, расположение техники, высоту рабочей зоны и важные привычки семьи.",
    src: "/uploads/locations/minsk-stage56/minsk-measurement-05-obsuzhdenie-planirovki-mobile.webp",
    alt: "Обсуждение планировки гарнитура с клиентом после замера",
  },
];

const minskProductionImages = [
  {
    title: "Раскрой мебельных деталей",
    text: "Детали режутся под проект, чтобы размеры модулей совпадали с замером и будущей планировкой.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-01-raskroy-detalei-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-01-raskroy-detalei-mobile.webp",
    alt: "Раскрой мебельных деталей для гарнитура на заказ в чистой мастерской",
  },
  {
    title: "Сборка корпуса гарнитура",
    text: "Корпуса собираются и проверяются до доставки, чтобы на объекте монтаж шел быстрее и аккуратнее.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-02-sborka-korpusa-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-02-sborka-korpusa-mobile.webp",
    alt: "Сборка корпуса гарнитура на заказ в мебельной мастерской",
  },
  {
    title: "Установка фасадов",
    text: "Фасады примеряются по месту, после чего мастер проверяет зазоры, петли и линию открывания.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-03-ustanovka-fasadov-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-03-ustanovka-fasadov-mobile.webp",
    alt: "Установка фасадов гарнитура на заказ в квартире в Минске",
  },
  {
    title: "Проверка кромки и деталей",
    text: "Кромка и торцы осматриваются отдельно: это влияет на внешний вид, долговечность и ощущение качества.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-04-proverka-kromki-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-04-proverka-kromki-mobile.webp",
    alt: "Проверка кромки и мебельных деталей перед сборкой гарнитура",
  },
  {
    title: "Комплектация перед доставкой",
    text: "Модули, крепеж и фурнитура собираются в комплект, защищаются упаковкой и готовятся к выезду.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-05-komplektatsiya-pered-dostavkoy-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-05-komplektatsiya-pered-dostavkoy-mobile.webp",
    alt: "Комплектация и упаковка кухонных модулей перед доставкой",
  },
  {
    title: "Доставка мебельных модулей",
    text: "Упакованные модули заносятся аккуратно, с учетом лифта, подъезда, этажа и защиты поверхностей.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-06-dostavka-moduley-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-06-dostavka-moduley-mobile.webp",
    alt: "Доставка упакованных мебельных модулей в квартиру в Минске",
  },
  {
    title: "Монтаж шкафов",
    text: "Шкафы выставляются по уровню, крепятся к стенам и собираются в единую линию будущего гарнитура.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-07-montazh-shkafov-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-07-montazh-shkafov-mobile.webp",
    alt: "Монтаж верхних шкафов гарнитура на заказ в современной квартире",
  },
  {
    title: "Регулировка фасадов",
    text: "После монтажа проверяются зазоры, доводчики, направляющие и плавность открывания ящиков и дверей.",
    desktopSrc: "/uploads/locations/minsk-stage78/minsk-production-08-regulirovka-fasadov-desktop.webp",
    mobileSrc: "/uploads/locations/minsk-stage78/minsk-production-08-regulirovka-fasadov-mobile.webp",
    alt: "Регулировка фасадов и проверка механизмов после монтажа гарнитура",
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
  if (location.slug === "minsk") return "Заказ гарнитура в Минске";

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
      text: "Подбираем прямую, угловую, П-образную компоновку, вариант до потолка или решение с островом под реальный сценарий, а не под случайный набор модулей.",
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
  const localProofItems = getLocalProofItems(location, hasLocalCases);
  const cityIdeas = getKitchenIdeas3DForCity(location.slug);
  const heroIdea = cityIdeas[0];
  const isMinsk = location.slug === "minsk";
  const isBorisov = location.slug === "borisov";
  const visualSeries = getLocationVisualSeries(`/locations/${location.slug}`);
  const minskHeroImage = "/uploads/locations/minsk-3d/minsk-hero-light-20260619-desktop.webp";
  const minskHeroMobileImage = "/uploads/locations/minsk-3d/minsk-hero-mobile-background-20260620.webp";
  const minskHeroMobileSmallImage = "/uploads/locations/minsk-3d/minsk-hero-mobile-background-20260620-480.webp";
  const borisovHeroImage = "/uploads/locations/borisov-3d/borisov-hero-bright-20260628.webp";
  const borisovHeroMobileImage = "/uploads/locations/borisov-3d/borisov-hero-bright-mobile-20260628.webp";
  const borisovHeroMobileSmallImage = "/uploads/locations/borisov-3d/borisov-hero-bright-mobile-20260628-480.webp";
  const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  const heroImage = isMinsk ? minskHeroImage : isBorisov ? borisovHeroImage : heroIdea?.image ?? "/images/hero.webp";
  const heroAlt = isMinsk
    ? "Купить кухню на заказ в Минске, светлый гарнитур под размер"
    : isBorisov
    ? "Купить кухню на заказ в Борисове, фоновая визуализация гарнитура"
    : heroIdea?.alt ?? `Кухня на заказ в ${location.cityPrepositional}`;
  const phoneHref = `tel:${CONTACT_DEFAULTS.phone}`;
  const buyKitchenAnchor = getBuyKitchenAnchor(location);
  const purchaseScenarioCards = getPurchaseScenarioCards(location);
  const workSectionTitle =
    location.slug === "minsk"
      ? "Купить кухню на заказ в Минске: замер, проект и монтаж"
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

  if (isBorisov) {
    return (
      <BorisovPilotPage
        location={location}
        cases={cases}
        hasLocalCases={hasLocalCases}
        // Борисовский пилот не наследует общий Service/Offer/LocalBusiness schema:
        // адрес, цена и локальные условия не подтверждены для этой страницы.
        jsonLd={[jsonLdBreadcrumb].filter(isJsonLdObject)}
      />
    );
  }

  return (
    <ExploreContextProvider sourceRoute={`/locations/${location.slug}`}>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdFaq, jsonLdService].filter(isJsonLdObject)} />

      {visualSeries ? (
        <section id="location-prices" className="bg-stone-950 py-5 text-white md:py-8">
          <div className="container-site">
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/72" aria-label="Хлебные крошки">
              <Link href="/" className="hover:text-white">Главная</Link>
              <span>/</span>
              <Link href="/locations" className="hover:text-white">Города</Link>
              <span>/</span>
              <span className="text-white">{location.cityName}</span>
            </nav>
            <div className="mb-5 max-w-3xl">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-violet-200">{location.regionName}</p>
              <h1 className="font-serif text-3xl font-bold leading-tight md:text-5xl">{location.h1}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/78 md:text-lg">{visualSeries.uniquePromise}</p>
            </div>
            <LocationVisualExplorer
              config={visualSeries}
              initialStage={
                <LocationVisualInitialStage
                  state={visualSeries.states.find((state) => state.id === visualSeries.initialStateId) ?? visualSeries.states[0]}
                />
              }
            />
          </div>
        </section>
      ) : (
      <section id="location-prices" className="relative overflow-hidden bg-stone-950 text-white">
        {isMinskRegionHub ? (
          <div className="absolute inset-0">
            <picture>
              <img
                src="/uploads/locations/minskaya-oblast/minskaya-oblast-hero-desktop.webp"
                alt="Кухня на заказ для дома в Минской области"
                fetchPriority="high"
                className="h-full w-full object-contain object-top md:object-right"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-black/42 via-black/34 to-black/78 md:bg-gradient-to-r md:from-black/42 md:via-black/18 md:to-black/24" />
          </div>
        ) : (
          <div
            className={
              isMinsk
                ? "absolute inset-x-0 top-0 h-[100svh] opacity-40 md:inset-0 md:h-auto md:opacity-28"
                : isBorisov
                ? "absolute inset-x-0 top-0 h-[100svh] opacity-[0.5] md:inset-0 md:h-auto md:opacity-[0.46]"
                : "absolute inset-0 opacity-28"
            }
          >
            {isMinsk ? (
              <picture>
                <source media="(max-width: 767px)" srcSet={minskHeroMobileSmallImage} />
                <img
                  src={heroImage}
                  alt={heroAlt}
                  fetchPriority="high"
                  className="h-full w-full object-contain object-top md:object-cover md:object-center"
                />
              </picture>
            ) : isBorisov ? (
              <>
                <picture className="absolute inset-0 md:hidden">
                  <source media="(max-width: 480px)" srcSet={borisovHeroMobileSmallImage} />
                  <source media="(max-width: 767px)" srcSet={borisovHeroMobileImage} />
                  <img
                    src={transparentPixel}
                    alt={heroAlt}
                    fetchPriority="high"
                    className="h-full w-full object-contain object-top"
                  />
                </picture>
                <picture className="absolute inset-0 hidden md:block">
                  <source media="(min-width: 768px)" srcSet={heroImage} />
                  <img
                    src={transparentPixel}
                    alt={heroAlt}
                    fetchPriority="high"
                    className="h-full w-full object-contain"
                  />
                </picture>
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
      )}

      {(isMinsk || isMinskRegionHub) && (
        <Stage6LocationDecision mode={isMinsk ? "minsk" : "minskaya-oblast"} />
      )}
      <section className="bg-white py-8"><div className="container-site"><RelatedExplorationRail route={`/locations/${location.slug}`} state="RESULT" /></div></section>

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
              eyebrow="Шаг 1"
              title="Выбор кухни, планировки и бюджета"
              text="Сначала выбираем тип гарнитура под помещение: прямой, угловой, до потолка, маленький, с островом или встроенной техникой. На этом этапе удобно сравнить каталог кухонь в Минске, материалы, фасады, столешницы, фурнитуру, готовые решения и ориентир цены перед точным расчетом."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {minskHeroStoryImages.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-lg border border-border bg-muted/20"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-900 md:aspect-[16/10]">
                    <picture>
                      <source
                        media="(max-width: 767px)"
                        srcSet={image.mobileSmallSrc}
                      />
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

      {isMinsk && (
        <section className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="AI-запросы"
              title="Как выбрать компанию по кухням на заказ в Минске"
              text="Ниже собраны естественные формулировки, с которыми покупатели обращаются к AI-ассистентам: сравнение компаний, выбор для маленькой кухни, поиск под ключ и проверка цены. Ответ должен вести к страницам с фактами, а не к неподтвержденным обещаниям."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {minskAiSearchClusters.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-white p-5">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.queries.map((query) => (
                      <span key={query} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {query}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Смотреть раздел <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section className="bg-white section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Шаг 1"
              title="Материалы, фасады, столешницы и фурнитура крупным планом"
              text="После выбора формы смотрим комплектацию: МДФ, белые и древесные фасады, каменную столешницу, профиль без ручек, петли, направляющие, хранение, подсветку и встроенные розетки. Эти решения влияют на цену кухни на заказ в Минске и помогают заранее понять, где можно собрать недорогой вариант, а где лучше не экономить."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {minskCloseDetailImages.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-lg border border-border bg-white shadow-sm"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1200}
                      height={1200}
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <BrandedImageWatermark compact />
                  </div>
                  <figcaption className="px-3 py-3 text-sm font-semibold text-foreground">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section id="minsk-mechanisms" className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Шаг 1"
              title="Механизмы и наполнение гарнитура на заказ"
              text="На выборе комплектации фиксируем доводчики, выдвижные ящики, угловые механизмы, хранение под мойкой, встроенную технику, подсветку и выдвижные системы. Так запросы вроде кухни с доводчиками, фурнитура для кухни на заказ и кухня с выдвижными ящиками в Минске переходят в понятные фото и решения."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {minskMechanismImages.map((image) => (
                <figure
                  key={image.mobileSrc}
                  className="overflow-hidden rounded-lg border border-border bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f4ec] sm:aspect-square">
                    <picture>
                      <source media="(min-width: 640px)" srcSet={image.squareSrc} />
                      <img
                        src={image.mobileSrc}
                        alt={image.alt}
                        width={1080}
                        height={1350}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw"
                        className="h-full w-full object-contain transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </picture>
                    <BrandedImageWatermark compact />
                  </div>
                  <figcaption className="px-3 py-3">
                    <h3 className="text-sm font-semibold text-foreground">{image.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{image.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section id="minsk-measurement" className="bg-white section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Шаг 2"
              title="Как проходит замер мебели в Минске"
              text="После выбора приезжаем на замер кухни в Минске: проверяем ширину, высоту, углы, воду, розетки, вентиляцию, открывание фасадов и сценарий будущего гарнитура. Расчет кухни после замера точнее, потому что проект уже опирается на реальные размеры помещения."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {minskMeasurementImages.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden rounded-lg border border-border bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f4ec]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={1080}
                      height={1350}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="h-full w-full object-contain transition-transform duration-500 hover:scale-[1.02]"
                    />
                    <BrandedImageWatermark compact />
                  </div>
                  <figcaption className="px-3 py-3">
                    <h3 className="text-sm font-semibold text-foreground">{image.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{image.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section id="minsk-districts" className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Районы Минска"
              title="Кухни на заказ по районам Минска"
              text="Работаем по всем районам города. Условия замера, доставки, заноса и монтажа уточняем по конкретному адресу, этажу, готовности ремонта и составу кухни."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {minskDistrictGroups.map((group) => (
                <article key={group.title} className="rounded-lg border border-border bg-white p-5">
                  <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.areas.map((area) => (
                      <span key={area} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {area}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex min-h-10 items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary">
                Главная
              </Link>
              <Link href="/catalog" className="inline-flex min-h-10 items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary">
                Каталог
              </Link>
              <Link href="/prices" className="inline-flex min-h-10 items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary">
                Цены
              </Link>
              <Link href="/catalog/uglovye-kuhni" className="inline-flex min-h-10 items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary">
                Угловые кухни
              </Link>
              <Link href="/portfolio" className="inline-flex min-h-10 items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary">
                Портфолио Минска
              </Link>
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section id="minsk-delivery-installation" className="bg-white section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Локальный процесс"
              title="Замер, доставка, монтаж и сроки по Минску"
              text="Минская страница отвечает за локальную услугу: как проходит выезд, когда привозим кухню, что входит в монтаж и почему сроки фиксируются после комплектации."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {minskProcessCards.map(({ title, text, icon: Icon }) => (
                <article key={title} className="rounded-lg border border-border bg-muted/30 p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section id="minsk-production" className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Шаг 3"
              title="Производство, доставка и монтаж"
              text="После проекта заказ уходит в производство кухонь на заказ: раскрой деталей, сборка корпуса, проверка кромки, комплектация, доставка, монтаж шкафов и регулировка фасадов. Здесь закрываются запросы про кухню с доставкой и установкой в Минске без отдельного повторяющегося текстового блока."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {minskProductionImages.map((image) => (
                <figure
                  key={image.desktopSrc}
                  className="overflow-hidden rounded-lg border border-border bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f4ec] sm:aspect-video">
                    <picture>
                      <source media="(min-width: 640px)" srcSet={image.desktopSrc} />
                      <img
                        src={image.mobileSrc}
                        alt={image.alt}
                        width={1080}
                        height={1350}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </picture>
                    <BrandedImageWatermark compact />
                  </div>
                  <figcaption className="px-3 py-3">
                    <h3 className="text-sm font-semibold text-foreground">{image.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{image.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMinsk && (
        <section className="bg-white section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Шаг 4"
              title="Готовый результат: фото гарнитуров на заказ в Минске"
              text="Финальный блок показывает результат после выбора, замера, производства и монтажа: прямой гарнитур, угловую компоновку до потолка, темные древесные фасады, компактное решение, остров и современный проект для дома. Здесь же остаются запросы про купить кухню в Минске, угловую кухню, маленькую кухню, кухню до потолка и фото готовых работ."
            />
            <div className="space-y-12">
              {minskRealProjectSeries.map((project) => (
                <div key={project.title}>
                  <SectionTitle title={project.title} text={project.text} />
                  <RegionalVisualStoryGallery images={project.images} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isMinsk && (
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
      )}

      {!isMinsk && (
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
      )}

      {!isMinsk && (
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
              Выбрать тип гарнитура
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
      )}

      {location.isMinskRegionCity && !isMinskRegionHub && !isMinsk && (
        <section className="bg-muted/30 section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Каталог и цена"
              title={
                isMinsk
                  ? "Каталог, угловые варианты и расчет цены в Минске"
                  : `Купить кухню в ${location.cityPrepositional}: каталог, угловые варианты и расчет цены`
              }
              text={`Для ${location.cityGenitive} удобнее начинать не с общей фразы, а с формата проекта: угловой, прямой, компактный, до потолка или со встроенной техникой. Каталог помогает выбрать направление, а расчет показывает реальную цену под размеры помещения.`}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/catalog"
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  Каталог решений
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Посмотрите основные типы гарнитуров и выберите основу для проекта в {location.cityPrepositional}.
                </p>
              </Link>
              <Link
                href="/catalog/uglovye-kuhni"
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  Угловой вариант недорого
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Сравним цену углового решения по размерам, фасадам, столешнице, фурнитуре и монтажу.
                </p>
              </Link>
              <Link
                href="/prices"
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <h3 className="mb-3 text-base font-semibold text-foreground">
                  Цена проекта в {location.cityPrepositional}
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

      {!isMinsk && (
        <KitchenIdeas3DSection
          cityName={location.cityName}
          citySlug={location.slug}
          cityPrepositional={location.cityPrepositional}
          titleSubject={location.cityGenitive}
        />
      )}

      {!isMinsk && (
      <section className="bg-white section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Логистика"
            title="Замер, доставка и монтаж"
            text="Каждый региональный заказ считаем по фактическому адресу, готовности ремонта и составу мебели."
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
      )}

      {!isMinskRegionHub && (
        <section className="bg-white section-padding">
          <div className="container-site">
            <SectionTitle
              eyebrow="Локальные условия"
              title={`Что уточнить для кухни в ${location.cityPrepositional}`}
              text="Этот блок отделяет реальные условия заказа от шаблонных обещаний: маршрут, замер, смета, доставка и статус локальных кейсов проверяются по конкретной заявке."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {localProofItems.map((item) => (
                <article key={item.title} className="rounded-lg border border-border bg-muted/30 p-5">
                  <h3 className="mb-3 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { href: "/prices", label: "Цены и смета" },
                { href: "/calculator", label: "Калькулятор" },
                { href: "/portfolio", label: "Портфолио" },
                { href: "/warranty", label: "Гарантия" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {!isMinsk && (
      <section className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="Решения"
            title={popularSectionTitle}
            text="Это не фиктивные кейсы, а типы гарнитуров, которые можно рассмотреть для похожих помещений."
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
      )}

      <section id="location-projects" className="bg-white section-padding">
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

      <section id="location-faq" className="bg-muted/30 section-padding">
        <div className="container-site">
          <SectionTitle
            eyebrow="FAQ"
            title={isMinsk ? "Частые вопросы по заказу в Минске" : `Частые вопросы о кухнях в ${location.cityPrepositional}`}
          />
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
                text="Выбор зависит от объекта: квартира, дом, дача, гостиная зона или компактное помещение после ремонта."
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
              Рассчитать гарнитур в {location.cityPrepositional}
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
            <h3 className="mb-4 text-xl font-semibold text-white">Рассчитать гарнитур</h3>
            <ContactForm
              source={`location-${location.slug}`}
              sourcePage={`/locations/${location.slug}`}
              sourceType="location-region"
              city={location.cityName}
              cityKey={location.slug}
              submitLabel="Рассчитать гарнитур"
            />
          </div>
        </div>
      </section>
    </ExploreContextProvider>
  );
}
