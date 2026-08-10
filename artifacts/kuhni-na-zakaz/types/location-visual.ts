export type LocationArchetype =
  | "regional-center"
  | "family-center"
  | "compact-industrial"
  | "minsk-satellite"
  | "house-and-apartment"
  | "house-and-dacha"
  | "route-planning"
  | "compact-kitchen";

export type LocationVisualSourceType =
  | "ai-concept"
  | "3d-visualization"
  | "real-project"
  | "process-illustration";

export interface LocationVisualContract {
  route: `/locations/${string}`;
  city: string;
  archetype: LocationArchetype;
  userQuestion: string;
  uniquePromise: string;
  visualLogic: readonly [string, string, string, string];
  primaryRoute: string;
}

export interface LocationVisualState {
  id: string;
  controlLabelRu: string;
  titleRu: string;
  consequenceRu: string;
  image: string;
  avifImage: string;
  altRu: string;
  sourceType: LocationVisualSourceType;
  disclosureRu: string;
  nextRoutes: string[];
}

export interface LocationVisualSeries extends LocationVisualContract {
  seriesId: string;
  initialStateId: string;
  states: LocationVisualState[];
}
