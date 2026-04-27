import path from "node:path";
import { getAiPoliciesDir, getAiReportsDir } from "./shared/paths.js";
import { readJsonFile, writeJsonReport, writeTextReport } from "./shared/fs-utils.js";
import type {
  ContentDraftPacket,
  ContentDraftReport,
  QaIssue,
  QaIssueSeverity,
  QaReviewPacket,
  QaReviewReport,
  QaReviewVerdict,
} from "./shared/types.js";

type ModePolicy = {
  id: "read_only" | "draft_safe" | "review_required";
  allowed_actions: string[];
  blocked_actions: string[];
};

type ModesPolicyFile = {
  modes: ModePolicy[];
};

type EntityPolicy = {
  name: ContentDraftPacket["entity"] | "PriceRule";
  field_groups?: {
    draft_safe?: string[];
    review_required?: string[];
  };
};

type EntitiesPolicyFile = {
  entities: EntityPolicy[];
  high_risk_surfaces?: Array<{
    name: string;
    path: string;
    reason: string;
  }>;
};

type ForbiddenAction = {
  id: string;
  description: string;
};

type ActionsPolicyFile = {
  forbidden_actions: ForbiddenAction[];
};

type ReviewPolicyFile = {
  review_rules: {
    always_require_review_for: string[];
    first_wave_review_targets: string[];
  };
};

const DRAFT_REPORT_FILES = [
  "locationpage-drafts.json",
  "kitchen-drafts.json",
  "blogpost-drafts.json",
  "portfoliocase-drafts.json",
] as const;

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
  "this",
  "these",
  "those",
  "как",
  "для",
  "или",
  "это",
  "что",
  "при",
  "под",
  "без",
  "есть",
  "где",
  "если",
  "только",
  "после",
]);

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getModePolicy(): Map<ModePolicy["id"], ModePolicy> {
  const payload = readJsonFile<ModesPolicyFile>(path.join(getAiPoliciesDir(), "modes.json"));
  return new Map(payload.modes.map((mode) => [mode.id, mode]));
}

function getEntityPolicies(): Map<string, EntityPolicy> {
  const payload = readJsonFile<EntitiesPolicyFile>(path.join(getAiPoliciesDir(), "entities.json"));
  return new Map(payload.entities.map((entity) => [entity.name, entity]));
}

function getForbiddenActionIds(): Set<string> {
  const payload = readJsonFile<ActionsPolicyFile>(path.join(getAiPoliciesDir(), "actions.json"));
  return new Set(payload.forbidden_actions.map((action) => action.id));
}

function getReviewTargets(): Set<string> {
  const payload = readJsonFile<ReviewPolicyFile>(path.join(getAiPoliciesDir(), "review.json"));
  return new Set(payload.review_rules.first_wave_review_targets);
}

function loadDraftReports(reportsDir: string): Array<{ file: string; report: ContentDraftReport }> {
  return DRAFT_REPORT_FILES.map((file) => ({
    file,
    report: readJsonFile<ContentDraftReport>(path.join(reportsDir, "drafts", file)),
  }));
}

function countWords(values: string[]): number {
  return values
    .flatMap((value) => value.split(/[^\p{L}\p{N}_-]+/u))
    .map((word) => word.trim())
    .filter((word) => word.length > 0).length;
}

function countDuplicateBlocks(values: string[]): number {
  const seen = new Map<string, number>();
  for (const value of values) {
    const normalized = normalizeText(value);
    if (!normalized) continue;
    seen.set(normalized, (seen.get(normalized) ?? 0) + 1);
  }

  return [...seen.values()].filter((count) => count > 1).length;
}

function getRepeatedKeywordSignals(values: string[]): string[] {
  const tokens = values
    .flatMap((value) => value.toLowerCase().match(/[\p{L}\p{N}_-]{3,}/gu) ?? [])
    .filter((token) => !STOP_WORDS.has(token));
  const counts = new Map<string, number>();

  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 8)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([token]) => token);
}

function detectSensitiveClaimSignals(values: string[]): string[] {
  const text = values.join(" \n");
  const hits: string[] = [];

  if (/\b\d[\d\s.,]*(byn|руб|rur|usd|eur|€|\$)/iu.test(text)) hits.push("price_claim");
  if (/\b\d+\s*(дн|дней|дня|day|days|week|weeks|недел)/iu.test(text)) hits.push("timeline_claim");
  if (/\b\d+\s*(лет|год|года|year|years)\b/iu.test(text) && /гарант|guarante/i.test(text)) hits.push("guarantee_claim");

  return hits;
}

