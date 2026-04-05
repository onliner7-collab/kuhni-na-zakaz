import { requireAdmin } from "@/lib/auth";
import { ScenarioForm } from "@/components/admin/ScenarioForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Новый сценарий — Админ" };

export default async function NewScenarioPage() {
  await requireAdmin();
  return <ScenarioForm />;
}
