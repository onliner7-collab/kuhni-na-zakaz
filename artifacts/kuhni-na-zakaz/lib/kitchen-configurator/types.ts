// ──────────────────────────────────────────────────────
// Типы для визуального конфигуратора кухни
// Этап 1: Product Foundation
// ──────────────────────────────────────────────────────

// ── Помещение ──────────────────────────────────────────

export interface RoomDimensions {
  widthCm: number;
  depthCm: number;
  heightCm: number;
}

export interface RoomOpening {
  id: string;
  type: "door" | "window";
  wallIndex: number; // 0=top, 1=right, 2=bottom, 3=left
  offsetCm: number; // от левого края стены
  widthCm: number;
  heightCm: number;
  sillHeightCm?: number; // только для окон
}

export interface RoomProtrusion {
  id: string;
  wallIndex: number;
  offsetCm: number;
  widthCm: number;
  depthCm: number;
  label?: string; // "батарея", "вентиляция"
}

export interface RoomCommunication {
  id: string;
  type: "gas" | "water" | "drain" | "electricity" | "ventilation";
  wallIndex: number;
  offsetCm: number;
  heightCm: number;
  label?: string;
}

export interface RoomConfig {
  dimensions: RoomDimensions;
  openings: RoomOpening[];
  protrusions: RoomProtrusion[];
  communications: RoomCommunication[];
}

// ── Каталог модулей ────────────────────────────────────

export type KitchenModuleType =
  | "LOWER"
  | "UPPER"
  | "TALL"
  | "CORNER"
  | "SINK"
  | "DRAWER"
  | "GLASS_DOOR"
  | "LIFT_MECHANISM";

export interface CatalogModule {
  id: number;
  name: string;
  slug: string;
  moduleType: KitchenModuleType;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  priceBase: number;
  imageUrl: string;
  description: string;
  tags: string[];
}

// ── Размещение модулей на плане ────────────────────────

export type WallSide = "top" | "right" | "bottom" | "left" | "island";

export interface PlacedModule {
  id: string; // uuid — уникальный в проекте
  moduleSlug: string;
  wallSide: WallSide;
  offsetCm: number; // от начала стены
  facadeSlug?: string;
  handleSlug?: string;
  mechanismSlug?: string;
}

// ── Шаблоны планировок ─────────────────────────────────

export type KitchenLayoutType =
  | "STRAIGHT"
  | "CORNER"
  | "U_SHAPE"
  | "ISLAND"
  | "PENINSULA"
  | "LINEAR_COLUMNS"
  | "COMPACT";

export interface CatalogTemplate {
  id: number;
  name: string;
  slug: string;
  layoutType: KitchenLayoutType;
  description: string;
  previewImageUrl: string;
  modulesConfig: PlacedModule[];
  minWidthCm?: number;
  maxWidthCm?: number;
}

// ── Материалы и отделка ────────────────────────────────

export interface CatalogFacade {
  id: number;
  name: string;
  slug: string;
  material: string;
  finish: string;
  colorHex: string;
  colorName: string;
  imageUrl: string;
  priceMultiplier: number;
}

export interface CatalogCountertop {
  id: number;
  name: string;
  slug: string;
  material: string;
  thicknessMm: number;
  colorName: string;
  imageUrl: string;
  pricePerMeter: number;
}

export interface CatalogSkinal {
  id: number;
  name: string;
  slug: string;
  material: string;
  colorName: string;
  imageUrl: string;
  pricePerSqMeter: number;
}

export type KitchenHandleType = "STANDARD" | "RECESSED" | "PUSH_TO_OPEN" | "INTEGRATED";

export interface CatalogHandle {
  id: number;
  name: string;
  slug: string;
  handleType: KitchenHandleType;
  material: string;
  finishName: string;
  imageUrl: string;
  pricePerPiece: number;
}

export interface CatalogMechanism {
  id: number;
  name: string;
  slug: string;
  brand: string;
  mechanismType: string;
  imageUrl: string;
  pricePerPiece: number;
}

export interface CatalogAppliance {
  id: number;
  name: string;
  slug: string;
  brand: string;
  applianceType: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  imageUrl: string;
  priceBase: number;
}

// ── Выбранные материалы для проекта ───────────────────

export interface MaterialsConfig {
  facadeSlug: string;
  countertopSlug: string;
  skinalSlug: string;
  handleSlug: string;
  appliances: string[]; // slugs
}

// ── Правила совместимости ──────────────────────────────

export type CompatibilityRuleType = "INCOMPATIBLE" | "REQUIRES" | "WARNING";

export interface CompatibilityRule {
  id: number;
  ruleType: CompatibilityRuleType;
  sourceEntity: string;
  sourceSlug: string;
  targetEntity: string;
  targetSlug: string;
  message: string;
}

// ── Предупреждения ─────────────────────────────────────

export type WarningLevel = "error" | "warning" | "info";

export interface ConfigWarning {
  level: WarningLevel;
  code: string;
  message: string;
  relatedIds?: string[]; // ID затронутых PlacedModule
}

// ── Расчёт цены ────────────────────────────────────────

export interface PriceBreakdown {
  modules: number;
  facades: number;
  countertop: number;
  skinal: number;
  handles: number;
  mechanisms: number;
  appliances: number;
  installation: number;
  total: number;
}

// ── Состояние всего визуального проекта ───────────────

export type ConfiguratorStep =
  | "room"        // Этап 2: помещение
  | "template"    // Этап 3: выбор шаблона
  | "modules"     // Этап 3: расстановка модулей
  | "materials"   // Этап 4: материалы и отделка
  | "view3d"      // Этап 5: 3D-просмотр
  | "summary";    // итог + сохранение

export interface VisualProjectState {
  id?: number;           // если сохранён в БД
  sessionId?: string;
  name: string;
  currentStep: ConfiguratorStep;
  roomConfig: RoomConfig;
  selectedTemplateSlug?: string;
  placedModules: PlacedModule[];
  materialsConfig: MaterialsConfig;
  priceBreakdown: PriceBreakdown;
  warnings: ConfigWarning[];
  isDirty: boolean;      // есть несохранённые изменения
  lastSavedAt?: Date;
}

// ── Действия хранилища ─────────────────────────────────

export type ConfiguratorAction =
  | { type: "SET_STEP"; payload: ConfiguratorStep }
  | { type: "UPDATE_ROOM"; payload: Partial<RoomConfig> }
  | { type: "APPLY_TEMPLATE"; payload: CatalogTemplate }
  | { type: "ADD_MODULE"; payload: PlacedModule }
  | { type: "REMOVE_MODULE"; payload: string }
  | { type: "MOVE_MODULE"; payload: { id: string; offsetCm: number; wallSide: WallSide } }
  | { type: "UPDATE_MATERIALS"; payload: Partial<MaterialsConfig> }
  | { type: "SET_WARNINGS"; payload: ConfigWarning[] }
  | { type: "UPDATE_PRICE"; payload: PriceBreakdown }
  | { type: "LOAD_PROJECT"; payload: VisualProjectState }
  | { type: "MARK_SAVED"; payload: { id: number; savedAt: Date } }
  | { type: "RESET" };
