export type KitchenStyleId =
  | "minimalism"
  | "light-modern"
  | "dark-modern"
  | "warm-wood"
  | "neoclassic"
  | "scandi"
  | "loft"
  | "ceiling";

export type KitchenLayoutId =
  | "straight"
  | "corner"
  | "u-shaped"
  | "island"
  | "small"
  | "living"
  | "ceiling";

export type KitchenBudgetId = "to-2000" | "2000-4000" | "4000-7000" | "7000-plus";

export interface KitchenStyleOption {
  id: KitchenStyleId;
  title: string;
  shortTitle: string;
  description: string;
  priceFrom: number;
  variantsCount: number;
  image: string;
  alt: string;
}

export interface KitchenGalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface PriceKitchenModel {
  id: string;
  name: string;
  style: KitchenStyleId;
  styleLabel: string;
  layout: KitchenLayoutId;
  layoutLabel: string;
  sizeRange: string;
  priceFrom: number;
  facadeMaterial: string;
  countertopMaterial: string;
  fittingsLevel: string;
  roomType: string;
  ceilingHeightOption: string;
  isRealProject: boolean;
  is3dVisualization: boolean;
  budget: KitchenBudgetId;
  coverImage: string;
  coverAlt: string;
  description: string;
  equipment: string[];
  priceFactors: string[];
  gallery: KitchenGalleryImage[];
}

export const kitchenStyles: KitchenStyleOption[] = [
  {
    id: "minimalism",
    title: "Современный минимализм",
    shortTitle: "Минимализм",
    description: "Ровные фасады, скрытые ручки, встроенная техника и чистая геометрия.",
    priceFrom: 2600,
    variantsCount: 10,
    image: "/images/prices-catalog/minimalism-corner-generated-20260703.webp",
    alt: "Сгенерированное фото современной минималистичной кухни на заказ в Минске",
  },
  {
    id: "light-modern",
    title: "Светлая современная кухня",
    shortTitle: "Светлая",
    description: "Светлые фасады, мягкий контраст, практичная рабочая зона и лёгкий интерьер.",
    priceFrom: 2200,
    variantsCount: 9,
    image: "/images/prices-catalog/light-modern-straight-generated-20260703.webp",
    alt: "Сгенерированное фото светлой современной кухни на заказ с лаконичными фасадами",
  },
  {
    id: "dark-modern",
    title: "Тёмная кухня",
    shortTitle: "Тёмная",
    description: "Матовые тёмные фасады, подсветка, выразительная столешница и встроенная техника.",
    priceFrom: 3200,
    variantsCount: 8,
    image: "/images/prices-catalog/dark-modern-island-generated-20260703.webp",
    alt: "Сгенерированное фото тёмной кухни на заказ с матовыми фасадами и подсветкой",
  },
  {
    id: "warm-wood",
    title: "Кухня с древесной текстурой",
    shortTitle: "С деревом",
    description: "Тёплая фактура дерева, спокойные фасады, уютная кухня для квартиры или дома.",
    priceFrom: 2400,
    variantsCount: 8,
    image: "/images/prices-catalog/warm-wood-corner-generated-20260703.webp",
    alt: "Сгенерированное фото кухни с древесной текстурой фасадов на заказ",
  },
  {
    id: "neoclassic",
    title: "Неоклассика",
    shortTitle: "Неоклассика",
    description: "Рамочные фасады, симметрия, аккуратные ручки и современная комплектация.",
    priceFrom: 3000,
    variantsCount: 8,
    image: "/images/prices-catalog/neoclassic-corner-generated-20260703.webp",
    alt: "Сгенерированное фото неоклассической кухни на заказ с рамочными фасадами",
  },
  {
    id: "scandi",
    title: "Скандинавский стиль",
    shortTitle: "Сканди",
    description: "Светлая база, дерево, простые линии и практичное хранение без перегруза.",
    priceFrom: 2300,
    variantsCount: 5,
    image: "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp",
    alt: "Скандинавская светлая кухня на заказ для квартиры",
  },
  {
    id: "loft",
    title: "Лофт",
    shortTitle: "Лофт",
    description: "Графит, дерево, металл, контрастные поверхности и выразительная подсветка.",
    priceFrom: 3400,
    variantsCount: 4,
    image: "/images/design-proekt-kuhni/config-style-dark.webp",
    alt: "Кухня в стиле лофт с тёмными фасадами и древесной фактурой",
  },
  {
    id: "ceiling",
    title: "Кухня до потолка",
    shortTitle: "До потолка",
    description: "Высокие шкафы, больше хранения и цельная линия фасадов до верхней зоны.",
    priceFrom: 2800,
    variantsCount: 7,
    image: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
    alt: "Кухня до потолка на заказ с высокими шкафами",
  },
];

