import fs from "node:fs";
import path from "node:path";
import { prepareLocationPageAdminDraftOperation } from "./locationpage-admin-integration.js";
import { executeSkillTask, routeSkillTask, type SkillExecutionResult, type SkillRoutingDecision, type SkillTaskEnvelope } from "./skill-runtime.js";
import { ensureDirectory, readJsonFile, writeJsonReport, writeTextReport } from "./shared/fs-utils.js";
import { getAiLogsDir, getAiReportsDir, getProjectRoot } from "./shared/paths.js";
import type {
  ContentDraftPacket,
  ContentDraftReport,
  EntityDraftWriterQaOutcome,
  JsonObject,
  LocationPageContentPlansReport,
  QaReviewPacket,
  QaReviewReport,
  ReviewPacketNormalized,
} from "./shared/types.js";

type LocationPageSeoOperatorLoopStorageTarget = "safe_admin_draft_integration";

type LocationPageSeoOperatorLoopRequest = {
  schemaVersion: 1;
  taskId: string;
  entity: "LocationPage";
  identifier: string;
  mode: "draft_safe";
  source: "local_test_operator";
  intent: string;
  storageTarget: LocationPageSeoOperatorLoopStorageTarget;
  currentState?: JsonObject;
};

type OperatorLoopStepState =
  | "task_received"
  | "skill_routed"
  | "plan_built"
  | "draft_generated"
  | "qa_completed"
  | "review_packet_created"
  | "draft_stored"
  | "final_summary_ready";

type OperatorLoopTransition = {
  state: OperatorLoopStepState;
  timestamp: string;
  detail: string;
};

type LocationPageSeoOperatorLoopReport = {
  schemaVersion: 1;
  generatedAt: string;
  task: LocationPageSeoOperatorLoopRequest;
  architecture: {
    selectedEntity: "LocationPage";
    selectedStorageTarget: LocationPageSeoOperatorLoopStorageTarget;
    guardrails: string[];
    loopSteps: string[];
  };
  routing: {
    planner: SkillRoutingDecision;
    drafter: SkillRoutingDecision;
    qa: SkillRoutingDecision;
  };
  executions: {
    planner: SkillExecutionResult;
    drafter: SkillExecutionResult;
    qa: SkillExecutionResult;
  };
  selectedArtifacts: {
    planSlug: string;
    draftIdentifier: string;
    qaVerdict: string;
    qaReviewReportPath: string;
    qaSourceReport: string;
    adminOperationPath: string;
    reviewPacketPath: string;
    reviewSummaryPath: string;
  };
  safeDraftPayload: JsonObject;
  review: {
    reviewState: ReviewPacketNormalized["reviewState"];
    suggestedNextAction: ReviewPacketNormalized["suggestedNextAction"];
    safeFields: string[];
    blockedFields: string[];
    qaVerdict: ReviewPacketNormalized["qaResult"]["verdict"];
    riskLevel: ReviewPacketNormalized["riskLevel"];
  };
  transitions: OperatorLoopTransition[];
  outputs: {
    machineReportPath: string;
    humanSummaryPath: string;
  };
  reusableParts: string[];
};

function toProjectRelative(targetPath: string): string {
  return path.relative(getProjectRoot(), targetPath).replaceAll("\\", "/");
}

function appendJsonLine(targetPath: string, payload: unknown): void {
  ensureDirectory(path.dirname(targetPath));
  fs.appendFileSync(targetPath, `${JSON.stringify(payload)}\n`, "utf8");
}

function getOperatorLoopDir(): string {
  return path.join(getAiReportsDir(), "operator-loops");
}

function getOperatorExamplesDir(): string {
  return path.join(getOperatorLoopDir(), "examples");
}

