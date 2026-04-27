import fs from "node:fs";
import path from "node:path";
import { applyDraftSafePatch } from "./draft-safe-writer.js";
import { ensureDirectory, readJsonFile, writeJsonReport } from "./shared/fs-utils.js";
import { getAiLogsDir, getAiPoliciesDir, getAiReportsDir, getProjectRoot } from "./shared/paths.js";
import type {
  DraftSafeEntity,
  DraftSafeWriteRequest,
  DraftSafeWriteResult,
  EntityDraftWriterEvaluation,
  EntityDraftWriterQaOutcome,
  EntityDraftWriterRequest,
  EntityDraftWriterResult,
  JsonObject,
  QaIssueSeverity,
  QaReviewPacket,
  QaReviewReport,
  QaReviewVerdict,
} from "./shared/types.js";

type ModePolicy = {
  id: "read_only" | "draft_safe" | "review_required";
  writes_allowed: boolean;
  review_required: boolean;
  allowed_actions: string[];
  blocked_actions: string[];
};

type ModesPolicyFile = {
  modes: ModePolicy[];
};

type EntityPolicy = {
  name: DraftSafeEntity | "PriceRule";
  high_risk?: boolean;
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

type ReviewPolicyFile = {
  review_rules: {
    first_wave_review_targets: string[];
  };
};

type FieldValidation = {
  allowedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  reasons: string[];
};

type QaResolution = {
  packet: EntityDraftWriterQaOutcome | null;
  reasons: string[];
};

type SkillReviewPacket = {
  taskId: string;
  timestamp: string;
  entity: string;
  identifier: string;
  mode: EntityDraftWriterRequest["mode"];
  qaVerdict: QaReviewVerdict | null;
  requestedFields: string[];
  allowedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  status: EntityDraftWriterResult["status"];
  artifactPath: string | null;
  reasons: string[];
  writerResult?: DraftSafeWriteResult;
  reviewPacketReference?: string | null;
};

type AttemptLog = {
  timestamp: string;
  taskId: string;
  entity: string;
  identifier: string;
  mode: EntityDraftWriterRequest["mode"];
  qaVerdict: QaReviewVerdict | null;
  requestedFields: string[];
  allowedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  status: EntityDraftWriterResult["status"];
  reasons: string[];
};

const SUPPORTED_ENTITIES = new Set<DraftSafeEntity>(["LocationPage", "Kitchen", "BlogPost", "PortfolioCase"]);

const HARD_BLOCK_PATTERNS: Array<{ reason: string; matches: (field: string) => boolean }> = [
  { reason: "slug_change_blocked", matches: (field) => field === "slug" },
  { reason: "publish_change_blocked", matches: (field) => field === "published" || field === "publishedAt" },
  {
    reason: "pricing_change_blocked",
    matches: (field) =>
      field === "priceFrom" ||
      field === "priceTo" ||
      field === "deliveryCost" ||
      field === "deliveryDays" ||
      field === "measureCost" ||
      field === "timelineText",
  },
  { reason: "sensitive_metadata_blocked", matches: (field) => field === "seoTitle" || field === "seoDescription" },
  { reason: "settings_change_blocked", matches: (field) => /settings?/i.test(field) },
  { reason: "auth_change_blocked", matches: (field) => /auth|token|password|session|role/i.test(field) },
  { reason: "middleware_change_blocked", matches: (field) => /middleware/i.test(field) },
];

function getTimestampToken(iso: string): string {
  return iso.replace(/[:.]/g, "-");
}

function appendJsonLine(targetPath: string, payload: unknown): void {
  ensureDirectory(path.dirname(targetPath));
  fs.appendFileSync(targetPath, `${JSON.stringify(payload)}\n`, "utf8");
}

function getModePolicies(): Map<ModePolicy["id"], ModePolicy> {
  const payload = readJsonFile<ModesPolicyFile>(path.join(getAiPoliciesDir(), "modes.json"));
  return new Map(payload.modes.map((mode) => [mode.id, mode]));
}

function getEntityPolicies(): Map<string, EntityPolicy> {
  const payload = readJsonFile<EntitiesPolicyFile>(path.join(getAiPoliciesDir(), "entities.json"));
  return new Map(payload.entities.map((entity) => [entity.name, entity]));
}

function getReviewTargets(): Set<string> {
  const payload = readJsonFile<ReviewPolicyFile>(path.join(getAiPoliciesDir(), "review.json"));
  return new Set(payload.review_rules.first_wave_review_targets);
}

function normalizeReportPath(candidate: string): string {
  const cwdResolved = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(cwdResolved)) return cwdResolved;

  return path.resolve(getProjectRoot(), candidate);
}