function buildIssue(
  code: string,
  category: QaIssue["category"],
  severity: QaIssueSeverity,
  message: string,
  fields: string[],
): QaIssue {
  return { code, category, severity, message, fields };
}

function getRiskLevel(issues: QaIssue[]): QaIssueSeverity {
  if (issues.some((issue) => issue.severity === "critical")) return "critical";
  if (issues.some((issue) => issue.severity === "high")) return "high";
  if (issues.some((issue) => issue.severity === "medium")) return "medium";
  return "low";
}

function getVerdict(issues: QaIssue[]): QaReviewVerdict {
  if (issues.some((issue) => issue.severity === "critical")) return "FAIL";
  if (issues.some((issue) => issue.severity === "high")) return "NEEDS_REVIEW";
  if (issues.some((issue) => issue.severity === "medium")) return "NEEDS_REVIEW";
  return "PASS";
}

function reviewPacket(
  packet: ContentDraftPacket,
  sourceReport: string,
  modePolicies: Map<ModePolicy["id"], ModePolicy>,
  entityPolicies: Map<string, EntityPolicy>,
  forbiddenActions: Set<string>,
  reviewTargets: Set<string>,
): QaReviewPacket {
  const entityPolicy = entityPolicies.get(packet.entity);
  const modePolicy = modePolicies.get(packet.safeMode);
  const bodyTexts = packet.drafts.bodySections.map((section) => section.draft);
  const allTexts = [
    packet.drafts.title,
    packet.drafts.h1,
    packet.drafts.metaDescription,
    ...bodyTexts,
    ...packet.drafts.faq,
    ...packet.drafts.cta,
    ...packet.drafts.altTextSuggestions,
    ...packet.drafts.internalLinks.map((link) => `${link.anchor} ${link.reason}`),
  ];
  const issues: QaIssue[] = [];
  const duplicateBlocks = countDuplicateBlocks(bodyTexts);
  const repeatedKeywords = getRepeatedKeywordSignals(allTexts);
  const sensitiveClaimSignals = detectSensitiveClaimSignals(allTexts);
  const wordCount = countWords(bodyTexts);
  const structureOk =
    packet.drafts.bodySections.length >= 3 &&
    countDuplicateBlocks(packet.drafts.bodySections.map((section) => section.heading)) === 0;

  if (!modePolicy || packet.safeMode !== "draft_safe") {
    issues.push(
      buildIssue(
        "mode_not_draft_safe",
        "safety",
        "critical",
        `Draft review expects mode "draft_safe", got "${packet.safeMode}".`,
        [],
      ),
    );
  }

  if (modePolicy && !modePolicy.allowed_actions.includes("write_draft_content")) {
    issues.push(
      buildIssue(
        "mode_missing_draft_action",
        "safety",
        "critical",
        `Mode "${packet.safeMode}" is not allowed to prepare draft content.`,
        [],
      ),
    );
  }

  if (!packet.drafts.title.trim()) {
    issues.push(buildIssue("missing_title", "seo", "high", "Draft title is missing.", ["title"]));
  }
  if (!packet.drafts.h1.trim()) {
    issues.push(buildIssue("missing_h1", "seo", "high", "Draft H1 is missing.", ["h1"]));
  }
  if (!packet.drafts.metaDescription.trim()) {
    issues.push(
      buildIssue("missing_meta_description", "seo", "high", "Draft meta description is missing.", ["metaDescription"]),
    );
  }
  if (packet.drafts.faq.length === 0) {
    issues.push(buildIssue("missing_faq", "seo", "medium", "FAQ outline is missing.", ["faq"]));
  }
  if (packet.drafts.cta.length === 0) {
    issues.push(buildIssue("missing_cta", "seo", "medium", "CTA draft is missing.", ["cta"]));
  }
  if (packet.drafts.internalLinks.length === 0) {
    issues.push(
      buildIssue("missing_internal_links", "seo", "medium", "Internal link suggestions are missing.", ["internalLinks"]),
    );
  }

  if (!structureOk) {
    issues.push(
      buildIssue(
        "weak_structure",
        "content",
        "high",
        "Body draft needs clearer section structure or has duplicate headings.",
        ["bodySections"],
      ),
    );
  }
  if (wordCount < 90) {
    issues.push(
      buildIssue("body_too_short", "content", "medium", "Body draft is too short for useful review.", ["bodySections"]),
    );
  }
  if (duplicateBlocks > 0) {
    issues.push(
      buildIssue(
        "duplicate_body_blocks",
        "content",
        "medium",
        "Body draft contains repeated sections or repeated copy.",
        ["bodySections"],
      ),
    );
  }
  if (repeatedKeywords.length > 0) {
    issues.push(
      buildIssue(
        "keyword_spam_signal",
        "content",
        "medium",
        `Possible keyword repetition detected: ${repeatedKeywords.join(", ")}.`,
        ["title", "h1", "metaDescription", "bodySections"],
      ),
    );
  }
  if (sensitiveClaimSignals.length > 0) {
    issues.push(
      buildIssue(
        "unverified_sensitive_claims",
        "content",
        "high",
        `Unverified commercial or guarantee claims detected: ${sensitiveClaimSignals.join(", ")}.`,
        ["bodySections", "faq", "cta", "metaDescription"],
      ),
    );
  }

  const forbiddenFieldsTouched: string[] = [];
  const blockedSurfaceHits = packet.reviewRequiredFields.filter((field) =>
    ["slug", "published", "publishedAt", "priceFrom", "priceTo", "seoTitle", "seoDescription"].includes(field),
  );

  if (packet.reviewRequiredFields.includes("slug")) {
    issues.push(
      buildIssue(
        "slug_stays_in_review_scope",
        "safety",
        "high",
        "Slug remains a review-only surface and cannot be auto-applied from this packet.",
        ["slug"],
      ),
    );
  }
  if (packet.reviewRequiredFields.includes("published") || packet.reviewRequiredFields.includes("publishedAt")) {
    issues.push(
      buildIssue(
        "publish_stays_in_review_scope",
        "safety",
        "high",
        "Publish state remains review-only and must stay outside draft-safe apply.",
        packet.reviewRequiredFields.filter((field) => field === "published" || field === "publishedAt"),
      ),
    );
  }
  if (packet.reviewRequiredFields.includes("priceFrom") || packet.reviewRequiredFields.includes("priceTo")) {
    issues.push(
      buildIssue(
        "pricing_stays_in_review_scope",
        "safety",
        "high",
        "Pricing fields remain blocked from draft-safe apply.",
        packet.reviewRequiredFields.filter((field) => field === "priceFrom" || field === "priceTo"),
      ),
    );
  }
  if (
    forbiddenActions.has("change_sensitive_metadata") &&
    (packet.reviewRequiredFields.includes("seoTitle") || packet.reviewRequiredFields.includes("seoDescription"))
  ) {
    issues.push(
      buildIssue(
        "metadata_stays_in_review_scope",
        "safety",
        "medium",
        "SEO metadata is still review-required and should not be treated as auto-approved.",
        packet.reviewRequiredFields.filter((field) => field === "seoTitle" || field === "seoDescription"),
      ),
    );
  }

  const entityReviewTargets = packet.reviewRequiredFields.filter((field) =>
    reviewTargets.has(`${packet.entity}.${field}`) || reviewTargets.has(`${packet.entity}.*`),
  );
  if (entityReviewTargets.length > 0) {
    issues.push(
      buildIssue(
        "entity_review_required_fields",
        "safety",
        "medium",
        "Packet includes fields that must stay in human review.",
        entityReviewTargets,
      ),
    );
  }

  if (packet.entity === "PortfolioCase" && !packet.riskFlags.includes("no_fabricated_results")) {
    issues.push(
      buildIssue(
        "missing_portfolio_non_fabrication_guard",
        "safety",
        "high",
        "Portfolio drafts must explicitly preserve non-fabrication guardrails.",
        ["result", "days", "priceFrom", "priceTo"],
      ),
    );
  }

  if (packet.entity === "Kitchen" && !packet.riskFlags.includes("pricing_requires_review")) {
    issues.push(
      buildIssue(
        "missing_kitchen_pricing_guard",
        "safety",
        "high",
        "Kitchen drafts must carry pricing review guardrails.",
        ["priceFrom", "priceTo"],
      ),
    );
  }

  const verdict = getVerdict(issues);
  const riskLevel = getRiskLevel(issues);
  const draftSafeFields = entityPolicy?.field_groups?.draft_safe ?? [];
  const summary =
    verdict === "PASS"
      ? `Packet is structurally sound for human review. Draft-safe fields available: ${draftSafeFields.join(", ") || "none"}.`
      : `Packet needs attention before manual apply. Top issues: ${issues
          .slice(0, 3)
          .map((issue) => issue.code)
          .join(", ")}.`;

  return {
    entity: packet.entity,
    identifier: packet.identifier,
    sourceReport,
    mode: packet.safeMode,
    verdict,
    riskLevel,
    checks: {
      contentQuality: {
        wordCount,
        structureOk,
        faqCount: packet.drafts.faq.length,
        ctaCount: packet.drafts.cta.length,
        internalLinkCount: packet.drafts.internalLinks.length,
        duplicateBlocks,
      },
      seoQuality: {
        hasTitle: Boolean(packet.drafts.title.trim()),
        hasH1: Boolean(packet.drafts.h1.trim()),
        hasMetaDescription: Boolean(packet.drafts.metaDescription.trim()),
        hasFaq: packet.drafts.faq.length > 0,
        hasCta: packet.drafts.cta.length > 0,
        hasInternalLinks: packet.drafts.internalLinks.length > 0,
      },
      safetyQuality: {
        modeAllowed: packet.safeMode === "draft_safe",
        forbiddenFieldsTouched,
        reviewRequiredFields: packet.reviewRequiredFields,
        blockedSurfaceHits,
      },
    },
    issues,
    summary,
  };
}

