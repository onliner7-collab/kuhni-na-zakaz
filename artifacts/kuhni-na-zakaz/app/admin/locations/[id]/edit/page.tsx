import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import LocationForm from "@/components/admin/LocationForm";

export const metadata = { title: "Редактировать страницу города — Админ" };

interface Props { params: Promise<{ id: string }> }

export default async function EditLocationPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const loc = await prisma.locationPage.findUnique({ where: { id: parseInt(id) } });
  if (!loc) notFound();

  const initial = {
    ...loc,
    faq: (loc.faq as Array<{ q: string; a: string }>) ?? [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Редактировать: {loc.city}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Страница по адресу{" "}
          <a href={`/locations/${loc.slug}`} target="_blank" className="text-primary underline underline-offset-2">
            /locations/{loc.slug}
          </a>
        </p>
      </div>
      <LocationForm initial={initial} isEdit />
    </div>
  );
}
