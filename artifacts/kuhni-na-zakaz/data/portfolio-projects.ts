import { buildImageAlt, getImageDisclosure } from "@/lib/image-disclosure";
import type { PortfolioCase } from "@prisma/client";

export interface PortfolioProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  city: string;
  cityKey: string;
  region: string;
  district: string;
  kitchenType: string;
  style: string;
  /** Slug страницы стиля (/styles/[slug]), совпадает с полем в БД */
  styleSlug: string;
  color: string;
  price: string;
  priceFrom: number;
  priceNote: string;
  size: string;
  materials: string[];
  facades: string;
  countertop: string;
  fittings: string;
  workDuration: string;
  mainImage: string;
  images: PortfolioProjectImage[];
  alt: string;
  description: string;
  task: string;
  solution: string;
  features: string[];
  relatedLocationSlugs: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface EditablePortfolioCase {
  id: number;
  externalId: string | null;
  title: string;
  shortTitle: string;
  slug: string;
  city: string;
  cityKey: string;
  region: string;
  district: string;
  kitchenType: string;
  area: number;
  layout: string;
  style: string;
  styleSlug?: string;
  color: string;
  material: string;
  materials: string[];
  priceFrom: number;
  priceTo: number;
  priceNote: string;
  size: string;
  facades: string;
  countertop: string;
  fittings: string;
  workDuration: string;
  days: number;
  description: string;
  task: string;
  solution: string;
  result: string;
  features: string[];
  relatedLocationSlugs: string[];
  mainImage: string;
  images: string[];
  imageAlts: string[];
  imageCaptions: string[];
  alt: string;
  featured: boolean;
  createdAt: Date;
}

const defaultPriceNote = "Стоимость зависит от размеров, материалов и комплектации.";
const generatedMinskDate = new Date("2026-05-19T00:00:00.000Z");

function generatedMinskCase(
  data: Omit<
    PortfolioCase,
    | "id"
    | "externalId"
    | "region"
    | "materialSlugs"
    | "scenarioSlugs"
    | "completedAt"
    | "constraints"
    | "photosBefore"
    | "photosAfter"
    | "reviewIds"
    | "published"
    | "createdAt"
    | "updatedAt"
  > & { externalId: string },
): PortfolioCase {
  return {
    id: 0,
    region: "Минск",
    materialSlugs: [],
    scenarioSlugs: [],
    completedAt: "",
    constraints: "Изображение сгенерировано как реалистичный пример для минской посадочной страницы; точная смета считается после замера.",
    photosBefore: [],
    photosAfter: [],
    reviewIds: [],
    published: true,
    createdAt: generatedMinskDate,
    updatedAt: generatedMinskDate,
    ...data,
  };
}

