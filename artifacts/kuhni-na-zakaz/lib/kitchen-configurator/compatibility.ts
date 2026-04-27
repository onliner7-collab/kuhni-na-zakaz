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
  return [
    ...checkRoomDimensions(input.roomConfig),
    ...checkModuleOverlaps(input.placedModules, input.moduleCatalog),
    ...checkModuleVsOpenings(input.placedModules, input.moduleCatalog, input.roomConfig),
    ...checkCatalogRules(input.placedModules, input.materialsConfig, input.rules),
  ];
}

function checkRoomDimensions(room: RoomConfig): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];
  const { widthCm, depthCm, heightCm } = room.dimensions;

  if (widthCm < 150) {
    warnings.push({ level: "error", code: "ROOM_TOO_NARROW", message: `Ширина помещения ${widthCm} см слишком мала. Минимум 150 см.` });
  }
  if (depthCm < 120) {
    warnings.push({ level: "error", code: "ROOM_TOO_SHALLOW", message: `Глубина помещения ${depthCm} см слишком мала. Минимум 120 см.` });
  }
  if (heightCm < 210) {
    warnings.push({ level: "warning", code: "ROOM_LOW_CEILING", message: `Высота потолка ${heightCm} см: верхние шкафы могут не подойти.` });
  }

  return warnings;
}

function checkModuleOverlaps(placedModules: PlacedModule[], catalog: CatalogModule[]): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];
  const byWall = new Map<string, PlacedModule[]>();

  for (const module of placedModules) {
    const key = module.wallSide;
    if (!byWall.has(key)) byWall.set(key, []);
    byWall.get(key)!.push(module);
  }

  for (const [wall, modules] of byWall.entries()) {
    const sorted = [...modules].sort((a, b) => a.offsetCm - b.offsetCm);
    for (let index = 0; index < sorted.length - 1; index++) {
      const current = sorted[index];
      const next = sorted[index + 1];
      const catalogItem = catalog.find((item) => item.slug === current.moduleSlug);
      if (!catalogItem) continue;

      if (current.offsetCm + catalogItem.widthCm > next.offsetCm) {
        warnings.push({
          level: "warning",
          code: "MODULE_OVERLAP",
          message: `Модули пересекаются на стене «${wall}».`,
          relatedIds: [current.id, next.id],
        });
      }
    }
  }

  return warnings;
}

function checkModuleVsOpenings(placedModules: PlacedModule[], catalog: CatalogModule[], room: RoomConfig): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  for (const module of placedModules) {
    const catalogItem = catalog.find((item) => item.slug === module.moduleSlug);
    if (!catalogItem) continue;

    const wallIndex = wallSideToIndex(module.wallSide);
    if (wallIndex === -1) continue;

    for (const opening of room.openings.filter((item) => item.wallIndex === wallIndex)) {
      const moduleStart = module.offsetCm;
      const moduleEnd = module.offsetCm + catalogItem.widthCm;
      const openingStart = opening.offsetCm;
      const openingEnd = opening.offsetCm + opening.widthCm;

      if (moduleStart < openingEnd && moduleEnd > openingStart) {
        warnings.push({
          level: "warning",
          code: "MODULE_BLOCKS_OPENING",
          message: `Модуль перекрывает ${opening.type === "door" ? "дверь" : "окно"} на этой стене.`,
          relatedIds: [module.id],
        });
      }
    }
  }

  return warnings;
}

function checkCatalogRules(placedModules: PlacedModule[], materials: MaterialsConfig, rules: CompatibilityRule[]): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  for (const rule of rules) {
    if (!rule.isEnabled) continue;

    const sourceSlugs = collectSlugs(placedModules, materials, rule.sourceEntity);
    if (!sourceSlugs.includes(rule.sourceSlug)) continue;

    const targetSlugs = collectSlugs(placedModules, materials, rule.targetEntity);
    const targetPresent = targetSlugs.includes(rule.targetSlug);

    if (rule.ruleType === "INCOMPATIBLE" && targetPresent) {
      warnings.push({ level: "error", code: "INCOMPATIBLE_COMPONENTS", message: rule.message });
    } else if (rule.ruleType === "REQUIRES" && !targetPresent) {
      warnings.push({ level: "warning", code: "REQUIRES_COMPONENT", message: rule.message });
    } else if (rule.ruleType === "WARNING" && targetPresent) {
      warnings.push({ level: "warning", code: "COMPATIBILITY_WARNING", message: rule.message });
    }
  }

  return warnings;
}

function collectSlugs(modules: PlacedModule[], materials: MaterialsConfig, entity: string): string[] {
  switch (entity) {
    case "module":
      return modules.map((module) => module.moduleSlug);
    case "facade":
      return [materials.facadeSlug];
    case "countertop":
      return [materials.countertopSlug];
    case "skinal":
      return [materials.skinalSlug];
    case "handle":
      return [materials.handleSlug, ...modules.map((module) => module.handleSlug ?? "").filter(Boolean)];
    case "mechanism":
      return modules.map((module) => module.mechanismSlug ?? "").filter(Boolean);
    default:
      return [];
  }
}

function wallSideToIndex(side: string): number {
  const map: Record<string, number> = { top: 0, right: 1, bottom: 2, left: 3 };
  return map[side] ?? -1;
}