const detailImages = {
  workZone: "/images/design-proekt-kuhni/config-extra-lighting.webp",
  storage: "/images/design-proekt-kuhni/config-extra-storage.webp",
  facades: "/images/design-proekt-kuhni/config-facade-matte.webp",
  wood: "/images/design-proekt-kuhni/config-facade-wood.webp",
  framed: "/images/design-proekt-kuhni/config-facade-framed.webp",
  handleless: "/images/design-proekt-kuhni/config-facade-handleless.webp",
  appliances: "/images/design-proekt-kuhni/config-extra-appliances.webp",
  island: "/images/design-proekt-kuhni/config-extra-island.webp",
};

function gallery(
  name: string,
  images: [string, string, string],
  detailA: string,
  detailB: string,
  evening: string,
): KitchenGalleryImage[] {
  return [
    { src: images[0], alt: `${name}: общий вид кухни`, caption: "Общий вид" },
    { src: images[1], alt: `${name}: ракурс с другой стороны`, caption: "Ракурс сбоку" },
    { src: detailA, alt: `${name}: рабочая зона кухни крупно`, caption: "Рабочая зона" },
    { src: detailB, alt: `${name}: фасады и столешница крупно`, caption: "Фасады крупно" },
    { src: images[2], alt: `${name}: хранение и фурнитура`, caption: "Хранение" },
    { src: evening, alt: `${name}: вечерний ракурс с подсветкой`, caption: "Подсветка вечером" },
  ];
}

