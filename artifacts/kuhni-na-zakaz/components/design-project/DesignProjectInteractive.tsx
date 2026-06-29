"use client";

import Image from "next/image";
import Link from "@/components/navigation/Link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Maximize2, X } from "lucide-react";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

const imageBase = "/images/design-proekt-kuhni";
const minskProjectBase = "/uploads/locations/minsk-stage34";
const minskDetailsBase = "/uploads/locations/minsk-stage34";
const minskMechanismsBase = "/uploads/locations/minsk-stage56";
const portfolioBase = "/uploads/kitchens/portfolio";

const heroStages = [
  { title: "Пустое помещение", text: "Фиксируем стены, окно, коммуникации и реальные ограничения." },
  { title: "Сначала проектируем пространство", text: "Появляются размеры, рабочие зоны, техника и проходы." },
  { title: "Затем строим удобную планировку", text: "Расставляем нижние модули, хранение и рабочий треугольник." },
  { title: "Подбираем материалы и технику", text: "Добавляем фасады, столешницу, фартук и встроенную технику." },
  { title: "И показываем результат до заказа", text: "Вы видите будущую кухню до производства и монтажа." },
];

const choices = {
  shape: ["Прямая", "Угловая", "П-образная", "С островом", "Кухня-гостиная"],
  size: ["До 8 м2", "8-12 м2", "12-20 м2", "Более 20 м2"],
  style: ["Современный минимализм", "Теплая кухня с деревом", "Светлая кухня", "Темная кухня", "Неоклассика"],
  facade: ["Матовые", "Под дерево", "Без ручек", "Рамочные", "Комбинированные"],
  extras: ["Кухня до потолка", "Встроенная техника", "Подсветка", "Остров или барная стойка", "Много систем хранения"],
};

const previewByStyle: Record<string, string> = {
  "Современный минимализм": `${imageBase}/3d-proekt-kuhnya-bez-ruchek.webp`,
  "Теплая кухня с деревом": `${minskProjectBase}/minsk-project-06-private-house-obshchiy-vid.webp`,
  "Светлая кухня": `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`,
  "Темная кухня": `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`,
  "Неоклассика": `${imageBase}/3d-proekt-neoklassicheskaya-kuhnya.webp`,
};

const layerItems = [
  {
    key: "facades",
    title: "Фасады",
    image: `${minskDetailsBase}/minsk-detail-01-matovyy-fasad.webp`,
    text: "Материалы фасадов влияют на внешний вид, устойчивость к нагрузке и итоговую стоимость кухни.",
  },
  {
    key: "countertop",
    title: "Столешница",
    image: `${minskDetailsBase}/minsk-detail-03-kamennaya-stoleshnitsa.webp`,
    text: "Подбираем материал под стиль кухни, бюджет и интенсивность использования.",
  },
  {
    key: "hardware",
    title: "Фурнитура",
    image: `${minskMechanismsBase}/minsk-mechanism-01-plavnoe-zakryvanie-square.webp`,
    text: "Направляющие, петли и механизмы определяют удобство кухни на каждый день.",
  },
  {
    key: "appliances",
    title: "Техника",
    image: `${minskMechanismsBase}/minsk-mechanism-08-vstroennaya-posudomoyka-square.webp`,
    text: "Техника учитывается на этапе планировки, чтобы ничего не мешало фасадам и проходам.",
  },
  {
    key: "light",
    title: "Свет",
    image: `${minskDetailsBase}/minsk-detail-12-podsvetka-rabochey-zony.webp`,
    text: "Свет меняет восприятие материалов и делает рабочую зону удобнее.",
  },
];

