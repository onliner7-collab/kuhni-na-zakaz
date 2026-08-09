import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { renderContent } from "@/lib/render-content";
import { cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";
import { TELEGRAM_LEADS_PRIVACY_TEXT } from "@/lib/legal/telegram-leads-privacy";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("privacy-policy");
  return {
    title: cleanSeoTitle(page?.seoTitle, "Политика конфиденциальности"),
    description: trimMetaDescription(
      page?.seoDescription,
      "Политика конфиденциальности: какие персональные данные собирает сайт, зачем они нужны, как хранятся и как запросить удаление данных.",
    ),
    alternates: { canonical: "/privacy-policy" },
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPage() {
  const page = await getStaticPage("privacy-policy");
  const title = page?.title || "Политика конфиденциальности";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/privacy-policy" },
  ]);
  const jsonLdPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: siteUrl("/privacy-policy"),
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
          {renderContent(`${content}${TELEGRAM_LEADS_PRIVACY_TEXT}`)}
        </div>
        </div>
      </div>
    </>
  );
}
