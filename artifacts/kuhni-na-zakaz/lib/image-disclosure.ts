const GENERATED_IMAGE_PREFIXES = [
  "/images/mdf-enamel-20261017/",
  "/images/ldsp-20261017/",
  "/images/mdf-facades-20261015/",
  "/images/materials-hub-20261014/",
  "/images/ceiling-kitchens/20261013/",
  "/uploads/seo-showcase/",
  "/images/materials-gallery-v2/furnitura/",
  "/images/blog/",
  "/uploads/kitchens/catalog/",
  "/uploads/locations/",
  "/uploads/portfolio/generated-",
  "/uploads/portfolio/generated-minsk/",
] as const;

const GENERATED_IMAGE_ALIASES = new Set([
  "/uploads/portfolio/portfolio-brest-1.jpg",
  "/uploads/portfolio/portfolio-brest-1.webp",
  "/uploads/portfolio/portfolio-brest-1.avif",
  "/images/hero.png",
  "/images/hero.webp",
  "/images/hero.avif",
]);

export type ImageDisclosureKind = "generated" | "portfolio" | "unknown";

export interface ImageDisclosure {
  kind: ImageDisclosureKind;
  label: string;
  caption: string;
  altPrefix: string;
}

export function getImageDisclosure(src: string | null | undefined): ImageDisclosure {
  if (!src) {
    return {
      kind: "unknown",
      label: "Изображение",
      caption: "Изображение",
      altPrefix: "",
    };
  }

  const cleanSrc = src.split("?")[0] ?? src;
  if (cleanSrc.startsWith("/images/mdf-enamel-20261017/")) {
    return { kind: "generated", label: "ИИ-иллюстрация", caption: "Визуальная идея, созданная с помощью ИИ", altPrefix: "ИИ-иллюстрация: " };
  }
  const isGenerated =
    GENERATED_IMAGE_PREFIXES.some((prefix) => cleanSrc.startsWith(prefix)) ||
    cleanSrc.includes("-generated-") ||
    cleanSrc.includes("/generated/") ||
    GENERATED_IMAGE_ALIASES.has(cleanSrc);

  if (isGenerated) {
    return {
      kind: "generated",
      label: "3D-визуализация",
      caption: "3D-визуализация, пример дизайна",
      altPrefix: "3D-визуализация: ",
    };
  }

  if (
    cleanSrc.startsWith("/uploads/portfolio/") ||
    cleanSrc.startsWith("/uploads/kitchens/portfolio/")
  ) {
    return {
      kind: "portfolio",
      label: "Фото из портфолио",
      caption: "Фото из портфолио",
      altPrefix: "",
    };
  }

  return {
    kind: "unknown",
    label: "Пример решения",
    caption: "Пример решения",
    altPrefix: "",
  };
}

export function buildImageAlt(src: string | null | undefined, fallback: string) {
  const disclosure = getImageDisclosure(src);
  const text = fallback.trim() || "кухня на заказ";

  return disclosure.altPrefix && !text.toLowerCase().startsWith(disclosure.altPrefix.toLowerCase())
    ? `${disclosure.altPrefix}${text}`
    : text;
}
