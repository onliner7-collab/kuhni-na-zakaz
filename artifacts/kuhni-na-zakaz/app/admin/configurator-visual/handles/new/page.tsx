import HandleForm from "@/components/admin/configurator/HandleForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewHandlePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Новая ручка</h1>
      <HandleForm />
    </div>
  );
}
