import { getAiPoliciesDir } from "./shared/paths.js";
import { readJsonFile } from "./shared/fs-utils.js";
import type { AdminSurfaceMapReport, RiskSurfaceEntry, RiskSurfaceReport } from "./shared/types.js";

type EntityPolicyFile = {
  high_risk_surfaces?: Array<{
    name: string;
    path: string;
    reason: string;
  }>;
};

export function buildRiskSurfaceReport(adminReport: AdminSurfaceMapReport): RiskSurfaceReport {
  const entityPolicy = readJsonFile<EntityPolicyFile>(`${getAiPoliciesDir()}/entities.json`);

  const policySurfaces: RiskSurfaceEntry[] = (entityPolicy.high_risk_surfaces ?? []).map((surface) => ({
    name: surface.name,
    path: surface.path,
    source: "policy",
    risk: "high-risk",
    reason: surface.reason,
  }));

  const adminSurfaces: RiskSurfaceEntry[] = adminReport.surfaces
    .filter((surface) => surface.risk !== "safe-looking")
    .map((surface) => ({
      name: surface.path.split("/").pop() ?? surface.path,
      path: surface.path,
      source: "scanner",
      risk: surface.risk === "high-risk" ? "high-risk" : "review-required",
      reason: surface.reasons.join("; "),
    }));

  const deduped = new Map<string, RiskSurfaceEntry>();
  for (const surface of [...policySurfaces, ...adminSurfaces]) {
    deduped.set(`${surface.source}:${surface.name}:${surface.path}`, surface);
  }

  return {
    generatedAt: new Date().toISOString(),
    surfaces: Array.from(deduped.values()).sort((a, b) => a.path.localeCompare(b.path)),
  };
}
