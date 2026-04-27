import { generateLocationPagePlannerReports } from "./locationpage-planner.js";

function main(): void {
  const result = generateLocationPagePlannerReports("read_only");

  console.log("LocationPage planner reports generated:");
  console.log("- ai/reports/locationpage-seo-audit.json");
  console.log("- ai/reports/locationpage-content-plans.json");
  console.log("- ai/reports/locationpage-gap-report.md");
  console.log(`- Existing pages: ${result.audit.summary.existingPages}`);
  console.log(`- Proposed pages: ${result.audit.summary.proposedPages}`);
}

main();
