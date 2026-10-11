import { exampleImage, priceExamples, priceLayouts, priceStyles } from "./prices-showcase";

export { priceLayouts as catalogLayouts, priceStyles as catalogStyles };
export type CatalogRoom = "apartment" | "studio" | "house" | "wood";
export type CatalogModel = {
  id: string; name: string; layout: string; style: string; dimensions: string;
  maxWall: number | null; facade: string; material: string; color: string;
  rooms: CatalogRoom[]; images: string[]; description: string; priceFrom?: number;
  equipment: string[]; exclude: string[]; imageLabels?: string[]; visualization?: boolean;
};

export const catalogRooms = [
  { id: "apartment", label: "Для квартиры" },
  { id: "studio", label: "Для студии" },
  { id: "house", label: "Для загородного дома" },
  { id: "wood", label: "Для деревянного дома" },
] as const;
export const catalogMaterials = [
  { id: "ldsp", label: "ЛДСП", href: "/materials/ldsp" },
  { id: "film", label: "МДФ в плёнке", href: "/materials/mdf-fasady" },
  { id: "enamel", label: "МДФ в эмали", href: "/materials/mdf-emal" },
  { id: "hpl", label: "Пластик HPL", href: "/materials/plastik-hpl" },
] as const;
export const catalogColors = [
  { id: "light", label: "Светлые" }, { id: "dark", label: "Тёмные" },
  { id: "wood", label: "С древесной фактурой" }, { id: "colored", label: "Цветные" },
] as const;

const colorById: Record<string, string> = {
  "scandi-straight-3m": "wood", "modern-corner-3x2": "light", "minimal-straight-24": "light",
  "neoclassic-corner": "light", "loft-straight-3m": "wood", "modern-small-2m": "light",
  "scandi-corner": "wood", "modern-ceiling-3m": "light", "classic-corner": "light",
  "provence-straight": "colored", "minimal-corner-01": "light", "hightech-corner": "light",
  "modern-u-shape": "colored", "neoclassic-u-shape": "light", "minimal-island": "light",
  "hightech-island": "dark", "loft-peninsula": "dark", "scandi-peninsula": "wood",
};

const baseModels: CatalogModel[] = priceExamples.map((model) => ({
  visualization: true,
  id: model.id, name: model.name, layout: model.layout, style: model.style,
  dimensions: model.dimensions, maxWall: Math.max(...model.walls),
  facade: model.facadeMaterial, material: model.facade, color: colorById[model.id] ?? "light",
  rooms: model.layout === "island" || model.layout === "u-shaped" ? ["house"]
    : model.layout === "peninsula" ? ["studio", "house"] : ["apartment", "studio"],
  images: [0, 1, 2, 3].map((view) => exampleImage(model, view)),
  description: model.description, priceFrom: model.priceFrom,
  equipment: model.equipment, exclude: model.exclude,
}));

