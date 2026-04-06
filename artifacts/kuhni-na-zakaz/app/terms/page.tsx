import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { renderContent } from "@/lib/render-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.staticPage.findUnique({ where: { slug: "terms" } });
  return {
    title: page?.seoTitle || "Условия использования — КухниBY",
    description: page?.seoDescription || "Условия использования сайта КухниBY.",
    alternates: { canonical: "/terms" },
  };
}

export default async function TermsPage() {
  const page = await prisma.staticPage.findUnique({ where: { slug: "terms" } });
  const title = page?.title || "Условия использования";
  const content = page?.content || "";

  return (
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
  );
}
