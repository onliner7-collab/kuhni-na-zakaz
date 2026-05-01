import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PortfolioCaseForm } from "@/components/admin/PortfolioCaseForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редактировать проект — Админ" };

interface Props { params: Promise<{ id: string }> }

export default async function EditPortfolioCasePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const portfolioCase = await prisma.portfolioCase.findUnique({ where: { id: Number(id) } });
  if (!portfolioCase) notFound();

  const data = {
    ...portfolioCase,
    seoTitle: portfolioCase.seoTitle ?? "",
    seoDescription: portfolioCase.seoDescription ?? "",
    seoKeywords: portfolioCase.seoKeywords ?? "",
    shortTitle: portfolioCase.shortTitle ?? "",
    cityKey: portfolioCase.cityKey ?? "",
    region: portfolioCase.region ?? "",
    district: portfolioCase.district ?? "",
    layout: portfolioCase.layout ?? "",
    kitchenType: portfolioCase.kitchenType ?? "",
    color: portfolioCase.color ?? "",
    completedAt: portfolioCase.completedAt ?? "",
    styleSlug: portfolioCase.styleSlug ?? "",
    materials: portfolioCase.materials ?? [],
    priceNote: portfolioCase.priceNote ?? "",
    size: portfolioCase.size ?? "",
    facades: portfolioCase.facades ?? "",
    countertop: portfolioCase.countertop ?? "",
    fittings: portfolioCase.fittings ?? "",
    workDuration: portfolioCase.workDuration ?? "",
    constraints: portfolioCase.constraints ?? "",
    result: portfolioCase.result ?? "",
    features: portfolioCase.features ?? [],
    relatedLocationSlugs: portfolioCase.relatedLocationSlugs ?? [],
    task: portfolioCase.task ?? "",
    solution: portfolioCase.solution ?? "",
    mainImage: portfolioCase.mainImage ?? "",
    imageAlts: portfolioCase.imageAlts ?? [],
    imageCaptions: portfolioCase.imageCaptions ?? [],
    alt: portfolioCase.alt ?? "",
    material: portfolioCase.material ?? "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Редактировать проект</h1>
        <p className="text-muted-foreground mt-1">{portfolioCase.title}</p>
      </div>
      <div className="card-base p-6">
        <PortfolioCaseForm portfolioCase={data} />
      </div>
    </div>
  );
}
