import MechanismForm from "@/components/admin/configurator/MechanismForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewMechanismPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Новый механизм</h1>
      <MechanismForm />
    </div>
  );
}
