import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /kapi/configurator-visual/catalog
// Возвращает все активные каталоги одним запросом
export async function GET() {
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
        prisma.kitchenConfiguratorSettings.findUnique({ where: { id: 1 } }),
      ]);

    return NextResponse.json({ modules, templates, facades, countertops, skinals, handles, mechanisms, appliances, settings });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
