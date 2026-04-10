import { prisma } from "@/lib/db";
import ModuleForm from "@/components/admin/configurator/ModuleForm";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

interface P { params: Promise<{ id: string }> }

export default async function EditModulePage({ params }: P) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const item = await prisma.kitchenModule.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Редактировать модуль: {item.name}</h1>
      <ModuleForm initial={item as Record<string, unknown>} id={item.id} />
    </div>
  );
}
