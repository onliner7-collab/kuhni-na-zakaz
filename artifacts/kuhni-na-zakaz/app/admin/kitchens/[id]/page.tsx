import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { KitchenForm } from "@/components/admin/KitchenForm";

export const metadata: Metadata = { title: "Редактировать кухню" };

interface Props { params: Promise<{ id: string }> }

export default async function EditKitchenPage({ params }: Props) {
  const { id } = await params;
  const kitchen = await prisma.kitchen.findUnique({ where: { id: parseInt(id) } }).catch(() => null);
  if (!kitchen) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Редактировать кухню</h1>
      <KitchenForm kitchen={JSON.parse(JSON.stringify(kitchen))} />
    </div>
  );
}
