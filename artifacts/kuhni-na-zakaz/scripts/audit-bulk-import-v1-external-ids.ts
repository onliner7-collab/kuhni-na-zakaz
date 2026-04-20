import { prisma } from "@/lib/db";

type AuditRow = {
  entity: string;
  total: number;
  missingExternalId: number;
  sampleSlugs: string[];
};

async function collectAuditRows(): Promise<AuditRow[]> {
  const entities = await Promise.all([
    prisma.kitchen.findMany({
      where: { externalId: null },
      select: { slug: true },
      orderBy: { id: "asc" },
    }),
    prisma.stylePage.findMany({
      where: { externalId: null },
      select: { slug: true },
      orderBy: { id: "asc" },
    }),
    prisma.materialPage.findMany({
      where: { externalId: null },
      select: { slug: true },
      orderBy: { id: "asc" },
    }),
    prisma.scenarioPage.findMany({
      where: { externalId: null },
      select: { slug: true },
      orderBy: { id: "asc" },
    }),
    prisma.portfolioCase.findMany({
      where: { externalId: null },
      select: { slug: true },
      orderBy: { id: "asc" },
    }),
    prisma.locationPage.findMany({
      where: { externalId: null },
      select: { slug: true },
      orderBy: { id: "asc" },
    }),
    prisma.kitchen.count(),
    prisma.stylePage.count(),
    prisma.materialPage.count(),
    prisma.scenarioPage.count(),
    prisma.portfolioCase.count(),
    prisma.locationPage.count(),
  ]);

  const [kitchens, styles, materials, scenarios, portfolio, locations] = entities;
  const [kitchensTotal, stylesTotal, materialsTotal, scenariosTotal, portfolioTotal, locationsTotal] =
    entities.slice(6) as number[];

  return [
    {
      entity: "Kitchen",
      total: kitchensTotal,
      missingExternalId: kitchens.length,
      sampleSlugs: kitchens.slice(0, 5).map((row) => row.slug),
    },
    {
      entity: "StylePage",
      total: stylesTotal,
      missingExternalId: styles.length,
      sampleSlugs: styles.slice(0, 5).map((row) => row.slug),
    },
    {
      entity: "MaterialPage",
      total: materialsTotal,
      missingExternalId: materials.length,
      sampleSlugs: materials.slice(0, 5).map((row) => row.slug),
    },
    {
      entity: "ScenarioPage",
      total: scenariosTotal,
      missingExternalId: scenarios.length,
      sampleSlugs: scenarios.slice(0, 5).map((row) => row.slug),
    },
    {
      entity: "PortfolioCase",
      total: portfolioTotal,
      missingExternalId: portfolio.length,
      sampleSlugs: portfolio.slice(0, 5).map((row) => row.slug),
    },
    {
      entity: "LocationPage",
      total: locationsTotal,
      missingExternalId: locations.length,
      sampleSlugs: locations.slice(0, 5).map((row) => row.slug),
    },
  ];
}

async function main() {
  const rows = await collectAuditRows();
  console.table(
    rows.map((row) => ({
      entity: row.entity,
      total: row.total,
      missingExternalId: row.missingExternalId,
      sampleSlugs: row.sampleSlugs.join(", "),
    }))
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
