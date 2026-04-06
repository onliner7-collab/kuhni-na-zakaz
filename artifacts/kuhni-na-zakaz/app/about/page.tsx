import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { renderContent } from "@/lib/render-content";
import { ContactForm } from "@/components/sections/ContactForm";

const FACTS = [
  { n: "10+", t: "лет на рынке", d: "Работаем с 2015 года" },
  { n: "1000+", t: "кухонь изготовлено", d: "За всё время работы" },
  { n: "5 лет", t: "гарантия", d: "На фурнитуру Blum" },
  { n: "14 дней", t: "минимальный срок", d: "Для стандартных моделей" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "КухниBY",
  foundingDate: "2015",
  description: "Производитель кухонь на заказ по всей Беларуси",
  telephone: "+375291234567",
  email: "info@kuhniby.by",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Минск",
    addressCountry: "BY",
    streetAddress: "ул. Притыцкого, 100",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.staticPage.findUnique({ where: { slug: "about" } });
  return {
    title: page?.seoTitle || "О компании КухниBY — кухни на заказ по Беларуси",
    description: page?.seoDescription || "КухниBY — производитель кухонь на заказ по всей Беларуси.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const page = await prisma.staticPage.findUnique({ where: { slug: "about" } });
  const title = page?.title || "О компании";
  const content = page?.content || "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
