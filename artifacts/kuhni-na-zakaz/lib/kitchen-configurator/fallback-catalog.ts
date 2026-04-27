import type {
  CatalogAppliance,
  CatalogCountertop,
  CatalogFacade,
  CatalogHandle,
  CatalogModule,
  CatalogSkinal,
  CatalogTemplate,
} from "./types";

export const fallbackModules: CatalogModule[] = [
  {
    id: 9001,
    name: "Нижний шкаф 60",
    slug: "base-60",
    moduleType: "LOWER",
    widthCm: 60,
    heightCm: 82,
    depthCm: 56,
    priceBase: 18000,
    imageUrl: "",
    description: "Базовый модуль для посуды и хранения.",
    tags: ["base", "storage"],
  },
  {
    id: 9002,
    name: "Шкаф с ящиками 80",
    slug: "drawer-80",
    moduleType: "DRAWER",
    widthCm: 80,
    heightCm: 82,
    depthCm: 56,
    priceBase: 31000,
    imageUrl: "",
    description: "Широкий нижний модуль с выдвижными ящиками.",
    tags: ["drawers", "wide"],
  },
  {
    id: 9003,
    name: "Модуль под мойку 80",
    slug: "sink-80",
    moduleType: "SINK",
    widthCm: 80,
    heightCm: 82,
    depthCm: 56,
    priceBase: 26000,
    imageUrl: "",
    description: "Подготовлен под мойку и коммуникации.",
    tags: ["sink", "water"],
  },
  {
    id: 9004,
    name: "Верхний шкаф 60",
    slug: "upper-60",
    moduleType: "UPPER",
    widthCm: 60,
    heightCm: 72,
    depthCm: 32,
    priceBase: 14500,
    imageUrl: "",
    description: "Навесной шкаф для ежедневного хранения.",
    tags: ["upper", "wall"],
  },
  {
    id: 9005,
    name: "Пенал 60",
    slug: "tall-60",
    moduleType: "TALL",
    widthCm: 60,
    heightCm: 210,
    depthCm: 58,
    priceBase: 43000,
    imageUrl: "",
    description: "Высокий модуль под хранение или встроенную технику.",
    tags: ["tall", "storage"],
  },
  {
    id: 9006,
    name: "Угловой модуль",
    slug: "corner-90",
    moduleType: "CORNER",
    widthCm: 90,
    heightCm: 82,
    depthCm: 90,
    priceBase: 39000,
    imageUrl: "",
    description: "Модуль для Г-образной планировки.",
    tags: ["corner"],
  },
];

export const fallbackTemplates: CatalogTemplate[] = [
  {
    id: 9101,
    name: "Прямая",
    slug: "straight-demo",
    layoutType: "STRAIGHT",
    description: "Линейная планировка вдоль одной стены.",
    previewImageUrl: "",
    minWidthCm: 240,
    modulesConfig: [
      { id: "demo-base-1", moduleSlug: "sink-80", wallSide: "bottom", offsetCm: 20 },
      { id: "demo-base-2", moduleSlug: "drawer-80", wallSide: "bottom", offsetCm: 105 },
      { id: "demo-base-3", moduleSlug: "base-60", wallSide: "bottom", offsetCm: 190 },
      { id: "demo-upper-1", moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 20 },
      { id: "demo-upper-2", moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 105 },
    ],
  },
  {
    id: 9102,
    name: "Угловая (Г-образная)",
    slug: "corner-demo",
    layoutType: "CORNER",
    description: "Г-образная схема с хорошей рабочей поверхностью.",
    previewImageUrl: "",
    minWidthCm: 280,
    modulesConfig: [
      { id: "demo-corner-1", moduleSlug: "corner-90", wallSide: "bottom", offsetCm: 10 },
      { id: "demo-corner-2", moduleSlug: "drawer-80", wallSide: "bottom", offsetCm: 105 },
      { id: "demo-corner-3", moduleSlug: "sink-80", wallSide: "left", offsetCm: 95 },
      { id: "demo-corner-4", moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 105 },
    ],
  },
  {
    id: 9103,
    name: "П-образная",
    slug: "u-shape-demo",
    layoutType: "U_SHAPE",
    description: "Рабочая зона по трем стенам для просторного помещения.",
    previewImageUrl: "",
    minWidthCm: 300,
    modulesConfig: [
      { id: "demo-u-1", moduleSlug: "sink-80", wallSide: "bottom", offsetCm: 20 },
      { id: "demo-u-2", moduleSlug: "drawer-80", wallSide: "bottom", offsetCm: 110 },
      { id: "demo-u-3", moduleSlug: "base-60", wallSide: "left", offsetCm: 30 },
      { id: "demo-u-4", moduleSlug: "base-60", wallSide: "right", offsetCm: 30 },
      { id: "demo-u-5", moduleSlug: "upper-60", wallSide: "top", offsetCm: 80 },
    ],
  },
  {
    id: 9104,
    name: "С островом",
    slug: "island-demo",
    layoutType: "ISLAND",
    description: "Свободностоящий остров в центре кухни.",
    previewImageUrl: "",
    minWidthCm: 340,
    modulesConfig: [
      { id: "demo-island-1", moduleSlug: "tall-60", wallSide: "top", offsetCm: 20 },
      { id: "demo-island-2", moduleSlug: "sink-80", wallSide: "bottom", offsetCm: 30 },
      { id: "demo-island-3", moduleSlug: "drawer-80", wallSide: "bottom", offsetCm: 120 },
      { id: "demo-island-4", moduleSlug: "drawer-80", wallSide: "island", offsetCm: 0 },
      { id: "demo-island-5", moduleSlug: "base-60", wallSide: "island", offsetCm: 85 },
    ],
  },
];

