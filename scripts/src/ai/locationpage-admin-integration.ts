import fs from "node:fs";
import path from "node:path";
import { prepareReviewWorkflow } from "./review-workflow.js";
import { ensureDirectory, readJsonFile, writeJsonReport, writeTextReport } from "./shared/fs-utils.js";
import { getAiDir, getAiLogsDir, getAiPoliciesDir, getAiReportsDir, getAppRoot, getProjectRoot } from "./shared/paths.js";
import type {
  EntityDraftWriterQaOutcome,
  EntityDraftWriterRequest,
  JsonObject,
  QaIssue,
  QaIssueSeverity,
  QaReviewVerdict,
  ReviewPacketNormalized,
} from "./shared/types.js";

type EntitiesPolicyFile = {
  entities: Array<{
    name: string;
    field_groups?: {
      draft_safe?: string[];
      review_required?: string[];
    };
  }>;
};

type FieldPolicyEntry = {
  field: string;
  editableInAdminForm: boolean;
  classification: "allowed" | "blocked" | "read_only";
  reason: string;
  source: string;
};

type AdminArchitectureReport = {
  generatedAt: string;
  entity: "LocationPage";
  scope: "local_test_admin_only";
  architecture: {
    formComponent: string;
    listPage: string;
    newPage: string;
    editPage: string;
    apiCollectionRoute: string;
    apiItemRoute: string;
    liveRoute: string;
    validatorLayer: "none_detected";
    writePath: "client_fetch_to_internal_admin_api_to_prisma";
  };
  formFields: string[];
  liveSensitiveFields: string[];
  safestIntegrationOption: {
    selected: "local_test_draft_adapter";
    comparison: Array<{
      option: "direct_data_layer" | "internal_admin_api" | "browser_driven_workflow" | "local_test_draft_adapter";
      safety: "low" | "medium" | "high";
      invasiveLevel: "low" | "medium" | "high";
      notes: string;
    }>;
  };
  allowedFieldMapPath: string;
  blockedFieldMapPath: string;
};

type LocationPageAdminPayload = {
  taskId: string;
  identifier: string;
  source: "local_test_admin";
  reviewPacketReference?: string | null;
  qaOutcome?: EntityDraftWriterQaOutcome;
  currentState?: JsonObject;
  adminFormPayload: JsonObject;
};

type LocationPageAdminQaArtifact = {
  taskId: string;
  timestamp: string;
  entity: "LocationPage";
  identifier: string;
  verdict: QaReviewVerdict;
  riskLevel: QaIssueSeverity;
  safeFields: string[];
  blockedFields: string[];
  issues: QaIssue[];
  summary: string;
};

type LocationPageAdminDraftOperationArtifact = {
  taskId: string;
  timestamp: string;
  entity: "LocationPage";
  identifier: string;
  source: "local_test_admin";
  requestedFields: string[];
  safeFields: string[];
  blockedFields: string[];
  readOnlyFields: string[];
  safePatch: JsonObject;
  qaArtifactPath: string;
  reviewWorkflowPacketPath: string;
  reviewWorkflowSummaryPath: string;
  notes: string[];
};

const LOCATION_FORM_PATH = path.join(getAppRoot(), "components", "admin", "LocationForm.tsx");
const ADMIN_LIST_PATH = path.join(getAppRoot(), "app", "admin", "locations", "page.tsx");
const ADMIN_NEW_PATH = path.join(getAppRoot(), "app", "admin", "locations", "new", "page.tsx");
const ADMIN_EDIT_PATH = path.join(getAppRoot(), "app", "admin", "locations", "[id]", "edit", "page.tsx");
const API_COLLECTION_PATH = path.join(getAppRoot(), "app", "kapi", "admin", "locations", "route.ts");
const API_ITEM_PATH = path.join(getAppRoot(), "app", "kapi", "admin", "locations", "[id]", "route.ts");
const LIVE_ROUTE_PATH = path.join(getAppRoot(), "app", "locations", "[city]", "page.tsx");

function getAdminIntegrationDir(): string {
  return path.join(getAiReportsDir(), "admin-integration");
}

function getExamplesDir(): string {
  return path.join(getAdminIntegrationDir(), "examples");
}