function resolveQaPacket(request: EntityDraftWriterRequest): QaResolution {
  if (request.qaOutcome) {
    return { packet: request.qaOutcome, reasons: [] };
  }

  if (!request.reviewPacketReference) {
    return { packet: null, reasons: ["missing_qa_packet"] };
  }

  const resolvedPath = normalizeReportPath(request.reviewPacketReference);
  if (!fs.existsSync(resolvedPath)) {
    return { packet: null, reasons: ["qa_reference_not_found"] };
  }

  const payload = readJsonFile<QaReviewReport | QaReviewPacket>(resolvedPath);
  if ("packets" in payload) {
    const matched = payload.packets.find(
      (packet) => packet.entity === request.entity && packet.identifier === request.identifier,
    );
    if (!matched) {
      return { packet: null, reasons: ["qa_packet_not_found_for_entity_identifier"] };
    }
    return {
      packet: {
        verdict: matched.verdict,
        riskLevel: matched.riskLevel,
        summary: matched.summary,
        sourceReport: matched.sourceReport,
        issues: matched.issues,
      },
      reasons: [],
    };
  }

  if ("verdict" in payload && payload.entity === request.entity && payload.identifier === request.identifier) {
    return {
      packet: {
        verdict: payload.verdict,
        riskLevel: payload.riskLevel,
        summary: payload.summary,
        sourceReport: payload.sourceReport,
        issues: payload.issues,
      },
      reasons: [],
    };
  }

  return { packet: null, reasons: ["qa_reference_payload_not_supported"] };
}

function getValidation(entity: string, requestedFields: string[], entityPolicies: Map<string, EntityPolicy>, reviewTargets: Set<string>): FieldValidation {
  if (!SUPPORTED_ENTITIES.has(entity as DraftSafeEntity)) {
    return {
      allowedFields: [],
      blockedFields: requestedFields,
      reviewRequiredFields: [],
      reasons: ["entity_not_supported_for_skill_layer"],
    };
  }

  const entityPolicy = entityPolicies.get(entity);
  if (!entityPolicy || entityPolicy.high_risk) {
    return {
      allowedFields: [],
      blockedFields: requestedFields,
      reviewRequiredFields: [],
      reasons: ["entity_policy_missing_or_high_risk"],
    };
  }

  const draftSafeFields = new Set(entityPolicy.field_groups?.draft_safe ?? []);
  const reviewRequiredFields = new Set(entityPolicy.field_groups?.review_required ?? []);
  const allowed: string[] = [];
  const blocked = new Set<string>();
  const reviewRequired: string[] = [];
  const reasons = new Set<string>();

  for (const field of requestedFields) {
    const hardBlock = HARD_BLOCK_PATTERNS.find((rule) => rule.matches(field));
    if (hardBlock) {
      blocked.add(field);
      reasons.add(hardBlock.reason);
      continue;
    }

    if (reviewRequiredFields.has(field) || reviewTargets.has(`${entity}.${field}`) || reviewTargets.has(`${entity}.*`)) {
      blocked.add(field);
      reviewRequired.push(field);
      reasons.add("review_required_field_requested");
      continue;
    }

    if (!draftSafeFields.has(field)) {
      blocked.add(field);
      reasons.add("field_not_allowed_by_entity_policy");
      continue;
    }

    allowed.push(field);
  }

  return {
    allowedFields: allowed,
    blockedFields: [...blocked].sort(),
    reviewRequiredFields: [...new Set(reviewRequired)].sort(),
    reasons: [...reasons],
  };
}

