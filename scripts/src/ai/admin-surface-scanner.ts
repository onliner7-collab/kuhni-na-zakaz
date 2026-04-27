import { getAppDir, getProjectRoot } from "./shared/paths.js";
import { safeReadText, toProjectRelative, walkFiles } from "./shared/fs-utils.js";
import type { AdminSurfaceEntry, AdminSurfaceMapReport } from "./shared/types.js";

const HIGH_RISK_HINTS = [
  "price",
  "published",
  "publish",
  "slug",
  "seoTitle",
  "seoDescription",
  "settings",
  "auth",
  "role",
  "password",
];

export function scanAdminSurfaces(): AdminSurfaceMapReport {
  const projectRoot = getProjectRoot();
  const appDir = getAppDir();
  const allFiles = walkFiles(appDir);

  const surfaces = allFiles
    .filter((file) => file.includes("\\admin\\") || file.includes("\\kapi\\admin\\"))
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => classifyAdminSurface(projectRoot, file))
    .sort((a, b) => a.path.localeCompare(b.path));

  return {
    generatedAt: new Date().toISOString(),
    surfaces,
  };
}

function classifyAdminSurface(projectRoot: string, filePath: string): AdminSurfaceEntry {
  const rel = toProjectRelative(projectRoot, filePath);
  const content = safeReadText(filePath);
  const reasons: string[] = [];
  let risk: AdminSurfaceEntry["risk"] = "safe-looking";

  for (const hint of HIGH_RISK_HINTS) {
    if (content.includes(hint)) {
      reasons.push(`Contains hint: ${hint}`);
    }
  }

  if (reasons.some((reason) => reason.includes("price") || reason.includes("auth") || reason.includes("settings"))) {
    risk = "high-risk";
  } else if (reasons.length > 0) {
    risk = "review-required";
  }

  return {
    path: rel,
    category: rel.includes("/app/kapi/admin/") ? "admin-api" : "admin-page",
    risk,
    reasons: reasons.length > 0 ? reasons : ["No obvious high-risk markers detected"],
  };
}
