import { runSeoMetadataAudit } from "./seo-metadata-auditor.js";

const result = runSeoMetadataAudit();

console.log("seo-metadata-audit: completed");
console.log(`files=${result.metadataAudit.appLevel.affectedFiles.length}`);
console.log(`entities=${result.metadataAudit.entityLevel.affectedEntities.join(",")}`);
console.log(`risk=${result.metadataAudit.summary.riskLevel}`);
console.log("report=ai/reports/seo/metadata-audit.json");
console.log("summary=ai/reports/seo/metadata-audit-summary.md");
console.log("riskMap=ai/reports/seo/live-seo-risk-map.json");
