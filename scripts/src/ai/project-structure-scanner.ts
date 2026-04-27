import fs from "node:fs";
import path from "node:path";
import { getAppDir, getAppRoot, getPrismaSchemaPath, getProjectRoot } from "./shared/paths.js";
import { toProjectRelative, walkFiles } from "./shared/fs-utils.js";
import type { ProjectStructureReport } from "./shared/types.js";

export function scanProjectStructure(): ProjectStructureReport {
  const projectRoot = getProjectRoot();
  const appRoot = getAppRoot();
  const appDir = getAppDir();
  const prismaSchemaPath = getPrismaSchemaPath();
  const allFiles = walkFiles(projectRoot);

  const keyDirectories = [
    "artifacts/kuhni-na-zakaz",
    "artifacts/kuhni-na-zakaz/app",
    "artifacts/kuhni-na-zakaz/components/admin",
    "artifacts/kuhni-na-zakaz/lib",
    "artifacts/kuhni-na-zakaz/prisma",
    "project-docs",
    "ai",
  ].filter((dir) => fs.existsSync(path.join(projectRoot, dir)));

  const keyFiles = [
    "artifacts/kuhni-na-zakaz/prisma/schema.prisma",
    "artifacts/kuhni-na-zakaz/lib/auth.ts",
    "artifacts/kuhni-na-zakaz/middleware.ts",
    "artifacts/kuhni-na-zakaz/app/layout.tsx",
    "artifacts/kuhni-na-zakaz/app/robots.ts",
    "artifacts/kuhni-na-zakaz/app/sitemap.ts",
  ].filter((file) => fs.existsSync(path.join(projectRoot, file)));

  const adminDirectories = [
    "artifacts/kuhni-na-zakaz/app/admin",
    "artifacts/kuhni-na-zakaz/app/kapi/admin",
    "artifacts/kuhni-na-zakaz/components/admin",
  ].filter((dir) => fs.existsSync(path.join(projectRoot, dir)));

  const adminRouteFiles = allFiles
    .filter((file) => file.startsWith(path.join(appDir, "kapi", "admin")))
    .map((file) => toProjectRelative(projectRoot, file))
    .sort();

  const metadataFiles = allFiles
    .filter((file) => {
      const rel = toProjectRelative(projectRoot, file);
      return (
        rel === "artifacts/kuhni-na-zakaz/app/layout.tsx" ||
        rel === "artifacts/kuhni-na-zakaz/app/robots.ts" ||
        rel === "artifacts/kuhni-na-zakaz/app/sitemap.ts"
      );
    })
    .map((file) => toProjectRelative(projectRoot, file))
    .sort();

  const routeLevelMetadataFiles = allFiles
    .filter((file) => file.startsWith(appDir))
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .filter((file) => {
      const content = fs.readFileSync(file, "utf8");
      return content.includes("generateMetadata");
    })
    .map((file) => toProjectRelative(projectRoot, file))
    .sort();

  return {
    generatedAt: new Date().toISOString(),
    projectRoot,
    keyDirectories,
    keyFiles,
    prismaSchemaPath: fs.existsSync(prismaSchemaPath)
      ? toProjectRelative(projectRoot, prismaSchemaPath)
      : null,
    adminDirectories,
    adminRouteFiles,
    metadataFiles,
    routeLevelMetadataFiles,
  };
}
