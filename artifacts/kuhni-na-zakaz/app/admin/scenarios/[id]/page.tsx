import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ScenarioForm } from "@/components/admin/ScenarioForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const s = await prisma.scenarioPage.findUnique({ where: { id: parseInt(id) } });
  return { title: s ? `${s.title} — Редактирование` : "Сценарий — Редактирование" };
}

export default async function EditScenarioPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const scenario = await prisma.scenarioPage.findUnique({ where: { id: parseInt(id) } });
  if (!scenario) notFound();

  const initial = {
    ...scenario,
    features: Array.isArray(scenario.features) ? scenario.features as any[] : [],
  };

  return <ScenarioForm initial={initial} />;
}
