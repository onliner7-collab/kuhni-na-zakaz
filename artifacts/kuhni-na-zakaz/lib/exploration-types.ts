export type RouteFamily =
  | "home"
  | "hub"
  | "catalog"
  | "style"
  | "scenario"
  | "material"
  | "hardware"
  | "location"
  | "portfolio"
  | "blog"
  | "service"
  | "trust"
  | "utility";

export type TransitionStatus =
  | "active"
  | "planned"
  | "blocked_evidence"
  | "disabled";

export type TransitionAction =
  | "PARENT"
  | "DEEPEN"
  | "COMPARE"
  | "PROOF"
  | "CROSS_FAMILY"
  | "CONVERT"
  | "SUPPORT";

export type EvidenceStatus =
  | "verified"
  | "ai_concept"
  | "technical_illustration"
  | "process_illustration"
  | "unknown"
  | "evidence_required"
  | "not_applicable";

export interface ExploreContextState {
  layout?: string;
  style?: string;
  materials?: string[];
  hardware?: string[];
  scenario?: string;
  location?: string;
  budgetIntent?: string;
  evidencePreference?: "ideas" | "real";
  sourceRoute: string;
  lastMeaningfulAction: string;
}

export type ExploreContextPatch = Partial<ExploreContextState>;

export interface RouteArchitectureEntry {
  route: string;
  family: RouteFamily;
  tier: "A" | "B" | "C" | "D";
  parentHub: string | null;
  ownedIntent: string;
  supportingIntents: string[];
  mustNotOwn: string[];
  primaryUserQuestion: string;
  entryContexts: string[];
  decisionPoint: string;
  visualRole: string;
  proofRequirement: string;
  conversionPath: string;
  fallbackHub: string;
  recommendedWave: number;
  status: "approved" | "evidence_required";
}

export interface TransitionEntryV2 {
  id: string;
  fromRoute: string;
  fromState: string;
  userQuestion: string;
  actionType: TransitionAction;
  anchorRu: string;
  toRoute: string;
  contextPatch?: ExploreContextPatch;
  reasonRu: string;
  priority: number;
  requiresEvidence: boolean;
  evidenceStatus: EvidenceStatus;
  fallbackRoute: string;
  analyticsEvent: ExplorationAnalyticsEvent;
  status: TransitionStatus;
}

export type ExplorationAnalyticsEvent =
  | "exploration_entry"
  | "exploration_select"
  | "exploration_compare"
  | "exploration_proof_open"
  | "exploration_transition_click"
  | "exploration_context_clear"
  | "lead_open_with_context";

export interface ExplorationAnalyticsPayload {
  source_route?: string;
  source_family?: RouteFamily;
  from_state?: string;
  action_type?: TransitionAction;
  target_route?: string;
  selected_dimension?: string;
  evidence_preference?: "ideas" | "real";
}
