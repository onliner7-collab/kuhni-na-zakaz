export type JsonObject = Record<string, unknown>;

export type SafetyCategory = "safe_read" | "safe_draft_write" | "review_required" | "forbidden";

export type ProjectStructureReport = {
  generatedAt: string;
  projectRoot: string;
  keyDirectories: string[];
  keyFiles: string[];
  prismaSchemaPath: string | null;
  adminDirectories: string[];
  adminRouteFiles: string[];
  metadataFiles: string[];
  routeLevelMetadataFiles: string[];
};

export type PrismaFieldMap = {
  name: string;
  type: string;
  isList: boolean;
  isOptional: boolean;
  attributes: string[];
  relation: {
    kind: "relation" | "scalar";
    target?: string;
  };
  safety: SafetyCategory;
};

export type PrismaModelMap = {
  name: string;
  fields: PrismaFieldMap[];
};

export type PrismaEntityMapReport = {
  generatedAt: string;
  schemaPath: string;
  models: PrismaModelMap[];
  focusedEntities: PrismaModelMap[];
};

export type SeoSurfaceEntry = {
  path: string;
  type: "global-layout" | "robots" | "sitemap" | "route-generateMetadata";
  notes: string[];
};

export type SeoSurfaceMapReport = {
  generatedAt: string;
  surfaces: SeoSurfaceEntry[];
};

export type SeoMetadataRiskLevel = "low" | "medium" | "high" | "critical";

export type SeoMetadataSurfaceType =
  | "global-metadata"
  | "robots"
  | "sitemap"
  | "route-generateMetadata";

export type SeoMetadataAuditSurface = {
  path: string;
  surfaceType: SeoMetadataSurfaceType;
  metadataKeys: string[];
  metadataSourceOfTruth: string[];
  affectedEntities: string[];
  riskSignals: string[];
  riskLevel: SeoMetadataRiskLevel;
  reviewRequired: boolean;
  notes: string[];
  suggestedNextActions: string[];
};

export type SeoMetadataEntityAudit = {
  entity: "LocationPage" | "Kitchen" | "BlogPost" | "PortfolioCase";
  routeFile: string;
  seoFieldsPresent: string[];
  liveMetadataFields: string[];
  liveMetadataDependencies: string[];
  metadataSourceOfTruth: string[];
  riskLevel: SeoMetadataRiskLevel;
  safeToDraft: string[];
  reviewOnly: string[];
  notes: string[];
};

export type SeoMetadataRiskMapEntry = {
  surface: string;
  entity: string | null;
  category: "app-level" | "entity-level";
  riskLevel: SeoMetadataRiskLevel;
  trigger: string;
  requiredMode: "read_only" | "review_required";
  reasons: string[];
};

export type SeoMetadataAuditReport = {
  generatedAt: string;
  mode: "read_only";
  sourceInputs: string[];
  appLevel: {
    affectedFiles: string[];
    globalMetadataFiles: string[];
    routeMetadataFiles: string[];
    metadataSourceOfTruth: string[];
    conflicts: string[];
    gaps: string[];
    riskySurfaces: string[];
    surfaces: SeoMetadataAuditSurface[];
  };
  entityLevel: {
    affectedEntities: string[];
    entities: SeoMetadataEntityAudit[];
  };
  summary: {
    affectedFiles: string[];
    affectedEntities: string[];
    metadataSourceOfTruth: string[];
    riskLevel: SeoMetadataRiskLevel;
    suggestedNextActions: string[];
    safeToDraft: string[];
    reviewOnly: string[];
  };
};

export type SeoMetadataRiskMapReport = {
  generatedAt: string;
  mode: "read_only";
  entries: SeoMetadataRiskMapEntry[];
};

export type AdminSurfaceEntry = {
  path: string;
  category: "admin-page" | "admin-api";
  risk: "safe-looking" | "review-required" | "high-risk";
  reasons: string[];
};

export type AdminSurfaceMapReport = {
  generatedAt: string;
  surfaces: AdminSurfaceEntry[];
};

export type RiskSurfaceEntry = {
  name: string;
  path: string;
  source: "policy" | "scanner";
  risk: "high-risk" | "review-required";
  reason: string;
};

export type RiskSurfaceReport = {
  generatedAt: string;
  surfaces: RiskSurfaceEntry[];
};

export type LocationPageInventoryEntry = {
  source: "seed" | "admin-template";
  status: "existing" | "proposed";
  slug: string;
  city: string;
  region: string | null;
  published: boolean | null;
  fieldPresence: {
    title: boolean;
    h1: boolean;
    intro: boolean;
    description: boolean;
    localIntro: boolean;
    seoTitle: boolean;
    seoDescription: boolean;
    ctaHeadline: boolean;
    ctaSubtext: boolean;
  };
  contentCounts: {
    features: number;
    faq: number;
    uniquePoints: number;
    contentBlocks: number;
    images: number;
    areas: number;
    caseSlugs: number;
    reviewIds: number;
  };
  metrics: {
    titleLength: number;
    metaDescriptionLength: number;
    estimatedBodyWords: number;
  };
  gaps: string[];
  riskFlags: string[];
};

