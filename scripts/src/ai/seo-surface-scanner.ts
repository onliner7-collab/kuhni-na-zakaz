import fs from "node:fs";
import { getAppDir, getProjectRoot } from "./shared/paths.js";
import { toProjectRelative, walkFiles } from "./shared/fs-utils.js";
import type { SeoSurfaceEntry, SeoSurfaceMapReport } from "./shared/types.js";

export function scanSeoSurfaces(): SeoSurfaceMapReport {
  const projectRoot = getProjectRoot();
  const appDir = getAppDir();
  const allFiles = walkFiles(appDir);
  const surfaces: SeoSurfaceEntry[] = [];

  for (const file of allFiles) {
    const rel = toProjectRelative(projectRoot, file);

    if (rel === "artifacts/kuhni-na-zakaz/app/layout.tsx") {
      surfaces.push({
        path: rel,
        type: "global-layout",
        notes: ["Global metadata surface", "Site-wide SEO defaults"],
      });
      continue;
    }

    if (rel === "artifacts/kuhni-na-zakaz/app/robots.ts") {
      surfaces.push({
        path: rel,
        type: "robots",
        notes: ["Robots policy surface"],
      });
      continue;
    }

    if (rel === "artifacts/kuhni-na-zakaz/app/sitemap.ts") {
      surfaces.push({
        path: rel,
        type: "sitemap",
        notes: ["Sitemap generation surface"],
      });
      continue;
    }

    if (!/\.(ts|tsx)$/.test(file)) {
      continue;
    }

    const text = fs.readFileSync(file, "utf8");
    if (text.includes("generateMetadata")) {
      surfaces.push({
        path: rel,
        type: "route-generateMetadata",
        notes: ["Route-level metadata surface"],
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    surfaces: surfaces.sort((a, b) => a.path.localeCompare(b.path)),
  };
}
