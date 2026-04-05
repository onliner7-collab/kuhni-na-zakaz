import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import MaterialForm from "@/components/admin/MaterialForm";

export const metadata = { title: "Редактировать материал — Админ" };

interface Props { params: Promise<{ id: string }> }

export default async function EditMaterialPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const material = await prisma.materialPage.findUnique({ where: { id: Number(id) } });
  if (!material) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Редактировать: {material.title}</h1>
      <p className="text-gray-500 text-sm mb-8">/materials/{material.slug}</p>
      <div className="card-base p-6">
        <MaterialForm initial={material as any} />
      </div>
    </div>
  );
}
