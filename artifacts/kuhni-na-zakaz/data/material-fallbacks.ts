export interface MaterialFallback {
  id: number;
  externalId: null;
  slug: string;
  title: string;
  headline: string;
  description: string;
  intro: string;
  content: string;
  pros: string[];
  cons: string[];
  suitableFor: string[];
  careGuide: string[];
  budgetLevel: string;
  pricePer: string;
  priceFrom: number;
  image: string;
  relatedStyles: string[];
  relatedCaseSlugs: string[];
  relatedScenarioSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  order: number;
  published: true;
  updatedAt: Date;
}

const UPDATED_AT = new Date("2026-07-11T00:00:00.000Z");

export const STATIC_MATERIAL_PAGES: MaterialFallback[] = [
  {
    slug: "mdf-fasady",
    title: "МДФ фасады",
    headline: "Фасады МДФ для кухни",
    description: "Фасады МДФ с пленкой, эмалью, пластиком и фрезеровкой: выбор, уход, плюсы, минусы и цена.",
    intro: "МДФ — плотная основа для фасадов с разными покрытиями. Выбор покрытия определяет внешний вид, устойчивость к нагрузкам и бюджет кухни.",
    pros: ["подходит для фрезеровки", "большой выбор покрытий и цветов", "плотнее ЛДСП для фасадов"],
    cons: ["открытые торцы чувствительны к влаге", "цена зависит от покрытия", "нужен аккуратный уход"],
    suitableFor: ["современные кухни", "классика и неоклассика", "проекты с фасадами сложной формы"],
    careGuide: ["использовать мягкую салфетку", "не оставлять воду на торцах", "не применять абразив"],
    budgetLevel: "Средний",
    priceFrom: 2200,
    image: "/images/materials-gallery-v2/mdf-emal/mdf-emal-d-kitchen.webp",
    relatedStyles: ["sovremennye", "neoklassika", "klassicheskie"],
  },
  {
    slug: "ldsp",
    title: "ЛДСП для кухни",
    headline: "Кухни из ЛДСП: где материал уместен",
    description: "ЛДСП для корпуса и фасадов кухни: цена, декоры, кромка, влагостойкость, плюсы, минусы и уход.",
    intro: "ЛДСП чаще используют для корпусов, прямых фасадов и открытых элементов. Качество кромки и защита спилов особенно важны рядом с водой.",
    pros: ["доступная цена", "много древесных и однотонных декоров", "подходит для корпусов и прямой геометрии"],
    cons: ["не подходит для фрезеровки", "открытый спил чувствителен к влаге", "качество зависит от плиты и кромки"],
    suitableFor: ["корпуса кухни", "бюджетные современные фасады", "полки и пеналы"],
    careGuide: ["сразу вытирать воду", "не использовать жесткие губки", "беречь кромку от ударов"],
    budgetLevel: "Экономный",
    priceFrom: 1600,
    image: "/images/materials-gallery-v2/ldsp/ldsp-d-kitchen.webp",
    relatedStyles: ["sovremennye", "skandinavskie", "minimalizm"],
  },
  {
    slug: "plastik-hpl",
    title: "Пластик HPL",
    headline: "Пластик HPL для кухонных фасадов",
    description: "Фасады HPL для кухни: стойкость, матовые и древесные декоры, кромка, уход, плюсы, минусы и цена.",
    intro: "HPL выбирают для практичных гладких фасадов. Материал устойчив к ежедневной нагрузке, но требует качественной основы и аккуратной кромки.",
    pros: ["стойкость к бытовой нагрузке", "простой уход", "много практичных декоров"],
    cons: ["видимая кромка требует качества", "не подходит для глубокой фрезеровки", "глянец показывает отпечатки"],
    suitableFor: ["семейные кухни", "современный стиль", "минимализм и лофт"],
    careGuide: ["мыть без абразива", "вытирать загрязнения мягкой салфеткой", "не перегревать поверхность"],
    budgetLevel: "Средний",
    priceFrom: 2400,
    image: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-d-kitchen.webp",
    relatedStyles: ["sovremennye", "minimalizm", "loft", "hay-tek"],
  },
  {
    slug: "shpon",
    title: "Шпон",
    headline: "Кухни с фасадами из шпона",
    description: "Шпонированные фасады кухни: натуральная фактура, сочетания, уход, плюсы, минусы и цена.",
    intro: "Шпон — тонкий натуральный слой дерева на стабильной основе. Он дает живую фактуру и подходит для теплых современных и премиальных интерьеров.",
    pros: ["натуральный рисунок дерева", "легче массива", "подходит для выразительных акцентов"],
    cons: ["выше цена", "нужна защита от воды", "рисунок каждой партии отличается"],
    suitableFor: ["кухни-гостиные", "неоклассика", "лофт и теплый минимализм"],
    careGuide: ["использовать мягкую ткань", "не оставлять воду", "беречь лак от абразива"],
    budgetLevel: "Премиум",
    priceFrom: 3600,
    image: "/images/materials-gallery-v2/shpon/shpon-d-kitchen.webp",
    relatedStyles: ["loft", "neoklassika", "klassicheskie"],
  },
  {
    slug: "akril",
    title: "Акриловые фасады",
    headline: "Акриловые фасады для кухни",
    description: "Акриловые фасады кухни: матовые и глянцевые поверхности, уход, отпечатки, плюсы, минусы и цена.",
    intro: "Акрил дает ровную поверхность и глубокий цвет. Перед заказом важно сравнить матовый и глянцевый образцы при реальном освещении.",
    pros: ["ровная современная поверхность", "глубокий цвет", "подходит для фасадов без ручек"],
    cons: ["на глянце заметны отпечатки", "темные цвета требуют ухода", "выше цена базовых покрытий"],
    suitableFor: ["минимализм", "хай-тек", "современные кухни"],
    careGuide: ["не использовать абразив", "вытирать микрофиброй", "избегать сильных ударов"],
    budgetLevel: "Выше среднего",
    priceFrom: 3000,
    image: "/images/materials-gallery-v2/akril/akril-d-kitchen.webp",
    relatedStyles: ["minimalizm", "hay-tek", "sovremennye"],
  },
  {
    slug: "mdf-emal",
    title: "МДФ эмаль",
    headline: "Кухни с фасадами МДФ в эмали",
    description: "Крашеные фасады МДФ: матовая и глянцевая эмаль, цвета, фрезеровка, уход, плюсы, минусы и цена.",
    intro: "Эмаль подходит для ровных современных и рамочных фасадов. Она дает свободу по цвету, но стоит выше пленки и требует бережного ухода.",
    pros: ["широкая палитра", "ровное покрытие", "подходит для фрезеровки"],
    cons: ["выше цена", "возможны сколы от удара", "темные цвета показывают следы"],
    suitableFor: ["современные кухни", "неоклассика", "классические фасады"],
    careGuide: ["использовать мягкие средства", "не тереть абразивом", "сразу удалять жир и воду"],
    budgetLevel: "Выше среднего",
    priceFrom: 3200,
    image: "/images/materials-gallery-v2/mdf-emal/mdf-emal-d-kitchen.webp",
    relatedStyles: ["sovremennye", "neoklassika", "klassicheskie"],
  },
].map((material, index) => ({
  id: -(index + 1),
  externalId: null,
  content: "",
  pricePer: "",
  relatedCaseSlugs: [],
  relatedScenarioSlugs: [],
  seoTitle: material.headline,
  seoDescription: material.description,
  seoKeywords: "",
  order: index + 1,
  published: true as const,
  updatedAt: UPDATED_AT,
  ...material,
}));

export const STATIC_MATERIAL_BY_SLUG = new Map(STATIC_MATERIAL_PAGES.map((material) => [material.slug, material]));
