"use client";

import Image from "next/image";
import Link from "@/components/navigation/Link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Maximize2, MessageCircle, X } from "lucide-react";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

const imageBase = "/images/design-proekt-kuhni";
const minskProjectBase = "/uploads/locations/minsk-stage34";
const minskDetailsBase = "/uploads/locations/minsk-stage34";
const minskMechanismsBase = "/uploads/locations/minsk-stage56";
const portfolioBase = "/uploads/kitchens/portfolio";

const heroStages = [
  {
    title: "Кухня",
    text: "Сразу показываем, каким может быть понятный финальный результат.",
    image: `${imageBase}/3d-proekt-kuhni-hero.webp`,
    mobileImage: `${imageBase}/3d-proekt-kuhni-hero-mobile-v2.webp`,
    alt: "Готовая кухня после 3D-проектирования",
  },
  {
    title: "Комната",
    text: "Проверяем стены, окно, коммуникации и реальные ограничения.",
    image: `${imageBase}/3d-proekt-kuhni-empty-room-20260629.webp`,
    mobileImage: `${imageBase}/3d-proekt-kuhni-empty-room-mobile-v2.webp`,
    alt: "Пустое помещение кухни перед созданием 3D-проекта",
  },
  {
    title: "План",
    text: "Появляются размеры, рабочие зоны, техника и проходы.",
    image: `${imageBase}/3d-proekt-kuhni-empty-room-20260629-plan.webp`,
    mobileImage: `${imageBase}/3d-proekt-kuhni-plan-mobile-v2.webp`,
    alt: "Помещение кухни с чертежными линиями планировки",
  },
  {
    title: "Материалы",
    text: "Добавляем модули, фасады, столешницу и встроенную технику.",
    image: `${imageBase}/3d-proekt-uglovaya-kuhnya.webp`,
    mobileImage: `${imageBase}/3d-proekt-kuhni-materials-mobile-v2.webp`,
    alt: "Появление модулей угловой кухни в 3D-проекте",
  },
];

const choices = {
  shape: ["Прямая", "Угловая", "П-образная", "С островом", "Кухня-гостиная"],
  size: ["До 8 м2", "8-12 м2", "12-20 м2", "Более 20 м2"],
  style: ["Современный минимализм", "Теплая кухня с деревом", "Светлая кухня", "Темная кухня", "Неоклассика"],
  facade: ["Матовые", "Под дерево", "Без ручек", "Рамочные", "Комбинированные"],
  extras: ["Кухня до потолка", "Встроенная техника", "Подсветка", "Остров или барная стойка", "Много систем хранения"],
};

const shapeOptions = [
  {
    name: "Прямая",
    image: `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`,
    mobileImage: `${imageBase}/3d-proekt-pryamaya-kuhnya-mobile.webp`,
    href: "/catalog/pryamye-kuhni",
    caption: "Лаконичная линия для вытянутой кухни или небольшой квартиры.",
    benefits: ["легко рассчитать бюджет", "удобно встроить технику"],
    alt: "Прямая светлая кухня в 3D-проекте",
  },
  {
    name: "Угловая",
    image: `${imageBase}/3d-proekt-uglovaya-kuhnya.webp`,
    mobileImage: `${imageBase}/3d-proekt-uglovaya-kuhnya-mobile.webp`,
    href: "/catalog/uglovye-kuhni",
    caption: "Рабочий треугольник получается компактным, а хранение уходит на две стены.",
    benefits: ["много рабочей поверхности", "подходит для большинства квартир"],
    alt: "Угловая кухня в 3D-проекте",
  },
  {
    name: "П-образная",
    image: `${imageBase}/3d-proekt-p-obraznaya-kuhnya.webp`,
    mobileImage: `${imageBase}/3d-proekt-p-obraznaya-kuhnya-mobile.webp`,
    href: "/catalog/p-obraznye-kuhni",
    caption: "Максимум хранения и столешницы, когда нужно задействовать три стороны.",
    benefits: ["много зон хранения", "удобно разделить мойку, плиту и подготовку"],
    alt: "П-образная кухня в 3D-проекте",
  },
  {
    name: "С островом",
    image: `${imageBase}/3d-proekt-kuhnya-s-ostrovom.webp`,
    mobileImage: `${imageBase}/3d-proekt-kuhnya-s-ostrovom-mobile.webp`,
    href: "/catalog/kuhni-s-ostrovom",
    caption: "Остров показывает, как кухня будет работать для готовки и общения.",
    benefits: ["дополнительная поверхность", "видны проходы вокруг острова"],
    alt: "Кухня с островом в 3D-проекте",
  },
  {
    name: "Кухня-гостиная",
    image: `${minskProjectBase}/minsk-project-05-island-living-obshchiy-vid.webp`,
    mobileImage: `${imageBase}/3d-proekt-kuhnya-gostinaya-mobile.webp`,
    href: "/catalog/kuhni-s-ostrovom",
    caption: "Смотрим кухню как часть гостиной: фасады, свет и спокойную линию хранения.",
    benefits: ["единый интерьер", "понятен вид со стороны гостиной"],
    alt: "Кухня-гостиная с островом в 3D-проекте",
  },
];

