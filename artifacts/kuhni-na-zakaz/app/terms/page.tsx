import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { renderContent } from "@/lib/render-content";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("terms");
  return {
    title: cleanSeoTitle(page?.seoTitle, "Условия использования сайта"),
    description: trimMetaDescription(
      page?.seoDescription,
      "Условия использования сайта: правила работы с материалами, ориентировочные цены и ограничения ответственности при использовании информации.",
    ),
    alternates: { canonical: "/terms" },
    robots: { index: false, follow: false },
  };
}

export default async function TermsPage() {
  const page = await getStaticPage("terms");
  const title = page?.title || "Условия использования";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/terms" },
  ]);
  const jsonLdPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: siteUrl("/terms"),
    description: page?.seoDescription,
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdPage]} />
      <div className="section-padding">
        <div className="container-site max-w-3xl">
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
