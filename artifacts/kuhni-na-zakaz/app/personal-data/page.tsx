import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { renderContent } from "@/lib/render-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.staticPage.findUnique({ where: { slug: "personal-data" } });
  return {
    title: page?.seoTitle || "Согласие на обработку персональных данных — КухниBY",
    description: page?.seoDescription || "Согласие на обработку персональных данных на сайте КухниBY.",
    alternates: { canonical: "/personal-data" },
  };
}

export default async function PersonalDataPage() {
  const page = await prisma.staticPage.findUnique({ where: { slug: "personal-data" } });
  const title = page?.title || "Согласие на обработку персональных данных";
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
