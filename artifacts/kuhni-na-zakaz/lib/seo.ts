import type { Metadata } from "next";

export const SITE_NAME = "КухниBY";
export const SITE_ALTERNATE_NAMES = [
  "KuhniBY",
  "Кухни Бай",
  "Кухни Минск BY",
  "kuhni.minsk.by",
];
export const CANONICAL_SITE_URL = "https://kuhni.minsk.by";
export const DEFAULT_SOCIAL_IMAGE = {
  url: "/opengraph.jpg",
  width: 1200,
  height: 630,
  alt: "КухниBY — кухни на заказ в Минске и Беларуси",
};

type SocialImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function canonicalSiteUrl(path = "") {
  if (!path) return CANONICAL_SITE_URL;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") return `${CANONICAL_SITE_URL}/`;

  return `${CANONICAL_SITE_URL}${normalizedPath.replace(/\/+$/g, "")}`;
}

export function cleanSeoTitle(title: string | null | undefined, fallback: string) {
  const value = title?.trim() || fallback;

  return value
    .replace(new RegExp(`\\s*[|—-]\\s*${SITE_NAME}\\b`, "gi"), "")
    .replace(new RegExp(`\\b${SITE_NAME}\\s*[|—-]\\s*`, "gi"), "")
    .replace(new RegExp(`\\s+${SITE_NAME}\\s+`, "gi"), " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function trimMetaDescription(description: string | null | undefined, fallback: string) {
  const provided = description?.trim();
  const value = provided && provided.length >= 70 ? provided : fallback;

  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}...` : value;
}

export function buildOpenGraph(
  path: string,
  title: string,
  description: string,
  options: {
    type?: "website" | "article";
    images?: SocialImage[];
  } = {},
): Metadata["openGraph"] {
  return {
    type: options.type ?? "website",
    locale: "ru_BY",
    url: canonicalSiteUrl(path),
    siteName: SITE_NAME,
    title,
    description,
    images: options.images ?? [DEFAULT_SOCIAL_IMAGE],
  };
}

export function buildTwitterMetadata(
  title: string,
  description: string,
  image: string = DEFAULT_SOCIAL_IMAGE.url,
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  };
}
