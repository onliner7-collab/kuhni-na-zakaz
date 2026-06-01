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
  berezino: [
    {
      id: "berezino-uglovaya-do-potolka",
      title: "Угловая кухня до потолка",
      shortDescription:
        "Компактная угловая планировка с высокими шкафами, спокойными фасадами и встроенной техникой.",
      image: "/uploads/locations/berezino-3d/berezino-generated-uglovaya-20260531.webp",
      alt: "3D-визуализация КухниBY: угловая кухня с белыми фасадами и темной рабочей зоной",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["квартира", "шкафы до потолка", "встроенная техника"],
      ideaType: "corner",
    },
    {
      id: "berezino-detal-yashchiki",
      title: "Деталь ящиков и столешницы",
      shortDescription:
        "Акцент на выдвижные ящики, рабочую поверхность и теплую подсветку для ежедневной готовки.",
      image: "/uploads/locations/berezino-3d/berezino-generated-yashchiki-20260531.webp",
      alt: "3D-визуализация КухниBY: светлая угловая кухня с деревянной столешницей",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не заявляем как выполненный объект в городе.",
      suitableFor: ["ящики", "подсветка", "хранение"],
      ideaType: "built-in",
    },
    {
      id: "berezino-semeynaya-pryamaya",
      title: "Семейная прямая кухня",
      shortDescription:
        "Прямая линия с пеналами и древесной фактурой для квартиры или небольшого дома.",
      image: "/uploads/locations/berezino-3d/berezino-generated-pryamaya-20260531.webp",
      alt: "3D-визуализация КухниBY: прямая кухня с мойкой и варочной панелью",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY для ориентира по планировке, фасадам и рабочей зоне.",
      suitableFor: ["прямая кухня", "пеналы", "семейное хранение"],
      ideaType: "straight",
    },
  ],
  volozhin: [
    {
      id: "volozhin-dom-polustrov",
      title: "Кухня для дома с полуостровом",
      shortDescription:
        "Теплая древесная фактура, спокойные фасады и полуостров как дополнительная рабочая зона.",
      image: "/uploads/locations/volozhin-3d/volozhin-generated-dom-20260531.webp",
      alt: "3D-визуализация КухниBY: светлая кухня с глянцевыми фасадами",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы.",
      suitableFor: ["частный дом", "полуостров", "дерево"],
      ideaType: "family",
    },
    {
      id: "volozhin-derevo-stoleshnica",
      title: "Дерево и светлая столешница",
      shortDescription:
        "Практичная рабочая поверхность, глубокие ящики и мягкий дневной свет для спокойного интерьера.",
      image: "/uploads/locations/volozhin-3d/volozhin-generated-derevo-20260531.webp",
      alt: "3D-визуализация КухниBY: небольшая кухня с древесной столешницей и газовой плитой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY для выбора сочетания фасадов, столешницы и фартука.",
      suitableFor: ["дерево", "столешница", "ящики"],
      ideaType: "wood",
    },
    {
      id: "volozhin-penaly-hranenie",
      title: "Пеналы и закрытое хранение",
      shortDescription:
        "Высокие шкафы для запасов, духовки и холодильника без визуального перегруза.",
      image: "/uploads/locations/volozhin-3d/volozhin-generated-penaly-20260531.webp",
      alt: "3D-визуализация КухниBY: кухня с барной опорой и встроенным хранением",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["пеналы", "хранение", "встроенная техника"],
      ideaType: "built-in",
    },
  ],
  stolbtsy: [
    {
      id: "stolbtsy-pryamaya-kvartira",
      title: "Прямая кухня для квартиры",
      shortDescription:
        "Лаконичная прямая линия с понятной сметой, встроенной техникой и спокойной палитрой.",
      image: "/uploads/locations/stolbtsy-3d/stolbtsy-generated-pryamaya-20260531.webp",
      alt: "3D-визуализация КухниBY: компактная прямая кухня с подсветкой рабочей зоны",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, похожую композицию можно пересчитать под ваш размер.",
      suitableFor: ["прямая кухня", "квартира", "понятная смета"],
      ideaType: "straight",
    },
    {
      id: "stolbtsy-uglovaya-hranenie",
      title: "Угловая кухня с хранением",
      shortDescription:
        "Угловая компоновка с верхними шкафами, ящиками и удобным рабочим треугольником.",
      image: "/uploads/locations/stolbtsy-3d/stolbtsy-generated-uglovaya-20260531.webp",
      alt: "3D-визуализация КухниBY: кухня с высокими шкафами и встроенной духовкой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY без привязки к конкретной выполненной работе в городе.",
      suitableFor: ["угловая кухня", "хранение", "рабочий треугольник"],
      ideaType: "corner",
    },
    {
      id: "stolbtsy-detal-stoleshnica",
      title: "Деталь столешницы и ящиков",
      shortDescription:
        "Крупный план рабочей зоны: столешница, ящики и зона подготовки продуктов.",
      image: "/uploads/locations/stolbtsy-3d/stolbtsy-generated-stoleshnica-20260531.webp",
      alt: "3D-визуализация КухниBY: кухня с зеленовато-синими фасадами и светлой столешницей",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не заявляем как выполненный объект в городе.",
      suitableFor: ["столешница", "ящики", "рабочая зона"],
      ideaType: "built-in",
    },
  ],
  uzda: [
    {
      id: "uzda-kompaktnaya-uglovaya",
      title: "Компактная угловая кухня",
      shortDescription:
        "Небольшой гарнитур с продуманными ящиками, рабочей зоной и верхним хранением.",
      image: "/uploads/locations/uzda-3d/uzda-generated-kompaktnaya-20260531.webp",
      alt: "3D-визуализация КухниBY: компактная кухня с фасадами под камень и темными акцентами",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, используем как ориентир по форме и хранению.",
      suitableFor: ["маленькая кухня", "угловая планировка", "хранение"],
      ideaType: "small",
    },
    {
      id: "uzda-malenkaya-do-potolka",
      title: "Маленькая кухня до потолка",
      shortDescription:
        "Высокие шкафы, светлые фасады и аккуратная встроенная техника для компактного помещения.",
      image: "/uploads/locations/uzda-3d/uzda-generated-do-potolka-20260531.webp",
      alt: "3D-визуализация КухниBY: кухня с высоким пеналом и встроенной техникой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY для похожего проекта с высоким хранением.",
      suitableFor: ["шкафы до потолка", "маленькое помещение", "встроенная техника"],
      ideaType: "small",
    },
    {
      id: "uzda-rabochaya-zona",
      title: "Рабочая зона с подсветкой",
      shortDescription:
        "Практичная столешница, подсветка и закрытое хранение для ежедневного использования.",
      image: "/uploads/locations/uzda-3d/uzda-generated-rabochaya-zona-20260531.webp",
      alt: "3D-визуализация КухниBY: рабочая зона кухни с подсветкой и встроенной духовкой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY: не подтвержденный локальный кейс, а визуальный ориентир.",
      suitableFor: ["рабочая зона", "подсветка", "ящики"],
      ideaType: "built-in",
    },
  ],
  cherven: [
    {
      id: "cherven-semeynaya-dom",
      title: "Семейная кухня для дома",
      shortDescription:
        "Больше рабочей поверхности, пеналы и спокойные фасады для активного ежедневного использования.",
      image: "/uploads/locations/cherven-3d/cherven-generated-semeynaya-20260531.webp",
      alt: "3D-визуализация КухниBY: длинная кухня со светлой рабочей зоной и мойкой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, адаптируем похожую рабочую зону под помещение.",
      suitableFor: ["частный дом", "семейное хранение", "рабочая поверхность"],
      ideaType: "family",
    },
    {
      id: "cherven-vstroennaya-tehnika",
      title: "Встроенная техника и высокие шкафы",
      shortDescription:
        "Пеналы, встроенная духовка и закрытые фасады для спокойного современного интерьера.",
      image: "/uploads/locations/cherven-3d/cherven-generated-tehnika-20260531.webp",
      alt: "3D-визуализация КухниBY: угловая кухня со встроенной техникой и серыми фасадами",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY для похожего проекта со встроенной техникой.",
      suitableFor: ["встроенная техника", "пеналы", "современный стиль"],
      ideaType: "built-in",
    },
    {
      id: "cherven-detal-podsvetka",
      title: "Деталь подсветки и столешницы",
      shortDescription:
        "Крупный план рабочей зоны с теплой подсветкой, столешницей и глубокими ящиками.",
      image: "/uploads/locations/cherven-3d/cherven-generated-podsvetka-20260531.webp",
      alt: "3D-визуализация КухниBY: светлая кухня с мраморным фартуком и подсветкой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не заявляем как выполненный объект в городе.",
      suitableFor: ["подсветка", "столешница", "ящики"],
      ideaType: "wood",
    },
  ],
  "maryina-gorka": [
    {
      id: "maryina-gorka-kuhnya-gostinaya",
      title: "Кухня-гостиная со спокойными фасадами",
      shortDescription:
        "Открытая композиция с прямой линией шкафов, видимыми боковинами и аккуратной зоной хранения.",
      image: "/uploads/locations/maryina-gorka-3d/maryina-gorka-generated-gostinaya-20260531.webp",
      alt: "3D-визуализация КухниBY: угловая кухня с белыми фасадами и встроенной техникой",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, похожее решение можно адаптировать под ваш метраж.",
      suitableFor: ["кухня-гостиная", "прямая линия", "видимые боковины"],
      ideaType: "family",
    },
    {
      id: "maryina-gorka-pryamaya-svetlaya",
      title: "Светлая прямая кухня",
      shortDescription:
        "Лаконичная прямая кухня с высокими шкафами и теплой древесной нишей.",
      image: "/uploads/locations/maryina-gorka-3d/maryina-gorka-generated-svetlaya-20260531.webp",
      alt: "3D-визуализация КухниBY: кухня с древесными и темными фасадами",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY для выбора контраста фасадов и рабочей зоны.",
      suitableFor: ["прямая кухня", "светлые фасады", "пеналы"],
      ideaType: "straight",
    },
    {
      id: "maryina-gorka-penaly-detal",
      title: "Пеналы и деталь хранения",
      shortDescription:
        "Высокие шкафы помогают разместить холодильник, духовку, запасы и бытовые мелочи.",
      image: "/uploads/locations/maryina-gorka-3d/maryina-gorka-generated-penaly-20260531.webp",
      alt: "3D-визуализация КухниBY: просторная кухня с островом и линейной рабочей зоной",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY: не подтвержденный локальный кейс, а ориентир для расчета.",
      suitableFor: ["пеналы", "хранение", "встроенная техника"],
      ideaType: "built-in",
    },
  ],
  kletsk: [
    {
      id: "kletsk-uglovaya-kvartira",
      title: "Угловая кухня для квартиры",
      shortDescription:
        "Теплые серые фасады, древесная столешница и высокий блок хранения для компактного помещения.",
      image: "/uploads/locations/kletsk-3d/kletsk-generated-uglovaya-20260601.webp",
      alt: "3D-визуализация КухниBY: угловая кухня с серыми фасадами для Клецка",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы в Клецке.",
      suitableFor: ["квартира", "угловая кухня", "хранение"],
      ideaType: "corner",
    },
    {
      id: "kletsk-neoklassika-dom",
      title: "Светлая неоклассика для дома",
      shortDescription:
        "Рамочные фасады, высокие шкафы и спокойная палитра для семейной кухни.",
      image: "/uploads/locations/kletsk-3d/kletsk-generated-neoklassika-20260601.webp",
      alt: "3D-визуализация КухниBY: светлая неоклассическая кухня для Клецка",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна без привязки к выполненному объекту.",
      suitableFor: ["частный дом", "неоклассика", "шкафы до потолка"],
      ideaType: "family",
    },
    {
      id: "kletsk-yashchiki-stoleshnica",
      title: "Ящики и рабочая зона",
      shortDescription:
        "Крупный план хранения, столешницы и подсветки для ежедневной готовки.",
      image: "/uploads/locations/kletsk-3d/kletsk-generated-yashchiki-20260601.webp",
      alt: "3D-визуализация КухниBY: детали ящиков и столешницы кухни в Клецке",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["ящики", "столешница", "подсветка"],
      ideaType: "built-in",
    },
  ],
  kopyl: [
    {
      id: "kopyl-pryamaya-kvartira",
      title: "Прямая кухня с пеналом",
      shortDescription:
        "Лаконичная линия для вытянутой комнаты с теплой нишей и встроенной техникой.",
      image: "/uploads/locations/kopyl-3d/kopyl-generated-pryamaya-20260601.webp",
      alt: "3D-визуализация КухниBY: прямая светлая кухня для Копыля",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы в Копыле.",
      suitableFor: ["прямая кухня", "квартира", "пенал"],
      ideaType: "straight",
    },
    {
      id: "kopyl-uglovaya-obedennaya",
      title: "Угловая кухня с обеденной зоной",
      shortDescription:
        "Сине-серые фасады, светлый верх и компактный стол для семейного сценария.",
      image: "/uploads/locations/kopyl-3d/kopyl-generated-uglovaya-20260601.webp",
      alt: "3D-визуализация КухниBY: угловая кухня с обеденной зоной для Копыля",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, похожую композицию можно пересчитать под размеры помещения.",
      suitableFor: ["угловая кухня", "обеденная зона", "семейная квартира"],
      ideaType: "corner",
    },
    {
      id: "kopyl-penaly-hranenie",
      title: "Пеналы и выдвижное хранение",
      shortDescription:
        "Высокий блок для духовки, запасов и закрытого хранения без лишнего визуального шума.",
      image: "/uploads/locations/kopyl-3d/kopyl-generated-penaly-20260601.webp",
      alt: "3D-визуализация КухниBY: пеналы и хранение кухни в Копыле",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не заявляем как выполненный объект в городе.",
      suitableFor: ["пеналы", "встроенная духовка", "хранение"],
      ideaType: "built-in",
    },
  ],
  krupki: [
    {
      id: "krupki-uglovaya-grafit",
      title: "Угловая кухня с графитовыми фасадами",
      shortDescription:
        "Практичная композиция с деревянными акцентами, встроенной техникой и закрытым хранением.",
      image: "/uploads/locations/krupki-3d/krupki-generated-uglovaya-20260601.webp",
      alt: "3D-визуализация КухниBY: угловая кухня с графитовыми фасадами для Крупок",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы в Крупках.",
      suitableFor: ["угловая кухня", "графит", "встроенная техника"],
      ideaType: "corner",
    },
    {
      id: "krupki-dom-derevo",
      title: "Кухня для дома с теплым деревом",
      shortDescription:
        "Длинная рабочая зона, кремовые фасады и высокий блок под семейное хранение.",
      image: "/uploads/locations/krupki-3d/krupki-generated-dom-20260601.webp",
      alt: "3D-визуализация КухниBY: кухня для частного дома в Крупках",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна для похожего проекта.",
      suitableFor: ["частный дом", "дерево", "семейное хранение"],
      ideaType: "family",
    },
    {
      id: "krupki-detal-moyka",
      title: "Деталь мойки и рабочей зоны",
      shortDescription:
        "Крупный план столешницы, фартука, мойки и выдвижных ящиков.",
      image: "/uploads/locations/krupki-3d/krupki-generated-detal-20260601.webp",
      alt: "3D-визуализация КухниBY: деталь мойки и столешницы кухни в Крупках",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["мойка", "столешница", "ящики"],
      ideaType: "built-in",
    },
  ],
  lyuban: [
    {
      id: "lyuban-semeynaya-dom",
      title: "Семейная кухня для дома",
      shortDescription:
        "Оливковые фасады, дубовые пеналы и большая рабочая поверхность для активной кухни.",
      image: "/uploads/locations/lyuban-3d/lyuban-generated-semeynaya-20260601.webp",
      alt: "3D-визуализация КухниBY: семейная кухня для дома в Любани",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы в Любани.",
      suitableFor: ["частный дом", "семейное хранение", "оливковые фасады"],
      ideaType: "family",
    },
    {
      id: "lyuban-pryamaya-do-potolka",
      title: "Прямая кухня до потолка",
      shortDescription:
        "Светлые фасады, древесные акценты и компактная линия для квартиры.",
      image: "/uploads/locations/lyuban-3d/lyuban-generated-pryamaya-20260601.webp",
      alt: "3D-визуализация КухниBY: прямая кухня до потолка для Любани",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример дизайна без привязки к выполненному объекту.",
      suitableFor: ["прямая кухня", "шкафы до потолка", "квартира"],
      ideaType: "straight",
    },
    {
      id: "lyuban-stoleshnica-detal",
      title: "Деталь столешницы и хранения",
      shortDescription:
        "Крупный план рабочей поверхности, ящиков и теплой подсветки.",
      image: "/uploads/locations/lyuban-3d/lyuban-generated-stoleshnica-20260601.webp",
      alt: "3D-визуализация КухниBY: столешница и ящики кухни в Любани",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["столешница", "ящики", "подсветка"],
      ideaType: "built-in",
    },
  ],
  myadel: [
    {
      id: "myadel-dom-skandi",
      title: "Светлая кухня для дома или дачи",
      shortDescription:
        "Белые фасады, натуральное дерево и большой свет для спокойного загородного интерьера.",
      image: "/uploads/locations/myadel-3d/myadel-generated-dom-20260601.webp",
      alt: "3D-визуализация КухниBY: светлая кухня для дома или дачи в Мяделе",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы в Мяделе.",
      suitableFor: ["дом", "дача", "сканди"],
      ideaType: "family",
    },
    {
      id: "myadel-dacha-pryamaya",
      title: "Компактная кухня для дачи",
      shortDescription:
        "Пастельные фасады, дубовая столешница и простая компоновка для сезонного объекта.",
      image: "/uploads/locations/myadel-3d/myadel-generated-dacha-20260601.webp",
      alt: "3D-визуализация КухниBY: компактная дачная кухня для Мяделя",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, пример идеи для похожего объекта.",
      suitableFor: ["дача", "прямая кухня", "компактное помещение"],
      ideaType: "straight",
    },
    {
      id: "myadel-detal-derevo",
      title: "Деталь дерева и рабочей зоны",
      shortDescription:
        "Крупный план столешницы, мойки, фартука и спокойной подсветки.",
      image: "/uploads/locations/myadel-3d/myadel-generated-detal-20260601.webp",
      alt: "3D-визуализация КухниBY: деталь деревянной столешницы кухни в Мяделе",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не заявляем как выполненный объект в городе.",
      suitableFor: ["дерево", "мойка", "рабочая зона"],
      ideaType: "wood",
    },
  ],
  "starye-dorogi": [
    {
      id: "starye-dorogi-uglovaya",
      title: "Угловая кухня для семьи",
      shortDescription:
        "Бежевые фасады, темная столешница и высокий пенал для практичного ежедневного сценария.",
      image: "/uploads/locations/starye-dorogi-3d/starye-dorogi-generated-uglovaya-20260601.webp",
      alt: "3D-визуализация КухниBY: угловая кухня для Старых Дорог",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не фото выполненной работы в Старых Дорогах.",
      suitableFor: ["угловая кухня", "семейное хранение", "темная столешница"],
      ideaType: "corner",
    },
    {
      id: "starye-dorogi-do-potolka",
      title: "Прямая кухня до потолка",
      shortDescription:
        "Светло-серые фасады, древесные акценты и стена хранения со встроенной техникой.",
      image: "/uploads/locations/starye-dorogi-3d/starye-dorogi-generated-do-potolka-20260601.webp",
      alt: "3D-визуализация КухниBY: кухня до потолка для Старых Дорог",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, похожую идею можно адаптировать под ваш размер.",
      suitableFor: ["шкафы до потолка", "прямая кухня", "встроенная техника"],
      ideaType: "straight",
    },
    {
      id: "starye-dorogi-detal-yashchiki",
      title: "Деталь ящиков и фартука",
      shortDescription:
        "Рабочая зона с теплой подсветкой, матовыми фасадами и надежной столешницей.",
      image: "/uploads/locations/starye-dorogi-3d/starye-dorogi-generated-detal-20260601.webp",
      alt: "3D-визуализация КухниBY: детали ящиков и фартука кухни в Старых Дорогах",
      badge: "3D-визуализация КухниBY",
      disclosure: "3D-визуализация КухниBY, не подтвержденный локальный кейс.",
      suitableFor: ["ящики", "фартук", "подсветка"],
      ideaType: "built-in",
    },
  ],
};

export function getKitchenIdeas3DForCity(citySlug: string) {
  return cityKitchenIdeas3D[citySlug] ?? kitchenIdeas3D;
}