export const priceKitchenModels: PriceKitchenModel[] = [
  {
    id: "minimal-corner-01",
    name: "Минималистичная угловая кухня без ручек",
    style: "minimalism",
    styleLabel: "Современный минимализм",
    layout: "corner",
    layoutLabel: "Угловая",
    sizeRange: "3,2-4,4 м",
    priceFrom: 3200,
    facadeMaterial: "МДФ в матовой эмали",
    countertopMaterial: "HPL",
    fittingsLevel: "С доводчиками",
    roomType: "Квартира",
    ceilingHeightOption: "Стандартная высота",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/prices-catalog/minimalism-corner-generated-20260703.webp",
    coverAlt: "Сгенерированное фото минималистичной угловой кухни без ручек в Минске",
    description: "Лаконичный вариант для квартиры: гладкие фасады, встроенная техника и спокойная палитра.",
    equipment: ["Матовые фасады МДФ", "Профильное открывание", "Столешница HPL", "Подсветка рабочей зоны"],
    priceFactors: ["Длина по двум стенам", "Количество ящиков", "Тип профильной ручки", "Встроенная техника"],
    gallery: gallery(
      "Минималистичная угловая кухня без ручек",
      [
        "/images/prices-catalog/minimalism-corner-generated-20260703.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek-rakurs-2.webp",
      ],
      detailImages.workZone,
      detailImages.handleless,
      detailImages.appliances,
    ),
  },
  {
    id: "minimal-island-01",
    name: "Современная кухня с островом",
    style: "minimalism",
    styleLabel: "Современный минимализм",
    layout: "island",
    layoutLabel: "С островом",
    sizeRange: "4,5-6,5 м",
    priceFrom: 5200,
    facadeMaterial: "МДФ матовый",
    countertopMaterial: "HPL или компакт-плита",
    fittingsLevel: "Полное выдвижение и доводчики",
    roomType: "Кухня-гостиная",
    ceilingHeightOption: "Можно до потолка",
    isRealProject: false,
    is3dVisualization: true,
    budget: "4000-7000",
    coverImage: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp",
    coverAlt: "Современная минималистичная кухня с островом",
    description: "Вариант для кухни-гостиной, где остров работает как дополнительная поверхность и зона общения.",
    equipment: ["Остров с хранением", "Встроенная техника", "Подсветка", "Фурнитура с доводчиками"],
    priceFactors: ["Размер острова", "Подвод коммуникаций", "Сложность столешницы", "Состав встроенной техники"],
    gallery: gallery(
      "Современная кухня с островом",
      [
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-2.webp",
      ],
      detailImages.island,
      detailImages.facades,
      detailImages.workZone,
    ),
  },
  {
    id: "light-straight-01",
    name: "Светлая прямая кухня для квартиры",
    style: "light-modern",
    styleLabel: "Светлая современная кухня",
    layout: "straight",
    layoutLabel: "Прямая",
    sizeRange: "2,4-3,4 м",
    priceFrom: 2200,
    facadeMaterial: "МДФ плёнка или эмаль",
    countertopMaterial: "Постформинг или HPL",
    fittingsLevel: "Базовые доводчики",
    roomType: "Студия или узкая кухня",
    ceilingHeightOption: "Стандартная высота",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/prices-catalog/light-modern-straight-generated-20260703.webp",
    coverAlt: "Сгенерированное фото светлой прямой кухни на заказ для квартиры",
    description: "Компактная светлая линия для студии или вытянутой комнаты без лишних сложных узлов.",
    equipment: ["Прямая линия модулей", "Верхние шкафы", "Место под встроенную технику", "Практичная столешница"],
    priceFactors: ["Длина гарнитура", "Высота верхних шкафов", "Материал фасадов", "Количество выдвижных ящиков"],
    gallery: gallery(
      "Светлая прямая кухня для квартиры",
      [
        "/images/prices-catalog/light-modern-straight-generated-20260703.webp",
        "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya-mobile.webp",
        "/images/design-proekt-kuhni/config-style-light.webp",
      ],
      detailImages.workZone,
      detailImages.facades,
      detailImages.appliances,
    ),
  },
  {
    id: "light-small-01",
    name: "Светлая маленькая кухня с хранением",
    style: "light-modern",
    styleLabel: "Светлая современная кухня",
    layout: "small",
    layoutLabel: "Маленькая кухня",
    sizeRange: "1,8-2,8 м",
    priceFrom: 1800,
    facadeMaterial: "ЛДСП или МДФ плёнка",
    countertopMaterial: "Постформинг",
    fittingsLevel: "Практичная базовая фурнитура",
    roomType: "Маленькая квартира",
    ceilingHeightOption: "Можно добавить антресоль",
    isRealProject: false,
    is3dVisualization: true,
    budget: "to-2000",
    coverImage: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp",
    coverAlt: "Светлая маленькая кухня с продуманным хранением",
    description: "Решение для небольшой кухни, где важны проходы, хранение и честный бюджет.",
    equipment: ["Компактная мойка", "Рабочая зона между мойкой и плитой", "Верхнее хранение", "Выдвижной нижний ящик"],
    priceFactors: ["Нестандартные размеры", "Высота шкафов", "Количество ящиков", "Подгонка под коммуникации"],
    gallery: gallery(
      "Светлая маленькая кухня с хранением",
      [
        "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp",
        "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya-rakurs-2.webp",
      ],
      detailImages.storage,
      detailImages.facades,
      detailImages.workZone,
    ),
  },
  {
    id: "dark-island-01",
    name: "Тёмная угловая кухня с островом",
    style: "dark-modern",
    styleLabel: "Тёмная кухня",
    layout: "island",
    layoutLabel: "С островом",
    sizeRange: "4,8-6,8 м",
    priceFrom: 5600,
    facadeMaterial: "МДФ в матовой эмали",
    countertopMaterial: "HPL или компакт-плита",
    fittingsLevel: "Премиальные доводчики",
    roomType: "Кухня-гостиная",
    ceilingHeightOption: "До потолка по проекту",
    isRealProject: false,
    is3dVisualization: true,
    budget: "4000-7000",
    coverImage: "/images/prices-catalog/dark-modern-island-generated-20260703.webp",
    coverAlt: "Сгенерированное фото тёмной угловой кухни с островом и подсветкой",
    description: "Выразительный вариант с матовыми фасадами, подсветкой и островом для просторной зоны.",
    equipment: ["Матовые тёмные фасады", "Остров", "Подсветка рабочей зоны", "Скрытая вытяжка по проекту"],
    priceFactors: ["Остров и проходы", "Фурнитура", "Подсветка", "Столешница и боковины"],
    gallery: gallery(
      "Тёмная угловая кухня с островом",
      [
        "/images/prices-catalog/dark-modern-island-generated-20260703.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-2.webp",
      ],
      detailImages.island,
      detailImages.facades,
      detailImages.workZone,
    ),
  },
  {
    id: "dark-u-01",
    name: "Тёмная П-образная кухня",
    style: "dark-modern",
    styleLabel: "Тёмная кухня",
    layout: "u-shaped",
    layoutLabel: "П-образная",
    sizeRange: "4,0-5,8 м",
    priceFrom: 4700,
    facadeMaterial: "МДФ матовый",
    countertopMaterial: "HPL",
    fittingsLevel: "С доводчиками и полным выдвижением",
    roomType: "Отдельная кухня",
    ceilingHeightOption: "Стандартная или до потолка",
    isRealProject: false,
    is3dVisualization: true,
    budget: "4000-7000",
    coverImage: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp",
    coverAlt: "Тёмная П-образная кухня на заказ с большой рабочей зоной",
    description: "Планировка для тех, кому нужно много рабочей поверхности и хранения по трём сторонам.",
    equipment: ["Три рабочие зоны", "Много нижних модулей", "Верхние шкафы", "Подсветка"],
    priceFactors: ["Количество углов", "Длина столешницы", "Угловые механизмы", "Занос и монтаж"],
    gallery: gallery(
      "Тёмная П-образная кухня",
      [
        "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp",
        "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya-rakurs-2.webp",
      ],
      detailImages.workZone,
      detailImages.facades,
      detailImages.storage,
    ),
  },
  {
    id: "wood-corner-01",
    name: "Угловая кухня с древесной фактурой",
    style: "warm-wood",
    styleLabel: "Кухня с древесной текстурой",
    layout: "corner",
    layoutLabel: "Угловая",
    sizeRange: "3,0-4,5 м",
    priceFrom: 3000,
    facadeMaterial: "ЛДСП Egger или МДФ с древесным декором",
    countertopMaterial: "HPL под камень",
    fittingsLevel: "С доводчиками",
    roomType: "Квартира или дом",
    ceilingHeightOption: "Стандартная высота",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/prices-catalog/warm-wood-corner-generated-20260703.webp",
    coverAlt: "Сгенерированное фото угловой кухни с древесной фактурой фасадов",
    description: "Тёплый современный вариант для интерьера, где хочется дерева без тяжёлой классики.",
    equipment: ["Древесная фактура", "Угловой модуль", "HPL-столешница", "Базовая подсветка"],
    priceFactors: ["Декор фасадов", "Угловые элементы", "Длина столешницы", "Фурнитура"],
    gallery: gallery(
      "Угловая кухня с древесной фактурой",
      [
        "/images/prices-catalog/warm-wood-corner-generated-20260703.webp",
        "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya-rakurs-2.webp",
      ],
      detailImages.workZone,
      detailImages.wood,
      detailImages.storage,
    ),
  },
  {
    id: "wood-ceiling-01",
    name: "Кухня с деревом до потолка",
    style: "warm-wood",
    styleLabel: "Кухня с древесной текстурой",
    layout: "ceiling",
    layoutLabel: "До потолка",
    sizeRange: "3,4-5,2 м",
    priceFrom: 3900,
    facadeMaterial: "МДФ и древесный декор",
    countertopMaterial: "HPL",
    fittingsLevel: "Доводчики и усиленные петли",
    roomType: "Квартира с высоким хранением",
    ceilingHeightOption: "До потолка",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
    coverAlt: "Кухня с древесной фактурой и шкафами до потолка",
    description: "Высокие шкафы закрывают верхнюю зону и дают больше хранения для посуды и запасов.",
    equipment: ["Шкафы до потолка", "Древесные фасады", "Антресольное хранение", "Встроенная техника"],
    priceFactors: ["Высота потолка", "Антресольные секции", "Количество пеналов", "Сложность монтажа"],
    gallery: gallery(
      "Кухня с деревом до потолка",
      [
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-2.webp",
      ],
      detailImages.wood,
      detailImages.storage,
      detailImages.appliances,
    ),
  },
  {
    id: "neoclassic-corner-01",
    name: "Неоклассическая угловая кухня",
    style: "neoclassic",
    styleLabel: "Неоклассика",
    layout: "corner",
    layoutLabel: "Угловая",
    sizeRange: "3,2-4,8 м",
    priceFrom: 3600,
    facadeMaterial: "МДФ рамочный",
    countertopMaterial: "HPL под камень",
    fittingsLevel: "Доводчики и аккуратные ручки",
    roomType: "Квартира или дом",
    ceilingHeightOption: "Стандартная или до потолка",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/prices-catalog/neoclassic-corner-generated-20260703.webp",
    coverAlt: "Сгенерированное фото неоклассической угловой кухни на заказ",
    description: "Спокойная неоклассика с рамочными фасадами и современной комплектацией.",
    equipment: ["Рамочные фасады МДФ", "Ручки", "HPL-столешница", "Секции с доводчиками"],
    priceFactors: ["Тип рамочного фасада", "Фурнитура", "Длина гарнитура", "Декоративные элементы"],
    gallery: gallery(
      "Неоклассическая угловая кухня",
      [
        "/images/prices-catalog/neoclassic-corner-generated-20260703.webp",
        "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya-rakurs-2.webp",
      ],
      detailImages.framed,
      detailImages.workZone,
      detailImages.storage,
    ),
  },
  {
    id: "neoclassic-light-01",
    name: "Светлая неоклассика для кухни-гостиной",
    style: "neoclassic",
    styleLabel: "Неоклассика",
    layout: "living",
    layoutLabel: "Кухня-гостиная",
    sizeRange: "4,0-6,0 м",
    priceFrom: 4800,
    facadeMaterial: "МДФ рамочный в эмали",
    countertopMaterial: "HPL или акрил",
    fittingsLevel: "Расширенная комплектация",
    roomType: "Кухня-гостиная",
    ceilingHeightOption: "До потолка по проекту",
    isRealProject: false,
    is3dVisualization: true,
    budget: "4000-7000",
    coverImage: "/images/design-proekt-kuhni/config-style-neoclassic.webp",
    coverAlt: "Светлая неоклассическая кухня-гостиная на заказ",
    description: "Более парадный вариант для объединённого пространства с мягкой симметрией и хранением.",
    equipment: ["Рамочные фасады", "Пеналы", "Подсветка", "Место под встроенную технику"],
    priceFactors: ["Пеналы", "Высота шкафов", "Материал столешницы", "Декор фасадов"],
    gallery: gallery(
      "Светлая неоклассика для кухни-гостиной",
      [
        "/images/design-proekt-kuhni/config-style-neoclassic.webp",
        "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-neoklassicheskaya-kuhnya-rakurs-2.webp",
      ],
      detailImages.framed,
      detailImages.appliances,
      detailImages.workZone,
    ),
  },
  {
    id: "scandi-straight-01",
    name: "Скандинавская прямая кухня",
    style: "scandi",
    styleLabel: "Скандинавский стиль",
    layout: "straight",
    layoutLabel: "Прямая",
    sizeRange: "2,6-3,6 м",
    priceFrom: 2400,
    facadeMaterial: "Светлый МДФ и древесный декор",
    countertopMaterial: "HPL",
    fittingsLevel: "С доводчиками",
    roomType: "Студия",
    ceilingHeightOption: "Стандартная высота",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/design-proekt-kuhni/config-style-light.webp",
    coverAlt: "Скандинавская прямая кухня со светлыми фасадами",
    description: "Светлая кухня для студии: простая геометрия, дерево и спокойная рабочая зона.",
    equipment: ["Светлые фасады", "Древесный акцент", "Прямая линия", "Фурнитура с доводчиками"],
    priceFactors: ["Длина", "Декор фасадов", "Высота шкафов", "Количество ящиков"],
    gallery: gallery(
      "Скандинавская прямая кухня",
      [
        "/images/design-proekt-kuhni/config-style-light.webp",
        "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp",
        "/images/design-proekt-kuhni/config-style-warm-wood.webp",
      ],
      detailImages.wood,
      detailImages.facades,
      detailImages.workZone,
    ),
  },
  {
    id: "loft-dark-01",
    name: "Кухня лофт с тёмными фасадами",
    style: "loft",
    styleLabel: "Лофт",
    layout: "corner",
    layoutLabel: "Угловая",
    sizeRange: "3,4-5,0 м",
    priceFrom: 4200,
    facadeMaterial: "МДФ матовый и древесный декор",
    countertopMaterial: "HPL под бетон",
    fittingsLevel: "С доводчиками",
    roomType: "Кухня-гостиная",
    ceilingHeightOption: "Стандартная или до потолка",
    isRealProject: false,
    is3dVisualization: true,
    budget: "4000-7000",
    coverImage: "/images/design-proekt-kuhni/config-style-dark.webp",
    coverAlt: "Кухня в стиле лофт с тёмными фасадами и деревом",
    description: "Контрастный вариант с тёмной базой, древесной фактурой и акцентной подсветкой.",
    equipment: ["Тёмные фасады", "Древесный декор", "HPL под бетон", "Подсветка"],
    priceFactors: ["Комбинация материалов", "Подсветка", "Угловые секции", "Видимые боковины"],
    gallery: gallery(
      "Кухня лофт с тёмными фасадами",
      [
        "/images/design-proekt-kuhni/config-style-dark.webp",
        "/images/design-proekt-kuhni/config-style-warm-wood.webp",
        "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya-rakurs-2.webp",
      ],
      detailImages.wood,
      detailImages.facades,
      detailImages.workZone,
    ),
  },
  {
    id: "ceiling-modern-01",
    name: "Современная кухня до потолка",
    style: "ceiling",
    styleLabel: "Кухня до потолка",
    layout: "ceiling",
    layoutLabel: "До потолка",
    sizeRange: "3,2-5,4 м",
    priceFrom: 3800,
    facadeMaterial: "МДФ матовый",
    countertopMaterial: "HPL",
    fittingsLevel: "Усиленная фурнитура",
    roomType: "Квартира с высоким хранением",
    ceilingHeightOption: "До потолка",
    isRealProject: false,
    is3dVisualization: true,
    budget: "2000-4000",
    coverImage: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
    coverAlt: "Современная кухня до потолка с высоким хранением",
    description: "Формат для хранения: высокие фасады, антресоли и аккуратная верхняя линия.",
    equipment: ["Антресольные шкафы", "Пенал под технику", "Подсветка", "Доводчики"],
    priceFactors: ["Высота потолка", "Количество верхних секций", "Пеналы", "Монтаж под потолок"],
    gallery: gallery(
      "Современная кухня до потолка",
      [
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-1.webp",
        "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-2.webp",
      ],
      detailImages.storage,
      detailImages.facades,
      detailImages.appliances,
    ),
  },
];

