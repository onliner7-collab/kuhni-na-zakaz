import ApplianceForm from "@/components/admin/configurator/ApplianceForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewAppliancePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Новая техника</h1>
      <ApplianceForm />
    </div>
  );
}