const cases = [
  {
    title: "Кухня 8 м2 в квартире",
    area: "8 м2",
    type: "Угловая",
    problem: "Мало места, окно, коммуникации и ограниченный проход.",
    solution: "Угловая планировка, шкафы до потолка, встроенная техника и выдвижное хранение.",
    href: "/catalog/malenkie-kuhni",
    final: `${imageBase}/3d-proekt-malenkaya-kuhnya.webp`,
  },
  {
    title: "Угловая кухня в новостройке",
    area: "10 м2",
    type: "Угловая",
    problem: "Нужно совместить мойку, плиту и высокий пенал без потери столешницы.",
    solution: "Развели зоны по двум стенам и проверили открывание фасадов в проекте.",
    href: "/catalog/uglovye-kuhni",
    final: `${imageBase}/3d-proekt-uglovaya-kuhnya.webp`,
  },
  {
    title: "Кухня-гостиная",
    area: "18 м2",
    type: "Кухня-гостиная",
    problem: "Кухня видна из гостиной, поэтому важны пропорции и спокойные материалы.",
    solution: "Сделали единую линию хранения, встроенную технику и мягкую подсветку.",
    href: "/catalog/kuhni-s-ostrovom",
    final: `${minskProjectBase}/minsk-project-05-island-living-obshchiy-vid.webp`,
  },
  {
    title: "Кухня с островом",
    area: "22 м2",
    type: "С островом",
    problem: "Остров не должен мешать проходам, технике и открыванию ящиков.",
    solution: "Проверили маршруты, розетки, высоту столешницы и хранение в острове.",
    href: "/catalog/kuhni-s-ostrovom",
    final: `${imageBase}/3d-proekt-kuhnya-s-ostrovom.webp`,
  },
  {
    title: "Кухня до потолка",
    area: "11 м2",
    type: "До потолка",
    problem: "Нужны верхние антресоли, но потолок и стены могут быть неровными.",
    solution: "Заложили доборы, верхнее хранение и аккуратную линию фасадов.",
    href: "/catalog/kuhni-do-potolka",
    final: `${imageBase}/3d-proekt-kuhnya-do-potolka.webp`,
  },
  {
    title: "Темная современная кухня",
    area: "14 м2",
    type: "Темная",
    problem: "Темные материалы могут сделать комнату тяжелой без света и баланса.",
    solution: "Добавили дерево, подсветку рабочей зоны и светлую столешницу.",
    href: "/catalog/kuhni-bez-ruchek",
    final: `${minskProjectBase}/minsk-project-03-dark-wood-tehnika-podsvetka.webp`,
  },
];

const situations = [
  ["У меня маленькая кухня", "Продумываем каждый сантиметр: глубину модулей, хранение, технику и проходы.", "/catalog/malenkie-kuhni", `${imageBase}/3d-proekt-malenkaya-kuhnya.webp`],
  ["Хочу кухню до потолка", "Проверяем высоту, доборы, антресоли и удобный доступ к верхним зонам.", "/catalog/kuhni-do-potolka", `${imageBase}/3d-proekt-kuhnya-do-potolka.webp`],
  ["Нужен остров", "Считаем проходы, розетки, хранение и сценарий общения на кухне.", "/catalog/kuhni-s-ostrovom", `${imageBase}/3d-proekt-kuhnya-s-ostrovom.webp`],
  ["Хочу кухню-гостиную", "Согласуем вид со стороны гостиной, технику и спокойную линию хранения.", "/catalog/kuhni-s-ostrovom", `${minskProjectBase}/minsk-project-05-island-living-vtoroy-rakurs.webp`],
  ["Нужна кухня без ручек", "Подбираем профиль, push-to-open или интегрированные решения под фасады.", "/catalog/kuhni-bez-ruchek", `${imageBase}/3d-proekt-kuhnya-bez-ruchek.webp`],
  ["Хочу много хранения", "Проектируем пеналы, антресоли, выдвижные системы и органайзеры.", "/materials/furnitura", `${minskMechanismsBase}/minsk-mechanism-02-vysokiy-vydvizhnoy-shkaf-square.webp`],
  ["Хочу светлую кухню", "Собираем легкую палитру, чтобы кухня выглядела просторнее и спокойнее.", "/catalog/pryamye-kuhni", `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`],
  ["Хочу темную кухню", "Балансируем темные фасады деревом, светом и фактурной столешницей.", "/catalog/kuhni-bez-ruchek", `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`],
  ["Нужна кухня для семьи", "Разводим хранение, рабочие зоны и технику так, чтобы всем было удобно.", "/catalog", `${portfolioBase}/uglovaya-kuhnya-skandinavskaya-zelenaya-012-main.webp`],
  ["Есть сложная планировка", "Учитываем вентиляцию, трубы, углы, подоконники и нестандартные ниши.", "/contacts", `${minskMechanismsBase}/minsk-measurement-04-kommunikatsii-mobile.webp`],
] as const;