function buildMarkdownSummary(report: QaReviewReport): string {
  const topFailures = report.packets.filter((packet) => packet.verdict !== "PASS").slice(0, 10);
  const lines = [
    "# Publication QA Review Summary",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Totals",
    "",
    `- Total packets: ${report.summary.total}`,
    `- PASS: ${report.summary.pass}`,
    `- NEEDS_REVIEW: ${report.summary.needsReview}`,
    `- FAIL: ${report.summary.fail}`,
    "",
    "## Review Focus",
    "",
  ];

  if (topFailures.length === 0) {
    lines.push("- No blocking issues detected.");
  } else {
    for (const packet of topFailures) {
      const issueCodes = packet.issues.slice(0, 4).map((issue) => issue.code).join(", ");
      lines.push(`- ${packet.entity}:${packet.identifier} -> ${packet.verdict} (${issueCodes || "no issues"})`);
    }
  }

  lines.push("", "## Hard Stops", "", "- No publish changes", "- No slug changes", "- No pricing/auth/settings surfaces");
  return lines.join("\n");
}

export function runPublicationQaReview(): QaReviewReport {
  const reportsDir = getAiReportsDir();
  const modePolicies = getModePolicy();
  const entityPolicies = getEntityPolicies();
  const forbiddenActions = getForbiddenActionIds();
  const reviewTargets = getReviewTargets();
  const draftReports = loadDraftReports(reportsDir);

  const packets = draftReports.flatMap(({ file, report }) =>
    report.packets.map((packet) =>
      reviewPacket(packet, `ai/reports/drafts/${file}`, modePolicies, entityPolicies, forbiddenActions, reviewTargets),
    ),
  );

  const qaReport: QaReviewReport = {
    generatedAt: new Date().toISOString(),
    scope: "draft-packets",
    inputReports: draftReports.map(({ file }) => `ai/reports/drafts/${file}`),
    packets,
    summary: {
      total: packets.length,
      pass: packets.filter((packet) => packet.verdict === "PASS").length,
      needsReview: packets.filter((packet) => packet.verdict === "NEEDS_REVIEW").length,
      fail: packets.filter((packet) => packet.verdict === "FAIL").length,
    },
  };

  writeJsonReport(path.join(reportsDir, "reviews", "publication-qa-review.json"), qaReport);
  writeTextReport(path.join(reportsDir, "reviews", "publication-qa-summary.md"), buildMarkdownSummary(qaReport));

  return qaReport;
}
