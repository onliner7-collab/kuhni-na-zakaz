import path from "node:path";
import { scanAdminSurfaces } from "./admin-surface-scanner.js";
import { generateContentDraftReports } from "./content-draft-generator.js";
import { generateLocationPagePlannerReports } from "./locationpage-planner.js";
import { mapPrismaEntities } from "./prisma-entity-mapper.js";
import { scanProjectStructure } from "./project-structure-scanner.js";
import { runPublicationQaReview } from "./publication-qa-reviewer.js";
import { runEntityDraftWriter } from "./entity-draft-writer.js";
import { runSeoMetadataAudit } from "./seo-metadata-auditor.js";
import { readJsonFile, writeJsonReport } from "./shared/fs-utils.js";
import { getAiReportsDir, getProjectRoot } from "./shared/paths.js";
import type { EntityDraftWriterRequest, EntityDraftWriterResult, JsonObject } from "./shared/types.js";

type SkillMode = "read_only" | "draft_safe" | "review_required";
type SafetyLevel = "low" | "medium" | "high" | "critical";

type RegistrySchemaProperty = {
  type?: string;
  const?: string;
  enum?: string[];
};

type RegistrySchema = {
  type: "object";
  required?: string[];
  properties?: Record<string, RegistrySchemaProperty>;
};

type SkillRegistryEntry = {
  name: string;
  description: string;
  allowed_modes: SkillMode[];
  supported_entities: string[];
  safety_level: SafetyLevel;
  invokes_writer: boolean;
  requires_qa: boolean;
  entrypoint: string;
  input_schema: RegistrySchema;
  output_schema: RegistrySchema;
};

type RoutingRule = {
  id: string;
  priority: number;
  match: {
    task_type_any?: string[];
    entity_any?: string[];
    requested_fields_any?: string[];
    intent_keywords_any?: string[];
  };
  select_skill: string;
};

type SkillRegistry = {
  version: number;
  model: string;
  skills: SkillRegistryEntry[];
  routing: {
    protected_field_patterns: string[];
    protected_intent_keywords: string[];
    rules: RoutingRule[];
  };
};

export type SkillTaskEnvelope = {
  taskId: string;
  taskType: string;
  mode: SkillMode;
  entity?: string;
  skill?: string;
  identifier?: string;
  intent?: string;
  requestedPatch?: JsonObject;
  requestedFields?: string[];
  qaOutcome?: EntityDraftWriterRequest["qaOutcome"];
  reviewPacketReference?: string | null;
  currentState?: JsonObject;
};

export type SkillRoutingDecision = {
  taskId: string;
  selectedSkill: string;
  mode: SkillMode;
  entity: string | null;
  matchedRuleId: string | null;
  reasons: string[];
};

export type SkillExecutionResult = {
  taskId: string;
  skill: string;
  mode: SkillMode;
  entity: string | null;
  status: "completed";
  decision: SkillRoutingDecision;
  result: Record<string, unknown>;
};

function getRegistryPath(): string {
  return path.join(getProjectRoot(), "ai", "skills", "registry.json");
}

export function loadSkillRegistry(): SkillRegistry {
  return readJsonFile<SkillRegistry>(getRegistryPath());
}

function getRequestedFields(task: SkillTaskEnvelope): string[] {
  if (task.requestedFields && task.requestedFields.length > 0) {
    return [...new Set(task.requestedFields)];
  }

  if (task.requestedPatch) {
    return Object.keys(task.requestedPatch);
  }

  return [];
}

function assertSchema(task: SkillTaskEnvelope, schema: RegistrySchema, context: string): void {
  for (const key of schema.required ?? []) {
    if (!(key in task) || task[key as keyof SkillTaskEnvelope] == null) {
      throw new Error(`${context}: missing required field "${key}"`);
    }
  }

  for (const [key, property] of Object.entries(schema.properties ?? {})) {
    const value = task[key as keyof SkillTaskEnvelope];
    if (value == null) continue;

    if (property.const && value !== property.const) {
      throw new Error(`${context}: field "${key}" must equal "${property.const}"`);
    }

    if (property.enum && !property.enum.includes(String(value))) {
      throw new Error(`${context}: field "${key}" must be one of ${property.enum.join(", ")}`);
    }

    if (property.type === "object" && typeof value !== "object") {
      throw new Error(`${context}: field "${key}" must be an object`);
    }

    if (property.type === "array" && !Array.isArray(value)) {
      throw new Error(`${context}: field "${key}" must be an array`);
    }

    if (property.type === "string" && typeof value !== "string") {
      throw new Error(`${context}: field "${key}" must be a string`);
    }
  }
}

function matchesRule(task: SkillTaskEnvelope, rule: RoutingRule): boolean {
  const requestedFields = getRequestedFields(task);
  const intent = task.intent?.toLowerCase() ?? "";

  if (rule.match.task_type_any && !rule.match.task_type_any.includes(task.taskType)) {
    return false;
  }

  if (rule.match.entity_any && (!task.entity || !rule.match.entity_any.includes(task.entity))) {
    return false;
  }

  if (
    rule.match.requested_fields_any &&
    !requestedFields.some((field) => rule.match.requested_fields_any?.includes(field))
  ) {
    return false;
  }

  if (
    rule.match.intent_keywords_any &&
    !rule.match.intent_keywords_any.some((keyword) => intent.includes(keyword.toLowerCase()))
  ) {
    return false;
  }

  return true;
}