const gallery = [
  ["Прямая светлая кухня", "Прямые", "Светлые", "9 м2", `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`, "/catalog/pryamye-kuhni"],
  ["Угловая кухня до потолка", "Угловые", "До потолка", "10 м2", `${imageBase}/3d-proekt-uglovaya-kuhnya.webp`, "/catalog/uglovye-kuhni"],
  ["Маленькая кухня", "Маленькие", "Светлые", "7 м2", `${imageBase}/3d-proekt-malenkaya-kuhnya.webp`, "/catalog/malenkie-kuhni"],
  ["П-образная кухня", "П-образные", "Светлые", "13 м2", `${imageBase}/3d-proekt-p-obraznaya-kuhnya.webp`, "/catalog/p-obraznye-kuhni"],
  ["Кухня с островом", "С островом", "Современные", "22 м2", `${imageBase}/3d-proekt-kuhnya-s-ostrovom.webp`, "/catalog/kuhni-s-ostrovom"],
  ["Кухня без ручек", "Без ручек", "Темные", "12 м2", `${imageBase}/3d-proekt-kuhnya-bez-ruchek.webp`, "/catalog/kuhni-bez-ruchek"],
  ["Неоклассическая кухня", "Неоклассика", "Светлые", "14 м2", `${imageBase}/3d-proekt-neoklassicheskaya-kuhnya.webp`, "/styles/neoklassika"],
  ["Темная кухня с деревом", "Угловые", "Темные", "14 м2", `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`, "/catalog/uglovye-kuhni"],
  ["Кухня-гостиная с островом", "С островом", "Современные", "20 м2", `${minskProjectBase}/minsk-project-05-island-living-obshchiy-vid.webp`, "/catalog/kuhni-s-ostrovom"],
  ["Кухня до потолка", "До потолка", "Светлые", "11 м2", `${imageBase}/3d-proekt-kuhnya-do-potolka.webp`, "/catalog/kuhni-do-potolka"],
] as const;

const filters = ["Все", "Прямые", "Угловые", "Маленькие", "П-образные", "С островом", "До потолка", "Без ручек", "Светлые", "Темные", "Неоклассика"];

const projectParts = [
  ["Планировка", "Схема модулей, проходов и рабочих зон под реальные размеры.", `${minskMechanismsBase}/minsk-measurement-02-lazernaya-ruletka-mobile.webp`],
  ["Расстановка техники", "Проверяем холодильник, духовой шкаф, варочную, мойку и посудомойку.", `${minskMechanismsBase}/minsk-mechanism-08-vstroennaya-posudomoyka-square.webp`],
  ["Схема хранения", "Показываем пеналы, ящики, органайзеры и верхние зоны.", `${minskMechanismsBase}/minsk-mechanism-06-organayzer-dlya-priborov-square.webp`],
  ["Подбор фасадов", "Сравниваем матовые, древесные, рамочные и комбинированные фасады.", `${minskDetailsBase}/minsk-detail-01-matovyy-fasad.webp`],
  ["Освещение", "Отдельно смотрим рабочий свет, вечерний сценарий и декоративную подсветку.", `${minskDetailsBase}/minsk-detail-12-podsvetka-rabochey-zony.webp`],
  ["3D-визуализация", "Финальный вид кухни помогает принять решение до производства.", `${imageBase}/3d-proekt-kuhni-hero.webp`],
] as const;

