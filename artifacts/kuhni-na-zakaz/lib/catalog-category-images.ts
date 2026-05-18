import { optimizedImageSrc } from "@/lib/image-optimization";

export interface CatalogImageAsset {
  src: string;
  alt: string;
}

const CATEGORY_IMAGES: Record<string, CatalogImageAsset> = {
  "kuhni-bez-ruchek": {
    src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek.webp",
    alt: "Минималистичная кухня без ручек с матовыми фасадами и каменной столешницей",
  },
  "kuhnya-bez-ruchek-minsk": {
    src: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    alt: "Кухня без ручек на заказ в Минске",
  },
  "kuhni-do-potolka": {
    src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
    alt: "Кухня с фасадами до потолка в спокойной бежево-серой палитре",
  },
  "kuhnya-do-potolka-minsk": {
    src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
    alt: "Кухня до потолка на заказ в Минске",
  },
  "malenkie-kuhni": {
    src: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp",
    alt: "Маленькая светлая кухня 6-8 м² с функциональной планировкой",
  },
  "malenkaya-kuhnya-minsk": {
    src: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp",
    alt: "Маленькая светлая кухня на заказ в Минске",
  },
  "kuhni-s-ostrovom": {
    src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp",
    alt: "Просторная кухня с островом, барной зоной и встроенной техникой",
  },
  "kuhnya-s-ostrovom-minsk": {
    src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp",
    alt: "Кухня с островом на заказ в Минске",
  },
  "p-obraznye-kuhni": {
    src: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp",
    alt: "П-образная кухня со светлыми фасадами, деревом и большой рабочей зоной",
  },
  "p-obraznaya-kuhnya-minsk": {
    src: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp",
    alt: "П-образная кухня на заказ в Минске",
  },
  "pryamye-kuhni": {
    src: "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp",
    alt: "Прямая светлая кухня с встроенной техникой и аккуратной зоной мойки",
  },
  "pryamaya-kuhnya-minsk": {
    src: "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp",
    alt: "Прямая светлая кухня на заказ в Минске",
  },
  "uglovye-kuhni": {
    src: "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya.webp",
    alt: "Угловая кухня до потолка в светло-серой и древесной гамме",
  },
  "uglovaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp",
    alt: "Угловая кухня на заказ в Минске",
  },
  "sovremennaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-mdf-emal-1.webp",
    alt: "Современная кухня на заказ в Минске",
  },
  "kuhnya-dlya-studii-minsk": {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Кухня для студии на заказ в Минске",
  },
  "kuhnya-ekonom-minsk": {
    src: "/uploads/seo-showcase/kuhnya-plastik-hpl-1.webp",
    alt: "Кухня эконом-класса на заказ в Минске",
  },
};

