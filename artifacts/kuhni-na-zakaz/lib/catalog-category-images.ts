import { optimizedImageSrc } from "@/lib/image-optimization";

const CATEGORY_IMAGES: Record<string, { src: string; alt: string }> = {
  "kuhni-bez-ruchek": {
    src: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    alt: "Кухня без ручек на заказ в Минске",
  },
  "kuhnya-bez-ruchek-minsk": {
    src: "/uploads/seo-showcase/kuhnya-bez-ruchek-1.webp",
    alt: "Кухня без ручек на заказ в Минске",
  },
  "kuhni-do-potolka": {
    src: "/uploads/seo-showcase/kuhnya-do-potolka-1.webp",
    alt: "Кухня до потолка с дополнительным хранением",
  },
  "kuhnya-do-potolka-minsk": {
    src: "/uploads/seo-showcase/kuhnya-do-potolka-1.webp",
    alt: "Кухня до потолка с дополнительным хранением",
  },
  "malenkie-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
    alt: "Маленькая кухня на заказ для небольшой квартиры",
  },
  "malenkaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-malenkaya-funkcionalnaya-1.webp",
    alt: "Маленькая кухня на заказ для небольшой квартиры",
  },
  "kuhni-s-ostrovom": {
    src: "/uploads/seo-showcase/kuhnya-s-ostrovom-1.webp",
    alt: "Кухня с островом для просторной кухни-гостиной",
  },
  "kuhnya-s-ostrovom-minsk": {
    src: "/uploads/seo-showcase/kuhnya-s-ostrovom-1.webp",
    alt: "Кухня с островом для просторной кухни-гостиной",
  },
  "p-obraznye-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-p-obraznaya-premium-1.webp",
    alt: "П-образная кухня на заказ с большой рабочей зоной",
  },
  "p-obraznaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-p-obraznaya-premium-1.webp",
    alt: "П-образная кухня на заказ с большой рабочей зоной",
  },
  "pryamye-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Прямая кухня на заказ для небольшой квартиры",
  },
  "pryamaya-kuhnya-minsk": {
    src: "/uploads/seo-showcase/kuhnya-pryamaya-svetlaya-1.webp",
    alt: "Прямая кухня на заказ для небольшой квартиры",
  },
  "uglovye-kuhni": {
    src: "/uploads/seo-showcase/kuhnya-uglovaya-modern-minsk-1.webp",
    alt: "Угловая кухня на заказ в Минске",
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
