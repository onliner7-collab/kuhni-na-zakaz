import { runPublicationQaReview } from "./publication-qa-reviewer.js";

const report = runPublicationQaReview();

console.log(`publication-qa-review: ${report.summary.total} packets checked`);
console.log(`PASS=${report.summary.pass} NEEDS_REVIEW=${report.summary.needsReview} FAIL=${report.summary.fail}`);