const CATEGORY_GALLERIES: Record<string, CatalogImageAsset[]> = {
  "uglovye-kuhni": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya.webp",
      alt: "Угловая кухня из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya-rakurs-1.webp",
      alt: "Угловая кухня из 3D-проекта, дополнительный ракурс слева",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-uglovaya-kuhnya-rakurs-2.webp",
      alt: "Угловая кухня из 3D-проекта, дополнительный широкий ракурс",
    },
    {
      src: "/uploads/kitchens/catalog/uglovaya-kuhnya-skandinavskaya-zelenaya-012-main.webp",
      alt: "Угловая зелёная кухня в скандинавском стиле",
    },
    {
      src: "/uploads/kitchens/catalog/uglovaya-kuhnya-neoklassika-bezhevaya-014-main.webp",
      alt: "Угловая бежевая кухня в стиле неоклассика",
    },
    {
      src: "/uploads/kitchens/catalog/uglovaya-kuhnya-minimalizm-seraya-017-main.webp",
      alt: "Угловая серая кухня до потолка",
    },
  ],
  "kuhni-bez-ruchek": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek.webp",
      alt: "Кухня без ручек из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek-rakurs-1.webp",
      alt: "Кухня без ручек из 3D-проекта, дополнительный ракурс слева",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-bez-ruchek-rakurs-2.webp",
      alt: "Кухня без ручек из 3D-проекта, дополнительный ракурс справа",
    },
    {
      src: "/uploads/kitchens/catalog/kuhnya-s-ostrovom-minimalizm-belaya-011-main.webp",
      alt: "Белая кухня без ручек в стиле минимализм",
    },
    {
      src: "/uploads/kitchens/catalog/uglovaya-kuhnya-minimalizm-seraya-017-main.webp",
      alt: "Серая угловая кухня без ручек",
    },
    {
      src: "/uploads/kitchens/catalog/kuhnya-s-ostrovom-minimalizm-seraya-025-main.webp",
      alt: "Серая кухня с островом без ручек",
    },
  ],
  "kuhni-do-potolka": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka.webp",
      alt: "Кухня до потолка из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-1.webp",
      alt: "Кухня до потолка из 3D-проекта, дополнительный ракурс слева",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-do-potolka-rakurs-2.webp",
      alt: "Кухня до потолка из 3D-проекта, дополнительный ракурс справа",
    },
    {
      src: "/uploads/seo-showcase/kuhnya-do-potolka-1.webp",
      alt: "Дополнительный пример кухни до потолка с большим хранением",
    },
    {
      src: "/uploads/kitchens/catalog/uglovaya-kuhnya-minimalizm-seraya-017-main.webp",
      alt: "Дополнительный пример серой угловой кухни с фасадами до потолка",
    },
  ],
  "kuhni-s-ostrovom": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom.webp",
      alt: "Кухня с островом из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-1.webp",
      alt: "Кухня с островом из 3D-проекта, дополнительный ракурс слева",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-kuhnya-s-ostrovom-rakurs-2.webp",
      alt: "Кухня с островом из 3D-проекта, дополнительный широкий ракурс",
    },
    {
      src: "/uploads/kitchens/catalog/kuhnya-s-ostrovom-minimalizm-belaya-011-main.webp",
      alt: "Дополнительный пример белой кухни с островом в стиле минимализм",
    },
    {
      src: "/uploads/kitchens/catalog/kuhnya-s-ostrovom-minimalizm-seraya-025-main.webp",
      alt: "Дополнительный пример серой кухни с островом",
    },
  ],
  "malenkie-kuhni": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp",
      alt: "Маленькая кухня из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya-rakurs-1.webp",
      alt: "Маленькая кухня из 3D-проекта, дополнительный ракурс от входа",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya-rakurs-2.webp",
      alt: "Маленькая кухня из 3D-проекта, дополнительный ракурс справа",
    },
    {
      src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
      alt: "Дополнительный пример маленькой функциональной кухни",
    },
    {
      src: "/uploads/kitchens/catalog/malenkaya-kuhnya-sovremennaya-seraya-030-main.webp",
      alt: "Дополнительный пример маленькой серой кухни в современном стиле",
    },
  ],
  "p-obraznye-kuhni": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya.webp",
      alt: "П-образная кухня из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya-rakurs-1.webp",
      alt: "П-образная кухня из 3D-проекта, дополнительный ракурс слева",
    },
    {
      src: "/images/design-proekt-kuhni/3d-proekt-p-obraznaya-kuhnya-rakurs-2.webp",
      alt: "П-образная кухня из 3D-проекта, дополнительный ракурс справа",
    },
    {
      src: "/uploads/seo-showcase/kuhnya-p-obraznaya-premium-1.webp",
      alt: "Дополнительный пример П-образной кухни с большой рабочей зоной",
    },
  ],
  "pryamye-kuhni": [
    {
      src: "/images/design-proekt-kuhni/3d-proekt-pryamaya-kuhnya.webp",
      alt: "Прямая кухня из 3D-проекта, тот же ракурс что в галерее дизайн-проекта",
    },
    {
      src: "/uploads/kitchens/catalog/pryamaya-kuhnya-3d-proekt-rakurs-1-generated-20260517.webp",
      alt: "Прямая светлая кухня из 3D-проекта, вид слева",
    },
    {
      src: "/uploads/kitchens/catalog/pryamaya-kuhnya-3d-proekt-rakurs-2-generated-20260517.webp",
      alt: "Прямая светлая кухня из 3D-проекта, дополнительный ракурс",
    },
    {
      src: "/uploads/kitchens/catalog/pryamaya-kuhnya-lineynaya-svetlaya-generated-20260517.webp",
      alt: "Дополнительный пример прямой светлой кухни вдоль одной стены",
    },
    {
      src: "/uploads/kitchens/catalog/pryamaya-kuhnya-studiya-belaya-generated-20260517.webp",
      alt: "Дополнительный пример белой прямой кухни для студии",
    },
    {
      src: "/uploads/kitchens/catalog/pryamaya-kuhnya-uzkaya-bezhevaya-generated-20260517.webp",
      alt: "Дополнительный пример бежевой прямой кухни для узкого помещения",
    },
    {
      src: "/uploads/kitchens/catalog/pryamaya-kuhnya-grafit-derevo-generated-20260517.webp",
      alt: "Дополнительный пример прямой кухни графит и дерево",
    },
  ],
};

const CATEGORY_IMAGE_KEYWORDS = [
  { test: /без ручек/i, key: "kuhni-bez-ruchek" },
  { test: /до потолка/i, key: "kuhni-do-potolka" },
  { test: /маленьк|небольш/i, key: "malenkie-kuhni" },
  { test: /остров/i, key: "kuhni-s-ostrovom" },
  { test: /п-образ/i, key: "p-obraznye-kuhni" },
  { test: /прям/i, key: "pryamye-kuhni" },
  { test: /углов/i, key: "uglovye-kuhni" },
  { test: /соврем/i, key: "sovremennaya-kuhnya-minsk" },
  { test: /студи/i, key: "kuhnya-dlya-studii-minsk" },
  { test: /эконом/i, key: "kuhnya-ekonom-minsk" },
];

export function resolveCatalogCategoryImage({
  slug,
  title,
  category,
  mainImage,
  images,
}: {
  slug: string;
  title: string;
  category?: string | null;
  mainImage?: string | null;
  images?: string[] | null;
}) {
  const databaseImage = mainImage || images?.[0] || "";
  const fallbackKey =
    CATEGORY_IMAGES[slug] ? slug : CATEGORY_IMAGE_KEYWORDS.find(({ test }) => test.test(`${title} ${category ?? ""}`))?.key;
  const fallback = fallbackKey ? CATEGORY_IMAGES[fallbackKey] : undefined;
  const rawSrc = databaseImage || fallback?.src || "";
  const databaseAlt = `${title}${/на заказ/i.test(title) ? "" : " на заказ"}${/минск/i.test(title) ? "" : " в Минске"}`;

  return {
    src: optimizedImageSrc(rawSrc) || rawSrc,
    alt: databaseImage ? databaseAlt : fallback?.alt || `${title} на заказ`,
  };
}

export function getCatalogCategoryGallery(slug: string) {
  return (CATEGORY_GALLERIES[slug] || []).map((image) => ({
    ...image,
    src: optimizedImageSrc(image.src) || image.src,
  }));
}