export const fallbackFacades: CatalogFacade[] = [
  { id: 9201, name: "Белый матовый", slug: "matte-white", material: "МДФ", finish: "матовый лак", colorHex: "#f3f1eb", colorName: "Белый", imageUrl: "", priceMultiplier: 1.05 },
  { id: 9202, name: "Теплый дуб", slug: "warm-oak", material: "шпон", finish: "натуральный", colorHex: "#b7824d", colorName: "Дуб", imageUrl: "", priceMultiplier: 1.22 },
  { id: 9203, name: "Графит", slug: "graphite", material: "МДФ", finish: "soft-touch", colorHex: "#3f3b37", colorName: "Графит", imageUrl: "", priceMultiplier: 1.18 },
  { id: 9204, name: "Оливковый", slug: "olive-soft", material: "эмаль", finish: "сатин", colorHex: "#7f8a68", colorName: "Оливковый", imageUrl: "", priceMultiplier: 1.16 },
];

export const fallbackCountertops: CatalogCountertop[] = [
  { id: 9301, name: "Светлый кварц", slug: "light-quartz", material: "кварц", thicknessMm: 20, colorName: "Светлый камень", imageUrl: "", pricePerMeter: 15000 },
  { id: 9302, name: "Терраццо", slug: "terrazzo", material: "HPL", thicknessMm: 38, colorName: "Терраццо", imageUrl: "", pricePerMeter: 8200 },
  { id: 9303, name: "Темный камень", slug: "dark-stone", material: "акрил", thicknessMm: 30, colorName: "Графит", imageUrl: "", pricePerMeter: 11800 },
];

export const fallbackSkinals: CatalogSkinal[] = [
  { id: 9401, name: "Белое стекло", slug: "white-glass", material: "закаленное стекло", colorName: "Белый", imageUrl: "", pricePerSqMeter: 9000 },
  { id: 9402, name: "Мрамор", slug: "marble-light", material: "керамогранит", colorName: "Светлый мрамор", imageUrl: "", pricePerSqMeter: 12500 },
  { id: 9403, name: "Бетон", slug: "concrete", material: "HPL-панель", colorName: "Серый", imageUrl: "", pricePerSqMeter: 7600 },
];

export const fallbackHandles: CatalogHandle[] = [
  { id: 9501, name: "Тонкая рейка", slug: "slim-rail", handleType: "STANDARD", material: "алюминий", finishName: "черный матовый", imageUrl: "", pricePerPiece: 900 },
  { id: 9502, name: "Интегрированная", slug: "integrated-profile", handleType: "INTEGRATED", material: "алюминий", finishName: "шампань", imageUrl: "", pricePerPiece: 1400 },
  { id: 9503, name: "Push-to-open", slug: "push-open", handleType: "PUSH_TO_OPEN", material: "механизм", finishName: "скрытый", imageUrl: "", pricePerPiece: 2200 },
];

export const fallbackAppliances: CatalogAppliance[] = [
  { id: 9601, name: "Духовой шкаф", slug: "oven-basic", brand: "Demo", applianceType: "oven", widthCm: 60, heightCm: 60, depthCm: 56, imageUrl: "", priceBase: 38000 },
  { id: 9602, name: "Варочная панель", slug: "hob-basic", brand: "Demo", applianceType: "hob", widthCm: 60, heightCm: 5, depthCm: 52, imageUrl: "", priceBase: 22000 },
  { id: 9603, name: "Вытяжка", slug: "hood-basic", brand: "Demo", applianceType: "hood", widthCm: 60, heightCm: 35, depthCm: 30, imageUrl: "", priceBase: 19000 },
  { id: 9604, name: "Посудомоечная машина", slug: "dishwasher-basic", brand: "Demo", applianceType: "dishwasher", widthCm: 60, heightCm: 82, depthCm: 55, imageUrl: "", priceBase: 42000 },
];

export const fallbackConfiguratorSettings = {
  shareTextTemplate: "Смотри мой проект кухни",
  exportBrandingText: "Создано в конфигураторе кухонь",
  defaultRoomWidthCm: 320,
  defaultRoomDepthCm: 260,
  defaultRoomHeightCm: 260,
};
