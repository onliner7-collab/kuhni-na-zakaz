/**
 * Уникальные обложки статей блога: путь в public, alt, размеры, промпт для регенерации.
 * Ключ — фактический slug в URL (Prisma / статический fallback).
 */
export type BlogCoverMeta = {
  /** Публичный путь, например /images/blog/foo.webp */
  image: string;
  imageAlt: string;
  imageTitle?: string;
  imageWidth: number;
  imageHeight: number;
  imagePrompt: string;
  imageCaption?: string;
};

export const BLOG_COVER_DEFAULT_WIDTH = 1200;
export const BLOG_COVER_DEFAULT_HEIGHT = 800;

export const BLOG_COVER_META: Record<string, BlogCoverMeta> = {
  "kuhnya-do-potolka-plyusy-minusy-cena": {
    image: "/images/blog/kuhnya-do-potolka.webp",
    imageTitle: "Кухня до потолка: современная 3D-визуализация",
    imageAlt:
      "Современная кухня до потолка со светлыми фасадами и встроенной техникой",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная современная 3D-визуализация кухни до потолка в светлой квартире, высокие верхние шкафы до самого потолка, матовые светло-бежевые фасады, встроенный холодильник и духовка, аккуратная подсветка рабочей зоны, деревянная столешница, минималистичный интерьер, дневной свет из окна, без людей, без текста, без логотипов, коммерческое интерьерное фото для сайта кухонь на заказ, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация кухни до потолка в светлом интерьере",
  },
  "uglovaya-kuhnya-razmery-planirovka": {
    image: "/images/blog/uglovaya-kuhnya-planirovka.webp",
    imageTitle: "Угловая кухня: планировка и рабочая зона",
    imageAlt: "Угловая кухня с продуманной планировкой и рабочим треугольником",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная 3D-визуализация угловой кухни L-образной формы, светлые фасады, деревянная столешница, мойка в одной части гарнитура, варочная панель на другой стороне, удобная рабочая зона, верхние и нижние шкафы, аккуратная современная квартира, вид под углом, дневной свет, без людей, без текста, без брендов, интерьер для статьи о планировке угловой кухни, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация угловой кухни с удобной рабочей зоной",
  },
  "skolko-stoit-kuhnya-na-zakaz-minsk-2026": {
    image: "/images/blog/stoimost-kuhni-na-zakaz-minsk-2026.webp",
    imageTitle: "Кухня на заказ в Минске: материалы и комплектация",
    imageAlt: "Современная кухня на заказ в Минске с материалами и фурнитурой",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная 3D-визуализация современной кухни на заказ в городской квартире Минска, открытые образцы фасадов и столешниц на рабочей поверхности, аккуратные ящики с качественной фурнитурой, светлые матовые фасады, встроенная техника без логотипов, чистый интерьер, ощущение расчёта стоимости и выбора материалов, без людей, без текста, без ценников, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация кухни с акцентом на материалы и комплектацию",
  },
  "kak-vybrat-kuhnyu": {
    image: "/images/blog/kak-vybrat-kuhnyu-na-zakaz.webp",
    imageTitle: "Выбор кухни на заказ: образцы и планировка",
    imageAlt:
      "Выбор кухни на заказ с образцами фасадов, столешницы и планировкой",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная интерьерная 3D-визуализация процесса выбора кухни на заказ, на столешнице лежат образцы фасадов, столешницы и фурнитуры, рядом схематичный план кухни на бумаге без читаемого текста, современная светлая кухня на фоне, встроенная техника, спокойный премиальный стиль, без людей, без логотипов, без читаемых надписей, иллюстрация для статьи о выборе кухни, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация подготовки к заказу кухни",
  },
  "skolko-stoit-kuhnya-na-zakaz": {
    image: "/images/blog/skolko-stoit-kuhnya-na-zakaz-v-belarusi.webp",
    imageTitle: "Стоимость кухни на заказ в Беларуси: материалы",
    imageAlt:
      "Кухня на заказ в Беларуси с разными вариантами материалов и комплектации",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная 3D-визуализация кухни на заказ в Беларуси, современный гарнитур среднего ценового сегмента, рядом аккуратно показаны разные варианты фасадов, столешниц и ручек как образцы материалов, светлая квартира, встроенная техника без брендов, чистый коммерческий интерьер, без людей, без текста, без цифр и ценников, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация кухни с вариантами материалов и комплектации",
  },
  "kuhnya-dlya-malenkoy-kvartiry": {
    image: "/images/blog/kuhnya-dlya-malenkoy-kvartiry.webp",
    imageTitle: "Компактная кухня для маленькой квартиры",
    imageAlt: "Компактная кухня для маленькой квартиры со шкафами до потолка",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная 3D-визуализация компактной кухни для маленькой квартиры, длина гарнитура около 2 метров, шкафы до потолка, светлые фасады, встроенная техника, складная или узкая рабочая поверхность, хорошее хранение, визуально просторный интерьер, дневной свет, аккуратный минимализм, без людей, без текста, без логотипов, иллюстрация для статьи о маленькой кухне, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация компактной кухни со шкафами до потолка",
  },
  "kakie-fasady-luchshe": {
    image: "/images/blog/fasady-mdf-plastik-emal-shpon.webp",
    imageTitle: "Образцы фасадов МДФ, пластик, эмаль и шпон",
    imageAlt: "Образцы кухонных фасадов МДФ, пластик, эмаль и шпон",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная предметная 3D-визуализация образцов кухонных фасадов на фоне современной кухни, четыре разные панели фасадов: матовый МДФ, глянцевый пластик, окрашенная эмаль, натуральный шпон дерева, аккуратно разложены на столешнице, мягкий дневной свет, премиальный каталоговый стиль, без людей, без текста, без логотипов, иллюстрация для статьи о материалах фасадов, 1200x800, realistic product interior render",
    imageCaption: "3D-визуализация сравнения материалов фасадов",
  },
  "kuhni-blum-hettich-gtv": {
    image: "/images/blog/furnitura-dlya-kuhni-yashchiki-petli.webp",
    imageTitle: "Кухонная фурнитура: ящики и петли",
    imageAlt:
      "Кухонная фурнитура с выдвижными ящиками, петлями и направляющими",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная 3D-визуализация кухонной фурнитуры в современной кухне, открытые выдвижные ящики с направляющими, крупный план качественных петель и механизмов плавного закрывания, светлые фасады, аккуратный технический интерьер, без логотипов брендов, без текста, без людей, иллюстрация для статьи о выборе кухонной фурнитуры, 1200x800, realistic interior product render",
    imageCaption: "3D-визуализация фурнитуры и выдвижных систем",
  },
  "kuhnya-s-ostrovom": {
    image: "/images/blog/kuhnya-s-ostrovom.webp",
    imageTitle: "Кухня с островом в современном интерьере",
    imageAlt: "Просторная современная кухня с островом и барными стульями",
    imageWidth: BLOG_COVER_DEFAULT_WIDTH,
    imageHeight: BLOG_COVER_DEFAULT_HEIGHT,
    imagePrompt:
      "Реалистичная 3D-визуализация просторной современной кухни с островом, большой кухонный остров с деревянной или каменной столешницей, барные стулья, встроенная техника без логотипов, достаточно широкие проходы вокруг острова, светлые матовые фасады, дневной свет, премиальный интерьер, без людей, без текста, иллюстрация для статьи о кухне с островом, 1200x800, realistic interior render",
    imageCaption: "3D-визуализация кухни с островом и барной зоной",
  },
};

export type BlogPostWithCover = {
  slug: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  coverImageCaption?: string | null;
  coverImageTitle?: string | null;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  imageGenerationPrompt?: string | null;
};

export function mergeBlogCover<T extends { slug: string; coverImage?: string | null }>(
  post: T,
): T & BlogPostWithCover {
  const meta = BLOG_COVER_META[post.slug];
  if (!meta) {
    return {
      ...post,
      coverImageAlt: null,
      coverImageCaption: null,
      coverImageTitle: null,
      coverImageWidth: null,
      coverImageHeight: null,
      imageGenerationPrompt: null,
    };
  }

  return {
    ...post,
    coverImage: meta.image,
    coverImageAlt: meta.imageAlt,
    coverImageCaption: meta.imageCaption ?? null,
    coverImageTitle: meta.imageTitle ?? null,
    coverImageWidth: meta.imageWidth,
    coverImageHeight: meta.imageHeight,
    imageGenerationPrompt: meta.imagePrompt,
  };
}

export function getBlogCoverMetaForSlug(slug: string): BlogCoverMeta | undefined {
  return BLOG_COVER_META[slug];
}
