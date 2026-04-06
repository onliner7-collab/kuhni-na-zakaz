import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { prisma } from "@/lib/db";
import { renderContent } from "@/lib/render-content";

const WARRANTY_CARDS = [
  { years: "5 лет", label: "на фурнитуру Blum" },
  { years: "2 года", label: "на корпус и фасады" },
  { years: "1 год", label: "на монтажные работы" },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.staticPage.findUnique({ where: { slug: "warranty" } });
  return {
    title: page?.seoTitle || "Гарантия на кухни — 5 лет на фурнитуру",
    description: page?.seoDescription || "Гарантия: 5 лет на фурнитуру Blum, 2 года на корпус, 1 год на монтаж.",
    alternates: { canonical: "/warranty" },
  };
}

export default async function WarrantyPage() {
  const page = await prisma.staticPage.findUnique({ where: { slug: "warranty" } });
  const title = page?.title || "Гарантия";
  const content = page?.content || "";

  return (
    <div className="section-padding">
      <div className="container-site max-w-4xl">
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Главная</Link><span>/</span>
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold mb-8">{title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {WARRANTY_CARDS.map((g) => (
            <div key={g.label} className="card-base p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-serif text-3xl font-bold text-primary">{g.years}</div>
              <div className="text-sm text-muted-foreground mt-1">{g.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {renderContent(content)}
        </div>
      </div>
    </div>
  );
}
