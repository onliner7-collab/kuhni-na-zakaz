import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StyleForm from "@/components/admin/StyleForm";

export const metadata = { title: "Редактировать стиль — Админ" };

interface Props { params: Promise<{ id: string }> }

export default async function EditStylePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const style = await prisma.stylePage.findUnique({ where: { id: Number(id) } });
  if (!style) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Редактировать: {style.title}</h1>
      <p className="text-gray-500 text-sm mb-8">/styles/{style.slug}</p>
      <div className="card-base p-6">
        <StyleForm initial={style as any} />
      </div>
    </div>
  );
}