const configVisuals = {
  style: {
    "Современный минимализм": {
      image: `${imageBase}/config-style-modern-minimalism.webp`,
      title: "Современный минимализм",
      caption: "Чистые линии, ровные фасады и спокойная палитра без лишних деталей.",
      benefits: ["ровная геометрия", "легко согласовать технику"],
      alt: "Кухня в стиле современный минимализм",
    },
    "Теплая кухня с деревом": {
      image: `${imageBase}/config-style-warm-wood.webp`,
      title: "Теплая кухня с деревом",
      caption: "Древесная фактура делает проект мягче и хорошо сочетается со светлым камнем.",
      benefits: ["теплая фактура", "уютный вид кухни"],
      alt: "Теплая кухня с древесными фасадами",
    },
    "Светлая кухня": {
      image: `${imageBase}/config-style-light.webp`,
      title: "Светлая кухня",
      caption: "Светлые фасады визуально расширяют помещение и дают спокойный базовый образ.",
      benefits: ["легкий интерьер", "подходит для маленькой кухни"],
      alt: "Светлая кухня в 3D-проекте",
    },
    "Темная кухня": {
      image: `${imageBase}/config-style-dark.webp`,
      title: "Темная кухня",
      caption: "Графитовые фасады смотрятся выразительно, если сразу заложить свет и теплые акценты.",
      benefits: ["выразительный образ", "важен сценарий света"],
      alt: "Темная современная кухня",
    },
    "Неоклассика": {
      image: `${imageBase}/config-style-neoclassic.webp`,
      title: "Неоклассика",
      caption: "Рамочные фасады и мягкие оттенки дают более спокойный классический характер кухни.",
      benefits: ["рамочные детали", "мягкий классический вид"],
      alt: "Неоклассическая кухня в 3D-проекте",
    },
  },
  facade: {
    "Матовые": {
      image: `${imageBase}/config-facade-matte.webp`,
      title: "Матовые фасады",
      caption: "Матовая поверхность выглядит спокойно и не перегружает кухню бликами.",
      benefits: ["меньше визуального шума", "спокойный современный вид"],
      alt: "Кухня с матовыми фасадами",
    },
    "Под дерево": {
      image: `${imageBase}/config-facade-wood.webp`,
      title: "Фасады под дерево",
      caption: "Древесная текстура добавляет тепла и помогает связать кухню с интерьером.",
      benefits: ["видна текстура", "теплый материал"],
      alt: "Кухня с фасадами под дерево",
    },
    "Без ручек": {
      image: `${imageBase}/config-facade-handleless.webp`,
      title: "Фасады без ручек",
      caption: "Профиль или push-to-open оставляют фасады ровными и визуально легче.",
      benefits: ["чистая линия", "аккуратное открывание"],
      alt: "Кухня с фасадами без ручек",
    },
    "Рамочные": {
      image: `${imageBase}/config-facade-framed.webp`,
      title: "Рамочные фасады",
      caption: "Рамка добавляет глубину фасадам и подходит для неоклассики.",
      benefits: ["объемная дверь", "классический акцент"],
      alt: "Кухня с рамочными фасадами",
    },
    "Комбинированные": {
      image: `${imageBase}/config-facade-combined.webp`,
      title: "Комбинированные фасады",
      caption: "Сочетание светлых и древесных фасадов помогает разделить зоны кухни.",
      benefits: ["баланс материалов", "видно разделение зон"],
      alt: "Кухня с комбинированными фасадами",
    },
  },
  extras: {
    "Кухня до потолка": {
      image: `${imageBase}/config-extra-ceiling.webp`,
      title: "Кухня до потолка",
      caption: "Антресоли и доборы сразу показывают, как будет выглядеть верхняя линия кухни.",
      benefits: ["больше хранения", "ровная линия до потолка"],
      alt: "Кухня со шкафами до потолка",
    },
    "Встроенная техника": {
      image: `${imageBase}/config-extra-appliances.webp`,
      title: "Встроенная техника",
      caption: "Духовой шкаф, холодильник и посудомойка учитываются до запуска мебели.",
      benefits: ["понятны габариты", "видно расположение техники"],
      alt: "Кухня со встроенной техникой",
    },
    "Подсветка": {
      image: `${imageBase}/config-extra-lighting.webp`,
      title: "Подсветка",
      caption: "Рабочий свет сразу меняет восприятие фасадов, фартука и столешницы.",
      benefits: ["виден вечерний сценарий", "удобнее рабочая зона"],
      alt: "Кухня с подсветкой рабочей зоны",
    },
    "Остров или барная стойка": {
      image: `${imageBase}/config-extra-island.webp`,
      title: "Остров или барная стойка",
      caption: "В проекте видно, хватает ли проходов и как остров работает в кухне-гостиной.",
      benefits: ["проверка проходов", "дополнительная поверхность"],
      alt: "Кухня с островом и барной стойкой",
    },
    "Много систем хранения": {
      image: `${imageBase}/config-extra-storage.webp`,
      title: "Много систем хранения",
      caption: "Выдвижные ящики, пеналы и органайзеры лучше согласовать до производства.",
      benefits: ["понятно наполнение", "меньше пустых зон"],
      alt: "Кухня с системами хранения",
    },
  },
} as const;

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
  ["Неоклассическая кухня", "Неоклассика", "Светлые", "14 м2", `${imageBase}/3d-proekt-neoklassicheskaya-kuhnya.webp`, "/portfolio?style=neoklassika"],
  ["Темная кухня с деревом", "Угловые", "Темные", "14 м2", `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`, "/catalog/uglovye-kuhni"],
  ["Кухня-гостиная с островом", "С островом", "Современные", "20 м2", `${minskProjectBase}/minsk-project-05-island-living-obshchiy-vid.webp`, "/catalog/kuhni-s-ostrovom"],
  ["Кухня до потолка", "До потолка", "Светлые", "11 м2", `${imageBase}/3d-proekt-kuhnya-do-potolka.webp`, "/catalog/kuhni-do-potolka"],
] as const;