function getEntityPolicy(): { draftSafe: string[]; reviewRequired: string[] } {
  const payload = readJsonFile<EntitiesPolicyFile>(path.join(getAiPoliciesDir(), "entities.json"));
  const locationPage = payload.entities.find((entity) => entity.name === "LocationPage");
  return {
    draftSafe: locationPage?.field_groups?.draft_safe ?? [],
    reviewRequired: locationPage?.field_groups?.review_required ?? [],
  };
}

function extractInterfaceFields(filePath: string, interfaceName: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(new RegExp(`interface\\s+${interfaceName}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => line.split(":")[0]?.replace("?", "").trim())
    .filter((field): field is string => Boolean(field))
    .sort();
}

function toProjectRelative(targetPath: string): string {
  return path.relative(getProjectRoot(), targetPath).replaceAll("\\", "/");
}

function appendJsonLine(targetPath: string, payload: unknown): void {
  ensureDirectory(path.dirname(targetPath));
  fs.appendFileSync(targetPath, `${JSON.stringify(payload)}\n`, "utf8");
}

function getCurrentArchitectureReport(): AdminArchitectureReport {
  const formFields = extractInterfaceFields(LOCATION_FORM_PATH, "LocationData");
  const policy = getEntityPolicy();
  const liveSensitiveFields = [...new Set(["slug", "published", "priceFrom", "seoTitle", "seoDescription", ...policy.reviewRequired])].sort();

  return {
    generatedAt: new Date().toISOString(),
    entity: "LocationPage",
    scope: "local_test_admin_only",
    architecture: {
      formComponent: toProjectRelative(LOCATION_FORM_PATH),
      listPage: toProjectRelative(ADMIN_LIST_PATH),
      newPage: toProjectRelative(ADMIN_NEW_PATH),
      editPage: toProjectRelative(ADMIN_EDIT_PATH),
      apiCollectionRoute: toProjectRelative(API_COLLECTION_PATH),
      apiItemRoute: toProjectRelative(API_ITEM_PATH),
      liveRoute: toProjectRelative(LIVE_ROUTE_PATH),
      validatorLayer: "none_detected",
      writePath: "client_fetch_to_internal_admin_api_to_prisma",
    },
    formFields,
    liveSensitiveFields,
    safestIntegrationOption: {
      selected: "local_test_draft_adapter",
      comparison: [
        {
          option: "direct_data_layer",
          safety: "low",
          invasiveLevel: "high",
          notes: "Direct Prisma updates bypass current review and approval controls.",
        },
        {
          option: "internal_admin_api",
          safety: "low",
          invasiveLevel: "medium",
          notes: "Existing admin API accepts broad payloads and can update publish, slug, pricing, and SEO fields.",
        },
        {
          option: "browser_driven_workflow",
          safety: "medium",
          invasiveLevel: "high",
          notes: "Safer than direct DB writes but brittle, UI-coupled, and unnecessary for local/test-only draft flow.",
        },
        {
          option: "local_test_draft_adapter",
          safety: "high",
          invasiveLevel: "low",
          notes: "Reads LocationForm-shaped payload, filters to draft-safe fields, and writes only AI review/draft artifacts.",
        },
      ],
    },
    allowedFieldMapPath: "ai/reports/admin-integration/locationpage-allowed-field-map.json",
    blockedFieldMapPath: "ai/reports/admin-integration/locationpage-blocked-field-map.json",
  };
}

function buildFieldMatrix(): { allowed: FieldPolicyEntry[]; blocked: FieldPolicyEntry[]; readOnly: FieldPolicyEntry[] } {
  const formFields = extractInterfaceFields(LOCATION_FORM_PATH, "LocationData");
  const { draftSafe, reviewRequired } = getEntityPolicy();
  const formFieldSet = new Set(formFields);

  const allowed = draftSafe.map((field) => ({
    field,
    editableInAdminForm: formFieldSet.has(field),
    classification: "allowed" as const,
    reason: "LocationPage draft_safe policy allows local/test draft integration for this field.",
    source: "ai/policies/entities.json",
  }));

  const blockedNames = new Set<string>([
    ...reviewRequired,
    "slug",
    "published",
    "priceFrom",
    "deliveryCost",
    "deliveryDays",
    "measureCost",
    "timelineText",
    "seoTitle",
    "seoDescription",
    "title",
    "h1",
    "phone",
    "address",
  ]);

  const blocked = [...blockedNames]
    .sort()
    .map((field) => ({
      field,
      editableInAdminForm: formFieldSet.has(field),
      classification: "blocked" as const,
      reason: "Field is review_required, live-sensitive, or explicitly forbidden for draft-safe admin integration.",
      source: "ai/policies/entities.json + integration guardrails",
    }));

  const readOnly = formFields
    .filter((field) => !draftSafe.includes(field) && !blockedNames.has(field))
    .sort()
    .map((field) => ({
      field,
      editableInAdminForm: true,
      classification: "read_only" as const,
      reason: "Field may be inspected/mapped but is not auto-forwarded into draft-safe admin updates.",
      source: "integration adapter classification",
    }));

  return { allowed, blocked, readOnly };
}

function writeArchitectureArtifacts(): {
  reportPath: string;
  allowedMapPath: string;
  blockedMapPath: string;
} {
  const adminDir = getAdminIntegrationDir();
  ensureDirectory(adminDir);
  const report = getCurrentArchitectureReport();
  const fieldMatrix = buildFieldMatrix();

  const reportPath = path.join(adminDir, "locationpage-admin-integration-report.json");
  const reportMarkdownPath = path.join(adminDir, "locationpage-admin-integration-report.md");
  const allowedMapPath = path.join(adminDir, "locationpage-allowed-field-map.json");
  const blockedMapPath = path.join(adminDir, "locationpage-blocked-field-map.json");

  writeJsonReport(reportPath, report);
  writeJsonReport(allowedMapPath, { entity: "LocationPage", fields: fieldMatrix.allowed });
  writeJsonReport(blockedMapPath, {
    entity: "LocationPage",
    blocked: fieldMatrix.blocked,
    readOnly: fieldMatrix.readOnly,
  });

  writeTextReport(
    reportMarkdownPath,
    [
      "# LocationPage Admin Integration Report",
      "",
      "## Current Admin Architecture",
      `- Form: \`${report.architecture.formComponent}\``,
      `- List page: \`${report.architecture.listPage}\``,
      `- New page: \`${report.architecture.newPage}\``,
      `- Edit page: \`${report.architecture.editPage}\``,
      `- Admin API collection: \`${report.architecture.apiCollectionRoute}\``,
      `- Admin API item: \`${report.architecture.apiItemRoute}\``,
      `- Live route: \`${report.architecture.liveRoute}\``,
      `- Validator layer: \`${report.architecture.validatorLayer}\``,
      `- Current write path: \`${report.architecture.writePath}\``,
      "",
      "## Safest Integration Option",
      `- Selected: \`${report.safestIntegrationOption.selected}\``,
      "",
      "## Allowed Draft-Safe Fields",
      ...fieldMatrix.allowed.map((entry) => `- \`${entry.field}\``),
      "",
      "## Blocked Fields",
      ...fieldMatrix.blocked.map((entry) => `- \`${entry.field}\``),
      "",
      "## Read-Only Fields",
      ...fieldMatrix.readOnly.map((entry) => `- \`${entry.field}\``),
    ].join("\n"),
  );

  return {
    reportPath: toProjectRelative(reportPath),
    allowedMapPath: toProjectRelative(allowedMapPath),
    blockedMapPath: toProjectRelative(blockedMapPath),
  };
}