const additionalModels: CatalogModel[] = [
  { id: "wood-green", visualization: true, name: "Зелёная кухня в доме из бруса", layout: "corner", style: "scandi",
    dimensions: "По размерам двух стен", maxWall: null, facade: "Рамочные фасады; покрытие выбирается в проекте", material: "film", color: "colored",
    rooms: ["wood", "house"], images: ["/images/catalog-showcase/wood-green.webp", "/images/catalog-showcase/wood-green-angle.webp", "/images/catalog-showcase/wood-green-detail.webp", "/images/catalog-showcase/wood-green-interior.webp"],
    imageLabels: ["Общий вид", "Другой ракурс", "Рабочая зона", "Внутри ящиков — вариант наполнения"],
    description: "Угловая рабочая зона с мойкой у окна и высоким шкафом. Крепления к деревянным стенам согласуем после осмотра дома.",
    equipment: ["Две рабочие стороны", "Мойка у окна", "Высокий шкаф для техники"], exclude: [] },
  { id: "country-blue", visualization: true, name: "Кухня с островом для загородного дома", layout: "island", style: "modern",
    dimensions: "Стены и остров — по плану помещения", maxWall: null, facade: "Матовые фасады; материал уточняется", material: "enamel", color: "colored",
    rooms: ["house"], images: ["/images/catalog-showcase/country-blue.webp"],
    description: "Отдельный остров для хранения и завтраков, основная техника вдоль стен. Размер острова выбираем после проверки проходов.",
    equipment: ["Остров с посадкой", "Рабочая зона вдоль стен", "Встроенная техника"], exclude: [] },
  { id: "cottage-white", visualization: true, name: "Компактная кухня для деревянного дома", layout: "straight", style: "scandi",
    dimensions: "По длине свободной стены", maxWall: null, facade: "Светлые гладкие фасады; материал уточняется", material: "ldsp", color: "light",
    rooms: ["wood", "house"], images: ["/images/catalog-showcase/cottage-white.webp"],
    description: "Одна линия шкафов для небольшого дома. Светлые фасады, древесная столешница и минимум открытого хранения.",
    equipment: ["Прямая линия", "Компактная техника", "Закрытое хранение"], exclude: [] },
  { id: "log-neoclassic", visualization: true, name: "Светлая неоклассика в бревенчатом доме", layout: "corner", style: "neoclassic",
    dimensions: "Индивидуальные размеры после замера", maxWall: null, facade: "Светлые рамочные фасады; покрытие уточняется", material: "enamel", color: "light",
    rooms: ["wood", "house"], images: ["/images/catalog-showcase/log-neoclassic.webp"],
    description: "Рамочные фасады на фоне бревенчатых стен. Расположение верхних шкафов и монтаж учитывают состояние деревянного дома.",
    equipment: ["Угловая планировка", "Рамочные фасады", "Мойка у окна"], exclude: [] },
  { id: "studio-green", name: "Зелёная прямая кухня для студии", layout: "straight", style: "minimalism",
    dimensions: "По длине свободной стены", maxWall: null, facade: "Матовые зелёные фасады; покрытие уточняется", material: "enamel", color: "colored",
    rooms: ["studio", "apartment"], images: ["/uploads/kitchens/catalog/pryamaya-kuhnya-minimalizm-zelenaya-010-main.webp"],
    description: "Спокойная плоскость фасадов для единого пространства кухни и гостиной. Технику и рабочую поверхность распределим по длине стены.",
    equipment: ["Одна рабочая линия", "Гладкие фасады", "Встроенная техника"], exclude: [] },
  { id: "corner-green", name: "Зелёная угловая кухня в скандинавском стиле", layout: "corner", style: "scandi",
    dimensions: "По размерам двух стен", maxWall: null, facade: "Зелёные фасады с древесной фактурой", material: "film", color: "colored",
    rooms: ["apartment", "house"], images: ["/uploads/kitchens/catalog/uglovaya-kuhnya-skandinavskaya-zelenaya-012-main.webp", "/uploads/kitchens/portfolio/uglovaya-kuhnya-skandinavskaya-zelenaya-012-extra-00-032.webp", "/uploads/kitchens/portfolio/uglovaya-kuhnya-skandinavskaya-zelenaya-012-detail-034.webp", "/uploads/kitchens/portfolio/uglovaya-kuhnya-skandinavskaya-zelenaya-012-side-033.webp"],
    imageLabels: ["Общий вид", "Другой ракурс во время сборки", "Нижние шкафы во время сборки", "Внутри шкафов во время сборки"],
    description: "Две рабочие стороны, цветные фасады и древесные детали. Угловое хранение выбирается отдельно от внешнего оформления.",
    equipment: ["Две рабочие стороны", "Древесные детали", "Угловое хранение"], exclude: [] },
];

export const catalogModels = [...additionalModels.slice(0, 4), ...baseModels, ...additionalModels.slice(4)];
export const catalogFaq = [
  { question: "Можно ли заказать модель из каталога по своим размерам?", answer: "Да. Фотографии помогают выбрать идею дизайна. Планировку, размеры шкафов, фасады и технику согласуем под ваше помещение; параметры примеров не заменяют замер." },
  { question: "Что означает цена от в карточке кухни?", answer: "Это стартовая стоимость базовой комплектации указанного примера. Состав и исключения можно открыть в карточке. Изменение размеров, материалов, техники и условий монтажа требует отдельного расчёта." },
  { question: "Как выбрать кухню для деревянного или загородного дома?", answer: "Начните с плана стен, окон и коммуникаций. Сравните прямую, угловую и островную планировки. Для деревянного дома отдельно согласуем крепления и монтаж с учётом конструкции и состояния стен." },
  { question: "Чем отличаются длина кухни и площадь помещения?", answer: "Длина описывает рабочие стороны гарнитура в метрах, площадь — всё помещение в квадратных метрах. Одной площади недостаточно: для подбора нужны длины стен, проёмы, техника и свободные проходы." },
];