function buildBaseResult(
  request: EntityDraftWriterRequest,
  timestamp: string,
  logPath: string,
  status: EntityDraftWriterResult["status"],
  allowedFields: string[],
  blockedFields: string[],
  reasons: string[],
  artifactPath: string | null,
  reviewPacketPath: string | null,
): EntityDraftWriterResult {
  return {
    taskId: request.taskId,
    timestamp,
    status,
    appliedFields: allowedFields,
    blockedFields,
    entity: request.entity,
    identifier: request.identifier,
    mode: request.mode,
    artifactPath,
    logPath,
    reviewPacketPath,
    reasons,
  };
}

function writeSkillArtifacts(
  request: EntityDraftWriterRequest,
  timestamp: string,
  status: EntityDraftWriterResult["status"],
  qaOutcome: EntityDraftWriterQaOutcome | null,
  validation: FieldValidation,
  reasons: string[],
  artifactPath: string | null,
  writerResult?: DraftSafeWriteResult,
): { reviewPacketPath: string; attemptPath: string; logPath: string } {
  const token = getTimestampToken(timestamp);
  const projectRoot = getProjectRoot();
  const reportsDir = getAiReportsDir();
  const logsDir = getAiLogsDir();
  const reviewPacketPath = path.join(
    reportsDir,
    "reviews",
    `entity-draft-writer-review-${token}-${request.entity}-${request.identifier}.json`,
  );
  const attemptPath = path.join(
    reportsDir,
    "writes",
    "attempts",
    `entity-draft-writer-attempt-${token}-${request.entity}-${request.identifier}.json`,
  );
  const logPath = path.join(logsDir, "entity-draft-writer.jsonl");

  const reviewPacket: SkillReviewPacket = {
    taskId: request.taskId,
    timestamp,
    entity: request.entity,
    identifier: request.identifier,
    mode: request.mode,
    qaVerdict: qaOutcome?.verdict ?? null,
    requestedFields: Object.keys(request.requestedPatch),
    allowedFields: validation.allowedFields,
    blockedFields: validation.blockedFields,
    reviewRequiredFields: validation.reviewRequiredFields,
    status,
    artifactPath,
    reasons,
    writerResult,
    reviewPacketReference: request.reviewPacketReference ?? null,
  };

  const attemptLog: AttemptLog = {
    timestamp,
    taskId: request.taskId,
    entity: request.entity,
    identifier: request.identifier,
    mode: request.mode,
    qaVerdict: qaOutcome?.verdict ?? null,
    requestedFields: Object.keys(request.requestedPatch),
    allowedFields: validation.allowedFields,
    blockedFields: validation.blockedFields,
    reviewRequiredFields: validation.reviewRequiredFields,
    status,
    reasons,
  };

  writeJsonReport(reviewPacketPath, reviewPacket);
  writeJsonReport(attemptPath, {
    request,
    qaOutcome,
    validation,
    result: reviewPacket,
  });
  appendJsonLine(logPath, attemptLog);

  return {
    reviewPacketPath: path.relative(projectRoot, reviewPacketPath).replaceAll("\\", "/"),
    attemptPath: path.relative(projectRoot, attemptPath).replaceAll("\\", "/"),
    logPath: path.relative(projectRoot, logPath).replaceAll("\\", "/"),
  };
}

function deriveReasons(
  mode: EntityDraftWriterRequest["mode"],
  qaOutcome: EntityDraftWriterQaOutcome | null,
  validation: FieldValidation,
  extraReasons: string[] = [],
): string[] {
  const reasons = new Set<string>([...validation.reasons, ...extraReasons]);

  if (!qaOutcome) {
    reasons.add("missing_qa_packet");
  } else {
    if (qaOutcome.verdict === "FAIL") reasons.add("qa_verdict_fail");
    if (qaOutcome.verdict === "NEEDS_REVIEW") reasons.add("qa_review_required");
  }

  if (mode === "read_only") reasons.add("mode_read_only_no_write");
  if (mode === "review_required") reasons.add("mode_review_required_no_apply");
  if (mode !== "draft_safe") reasons.add("mode_not_draft_safe");
  if (validation.allowedFields.length === 0) reasons.add("no_draft_safe_fields_to_apply");
  if (validation.reviewRequiredFields.length > 0) reasons.add("review_required_fields_blocked");
  if (validation.blockedFields.length > 0) reasons.add("blocked_fields_present");

  return [...reasons];
}

