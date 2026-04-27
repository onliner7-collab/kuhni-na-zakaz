import {
  KitchenHandleType,
  KitchenLayoutType,
  KitchenModuleType,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍳 Seeding kitchen configurator catalog...");

  // ── Modules ──────────────────────────────────────────────────────────────
  const modules = [
    // Lower cabinets
    { slug: "lower-40", name: "Нижний 40 см", moduleType: "LOWER", widthCm: 40, heightCm: 82, depthCm: 60, priceBase: 8500, sortOrder: 1 },
    { slug: "lower-50", name: "Нижний 50 см", moduleType: "LOWER", widthCm: 50, heightCm: 82, depthCm: 60, priceBase: 9500, sortOrder: 2 },
    { slug: "lower-60", name: "Нижний 60 см", moduleType: "LOWER", widthCm: 60, heightCm: 82, depthCm: 60, priceBase: 10500, sortOrder: 3 },
    { slug: "lower-80", name: "Нижний 80 см", moduleType: "LOWER", widthCm: 80, heightCm: 82, depthCm: 60, priceBase: 13500, sortOrder: 4 },
    { slug: "lower-90", name: "Нижний 90 см", moduleType: "LOWER", widthCm: 90, heightCm: 82, depthCm: 60, priceBase: 14500, sortOrder: 5 },
    // Drawers
    { slug: "drawer-60", name: "С ящиками 60 см", moduleType: "DRAWER_UNIT", widthCm: 60, heightCm: 82, depthCm: 60, priceBase: 15500, sortOrder: 10 },
    { slug: "drawer-80", name: "С ящиками 80 см", moduleType: "DRAWER_UNIT", widthCm: 80, heightCm: 82, depthCm: 60, priceBase: 18500, sortOrder: 11 },
    // Sink modules
    { slug: "sink-60", name: "Под мойку 60 см", moduleType: "SINK_MODULE", widthCm: 60, heightCm: 82, depthCm: 60, priceBase: 9000, sortOrder: 20 },
    { slug: "sink-80", name: "Под мойку 80 см", moduleType: "SINK_MODULE", widthCm: 80, heightCm: 82, depthCm: 60, priceBase: 10500, sortOrder: 21 },
    // Cooktop modules
    { slug: "cooktop-60", name: "Под варочную 60 см", moduleType: "COOKTOP_MODULE", widthCm: 60, heightCm: 82, depthCm: 60, priceBase: 8500, sortOrder: 30 },
    // Oven modules
    { slug: "oven-60", name: "Под духовку 60 см", moduleType: "OVEN_MODULE", widthCm: 60, heightCm: 82, depthCm: 60, priceBase: 9000, sortOrder: 40 },
    // Upper cabinets
    { slug: "upper-40", name: "Верхний 40 см", moduleType: "UPPER", widthCm: 40, heightCm: 72, depthCm: 30, priceBase: 6500, sortOrder: 50 },
    { slug: "upper-50", name: "Верхний 50 см", moduleType: "UPPER", widthCm: 50, heightCm: 72, depthCm: 30, priceBase: 7500, sortOrder: 51 },
    { slug: "upper-60", name: "Верхний 60 см", moduleType: "UPPER", widthCm: 60, heightCm: 72, depthCm: 30, priceBase: 8500, sortOrder: 52 },
    { slug: "upper-80", name: "Верхний 80 см", moduleType: "UPPER", widthCm: 80, heightCm: 72, depthCm: 30, priceBase: 10500, sortOrder: 53 },
    { slug: "upper-90", name: "Верхний 90 см", moduleType: "UPPER", widthCm: 90, heightCm: 72, depthCm: 30, priceBase: 11500, sortOrder: 54 },
    // Open shelves
    { slug: "shelf-60", name: "Открытая полка 60 см", moduleType: "OPEN_SHELF", widthCm: 60, heightCm: 36, depthCm: 30, priceBase: 4500, sortOrder: 60 },
    // Tall units
    { slug: "tall-60", name: "Пенал 60 см", moduleType: "TALL", widthCm: 60, heightCm: 216, depthCm: 60, priceBase: 22000, sortOrder: 70 },
    { slug: "tall-fridge-60", name: "Пенал под холодильник 60 см", moduleType: "FRIDGE_MODULE", widthCm: 60, heightCm: 216, depthCm: 60, priceBase: 18000, sortOrder: 71 },
    // Corner modules
    { slug: "corner-lower-90", name: "Угловой нижний 90×90 см", moduleType: "CORNER_LOWER", widthCm: 90, heightCm: 82, depthCm: 90, priceBase: 19000, sortOrder: 80 },
    { slug: "corner-upper-60", name: "Угловой верхний 60×60 см", moduleType: "CORNER_UPPER", widthCm: 60, heightCm: 72, depthCm: 60, priceBase: 14000, sortOrder: 81 },
    // Island
    { slug: "island-120", name: "Остров 120 см", moduleType: "ISLAND", widthCm: 120, heightCm: 90, depthCm: 80, priceBase: 38000, sortOrder: 90 },
  ];

  for (const m of modules) {
    const moduleTypeMap: Record<string, KitchenModuleType> = {
      DRAWER_UNIT: "DRAWER",
      SINK_MODULE: "SINK",
      COOKTOP_MODULE: "LOWER",
      OVEN_MODULE: "LOWER",
      OPEN_SHELF: "UPPER",
      FRIDGE_MODULE: "TALL",
      CORNER_LOWER: "CORNER",
      CORNER_UPPER: "CORNER",
      ISLAND: "LOWER",
    };
    const normalized = {
      ...m,
      moduleType: moduleTypeMap[m.moduleType] ?? (m.moduleType as KitchenModuleType),
      tags: [m.slug, (moduleTypeMap[m.moduleType] ?? m.moduleType).toLowerCase()],
    };
    await prisma.kitchenModule.upsert({
      where: { slug: normalized.slug },
      update: normalized,
      create: normalized,
    });
  }
  console.log(`  ✅ ${modules.length} modules`);

  // ── Facades ───────────────────────────────────────────────────────────────
  const facades = [
    { slug: "mdf-white-mat", name: "МДФ Белый матовый", material: "МДФ", finish: "Матовый", colorHex: "#F5F5F5", colorName: "Белый", priceMultiplier: 1.0, sortOrder: 1 },
    { slug: "mdf-beige-mat", name: "МДФ Бежевый матовый", material: "МДФ", finish: "Матовый", colorHex: "#E8DCC8", colorName: "Бежевый", priceMultiplier: 1.0, sortOrder: 2 },
    { slug: "mdf-grey-mat", name: "МДФ Серый матовый", material: "МДФ", finish: "Матовый", colorHex: "#9E9E9E", colorName: "Серый", priceMultiplier: 1.05, sortOrder: 3 },
    { slug: "mdf-graphite-mat", name: "МДФ Графит матовый", material: "МДФ", finish: "Матовый", colorHex: "#424242", colorName: "Графит", priceMultiplier: 1.05, sortOrder: 4 },
    { slug: "mdf-black-mat", name: "МДФ Чёрный матовый", material: "МДФ", finish: "Матовый", colorHex: "#212121", colorName: "Чёрный", priceMultiplier: 1.1, sortOrder: 5 },
    { slug: "mdf-white-gloss", name: "МДФ Белый глянец", material: "МДФ", finish: "Глянец", colorHex: "#FFFFFF", colorName: "Белый", priceMultiplier: 1.2, sortOrder: 10 },
    { slug: "mdf-grey-gloss", name: "МДФ Серый глянец", material: "МДФ", finish: "Глянец", colorHex: "#BDBDBD", colorName: "Серый", priceMultiplier: 1.25, sortOrder: 11 },
    { slug: "veneer-oak", name: "Шпон Дуб натуральный", material: "Шпон", finish: "Масло-воск", colorHex: "#C4922A", colorName: "Дуб", priceMultiplier: 1.8, sortOrder: 20 },
    { slug: "veneer-walnut", name: "Шпон Орех", material: "Шпон", finish: "Масло-воск", colorHex: "#5D4037", colorName: "Орех", priceMultiplier: 2.0, sortOrder: 21 },
    { slug: "acrylic-white", name: "Акрил Белый", material: "Акрил", finish: "Глянец", colorHex: "#FFFFFF", colorName: "Белый", priceMultiplier: 1.4, sortOrder: 30 },
    { slug: "acrylic-emerald", name: "Акрил Изумруд", material: "Акрил", finish: "Глянец", colorHex: "#00695C", colorName: "Изумруд", priceMultiplier: 1.45, sortOrder: 31 },
    { slug: "glass-white", name: "Стекло Белое с рамкой", material: "Стекло", finish: "Матовый", colorHex: "#ECEFF1", colorName: "Белый", priceMultiplier: 1.6, sortOrder: 40 },
  ];

  for (const f of facades) {
    await prisma.kitchenFacade.upsert({
      where: { slug: f.slug },
      update: f,
      create: f,
    });
  }
  console.log(`  ✅ ${facades.length} facades`);

  // ── Countertops ───────────────────────────────────────────────────────────
  const countertops = [
    { slug: "laminate-white", name: "ЛДСП Белый", material: "ЛДСП", thicknessMm: 28, colorName: "Белый", pricePerMeter: 2500, sortOrder: 1 },
    { slug: "laminate-grey", name: "ЛДСП Серый", material: "ЛДСП", thicknessMm: 28, colorName: "Серый", pricePerMeter: 2500, sortOrder: 2 },
    { slug: "laminate-wood", name: "ЛДСП Дерево", material: "ЛДСП", thicknessMm: 38, colorName: "Дуб", pricePerMeter: 3200, sortOrder: 3 },
    { slug: "postforming-white", name: "Постформинг Белый", material: "Постформинг", thicknessMm: 38, colorName: "Белый", pricePerMeter: 3800, sortOrder: 10 },
    { slug: "postforming-concrete", name: "Постформинг Бетон", material: "Постформинг", thicknessMm: 38, colorName: "Бетон", pricePerMeter: 4200, sortOrder: 11 },
    { slug: "artificial-stone-white", name: "Искусственный камень Белый", material: "Искусственный камень", thicknessMm: 20, colorName: "Белый", pricePerMeter: 8500, sortOrder: 20 },
    { slug: "artificial-stone-grey", name: "Искусственный камень Серый", material: "Искусственный камень", thicknessMm: 20, colorName: "Серый", pricePerMeter: 9000, sortOrder: 21 },
    { slug: "quartz-white", name: "Кварц Белый", material: "Кварц", thicknessMm: 20, colorName: "Белый", pricePerMeter: 14000, sortOrder: 30 },
    { slug: "quartz-calacatta", name: "Кварц Каллакатта", material: "Кварц", thicknessMm: 20, colorName: "Каллакатта", pricePerMeter: 18000, sortOrder: 31 },
    { slug: "granite-black", name: "Гранит Чёрный", material: "Гранит", thicknessMm: 20, colorName: "Чёрный", pricePerMeter: 22000, sortOrder: 40 },
  ];

  for (const c of countertops) {
    await prisma.kitchenCountertop.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`  ✅ ${countertops.length} countertops`);

  // ── Skinals ───────────────────────────────────────────────────────────────
  const skinals = [
    { slug: "tile-white-metro", name: "Плитка Белое метро", material: "Керамическая плитка", colorName: "Белый", pricePerSqMeter: 2800, sortOrder: 1 },
    { slug: "tile-grey-concrete", name: "Плитка Серый бетон", material: "Керамическая плитка", colorName: "Серый", pricePerSqMeter: 3200, sortOrder: 2 },
    { slug: "glass-white", name: "Стекло белое (скинали)", material: "Стекло", colorName: "Белый", pricePerSqMeter: 4500, sortOrder: 10 },
    { slug: "glass-beige", name: "Стекло бежевое (скинали)", material: "Стекло", colorName: "Бежевый", pricePerSqMeter: 4500, sortOrder: 11 },
    { slug: "glass-graphite", name: "Стекло графит (скинали)", material: "Стекло", colorName: "Графит", pricePerSqMeter: 5000, sortOrder: 12 },
    { slug: "artificial-stone-skinal", name: "Искусственный камень", material: "Искусственный камень", colorName: "Белый", pricePerSqMeter: 7500, sortOrder: 20 },
    { slug: "mosaic-gold", name: "Мозаика Золото", material: "Стеклянная мозаика", colorName: "Золотой", pricePerSqMeter: 9500, sortOrder: 30 },
    { slug: "brick-white", name: "Декоративный кирпич Белый", material: "Клинкер", colorName: "Белый", pricePerSqMeter: 3800, sortOrder: 40 },
  ];

  for (const s of skinals) {
    await prisma.kitchenSkinal.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`  ✅ ${skinals.length} skinals`);

  // ── Handles ───────────────────────────────────────────────────────────────
  const handles = [
    { slug: "bar-chrome-128", name: "Скоба хром 128 мм", handleType: "STANDARD", material: "Металл", finishName: "Хром", pricePerPiece: 350, sortOrder: 1 },
    { slug: "bar-brushed-gold-128", name: "Скоба брашированное золото 128 мм", handleType: "STANDARD", material: "Металл", finishName: "Брашированное золото", pricePerPiece: 580, sortOrder: 2 },
    { slug: "bar-black-160", name: "Скоба чёрная 160 мм", handleType: "STANDARD", material: "Металл", finishName: "Чёрный", pricePerPiece: 420, sortOrder: 3 },
    { slug: "recessed-aluminium", name: "Торцевая рейка алюминий", handleType: "RECESSED", material: "Алюминий", finishName: "Анодированный", pricePerPiece: 890, sortOrder: 10 },
    { slug: "push-to-open", name: "Push-to-open", handleType: "PUSH_TO_OPEN", material: "Пластик", finishName: "", pricePerPiece: 280, sortOrder: 20 },
    { slug: "integrated-profile-black", name: "Интегрированная ручка профиль чёрный", handleType: "INTEGRATED", material: "Алюминий", finishName: "Чёрный", pricePerPiece: 1200, sortOrder: 30 },
    { slug: "knob-chrome", name: "Кнопка хром", handleType: "STANDARD", material: "Металл", finishName: "Хром", pricePerPiece: 180, sortOrder: 40 },
    { slug: "knob-brass", name: "Кнопка латунь", handleType: "STANDARD", material: "Металл", finishName: "Матовая латунь", pricePerPiece: 320, sortOrder: 41 },
  ];

  for (const h of handles) {
    const normalized = { ...h, handleType: h.handleType as KitchenHandleType };
    await prisma.kitchenHandle.upsert({
      where: { slug: normalized.slug },
      update: normalized,
      create: normalized,
    });
  }
  console.log(`  ✅ ${handles.length} handles`);

  // ── Mechanisms ────────────────────────────────────────────────────────────
  const mechanisms = [
    { slug: "blum-hinge-soft", name: "Петля Blum с доводчиком", brand: "Blum", mechanismType: "HINGE", loadKg: 0, pricePerPiece: 420, sortOrder: 1 },
    { slug: "blum-aventos-hk", name: "Подъёмник Blum Aventos HK", brand: "Blum", mechanismType: "LIFT", loadKg: 9, pricePerPiece: 2800, sortOrder: 10 },
    { slug: "blum-aventos-hl", name: "Подъёмник Blum Aventos HL", brand: "Blum", mechanismType: "LIFT", loadKg: 20, pricePerPiece: 4200, sortOrder: 11 },
    { slug: "blum-tandembox-plus", name: "Ящик Blum Tandembox Plus", brand: "Blum", mechanismType: "TANDEM", loadKg: 65, pricePerPiece: 3800, sortOrder: 20 },
    { slug: "hettich-arcitech", name: "Ящик Hettich Arcitech", brand: "Hettich", mechanismType: "TANDEM", loadKg: 70, pricePerPiece: 3200, sortOrder: 21 },
    { slug: "hafele-corner-magic", name: "Угловой механизм Häfele Magic Corner", brand: "Häfele", mechanismType: "CORNER", loadKg: 15, pricePerPiece: 9800, sortOrder: 30 },
    { slug: "grass-drawer", name: "Ящик Grass Nova Pro", brand: "Grass", mechanismType: "DRAWER", loadKg: 50, pricePerPiece: 2900, sortOrder: 40 },
  ];

  for (const m of mechanisms) {
    const { loadKg: _loadKg, ...normalized } = m as typeof m & { loadKg?: number };
    await prisma.kitchenMechanism.upsert({
      where: { slug: normalized.slug },
      update: normalized,
      create: normalized,
    });
  }
  console.log(`  ✅ ${mechanisms.length} mechanisms`);

  // ── Appliances ────────────────────────────────────────────────────────────
  const appliances = [
    { slug: "oven-bosch-60", name: "Духовой шкаф Bosch 60 см", brand: "Bosch", applianceType: "OVEN", widthCm: 60, heightCm: 60, depthCm: 55, price: 42000, sortOrder: 1 },
    { slug: "microwave-samsung-60", name: "Микроволновка Samsung встраиваемая", brand: "Samsung", applianceType: "MICROWAVE", widthCm: 60, heightCm: 46, depthCm: 35, price: 18000, sortOrder: 2 },
    { slug: "dishwasher-bosch-60", name: "Посудомоечная машина Bosch 60 см", brand: "Bosch", applianceType: "DISHWASHER", widthCm: 60, heightCm: 82, depthCm: 55, price: 38000, sortOrder: 3 },
    { slug: "dishwasher-45", name: "Посудомоечная машина 45 см", brand: "Electrolux", applianceType: "DISHWASHER", widthCm: 45, heightCm: 82, depthCm: 55, price: 29000, sortOrder: 4 },
    { slug: "fridge-liebherr-60", name: "Холодильник Liebherr встраиваемый 180 см", brand: "Liebherr", applianceType: "FRIDGE", widthCm: 60, heightCm: 178, depthCm: 55, price: 78000, sortOrder: 5 },
    { slug: "hood-elica-60", name: "Вытяжка Elica встраиваемая 60 см", brand: "Elica", applianceType: "HOOD", widthCm: 60, heightCm: 12, depthCm: 30, price: 22000, sortOrder: 6 },
    { slug: "cooktop-bosch-60", name: "Варочная панель Bosch 60 см", brand: "Bosch", applianceType: "COOKTOP", widthCm: 60, heightCm: 6, depthCm: 52, price: 28000, sortOrder: 7 },
    { slug: "cooktop-induction-60", name: "Индукционная варочная Siemens 60 см", brand: "Siemens", applianceType: "COOKTOP", widthCm: 60, heightCm: 5, depthCm: 52, price: 45000, sortOrder: 8 },
    { slug: "sink-blanco-single", name: "Мойка Blanco одиночная", brand: "Blanco", applianceType: "SINK", widthCm: 60, heightCm: 20, depthCm: 50, price: 18000, sortOrder: 9 },
    { slug: "sink-blanco-double", name: "Мойка Blanco двойная", brand: "Blanco", applianceType: "SINK", widthCm: 80, heightCm: 20, depthCm: 50, price: 24000, sortOrder: 10 },
  ];

  for (const a of appliances) {
    const { price, ...rest } = a as typeof a & { price: number };
    const normalized = { ...rest, priceBase: price };
    await prisma.kitchenAppliance.upsert({
      where: { slug: normalized.slug },
      update: normalized,
      create: normalized,
    });
  }
  console.log(`  ✅ ${appliances.length} appliances`);

  // ── Templates ─────────────────────────────────────────────────────────────
  const templates = [
    {
      slug: "linear-basic",
      name: "Прямая базовая",
      layoutType: "LINEAR",
      description: "Классическая прямая кухня — идеально для вытянутых помещений",
      minRoomWidthCm: 240,
      minRoomDepthCm: 150,
      sortOrder: 1,
      modulesConfig: [
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "sink-60", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 120 },
        { moduleSlug: "cooktop-60", wallSide: "bottom", offsetCm: 180 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 120 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 180 },
      ],
    },
    {
      slug: "l-shaped-standard",
      name: "Угловая стандарт",
      layoutType: "L_SHAPED",
      description: "Угловая планировка — оптимальное использование угла помещения",
      minRoomWidthCm: 280,
      minRoomDepthCm: 200,
      sortOrder: 2,
      modulesConfig: [
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "sink-60", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 120 },
        { moduleSlug: "corner-lower-90", wallSide: "bottom", offsetCm: 180 },
        { moduleSlug: "lower-60", wallSide: "left", offsetCm: 0 },
        { moduleSlug: "cooktop-60", wallSide: "left", offsetCm: 60 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 120 },
      ],
    },
    {
      slug: "u-shaped-premium",
      name: "П-образная",
      layoutType: "U_SHAPED",
      description: "П-образная кухня — максимум рабочей поверхности и хранения",
      minRoomWidthCm: 350,
      minRoomDepthCm: 280,
      sortOrder: 3,
      modulesConfig: [
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "sink-80", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 140 },
        { moduleSlug: "lower-60", wallSide: "left", offsetCm: 0 },
        { moduleSlug: "cooktop-60", wallSide: "left", offsetCm: 60 },
        { moduleSlug: "lower-60", wallSide: "right", offsetCm: 0 },
        { moduleSlug: "tall-60", wallSide: "right", offsetCm: 60 },
      ],
    },
    {
      slug: "island-open",
      name: "С островом",
      layoutType: "ISLAND",
      description: "Современная кухня с островом — для просторных помещений",
      minRoomWidthCm: 420,
      minRoomDepthCm: 350,
      sortOrder: 4,
      modulesConfig: [
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "sink-80", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "lower-60", wallSide: "bottom", offsetCm: 140 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 0 },
        { moduleSlug: "upper-60", wallSide: "bottom", offsetCm: 60 },
        { moduleSlug: "island-120", wallSide: "island", offsetCm: 0 },
      ],
    },
  ];

  for (const t of templates) {
    const layoutTypeMap: Record<string, KitchenLayoutType> = {
      LINEAR: "STRAIGHT",
      L_SHAPED: "CORNER",
      U_SHAPED: "U_SHAPE",
    };
    const normalized = {
      slug: t.slug,
      name: t.name,
      layoutType: layoutTypeMap[t.layoutType] ?? (t.layoutType as KitchenLayoutType),
      description: t.description,
      minWidthCm: t.minRoomWidthCm,
      modulesConfig: t.modulesConfig as object[],
      sortOrder: t.sortOrder,
    };
    await prisma.kitchenTemplate.upsert({
      where: { slug: normalized.slug },
      update: normalized,
      create: normalized,
    });
  }
  console.log(`  ✅ ${templates.length} templates`);

  // ── Settings ──────────────────────────────────────────────────────────────
  await prisma.kitchenConfiguratorSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      defaultRoomWidthCm: 400,
      defaultRoomDepthCm: 300,
      defaultRoomHeightCm: 270,
                        shareTextTemplate: "Посмотрите мой проект кухни на заказ! Общая стоимость: {price} ₽",
      exportBrandingText: "Кухни на заказ — индивидуальное производство",
      isEnabled: true,
    },
  });
  console.log("  ✅ settings");

  // ── Compatibility rules ───────────────────────────────────────────────────
  const rules = [
    {
      ruleType: "REQUIRES" as const,
      sourceEntity: "module",
      sourceSlug: "cooktop-60",
      targetEntity: "appliance",
      targetSlug: "hood-elica-60",
      message: "К варочной панели рекомендуется вытяжка",
      isEnabled: true,
    },
    {
      ruleType: "WARNING" as const,
      sourceEntity: "module",
      sourceSlug: "island-120",
      targetEntity: "module",
      targetSlug: "corner-lower-90",
      message: "Остров и угловой модуль могут конфликтовать в небольших помещениях",
      isEnabled: true,
    },
  ];

  for (const r of rules) {
    const existing = await prisma.compatibilityRule.findFirst({
      where: { sourceSlug: r.sourceSlug, targetSlug: r.targetSlug, ruleType: r.ruleType },
    });
    if (!existing) {
      await prisma.compatibilityRule.create({ data: r });
    }
  }
  console.log(`  ✅ ${rules.length} compatibility rules`);

  console.log("\n🎉 Kitchen configurator catalog seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
