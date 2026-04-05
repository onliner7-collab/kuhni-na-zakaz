import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PortfolioCaseForm } from "@/components/admin/PortfolioCaseForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редактировать проект — Админ" };

export default async function EditPortfolioCasePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const portfolioCase = await prisma.portfolioCase.findUnique({ where: { id: parseInt(id) } });
  if (!portfolioCase) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Редактировать проект</h1>
        <p className="text-muted-foreground mt-1">{portfolioCase.title}</p>
      </div>
      <PortfolioCaseForm portfolioCase={portfolioCase} />
    </div>
  );
}
