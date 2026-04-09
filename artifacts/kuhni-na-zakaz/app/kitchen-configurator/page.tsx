import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { KitchenConfiguratorPage } from "@/components/configurator/KitchenConfiguratorPage";

export const metadata: Metadata = {
  title: "Визуальный конфигуратор кухни — спроектируйте онлайн",
  description:
    "Задайте размеры помещения, выберите планировку, модули, фасады и увидьте кухню в 2D и 3D. Сохраните проект и поделитесь с дизайнером.",
  openGraph: {
    title: "Визуальный конфигуратор кухни",
    description: "Спроектируйте кухню мечты онлайн: 2D/3D, расчёт стоимости, сохранение и шаринг.",
  },
};

async function getCatalog() {
  try {
    const [modules, templates, facades, countertops, skinals, handles, mechanisms, appliances, settings] =
      await Promise.all([
        prisma.kitchenModule.findMany({ where: { isEnabled: true }, orderBy: [{ moduleType: "asc" }, { sortOrder: "asc" }] }),
        prisma.kitchenTemplate.findMany({ where: { isEnabled: true, isPublished: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenFacade.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenCountertop.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenSkinal.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenHandle.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenMechanism.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenAppliance.findMany({ where: { isEnabled: true }, orderBy: { sortOrder: "asc" } }),
        prisma.kitchenConfiguratorSettings.findUnique({ where: { id: 1 } }).catch(() => null),
      ]);
    return { modules, templates, facades, countertops, skinals, handles, mechanisms, appliances, settings };
  } catch {
    return { modules: [], templates: [], facades: [], countertops: [], skinals: [], handles: [], mechanisms: [], appliances: [], settings: null };
  }
}

export default async function Page() {
  const catalog = await getCatalog();
  return <KitchenConfiguratorPage catalog={catalog} />;
}
