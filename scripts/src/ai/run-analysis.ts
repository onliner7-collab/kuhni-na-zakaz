import path from "node:path";
import { scanProjectStructure } from "./project-structure-scanner.js";
import { mapPrismaEntities } from "./prisma-entity-mapper.js";
import { scanSeoSurfaces } from "./seo-surface-scanner.js";
import { scanAdminSurfaces } from "./admin-surface-scanner.js";
import { buildRiskSurfaceReport } from "./risk-surface-builder.js";
import { getAiReportsDir } from "./shared/paths.js";
import { writeJsonReport } from "./shared/fs-utils.js";

function main(): void {
  const reportsDir = getAiReportsDir();

  const projectStructure = scanProjectStructure();
  const prismaEntityMap = mapPrismaEntities();
  const seoSurfaceMap = scanSeoSurfaces();
  const adminSurfaceMap = scanAdminSurfaces();
  const riskSurfaces = buildRiskSurfaceReport(adminSurfaceMap);

  writeJsonReport(path.join(reportsDir, "project-structure.json"), projectStructure);
  writeJsonReport(path.join(reportsDir, "prisma-entity-map.json"), prismaEntityMap);
  writeJsonReport(path.join(reportsDir, "seo-surface-map.json"), seoSurfaceMap);
  writeJsonReport(path.join(reportsDir, "admin-surface-map.json"), adminSurfaceMap);
  writeJsonReport(path.join(reportsDir, "risk-surfaces.json"), riskSurfaces);

  console.log("AI analysis reports generated:");
  console.log("- ai/reports/project-structure.json");
  console.log("- ai/reports/prisma-entity-map.json");
  console.log("- ai/reports/seo-surface-map.json");
  console.log("- ai/reports/admin-surface-map.json");
  console.log("- ai/reports/risk-surfaces.json");
}

main();