const filters = ["Все", "Прямые", "Угловые", "Маленькие", "П-образные", "С островом", "До потолка", "Без ручек", "Светлые", "Темные", "Неоклассика"];

const routeSteps = [
  {
    title: "Отправляете помещение",
    text: "Фото комнаты, размеры, план БТИ или короткое видео.",
    image: `${minskMechanismsBase}/minsk-measurement-01-vhod-v-kvartiru-mobile.webp`,
    cue: "вводные",
  },
  {
    title: "Изучаем ограничения",
    text: "Окна, двери, вентиляция, трубы, радиаторы и розетки.",
    image: `${minskMechanismsBase}/minsk-measurement-04-kommunikatsii-mobile.webp`,
    cue: "проверка",
  },
  {
    title: "Создаем планировку",
    text: "Собираем схему сверху и проверяем рабочие маршруты.",
    image: `${imageBase}/3d-proekt-kuhni-empty-room-20260629-mobile.webp`,
    cue: "план",
  },
  {
    title: "Подбираем материалы",
    text: "Фасады, столешница, ручки, фурнитура и техника.",
    image: `${minskDetailsBase}/minsk-detail-15-fasad-i-svet-pod-uglom.webp`,
    cue: "образцы",
  },
  {
    title: "Показываем 3D-визуализацию",
    text: "Вы видите будущую кухню до заказа и правок в производстве.",
    image: `${imageBase}/3d-proekt-kuhni-hero.webp`,
    cue: "визуал",
  },
  {
    title: "Согласовываем и рассчитываем",
    text: "Финальный проект, правки и предварительная стоимость.",
    image: `${minskProjectBase}/minsk-project-01-light-straight-tehnika-podsvetka.webp`,
    cue: "расчет",
  },
] as const;

const beforeAfterBenefits = [
  "Добавили хранение до потолка",
  "Увеличили рабочую зону",
  "Скрыли коммуникации",
  "Встроили технику",
];

const projectParts = [
  ["Планировка", "Схема модулей, проходов и рабочих зон под реальные размеры.", `${minskMechanismsBase}/minsk-measurement-02-lazernaya-ruletka-mobile.webp`, "размеры и проходы"],
  ["Расстановка техники", "Проверяем холодильник, духовой шкаф, варочную, мойку и посудомойку.", `${minskMechanismsBase}/minsk-mechanism-08-vstroennaya-posudomoyka-square.webp`, "техника"],
  ["Схема хранения", "Показываем пеналы, ящики, органайзеры и верхние зоны.", `${minskMechanismsBase}/minsk-mechanism-06-organayzer-dlya-priborov-square.webp`, "хранение"],
  ["Подбор фасадов", "Сравниваем матовые, древесные, рамочные и комбинированные фасады.", `${minskDetailsBase}/minsk-detail-01-matovyy-fasad.webp`, "фасады"],
  ["Подбор столешницы", "Смотрим толщину, кромку, стыки, влагостойкость и визуальный баланс с фасадами.", `${minskDetailsBase}/minsk-detail-13-styk-stoleshnitsy.webp`, "столешница"],
  ["Цветовая палитра", "Собираем сочетание фасадов, дерева, камня, фартука и стен без случайных оттенков.", `${minskProjectBase}/minsk-project-06-private-house-fasady-derevo.webp`, "палитра"],
  ["Освещение", "Отдельно смотрим рабочий свет, вечерний сценарий и декоративную подсветку.", `${minskDetailsBase}/minsk-detail-12-podsvetka-rabochey-zony.webp`, "свет"],
  ["3D-визуализация", "Финальный вид кухни помогает принять решение до производства.", `${imageBase}/3d-proekt-kuhni-hero.webp`, "рендер"],
  ["Предварительный расчет", "После согласования решений понятнее видны материалы, сложность и ориентир бюджета.", `${minskProjectBase}/minsk-project-02-corner-ceiling-stoleshnitsa-krupno.webp`, "стоимость"],
  ["Правки до согласования", "Можно заменить фасады, ручки, технику, свет и компоновку до запуска кухни.", `${minskMechanismsBase}/minsk-measurement-05-obsuzhdenie-planirovki-mobile.webp`, "правки"],
] as const;

