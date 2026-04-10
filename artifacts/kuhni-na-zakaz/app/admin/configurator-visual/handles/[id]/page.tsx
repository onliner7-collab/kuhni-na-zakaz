import { prisma } from "@/lib/db";
import HandleForm from "@/components/admin/configurator/HandleForm";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

interface P { params: Promise<{ id: string }> }

export default async function EditHandlePage({ params }: P) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const item = await prisma.kitchenHandle.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Редактировать ручку: {item.name}</h1>
      <HandleForm initial={item as Record<string, unknown>} id={item.id} />
    </div>
  );
}
