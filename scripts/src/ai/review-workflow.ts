import fs from "node:fs";
import path from "node:path";
import { evaluateEntityDraftWriterRequest, runEntityDraftWriter } from "./entity-draft-writer.js";
import { ensureDirectory, readJsonFile, writeJsonReport, writeTextReport } from "./shared/fs-utils.js";
import { getAiReportsDir, getProjectRoot } from "./shared/paths.js";
import type {
  ApprovalArtifact,
  EntityDraftWriterRequest,
  EntityDraftWriterResult,
  QaIssueSeverity,
  RejectionArtifact,
  ReviewPacketNormalized,
  ReviewSuggestedNextAction,
  ReviewWorkflowApprovalRequest,
  ReviewWorkflowApplyRequest,
  ReviewWorkflowRejectionRequest,
  ReviewWorkflowState,
} from "./shared/types.js";

function resolveProjectPath(candidate: string): string {
  const cwdResolved = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(cwdResolved)) return cwdResolved;
  return path.resolve(getProjectRoot(), candidate);
}

function toProjectRelative(targetPath: string): string {
  return path.relative(getProjectRoot(), targetPath).replaceAll("\\", "/");
}

function getReviewWorkflowDir(): string {
  return path.join(getAiReportsDir(), "review-workflow");
}

function getApprovalsDir(): string {
  return path.join(getAiReportsDir(), "approvals");
}

function getRejectionsDir(): string {
  return path.join(getAiReportsDir(), "rejections");
}

