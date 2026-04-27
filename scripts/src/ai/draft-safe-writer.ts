import fs from "node:fs";
import path from "node:path";
import { getAiLogsDir, getAiPoliciesDir, getAiReportsDir, getProjectRoot } from "./shared/paths.js";
import { ensureDirectory, readJsonFile, writeJsonReport } from "./shared/fs-utils.js";
import type {
  DraftSafeEntity,
  DraftSafeWriteAttemptLog,
  DraftSafeWriteRequest,
  DraftSafeWriteResult,
  DraftSafeWriteReviewPacket,
  JsonObject,
  QaIssueSeverity,
} from "./shared/types.js";

type ModePolicy = {
  id: string;
  writes_allowed: boolean;
  allowed_actions: string[];
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
};

type ForbiddenAction = {
  id: string;
};

type ActionsPolicyFile = {
  forbidden_actions: ForbiddenAction[];
};

type ReviewPolicyFile = {
  review_rules: {
    first_wave_review_targets: string[];
    default_risk_levels: Record<string, string>;
  };
};

const ALLOWED_ENTITIES = new Set<DraftSafeEntity>(["LocationPage", "Kitchen", "BlogPost", "PortfolioCase"]);

const BLOCKED_FIELD_ACTIONS: Array<{ action: string; matches: (field: string) => boolean }> = [
  { action: "change_slug", matches: (field) => field === "slug" },
  { action: "change_publish_flag", matches: (field) => field === "published" || field === "publishedAt" },
  {
    action: "edit_prices",
    matches: (field) =>
      field === "priceFrom" ||
      field === "priceTo" ||
      field === "deliveryCost" ||
      field === "deliveryDays" ||
      field === "measureCost" ||
      field === "timelineText",
  },
  { action: "change_sensitive_metadata", matches: (field) => field === "seoTitle" || field === "seoDescription" },
  {
    action: "edit_auth",
    matches: (field) => /auth|token|password|session|role/i.test(field),
  },
  {
    action: "edit_settings",
    matches: (field) => /settings?/i.test(field),
  },
  {
    action: "edit_middleware",
    matches: (field) => /middleware/i.test(field),
  },
];

function getTimestampToken(iso: string): string {
  return iso.replace(/[:.]/g, "-");
}

function getModePolicyMap(): Map<string, ModePolicy> {
  const payload = readJsonFile<ModesPolicyFile>(path.join(getAiPoliciesDir(), "modes.json"));
  return new Map(payload.modes.map((mode) => [mode.id, mode]));
}

function getEntityPolicyMap(): Map<string, EntityPolicy> {
  const payload = readJsonFile<EntitiesPolicyFile>(path.join(getAiPoliciesDir(), "entities.json"));
  return new Map(payload.entities.map((entity) => [entity.name, entity]));
}

function getForbiddenActions(): Set<string> {
  const payload = readJsonFile<ActionsPolicyFile>(path.join(getAiPoliciesDir(), "actions.json"));
  return new Set(payload.forbidden_actions.map((action) => action.id));
}

function getReviewTargets(): {
  targets: Set<string>;
  riskDefaults: Record<string, string>;
} {
  const payload = readJsonFile<ReviewPolicyFile>(path.join(getAiPoliciesDir(), "review.json"));
  return {
    targets: new Set(payload.review_rules.first_wave_review_targets),
    riskDefaults: payload.review_rules.default_risk_levels,
  };
}

function summarizeState(value: JsonObject | undefined): string {
  if (!value || Object.keys(value).length === 0) {
    return "No prior draft state was provided.";
  }

  const parts = Object.entries(value)
    .slice(0, 6)
    .map(([key, fieldValue]) => {
      if (Array.isArray(fieldValue)) return `${key}=[${fieldValue.length} items]`;
      if (fieldValue && typeof fieldValue === "object") return `${key}={object}`;
      return `${key}=${String(fieldValue).slice(0, 60)}`;
    });

  return parts.join("; ");
}

function deriveRiskLevel(
  blockedFields: string[],
  reviewRequiredFields: string[],
  riskDefaults: Record<string, string>,
): QaIssueSeverity {
  if (blockedFields.some((field) => field === "slug" || field === "published" || field === "publishedAt")) return "critical";
  if (
    blockedFields.some((field) =>
      ["priceFrom", "priceTo", "deliveryCost", "deliveryDays", "measureCost", "seoTitle", "seoDescription"].includes(field),
    )
  ) {
    return "high";
  }
  if (reviewRequiredFields.length > 0) {
    return (riskDefaults.content_copy_update as QaIssueSeverity | undefined) ?? "medium";
  }
  return "low";
}

