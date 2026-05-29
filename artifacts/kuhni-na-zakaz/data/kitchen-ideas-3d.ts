export type KitchenIdea3DType =
  | "straight"
  | "corner"
  | "small"
  | "wood"
  | "built-in"
  | "family";

export interface KitchenIdea3D {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  alt: string;
  badge: "3D-визуализация" | "3D-визуализация КухниBY";
  disclosure: string;
  suitableFor: string[];
  ideaType: KitchenIdea3DType;
}

export const kitchenIdeas3D: KitchenIdea3D[] = [
  {
    id: "svetlaya-pryamaya-kuhnya",
    title: "Светлая прямая кухня",
    shortDescription:
      "Лаконичная прямая компоновка для квартиры, студии или вытянутого помещения.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-pryamaya-svetlaya.webp",
    alt: "3D-визуализация светлой прямой кухни, пример дизайна для заказа",
    badge: "3D-визуализация",
    disclosure: "Пример дизайна, не фото выполненной работы.",
    suitableFor: ["узкие помещения", "студии", "понятный бюджет"],
    ideaType: "straight",
  },
  {
    id: "uglovaya-kuhnya-do-potolka",
    title: "Угловая кухня до потолка",
    shortDescription:
      "Высокие шкафы помогают добавить хранение и визуально собрать кухню в единую линию.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-uglovaya-do-potolka.webp",
    alt: "3D-визуализация угловой кухни до потолка, пример дизайна для заказа",
    badge: "3D-визуализация",
    disclosure: "Идея для кухни на заказ, не снимок реализованной кухни.",
    suitableFor: ["квартиры", "новостройки", "много хранения"],
    ideaType: "corner",
  },
  {
    id: "malenkaya-kuhnya-hranenie",
    title: "Маленькая кухня с максимумом хранения",
    shortDescription:
      "Компактная идея для небольшого помещения, где важны каждый ящик и рабочая зона.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-malenkaya-hranenie.webp",
    alt: "3D-визуализация маленькой кухни с максимумом хранения, пример дизайна",
    badge: "3D-визуализация",
    disclosure: "Пример дизайна, не фото выполненной работы.",
    suitableFor: ["маленькие кухни", "хрущевки", "арендные квартиры"],
    ideaType: "small",
  },
  {
    id: "derevo-svetlaya-stoleshnica",
    title: "Кухня с деревянными фасадами и светлой столешницей",
    shortDescription:
      "Теплое сочетание древесной фактуры, светлой рабочей поверхности и спокойной геометрии.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-derevo-svetlaya-stoleshnica.webp",
    alt: "3D-визуализация кухни с деревянными фасадами и светлой столешницей",
    badge: "3D-визуализация",
    disclosure: "Идея для заказа, не снимок реализованного проекта.",
    suitableFor: ["семейные кухни", "дома", "теплый современный интерьер"],
    ideaType: "wood",
  },
  {
    id: "vstroennaya-tehnika-skrytye-ruchki",
    title: "Кухня со встроенной техникой и скрытыми ручками",
    shortDescription:
      "Минималистичная идея с чистыми фасадами, пеналами и местом под встроенную технику.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-vstroennaya-tehnika-skrytye-ruchki.webp",
    alt: "3D-визуализация кухни со встроенной техникой и скрытыми ручками",
    badge: "3D-визуализация",
    disclosure: "Пример дизайна, не фото выполненной работы.",
    suitableFor: ["современный стиль", "встроенная техника", "скрытые ручки"],
    ideaType: "built-in",
  },
  {
    id: "semeynaya-kuhnya-dom",
    title: "Просторная семейная кухня для дома или большой квартиры",
    shortDescription:
      "Больше рабочей поверхности, мест хранения и сценариев для большой семьи.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-semeynaya-dom.webp",
    alt: "3D-визуализация просторной семейной кухни для дома или большой квартиры",
    badge: "3D-визуализация",
    disclosure: "Это 3D-визуализация, а не фото реализованного объекта.",
    suitableFor: ["частный дом", "большая квартира", "семейное хранение"],
    ideaType: "family",
  },
];

export function getKitchenIdea3DById(id: string | null | undefined) {
  if (!id) return null;

  return kitchenIdeas3D.find((idea) => idea.id === id) ?? null;
}

