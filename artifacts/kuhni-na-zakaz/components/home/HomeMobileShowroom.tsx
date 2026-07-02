"use client";

import Image from "next/image";
import Link from "@/components/navigation/Link";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Factory,
  FileCheck,
  Images,
  LayoutGrid,
  MapPin,
  MessageCircle,
  MoveHorizontal,
  Palette,
  PenTool,
  Ruler,
  Star,
  Sparkles,
  Truck,
} from "lucide-react";
import { type ComponentType, type SVGProps, useCallback, useEffect, useMemo, useState } from "react";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { ContactForm } from "@/components/sections/ContactForm";
import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { GENERATED_MINSK_PORTFOLIO_CASES } from "@/data/portfolio-projects";

interface HomeProjectCard {
  id: number | string;
  slug: string;
  title: string;
  city: string | null;
  kitchenType: string | null;
  style: string | null;
  material: string | null;
  area: number | null;
  size: string | null;
  priceFrom: number;
  mainImage: string | null;
}

interface HomeMobileShowroomProps {
  projects: HomeProjectCard[];
  reviews: HomeReviewCard[];
  faqs: HomeFaqItem[];
  locations: HomeLocationCard[];
}

interface HomeReviewCard {
  id: number | string;
  name: string;
  city: string | null;
  date: string | null;
  text: string;
  rating: number;
  image?: string | null;
}

interface HomeFaqItem {
  id: number | string;
  question: string;
  answer: string;
}

interface HomeLocationCard {
  slug: string;
  city: string;
  region: string | null;
  priceFrom: number;
}

type HomeNavId = "selector" | "projects" | "prices" | "calculate";