function classifyAdminPayload(payload: JsonObject): {
  requestedFields: string[];
  safeFields: string[];
  blockedFields: string[];
  readOnlyFields: string[];
  safePatch: JsonObject;
  reviewRequestedPatch: JsonObject;
} {
  const { allowed, blocked, readOnly } = buildFieldMatrix();
  const allowedSet = new Set(allowed.map((entry) => entry.field));
  const blockedSet = new Set(blocked.map((entry) => entry.field));
  const readOnlySet = new Set(readOnly.map((entry) => entry.field));
  const requestedFields = Object.keys(payload);
  const safePatch: JsonObject = {};
  const reviewRequestedPatch: JsonObject = {};
  const safeFields: string[] = [];
  const blockedFields: string[] = [];
  const readOnlyFields: string[] = [];

  for (const field of requestedFields) {
    if (allowedSet.has(field)) {
      safePatch[field] = payload[field];
      reviewRequestedPatch[field] = payload[field];
      safeFields.push(field);
      continue;
    }

    if (blockedSet.has(field)) {
      reviewRequestedPatch[field] = payload[field];
      blockedFields.push(field);
      continue;
    }

    if (readOnlySet.has(field)) {
      readOnlyFields.push(field);
      continue;
    }

    if (field in payload) {
      blockedFields.push(field);
    }
  }

  return {
    requestedFields,
    safeFields: safeFields.sort(),
    blockedFields: [...new Set(blockedFields)].sort(),
    readOnlyFields: [...new Set(readOnlyFields)].sort(),
    safePatch,
    reviewRequestedPatch,
  };
}