export const cityKitchenIdeas3D: Record<string, KitchenIdea3D[]> = {
  dzerzhinsk: [
    {
      id: "dzerzhinsk-uglovaya-do-potolka",
      title: "Угловая кухня до потолка для квартиры",
      shortDescription:
        "Светлая рабочая зона, высокие шкафы и встроенная техника для компактной кухни в квартире.",
      image: "/uploads/locations/dzerzhinsk-3d/dzerzhinsk-3d-uglovaya-do-potolka.webp",
      alt: "3D-визуализация КухниBY: угловая кухня до потолка для квартиры в Дзержинске",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["квартиры", "шкафы до потолка", "встроенная техника"],
      ideaType: "corner",
    },
    {
      id: "dzerzhinsk-detal-yashchiki",
      title: "Рабочая зона с выдвижными ящиками",
      shortDescription:
        "Акцент на хранение, удобную столешницу и спокойное сочетание серых фасадов с древесной фактурой.",
      image: "/uploads/locations/dzerzhinsk-3d/dzerzhinsk-3d-detal-yashchiki-stoleshnica.webp",
      alt: "3D-визуализация КухниBY: детали ящиков и столешницы кухни в Дзержинске",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный объект в городе.",
      suitableFor: ["выдвижные ящики", "угловая кухня", "практичное хранение"],
      ideaType: "built-in",
    },
    {
      id: "dzerzhinsk-semeynaya-vstroennaya",
      title: "Семейная кухня со встроенной техникой",
      shortDescription:
        "Высокие пеналы, графитовые фасады и теплая древесная линия для кухни с активным ежедневным использованием.",
      image: "/uploads/locations/dzerzhinsk-3d/dzerzhinsk-3d-semeynaya-vstroennaya.webp",
      alt: "3D-визуализация КухниBY: семейная кухня со встроенной техникой для Дзержинска",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна для расчета похожего проекта.",
      suitableFor: ["семейная кухня", "пеналы", "графит и дерево"],
      ideaType: "family",
    },
  ],
  zaslavl: [
    {
      id: "zaslavl-pryamaya-svetlaya",
      title: "Светлая прямая кухня-гостиная",
      shortDescription:
        "Прямая линия шкафов, светлые фасады и дерево для спокойной кухни-гостиной рядом с Минском.",
      image: "/uploads/locations/zaslavl-3d/zaslavl-3d-pryamaya-svetlaya.webp",
      alt: "3D-визуализация КухниBY: светлая прямая кухня для Заславля",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["кухня-гостиная", "прямая кухня", "светлый интерьер"],
      ideaType: "straight",
    },
    {
      id: "zaslavl-rabochaya-zona",
      title: "Рабочая зона с дубовой нишей",
      shortDescription:
        "Минималистичные фасады, аккуратная мойка и ниша под ежедневные предметы без визуального шума.",
      image: "/uploads/locations/zaslavl-3d/zaslavl-3d-rabochaya-zona.webp",
      alt: "3D-визуализация КухниBY: рабочая зона светлой кухни в Заславле",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна без привязки к выполненному объекту.",
      suitableFor: ["рабочая зона", "дубовая ниша", "минимализм"],
      ideaType: "wood",
    },
    {
      id: "zaslavl-penaly-hranenie",
      title: "Пеналы и хранение до потолка",
      shortDescription:
        "Высокие шкафы, встроенная духовка и закрытое хранение для кухни, которую легко поддерживать в порядке.",
      image: "/uploads/locations/zaslavl-3d/zaslavl-3d-penaly-hranenie.webp",
      alt: "3D-визуализация КухниBY: пеналы и хранение до потолка для кухни в Заславле",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["пеналы", "хранение", "встроенная духовка"],
      ideaType: "built-in",
    },
  ],
  logoisk: [
    {
      id: "logoisk-kuhnya-dom-polustrov",
      title: "Кухня для частного дома с полуостровом",
      shortDescription:
        "Зеленые матовые фасады, деревянные пеналы и полуостров для дома или дачи с просторной кухней.",
      image: "/uploads/locations/logoisk-3d/logoisk-3d-kuhnya-dom-polustrov.webp",
      alt: "3D-визуализация КухниBY: кухня для частного дома с полуостровом в Логойске",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["частный дом", "полуостров", "дача"],
      ideaType: "family",
    },
    {
      id: "logoisk-zelenye-fasady",
      title: "Зеленые фасады и теплая столешница",
      shortDescription:
        "Спокойный интерьер для дома: глубокие ящики, каменная рабочая поверхность и мягкий дневной свет.",
      image: "/uploads/locations/logoisk-3d/logoisk-3d-zelenye-fasady.webp",
      alt: "3D-визуализация КухниBY: зеленые фасады и столешница кухни в Логойске",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна для похожего проекта.",
      suitableFor: ["зеленые фасады", "дом", "ящики"],
      ideaType: "wood",
    },
    {
      id: "logoisk-detal-polustrov",
      title: "Деталь полуострова и зоны хранения",
      shortDescription:
        "Полуостров можно использовать как дополнительную рабочую поверхность, место хранения и легкую зону завтрака.",
      image: "/uploads/locations/logoisk-3d/logoisk-3d-detal-polustrov.webp",
      alt: "3D-визуализация КухниBY: деталь полуострова кухни для Логойска",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный объект в городе.",
      suitableFor: ["полуостров", "рабочая поверхность", "хранение"],
      ideaType: "family",
    },
  ],
  vileyka: [
    {
      id: "vileyka-p-obraznaya-kompaktnaya",
      title: "Компактная П-образная кухня",
      shortDescription:
        "П-образная планировка помогает получить больше рабочей поверхности и хранения в ограниченном помещении.",
      image: "/uploads/locations/vileyka-3d/vileyka-3d-p-obraznaya-kompaktnaya.webp",
      alt: "3D-визуализация КухниBY: компактная П-образная кухня для Вилейки",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["П-образная кухня", "квартира", "много хранения"],
      ideaType: "small",
    },
    {
      id: "vileyka-hranenie-u-okna",
      title: "Хранение и мойка у окна",
      shortDescription:
        "Сине-серые фасады, светлый верх и аккуратная рабочая зона для семейной кухни в квартире.",
      image: "/uploads/locations/vileyka-3d/vileyka-3d-hranenie-u-okna.webp",
      alt: "3D-визуализация КухниBY: хранение и мойка у окна для кухни в Вилейке",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна без привязки к выполненной работе.",
      suitableFor: ["мойка у окна", "сине-серые фасады", "угловое хранение"],
      ideaType: "corner",
    },
    {
      id: "vileyka-detal-yashchiki",
      title: "Ящики и высокий хозяйственный пенал",
      shortDescription:
        "Деталь показывает, как распределить посуду, запасы и мелкую технику в компактной кухне.",
      image: "/uploads/locations/vileyka-3d/vileyka-3d-detal-yashchiki.webp",
      alt: "3D-визуализация КухниBY: ящики и высокий пенал кухни в Вилейке",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["ящики", "пенал", "компактное хранение"],
      ideaType: "built-in",
    },
  ],
  nesvizh: [
    {
      id: "nesvizh-neoklassika-svetlaya",
      title: "Светлая неоклассика до потолка",
      shortDescription:
        "Рамочные фасады, спокойная палитра и высокие шкафы для кухни с более классическим настроением.",
      image: "/uploads/locations/nesvizh-3d/nesvizh-3d-neoklassika-svetlaya.webp",
      alt: "3D-визуализация КухниBY: светлая неоклассическая кухня для Несвижа",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["неоклассика", "светлые фасады", "шкафы до потолка"],
      ideaType: "family",
    },
    {
      id: "nesvizh-rabochaya-zona",
      title: "Рабочая зона с каменной фактурой",
      shortDescription:
        "Каменная столешница, теплый свет и аккуратные ручки для кухни в спокойном классическом стиле.",
      image: "/uploads/locations/nesvizh-3d/nesvizh-3d-rabochaya-zona.webp",
      alt: "3D-визуализация КухниBY: рабочая зона неоклассической кухни в Несвиже",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна для похожего проекта.",
      suitableFor: ["каменная столешница", "рамочные фасады", "теплый свет"],
      ideaType: "wood",
    },
    {
      id: "nesvizh-detal-penal",
      title: "Пенал и выдвижное хранение",
      shortDescription:
        "Высокий пенал помогает спрятать запасы и бытовые мелочи, не перегружая рабочую поверхность.",
      image: "/uploads/locations/nesvizh-3d/nesvizh-3d-detal-penal.webp",
      alt: "3D-визуализация КухниBY: пенал и выдвижное хранение кухни в Несвиже",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный объект в городе.",
      suitableFor: ["пенал", "выдвижное хранение", "неоклассика"],
      ideaType: "built-in",
    },
  ],
};

export function getKitchenIdeas3DForCity(citySlug: string) {
  return cityKitchenIdeas3D[citySlug] ?? kitchenIdeas3D;
}