const materials = [
  ["Фасады", "Светлый матовый фасад", `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`, "Спокойная база для маленьких и светлых помещений.", `${imageBase}/3d-proekt-pryamaya-kuhnya.webp`],
  ["Фасады", "Графитовый матовый фасад", `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`, "Выразительный вариант для современного интерьера.", `${minskProjectBase}/minsk-project-03-dark-wood-tehnika-podsvetka.webp`],
  ["Фасады", "Дубовый фасад", `${minskDetailsBase}/minsk-detail-02-drevesnaya-tekstura.webp`, "Теплая фактура дерева смягчает современную планировку.", `${minskProjectBase}/minsk-project-06-private-house-obshchiy-vid.webp`],
  ["Столешницы", "Мраморная столешница", `${minskDetailsBase}/minsk-detail-03-kamennaya-stoleshnitsa.webp`, "Акцентная фактура для рабочей зоны и острова.", `${imageBase}/3d-proekt-kuhnya-s-ostrovom.webp`],
  ["Столешницы", "Темный камень", `${minskProjectBase}/minsk-project-03-dark-wood-stoleshnitsa-krupno.webp`, "Глубокий контраст для темной кухни с деревом.", `${minskProjectBase}/minsk-project-03-dark-wood-obshchiy-vid.webp`],
  ["Фартуки", "Каменный фартук", `${minskProjectBase}/minsk-project-06-private-house-stoleshnitsa-kamen.webp`, "Единая плоскость столешницы и фартука выглядит собранно.", `${minskProjectBase}/minsk-project-06-private-house-obshchiy-vid.webp`],
  ["Ручки", "Профиль без ручек", `${minskDetailsBase}/minsk-detail-05-profil-bez-ruchek.webp`, "Линия фасадов остается чистой, а открывание проверяется в проекте.", `${imageBase}/3d-proekt-kuhnya-bez-ruchek.webp`],
  ["Фурнитура", "Выдвижной ящик", `${minskDetailsBase}/minsk-detail-09-vydvizhnoy-yashchik-vnutri.webp`, "Внутреннее хранение видно до заказа кухни.", `${minskMechanismsBase}/minsk-mechanism-06-organayzer-dlya-priborov-square.webp`],
  ["Подсветка", "Подсветка рабочей зоны", `${minskDetailsBase}/minsk-detail-12-podsvetka-rabochey-zony.webp`, "Рабочая зона становится удобнее вечером.", `${minskProjectBase}/minsk-project-01-light-straight-tehnika-podsvetka.webp`],
] as const;

const materialCategories = ["Фасады", "Столешницы", "Фартуки", "Ручки", "Фурнитура", "Подсветка"] as const;

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
  material?: string;
  extras: string[];
}

