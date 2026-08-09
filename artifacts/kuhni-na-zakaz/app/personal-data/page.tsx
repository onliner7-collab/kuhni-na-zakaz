import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { renderContent } from "@/lib/render-content";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";
import { TELEGRAM_LEADS_CONSENT_TEXT } from "@/lib/legal/telegram-leads-privacy";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("personal-data");
  return {
    title: cleanSeoTitle(page?.seoTitle, "Согласие на обработку данных"),
    description: trimMetaDescription(
      page?.seoDescription,
      "Согласие на обработку персональных данных: цели обработки заявок, права пользователя и контакты для отзыва согласия.",
    ),
    alternates: { canonical: "/personal-data" },
    robots: { index: false, follow: false },
  };
}

export default async function PersonalDataPage() {
  const page = await getStaticPage("personal-data");
  const title = page?.title || "Согласие на обработку персональных данных";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/personal-data" },
  ]);
  const jsonLdPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: siteUrl("/personal-data"),
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
        <div className="space-y-4 break-words [overflow-wrap:anywhere]">
          {renderContent(`${content}${TELEGRAM_LEADS_CONSENT_TEXT}`)}
        </div>
        </div>
      </div>
    </>
  );
}
