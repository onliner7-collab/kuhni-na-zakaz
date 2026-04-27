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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function siteUrl(path = "") {
  if (!path) return getSiteUrl();
  if (/^https?:\/\//i.test(path)) return path;

  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
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
      item: siteUrl(item.path),
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
