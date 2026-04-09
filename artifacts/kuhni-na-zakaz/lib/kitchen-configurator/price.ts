// ──────────────────────────────────────────────────────
// Расчёт стоимости проекта
// Этап 1: базовая логика
// ──────────────────────────────────────────────────────

import type {
  CatalogAppliance,
  CatalogCountertop,
  CatalogFacade,
  CatalogHandle,
  CatalogModule,
  CatalogSkinal,
  MaterialsConfig,
  PlacedModule,
  PriceBreakdown,
  RoomConfig,
} from "./types";

export interface PriceCalcInput {
  placedModules: PlacedModule[];
  materialsConfig: MaterialsConfig;
  roomConfig: RoomConfig;
  moduleCatalog: CatalogModule[];
  facadeCatalog: CatalogFacade[];
  countertopCatalog: CatalogCountertop[];
  skinalCatalog: CatalogSkinal[];
  handleCatalog: CatalogHandle[];
  applianceCatalog: CatalogAppliance[];
  installationRatePercent?: number; // % от суммы, по умолчанию 15
}

export function calculatePrice(input: PriceCalcInput): PriceBreakdown {
  const installRate = (input.installationRatePercent ?? 15) / 100;

  // Базовая стоимость модулей
  let modules = 0;
  for (const pm of input.placedModules) {
    const mod = input.moduleCatalog.find((m) => m.slug === pm.moduleSlug);
    if (mod) modules += mod.priceBase;
  }

  // Фасады (множитель на сумму модулей)
  let facades = 0;
  const facade = input.facadeCatalog.find(
    (f) => f.slug === input.materialsConfig.facadeSlug
  );
  if (facade && modules > 0) {
    facades = Math.round(modules * (facade.priceMultiplier - 1));
  }

  // Столешница (по длине внешних стен)
  let countertop = 0;
  const ctp = input.countertopCatalog.find(
    (c) => c.slug === input.materialsConfig.countertopSlug
  );
  if (ctp) {
    const runningMeter = estimateCountertopLength(input.placedModules, input.moduleCatalog);
    countertop = Math.round((runningMeter / 100) * ctp.pricePerMeter);
  }

  // Скинали (по площади над нижними шкафами)
  let skinal = 0;
  const sk = input.skinalCatalog.find(
    (s) => s.slug === input.materialsConfig.skinalSlug
  );
  if (sk) {
    const sqCm = estimateSkinalArea(input.placedModules, input.moduleCatalog, input.roomConfig);
    const sqM = sqCm / 10000;
    skinal = Math.round(sqM * sk.pricePerSqMeter);
  }

  // Ручки
  let handles = 0;
  const handle = input.handleCatalog.find(
    (h) => h.slug === input.materialsConfig.handleSlug
  );
  if (handle) {
    // по одной ручке на нижний/верхний модуль
    const count = input.placedModules.filter(
      (pm) =>
        ["LOWER", "UPPER", "TALL", "GLASS_DOOR", "DRAWER"].includes(
          input.moduleCatalog.find((m) => m.slug === pm.moduleSlug)?.moduleType ?? ""
        )
    ).length;
    handles = count * handle.pricePerPiece;
  }

  // Механизмы — цена вшита в модуль (механизм = slug на PlacedModule)
  // Упрощённо: 0 на этапе 1, детализируется в этапе 4
  const mechanisms = 0;

  // Техника
  let appliances = 0;
  for (const slug of input.materialsConfig.appliances) {
    const app = input.applianceCatalog.find((a) => a.slug === slug);
    if (app) appliances += app.priceBase;
  }

  const subtotal = modules + facades + countertop + skinal + handles + mechanisms + appliances;
  const installation = Math.round(subtotal * installRate);
  const total = subtotal + installation;

  return { modules, facades, countertop, skinal, handles, mechanisms, appliances, installation, total };
}

// Оценка длины столешницы (сумма ширин нижних модулей)
function estimateCountertopLength(
  placedModules: PlacedModule[],
  catalog: CatalogModule[]
): number {
  return placedModules.reduce((sum, pm) => {
    const mod = catalog.find((m) => m.slug === pm.moduleSlug);
    if (!mod) return sum;
    if (["LOWER", "CORNER", "SINK", "DRAWER"].includes(mod.moduleType)) {
      return sum + mod.widthCm;
    }
    return sum;
  }, 0);
}

// Оценка площади скинали (ширина × высота фартука ~60 см)
function estimateSkinalArea(
  placedModules: PlacedModule[],
  catalog: CatalogModule[],
  _room: RoomConfig
): number {
  const SKINAL_HEIGHT_CM = 60;
  const length = estimateCountertopLength(placedModules, catalog);
  return length * SKINAL_HEIGHT_CM;
}