export function routeSkillTask(task: SkillTaskEnvelope, registry = loadSkillRegistry()): SkillRoutingDecision {
  const explicitSkill = task.skill
    ? registry.skills.find((skill) => skill.name === task.skill)
    : null;

  if (explicitSkill) {
    if (!explicitSkill.allowed_modes.includes(task.mode)) {
      throw new Error(`Skill "${explicitSkill.name}" does not allow mode "${task.mode}"`);
    }
    if (
      task.entity &&
      explicitSkill.supported_entities.length > 0 &&
      !explicitSkill.supported_entities.includes(task.entity)
    ) {
      throw new Error(`Skill "${explicitSkill.name}" does not support entity "${task.entity}"`);
    }

    assertSchema(task, explicitSkill.input_schema, explicitSkill.name);
    return {
      taskId: task.taskId,
      selectedSkill: explicitSkill.name,
      mode: task.mode,
      entity: task.entity ?? null,
      matchedRuleId: null,
      reasons: ["explicit_skill_requested"],
    };
  }

  const selectedRule = [...registry.routing.rules]
    .sort((left, right) => right.priority - left.priority)
    .find((rule) => matchesRule(task, rule));

  if (!selectedRule) {
    throw new Error(`No registry routing rule matched task "${task.taskId}" (${task.taskType})`);
  }

  const selectedSkill = registry.skills.find((skill) => skill.name === selectedRule.select_skill);
  if (!selectedSkill) {
    throw new Error(`Registry rule "${selectedRule.id}" points to unknown skill "${selectedRule.select_skill}"`);
  }

  if (!selectedSkill.allowed_modes.includes(task.mode)) {
    throw new Error(`Routed skill "${selectedSkill.name}" does not allow mode "${task.mode}"`);
  }

  if (
    task.entity &&
    selectedSkill.supported_entities.length > 0 &&
    !selectedSkill.supported_entities.includes(task.entity)
  ) {
    throw new Error(`Routed skill "${selectedSkill.name}" does not support entity "${task.entity}"`);
  }

  assertSchema(task, selectedSkill.input_schema, selectedSkill.name);

  return {
    taskId: task.taskId,
    selectedSkill: selectedSkill.name,
    mode: task.mode,
    entity: task.entity ?? null,
    matchedRuleId: selectedRule.id,
    reasons: [`matched_rule:${selectedRule.id}`],
  };
}

function buildExecutionArtifactFileName(taskId: string): string {
  return `${taskId.replace(/[^a-zA-Z0-9_-]+/g, "-")}.json`;
}

function writeExecutionArtifact(taskId: string, payload: unknown): string {
  const targetPath = path.join(getAiReportsDir(), "skill-executions", buildExecutionArtifactFileName(taskId));
  writeJsonReport(targetPath, payload);
  return path.relative(getProjectRoot(), targetPath).replaceAll("\\", "/");
}

function executePricingRiskGuard(task: SkillTaskEnvelope, decision: SkillRoutingDecision): Record<string, unknown> {
  const requestedFields = getRequestedFields(task);
  const reasons: string[] = [];
  const blockedFields = requestedFields.filter((field) =>
    [
      "slug",
      "published",
      "publishedAt",
      "priceFrom",
      "priceTo",
      "deliveryCost",
      "deliveryDays",
      "measureCost",
      "timelineText",
      "seoTitle",
      "seoDescription",
    ].includes(field),
  );

  if (task.entity === "PriceRule") reasons.push("high_risk_entity");
  if (blockedFields.length > 0) reasons.push("protected_fields_requested");
  if ((task.intent ?? "").match(/pricing|publish|slug|auth|settings|middleware/i)) reasons.push("protected_intent");
  if (reasons.length === 0) reasons.push("manual_review_required");

  const decisionType = blockedFields.length > 0 || task.entity === "PriceRule" ? "blocked" : "review_required";
  const result = {
    skill: "pricing-risk-guard",
    decision: decisionType,
    reasons,
    blockedFields,
    reviewedEntity: task.entity ?? null,
    modeRequested: task.mode,
  };

  const artifactPath = writeExecutionArtifact(task.taskId, {
    task,
    routingDecision: decision,
    result,
  });

  return {
    ...result,
    artifactPath,
  };
}

function executeProjectStructureReader(): Record<string, unknown> {
  const report = scanProjectStructure();
  const reportPath = path.join(getAiReportsDir(), "project-structure.json");
  writeJsonReport(reportPath, report);

  return {
    skill: "project-structure-reader",
    reportPath: "ai/reports/project-structure.json",
    keyDirectories: report.keyDirectories,
  };
}