interface HomeNavItem {
  id: HomeNavId;
  label: string;
  href: `#${HomeNavId}`;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface LayoutOption {
  id: string;
  title: string;
  href: string;
  image: string;
  alt: string;
  benefit: string;
  schema: "straight" | "corner" | "u" | "island" | "small" | "living" | "ceiling";
}

const heroImage = "/uploads/seo-showcase/home-hero-dark-kitchen-2026.webp";
const heroMobileImage = "/uploads/seo-showcase/home-hero-mobile-kitchen-2026-480.webp";

const styleOptions = [
  {
    id: "light",
    title: "Светлая и воздушная",
    image: "/images/design-proekt-kuhni/config-style-light.webp",
    alt: "Светлая кухня на заказ в Минске с мягкими фасадами и рабочей зоной",
    href: "/catalog/pryamye-kuhni",
  },
  {
    id: "dark",
    title: "Тёмная и статусная",
    image: "/images/design-proekt-kuhni/config-style-dark.webp",
    alt: "Тёмная премиальная кухня на заказ с подсветкой и встроенной техникой",
    href: "/catalog/kuhni-s-ostrovom",
  },
  {
    id: "wood",
    title: "Тёплая с деревом",
    image: "/images/design-proekt-kuhni/config-style-warm-wood.webp",
    alt: "Кухня с древесными фасадами и тёплой подсветкой для квартиры",
    href: "/materials/ldsp",
  },
  {
    id: "minimal",
    title: "Современный минимализм",
    image: "/images/design-proekt-kuhni/config-style-modern-minimalism.webp",
    alt: "Современная минималистичная кухня без визуального шума",
    href: "/catalog/kuhni-bez-ruchek",
  },
];

const layoutOptions: LayoutOption[] = [
  {
    id: "straight",
    title: "Прямая",
    href: "/catalog/pryamye-kuhni",
    image: "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp",
    alt: "Прямая кухня на заказ для квартиры в Минске",
    benefit: "Для узких комнат, студий и лаконичных гарнитуров вдоль одной стены.",
    schema: "straight",
  },
  {
    id: "corner",
    title: "Угловая",
    href: "/catalog/uglovye-kuhni",
    image: "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya.webp",
    alt: "Угловая кухня на заказ с рабочим треугольником и хранением",
    benefit: "Помогает задействовать угол и увеличить рабочую поверхность.",
    schema: "corner",
  },
  {
    id: "u",
    title: "П-образная",
    href: "/catalog/p-obraznye-kuhni",
    image: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp",
    alt: "П-образная кухня на заказ с большой рабочей зоной",
    benefit: "Подходит, когда нужно много хранения и отдельные зоны готовки.",
    schema: "u",
  },
  {
    id: "island",
    title: "С островом",
    href: "/catalog/kuhni-s-ostrovom",
    image: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp",
    alt: "Кухня с островом на заказ для просторного помещения",
    benefit: "Добавляет рабочую поверхность, барную зону и место общения.",
    schema: "island",
  },
  {
    id: "small",
    title: "Маленькая кухня",
    href: "/catalog/malenkie-kuhni",
    image: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp",
    alt: "Маленькая кухня на заказ для квартиры и хрущёвки",
    benefit: "Выжимает максимум хранения из 5-7 м² без перегруза.",
    schema: "small",
  },
  {
    id: "living",
    title: "Кухня-гостиная",
    href: "/catalog/kuhnya-dlya-studii-minsk",
    image: "/images/design-proekt-kuhni/3d-proekt-kuhnya-gostinaya-mobile.webp",
    alt: "Кухня-гостиная на заказ с единой зоной готовки и отдыха",
    benefit: "Объединяет готовку, хранение и обеденную зону в одном сценарии.",
    schema: "living",
  },
  {
    id: "ceiling",
    title: "Кухня до потолка",
    href: "/catalog/kuhni-do-potolka",
    image: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
    alt: "Кухня до потолка на заказ с высокими шкафами",
    benefit: "Даёт больше хранения и закрывает верхнюю пыльную зону.",
    schema: "ceiling",
  },
];

const budgetOptions = [
  {
    id: "to-2000",
    title: "До 2 000 BYN",
    level: "Базовая комплектация",
    materials: "ЛДСП, простая фурнитура, прямая или компактная угловая форма.",
  },
  {
    id: "2000-4000",
    title: "2 000-4 000 BYN",
    level: "Практичный средний сегмент",
    materials: "МДФ, HPL, доводчики, продуманное хранение и подсветка по задаче.",
  },
  {
    id: "4000-7000",
    title: "4 000-7 000 BYN",
    level: "Сильный визуальный проект",
    materials: "Фасады до потолка, сложная столешница, встроенная техника, HPL или эмаль.",
  },
  {
    id: "7000-plus",
    title: "От 7 000 BYN",
    level: "Премиальная комплектация",
    materials: "Остров, шпон, сложная фурнитура, индивидуальные узлы и расширенный монтаж.",
  },
];

const materialCards = [
  {
    title: "МДФ фасады",
    href: "/materials/mdf-fasady",
    image: "/images/materials-gallery-v2/mdf-emal/mdf-emal-c-macro.webp",
    alt: "МДФ фасады для кухни крупным планом",
    features: ["Ровная окраска", "Можно фрезеровать", "Хорошо для неоклассики"],
    example: "Используем в светлых и цветных кухнях до потолка.",
  },
  {
    title: "ЛДСП",
    href: "/materials/ldsp",
    image: "/images/materials-gallery-v2/ldsp/ldsp-c-macro.webp",
    alt: "ЛДСП для корпуса и фасадов кухни крупным планом",
    features: ["Понятный бюджет", "Много декоров", "Практичный корпус"],
    example: "Подходит для базовой и средней комплектации.",
  },
  {
    title: "Пластик HPL",
    href: "/materials/plastik-hpl",
    image: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-c-macro.webp",
    alt: "Пластик HPL для кухонных фасадов крупным планом",
    features: ["Практичная поверхность", "Для активной готовки", "Современные фасады"],
    example: "Хорошо работает в минимализме и кухнях-гостиных.",
  },
  {
    title: "Столешницы",
    href: "/materials",
    image: "/images/blog/generated-guides/quote-countertop-sink-20260614.webp",
    alt: "Столешница кухни с мойкой и рабочей зоной",
    features: ["Рабочая зона", "Защита от влаги", "Подбор под фасады"],
    example: "Считаем вместе с мойкой, техникой и пристеночным бортиком.",
  },
  {
    title: "Фурнитура",
    href: "/materials/furnitura",
    image: "/images/materials-gallery-v2/furnitura/furniture-drawers-high-pot-drawer-in-use-04.webp",
    alt: "Кухонная фурнитура и выдвижной ящик крупным планом",
    features: ["Плавный ход", "Полное выдвижение", "Системы хранения"],
    example: "Влияет на удобство кухни сильнее, чем кажется по фото.",
  },
  {
    title: "Подсветка",
    href: "/materials/furnitura",
    image: "/images/materials-gallery-v2/furnitura/furniture-lighting-led-profile-installed-03.webp",
    alt: "LED-подсветка рабочей зоны кухни крупным планом",
    features: ["Свет на столешнице", "Тёплая атмосфера", "Профили и выключатели"],
    example: "Добавляем в рабочую зону, витрины и декоративные ниши.",
  },
];

const orderSteps = [
  {
    number: "01",
    title: "Заявка",
    text: "Вы оставляете телефон, город и пару пожеланий по будущей кухне.",
    image: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.avif",
    alt: "Светлая прямая кухня на заказ как пример для первичной заявки",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Консультация",
    text: "Уточняем стиль, планировку, технику, сроки и ориентир по бюджету.",
    image: "/uploads/seo-showcase/kuhnya-skandi-svetlaya-1.avif",
    alt: "Светлая кухня для консультации по стилю и планировке",
    icon: FileCheck,
  },
  {
    number: "03",
    title: "Замер",
    text: "Проверяем размеры, коммуникации, окна, вентиляцию и будущую технику.",
    image: "/images/home-showroom/left-window-linear-before-20260701.webp",
    alt: "Помещение кухни до замера и проектирования гарнитура",
    icon: Ruler,
  },
  {
    number: "04",
    title: "3D-проект",
    text: "Показываем фасады, хранение, проходы и рабочие зоны до запуска.",
    image: "/images/design-proekt-kuhni/3d-proekt-kuhni-hero.webp",
    alt: "3D-проект кухни перед производством",
    icon: PenTool,
  },
  {
    number: "05",
    title: "Производство",
    text: "Изготавливаем корпус, фасады и детали под утвержденные размеры.",
    image: "/uploads/seo-showcase/kuhnya-do-potolka-1.avif",
    alt: "Кухня до потолка как пример производственного проекта",
    icon: Factory,
  },
  {
    number: "06",
    title: "Доставка",
    text: "Согласуем дату, адрес, занос и условия работы по Минску или региону.",
    image: "/uploads/seo-showcase/portfolio-minsk-uglovaya-1.avif",
    alt: "Угловая кухня в Минске после доставки и установки",
    icon: Truck,
  },
  {
    number: "07",
    title: "Монтаж",
    text: "Собираем гарнитур, выставляем фасады, проверяем фурнитуру и узлы.",
    image: "/images/home-showroom/left-window-linear-after-20260701.webp",
    alt: "Готовая кухня после монтажа в квартире",
    icon: LayoutGrid,
  },
  {
    number: "08",
    title: "Гарантия",
    text: "Фиксируем условия в договоре и остаемся на связи после установки.",
    image: "/uploads/seo-showcase/kuhnya-neoklassika-1.avif",
    alt: "Готовая кухня с гарантийными условиями по договору",
    icon: BadgeCheck,
  },
];

const priceCards = [
  {
    title: "Прямые кухни",
    price: "от 1 200 BYN",
    href: "/catalog/pryamye-kuhni",
    image: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.avif",
    alt: "Прямая светлая кухня на заказ в Минске",
    text: "Для студий, вытянутых комнат и спокойных проектов вдоль одной стены.",
  },
  {
    title: "Угловые кухни",
    price: "от 1 800 BYN",
    href: "/catalog/uglovye-kuhni",
    image: "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.avif",
    alt: "Угловая кухня на заказ с современными фасадами",
    text: "Помогают задействовать угол, увеличить хранение и рабочую поверхность.",
  },
  {
    title: "П-образные кухни",
    price: "от 3 500 BYN",
    href: "/catalog/p-obraznye-kuhni",
    image: "/uploads/seo-showcase/kuhnya-p-obraznaya-premium-1.avif",
    alt: "П-образная премиальная кухня на заказ",
    text: "Для помещений, где нужна большая рабочая зона и много модулей.",
  },
  {
    title: "Кухни с островом",
    price: "от 4 500 BYN",
    href: "/catalog/kuhni-s-ostrovom",
    image: "/uploads/seo-showcase/kuhnya-s-ostrovom-1.avif",
    alt: "Кухня с островом на заказ для просторной кухни-гостиной",
    text: "Подходят для кухни-гостиной, барной зоны и семейного общения.",
  },
  {
    title: "Маленькие кухни",
    price: "от 900 BYN",
    href: "/catalog/malenkie-kuhni",
    image: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.avif",
    alt: "Маленькая функциональная кухня на заказ",
    text: "Для хрущевок, студий и квартир, где каждый сантиметр важен.",
  },
  {
    title: "Кухни до потолка",
    price: "от 2 200 BYN",
    href: "/catalog/kuhni-do-potolka",
    image: "/uploads/seo-showcase/kuhnya-do-potolka-1.avif",
    alt: "Кухня до потолка с высокими шкафами на заказ",
    text: "Дают больше хранения и закрывают верхнюю зону от пыли.",
  },
];

const fallbackFaqItems: HomeFaqItem[] = [
  {
    id: "price",
    question: "Сколько стоит кухня на заказ?",
    answer: "Стоимость зависит от размеров, материалов, фурнитуры, столешницы, техники, доставки и монтажа. Точный расчет делаем после размеров и комплектации.",
  },
  {
    id: "term",
    question: "Как долго изготавливается кухня?",
    answer: "Ориентир по срокам зависит от сложности проекта и выбранных материалов. Для стандартных кухонь минимальный срок начинается от 14 рабочих дней.",
  },
  {
    id: "size",
    question: "Можно ли заказать кухню по своим размерам?",
    answer: "Да. Гарнитур проектируется под конкретное помещение, коммуникации, высоту потолка, технику и сценарии хранения.",
  },
  {
    id: "delivery",
    question: "Есть ли доставка и монтаж?",
    answer: "Да. Доставку, занос, сборку и монтаж согласуем по адресу и фиксируем в условиях заказа.",
  },
  {
    id: "region",
    question: "Можно ли заказать кухню в Минской области?",
    answer: "Да. Работаем по Минску, Минской области и другим городам Беларуси. Условия выезда и доставки уточняются при заявке.",
  },
  {
    id: "warranty",
    question: "Какая гарантия?",
    answer: "Гарантийные условия фиксируются в договоре и зависят от комплектации, материалов и фурнитуры.",
  },
  {
    id: "ceiling",
    question: "Можно ли сделать кухню до потолка?",
    answer: "Да. Кухни до потолка помогают увеличить хранение, закрыть верхнюю зону и сделать фасад визуально цельнее.",
  },
  {
    id: "included",
    question: "Что входит в стоимость кухни?",
    answer: "В смете отдельно учитываются корпус, фасады, столешница, фурнитура, замер, доставка, монтаж и дополнительные работы по проекту.",
  },
];

const mobileNavItems: HomeNavItem[] = [
  { id: "projects", label: "Проекты", href: "#projects", icon: Images },
  { id: "selector", label: "Подобрать", href: "#selector", icon: Palette },
  { id: "prices", label: "Цены", href: "#prices", icon: Calculator },
  { id: "calculate", label: "Рассчитать", href: "#calculate", icon: FileCheck },
];

const homeNavSectionOrder: HomeNavId[] = ["selector", "projects", "prices", "calculate"];

function LayoutSchema({ type }: { type: LayoutOption["schema"] }) {
  const base = "absolute rounded-sm bg-[#d5b078]";
  const line = "absolute rounded-sm border border-[#d5b078]";

  return (
    <div className="relative h-16 w-20 shrink-0 rounded-lg border border-white/16 bg-white/8">
      {type === "straight" && <span className={`${base} left-3 right-3 top-7 h-3`} />}
      {type === "corner" && (
        <>
          <span className={`${base} left-3 top-7 h-3 w-12`} />
          <span className={`${base} left-3 top-4 h-9 w-3`} />
        </>
      )}
      {type === "u" && (
        <>
          <span className={`${base} left-3 top-4 h-9 w-3`} />
          <span className={`${base} left-3 right-3 top-7 h-3`} />
          <span className={`${base} right-3 top-4 h-9 w-3`} />
        </>
      )}
      {type === "island" && (
        <>
          <span className={`${base} left-3 right-3 top-3 h-3`} />
          <span className={`${base} left-7 right-7 top-9 h-4`} />
        </>
      )}
      {type === "small" && (
        <>
          <span className={`${base} left-4 top-5 h-8 w-3`} />
          <span className={`${base} left-4 top-5 h-3 w-10`} />
          <span className={`${line} bottom-2 right-3 h-4 w-5`} />
        </>
      )}
      {type === "living" && (
        <>
          <span className={`${base} left-3 right-7 top-4 h-3`} />
          <span className={`${line} bottom-3 right-3 h-6 w-8`} />
        </>
      )}
      {type === "ceiling" && (
        <>
          <span className={`${base} left-3 right-3 top-6 h-4`} />
          <span className="absolute left-3 right-3 top-2 h-px bg-[#d5b078]/70" />
          <span className="absolute left-3 right-3 bottom-2 h-px bg-[#d5b078]/70" />
        </>
      )}
    </div>
  );
}

function normalizeProjects(projects: HomeProjectCard[]) {
  if (projects.length > 0) return projects;

  return GENERATED_MINSK_PORTFOLIO_CASES.slice(0, 4).map((item) => ({
    id: item.externalId || item.slug,
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
  }));
}

function saveSelection(style: string, layout: string, budget: string) {
  if (typeof window === "undefined") return;

  const selection = {
    style,
    layout,
    budget,
    source: "Главная страница: быстрый подбор кухни",
  };
  window.sessionStorage.setItem("homeKitchenSelection", JSON.stringify(selection));
}

export function HomeMobileShowroom({ projects, reviews, faqs, locations }: HomeMobileShowroomProps) {
  const visibleProjects = useMemo(() => normalizeProjects(projects).slice(0, 4), [projects]);
  const visibleReviews = reviews.slice(0, 4);
  const visibleFaqs = useMemo(() => {
    const existingQuestions = new Set(faqs.map((item) => item.question.trim().toLowerCase()));
    return [
      ...faqs,
      ...fallbackFaqItems.filter((item) => !existingQuestions.has(item.question.trim().toLowerCase())),
    ].slice(0, 8);
  }, [faqs]);
  const visibleLocations = locations.slice(0, 8);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0].id);
  const [selectedLayout, setSelectedLayout] = useState(layoutOptions[1].id);
  const [selectedBudget, setSelectedBudget] = useState(budgetOptions[1].id);
  const [beforeAfter, setBeforeAfter] = useState(100);
  const [activeNav, setActiveNav] = useState<HomeNavId>("selector");
  const [isFormFocused, setIsFormFocused] = useState(false);

  const layout = layoutOptions.find((item) => item.id === selectedLayout) || layoutOptions[1];
  const budget = budgetOptions.find((item) => item.id === selectedBudget) || budgetOptions[1];
  const selectedStyleTitle = styleOptions.find((item) => item.id === selectedStyle)?.title || styleOptions[0].title;

  function handleSelection(next: Partial<{ style: string; layout: string; budget: string }>) {
    const style = next.style || selectedStyle;
    const layoutValue = next.layout || selectedLayout;
    const budgetValue = next.budget || selectedBudget;

    setSelectedStyle(style);
    setSelectedLayout(layoutValue);
    setSelectedBudget(budgetValue);
    saveSelection(
      styleOptions.find((item) => item.id === style)?.title || style,
      layoutOptions.find((item) => item.id === layoutValue)?.title || layoutValue,
      budgetOptions.find((item) => item.id === budgetValue)?.title || budgetValue,
    );
  }

  const scrollToHomeSection = useCallback((id: HomeNavId) => {
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${id}`);
    setActiveNav(id);
  }, []);

  useEffect(() => {
    const updateActiveFromAnchors = () => {
      const activationLine = window.innerHeight * 0.38;
      const nextActive = homeNavSectionOrder.reduce<HomeNavId>((current, id) => {
        const anchor = document.getElementById(id);
        if (!anchor) return current;

        return anchor.getBoundingClientRect().top <= activationLine ? id : current;
      }, "selector");

      setActiveNav(nextActive);
    };

    updateActiveFromAnchors();
    window.addEventListener("scroll", updateActiveFromAnchors, { passive: true });
    window.addEventListener("resize", updateActiveFromAnchors);
    return () => {
      window.removeEventListener("scroll", updateActiveFromAnchors);
      window.removeEventListener("resize", updateActiveFromAnchors);
    };
  }, []);

  useEffect(() => {
    const formSection = document.getElementById("home-final-form");
    if (!formSection) return;

    const updateFocusState = () => {
      setIsFormFocused(Boolean(document.activeElement && formSection.contains(document.activeElement)));
    };

    document.addEventListener("focusin", updateFocusState);
    document.addEventListener("focusout", updateFocusState);
    return () => {
      document.removeEventListener("focusin", updateFocusState);
      document.removeEventListener("focusout", updateFocusState);
    };
  }, []);

  return (
    <div className="bg-[#15110d] pb-24 text-white md:pb-0">
      <section className="relative min-h-[100svh] overflow-hidden pt-24" aria-labelledby="home-showroom-hero" data-home-nav="selector">
        <picture className="absolute inset-0 block">
          <source media="(max-width: 767px)" srcSet={heroMobileImage} />
          <source media="(min-width: 768px)" srcSet={heroImage} />
          <img
            src={heroImage}
            alt="Кухни на заказ в Минске, премиальная тёмная кухня с островом и подсветкой"
            className="h-full w-full object-cover object-center opacity-80"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,11,8,0.70)_0%,rgba(14,11,8,0.38)_42%,rgba(14,11,8,0.86)_100%)] md:bg-[linear-gradient(90deg,rgba(14,11,8,0.90)_0%,rgba(14,11,8,0.52)_48%,rgba(14,11,8,0.18)_100%)]" />
        <BrandedImageWatermark show={getImageDisclosure(heroImage).kind === "generated"} />

        <div className="container-site relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-end pb-8 md:pb-12">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2 text-xs font-bold text-white/86">
              {["Собственное производство", "3D-проект", "Монтаж под ключ", "Цена в договоре"].map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-black/22 px-3 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
            <h1 id="home-showroom-hero" className="max-w-3xl text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-6xl">
              Кухни на заказ в Минске под ваш размер, стиль и бюджет
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/82 sm:text-lg">
              Проектируем, изготавливаем и устанавливаем кухни под ключ по Минску, Минской области и Беларуси.
            </p>
            <div className="mt-7 grid gap-3 sm:flex">
              <a
                href="#selector"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c99a62] px-6 py-3 text-sm font-black text-[#17110b] shadow-xl shadow-black/25 transition hover:bg-[#d9ad78]"
              >
                Подобрать кухню
                <Sparkles className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#projects"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/34 bg-black/20 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/12"
              >
                Смотреть реальные проекты
                <Images className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="home-kitchen-picker" className="border-t border-white/10 bg-[#17120e] py-10 md:py-14" aria-labelledby="home-picker-title" data-home-nav="selector">
        <span id="selector" className="block scroll-mt-24" aria-hidden />
        <div className="container-site">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d5b078]">Быстрый подбор</p>
              <h2 id="home-picker-title" className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                Выберите кухню за 3 коротких шага
              </h2>
            </div>
            <MoveHorizontal className="hidden h-7 w-7 text-white/45 sm:block" aria-hidden />
          </div>

          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                <span className="text-[#d5b078]">01</span> Стиль
              </div>
              <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
                {styleOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelection({ style: item.id })}
                    className={`group relative min-h-[17rem] w-[84vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-lg border text-left transition sm:w-auto ${
                      selectedStyle === item.id ? "border-[#d5b078] ring-2 ring-[#d5b078]/40" : "border-white/12"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 84vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />
                    <span className="absolute bottom-4 left-4 right-4 text-xl font-black text-white">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                <span className="text-[#d5b078]">02</span> Планировка
              </div>
              <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                {layoutOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelection({ layout: item.id })}
                    className={`flex min-h-24 w-52 shrink-0 snap-start items-center gap-3 rounded-lg border p-3 text-left transition ${
                      selectedLayout === item.id ? "border-[#d5b078] bg-white/10" : "border-white/12 bg-white/[0.04]"
                    }`}
                  >
                    <LayoutSchema type={item.schema} />
                    <span>
                      <span className="block text-base font-black text-white">{item.title}</span>
                      <span className="mt-1 block text-xs leading-4 text-white/58">Смотреть варианты</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid overflow-hidden rounded-lg border border-white/12 bg-[#211a14] md:grid-cols-[0.95fr_1.05fr]">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={layout.image}
                    alt={layout.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-7">
                  <div className="flex items-center gap-3">
                    <LayoutSchema type={layout.schema} />
                    <div>
                      <p className="text-2xl font-black text-white">{layout.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/64">{layout.benefit}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-white/68">
                    Подбор сейчас: {selectedStyleTitle.toLowerCase()}, {layout.title.toLowerCase()}, бюджет {budget.title.toLowerCase()}.
                    Эти параметры сохраняются и попадут в заявку на расчёт.
                  </p>
                  <Link href={layout.href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d5b078]/60 px-4 py-2 text-sm font-black text-[#f1d0a3]">
                    SEO-страница категории
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-white">
                <span className="text-[#d5b078]">03</span> Бюджет
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {budgetOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelection({ budget: item.id })}
                    className={`min-h-28 rounded-lg border p-4 text-left transition ${
                      selectedBudget === item.id ? "border-[#d5b078] bg-[#d5b078] text-[#17110b]" : "border-white/12 bg-white/[0.04] text-white"
                    }`}
                  >
                    <span className="block text-lg font-black">{item.title}</span>
                    <span className={`mt-2 block text-sm leading-5 ${selectedBudget === item.id ? "text-[#342414]" : "text-white/62"}`}>
                      {item.level}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-white/12 bg-white/[0.04] p-5">
                <p className="text-xl font-black text-white">{budget.level}</p>
                <p className="mt-2 text-sm leading-6 text-white/66">{budget.materials}</p>
                <Link
                  href="/contacts#form"
                  onClick={() => saveSelection(selectedStyleTitle, layout.title, budget.title)}
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c99a62] px-5 py-3 text-sm font-black text-[#17110b]"
                >
                  Получить точный расчёт
                  <Calculator className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="home-real-projects" className="bg-[#f6f1ea] py-10 text-[#201912] md:py-14" aria-labelledby="home-projects-title" data-home-nav="projects">
        <span id="projects" className="block scroll-mt-24" aria-hidden />
        <div className="container-site">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 id="home-projects-title" className="text-3xl font-black leading-tight md:text-4xl">
                Реальные кухни, которые уже установлены
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#75695f]">Листайте →</p>
            </div>
            <div className="hidden gap-1 sm:flex" aria-hidden>
              {visibleProjects.map((project, index) => (
                <span key={project.slug} className={`h-2 rounded-full ${index === 0 ? "w-6 bg-[#9b6b3e]" : "w-2 bg-[#d8c9b8]"}`} />
              ))}
            </div>
          </div>
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {visibleProjects.map((project) => {
              const rawImage = project.mainImage || "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya.webp";
              const image = optimizedImageSrc(rawImage) || rawImage;

              return (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group w-[88vw] max-w-[24rem] shrink-0 snap-start overflow-hidden rounded-lg border border-[#e2d7ca] bg-white shadow-[0_16px_40px_rgba(46,34,22,0.10)] transition hover:-translate-y-0.5 sm:w-auto sm:max-w-none"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#eadfd3] sm:aspect-[4/3]">
                    <Image
                      src={image}
                      alt={buildImageAlt(rawImage, `${project.title}, ${project.city || "Минск"}`)}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <BrandedImageWatermark show={getImageDisclosure(rawImage).kind === "generated"} compact />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-black text-[#201912]">{project.title}</p>
                    <p className="mt-1 text-sm font-semibold text-[#6f6256]">
                      {project.area ? `${project.area} м²` : project.size || "индивидуальный размер"} · {project.style || "современный стиль"}
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-[#5d5147]">
                      <p>{project.material || "МДФ + HPL-столешница"}</p>
                      <p>Срок: от 21 дня</p>
                      <p className="font-black text-[#201912]">Бюджет: от {project.priceFrom > 0 ? project.priceFrom.toLocaleString("ru") : "4 200"} BYN</p>
                    </div>
                    <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#201912] px-4 py-2 text-sm font-black text-white">
                      Смотреть проект
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex justify-center gap-1 sm:hidden" aria-hidden>
            {visibleProjects.map((project, index) => (
              <span key={project.slug} className={`h-2 rounded-full ${index === 0 ? "w-6 bg-[#9b6b3e]" : "w-2 bg-[#d8c9b8]"}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ea] pb-10 text-[#201912] md:pb-14" aria-labelledby="home-before-after-title" data-home-nav="projects">
        <div className="container-site">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="overflow-hidden rounded-lg border border-[#e2d7ca] bg-white">
              <div className="relative aspect-square touch-pan-y overflow-hidden bg-[#e7ded4] sm:aspect-[16/10]">
                <Image
                  src="/images/home-showroom/left-window-linear-before-20260701.webp"
                  alt="Комната до установки кухни: окно слева и свободная стена под прямой гарнитур"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-contain"
                />
                <Image
                  src="/images/home-showroom/left-window-linear-after-20260701.webp"
                  alt="Та же комната после установки прямой кухни: окно слева, гарнитур по всей стене"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-contain"
                  style={{ clipPath: `inset(0 ${100 - beforeAfter}% 0 0)` }}
                />
                <div className="absolute inset-y-0 z-10 w-1 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" style={{ left: `${beforeAfter}%` }} />
                <div className="absolute left-3 top-3 rounded-full bg-black/62 px-3 py-1 text-xs font-black text-white">После</div>
                <div className="absolute right-3 top-3 rounded-full bg-black/62 px-3 py-1 text-xs font-black text-white">До</div>
                <label className="absolute inset-x-4 bottom-4 z-20">
                  <span className="sr-only">Сравнить кухню до и после</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={beforeAfter}
                    onChange={(event) => setBeforeAfter(Number(event.target.value))}
                    className="h-10 w-full touch-pan-y accent-[#c99a62]"
                  />
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9b6b3e]">До / после</p>
              <h2 id="home-before-after-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
                Как меняется пространство
              </h2>
              <p className="mt-4 text-lg font-black">Кухня в квартире, 7,5 м²</p>
              <ul className="mt-5 grid gap-3 text-sm font-semibold text-[#5d5147]">
                {["Добавили хранение до потолка", "Увеличили рабочую зону", "Скрыли коммуникации", "Встроили технику"].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-lg border border-[#e2d7ca] bg-white p-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#9b6b3e]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf4] py-10 text-[#201912] md:py-14" aria-labelledby="home-materials-title" data-home-nav="projects">
        <div className="container-site">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9b6b3e]">Материалы глазами</p>
            <h2 id="home-materials-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Посмотрите материалы вблизи
            </h2>
          </div>
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {materialCards.map((item) => (
              <Link key={item.title} href={item.href} className="w-[84vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-lg border border-[#e2d7ca] bg-white sm:w-auto sm:max-w-none">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 45vw, 31vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xl font-black">{item.title}</p>
                  <ul className="mt-3 space-y-1 text-sm font-semibold text-[#5d5147]">
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm leading-6 text-[#75695f]">{item.example}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17120e] py-10 md:py-14" aria-labelledby="home-layouts-title" data-home-nav="projects">
        <div className="container-site">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d5b078]">Планировка кухни</p>
            <h2 id="home-layouts-title" className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
              Какая кухня подойдёт вашему помещению
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {layoutOptions.filter((item) => item.id !== "living").map((item) => (
              <Link key={item.id} href={item.href} className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] transition hover:border-[#d5b078]/60">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 31vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <LayoutSchema type={item.schema} />
                    <h3 className="text-xl font-black text-white">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/64">{item.benefit}</p>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d5b078]/60 px-4 py-2 text-sm font-black text-[#f1d0a3]">
                    Смотреть {item.title.toLowerCase()} кухни
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="home-order-steps" className="bg-[#211811] py-10 md:py-14" aria-labelledby="home-order-steps-title">
        <div className="container-site">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d5b078]">Как проходит заказ</p>
            <h2 id="home-order-steps-title" className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
              От заявки до кухни, которую можно сразу использовать
            </h2>
          </div>
          <div className="relative grid gap-4 lg:grid-cols-2">
            {orderSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.number} className="grid overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] sm:grid-cols-[9rem_1fr]">
                  <div className="relative min-h-36">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 9rem"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#d5b078] text-sm font-black text-[#17110b]">
                        {step.number}
                      </span>
                      <Icon className="h-5 w-5 text-[#d5b078]" aria-hidden />
                    </div>
                    <h3 className="text-xl font-black text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/64">{step.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="home-prices" className="bg-[#fffaf4] py-10 text-[#201912] md:py-14" aria-labelledby="home-prices-title" data-home-nav="prices">
        <span id="prices" className="block scroll-mt-24" aria-hidden />
        <div className="container-site">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9b6b3e]">Цены</p>
            <h2 id="home-prices-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Сколько стоит кухня на заказ
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#75695f]">
              Точная стоимость зависит от размеров, материалов, фурнитуры, столешницы, техники, доставки и монтажа.
            </p>
          </div>
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {priceCards.map((item) => (
              <Link key={item.href} href={item.href} className="w-[84vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-lg border border-[#e2d7ca] bg-white sm:w-auto sm:max-w-none">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 84vw, (max-width: 1024px) 45vw, 31vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-2xl font-black text-[#9b6b3e]">{item.price}</p>
                  <p className="mt-3 text-sm leading-6 text-[#75695f]">{item.text}</p>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#201912] px-4 py-2 text-sm font-black text-white">
                    Посмотреть цены
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="home-final-form" className="bg-[#17120e] py-10 md:py-14" aria-labelledby="home-final-form-title" data-home-nav="calculate">
        <span id="calculate" className="block scroll-mt-24" aria-hidden />
        <div className="container-site">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d5b078]">Расчёт</p>
              <h2 id="home-final-form-title" className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                Получить расчёт кухни в два шага
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/64">
                Пришлите фото помещения — подскажем, какая планировка и материалы подойдут именно вам.
              </p>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="rounded-lg border border-[#d5b078]/35 bg-[#d5b078]/10 p-4">
                  <p className="font-black text-[#f1d0a3]">Шаг 1</p>
                  <p className="mt-1 text-white/70">Телефон, город и удобный способ связи.</p>
                </div>
                <div className="rounded-lg border border-white/12 bg-white/[0.04] p-4">
                  <p className="font-black text-white">Шаг 2</p>
                  <p className="mt-1 text-white/64">Фото помещения, размеры, тип кухни и комментарий.</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-white/12 bg-white p-4 text-[#201912] shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <ContactForm
                source="home"
                sourceType="home"
                formType="home-showroom"
                formLocation="home-final-form"
                submitLabel="Получить расчёт"
                showMessenger
                showHasMeasurements
                showRoomFile
                defaultKitchenType={layout.title}
                defaultComment={`Интересует ${selectedStyleTitle.toLowerCase()}, ${layout.title.toLowerCase()}, бюджет ${budget.title.toLowerCase()}.`}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="home-cities" className="bg-[#f6f1ea] py-10 text-[#201912] md:py-14" aria-labelledby="home-cities-title">
        <div className="container-site">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9b6b3e]">Города</p>
            <h2 id="home-cities-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Кухни на заказ по Минску, области и Беларуси
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/locations/minsk" className="rounded-lg border border-[#e2d7ca] bg-white p-4">
              <MapPin className="mb-3 h-5 w-5 text-[#9b6b3e]" aria-hidden />
              <h3 className="text-lg font-black">Минск</h3>
              <p className="mt-2 text-sm leading-5 text-[#75695f]">Замер, проект, изготовление и монтаж под ключ.</p>
            </Link>
            <Link href="/locations/minskaya-oblast" className="rounded-lg border border-[#e2d7ca] bg-white p-4">
              <MapPin className="mb-3 h-5 w-5 text-[#9b6b3e]" aria-hidden />
              <h3 className="text-lg font-black">Минская область</h3>
              <p className="mt-2 text-sm leading-5 text-[#75695f]">Выезд и доставка по условиям конкретного проекта.</p>
            </Link>
            {visibleLocations.map((location) => (
              <Link key={location.slug} href={`/locations/${location.slug}`} className="rounded-lg border border-[#e2d7ca] bg-white p-4">
                <MapPin className="mb-3 h-5 w-5 text-[#9b6b3e]" aria-hidden />
                <h3 className="text-lg font-black">{location.city}</h3>
                <p className="mt-2 text-sm leading-5 text-[#75695f]">
                  {location.region || "Беларусь"} · ориентир от {location.priceFrom.toLocaleString("ru")} BYN
                </p>
              </Link>
            ))}
          </div>
          <Link href="/locations" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#9b6b3e]/40 bg-white px-4 py-2 text-sm font-black text-[#6e4727]">
            Все города Беларуси
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {visibleReviews.length > 0 && (
        <section id="home-reviews" className="bg-[#17120e] py-10 md:py-14" aria-labelledby="home-reviews-title">
          <div className="container-site">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d5b078]">Отзывы</p>
                <h2 id="home-reviews-title" className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                  Что говорят клиенты после установки
                </h2>
              </div>
              <Link href="/reviews" className="hidden min-h-11 items-center gap-2 rounded-lg border border-[#d5b078]/60 px-4 py-2 text-sm font-black text-[#f1d0a3] sm:inline-flex">
                Все отзывы
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {visibleReviews.map((review) => (
                <article key={review.id} className="w-[84vw] max-w-[22rem] shrink-0 snap-start rounded-lg border border-white/12 bg-white/[0.04] p-5 sm:w-auto sm:max-w-none">
                  <div className="mb-3 flex items-center gap-1" aria-label={`Оценка ${review.rating} из 5`}>
                    {Array.from({ length: Math.max(1, Math.min(5, review.rating)) }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-[#d5b078] text-[#d5b078]" aria-hidden />
                    ))}
                  </div>
                  <p className="line-clamp-5 text-sm leading-6 text-white/72">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-4 border-t border-white/10 pt-4 text-sm">
                    <p className="font-black text-white">{review.name}</p>
                    <p className="mt-1 text-white/52">
                      {[review.city, review.date].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <Link href="/reviews" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d5b078]/60 px-4 py-2 text-sm font-black text-[#f1d0a3] sm:hidden">
              Смотреть все отзывы
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      <section id="home-faq" className="bg-[#fffaf4] py-10 text-[#201912] md:py-14" aria-labelledby="home-faq-title">
        <div className="container-site">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9b6b3e]">FAQ</p>
            <h2 id="home-faq-title" className="mt-2 text-3xl font-black leading-tight md:text-4xl">
              Частые вопросы о кухнях на заказ
            </h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {visibleFaqs.map((item, index) => (
              <details key={item.id} className="group rounded-lg border border-[#e2d7ca] bg-white p-4" open={index === 0}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center text-base font-black">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#75695f]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <nav
        className={`fixed inset-x-0 bottom-0 z-[60] border-t border-[#d5b078]/24 bg-[#17120e]/96 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_34px_rgba(0,0,0,0.28)] backdrop-blur transition duration-200 md:hidden ${
          isFormFocused ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-label="Нижняя навигация по главной странице"
        data-testid="home-bottom-nav"
      >
        <div className="grid grid-cols-4 gap-2 text-[0.68rem] font-black text-white/76">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHomeSection(item.id);
                }}
                className={`relative flex min-h-12 flex-col items-center justify-center rounded-lg px-1.5 py-1 transition ${
                  isActive
                    ? "bg-[#c99a62] text-[#17110b] shadow-[0_8px_20px_rgba(201,154,98,0.24)]"
                    : "text-white/76 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span
                  className={`absolute inset-x-4 top-0 h-0.5 rounded-full transition ${
                    isActive ? "bg-[#17110b]/70" : "bg-transparent"
                  }`}
                  aria-hidden
                />
                <Icon className="mb-1 h-4 w-4" aria-hidden />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
