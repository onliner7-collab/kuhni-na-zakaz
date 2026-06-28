import type { Metadata } from "next";
import Link from "@/components/navigation/Link";
import { renderContent } from "@/lib/render-content";
import { ContactForm } from "@/components/sections/ContactForm";
import { buildOpenGraph, buildTwitterMetadata, cleanSeoTitle, trimMetaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, compactJsonLd, siteUrl } from "@/lib/schema-org";
import { getStaticPage } from "@/lib/static-page";

const FACTS = [
  { n: "BY", t: "частные заказы", d: "Работаем с клиентами по Беларуси" },
  { n: "1:1", t: "индивидуальные размеры", d: "Проектируем под конкретное помещение" },
  { n: "5 лет", t: "гарантия", d: "На фурнитуру Blum" },
  { n: "14 дней", t: "минимальный срок", d: "Для стандартных моделей" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPage("about");
  const title = cleanSeoTitle(page?.seoTitle, "О компании и производство кухонь");
  const description = trimMetaDescription(
    page?.seoDescription,
    "Производитель кухонь на заказ по Беларуси: индивидуальные размеры, договор, гарантийные условия и замер по заявке.",
  );
  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: buildOpenGraph("/about", title, description),
    twitter: buildTwitterMetadata(title, description),
  };
}

export default async function AboutPage() {
  const page = await getStaticPage("about");
  const title = page?.title || "О компании";
  const content = page?.content || "";
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: title, path: "/about" },
  ]);
  const jsonLdPage = compactJsonLd({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    url: siteUrl("/about"),
    description: page?.seoDescription,
    mainEntity: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
  });

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdPage]} />
      <div className="section-padding">
        <div className="container-site">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
            <span className="text-foreground">{title}</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold mb-10">{title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {FACTS.map((f) => (
              <div key={f.t} className="card-base p-5 text-center">
                <div className="font-serif text-3xl font-bold text-primary">{f.n}</div>
                <div className="font-medium text-sm mt-1">{f.t}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.d}</div>
              </div>
            ))}
          </div>

          {content && (
            <div className="max-w-3xl space-y-4 mb-16">
              {renderContent(content)}
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-8">Свяжитесь с нами</h2>
            <ContactForm source="about" />
          </div>
        </div>
      </div>
    </>
  );
}