export const GENERATED_MINSK_PORTFOLIO_CASES: PortfolioCase[] = [
  generatedMinskCase({
    externalId: "generated-minsk-japandi-sage",
    title: "Кухня Japandi с зелеными фасадами в Минске",
    shortTitle: "Japandi кухня в Минске",
    slug: "kuhnya-japandi-zelenye-fasady-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Первомайский район",
    kitchenType: "Прямая кухня",
    area: 3,
    layout: "Прямая",
    style: "Japandi",
    styleSlug: "minimalizm",
    color: "Зеленая",
    material: "МДФ эмаль",
    materials: ["МДФ эмаль", "ЛДСП Egger", "постформинг"],
    priceFrom: 3900,
    priceTo: 5600,
    priceNote: "Ориентир для похожего проекта: итог зависит от техники, столешницы и фурнитуры.",
    size: "3,2 п.м",
    facades: "рифленый МДФ в шалфейном оттенке",
    countertop: "светлая столешница под терраццо",
    fittings: "направляющие полного выдвижения",
    workDuration: "24 рабочих дня",
    days: 24,
    description:
      "🌿 Нестандартная, но спокойная кухня для минской квартиры: шалфейные рифленые фасады, светлая столешница и теплая ниша из дерева. Не скучный белый гарнитур, а живой интерьер без визуального шума.",
    task: "Сделать компактную кухню с характером, но без перегруза: место для готовки, высокий пенал и уютная зона завтрака у окна.",
    solution:
      "Высокие шкафы вынесли в левую часть, рабочую зону собрали по одной линии, а открытые полки и подсветка добавили воздуха.",
    result:
      "Получился мягкий Japandi-сценарий для Минска: кухня выглядит свежо, но остается практичной для ежедневной готовки.",
    features: ["реалистичный пример для Минска", "рифленые фасады", "теплая LED-подсветка", "высокий пенал под технику"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-japandi-sage-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-japandi-sage-realistic.webp"],
    imageAlts: ["Кухня Japandi с зелеными фасадами в минской квартире"],
    imageCaptions: ["Реалистичный пример кухни Japandi для Минска"],
    alt: "Кухня Japandi с зелеными фасадами в Минске",
    featured: true,
    order: 1,
    seoTitle: "Кухня Japandi с зелеными фасадами в Минске",
    seoDescription:
      "🌿 Кухня Japandi в Минске: зеленые фасады, теплая ниша, аккуратная рабочая зона. Рассчитаем похожий проект без скучной шаблонщины.",
    seoKeywords: "",
  }),
  generatedMinskCase({
    externalId: "generated-minsk-loft-walnut",
    title: "Лофт-кухня с орехом и полуостровом в Минске",
    shortTitle: "Лофт с полуостровом",
    slug: "loft-kuhnya-oreh-poluostrov-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Центральный район",
    kitchenType: "Кухня с полуостровом",
    area: 5,
    layout: "С полуостровом",
    style: "Лофт",
    styleSlug: "loft",
    color: "Графит и орех",
    material: "МДФ пластик",
    materials: ["МДФ пластик", "шпон орех", "HPL"],
    priceFrom: 6200,
    priceTo: 8800,
    priceNote: "Полуостров, подсветка и декоративные фасады заметно влияют на смету.",
    size: "4,8 п.м + полуостров",
    facades: "матовый графит и ореховые панели",
    countertop: "бетонная HPL-столешница",
    fittings: "доводчики и скрытые петли",
    workDuration: "32 рабочих дня",
    days: 32,
    description:
      "⚡ Кухня для тех, кто не хочет очередной бежевый гарнитур: графит, орех, рифленое стекло и полуостров для кофе, завтраков и быстрых разговоров.",
    task: "Собрать выразительную кухню-гостиную с барной зоной и достаточным хранением без ощущения тяжелого шкафа.",
    solution:
      "Основную технику спрятали в высокую стену, полуостров оставили легким, а подсветка стеклянных шкафов дала вечерний акцент.",
    result:
      "Лофт получился взрослым и практичным: много хранения, удобный полуостров и характерный темный силуэт.",
    features: ["полуостров", "рифленое стекло", "ореховые панели", "вечерняя подсветка"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-loft-walnut-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-loft-walnut-realistic.webp"],
    imageAlts: ["Лофт-кухня с орехом и полуостровом в Минске"],
    imageCaptions: ["Реалистичный пример лофт-кухни для Минска"],
    alt: "Лофт-кухня с орехом и полуостровом в Минске",
    featured: true,
    order: 2,
    seoTitle: "Лофт-кухня с полуостровом в Минске",
    seoDescription:
      "⚡ Лофт-кухня в Минске: графит, орех, полуостров и подсветка. Для тех, кому нужен интерьер с характером, а не стерильная картинка.",
    seoKeywords: "",
  }),
  generatedMinskCase({
    externalId: "generated-minsk-neoclassic-blue",
    title: "Неоклассическая кухня с синими фасадами в Минске",
    shortTitle: "Синяя неоклассика",
    slug: "neoklassicheskaya-kuhnya-sinie-fasady-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Советский район",
    kitchenType: "Кухня до потолка",
    area: 4,
    layout: "До потолка",
    style: "Неоклассика",
    styleSlug: "neoklassika",
    color: "Синяя",
    material: "МДФ эмаль",
    materials: ["МДФ эмаль", "латунная фурнитура", "керамогранит"],
    priceFrom: 5400,
    priceTo: 7600,
    priceNote: "Стоимость зависит от высоты шкафов, эмали, витрин и фурнитуры.",
    size: "4,1 п.м",
    facades: "крашеный МДФ с рамочным профилем",
    countertop: "светлая каменная столешница",
    fittings: "петли с доводчиками",
    workDuration: "30 рабочих дней",
    days: 30,
    description:
      "💙 Нежная неоклассика без музейной тяжести: синие нижние фасады, светлый верх до потолка, латунные ручки и уютная плитка на фартуке.",
    task: "Сделать кухню до потолка с большим хранением, но оставить интерьер легким и домашним.",
    solution:
      "Низ сделали акцентным, верх оставили светлым, добавили стеклянную секцию и теплые детали, чтобы кухня не выглядела массивно.",
    result:
      "Получилась спокойная кухня для квартиры в Минске: много хранения, мягкий цвет и понятная классическая геометрия.",
    features: ["фасады до потолка", "рамочный МДФ", "латунные ручки", "витринная секция"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-neoklassika-blue-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-neoklassika-blue-realistic.webp"],
    imageAlts: ["Неоклассическая кухня с синими фасадами в Минске"],
    imageCaptions: ["Реалистичный пример синей неоклассики для Минска"],
    alt: "Неоклассическая кухня с синими фасадами в Минске",
    featured: true,
    order: 3,
    seoTitle: "Неоклассическая кухня с синими фасадами в Минске",
    seoDescription:
      "💙 Неоклассическая кухня в Минске: синие фасады, светлый верх до потолка, латунные ручки. Выглядит не как у всех, но живет удобно.",
    seoKeywords: "",
  }),
  generatedMinskCase({
    externalId: "generated-minsk-ceiling-white",
    title: "Белая кухня до потолка для квартиры в Минске",
    shortTitle: "Кухня до потолка",
    slug: "belaya-kuhnya-do-potolka-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Фрунзенский район",
    kitchenType: "Кухня до потолка",
    area: 4,
    layout: "Угловая",
    style: "Современный",
    styleSlug: "sovremennye",
    color: "Белая и дерево",
    material: "МДФ",
    materials: ["МДФ", "ЛДСП Egger", "постформинг"],
    priceFrom: 4700,
    priceTo: 6900,
    priceNote: "Высота, пеналы и встроенная техника уточняются после замера.",
    size: "3,9 п.м",
    facades: "матовые фасады до потолка",
    countertop: "светлая влагостойкая столешница",
    fittings: "Blum или аналог по комплектации",
    workDuration: "27 рабочих дней",
    days: 27,
    description:
      "✨ Кухня до потолка для минской квартиры: максимум хранения, ровная верхняя линия и спокойный светлый вид без ощущения кладовки.",
    task: "Использовать высоту помещения, спрятать бытовые вещи и сохранить легкий вид кухни.",
    solution:
      "Верхние шкафы довели до потолка, встроили технику в пеналы и добавили теплую деревянную нишу для визуального баланса.",
    result:
      "Практичный вариант для новостройки: кухня аккуратно закрывает хранение и не спорит с интерьером.",
    features: ["шкафы до потолка", "пеналы под технику", "теплая деревянная ниша", "много закрытого хранения"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-kuhnya-do-potolka-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-kuhnya-do-potolka-realistic.webp"],
    imageAlts: ["Белая кухня до потолка для квартиры в Минске"],
    imageCaptions: ["Реалистичный пример кухни до потолка для Минска"],
    alt: "Белая кухня до потолка для квартиры в Минске",
    featured: false,
    order: 4,
    seoTitle: "Белая кухня до потолка в Минске",
    seoDescription:
      "✨ Кухня до потолка в Минске: светлые фасады, пеналы, много хранения и аккуратная линия. Рассчитаем похожий вариант под размеры.",
    seoKeywords: "",
  }),
  generatedMinskCase({
    externalId: "generated-minsk-green-island",
    title: "Кухня с островом и зелёным акцентом в Минске",
    shortTitle: "Кухня с островом",
    slug: "kuhnya-s-ostrovom-zelenyj-akcent-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Московский район",
    kitchenType: "Кухня с островом",
    area: 6,
    layout: "С островом",
    style: "Современный",
    styleSlug: "sovremennye",
    color: "Белая, дерево и зелёный",
    material: "МДФ эмаль",
    materials: ["МДФ эмаль", "шпон дуба", "кварцевая столешница"],
    priceFrom: 7800,
    priceTo: 11200,
    priceNote: "Остров, каменная столешница и встроенная техника считаются отдельно после замера.",
    size: "5,4 п.м + остров",
    facades: "матовый МДФ и деревянные панели",
    countertop: "светлая кварцевая столешница",
    fittings: "скрытые направляющие и доводчики",
    workDuration: "35 рабочих дней",
    days: 35,
    description:
      "🌿 Кухня с островом для минской кухни-гостиной: зелёный акцент, дерево и большая рабочая поверхность. Выглядит бодро, но не превращает интерьер в шоурум.",
    task: "Сделать остров не просто красивой деталью, а рабочим центром кухни с хранением, посадочными местами и нормальными проходами.",
    solution:
      "Основной гарнитур собрали вдоль стены, остров оставили как зону готовки и завтраков, а зелёный блок сделал интерьер запоминающимся.",
    result:
      "Получился просторный сценарий для кухни-гостиной: много воздуха, удобный остров и заметный цветовой акцент.",
    features: ["остров с хранением", "зелёный акцент", "кварцевая столешница", "кухня-гостиная"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-kuhnya-s-ostrovom-green-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-kuhnya-s-ostrovom-green-realistic.webp"],
    imageAlts: ["Кухня с островом и зелёным акцентом в Минске"],
    imageCaptions: ["Реалистичный пример кухни с островом для Минска"],
    alt: "Кухня с островом и зелёным акцентом в Минске",
    featured: false,
    order: 5,
    seoTitle: "Кухня с островом и зелёным акцентом в Минске",
    seoDescription:
      "🌿 Кухня с островом в Минске: зелёный акцент, дерево, большая рабочая зона и хранение. Не банально, но удобно каждый день.",
    seoKeywords: "",
  }),
  generatedMinskCase({
    externalId: "generated-minsk-studio-oak",
    title: "Прямая кухня для студии с дубовой нишей в Минске",
    shortTitle: "Прямая кухня для студии",
    slug: "pryamaya-kuhnya-studiya-dubovaya-nisha-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Октябрьский район",
    kitchenType: "Прямая кухня",
    area: 2,
    layout: "Прямая",
    style: "Минимализм",
    styleSlug: "minimalizm",
    color: "Белая и дуб",
    material: "ЛДСП Egger",
    materials: ["ЛДСП Egger", "МДФ", "постформинг"],
    priceFrom: 2600,
    priceTo: 3900,
    priceNote: "Компактные кухни сильно зависят от встроенной техники и высоты верхних шкафов.",
    size: "2,4 п.м",
    facades: "светлые матовые фасады",
    countertop: "дубовая рабочая ниша",
    fittings: "направляющие с доводчиками",
    workDuration: "20 рабочих дней",
    days: 20,
    description:
      "✨ Маленькая студия без компромисса по виду: прямая кухня, дубовая ниша и верхние шкафы, которые не давят на комнату.",
    task: "Уместить хранение, мойку, варочную поверхность и холодильник на короткой стене, не забрав всё пространство студии.",
    solution:
      "Сделали спокойный светлый фасад, тёплую рабочую нишу и закрытое хранение до верхней линии, чтобы кухня выглядела цельно.",
    result:
      "Компактная кухня стала частью комнаты, а не отдельным тяжёлым блоком. Для студии это прям то, что нужно.",
    features: ["для студии", "короткая стена", "дубовая ниша", "закрытое хранение"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-pryamaya-studiya-dub-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-pryamaya-studiya-dub-realistic.webp"],
    imageAlts: ["Прямая кухня для студии с дубовой нишей в Минске"],
    imageCaptions: ["Реалистичный пример прямой кухни для студии в Минске"],
    alt: "Прямая кухня для студии с дубовой нишей в Минске",
    featured: false,
    order: 6,
    seoTitle: "Прямая кухня для студии с дубовой нишей в Минске",
    seoDescription:
      "✨ Прямая кухня для студии в Минске: светлые фасады, дубовая ниша и хранение без визуальной тяжести. Маленькая, но не скучная.",
    seoKeywords: "",
  }),
  generatedMinskCase({
    externalId: "generated-minsk-corner-gray",
    title: "Серая угловая кухня для новостройки в Минске",
    shortTitle: "Серая угловая кухня",
    slug: "seraya-uglovaya-kuhnya-novostrojka-minsk",
    city: "Минск",
    cityKey: "minsk",
    district: "Новая Боровая",
    kitchenType: "Угловая кухня",
    area: 4,
    layout: "Угловая",
    style: "Современный",
    styleSlug: "sovremennye",
    color: "Серая",
    material: "МДФ пластик",
    materials: ["МДФ пластик", "ЛДСП Egger", "HPL"],
    priceFrom: 4300,
    priceTo: 6400,
    priceNote: "Цена зависит от встроенной техники, подсветки и выбранной столешницы.",
    size: "3,6 п.м",
    facades: "серые матовые фасады",
    countertop: "тонкая HPL-столешница",
    fittings: "петли и направляющие с доводчиками",
    workDuration: "25 рабочих дней",
    days: 25,
    description:
      "⚡ Угловая кухня для новостройки в Минске: серые фасады, тонкая столешница и аккуратный угол без хаоса на рабочей зоне.",
    task: "Собрать универсальную угловую кухню для новой квартиры: хранение, техника, подсветка и понятная рабочая логика.",
    solution:
      "Мойку разместили в удобной зоне, варочную поверхность вынесли на длинную часть, а верхние шкафы сделали ровной линией.",
    result:
      "Получилась крепкая современная база: сдержанный серый цвет, нормальная эргономика и место для всей ежедневной кухонной рутины.",
    features: ["угловая планировка", "для новостройки", "матовые фасады", "рабочий треугольник"],
    relatedLocationSlugs: ["minsk"],
    mainImage: "/uploads/portfolio/generated-minsk/minsk-uglovaya-seraya-realistic.webp",
    images: ["/uploads/portfolio/generated-minsk/minsk-uglovaya-seraya-realistic.webp"],
    imageAlts: ["Серая угловая кухня для новостройки в Минске"],
    imageCaptions: ["Реалистичный пример серой угловой кухни для Минска"],
    alt: "Серая угловая кухня для новостройки в Минске",
    featured: false,
    order: 7,
    seoTitle: "Серая угловая кухня для новостройки в Минске",
    seoDescription:
      "⚡ Угловая кухня в Минске: серые матовые фасады, HPL-столешница, удобный угол и хранение. Практично, без дизайнерской мишуры.",
    seoKeywords: "",
  }),
];

function formatPrice(priceFrom: number, priceTo: number) {
  if (priceFrom > 0 && priceTo > 0) return `${priceFrom.toLocaleString("ru")}–${priceTo.toLocaleString("ru")} BYN`;
  if (priceFrom > 0) return `от ${priceFrom.toLocaleString("ru")} BYN`;
  return "";
}

function normalizeCityKey(city: string) {
  const value = city.trim().toLowerCase();
  const map: Record<string, string> = {
    минск: "minsk",
    гомель: "gomel",
    могилев: "mogilev",
    могилёв: "mogilev",
    витебск: "vitebsk",
    брест: "brest",
    гродно: "grodno",
  };

  return map[value] || value;
}

function normalizeKitchenType(portfolioCase: EditablePortfolioCase) {
  return portfolioCase.kitchenType || portfolioCase.layout;
}

function normalizeMaterials(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.materials.length > 0) return portfolioCase.materials;
  if (portfolioCase.material) return [portfolioCase.material];
  return [];
}

function normalizeSize(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.size) return portfolioCase.size;
  if (portfolioCase.area > 0) return `${portfolioCase.area} п.м`;
  return "";
}

function normalizeWorkDuration(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.workDuration) return portfolioCase.workDuration;
  if (portfolioCase.days > 0) return `${portfolioCase.days} дней`;
  return "";
}

function normalizeFeatures(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.features.length > 0) return portfolioCase.features;
  if (!portfolioCase.result) return [];

  return portfolioCase.result
    .split(/[.;]/)
    .map((feature) => feature.trim())
    .filter(Boolean);
}

function normalizeRelatedLocations(portfolioCase: EditablePortfolioCase) {
  if (portfolioCase.relatedLocationSlugs.length > 0) return portfolioCase.relatedLocationSlugs;
  const cityKey = portfolioCase.cityKey || normalizeCityKey(portfolioCase.city);
  return cityKey ? [cityKey] : [];
}

function buildImages(portfolioCase: EditablePortfolioCase, projectAlt: string) {
  const srcList = portfolioCase.images.length > 0
    ? portfolioCase.images
    : portfolioCase.mainImage
      ? [portfolioCase.mainImage]
      : [];

  return srcList.map((src, index) => ({
    src,
    alt: buildImageAlt(src, portfolioCase.imageAlts[index] || projectAlt || portfolioCase.title),
    caption:
      portfolioCase.imageCaptions[index] ||
      (getImageDisclosure(src).kind === "generated"
        ? "3D-визуализация, пример дизайна"
        : index === 0
          ? "Фото из портфолио"
          : "Дополнительный ракурс"),
  }));
}

export function toPortfolioProject(portfolioCase: EditablePortfolioCase): PortfolioProject {
  const kitchenType = normalizeKitchenType(portfolioCase);
  const materials = normalizeMaterials(portfolioCase);
  const cityKey = portfolioCase.cityKey || normalizeCityKey(portfolioCase.city);
  const price = formatPrice(portfolioCase.priceFrom, portfolioCase.priceTo);
  const alt = buildImageAlt(portfolioCase.mainImage, portfolioCase.alt || portfolioCase.title);

  return {
    id: portfolioCase.externalId || `project-${portfolioCase.id}`,
    slug: portfolioCase.slug,
    title: portfolioCase.title,
    shortTitle: portfolioCase.shortTitle || portfolioCase.title,
    city: portfolioCase.city,
    cityKey,
    region: portfolioCase.region,
    district: portfolioCase.district,
    kitchenType,
    style: portfolioCase.style,
    styleSlug: portfolioCase.styleSlug ?? "",
    color: portfolioCase.color || "Светлая",
    price,
    priceFrom: portfolioCase.priceFrom,
    priceNote: portfolioCase.priceNote || defaultPriceNote,
    size: normalizeSize(portfolioCase),
    materials,
    facades: portfolioCase.facades || portfolioCase.material,
    countertop: portfolioCase.countertop,
    fittings: portfolioCase.fittings,
    workDuration: normalizeWorkDuration(portfolioCase),
    mainImage: portfolioCase.mainImage,
    images: buildImages(portfolioCase, alt),
    alt,
    description: portfolioCase.description,
    task: portfolioCase.task,
    solution: portfolioCase.solution,
    features: normalizeFeatures(portfolioCase),
    relatedLocationSlugs: normalizeRelatedLocations(portfolioCase),
    isFeatured: portfolioCase.featured,
    createdAt: portfolioCase.createdAt.toISOString().slice(0, 10),
  };
}
