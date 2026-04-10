import SkinalForm from "@/components/admin/configurator/SkinalForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewSkinalPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Новый скинал</h1>
      <SkinalForm />
    </div>
  );
}