function executePrismaEntityMapper(): Record<string, unknown> {
  const report = mapPrismaEntities();
  const reportPath = path.join(getAiReportsDir(), "prisma-entity-map.json");
  writeJsonReport(reportPath, report);

  return {
    skill: "prisma-entity-mapper",
    reportPath: "ai/reports/prisma-entity-map.json",
    focusedEntities: report.focusedEntities.map((entity) => entity.name),
  };
}

function executeLocationPagePlanner(mode: SkillMode): Record<string, unknown> {
  const result = generateLocationPagePlannerReports(mode === "draft_safe" ? "draft_safe" : "read_only");
  return {
    skill: "locationpage-seo-planner",
    auditPath: "ai/reports/locationpage-seo-audit.json",
    plansPath: "ai/reports/locationpage-content-plans.json",
    gapReportPath: "ai/reports/locationpage-gap-report.md",
    existingPages: result.audit.summary.existingPages,
    proposedPages: result.audit.summary.proposedPages,
  };
}

function executeContentDraftGenerator(mode: SkillMode): Record<string, unknown> {
  const result = generateContentDraftReports(mode === "read_only" ? "read_only" : "draft_safe");
  return {
    skill: "content-draft-generator",
    summaryPath: "ai/reports/drafts/content-draft-summary.md",
    reportPaths: [
      "ai/reports/drafts/locationpage-drafts.json",
      "ai/reports/drafts/kitchen-drafts.json",
      "ai/reports/drafts/blogpost-drafts.json",
      "ai/reports/drafts/portfoliocase-drafts.json",
    ],
    counts: {
      locationPage: result.locationPage.packets.length,
      kitchen: result.kitchen.packets.length,
      blogPost: result.blogPost.packets.length,
      portfolioCase: result.portfolioCase.packets.length,
    },
  };
}

function executeEntityDraftWriter(task: SkillTaskEnvelope): Record<string, unknown> {
  const request: EntityDraftWriterRequest = {
    taskId: task.taskId,
    mode: task.mode,
    entity: task.entity ?? "",
    identifier: task.identifier ?? "",
    requestedPatch: task.requestedPatch ?? {},
    qaOutcome: task.qaOutcome,
    reviewPacketReference: task.reviewPacketReference,
    currentState: task.currentState,
  };
  const result: EntityDraftWriterResult = runEntityDraftWriter(request);

  return {
    skill: "entity-draft-writer",
    result,
  };
}

function executeSeoMetadataAuditor(): Record<string, unknown> {
  const result = runSeoMetadataAudit();
  return {
    skill: "seo-metadata-auditor",
    metadataAuditPath: "ai/reports/seo/metadata-audit.json",
    summaryPath: "ai/reports/seo/metadata-audit-summary.md",
    riskMapPath: "ai/reports/seo/live-seo-risk-map.json",
    riskLevel: result.metadataAudit.summary.riskLevel,
  };
}

function executePublicationQaReviewer(): Record<string, unknown> {
  const result = runPublicationQaReview();
  return {
    skill: "publication-qa-reviewer",
    reviewPath: "ai/reports/reviews/publication-qa-review.json",
    summaryPath: "ai/reports/reviews/publication-qa-summary.md",
    summary: result.summary,
  };
}

function executeAdminRouteSurfaceMapper(): Record<string, unknown> {
  const report = scanAdminSurfaces();
  const reportPath = path.join(getAiReportsDir(), "admin-surface-map.json");
  writeJsonReport(reportPath, report);

  return {
    skill: "admin-route-surface-mapper",
    reportPath: "ai/reports/admin-surface-map.json",
    surfaceCount: report.surfaces.length,
  };
}

export function executeSkillTask(task: SkillTaskEnvelope, registry = loadSkillRegistry()): SkillExecutionResult {
  const decision = routeSkillTask(task, registry);

  let result: Record<string, unknown>;
  switch (decision.selectedSkill) {
    case "project-structure-reader":
      result = executeProjectStructureReader();
      break;
    case "prisma-entity-mapper":
      result = executePrismaEntityMapper();
      break;
    case "locationpage-seo-planner":
      result = executeLocationPagePlanner(task.mode);
      break;
    case "content-draft-generator":
      result = executeContentDraftGenerator(task.mode);
      break;
    case "entity-draft-writer":
      result = executeEntityDraftWriter(task);
      break;
    case "seo-metadata-auditor":
      result = executeSeoMetadataAuditor();
      break;
    case "publication-qa-reviewer":
      result = executePublicationQaReviewer();
      break;
    case "pricing-risk-guard":
      result = executePricingRiskGuard(task, decision);
      break;
    case "admin-route-surface-mapper":
      result = executeAdminRouteSurfaceMapper();
      break;
    default:
      throw new Error(`No executor is bound for skill "${decision.selectedSkill}"`);
  }

  const executionResult: SkillExecutionResult = {
    taskId: task.taskId,
    skill: decision.selectedSkill,
    mode: decision.mode,
    entity: decision.entity,
    status: "completed",
    decision,
    result,
  };

  writeExecutionArtifact(task.taskId, executionResult);
  return executionResult;
}
