import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { KitchenConfiguratorPage } from "@/components/configurator/KitchenConfiguratorPage";
import { JsonLd, breadcrumbJsonLd, siteUrl } from "@/lib/schema-org";
import type { CatalogTemplate, PlacedModule } from "@/lib/kitchen-configurator";
import {
  fallbackAppliances,
  fallbackConfiguratorSettings,
  fallbackCountertops,
  fallbackFacades,
  fallbackHandles,
  fallbackModules,
  fallbackSkinals,
  fallbackTemplates,
} from "@/lib/kitchen-configurator/fallback-catalog";

export const metadata: Metadata = {
  title: "Визуальный конфигуратор кухни",
  description:
    "Задайте размеры помещения, выберите планировку, модули, фасады и увидьте кухню в 2D и 3D. Сохраните проект и поделитесь с дизайнером.",
  alternates: { canonical: "/kitchen-configurator" },
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
    const normalizedTemplates = templates.map((template) => ({
        ...template,
        modulesConfig: Array.isArray(template.modulesConfig)
          ? (template.modulesConfig as unknown as PlacedModule[])
          : [],
        minWidthCm: template.minWidthCm ?? undefined,
        maxWidthCm: template.maxWidthCm ?? undefined,
      }));
    return {
      modules: modules.length ? modules : fallbackModules,
      templates: withRequiredTemplates(normalizedTemplates),
      facades: facades.length ? facades : fallbackFacades,
      countertops: countertops.length ? countertops : fallbackCountertops,
      skinals: skinals.length ? skinals : fallbackSkinals,
      handles: handles.length ? handles : fallbackHandles,
      mechanisms,
      appliances: appliances.length ? appliances.map((appliance) => ({
        ...appliance,
        widthCm: appliance.widthCm ?? undefined,
        heightCm: appliance.heightCm ?? undefined,
        depthCm: appliance.depthCm ?? undefined,
      })) : fallbackAppliances,
      settings: settings ?? fallbackConfiguratorSettings,
    };
  } catch {
    return {
      modules: fallbackModules,
      templates: fallbackTemplates,
      facades: fallbackFacades,
      countertops: fallbackCountertops,
      skinals: fallbackSkinals,
      handles: fallbackHandles,
      mechanisms: [],
      appliances: fallbackAppliances,
      settings: fallbackConfiguratorSettings,
    };
  }
}

function withRequiredTemplates(templates: CatalogTemplate[]) {
  if (!templates.length) return fallbackTemplates;

  const requiredLayouts = new Set(["STRAIGHT", "CORNER", "U_SHAPE", "ISLAND"]);
  const presentLayouts = new Set(templates.map((template) => template.layoutType));
  const missingFallbacks = fallbackTemplates.filter(
    (template) => requiredLayouts.has(template.layoutType) && !presentLayouts.has(template.layoutType),
  );

  return [...templates, ...missingFallbacks];
}

export default async function Page() {
  const catalog = await getCatalog();
  const jsonLdBreadcrumb = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Конфигуратор кухни", path: "/kitchen-configurator" },
  ]);
  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Визуальный конфигуратор кухни",
    url: siteUrl("/kitchen-configurator"),
    provider: { "@type": "Organization", name: "КухниBY", url: siteUrl() },
    serviceType: "Kitchen design configurator",
    offers: { "@type": "Offer", price: 0, priceCurrency: "BYN", url: siteUrl("/kitchen-configurator") },
  };

  return (
    <>
      <JsonLd data={[jsonLdBreadcrumb, jsonLdService]} />
      <KitchenConfiguratorPage catalog={catalog} />
    </>
  );
}