function classifyFields(
  request: DraftSafeWriteRequest,
  entityPolicies: Map<string, EntityPolicy>,
  modePolicies: Map<string, ModePolicy>,
  forbiddenActions: Set<string>,
  reviewTargets: Set<string>,
): {
  appliedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  sanitizedPatch: JsonObject;
  result: "applied" | "partial" | "blocked";
} {
  const requestedFields = Object.keys(request.patchPayload);
  const entityPolicy = entityPolicies.get(request.entity);
  const modePolicy = modePolicies.get(request.mode);

  if (!ALLOWED_ENTITIES.has(request.entity)) {
    return {
      appliedFields: [],
      blockedFields: requestedFields,
      reviewRequiredFields: [],
      sanitizedPatch: {},
      result: "blocked",
    };
  }

  if (!entityPolicy || entityPolicy.high_risk) {
    return {
      appliedFields: [],
      blockedFields: requestedFields,
      reviewRequiredFields: [],
      sanitizedPatch: {},
      result: "blocked",
    };
  }

  if (
    !modePolicy ||
    request.mode !== "draft_safe" ||
    !modePolicy.writes_allowed ||
    !modePolicy.allowed_actions.includes("update_draft_safe_fields")
  ) {
    return {
      appliedFields: [],
      blockedFields: requestedFields,
      reviewRequiredFields: [],
      sanitizedPatch: {},
      result: "blocked",
    };
  }

  const draftSafeFields = new Set(entityPolicy.field_groups?.draft_safe ?? []);
  const entityReviewFields = new Set(entityPolicy.field_groups?.review_required ?? []);
  const blockedFields = new Set<string>();
  const reviewRequiredFields = new Set<string>();
  const appliedFields: string[] = [];
  const sanitizedPatch: JsonObject = {};

  for (const field of requestedFields) {
    const isActionBlocked = BLOCKED_FIELD_ACTIONS.some(
      (rule) => forbiddenActions.has(rule.action) && rule.matches(field),
    );
    if (isActionBlocked) {
      blockedFields.add(field);
      continue;
    }

    if (entityReviewFields.has(field) || reviewTargets.has(`${request.entity}.${field}`) || reviewTargets.has(`${request.entity}.*`)) {
      reviewRequiredFields.add(field);
      continue;
    }

    if (!draftSafeFields.has(field)) {
      blockedFields.add(field);
      continue;
    }

    sanitizedPatch[field] = request.patchPayload[field];
    appliedFields.push(field);
  }

  let result: "applied" | "partial" | "blocked" = "applied";
  if (appliedFields.length === 0) result = "blocked";
  else if (blockedFields.size > 0 || reviewRequiredFields.size > 0) result = "partial";

  return {
    appliedFields,
    blockedFields: [...blockedFields].sort(),
    reviewRequiredFields: [...reviewRequiredFields].sort(),
    sanitizedPatch,
    result,
  };
}

function appendJsonLine(targetPath: string, payload: unknown): void {
  ensureDirectory(path.dirname(targetPath));
  fs.appendFileSync(targetPath, `${JSON.stringify(payload)}\n`, "utf8");
}

export function applyDraftSafePatch(request: DraftSafeWriteRequest): DraftSafeWriteResult {
  const timestamp = new Date().toISOString();
  const token = getTimestampToken(timestamp);
  const projectRoot = getProjectRoot();
  const reportsDir = getAiReportsDir();
  const logsDir = getAiLogsDir();
  const modePolicies = getModePolicyMap();
  const entityPolicies = getEntityPolicyMap();
  const forbiddenActions = getForbiddenActions();
  const { targets: reviewTargets, riskDefaults } = getReviewTargets();

  const requestedFields = Object.keys(request.patchPayload);
  const classification = classifyFields(request, entityPolicies, modePolicies, forbiddenActions, reviewTargets);
  const previousState = (request.currentState ?? {}) as JsonObject;
  const mergedState = {
    ...previousState,
    ...classification.sanitizedPatch,
  } as JsonObject;

  const riskLevel = deriveRiskLevel(classification.blockedFields, classification.reviewRequiredFields, riskDefaults);
  const reviewPacket: DraftSafeWriteReviewPacket = {
    entity: request.entity,
    identifier: request.identifier,
    mode: request.mode,
    oldSummary: summarizeState(previousState),
    newSummary: summarizeState(mergedState),
    changedFields: classification.appliedFields,
    reviewRequiredFields: classification.reviewRequiredFields,
    blockedFields: classification.blockedFields,
    riskLevel,
    reviewRequired: classification.reviewRequiredFields.length > 0 || classification.blockedFields.length > 0,
  };

  const reviewPacketPath = path.join(
    reportsDir,
    "reviews",
    `draft-safe-write-review-${token}-${request.entity}-${request.identifier}.json`,
  );
  const attemptPath = path.join(
    reportsDir,
    "writes",
    "attempts",
    `draft-safe-write-attempt-${token}-${request.entity}-${request.identifier}.json`,
  );
  const statePath =
    classification.appliedFields.length > 0
      ? path.join(reportsDir, "writes", "state", request.entity, `${request.identifier}.draft.json`)
      : null;
  const logPath = path.join(logsDir, "draft-safe-writer.jsonl");

  const attemptLog: DraftSafeWriteAttemptLog = {
    timestamp,
    entity: request.entity,
    identifier: request.identifier,
    requestedFields,
    allowedFields: classification.appliedFields,
    blockedFields: classification.blockedFields,
    reviewRequiredFields: classification.reviewRequiredFields,
    mode: request.mode,
    result: classification.result,
  };

  if (statePath) {
    writeJsonReport(statePath, {
      entity: request.entity,
      identifier: request.identifier,
      mode: request.mode,
      updatedAt: timestamp,
      draftState: mergedState,
    });
  }

  writeJsonReport(reviewPacketPath, reviewPacket);
  writeJsonReport(attemptPath, {
    request,
    reviewPacket,
    appliedPatch: classification.sanitizedPatch,
    result: classification.result,
  });
  appendJsonLine(logPath, attemptLog);

  return {
    timestamp,
    entity: request.entity,
    identifier: request.identifier,
    mode: request.mode,
    requestedFields,
    appliedFields: classification.appliedFields,
    blockedFields: classification.blockedFields,
    reviewRequiredFields: classification.reviewRequiredFields,
    result: classification.result,
    statePath: statePath ? path.relative(projectRoot, statePath).replaceAll("\\", "/") : null,
    reviewPacketPath: path.relative(projectRoot, reviewPacketPath).replaceAll("\\", "/"),
    attemptPath: path.relative(projectRoot, attemptPath).replaceAll("\\", "/"),
    logPath: path.relative(projectRoot, logPath).replaceAll("\\", "/"),
  };
}
