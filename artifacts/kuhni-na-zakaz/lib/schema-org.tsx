import { getSiteUrl } from "@/lib/site-url";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type JsonLdObject = { [key: string]: JsonLdValue };

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] | null | undefined }) {
  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  const jsonLdData = Array.isArray(data) ? dedupeFaqPageJsonLd(data) : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

function dedupeFaqPageJsonLd(items: JsonLdObject[]) {
  let hasFaqPage = false;

  return items.filter((item) => {
    if (!isFaqPageJsonLd(item)) return true;
    if (hasFaqPage) return false;

    hasFaqPage = true;
    return true;
  });
}

function isFaqPageJsonLd(item: JsonLdObject) {
  return item["@type"] === "FAQPage";
}

export function siteUrl(path = "") {
  const base = getSiteUrl();
  if (!path || path === "#") return base;

  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);
      url.protocol = "https:";
      url.hostname = url.hostname.replace(/^www\./i, "");
      url.pathname = normalizePathname(url.pathname);
      url.search = "";
      url.hash = "";

      if (url.origin === base) return url.pathname === "/" ? `${base}/` : url.toString().replace(/\/$/, "");

      return `${base}${normalizePathname(url.pathname)}`;
    } catch {
      return base;
    }
  }

  return `${base}${normalizePathname(path)}`;
}

function normalizePathname(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath.replace(/\/{2,}/g, "/");
}

export function compactJsonLd<T extends JsonLdObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === null || item === undefined || item === "") return false;
      if (Array.isArray(item) && item.length === 0) return false;
      return true;
    }),
  ) as T;
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: {
        "@id": siteUrl(item.path),
      },
    })),
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>): JsonLdObject | null {
  const mainEntity = items
    .filter((item) => item.question.trim() && item.answer.trim())
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (mainEntity.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function offerJsonLd(priceFrom: number | null | undefined, url: string): JsonLdObject | undefined {
  if (!priceFrom || priceFrom <= 0) return undefined;

  return {
    "@type": "Offer",
    url: siteUrl(url),
    priceCurrency: "BYN",
    price: priceFrom,
    availability: "https://schema.org/InStock",
  };
}
