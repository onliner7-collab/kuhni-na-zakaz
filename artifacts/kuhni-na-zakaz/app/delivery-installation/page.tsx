import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { renderContent } from "@/lib/render-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.staticPage.findUnique({ where: { slug: "delivery-installation" } });
  return {
    title: page?.seoTitle || "Доставка и монтаж кухни — КухниBY",
    description: page?.seoDescription || "Доставка и монтаж кухни под ключ по Беларуси.",
    alternates: { canonical: "/delivery-installation" },
  };
}

export default async function DeliveryPage() {
  const page = await prisma.staticPage.findUnique({ where: { slug: "delivery-installation" } });
  const title = page?.title || "Доставка и монтаж";
  const content = page?.content || "";

  return (
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
  );
}