function buildQaIssue(
  code: string,
  severity: QaIssueSeverity,
  message: string,
  fields: string[],
  category: "content" | "seo" | "safety" = "safety",
): QaIssue {
  return { code, severity, message, fields, category };
}

function buildLocalQaArtifact(input: LocationPageAdminPayload, classified: ReturnType<typeof classifyAdminPayload>): {
  qaOutcome: EntityDraftWriterQaOutcome;
  artifactPath: string;
} {
  const issues: QaIssue[] = [];

  if (classified.safeFields.length === 0) {
    issues.push(buildQaIssue("no_safe_fields", "critical", "Admin payload does not contain any draft-safe LocationPage fields.", []));
  }

  if (classified.blockedFields.length > 0) {
    issues.push(
      buildQaIssue(
        "blocked_fields_present",
        "high",
        "Admin payload contains fields that are blocked from local/test draft-safe integration.",
        classified.blockedFields,
      ),
    );
  }

  const verdict: QaReviewVerdict =
    issues.some((issue) => issue.severity === "critical")
      ? "FAIL"
      : issues.some((issue) => issue.severity === "high")
        ? "NEEDS_REVIEW"
        : "PASS";
  const riskLevel: QaIssueSeverity =
    verdict === "FAIL" ? "critical" : verdict === "NEEDS_REVIEW" ? "high" : "low";
  const summary =
    verdict === "PASS"
      ? "Admin payload contains only draft-safe LocationPage fields."
      : verdict === "NEEDS_REVIEW"
        ? "Admin payload contains safe fields, but blocked fields remain present and must not be applied."
        : "Admin payload failed local QA because no draft-safe fields are available for integration.";

  const artifact: LocationPageAdminQaArtifact = {
    taskId: input.taskId,
    timestamp: new Date().toISOString(),
    entity: "LocationPage",
    identifier: input.identifier,
    verdict,
    riskLevel,
    safeFields: classified.safeFields,
    blockedFields: classified.blockedFields,
    issues,
    summary,
  };

  const targetPath = path.join(getAdminIntegrationDir(), `locationpage-admin-qa-${input.taskId.replace(/[^a-zA-Z0-9_-]+/g, "-")}.json`);
  writeJsonReport(targetPath, artifact);

  return {
    qaOutcome: {
      verdict: artifact.verdict,
      riskLevel: artifact.riskLevel,
      summary: artifact.summary,
      sourceReport: toProjectRelative(targetPath),
      issues: artifact.issues,
    },
    artifactPath: toProjectRelative(targetPath),
  };
}

function getVerdictRank(verdict: QaReviewVerdict): number {
  if (verdict === "FAIL") return 3;
  if (verdict === "NEEDS_REVIEW") return 2;
  return 1;
}

