// ──────────────────────────────────────────────────────
// Движок правил совместимости компонентов
// Этап 1: базовые проверки помещения и модулей
// ──────────────────────────────────────────────────────

import type {
  CatalogModule,
  CompatibilityRule,
  ConfigWarning,
  MaterialsConfig,
  PlacedModule,
  RoomConfig,
} from "./types";

export interface CompatibilityCheckInput {
  roomConfig: RoomConfig;
  placedModules: PlacedModule[];
  moduleCatalog: CatalogModule[];
  materialsConfig: MaterialsConfig;
  rules: CompatibilityRule[];
}

export function checkCompatibility(input: CompatibilityCheckInput): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  warnings.push(...checkRoomDimensions(input.roomConfig));
  warnings.push(...checkModuleOverlaps(input.placedModules, input.moduleCatalog));
  warnings.push(...checkModuleVsOpenings(input.placedModules, input.moduleCatalog, input.roomConfig));
  warnings.push(...checkCatalogRules(input.placedModules, input.materialsConfig, input.rules));

  return warnings;
}

// Проверка минимальных размеров помещения
function checkRoomDimensions(room: RoomConfig): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];
  const { widthCm, depthCm, heightCm } = room.dimensions;

  if (widthCm < 150) {
    warnings.push({
      level: "error",
      code: "ROOM_TOO_NARROW",
      message: `Ширина помещения ${widthCm} см слишком мала. Минимум 150 см.`,
    });
  }
  if (depthCm < 120) {
    warnings.push({
      level: "error",
      code: "ROOM_TOO_SHALLOW",
      message: `Глубина помещения ${depthCm} см слишком мала. Минимум 120 см.`,
    });
  }
  if (heightCm < 210) {
    warnings.push({
      level: "warning",
      code: "ROOM_LOW_CEILING",
      message: `Высота потолка ${heightCm} см — верхние шкафы могут не подойти.`,
    });
  }

  return warnings;
}

// Проверка пересечений модулей на одной стене
function checkModuleOverlaps(
  placedModules: PlacedModule[],
  catalog: CatalogModule[]
): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  // Группируем по стене
  const byWall = new Map<string, PlacedModule[]>();
  for (const pm of placedModules) {
    const key = pm.wallSide;
    if (!byWall.has(key)) byWall.set(key, []);
    byWall.get(key)!.push(pm);
  }

  for (const [wall, modules] of byWall.entries()) {
    const sorted = [...modules].sort((a, b) => a.offsetCm - b.offsetCm);

    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      const aModule = catalog.find((m) => m.slug === a.moduleSlug);
      if (!aModule) continue;

      const aEnd = a.offsetCm + aModule.widthCm;
      if (aEnd > b.offsetCm) {
        warnings.push({
          level: "error",
          code: "MODULE_OVERLAP",
          message: `Модули пересекаются на стене «${wall}».`,
          relatedIds: [a.id, b.id],
        });
      }
    }
  }

  return warnings;
}

// Проверка модулей перед дверями и окнами
function checkModuleVsOpenings(
  placedModules: PlacedModule[],
  catalog: CatalogModule[],
  room: RoomConfig
): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  for (const pm of placedModules) {
    const catalogItem = catalog.find((m) => m.slug === pm.moduleSlug);
    if (!catalogItem) continue;

    const wallIndex = wallSideToIndex(pm.wallSide);
    if (wallIndex === -1) continue; // island — не у стены

    const openingsOnWall = room.openings.filter((o) => o.wallIndex === wallIndex);

    for (const opening of openingsOnWall) {
      const moduleStart = pm.offsetCm;
      const moduleEnd = pm.offsetCm + catalogItem.widthCm;
      const openingStart = opening.offsetCm;
      const openingEnd = opening.offsetCm + opening.widthCm;

      const overlaps = moduleStart < openingEnd && moduleEnd > openingStart;
      if (overlaps) {
        warnings.push({
          level: "error",
          code: "MODULE_BLOCKS_OPENING",
          message: `Модуль перекрывает ${opening.type === "door" ? "дверь" : "окно"} на этой стене.`,
          relatedIds: [pm.id],
        });
      }
    }
  }

  return warnings;
}

// Проверка по правилам из БД (INCOMPATIBLE / REQUIRES)
function checkCatalogRules(
  placedModules: PlacedModule[],
  materials: MaterialsConfig,
  rules: CompatibilityRule[]
): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  for (const rule of rules) {
    if (!rule.isEnabled) continue;

    const sourceSlugs = collectSlugs(placedModules, materials, rule.sourceEntity);
    if (!sourceSlugs.includes(rule.sourceSlug)) continue;

    const targetSlugs = collectSlugs(placedModules, materials, rule.targetEntity);
    const targetPresent = targetSlugs.includes(rule.targetSlug);

    if (rule.ruleType === "INCOMPATIBLE" && targetPresent) {
      warnings.push({
        level: "error",
        code: "INCOMPATIBLE_COMPONENTS",
        message: rule.message,
      });
    } else if (rule.ruleType === "REQUIRES" && !targetPresent) {
      warnings.push({
        level: "warning",
        code: "REQUIRES_COMPONENT",
        message: rule.message,
      });
    } else if (rule.ruleType === "WARNING" && targetPresent) {
      warnings.push({
        level: "warning",
        code: "COMPATIBILITY_WARNING",
        message: rule.message,
      });
    }
  }

  return warnings;
}

function collectSlugs(
  modules: PlacedModule[],
  materials: MaterialsConfig,
  entity: string
): string[] {
  switch (entity) {
    case "module":
      return modules.map((m) => m.moduleSlug);
    case "facade":
      return [materials.facadeSlug];
    case "countertop":
      return [materials.countertopSlug];
    case "skinal":
      return [materials.skinalSlug];
    case "handle":
      return [materials.handleSlug, ...modules.map((m) => m.handleSlug ?? "").filter(Boolean)];
    case "mechanism":
      return modules.map((m) => m.mechanismSlug ?? "").filter(Boolean);
    default:
      return [];
  }
}

function wallSideToIndex(side: string): number {
  const map: Record<string, number> = { top: 0, right: 1, bottom: 2, left: 3 };
  return map[side] ?? -1;
}
