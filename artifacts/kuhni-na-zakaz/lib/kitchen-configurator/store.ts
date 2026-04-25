// ──────────────────────────────────────────────────────
// Хранилище состояния конфигуратора
// Этап 1: базовый скелет (React useReducer)
// 3D, анимации, IndexedDB — следующие этапы
// ──────────────────────────────────────────────────────

import type {
  ConfiguratorAction,
  ConfiguratorStep,
  MaterialsConfig,
  PriceBreakdown,
  RoomConfig,
  VisualProjectState,
} from "./types";

// ── Начальные значения ─────────────────────────────────

export const DEFAULT_ROOM_CONFIG: RoomConfig = {
  dimensions: { widthCm: 300, depthCm: 250, heightCm: 250 },
  openings: [],
  protrusions: [],
  communications: [],
};

export const DEFAULT_MATERIALS_CONFIG: MaterialsConfig = {
  facadeSlug: "",
  countertopSlug: "",
  skinalSlug: "",
  handleSlug: "",
  appliances: [],
};

export const DEFAULT_PRICE_BREAKDOWN: PriceBreakdown = {
  modules: 0,
  facades: 0,
  countertop: 0,
  skinal: 0,
  handles: 0,
  mechanisms: 0,
  appliances: 0,
  installation: 0,
  total: 0,
};

export function createInitialState(): VisualProjectState {
  return {
    name: "Мой проект",
    currentStep: "room",
    roomConfig: DEFAULT_ROOM_CONFIG,
    placedModules: [],
    materialsConfig: DEFAULT_MATERIALS_CONFIG,
    priceBreakdown: DEFAULT_PRICE_BREAKDOWN,
    warnings: [],
    isDirty: false,
  };
}

// ── Редьюсер ────────────────────────────────────────────

export function configuratorReducer(
  state: VisualProjectState,
  action: ConfiguratorAction
): VisualProjectState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "UPDATE_ROOM":
      return {
        ...state,
        roomConfig: { ...state.roomConfig, ...action.payload },
        isDirty: true,
      };

    case "APPLY_TEMPLATE":
      return {
        ...state,
        selectedTemplateSlug: action.payload.slug,
        placedModules: action.payload.modulesConfig,
        isDirty: true,
      };

    case "ADD_MODULE":
      return {
        ...state,
        placedModules: [...state.placedModules, action.payload],
        isDirty: true,
      };

    case "REMOVE_MODULE":
      return {
        ...state,
        placedModules: state.placedModules.filter((m) => m.id !== action.payload),
        isDirty: true,
      };

    case "MOVE_MODULE":
      return {
        ...state,
        placedModules: state.placedModules.map((m) =>
          m.id === action.payload.id
            ? { ...m, offsetCm: action.payload.offsetCm, wallSide: action.payload.wallSide }
            : m
        ),
        isDirty: true,
      };

    case "UPDATE_MATERIALS":
      return {
        ...state,
        materialsConfig: { ...state.materialsConfig, ...action.payload },
        isDirty: true,
      };

    case "SET_WARNINGS":
      return { ...state, warnings: action.payload };

    case "UPDATE_PRICE":
      return { ...state, priceBreakdown: action.payload };

    case "LOAD_PROJECT":
      return { ...action.payload, isDirty: false };

    case "MARK_SAVED":
      return {
        ...state,
        id: action.payload.id,
        sessionId: action.payload.sessionId,
        isDirty: false,
        lastSavedAt: action.payload.savedAt,
      };

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

// ── Вспомогательные селекторы ──────────────────────────

export function selectTotalModuleCount(state: VisualProjectState): number {
  return state.placedModules.length;
}

export function selectHasErrors(state: VisualProjectState): boolean {
  return state.warnings.some((w) => w.level === "error");
}

export function selectCanProceedToStep(
  state: VisualProjectState,
  step: ConfiguratorStep
): boolean {
  const order: ConfiguratorStep[] = [
    "room",
    "template",
    "modules",
    "materials",
    "view3d",
    "summary",
  ];
  const current = order.indexOf(state.currentStep);
  const target = order.indexOf(step);

  if (target <= current) return true;
  if (selectHasErrors(state)) return false;

  switch (step) {
    case "template":
      return (
        state.roomConfig.dimensions.widthCm > 0 &&
        state.roomConfig.dimensions.depthCm > 0
      );
    case "modules":
      return !!state.selectedTemplateSlug || state.placedModules.length > 0;
    case "materials":
      return state.placedModules.length > 0;
    case "view3d":
      return state.placedModules.length > 0;
    case "summary":
      return state.placedModules.length > 0;
    default:
      return true;
  }
}
