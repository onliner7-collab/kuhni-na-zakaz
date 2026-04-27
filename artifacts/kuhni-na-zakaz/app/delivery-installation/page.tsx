import type { Metadata } from "next";
import Link from "next/link";
import { renderContent } from "@/lib/render-content";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, offerJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("delivery-installation");
  return {
    title: cleanSeoTitle(page?.seoTitle, "Доставка и монтаж кухни"),
    description: trimMetaDescription(
      page?.seoDescription,
      "Доставка и монтаж кухни под ключ по Беларуси: привозим гарнитур, собираем, устанавливаем столешницу, регулируем фурнитуру и убираем упаковку.",
    ),
    alternates: { canonical: "/delivery-installation" },
  };
}

export default async function DeliveryPage() {
  const page = await getStaticPage("delivery-installation");
  const title = page?.title || "Доставка и монтаж";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/delivery-installation" },
  ]);
  const jsonLdService = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: page?.seoDescription,
    url: siteUrl("/delivery-installation"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    areaServed: { "@type": "Country", name: "Belarus" },
    offers: offerJsonLd(200, "/delivery-installation"),
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService]} />
      <div className="section-padding">
        <div className="container-site max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-8">{title}</h1>
        <div className="space-y-4">
          {renderContent(content)}
        </div>
        </div>
      </div>
    </>
  );
}