const materials = [
  ["Светлый матовый фасад", `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`, "Спокойная база для маленьких и светлых помещений."],
  ["Графитовый матовый фасад", `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`, "Выразительный вариант для современного интерьера."],
  ["Дуб и камень", `${minskProjectBase}/minsk-project-06-private-house-stoleshnitsa-kamen.webp`, "Теплое дерево смягчает каменную столешницу."],
  ["Мраморная столешница", `${minskDetailsBase}/minsk-detail-03-kamennaya-stoleshnitsa.webp`, "Акцентная фактура для рабочей зоны и острова."],
  ["Подсветка", `${minskDetailsBase}/minsk-detail-12-podsvetka-rabochey-zony.webp`, "Рабочая зона становится удобнее вечером."],
] as const;

function track(event: string, params: Record<string, string | number | boolean> = {}) {
  trackAnalyticsEvent(event as typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS], params);
}

function saveSelection(selection: SelectionState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem("designProjectSelection", JSON.stringify(selection));
}

interface SelectionState {
  shape: string;
  size: string;
  style: string;
  facade: string;
  extras: string[];
}

export function DesignProjectInteractive() {
  const [heroStage, setHeroStage] = useState(0);
  const [selection, setSelection] = useState<SelectionState>({
    shape: choices.shape[1],
    size: choices.size[1],
    style: choices.style[0],
    facade: choices.facade[0],
    extras: [choices.extras[1], choices.extras[2]],
  });
  const [activeLayer, setActiveLayer] = useState(layerItems[0].key);
  const [caseState, setCaseState] = useState(2);
  const [activeFilter, setActiveFilter] = useState("Все");
  const [lightbox, setLightbox] = useState<(typeof gallery)[number] | null>(null);
  const [activePart, setActivePart] = useState<string>(projectParts[0][0]);
  const [activeMaterial, setActiveMaterial] = useState<string>(materials[0][0]);

  useEffect(() => {
    track(ANALYTICS_EVENTS.DESIGN_HERO_VIEW, { page: "design-proekt-kuhni" });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeroStage(4);
      return;
    }

    const onScroll = () => {
      const hero = document.getElementById("design-hero-stage");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      setHeroStage(Math.min(4, Math.floor(progress * 5)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    saveSelection(selection);
  }, [selection]);

  const activeLayerItem = layerItems.find((item) => item.key === activeLayer) || layerItems[0];
  const visibleGallery = gallery.filter((item) => activeFilter === "Все" || item[1] === activeFilter || item[2] === activeFilter);
  const activePartItem = projectParts.find((item) => item[0] === activePart) || projectParts[0];
  const activeMaterialItem = materials.find((item) => item[0] === activeMaterial) || materials[0];
  const previewImage = previewByStyle[selection.style] || previewByStyle["Современный минимализм"];
  const caseImageLabel = ["Пустое помещение", "План", "3D-визуализация", "Реализация"][caseState];

  function choose<K extends keyof Omit<SelectionState, "extras">>(key: K, value: SelectionState[K]) {
    setSelection((current) => ({ ...current, [key]: value }));
    track(ANALYTICS_EVENTS.DESIGN_CONFIG_CHOICE, { field: key, value });
  }

  function toggleExtra(value: string) {
    setSelection((current) => {
      const extras = current.extras.includes(value)
        ? current.extras.filter((item) => item !== value)
        : [...current.extras, value];
      return { ...current, extras };
    });
    track(ANALYTICS_EVENTS.DESIGN_CONFIG_CHOICE, { field: "extras", value });
  }

  const selectedSummary = useMemo(() => [
    selection.shape,
    selection.size,
    selection.style,
    selection.facade,
    ...selection.extras,
  ].join(" · "), [selection]);

  return (
    <>
      <section id="design-hero-stage" className="relative min-h-[100svh] overflow-hidden bg-stone-950 text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet={`${imageBase}/3d-proekt-kuhni-empty-room-20260629-mobile.webp`} />
          <img
            src={`${imageBase}/3d-proekt-kuhni-empty-room-20260629.webp`}
            alt="Пустое помещение кухни с окном и коммуникациями перед созданием 3D-проекта"
            className="absolute inset-0 h-full w-full object-cover"
            width={1600}
            height={914}
            fetchPriority="high"
          />
        </picture>
        <Image
          src={`${imageBase}/3d-proekt-kuhni-hero.webp`}
          alt="Финальная современная кухня после 3D-проектирования"
          width={1600}
          height={900}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none"
          style={{ opacity: heroStage >= 2 ? Math.min(0.9, (heroStage - 1) * 0.32) : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/10" />
        <div className={`absolute inset-x-[8%] top-[24%] hidden h-[42%] border border-white/35 md:block ${heroStage >= 1 ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
          <div className="absolute left-1/4 top-0 h-full border-l border-dashed border-white/35" />
          <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-white/35" />
          <div className="absolute bottom-4 left-6 rounded-full border border-white/50 px-3 py-1 text-xs">зона мойки</div>
          <div className="absolute right-8 top-6 rounded-full border border-white/50 px-3 py-1 text-xs">техника</div>
        </div>
        <div className="container-site relative z-10 flex min-h-[100svh] items-end pb-14 pt-28 sm:items-center sm:pb-0">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              От пустой комнаты до вашей будущей кухни
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">3D-проект кухни на заказ в Минске</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-xl">
              Увидьте будущую кухню до производства — с материалами, техникой, хранением и планировкой.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#request" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-100">
                Создать концепцию кухни
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/portfolio" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/45 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                Смотреть реальные проекты
              </Link>
            </div>
            <div className="mt-8 grid gap-2 sm:grid-cols-5" aria-label="Этапы превращения помещения в кухню">
              {heroStages.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setHeroStage(index)}
                  className={`rounded-lg border px-3 py-3 text-left text-xs transition-colors ${heroStage === index ? "border-amber-200 bg-white text-stone-950" : "border-white/20 bg-white/10 text-white/80"}`}
                >
                  <span className="block font-bold">{index + 1}. {item.title}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-white/70">{heroStages[heroStage]?.text}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="idea-builder">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Соберите идею кухни</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Быстрый визуальный подбор направления</h2>
            <p className="mt-4 text-muted-foreground">Это не сложный конструктор, а быстрый способ понять форму, стиль, фасады и дополнительные пожелания перед заявкой.</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-6 rounded-lg border border-border bg-muted/20 p-4 sm:p-5">
              <ChoiceGroup title="Форма кухни" items={choices.shape} value={selection.shape} onChoose={(value) => choose("shape", value)} />
              <ChoiceGroup title="Размер помещения" items={choices.size} value={selection.size} onChoose={(value) => choose("size", value)} />
              <ChoiceGroup title="Стиль" items={choices.style} value={selection.style} onChoose={(value) => choose("style", value)} />
              <ChoiceGroup title="Фасады" items={choices.facade} value={selection.facade} onChoose={(value) => choose("facade", value)} />
              <div>
                <h3 className="text-sm font-bold">Дополнительно</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {choices.extras.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleExtra(item)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${selection.extras.includes(item) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}
                    >
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky top-4 overflow-hidden rounded-lg border border-border bg-stone-950 text-white">
              <Image src={previewImage} alt={`Визуализация: ${selection.style}, ${selection.shape}`} width={1200} height={900} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <h3 className="text-2xl font-extrabold">Ваша кухня может выглядеть так</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">Мы подготовим планировку, подберем материалы и покажем будущую кухню до начала производства.</p>
                <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm text-white/80">{selectedSummary}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Link href="#request" onClick={() => track(ANALYTICS_EVENTS.DESIGN_CONFIG_COMPLETE, { shape: selection.shape, style: selection.style })} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-bold text-stone-950 hover:bg-amber-100">
                    Получить 3D-проект
                  </Link>
                  <Link href="#request" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
                    Отправить размеры
                  </Link>
                  <Link href="/contacts#form" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
                    Записаться на замер
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30" id="layers">
        <div className="container-site grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Разберите кухню на слои</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Из чего складывается удобная кухня</h2>
            <p className="mt-4 text-muted-foreground">Выбирайте слой: меняется крупная деталь и объяснение, за что отвечает этот элемент проекта.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {layerItems.map((item) => (
                <button key={item.key} type="button" onClick={() => { setActiveLayer(item.key); track(ANALYTICS_EVENTS.DESIGN_LAYER_OPEN, { layer: item.title }); }} className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition-colors ${activeLayer === item.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <Image src={activeLayerItem.image} alt={`${activeLayerItem.title} в 3D-проекте кухни`} width={900} height={720} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[5/4] w-full object-cover" />
            <div className="p-5">
              <h3 className="text-2xl font-extrabold">{activeLayerItem.title}</h3>
              <p className="mt-3 text-muted-foreground">{activeLayerItem.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="before-after">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">До и после проектирования</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Шесть ситуаций, где проект экономит ошибки</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {cases.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                <div className="relative">
                  {caseState === 0 ? (
                    <img src={`${imageBase}/3d-proekt-kuhni-empty-room-20260629-mobile.webp`} alt={`Исходное помещение для кейса ${item.title}`} className="aspect-[4/3] w-full object-cover" loading="lazy" width={760} height={434} />
                  ) : (
                    <Image src={item.final} alt={`${caseImageLabel}: ${item.title.toLowerCase()}`} width={900} height={675} sizes="(min-width: 1024px) 33vw, 100vw" className={`aspect-[4/3] w-full object-cover ${caseState === 1 ? "grayscale" : ""}`} />
                  )}
                  {caseState === 1 && <div className="absolute inset-6 border border-primary/70 bg-white/10"><div className="absolute left-1/2 top-0 h-full border-l border-dashed border-primary/80" /><div className="absolute left-0 top-1/2 w-full border-t border-dashed border-primary/80" /></div>}
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{item.area}</span><span>{item.type}</span><span>{caseImageLabel}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground"><b className="text-foreground">Проблема:</b> {item.problem}</p>
                  <p className="mt-2 text-sm text-muted-foreground"><b className="text-foreground">Решение:</b> {item.solution}</p>
                  <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    Смотреть похожие кухни
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <label htmlFor="case-state" className="text-sm font-bold">Состояние кейсов: {caseImageLabel}</label>
            <input id="case-state" type="range" min={0} max={3} value={caseState} onChange={(event) => { const value = Number(event.target.value); setCaseState(value); track(ANALYTICS_EVENTS.DESIGN_CASE_VIEW, { state: value }); }} className="mt-3 w-full accent-primary" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone-950 text-white" id="situations">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">Выберите свою ситуацию</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Быстрый переход к нужному решению</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {situations.map(([title, text, href, image]) => (
              <Link key={title} href={href} className="group relative min-h-[260px] overflow-hidden rounded-lg border border-white/15 bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Image src={image} alt={title} width={600} height={760} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm text-white/75">{text}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-white">Перейти <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="project-route">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Как создается проект</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Маршрут от размеров до расчета</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Отправляете помещение", "Фото комнаты, размеры, план БТИ или видео.", `${minskMechanismsBase}/minsk-measurement-01-vhod-v-kvartiru-mobile.webp`],
              ["Изучаем ограничения", "Окна, двери, вентиляция, трубы, радиаторы и розетки.", `${minskMechanismsBase}/minsk-measurement-04-kommunikatsii-mobile.webp`],
              ["Создаем планировку", "Собираем схему сверху и проверяем рабочие маршруты.", `${imageBase}/3d-proekt-kuhni-empty-room-20260629-mobile.webp`],
              ["Подбираем материалы", "Фасады, столешница, ручки, фурнитура и техника.", `${minskDetailsBase}/minsk-detail-15-fasad-i-svet-pod-uglom.webp`],
              ["Показываем 3D-визуализацию", "Вы видите будущую кухню до заказа.", `${imageBase}/3d-proekt-kuhni-hero.webp`],
              ["Согласовываем и рассчитываем", "Финальный проект, правки и предварительная стоимость.", `${minskProjectBase}/minsk-project-01-light-straight-tehnika-podsvetka.webp`],
            ].map(([title, text, image], index) => (
              <article key={title} className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                <Image src={image} alt={`${index + 1}. ${title}`} width={760} height={570} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <p className="text-sm font-bold text-primary">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="#request" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Начать проект кухни
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section-padding bg-muted/30" id="visual-gallery">
        <div className="container-site">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Галерея визуализаций</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Примеры кухонь, которые можно спроектировать</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${activeFilter === filter ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {visibleGallery.map((item, index) => (
              <article key={`${item[0]}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-lg border border-border bg-white">
                <button type="button" onClick={() => { setLightbox(item); track(ANALYTICS_EVENTS.LIGHTBOX_OPEN, { source: "design-gallery", title: item[0] }); }} className="group relative block w-full text-left">
                  <Image src={item[4]} alt={`${item[0]}: ${item[1]}, ${item[2]}, ${item[3]}`} width={1000} height={index % 2 ? 1250 : 760} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="w-full object-cover" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-stone-950 opacity-0 transition-opacity group-hover:opacity-100"><Maximize2 className="h-4 w-4" aria-hidden="true" /></span>
                </button>
                <div className="p-4">
                  <h3 className="font-extrabold">{item[0]}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item[1]} · {item[2]} · {item[3]}</p>
                  <Link href={item[5]} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    {index < 8 ? "Подробнее" : "Открыть раздел"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="project-includes">
        <div className="container-site grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Что входит в 3D-проект</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Проект как набор понятных решений</h2>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {projectParts.map((item) => (
                <button key={item[0]} type="button" onClick={() => setActivePart(item[0])} className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition-colors ${activePart === item[0] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  {item[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <Image src={activePartItem[2]} alt={`${activePartItem[0]} в составе 3D-проекта кухни`} width={900} height={720} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[5/4] w-full object-cover" />
            <div className="p-5">
              <h3 className="text-2xl font-extrabold">{activePartItem[0]}</h3>
              <p className="mt-3 text-muted-foreground">{activePartItem[1]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30" id="materials-eye">
        <div className="container-site grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <Image src={activeMaterialItem[1]} alt={`Материал в проекте кухни: ${activeMaterialItem[0]}`} width={1200} height={850} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[16/10] w-full object-cover" />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Материалы глазами</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Смотрите фактуры крупно</h2>
            <p className="mt-4 text-muted-foreground">{activeMaterialItem[2]}</p>
            <div className="mt-6 grid gap-2">
              {materials.map((item) => (
                <button key={item[0]} type="button" onClick={() => { setActiveMaterial(item[0]); track(ANALYTICS_EVENTS.DESIGN_MATERIAL_OPEN, { material: item[0] }); }} className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition-colors ${activeMaterial === item[0] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  {item[0]}
                </button>
              ))}
            </div>
            <p className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Оттенок материалов на экране может отличаться от реального. Перед производством образцы согласовываются лично.</p>
          </div>
        </div>
      </section>

      <Link href="#request" className="fixed inset-x-3 bottom-3 z-40 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-xl shadow-black/20 md:hidden">
        Получить проект
      </Link>

      {lightbox && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={lightbox[0]}>
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white">
            <button type="button" onClick={() => setLightbox(null)} className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-stone-950 shadow" aria-label="Закрыть просмотр">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <Image src={lightbox[4]} alt={`${lightbox[0]} крупным планом`} width={1400} height={950} sizes="100vw" className="max-h-[78vh] w-full object-contain bg-stone-950" />
            <div className="p-5">
              <h3 className="text-xl font-extrabold">{lightbox[0]}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{lightbox[1]} · {lightbox[2]} · {lightbox[3]}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChoiceGroup({ title, items, value, onChoose }: { title: string; items: string[]; value: string; onChoose: (value: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => onChoose(item)} className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${value === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