function getSeverityRank(severity: QaIssueSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function mergeQaOutcomes(
  pipelineQaOutcome: EntityDraftWriterQaOutcome | undefined,
  localQaOutcome: EntityDraftWriterQaOutcome,
): EntityDraftWriterQaOutcome {
  if (!pipelineQaOutcome) {
    return localQaOutcome;
  }

  const mergedVerdict =
    getVerdictRank(pipelineQaOutcome.verdict) >= getVerdictRank(localQaOutcome.verdict)
      ? pipelineQaOutcome.verdict
      : localQaOutcome.verdict;
  const mergedRiskLevel =
    getSeverityRank(pipelineQaOutcome.riskLevel ?? "low") >= getSeverityRank(localQaOutcome.riskLevel ?? "low")
      ? (pipelineQaOutcome.riskLevel ?? "low")
      : (localQaOutcome.riskLevel ?? "low");

  return {
    verdict: mergedVerdict,
    riskLevel: mergedRiskLevel,
    sourceReport: pipelineQaOutcome.sourceReport ?? localQaOutcome.sourceReport,
    summary: [pipelineQaOutcome.summary, localQaOutcome.summary].filter(Boolean).join(" | "),
    issues: [...(pipelineQaOutcome.issues ?? []), ...(localQaOutcome.issues ?? [])],
  };
}

export function analyzeLocationPageAdminIntegration(): {
  reportPath: string;
  allowedMapPath: string;
  blockedMapPath: string;
} {
  return writeArchitectureArtifacts();
}

export function prepareLocationPageAdminDraftOperation(input: LocationPageAdminPayload): {
  operationPath: string;
  reviewPacket: ReviewPacketNormalized;
} {
  writeArchitectureArtifacts();
  ensureDirectory(getAdminIntegrationDir());
  ensureDirectory(getExamplesDir());

  const classified = classifyAdminPayload(input.adminFormPayload);
  const qa = buildLocalQaArtifact(input, classified);
  const mergedQaOutcome = mergeQaOutcomes(input.qaOutcome, qa.qaOutcome);
  const writerRequest: EntityDraftWriterRequest = {
    taskId: input.taskId,
    mode: "draft_safe",
    entity: "LocationPage",
    identifier: input.identifier,
    requestedPatch: classified.reviewRequestedPatch,
    qaOutcome: mergedQaOutcome,
    reviewPacketReference: input.reviewPacketReference ?? null,
    currentState: input.currentState,
  };

  const reviewPacket = prepareReviewWorkflow(writerRequest);
  const artifact: LocationPageAdminDraftOperationArtifact = {
    taskId: input.taskId,
    timestamp: new Date().toISOString(),
    entity: "LocationPage",
    identifier: input.identifier,
    source: "local_test_admin",
    requestedFields: classified.requestedFields,
    safeFields: classified.safeFields,
    blockedFields: classified.blockedFields,
    readOnlyFields: classified.readOnlyFields,
    safePatch: classified.safePatch,
    qaArtifactPath: qa.artifactPath,
    reviewWorkflowPacketPath: reviewPacket.artifacts.reviewPacketPath,
    reviewWorkflowSummaryPath: reviewPacket.artifacts.markdownSummaryPath,
    notes: [
      "No Prisma writes were performed.",
      "No internal admin API route was called.",
      "Only draft-safe LocationPage fields were forwarded into the pipeline.",
      "Publish, slug, pricing, and metadata-sensitive fields remained blocked.",
      input.qaOutcome ? "Pipeline QA outcome was merged into the review packet before storage." : "Local adapter QA only was used for review packet preparation.",
    ],
  };

  const operationPath = path.join(getAdminIntegrationDir(), `${input.taskId.replace(/[^a-zA-Z0-9_-]+/g, "-")}.json`);
  writeJsonReport(operationPath, artifact);
  writeTextReport(
    operationPath.replace(/\.json$/, ".md"),
    [
      `# LocationPage Safe Draft Operation: ${artifact.taskId}`,
      "",
      `Entity: \`${artifact.entity}\` / \`${artifact.identifier}\``,
      `Source: \`${artifact.source}\``,
      "",
      "## Safe Fields",
      ...(artifact.safeFields.length > 0 ? artifact.safeFields.map((field) => `- \`${field}\``) : ["- none"]),
      "",
      "## Blocked Fields",
      ...(artifact.blockedFields.length > 0 ? artifact.blockedFields.map((field) => `- \`${field}\``) : ["- none"]),
      "",
      "## Read-Only Fields",
      ...(artifact.readOnlyFields.length > 0 ? artifact.readOnlyFields.map((field) => `- \`${field}\``) : ["- none"]),
      "",
      "## Artifacts",
      `- QA: \`${artifact.qaArtifactPath}\``,
      `- Review packet: \`${artifact.reviewWorkflowPacketPath}\``,
      `- Review summary: \`${artifact.reviewWorkflowSummaryPath}\``,
    ].join("\n"),
  );

  appendJsonLine(path.join(getAiLogsDir(), "locationpage-admin-integration.jsonl"), {
    timestamp: artifact.timestamp,
    taskId: artifact.taskId,
    entity: artifact.entity,
    identifier: artifact.identifier,
    requestedFields: artifact.requestedFields,
    safeFields: artifact.safeFields,
    blockedFields: artifact.blockedFields,
    reviewPacketPath: artifact.reviewWorkflowPacketPath,
  });

  return {
    operationPath: toProjectRelative(operationPath),
    reviewPacket,
  };
}