export type LocationPageSeoAuditReport = {
  generatedAt: string;
  allowedModes: string[];
  inputs: {
    prismaEntitySource: string;
    routeSource: string;
    adminFormSource: string;
    seedSource: string;
    seoStrategySource: string;
    policySource: string;
  };
  liveSurface: {
    routePath: string;
    metadataPath: string;
    usedFields: string[];
    reviewRequiredFields: string[];
  };
  inventory: LocationPageInventoryEntry[];
  summary: {
    existingPages: number;
    proposedPages: number;
    thinContentPages: number;
    metadataReviewCandidates: number;
    pagesMissingFaq: number;
    pagesMissingLocalProof: number;
  };
};

export type LocationPagePlan = {
  slug: string;
  city: string;
  region: string | null;
  source: "seed" | "admin-template";
  status: "existing" | "proposed";
  pageIntent: string;
  targetLocation: {
    city: string;
    region: string | null;
  };
  recommendedDrafts: {
    title: string;
    h1: string;
    metaDescription: string;
  };
  recommendedBodyOutline: string[];
  recommendedFaqOutline: string[];
  recommendedCtaBlocks: string[];
  recommendedInternalLinks: Array<{
    href: string;
    reason: string;
    priority: "high" | "medium" | "low";
  }>;
  riskFlags: string[];
  dataNeeds: string[];
};

export type LocationPageContentPlansReport = {
  generatedAt: string;
  mode: "read_only" | "draft_safe";
  plans: LocationPagePlan[];
};

export type ContentDraftBodySection = {
  heading: string;
  purpose: string;
  draft: string;
};

export type ContentDraftPacket = {
  entity: "LocationPage" | "Kitchen" | "BlogPost" | "PortfolioCase";
  identifier: string;
  source: "seed" | "admin-template" | "static-template" | "form-template";
  status: "existing" | "proposed" | "template";
  safeMode: "read_only" | "draft_safe";
  inputSummary: {
    titleLike: string;
    slugLike: string;
    categoryOrRegion: string | null;
    trustedFacts: string[];
  };
  drafts: {
    title: string;
    h1: string;
    metaDescription: string;
    bodySections: ContentDraftBodySection[];
    faq: string[];
    cta: string[];
    altTextSuggestions: string[];
    internalLinks: Array<{
      href: string;
      anchor: string;
      reason: string;
    }>;
  };
  reviewRequiredFields: string[];
  riskFlags: string[];
  dataNeeds: string[];
};

export type ContentDraftReport = {
  generatedAt: string;
  entity: "LocationPage" | "Kitchen" | "BlogPost" | "PortfolioCase";
  mode: "read_only" | "draft_safe";
  packets: ContentDraftPacket[];
};

export type QaIssueSeverity = "low" | "medium" | "high" | "critical";

export type QaIssueCategory = "content" | "seo" | "safety";

export type QaIssue = {
  code: string;
  category: QaIssueCategory;
  severity: QaIssueSeverity;
  message: string;
  fields: string[];
};

export type QaReviewVerdict = "PASS" | "NEEDS_REVIEW" | "FAIL";

export type QaReviewPacket = {
  entity: ContentDraftPacket["entity"];
  identifier: string;
  sourceReport: string;
  mode: "read_only" | "draft_safe";
  verdict: QaReviewVerdict;
  riskLevel: QaIssueSeverity;
  checks: {
    contentQuality: {
      wordCount: number;
      structureOk: boolean;
      faqCount: number;
      ctaCount: number;
      internalLinkCount: number;
      duplicateBlocks: number;
    };
    seoQuality: {
      hasTitle: boolean;
      hasH1: boolean;
      hasMetaDescription: boolean;
      hasFaq: boolean;
      hasCta: boolean;
      hasInternalLinks: boolean;
    };
    safetyQuality: {
      modeAllowed: boolean;
      forbiddenFieldsTouched: string[];
      reviewRequiredFields: string[];
      blockedSurfaceHits: string[];
    };
  };
  issues: QaIssue[];
  summary: string;
};

export type QaReviewReport = {
  generatedAt: string;
  scope: "draft-packets";
  inputReports: string[];
  packets: QaReviewPacket[];
  summary: {
    total: number;
    pass: number;
    needsReview: number;
    fail: number;
  };
};

export type DraftSafeEntity = "LocationPage" | "Kitchen" | "BlogPost" | "PortfolioCase";

export type DraftSafeWriteMode = "draft_safe";

export type DraftSafeWriteRequest = {
  entity: DraftSafeEntity;
  identifier: string;
  mode: DraftSafeWriteMode;
  patchPayload: JsonObject;
  currentState?: JsonObject;
};

export type DraftSafeWriteReviewPacket = {
  entity: DraftSafeEntity;
  identifier: string;
  mode: DraftSafeWriteMode;
  oldSummary: string;
  newSummary: string;
  changedFields: string[];
  reviewRequiredFields: string[];
  blockedFields: string[];
  riskLevel: QaIssueSeverity;
  reviewRequired: boolean;
};

