import CountertopForm from "@/components/admin/configurator/CountertopForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewCountertopPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Новая столешница</h1>
      <CountertopForm />
    </div>
  );
}