export const layoutFilterOptions: { id: KitchenLayoutId | "all"; label: string }[] = [
  { id: "all", label: "Все планировки" },
  { id: "straight", label: "Прямая" },
  { id: "corner", label: "Угловая" },
  { id: "u-shaped", label: "П-образная" },
  { id: "island", label: "С островом" },
  { id: "small", label: "Маленькая кухня" },
  { id: "living", label: "Кухня-гостиная" },
  { id: "ceiling", label: "До потолка" },
];

export const budgetFilterOptions: { id: KitchenBudgetId | "all"; label: string }[] = [
  { id: "all", label: "Любой бюджет" },
  { id: "to-2000", label: "До 2 000 BYN" },
  { id: "2000-4000", label: "2 000-4 000 BYN" },
  { id: "4000-7000", label: "4 000-7 000 BYN" },
  { id: "7000-plus", label: "От 7 000 BYN" },
];

export const facadeFilterOptions = [
  { id: "all", label: "Любые фасады" },
  { id: "mdf", label: "МДФ" },
  { id: "ldsp", label: "ЛДСП" },
  { id: "emal", label: "Эмаль" },
  { id: "wood", label: "Древесная текстура" },
] as const;

export const roomFilterOptions = [
  { id: "all", label: "Любое помещение" },
  { id: "flat", label: "Квартира" },
  { id: "studio", label: "Студия" },
  { id: "living", label: "Кухня-гостиная" },
  { id: "small", label: "Маленькая кухня" },
] as const;

export function formatByn(value: number) {
  return value.toLocaleString("ru");
}
