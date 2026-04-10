import CompatibilityRuleForm from "@/components/admin/configurator/CompatibilityRuleForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewCompatibilityRulePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Новое правило совместимости</h1>
      <CompatibilityRuleForm />
    </div>
  );
}
