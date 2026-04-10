import { prisma } from "@/lib/db";
import TemplateForm from "@/components/admin/configurator/TemplateForm";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

interface P { params: Promise<{ id: string }> }

export default async function EditTemplatePage({ params }: P) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const item = await prisma.kitchenTemplate.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Редактировать шаблон: {item.name}</h1>
      <TemplateForm initial={item as Record<string, unknown>} id={item.id} />
    </div>
  );
}
