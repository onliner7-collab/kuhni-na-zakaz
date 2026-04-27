import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Square, Clock, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/sections/ContactForm";
import { PortfolioFilters } from "@/components/portfolio/PortfolioFilters";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Портфолио кухонь на заказ",
  description: "Готовые проекты кухонь на заказ в Минске и всей Беларуси. Фото, стоимость, сроки, истории клиентов. Угловые, П-образные, кухни с островом.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const cases = await prisma.portfolioCase.findMany({
    where: {
      published: true,
      slug: { not: "" },
      title: { not: "" },
    },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Портфолио", path: "/portfolio" },
  ]);
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Портфолио кухонь",
    url: siteUrl("/portfolio"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cases.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: siteUrl(`/portfolio/${item.slug}`),
      })),
    },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdCollection]} />
      <div className="section-padding">
        <div className="container-site">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">Портфолио</span>
        </nav>

        <div className="max-w-2xl mb-10">
          <h1 className="font-serif text-4xl font-bold mb-4">Наши работы</h1>
          <p className="text-muted-foreground text-lg">
            {cases.length} реализованных проектов кухонь по всей Беларуси. Фото, разбор задачи и решения, стоимость и сроки.
          </p>
        </div>

        <PortfolioFilters cases={cases} />

        <div className="max-w-xl mx-auto mt-16">
          <h2 className="font-serif text-2xl font-bold text-center mb-2">Хотите похожий проект?</h2>
          <p className="text-center text-muted-foreground mb-6">Расскажите о вашей кухне — пришлём смету в течение дня</p>
          <div className="card-base p-6">
            <ContactForm source="portfolio-index" />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