export function runEntityDraftWriter(request: EntityDraftWriterRequest): EntityDraftWriterResult {
  const timestamp = new Date().toISOString();
  const evaluation = evaluateEntityDraftWriterRequest(request, timestamp);
  const { qaOutcome, proposedStatus, reasons, allowedFields, blockedFields, safePatch } = evaluation;

  let status: EntityDraftWriterResult["status"] = proposedStatus;
  let artifactPath: string | null = null;
  let writerResult: DraftSafeWriteResult | undefined;

  if (evaluation.writerEligible) {
    const writerRequest: DraftSafeWriteRequest = {
      entity: request.entity as DraftSafeEntity,
      identifier: request.identifier,
      mode: "draft_safe",
      currentState: request.currentState,
      patchPayload: safePatch,
    };
    writerResult = applyDraftSafePatch(writerRequest);
    artifactPath = writerResult.statePath;
    status =
      qaOutcome?.verdict === "NEEDS_REVIEW" || writerResult.result === "partial" || blockedFields.length > 0
        ? "partial"
        : "applied";
  }

  const validation: FieldValidation = {
    allowedFields,
    blockedFields,
    reviewRequiredFields: evaluation.reviewRequiredFields,
    reasons: evaluation.validationReasons,
  };
  const artifactMeta = writeSkillArtifacts(request, timestamp, status, qaOutcome, validation, reasons, artifactPath, writerResult);

  return buildBaseResult(
    request,
    timestamp,
    artifactMeta.logPath,
    status,
    writerResult?.appliedFields ?? (status === "applied" || status === "partial" ? allowedFields : []),
    blockedFields,
    reasons,
    artifactPath,
    artifactMeta.reviewPacketPath,
  );
}

export function evaluateEntityDraftWriterRequest(
  request: EntityDraftWriterRequest,
  timestamp = new Date().toISOString(),
): EntityDraftWriterEvaluation {
  const modePolicies = getModePolicies();
  const entityPolicies = getEntityPolicies();
  const reviewTargets = getReviewTargets();
  const requestedFields = Object.keys(request.requestedPatch);
  const validation = getValidation(request.entity, requestedFields, entityPolicies, reviewTargets);
  const qaResolution = resolveQaPacket(request);
  const qaOutcome = qaResolution.packet;
  const modePolicy = modePolicies.get(request.mode);

  const extraReasons = [...qaResolution.reasons];

  const hasQaFailure = !qaOutcome || qaOutcome.verdict === "FAIL";
  const modeAllowsWrite =
    request.mode === "draft_safe" &&
    modePolicy?.writes_allowed === true &&
    modePolicy.allowed_actions.includes("update_draft_safe_fields");
  const hasAllowedFields = validation.allowedFields.length > 0;
  let proposedStatus: EntityDraftWriterResult["status"] = "blocked";

  if (request.mode === "read_only") {
    proposedStatus = "read_only";
  } else if (request.mode === "review_required") {
    proposedStatus = "review_required";
  } else if (!modeAllowsWrite) {
    extraReasons.push("mode_policy_blocks_draft_write");
    proposedStatus = "blocked";
  } else if (hasQaFailure) {
    proposedStatus = "blocked";
  } else if (!hasAllowedFields) {
    proposedStatus = "blocked";
  } else {
    proposedStatus = qaOutcome?.verdict === "NEEDS_REVIEW" || validation.blockedFields.length > 0 ? "partial" : "applied";
  }

  const reasons = deriveReasons(request.mode, qaOutcome, validation, extraReasons);

  return {
    request,
    timestamp,
    requestedFields,
    allowedFields: validation.allowedFields,
    blockedFields: validation.blockedFields,
    reviewRequiredFields: validation.reviewRequiredFields,
    safePatch: Object.fromEntries(validation.allowedFields.map((field) => [field, request.requestedPatch[field]])) as JsonObject,
    qaOutcome,
    validationReasons: validation.reasons,
    writerEligible: proposedStatus === "applied" || proposedStatus === "partial",
    modeAllowsWrite,
    hasQaFailure,
    proposedStatus,
    reasons,
  };
}