type ConfigVisualSource = {
  type: "shape" | "style" | "facade" | "extras";
  value: string;
};

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
  const [activeMaterialCategory, setActiveMaterialCategory] = useState<string>(materialCategories[0]);
  const [activeMaterial, setActiveMaterial] = useState<string>(materials[0][1]);
  const [activeConfigSource, setActiveConfigSource] = useState<ConfigVisualSource>({ type: "shape", value: choices.shape[1] });
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(52);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  const beforeAfterTouchStart = useRef<{ x: number; y: number } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const configStarted = useRef(false);
  const trackedScrollDepths = useRef(new Set<number>());
  const lightboxIndex = lightbox ? gallery.findIndex((item) => item[0] === lightbox[0]) : -1;

  useEffect(() => {
    track(ANALYTICS_EVENTS.DESIGN_HERO_VIEW, { page: "design-proekt-kuhni" });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeroStage(heroStages.length - 1);
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const hero = document.getElementById("design-hero-stage");
        if (!hero) return;
        const progress = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / (window.innerHeight * 1.15)));
        setHeroStage(Math.min(heroStages.length - 1, Math.floor(progress * heroStages.length)));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const depths = [25, 50, 75, 90];
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        const currentDepth = Math.round((window.scrollY / maxScroll) * 100);
        depths.forEach((depth) => {
          if (currentDepth >= depth && !trackedScrollDepths.current.has(depth)) {
            trackedScrollDepths.current.add(depth);
            track(ANALYTICS_EVENTS.DESIGN_SCROLL_DEPTH, { depth, page: "design-proekt-kuhni" });
          }
        });
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    saveSelection(selection);
  }, [selection]);

  useEffect(() => {
    const update = () => {
      const request = document.getElementById("request");
      const panel = document.getElementById("design-mobile-sticky-panel");
      if (!panel || !request) return;
      const requestTop = request.getBoundingClientRect().top;
      const shouldShow = window.scrollY > window.innerHeight * 0.9 && requestTop > window.innerHeight * 1.2;
      panel.classList.toggle("hidden", !shouldShow);
    };

    update();
    const interval = window.setInterval(update, 400);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
      if (event.key === "ArrowLeft") {
        navigateLightbox(-1);
      }
      if (event.key === "ArrowRight") {
        navigateLightbox(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, lightboxIndex]);

  const activeLayerItem = layerItems.find((item) => item.key === activeLayer) || layerItems[0];
  const visibleGallery = gallery.filter((item) => activeFilter === "Все" || item[1] === activeFilter || item[2] === activeFilter);
  const activePartItem = projectParts.find((item) => item[0] === activePart) || projectParts[0];
  const visibleMaterials = materials.filter((item) => item[0] === activeMaterialCategory);
  const activeMaterialItem = materials.find((item) => item[1] === activeMaterial) || visibleMaterials[0] || materials[0];
  const activeShapeItem = shapeOptions.find((item) => item.name === selection.shape) || shapeOptions[1];
  const activeConfigVisual = useMemo(() => {
    if (activeConfigSource.type === "style") {
      return configVisuals.style[activeConfigSource.value as keyof typeof configVisuals.style] || configVisuals.style[selection.style as keyof typeof configVisuals.style];
    }
    if (activeConfigSource.type === "facade") {
      return configVisuals.facade[activeConfigSource.value as keyof typeof configVisuals.facade] || configVisuals.facade[selection.facade as keyof typeof configVisuals.facade];
    }
    if (activeConfigSource.type === "extras") {
      return configVisuals.extras[activeConfigSource.value as keyof typeof configVisuals.extras] || configVisuals.extras[selection.extras[selection.extras.length - 1] as keyof typeof configVisuals.extras];
    }
    return {
      image: activeShapeItem.image,
      title: `${activeShapeItem.name} кухня`,
      caption: activeShapeItem.caption,
      benefits: activeShapeItem.benefits,
      alt: activeShapeItem.alt,
    };
  }, [activeConfigSource, activeShapeItem, selection.extras, selection.facade, selection.style]);
  const caseImageLabel = ["Пустое помещение", "План", "3D-визуализация", "Реализация"][caseState];

  const updateBeforeAfterPosition = useCallback((clientX: number) => {
    const bounds = beforeAfterRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width <= 0) return;

    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    setBeforeAfterPosition(Math.min(92, Math.max(8, Math.round(nextPosition))));
  }, []);

  const handleBeforeAfterPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.type === "pointerdown") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      if (event.type === "pointermove" && event.pointerType === "mouse" && event.buttons !== 1) return;

      updateBeforeAfterPosition(event.clientX);
    },
    [updateBeforeAfterPosition],
  );

  const handleBeforeAfterTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;

      beforeAfterTouchStart.current = { x: touch.clientX, y: touch.clientY };
      updateBeforeAfterPosition(touch.clientX);
    },
    [updateBeforeAfterPosition],
  );

  const handleBeforeAfterTouchMove = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;

      const start = beforeAfterTouchStart.current;
      if (start && Math.abs(touch.clientX - start.x) > Math.abs(touch.clientY - start.y) + 4) {
        event.preventDefault();
      }

      updateBeforeAfterPosition(touch.clientX);
    },
    [updateBeforeAfterPosition],
  );

  function choose<K extends "shape" | "size" | "style" | "facade">(key: K, value: SelectionState[K]) {
    trackConfigStart();
    setSelection((current) => ({ ...current, [key]: value }));
    if (key === "shape" || key === "style" || key === "facade") {
      setActiveConfigSource({ type: key, value });
    }
    track(ANALYTICS_EVENTS.DESIGN_CONFIG_CHOICE, { field: key, value });
  }

  function toggleExtra(value: string) {
    trackConfigStart();
    setSelection((current) => {
      const extras = current.extras.includes(value)
        ? current.extras.filter((item) => item !== value)
        : [...current.extras, value];
      return { ...current, extras };
    });
    setActiveConfigSource({ type: "extras", value });
    track(ANALYTICS_EVENTS.DESIGN_CONFIG_CHOICE, { field: "extras", value });
  }

  function trackConfigStart() {
    if (configStarted.current) return;
    configStarted.current = true;
    track(ANALYTICS_EVENTS.DESIGN_CONFIG_START, { page: "design-proekt-kuhni" });
  }

  function chooseMaterialCategory(category: string) {
    const firstMaterial = materials.find((item) => item[0] === category);
    setActiveMaterialCategory(category);
    if (firstMaterial) {
      setActiveMaterial(firstMaterial[1]);
    }
    track(ANALYTICS_EVENTS.DESIGN_MATERIAL_OPEN, { category });
  }

  function chooseProjectPart(part: string) {
    setActivePart(part);
    track(ANALYTICS_EVENTS.DESIGN_PROJECT_PART_OPEN, { part });
  }

  function chooseMaterial(material: (typeof materials)[number]) {
    setActiveMaterial(material[1]);
    setSelection((current) => ({ ...current, material: material[1] }));
    track(ANALYTICS_EVENTS.DESIGN_MATERIAL_OPEN, { category: material[0], material: material[1] });
  }

  function navigateLightbox(direction: -1 | 1) {
    if (!lightbox) return;
    const nextIndex = (lightboxIndex + direction + gallery.length) % gallery.length;
    const nextItem = gallery[nextIndex];
    setLightbox(nextItem);
    track(ANALYTICS_EVENTS.DESIGN_GALLERY_NAVIGATE, { title: nextItem[0], direction });
  }

  function trackPortfolioClick(source: string, target: string, title?: string) {
    track(ANALYTICS_EVENTS.DESIGN_PORTFOLIO_CLICK, { source, target, title: title || "" });
  }

  const selectedSummary = useMemo(() => [
    selection.shape,
    selection.size,
    selection.style,
    selection.facade,
    selection.material || activeMaterial,
    ...selection.extras,
  ].join(" · "), [activeMaterial, selection]);

  return (
    <>
      <section id="design-hero-stage" className="relative min-h-[100svh] overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0 bg-stone-900">
          {heroStages.map((stage, index) => (
            <picture key={stage.title}>
              <source media="(max-width: 640px)" srcSet={stage.mobileImage} />
              <img
                src={stage.image}
                alt={stage.alt}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${heroStage === index ? "opacity-100" : "opacity-0"}`}
                width={index < 2 ? 1600 : 1200}
                height={index < 2 ? 914 : 900}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </picture>
          ))}
          <noscript>
            <img src={`${imageBase}/3d-proekt-kuhni-hero.webp`} alt="Готовая кухня после 3D-проектирования" className="h-full w-full object-cover" />
          </noscript>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/5" />
        <div className="container-site relative z-10 flex min-h-[100svh] items-end pb-12 pt-36 sm:items-center sm:pb-0">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">3D-проект кухни на заказ</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl">
              Увидьте будущую кухню до производства: планировка, материалы, техника и свет.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              <Link href="#request" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { source: "design-hero", target: "request" })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-center text-sm font-bold leading-tight text-stone-950 transition-colors hover:bg-amber-100 sm:px-6">
                Создать проект
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
              <Link href="#before-after" onClick={() => trackPortfolioClick("design-hero", "#before-after")} className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/45 px-3 py-3 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-white/10 sm:px-6">
                До/после
              </Link>
              <Link href="#visual-gallery" onClick={() => trackPortfolioClick("design-hero", "#visual-gallery")} className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-lg border border-white/35 px-3 py-3 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-white/10 sm:col-span-1 sm:px-6">
                Кухни
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2" aria-label="Короткие преимущества 3D-проекта">
              {["3D — увидите результат", "Планировка — всё поместится", "Смета — понятен бюджет"].map((item) => (
                <div key={item} className="rounded-lg border border-white/20 bg-white/10 p-3 text-xs font-bold leading-snug text-white backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Этапы превращения помещения в кухню">
              {heroStages.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setHeroStage(index)}
                  className={`min-h-10 rounded-lg border px-2 py-2 text-center text-[11px] font-bold leading-tight transition-colors sm:text-xs ${heroStage === index ? "border-amber-200 bg-white text-stone-950" : "border-white/20 bg-white/10 text-white/80"}`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <p className="mt-2 min-h-10 text-sm text-white/75">{heroStages[heroStage]?.text}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="before-after">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">До / После</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Как меняется пространство</h2>
              <p className="mt-4 text-lg font-extrabold text-foreground">Кухня в хрущёвке, 6,3 м²</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Передвигайте ползунок: слева исходное помещение до проекта, справа готовая кухня после согласования планировки, фасадов и техники.
              </p>
              <div className="mt-6 grid gap-3">
                {beforeAfterBenefits.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm font-bold">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="#before-after-cases" onClick={() => trackPortfolioClick("design-before-after-preview", "#before-after-cases")} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                Смотреть примеры по ситуациям
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="rounded-lg border border-border bg-white p-3 shadow-sm sm:p-4">
              <div
                ref={beforeAfterRef}
                role="group"
                className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg bg-stone-100 sm:aspect-[16/10]"
                aria-label="Сравнение кухни до и после проектирования"
                onPointerDown={handleBeforeAfterPointer}
                onPointerMove={handleBeforeAfterPointer}
                onTouchStart={handleBeforeAfterTouchStart}
                onTouchMove={handleBeforeAfterTouchMove}
                onTouchEnd={() => {
                  beforeAfterTouchStart.current = null;
                }}
                style={{ touchAction: "pan-y" }}
              >
                <Image src={`${imageBase}/before-after-hruschevka-room-after-20260704.webp`} alt="После проектирования: та же кухня в хрущёвке с гарнитуром до потолка и встроенной техникой" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" draggable={false} />
                <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${beforeAfterPosition}%` }} aria-hidden="true">
                  <img
                    src={`${imageBase}/before-after-hruschevka-room-before-20260704.webp`}
                    alt="До проектирования: та же пустая кухня в хрущёвке с окном, радиатором и коммуникациями"
                    width={1400}
                    height={933}
                    className="absolute inset-0 h-full max-w-none object-cover"
                    draggable={false}
                    loading="eager"
                    style={{ width: `${10000 / Math.max(beforeAfterPosition, 1)}%` }}
                  />
                </div>
                <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" style={{ left: `${beforeAfterPosition}%` }} aria-hidden="true" />
                <div className="absolute top-3 flex w-full justify-between px-3 text-xs font-extrabold text-white">
                  <span className="rounded-full bg-stone-950/75 px-3 py-1">До</span>
                  <span className="rounded-full bg-stone-950/75 px-3 py-1">После</span>
                </div>
                <div className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-primary text-primary-foreground shadow-lg" style={{ left: `${beforeAfterPosition}%` }} aria-hidden="true">
                  <span className="flex items-center">
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronRight className="-ml-1 h-4 w-4" />
                  </span>
                </div>
              </div>
              <label htmlFor="before-after-slider" className="mt-4 block text-sm font-bold">
                Ручной ползунок «до / после»
              </label>
              <input
                id="before-after-slider"
                type="range"
                min="8"
                max="92"
                value={beforeAfterPosition}
                onChange={(event) => setBeforeAfterPosition(Number(event.target.value))}
                aria-label="Переместить ползунок до и после проекта кухни"
                className="mt-3 h-8 w-full cursor-ew-resize accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ touchAction: "pan-y" }}
              />
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-bold">
                <p className="rounded-lg bg-muted/40 p-3">До: пустое помещение, коммуникации и мало хранения.</p>
                <p className="rounded-lg bg-muted/40 p-3">После: кухня до потолка, техника и рабочая зона.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="idea-builder">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Соберите идею кухни</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Выберите форму будущей кухни</h2>
            <p className="mt-4 text-muted-foreground">Нажмите на вариант — покажем, как может выглядеть кухня в таком формате.</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="min-w-0 space-y-6">
              <div className="-mx-4 flex snap-x gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-1">
                {shapeOptions.map((shape) => (
                  <button
                    key={shape.name}
                    type="button"
                    onClick={() => choose("shape", shape.name)}
                    className={`w-[82vw] shrink-0 snap-start overflow-hidden rounded-lg border text-left transition-colors sm:w-auto ${selection.shape === shape.name ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15" : "border-border bg-white hover:border-primary/40"}`}
                  >
                    <picture>
                      <source media="(max-width: 640px)" srcSet={shape.mobileImage} />
                      <img src={shape.image} alt={shape.alt} width={720} height={540} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    </picture>
                    <span className="block p-4">
                      <span className="block text-lg font-extrabold">{shape.name}</span>
                      <span className={`mt-2 block text-sm ${selection.shape === shape.name ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{shape.caption}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="space-y-6 rounded-lg border border-border bg-muted/20 p-4 sm:p-5">
                <p className="mb-4 text-sm font-bold text-muted-foreground">Уточните стиль и комплектацию</p>
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
            </div>
            <div className="sticky top-4 overflow-hidden rounded-lg border border-border bg-stone-950 text-white">
              <img src={activeConfigVisual.image} alt={activeConfigVisual.alt} width={960} height={720} loading="lazy" className="aspect-[4/5] w-full object-cover transition-opacity duration-300 sm:aspect-[4/3]" />
              <div className="p-5">
                <p className="rounded-lg bg-white/10 p-3 text-sm font-bold text-white">Показано: {activeConfigVisual.title.toLowerCase()}</p>
                <h3 className="mt-4 text-2xl font-extrabold">{activeConfigVisual.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{activeConfigVisual.caption}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {activeConfigVisual.benefits.map((benefit) => (
                    <span key={benefit} className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white/85">{benefit}</span>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-white/10 p-3 text-sm text-white/80">{selectedSummary}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link href={activeShapeItem.href} onClick={() => trackPortfolioClick("design-shape", activeShapeItem.href, activeShapeItem.name)} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-3 py-2 text-center text-sm font-bold leading-tight text-white hover:bg-white/10">
                    <span className="sm:hidden">Похожие</span>
                    <span className="hidden sm:inline">Посмотреть похожие кухни</span>
                  </Link>
                  <Link href="#request" onClick={() => track(ANALYTICS_EVENTS.DESIGN_CONFIG_COMPLETE, { shape: selection.shape, style: selection.style, size: selection.size, facade: selection.facade, extras: selection.extras.join(", ") })} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-3 py-2 text-center text-sm font-bold leading-tight text-stone-950 hover:bg-amber-100">
                    <span className="sm:hidden">Заявка</span>
                    <span className="hidden sm:inline">Получить проект такой кухни</span>
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

      <section className="section-padding bg-white" id="before-after-cases">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Примеры до и после</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Шесть ситуаций, где проект экономит ошибки</h2>
          </div>
          <div className="mt-8 flex snap-x gap-4 overflow-x-auto overscroll-x-contain pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {cases.map((item) => (
              <article key={item.title} className="w-[86vw] shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-white shadow-sm sm:w-[420px] lg:w-auto">
                <div className="relative">
                  {caseState === 0 ? (
                    <img src={`${imageBase}/3d-proekt-kuhni-empty-room-20260629-mobile.webp`} alt={`Исходное помещение для кейса ${item.title}`} className="h-[58svh] min-h-[360px] w-full object-cover lg:h-auto lg:aspect-[4/3] lg:min-h-0" loading="lazy" width={760} height={1010} />
                  ) : (
                    <Image src={item.final} alt={`${caseImageLabel}: ${item.title.toLowerCase()}`} width={900} height={675} sizes="(min-width: 1024px) 33vw, 86vw" className={`h-[58svh] min-h-[360px] w-full object-cover lg:h-auto lg:aspect-[4/3] lg:min-h-0 ${caseState === 1 ? "grayscale" : ""}`} />
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
                  <Link href={item.href} onClick={() => trackPortfolioClick("design-before-after", item.href, item.title)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    Смотреть похожие кухни
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-bold">Этап кейса: {caseImageLabel}</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {["До", "План", "3D", "Результат"].map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setCaseState(index); track(ANALYTICS_EVENTS.DESIGN_CASE_VIEW, { state: index }); }}
                  className={`min-h-11 rounded-lg border px-2 text-sm font-bold transition-colors ${caseState === index ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}
                >
                  {label}
                </button>
              ))}
            </div>
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
              <Link key={title} href={href} onClick={() => trackPortfolioClick("design-situation", href, title)} className="group relative min-h-[260px] overflow-hidden rounded-lg border border-white/15 bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
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

      <section className="section-padding overflow-hidden bg-white" id="project-route">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Как создается проект</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Маршрут от размеров до расчета</h2>
          </div>
          <div className="mt-8 flex w-full max-w-full snap-x gap-4 overflow-x-auto overscroll-x-contain pb-4 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
            {routeSteps.map((step, index) => (
              <article key={step.title} className="w-[78vw] shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-white shadow-sm sm:w-[360px] lg:w-auto lg:min-w-0">
                <div className="relative">
                  <Image src={step.image} alt={`${index + 1}. ${step.title}`} width={760} height={570} sizes="(min-width: 1024px) 17vw, (min-width: 640px) 360px, 78vw" className="aspect-[4/3] w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-stone-950">{step.cue}</span>
                </div>
                <div className="p-5">
                  <p className="text-sm font-bold text-primary">0{index + 1}</p>
                  <h3 className="mt-2 text-lg font-extrabold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="#request" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { source: "design-route", target: "request" })} className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Начать проект кухни
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section-padding overflow-hidden bg-muted/30" id="visual-gallery">
        <div className="container-site">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Галерея визуализаций</p>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Примеры кухонь, которые можно спроектировать</h2>
            </div>
            <div className="flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2 lg:w-auto">
              {filters.map((filter) => (
                <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${activeFilter === filter ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 flex snap-x gap-4 overflow-x-auto overscroll-x-contain pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {visibleGallery.map((item, index) => (
              <article key={`${item[0]}-${index}`} className="relative w-[86vw] shrink-0 snap-start overflow-hidden rounded-lg border border-border bg-white sm:w-[420px] lg:w-auto">
                <button type="button" onClick={() => { setLightbox(item); track(ANALYTICS_EVENTS.LIGHTBOX_OPEN, { source: "design-gallery", title: item[0] }); }} className="group relative block w-full text-left">
                  <Image src={item[4]} alt={`${item[0]}: ${item[1]}, ${item[2]}, ${item[3]}`} width={1000} height={1250} sizes="(min-width: 1024px) 33vw, 86vw" className="h-[68svh] min-h-[430px] w-full object-cover lg:h-[520px] lg:min-h-0" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-stone-950"><Maximize2 className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-transparent p-5 pt-20 text-white">
                    <span className="block text-xl font-extrabold">{item[0]}</span>
                    <span className="mt-1 block text-sm text-white/80">{item[1]} · {item[2]} · {item[3]}</span>
                  </span>
                </button>
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <Link href={item[5]} onClick={() => trackPortfolioClick("design-gallery", item[5], item[0])} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-stone-950 shadow-lg">
                    Смотреть похожие
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
                <button key={item[0]} type="button" onClick={() => chooseProjectPart(item[0])} className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition-colors ${activePart === item[0] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  <span className="block">{item[0]}</span>
                  <span className={`mt-1 block text-xs font-semibold ${activePart === item[0] ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{item[3]}</span>
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

      <section className="section-padding overflow-hidden bg-muted/30" id="materials-eye">
        <div className="container-site grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-white">
            <Image src={activeMaterialItem[4]} alt={`Кухня с материалом: ${activeMaterialItem[1]}`} width={1200} height={900} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/5] w-full max-w-full object-cover transition-opacity duration-300 sm:aspect-[16/10]" />
            <div className="p-5">
              <h3 className="text-2xl font-extrabold">{activeMaterialItem[1]}</h3>
              <p className="mt-2 text-muted-foreground">{activeMaterialItem[3]}</p>
              <Link href="#request" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { source: "design-material", target: "request" })} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                Показать в интерьере
              </Link>
            </div>
          </div>
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Материалы глазами</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Смотрите фактуры крупно</h2>
            <p className="mt-4 text-muted-foreground">Выбирайте категорию и листайте карточки пальцем. При нажатии меняется крупная кухня слева.</p>
            <div className="mt-6 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2">
              {materialCategories.map((category) => (
                <button key={category} type="button" onClick={() => chooseMaterialCategory(category)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${activeMaterialCategory === category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white hover:border-primary/40"}`}>
                  {category}
                </button>
              ))}
            </div>
            <div className="-mx-4 mt-4 flex snap-x gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 sm:mx-0 sm:px-0">
              {visibleMaterials.map((item, index) => (
                <button key={item[1]} type="button" onClick={() => chooseMaterial(item)} className={`min-h-[430px] w-[84vw] shrink-0 snap-start overflow-hidden rounded-lg border text-left transition-colors sm:w-[340px] ${activeMaterial === item[1] ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15" : "border-border bg-white hover:border-primary/40"}`}>
                  <Image src={item[2]} alt={`Фактура материала: ${item[1]}`} width={720} height={840} sizes="(min-width: 640px) 340px, 84vw" className="h-[300px] w-full object-cover" />
                  <span className="block p-4">
                    <span className="block text-xs font-bold uppercase tracking-wide opacity-70">{index + 1} / {visibleMaterials.length}</span>
                    <span className="mt-2 block text-xl font-extrabold">{item[1]}</span>
                    <span className={`mt-2 block text-sm ${activeMaterial === item[1] ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item[3]}</span>
                    <span className={`mt-4 inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-bold ${activeMaterial === item[1] ? "bg-white text-stone-950" : "bg-muted text-foreground"}`}>Посмотреть в интерьере</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm font-bold text-muted-foreground">{Math.max(1, visibleMaterials.findIndex((item) => item[1] === activeMaterial) + 1)} / {visibleMaterials.length}</p>
            <p className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">Оттенок материалов на экране может отличаться от реального. Перед производством образцы согласовываются лично.</p>
          </div>
        </div>
      </section>

      <div id="design-mobile-sticky-panel" className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-border bg-white/95 px-3 py-3 shadow-2xl shadow-black/20 backdrop-blur md:hidden" aria-label="Мобильная панель заявки">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Link href="#request" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { source: "design-mobile-sticky", target: "request" })} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
            Получить проект
          </Link>
          <Link href="https://t.me/kuhniminsk_bot" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { source: "design-mobile-sticky", target: "telegram" })} className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-white text-foreground" aria-label="Написать в Telegram">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox[0]}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta = event.changedTouches[0]?.clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) > 48) {
              navigateLightbox(delta > 0 ? -1 : 1);
            }
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white">
            <button type="button" onClick={() => setLightbox(null)} className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-stone-950 shadow" aria-label="Закрыть просмотр">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => navigateLightbox(-1)} className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-950 shadow" aria-label="Предыдущее изображение">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => navigateLightbox(1)} className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-950 shadow" aria-label="Следующее изображение">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
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