function getBaseName(taskId: string): string {
  return taskId.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function getReviewPaths(taskId: string): { jsonPath: string; markdownPath: string } {
  const baseName = getBaseName(taskId);
  return {
    jsonPath: path.join(getReviewWorkflowDir(), `${baseName}.json`),
    markdownPath: path.join(getReviewWorkflowDir(), `${baseName}.md`),
  };
}

function getApprovalPaths(taskId: string): { jsonPath: string; markdownPath: string } {
  const baseName = getBaseName(taskId);
  return {
    jsonPath: path.join(getApprovalsDir(), `${baseName}.json`),
    markdownPath: path.join(getApprovalsDir(), `${baseName}.md`),
  };
}

function getRejectionPaths(taskId: string): { jsonPath: string; markdownPath: string } {
  const baseName = getBaseName(taskId);
  return {
    jsonPath: path.join(getRejectionsDir(), `${baseName}.json`),
    markdownPath: path.join(getRejectionsDir(), `${baseName}.md`),
  };
}

function getRiskLevel(packet: ReturnType<typeof evaluateEntityDraftWriterRequest>): QaIssueSeverity {
  return packet.qaOutcome?.riskLevel ?? (packet.blockedFields.length > 0 ? "high" : packet.reviewRequiredFields.length > 0 ? "medium" : "low");
}

function getReviewState(packet: ReturnType<typeof evaluateEntityDraftWriterRequest>): ReviewWorkflowState {
  const hardBlockReasons = new Set([
    "pricing_change_blocked",
    "publish_change_blocked",
    "slug_change_blocked",
    "auth_change_blocked",
    "settings_change_blocked",
    "middleware_change_blocked",
    "sensitive_metadata_blocked",
  ]);

  if (!packet.qaOutcome) return "generated";
  if (packet.reasons.some((reason) => hardBlockReasons.has(reason))) return "blocked";
  if (!packet.modeAllowsWrite || packet.hasQaFailure || packet.allowedFields.length === 0) return "blocked";
  if (packet.qaOutcome.verdict === "PASS" && packet.blockedFields.length === 0 && packet.reviewRequiredFields.length === 0) {
    return "qa_pass";
  }
  return "needs_review";
}

function getSuggestedNextAction(reviewState: ReviewWorkflowState): ReviewSuggestedNextAction {
  switch (reviewState) {
    case "generated":
      return "run_qa_review";
    case "qa_pass":
      return "approve_for_safe_apply";
    case "needs_review":
      return "manual_review";
    case "approved_for_safe_apply":
      return "run_safe_apply";
    case "rejected":
      return "revise_request";
    case "blocked":
    default:
      return "reject";
  }
}

function buildSummary(packet: ReviewPacketNormalized): string {
  const safeFields = packet.changes.safeFields.length > 0 ? packet.changes.safeFields.map((field) => `- \`${field}\``).join("\n") : "- none";
  const blockedFields = packet.changes.blockedFields.length > 0 ? packet.changes.blockedFields.map((field) => `- \`${field}\``).join("\n") : "- none";
  const reviewFields = packet.changes.reviewRequiredFields.length > 0
    ? packet.changes.reviewRequiredFields.map((field) => `- \`${field}\``).join("\n")
    : "- none";

  return [
    `# Review Summary: ${packet.task.taskId}`,
    "",
    `State: \`${packet.reviewState}\``,
    `Entity: \`${packet.entity.name}\` / \`${packet.entity.identifier}\``,
    `Mode: \`${packet.task.mode}\``,
    `QA: \`${packet.qaResult.verdict}\``,
    `Risk: \`${packet.riskLevel}\``,
    `Suggested next action: \`${packet.suggestedNextAction}\``,
    "",
    "## What Changed",
    ...packet.changes.requestedFields.map((field) => `- \`${field}\``),
    "",
    "## What Is Safe",
    safeFields,
    "",
    "## What Is Blocked",
    blockedFields,
    "",
    "## What Requires Manual Review",
    reviewFields,
    "",
    "## Writer Eligibility",
    `- eligible: \`${packet.writerEligibility.eligible}\``,
    `- requires explicit approval: \`${packet.writerEligibility.requiresExplicitApproval}\``,
    `- qa not fail: \`${packet.writerEligibility.qaNotFail}\``,
    "",
    "## Reasons",
    ...packet.reasons.map((reason) => `- \`${reason}\``),
  ].join("\n");
}

function buildApprovalSummary(artifact: ApprovalArtifact): string {
  return [
    `# Approval: ${artifact.taskId}`,
    "",
    `State: \`${artifact.reviewState}\``,
    `Approved by: \`${artifact.approvedBy}\``,
    `Approval marker: \`${artifact.approvalMarker}\``,
    `Safe apply eligible: \`${artifact.safeApplyEligible}\``,
    "",
    "## Allowed Fields",
    ...(artifact.allowedFields.length > 0 ? artifact.allowedFields.map((field) => `- \`${field}\``) : ["- none"]),
    "",
    "## Blocked Fields",
    ...(artifact.blockedFields.length > 0 ? artifact.blockedFields.map((field) => `- \`${field}\``) : ["- none"]),
    "",
    "## Constraints",
    ...artifact.constraints.map((constraint) => `- ${constraint}`),
  ].join("\n");
}

function buildRejectionSummary(artifact: RejectionArtifact): string {
  return [
    `# Rejection: ${artifact.taskId}`,
    "",
    `State: \`${artifact.reviewState}\``,
    `Rejected by: \`${artifact.rejectedBy}\``,
    `Reason: ${artifact.reason}`,
    "",
    "## Blocked Fields",
    ...(artifact.blockedFields.length > 0 ? artifact.blockedFields.map((field) => `- \`${field}\``) : ["- none"]),
  ].join("\n");
}

function writeReviewPacket(packet: ReviewPacketNormalized): ReviewPacketNormalized {
  const { jsonPath, markdownPath } = getReviewPaths(packet.task.taskId);
  const storedPacket: ReviewPacketNormalized = {
    ...packet,
    artifacts: {
      ...packet.artifacts,
      reviewPacketPath: toProjectRelative(jsonPath),
      markdownSummaryPath: toProjectRelative(markdownPath),
    },
  };

  writeJsonReport(jsonPath, storedPacket);
  writeTextReport(markdownPath, buildSummary(storedPacket));
  return storedPacket;
}

export function prepareReviewWorkflow(request: EntityDraftWriterRequest): ReviewPacketNormalized {
  const evaluation = evaluateEntityDraftWriterRequest(request);
  const reviewState = getReviewState(evaluation);
  const { jsonPath, markdownPath } = getReviewPaths(request.taskId);
  const packet: ReviewPacketNormalized = {
    schemaVersion: 1,
    sourceRequest: request,
    task: {
      taskId: request.taskId,
      mode: request.mode,
      requestedAction: "draft_safe_apply_review",
      requestedAt: evaluation.timestamp,
    },
    entity: {
      name: request.entity,
      identifier: request.identifier,
    },
    changes: {
      requestedFields: evaluation.requestedFields,
      safeFields: evaluation.allowedFields,
      blockedFields: evaluation.blockedFields,
      reviewRequiredFields: evaluation.reviewRequiredFields,
      requestedPatch: request.requestedPatch,
      safePatch: evaluation.safePatch,
    },
    riskLevel: getRiskLevel(evaluation),
    qaResult: {
      verdict: evaluation.qaOutcome?.verdict ?? "MISSING",
      summary: evaluation.qaOutcome?.summary ?? null,
      sourceReport: request.reviewPacketReference ?? evaluation.qaOutcome?.sourceReport ?? null,
      issues: evaluation.qaOutcome?.issues ?? [],
    },
    writerEligibility: {
      eligible: evaluation.writerEligible,
      requiresExplicitApproval: evaluation.writerEligible,
      allowedMode: evaluation.modeAllowsWrite,
      safeEntity: !evaluation.validationReasons.includes("entity_not_supported_for_skill_layer"),
      safeFieldsAvailable: evaluation.allowedFields.length > 0,
      qaNotFail: !evaluation.hasQaFailure,
      reasons: evaluation.reasons,
    },
    reviewState,
    suggestedNextAction: getSuggestedNextAction(reviewState),
    reasons: evaluation.reasons,
    artifacts: {
      reviewPacketPath: toProjectRelative(jsonPath),
      markdownSummaryPath: toProjectRelative(markdownPath),
      approvalArtifactPath: null,
      rejectionArtifactPath: null,
      qaReferencePath: request.reviewPacketReference ?? evaluation.qaOutcome?.sourceReport ?? null,
    },
  };

  return writeReviewPacket(packet);
}

function loadReviewPacket(reviewPacketPath: string): ReviewPacketNormalized {
  return readJsonFile<ReviewPacketNormalized>(resolveProjectPath(reviewPacketPath));
}

function saveApprovalArtifact(artifact: ApprovalArtifact): string {
  const { jsonPath, markdownPath } = getApprovalPaths(artifact.taskId);
  writeJsonReport(jsonPath, artifact);
  writeTextReport(markdownPath, buildApprovalSummary(artifact));
  return toProjectRelative(jsonPath);
}

function saveRejectionArtifact(artifact: RejectionArtifact): string {
  const { jsonPath, markdownPath } = getRejectionPaths(artifact.taskId);
  writeJsonReport(jsonPath, artifact);
  writeTextReport(markdownPath, buildRejectionSummary(artifact));
  return toProjectRelative(jsonPath);
}

export function approveReviewWorkflow(request: ReviewWorkflowApprovalRequest): ApprovalArtifact {
  const reviewPacket = loadReviewPacket(request.reviewPacketPath);

  if (!reviewPacket.writerEligibility.eligible || reviewPacket.qaResult.verdict === "FAIL" || reviewPacket.task.mode !== "draft_safe") {
    throw new Error(`Review packet "${reviewPacket.task.taskId}" is not eligible for safe apply approval.`);
  }

  const approvalArtifact: ApprovalArtifact = {
    schemaVersion: 1,
    taskId: reviewPacket.task.taskId,
    reviewPacketPath: reviewPacket.artifacts.reviewPacketPath,
    reviewState: "approved_for_safe_apply",
    approvalMarker: `approved:${new Date().toISOString()}:${request.approvedBy}`,
    approvedBy: request.approvedBy,
    approvedAt: new Date().toISOString(),
    note: request.note ?? null,
    safeApplyEligible: true,
    allowedFields: reviewPacket.changes.safeFields,
    blockedFields: reviewPacket.changes.blockedFields,
    constraints: [
      "apply only for draft_safe mode",
      "apply only with explicit approval marker",
      "apply only when QA is not FAIL",
      "no live publish",
      "no live admin writes",
      "no slug changes",
      "no pricing changes",
    ],
    applyResult: null,
  };

  const approvalArtifactPath = saveApprovalArtifact(approvalArtifact);
  writeReviewPacket({
    ...reviewPacket,
    reviewState: "approved_for_safe_apply",
    suggestedNextAction: "run_safe_apply",
    artifacts: {
      ...reviewPacket.artifacts,
      approvalArtifactPath,
    },
  });

  return approvalArtifact;
}

export function rejectReviewWorkflow(request: ReviewWorkflowRejectionRequest): RejectionArtifact {
  const reviewPacket = loadReviewPacket(request.reviewPacketPath);
  const rejectionArtifact: RejectionArtifact = {
    schemaVersion: 1,
    taskId: reviewPacket.task.taskId,
    reviewPacketPath: reviewPacket.artifacts.reviewPacketPath,
    reviewState: "rejected",
    rejectedBy: request.rejectedBy,
    rejectedAt: new Date().toISOString(),
    reason: request.reason,
    blockedFields: reviewPacket.changes.blockedFields,
    suggestedNextAction: "revise_request",
  };

  const rejectionArtifactPath = saveRejectionArtifact(rejectionArtifact);
  writeReviewPacket({
    ...reviewPacket,
    reviewState: "rejected",
    suggestedNextAction: "revise_request",
    artifacts: {
      ...reviewPacket.artifacts,
      rejectionArtifactPath,
    },
  });

  return rejectionArtifact;
}

export function applyApprovedReviewWorkflow(request: ReviewWorkflowApplyRequest): EntityDraftWriterResult {
  const approvalArtifactPath = resolveProjectPath(request.approvalArtifactPath);
  const approvalArtifact = readJsonFile<ApprovalArtifact>(approvalArtifactPath);
  if (approvalArtifact.reviewState !== "approved_for_safe_apply" || !approvalArtifact.safeApplyEligible || !approvalArtifact.approvalMarker) {
    throw new Error("Approval artifact is missing a valid safe-apply approval marker.");
  }

  const reviewPacket = loadReviewPacket(approvalArtifact.reviewPacketPath);
  if (reviewPacket.reviewState !== "approved_for_safe_apply") {
    throw new Error(`Review packet "${reviewPacket.task.taskId}" is not in approved_for_safe_apply state.`);
  }

  if (reviewPacket.task.mode !== "draft_safe" || reviewPacket.qaResult.verdict === "FAIL" || !reviewPacket.writerEligibility.eligible) {
    throw new Error(`Review packet "${reviewPacket.task.taskId}" failed safe-apply gate checks.`);
  }

  const applyResult = runEntityDraftWriter(reviewPacket.sourceRequest);
  const updatedArtifact: ApprovalArtifact = {
    ...approvalArtifact,
    applyResult,
  };
  saveApprovalArtifact(updatedArtifact);
  return applyResult;
}

export function ensureReviewWorkflowDirectories(): void {
  ensureDirectory(getReviewWorkflowDir());
  ensureDirectory(getApprovalsDir());
  ensureDirectory(getRejectionsDir());
}