export type DraftSafeWriteAttemptLog = {
  timestamp: string;
  entity: DraftSafeEntity | string;
  identifier: string;
  requestedFields: string[];
  allowedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  mode: string;
  result: "applied" | "partial" | "blocked";
};

export type DraftSafeWriteResult = {
  timestamp: string;
  entity: DraftSafeEntity;
  identifier: string;
  mode: DraftSafeWriteMode;
  requestedFields: string[];
  appliedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  result: "applied" | "partial" | "blocked";
  statePath: string | null;
  reviewPacketPath: string;
  attemptPath: string;
  logPath: string;
};

export type EntityDraftWriterMode = "read_only" | "draft_safe" | "review_required";

export type EntityDraftWriterQaOutcome = {
  verdict: QaReviewVerdict;
  sourceReport?: string;
  riskLevel?: QaIssueSeverity;
  summary?: string;
  issues?: QaIssue[];
};

export type EntityDraftWriterRequest = {
  taskId: string;
  mode: EntityDraftWriterMode;
  entity: DraftSafeEntity | "PriceRule" | string;
  identifier: string;
  requestedPatch: JsonObject;
  qaOutcome?: EntityDraftWriterQaOutcome;
  reviewPacketReference?: string | null;
  currentState?: JsonObject;
};

export type EntityDraftWriterStatus = "applied" | "partial" | "blocked" | "read_only" | "review_required";

export type EntityDraftWriterResult = {
  taskId: string;
  timestamp: string;
  status: EntityDraftWriterStatus;
  appliedFields: string[];
  blockedFields: string[];
  entity: string;
  identifier: string;
  mode: EntityDraftWriterMode;
  artifactPath: string | null;
  logPath: string;
  reviewPacketPath: string | null;
  reasons: string[];
};

export type ReviewWorkflowState =
  | "generated"
  | "qa_pass"
  | "needs_review"
  | "blocked"
  | "approved_for_safe_apply"
  | "rejected";

export type ReviewSuggestedNextAction =
  | "run_qa_review"
  | "manual_review"
  | "approve_for_safe_apply"
  | "run_safe_apply"
  | "revise_request"
  | "reject";

export type ReviewPacketNormalized = {
  schemaVersion: 1;
  sourceRequest: EntityDraftWriterRequest;
  task: {
    taskId: string;
    mode: EntityDraftWriterMode;
    requestedAction: "draft_safe_apply_review";
    requestedAt: string;
  };
  entity: {
    name: string;
    identifier: string;
  };
  changes: {
    requestedFields: string[];
    safeFields: string[];
    blockedFields: string[];
    reviewRequiredFields: string[];
    requestedPatch: JsonObject;
    safePatch: JsonObject;
  };
  riskLevel: QaIssueSeverity;
  qaResult: {
    verdict: QaReviewVerdict | "MISSING";
    summary: string | null;
    sourceReport: string | null;
    issues: QaIssue[];
  };
  writerEligibility: {
    eligible: boolean;
    requiresExplicitApproval: boolean;
    allowedMode: boolean;
    safeEntity: boolean;
    safeFieldsAvailable: boolean;
    qaNotFail: boolean;
    reasons: string[];
  };
  reviewState: ReviewWorkflowState;
  suggestedNextAction: ReviewSuggestedNextAction;
  reasons: string[];
  artifacts: {
    reviewPacketPath: string;
    markdownSummaryPath: string;
    approvalArtifactPath: string | null;
    rejectionArtifactPath: string | null;
    qaReferencePath: string | null;
  };
};

export type ApprovalArtifact = {
  schemaVersion: 1;
  taskId: string;
  reviewPacketPath: string;
  reviewState: "approved_for_safe_apply";
  approvalMarker: string;
  approvedBy: string;
  approvedAt: string;
  note: string | null;
  safeApplyEligible: boolean;
  allowedFields: string[];
  blockedFields: string[];
  constraints: string[];
  applyResult: EntityDraftWriterResult | null;
};

export type RejectionArtifact = {
  schemaVersion: 1;
  taskId: string;
  reviewPacketPath: string;
  reviewState: "rejected";
  rejectedBy: string;
  rejectedAt: string;
  reason: string;
  blockedFields: string[];
  suggestedNextAction: "revise_request";
};

export type ReviewWorkflowApprovalRequest = {
  reviewPacketPath: string;
  approvedBy: string;
  note?: string;
};

export type ReviewWorkflowRejectionRequest = {
  reviewPacketPath: string;
  rejectedBy: string;
  reason: string;
};

export type ReviewWorkflowApplyRequest = {
  approvalArtifactPath: string;
};

export type EntityDraftWriterEvaluation = {
  request: EntityDraftWriterRequest;
  timestamp: string;
  requestedFields: string[];
  allowedFields: string[];
  blockedFields: string[];
  reviewRequiredFields: string[];
  safePatch: JsonObject;
  qaOutcome: EntityDraftWriterQaOutcome | null;
  validationReasons: string[];
  writerEligible: boolean;
  modeAllowsWrite: boolean;
  hasQaFailure: boolean;
  proposedStatus: EntityDraftWriterResult["status"];
  reasons: string[];
};