function getBaseName(taskId: string): string {
  return taskId.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function buildLoopPaths(taskId: string): { jsonPath: string; markdownPath: string } {
  const baseName = getBaseName(taskId);
  return {
    jsonPath: path.join(getOperatorLoopDir(), `${baseName}.json`),
    markdownPath: path.join(getOperatorLoopDir(), `${baseName}.md`),
  };
}

function pushTransition(transitions: OperatorLoopTransition[], state: OperatorLoopStepState, detail: string): void {
  transitions.push({
    state,
    timestamp: new Date().toISOString(),
    detail,
  });
}

function assertSafeRequest(input: LocationPageSeoOperatorLoopRequest): void {
  if (input.entity !== "LocationPage") {
    throw new Error(`LocationPage SEO operator loop supports only entity "LocationPage", got "${input.entity}".`);
  }
  if (input.mode !== "draft_safe") {
    throw new Error(`LocationPage SEO operator loop supports only mode "draft_safe", got "${input.mode}".`);
  }
  if (input.storageTarget !== "safe_admin_draft_integration") {
    throw new Error(`Unsupported storageTarget "${input.storageTarget}".`);
  }
  const normalizedIntent = input.intent.toLowerCase();
  const hasPositiveProtectedIntent = [
    "publish",
    "slug",
    "pricing",
    "settings",
    "auth",
    "middleware",
  ].some((keyword) => {
    if (!normalizedIntent.includes(keyword)) return false;
    return ![
      `without ${keyword}`,
      `no ${keyword}`,
      `без ${keyword}`,
      `не ${keyword}`,
    ].some((safePhrase) => normalizedIntent.includes(safePhrase));
  });

  if (hasPositiveProtectedIntent) {
    throw new Error("Task intent touches blocked surfaces: publish/slug/pricing/settings/auth/middleware are not allowed.");
  }
}

function pickLocationPagePlan(identifier: string): LocationPageContentPlansReport["plans"][number] {
  const report = readJsonFile<LocationPageContentPlansReport>(
    path.join(getAiReportsDir(), "locationpage-content-plans.json"),
  );
  const plan = report.plans.find((entry) => entry.slug === identifier);
  if (!plan) {
    throw new Error(`LocationPage plan not found for identifier "${identifier}".`);
  }
  return plan;
}

function pickLocationPageDraft(identifier: string): ContentDraftPacket {
  const report = readJsonFile<ContentDraftReport>(path.join(getAiReportsDir(), "drafts", "locationpage-drafts.json"));
  const packet = report.packets.find((entry) => entry.entity === "LocationPage" && entry.identifier === identifier);
  if (!packet) {
    throw new Error(`LocationPage draft packet not found for identifier "${identifier}".`);
  }
  return packet;
}

function pickLocationPageQaPacket(identifier: string): QaReviewPacket {
  const report = readJsonFile<QaReviewReport>(path.join(getAiReportsDir(), "reviews", "publication-qa-review.json"));
  const packet = report.packets.find((entry) => entry.entity === "LocationPage" && entry.identifier === identifier);
  if (!packet) {
    throw new Error(`LocationPage QA packet not found for identifier "${identifier}".`);
  }
  return packet;
}

function toPipelineQaOutcome(packet: QaReviewPacket): EntityDraftWriterQaOutcome {
  return {
    verdict: packet.verdict,
    riskLevel: packet.riskLevel,
    summary: packet.summary,
    sourceReport: packet.sourceReport,
    issues: packet.issues,
  };
}

function buildSafeAdminPayloadFromDraft(packet: ContentDraftPacket): JsonObject {
  const sectionOne = packet.drafts.bodySections[0]?.draft ?? "";
  const sectionTwo = packet.drafts.bodySections[1]?.draft ?? sectionOne;
  const sectionThree = packet.drafts.bodySections[2]?.draft ?? sectionTwo;
  const trustedFacts = packet.inputSummary.trustedFacts.slice(0, 4);

  return {
    city: packet.inputSummary.trustedFacts[0] ?? packet.identifier,
    intro: sectionOne,
    description: sectionTwo,
    localIntro: sectionThree,
    features: trustedFacts,
    uniquePoints: trustedFacts.map((fact, index) => ({
      label: `Local signal ${index + 1}`,
      text: fact,
    })),
    contentBlocks: packet.drafts.bodySections.map((section) => ({
      type: "text",
      title: section.heading,
      text: section.draft,
    })),
    faq: packet.drafts.faq.map((question, index) => ({
      question,
      answer:
        packet.drafts.bodySections[index]?.draft ??
        "Черновой ответ требует локальной проверки перед ручным утверждением.",
    })),
    ctaHeadline: packet.drafts.cta[0] ?? "Запросить черновой SEO-проект",
    ctaSubtext:
      packet.drafts.cta.slice(1).join(" ") ||
      "Черновик сохраняется только для review и локального тестового контура без publish.",
  };
}

function buildSummary(report: LocationPageSeoOperatorLoopReport): string {
  return [
    `# LocationPage SEO Operator Loop: ${report.task.taskId}`,
    "",
    `Entity: \`${report.task.entity}\` / \`${report.task.identifier}\``,
    `Mode: \`${report.task.mode}\``,
    `Storage target: \`${report.task.storageTarget}\``,
    `Review state: \`${report.review.reviewState}\``,
    `Suggested next action: \`${report.review.suggestedNextAction}\``,
    `QA verdict: \`${report.review.qaVerdict}\``,
    `Risk level: \`${report.review.riskLevel}\``,
    "",
    "## Loop Architecture",
    "- Receive task envelope",
    "- Route planner, drafter, and QA skills through the skill registry",
    "- Build a LocationPage SEO plan",
    "- Generate a LocationPage draft packet",
    "- Run publication QA",
    "- Normalize a review packet with merged QA context",
    "- Store the result via local/test safe admin draft integration",
    "- Produce final JSON and Markdown artifacts for human review",
    "",
    "## What Changed",
    ...Object.keys(report.safeDraftPayload).map((field) => `- \`${field}\``),
    "",
    "## What Is Safe",
    ...(report.review.safeFields.length > 0 ? report.review.safeFields.map((field) => `- \`${field}\``) : ["- none"]),
    "",
    "## What Is Blocked",
    ...(report.review.blockedFields.length > 0 ? report.review.blockedFields.map((field) => `- \`${field}\``) : ["- none"]),
    "",
    "## Artifacts",
    `- Machine report: \`${report.outputs.machineReportPath}\``,
    `- Human summary: \`${report.outputs.humanSummaryPath}\``,
    `- Admin operation: \`${report.selectedArtifacts.adminOperationPath}\``,
    `- Review packet: \`${report.selectedArtifacts.reviewPacketPath}\``,
    `- Review summary: \`${report.selectedArtifacts.reviewSummaryPath}\``,
    "",
    "## State Transitions",
    ...report.transitions.map((transition) => `- ${transition.state}: ${transition.detail}`),
    "",
    "## Reusable Parts",
    ...report.reusableParts.map((item) => `- ${item}`),
  ].join("\n");
}

function getRoutingIntent(intent: string): string {
  return intent
    .replace(/\b(without|no)\s+(publish|slug|pricing|settings|auth|middleware)\b/gi, "safe-draft")
    .replace(/\b(без|не)\s+(publish|slug|pricing|settings|auth|middleware)\b/gi, "safe-draft")
    .replace(/\s+/g, " ")
    .trim();
}

export function runLocationPageSeoOperatorLoop(input: LocationPageSeoOperatorLoopRequest): LocationPageSeoOperatorLoopReport {
  assertSafeRequest(input);
  ensureDirectory(getOperatorLoopDir());
  ensureDirectory(getOperatorExamplesDir());

  const transitions: OperatorLoopTransition[] = [];
  const routingIntent = getRoutingIntent(input.intent);
  pushTransition(transitions, "task_received", "Accepted a local/test LocationPage safe-draft SEO task.");

  const plannerTask: SkillTaskEnvelope = {
    taskId: `${input.taskId}-planner`,
    taskType: "seo_planning",
    mode: "read_only",
    entity: "LocationPage",
    identifier: input.identifier,
    intent: routingIntent,
  };
  const plannerDecision = routeSkillTask(plannerTask);

  const draftTask: SkillTaskEnvelope = {
    taskId: `${input.taskId}-draft`,
    taskType: "content_drafting",
    mode: "draft_safe",
    entity: "LocationPage",
    identifier: input.identifier,
    intent: routingIntent,
  };
  const draftDecision = routeSkillTask(draftTask);

  const qaTask: SkillTaskEnvelope = {
    taskId: `${input.taskId}-qa`,
    taskType: "qa_review",
    mode: "draft_safe",
    entity: "LocationPage",
    identifier: input.identifier,
    intent: routingIntent,
  };
  const qaDecision = routeSkillTask(qaTask);
  pushTransition(
    transitions,
    "skill_routed",
    `Planner=${plannerDecision.selectedSkill}, drafter=${draftDecision.selectedSkill}, QA=${qaDecision.selectedSkill}.`,
  );

  const plannerExecution = executeSkillTask(plannerTask);
  const plan = pickLocationPagePlan(input.identifier);
  pushTransition(transitions, "plan_built", `Built plan for slug "${plan.slug}" with ${plan.dataNeeds.length} data needs.`);

  const draftExecution = executeSkillTask(draftTask);
  const draft = pickLocationPageDraft(input.identifier);
  pushTransition(
    transitions,
    "draft_generated",
    `Generated draft packet for "${draft.identifier}" with ${draft.drafts.bodySections.length} body sections.`,
  );

  const qaExecution = executeSkillTask(qaTask);
  const qaPacket = pickLocationPageQaPacket(input.identifier);
  pushTransition(transitions, "qa_completed", `Publication QA verdict for "${qaPacket.identifier}" is "${qaPacket.verdict}".`);

  const safeAdminPayload = buildSafeAdminPayloadFromDraft(draft);
  const adminOperation = prepareLocationPageAdminDraftOperation({
    taskId: `${input.taskId}-store`,
    identifier: input.identifier,
    source: "local_test_admin",
    qaOutcome: toPipelineQaOutcome(qaPacket),
    reviewPacketReference: "ai/reports/reviews/publication-qa-review.json",
    currentState: input.currentState,
    adminFormPayload: safeAdminPayload,
  });
  const reviewPacket = adminOperation.reviewPacket;
  pushTransition(
    transitions,
    "review_packet_created",
    `Normalized review packet created with state "${reviewPacket.reviewState}".`,
  );
  pushTransition(
    transitions,
    "draft_stored",
    `Stored safe draft operation via "${input.storageTarget}" without live admin or DB writes.`,
  );

  const { jsonPath, markdownPath } = buildLoopPaths(input.taskId);
  const report: LocationPageSeoOperatorLoopReport = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    task: input,
    architecture: {
      selectedEntity: "LocationPage",
      selectedStorageTarget: input.storageTarget,
      guardrails: [
        "LocationPage only",
        "draft_safe only",
        "no publish",
        "no slug changes",
        "no pricing changes",
        "no settings/auth/middleware changes",
        "local/test storage only",
      ],
      loopSteps: [
        "receive_task",
        "route_skill",
        "build_plan",
        "generate_draft",
        "run_qa",
        "create_review_packet",
        "store_safe_draft",
        "produce_final_summary",
      ],
    },
    routing: {
      planner: plannerDecision,
      drafter: draftDecision,
      qa: qaDecision,
    },
    executions: {
      planner: plannerExecution,
      drafter: draftExecution,
      qa: qaExecution,
    },
    selectedArtifacts: {
      planSlug: plan.slug,
      draftIdentifier: draft.identifier,
      qaVerdict: qaPacket.verdict,
      qaReviewReportPath: "ai/reports/reviews/publication-qa-review.json",
      qaSourceReport: qaPacket.sourceReport,
      adminOperationPath: adminOperation.operationPath,
      reviewPacketPath: reviewPacket.artifacts.reviewPacketPath,
      reviewSummaryPath: reviewPacket.artifacts.markdownSummaryPath,
    },
    safeDraftPayload: safeAdminPayload,
    review: {
      reviewState: reviewPacket.reviewState,
      suggestedNextAction: reviewPacket.suggestedNextAction,
      safeFields: reviewPacket.changes.safeFields,
      blockedFields: reviewPacket.changes.blockedFields,
      qaVerdict: reviewPacket.qaResult.verdict,
      riskLevel: reviewPacket.riskLevel,
    },
    transitions,
    outputs: {
      machineReportPath: toProjectRelative(jsonPath),
      humanSummaryPath: toProjectRelative(markdownPath),
    },
    reusableParts: [
      "skill-runtime registry routing for planner/draft/QA stages",
      "publication-qa-reviewer packets as normalized upstream QA input",
      "review-workflow packet format and states",
      "safe admin draft integration pattern for local/test-only storage",
      "draft-to-safe-field mapping strategy reusable for other entities after field-policy mapping",
    ],
  };

  pushTransition(transitions, "final_summary_ready", "Final machine-readable report and human-readable summary were written.");
  writeJsonReport(jsonPath, report);
  writeTextReport(markdownPath, buildSummary(report));

  appendJsonLine(path.join(getAiLogsDir(), "locationpage-seo-operator-loop.jsonl"), {
    timestamp: report.generatedAt,
    taskId: report.task.taskId,
    identifier: report.task.identifier,
    reviewState: report.review.reviewState,
    qaVerdict: report.review.qaVerdict,
    machineReportPath: report.outputs.machineReportPath,
    humanSummaryPath: report.outputs.humanSummaryPath,
  });

  return report;
}
