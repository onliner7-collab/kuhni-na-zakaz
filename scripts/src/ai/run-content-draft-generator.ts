import { generateContentDraftReports } from "./content-draft-generator.js";

function main(): void {
  const result = generateContentDraftReports("draft_safe");

  console.log("Content draft reports generated:");
  console.log("- ai/reports/drafts/locationpage-drafts.json");
  console.log("- ai/reports/drafts/kitchen-drafts.json");
  console.log("- ai/reports/drafts/blogpost-drafts.json");
  console.log("- ai/reports/drafts/portfoliocase-drafts.json");
  console.log("- ai/reports/drafts/content-draft-summary.md");
  console.log(`- LocationPage packets: ${result.locationPage.packets.length}`);
  console.log(`- Kitchen packets: ${result.kitchen.packets.length}`);
  console.log(`- BlogPost packets: ${result.blogPost.packets.length}`);
  console.log(`- PortfolioCase packets: ${result.portfolioCase.packets.length}`);
}

main();
