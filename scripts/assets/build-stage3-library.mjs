import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const appRoot = join(root, "artifacts/kuhni-na-zakaz");
const sourceManifestDir = join(root, "content/media/pilots");
const outputManifestDir = join(root, "content/media/pilots");
const publicPilotRoot = join(root, "public/media/pilots");
const appPilotRoot = join(appRoot, "public/media/pilots");
const legacyHardwareRoot = join(appRoot, "public/images/materials-gallery-v2/furnitura");
const legacyHardwareRegistry = join(legacyHardwareRoot, "registry.json");
mkdirSync(join(root, "docs/assets"), { recursive: true });

const lifecycle = [
  "PLANNED", "PROMPT_READY", "GENERATED", "REVIEW_REQUIRED", "SELECTED", "REJECTED",
  "UPSCALED", "OPTIMIZED", "REGISTERED", "CONNECTED", "VERIFIED", "LIVE", "ARCHIVED",
];

const folders = ["hero", "gallery", "sequences", "cutaways", "comparisons", "details", "covers", "posters"];
const pilots = ["angular-kitchens", "borisov", "hardware"];

for (const pilot of pilots) {
  for (const folder of folders) {
    for (const directory of [join(publicPilotRoot, pilot, folder), join(appPilotRoot, pilot, folder)]) {
      mkdirSync(directory, { recursive: true });
      const keep = join(directory, ".gitkeep");
      if (!existsSync(keep)) writeFileSync(keep, "\n", "utf8");
    }
  }
  const sourceDirectory = join(root, "prepared-images/generated-sources/pilots", pilot);
  mkdirSync(sourceDirectory, { recursive: true });
  const sourceKeep = join(sourceDirectory, ".gitkeep");
  if (!existsSync(sourceKeep)) writeFileSync(sourceKeep, "\n", "utf8");
  mkdirSync(join(outputManifestDir, pilot), { recursive: true });
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function makeOldIndex(pilot) {
  const source = readJson(join(sourceManifestDir, `${pilot}.json`));
  return {
    source,
    assets: new Map(source.groups.flatMap((group) => group.assets.map((asset) => [asset.assetId, { ...asset, sourceGroup: group.name, continuityAnchor: group.continuityAnchor ?? null }]))),
  };
}

const old = Object.fromEntries(pilots.map((pilot) => [pilot, makeOldIndex(pilot)]));

function fromOld(pilot, assetId, overrides = {}) {
  const source = old[pilot].assets.get(assetId);
  if (!source) throw new Error(`Unknown legacy manifest asset: ${pilot}/${assetId}`);
  return { ...source, ...overrides };
}

function planned(filename, alt, caption, prompt, overrides = {}) {
  return { filename, alt, caption, prompt, ...overrides };
}

const commonPrompt = {
  "angular-kitchens": {
    base: old["angular-kitchens"].source.promptBase,
    negative: old["angular-kitchens"].source.negativePrompt,
    materials: "Серо-бежевые фасады, натуральный дуб, светлый камень и тёплый белый; материалы и техника не меняются внутри серии.",
  },
  borisov: {
    base: old.borisov.source.promptBase,
    negative: old.borisov.source.negativePrompt,
    materials: "Нейтральный проект кухни: серо-бежевые фасады, дубовая ниша и светлая столешница; без фирменных обозначений.",
  },
  hardware: {
    base: old.hardware.source.promptBase,
    negative: old.hardware.source.negativePrompt,
    materials: "Нейтральный серо-бежевый корпус, светлое дерево и графитовый металл; без брендов, цифр и заявленных характеристик.",
  },
};

const legacyRatioReview = new Set([
  "angular-kitchens-inside-basic-shelf-landscape",
  "angular-kitchens-inside-carousel-landscape",
  "angular-kitchens-inside-pullout-landscape",
  "angular-kitchens-inside-bottle-pullout-landscape",
  "angular-kitchens-compare-shelf-pullout-landscape",
  "borisov-concepts-angular-oak-landscape",
  "hardware-hotspots-hinge-landscape",
  "hardware-hotspots-runner-landscape",
  "hardware-hotspots-lift-landscape",
  "hardware-hotspots-corner-landscape",
]);

const groupDefinitions = {
  "angular-kitchens": [
    ["PILOT-AK-01", "Mobile Hero", "MobileHero", "hero", "hero", "portrait", "3:4", [900, 1200], [1600, 1000], "critical", [
      fromOld("angular-kitchens", "angular-hero-01"),
      planned("angular-hero-mobile-two-walls-front-02-v1","Светлая угловая кухня, вид на две стены","AI-концепт: угловая кухня с закрытыми фасадами.","Вертикальный hero: обе стороны Г-образной кухни полностью читаются, все фасады закрыты, угол в центре, спокойная зона сверху под HTML-заголовок."),
      fromOld("angular-kitchens", "angular-hero-03"), fromOld("angular-kitchens", "angular-hero-04"),
    ]],
    ["PILOT-AK-02", "Swipe Angles", "SwipeGallery", "angles", "gallery", "landscape", "3:2", [1200, 800], [1600, 1000], "near-view", [1,2,3,4,5].map((n) => fromOld("angular-kitchens", `angular-interior-${String(n).padStart(2,"0")}`))],
    ["PILOT-AK-03", "Corner Types", "CornerTypeSelector", "corner-types", "gallery", "landscape", "4:3", [960,720], [1200,900], "interaction-only", [
      planned("angular-corner-types-straight-corner-front-01-v1", "Кухонный модуль с прямым углом", "AI-концепт прямого угла кухни.", "Одинаковая кухня, прямой закрытый угол, фронтальный ракурс."),
      planned("angular-corner-types-beveled-corner-front-01-v1", "Кухонный модуль со скошенным углом", "AI-концепт скошенного угла кухни.", "Одинаковая кухня, скошенный фасад углового модуля, фронтальный ракурс."),
      planned("angular-corner-types-sink-corner-front-01-v1", "Угловая мойка на светлой столешнице", "AI-концепт угловой мойки.", "Одинаковая кухня, мойка расположена в углу, правдоподобный смеситель и стыки."),
      planned("angular-corner-types-closed-corner-front-01-v1", "Закрытый угол кухонных шкафов", "AI-концепт закрытого угла.", "Одинаковая кухня, глухой закрытый угол и рабочая поверхность без открытых механизмов."),
      planned("angular-corner-types-pullout-corner-front-01-v1", "Выдвижная система в угловом шкафу", "AI-концепт угловой выдвижной системы.", "Одинаковая кухня, угловая система полностью выдвинута и физически правдоподобна."),
    ]],
    ["PILOT-AK-04", "CornerStorageExplorer", "CornerStorageExplorer", "inside", "sequence-frame", "landscape", "4:3", [1200,900], [1600,1200], "interaction-only", Array.from({length:12},(_,i)=>fromOld("angular-kitchens",`angular-sequence-${String(i+1).padStart(2,"0")}`))],
    ["PILOT-AK-05", "Storage Use Cases", "StorageUseCases", "storage", "detail", "landscape", "3:2", [1200,800], [1600,1000], "lazy", Array.from({length:6},(_,i)=>fromOld("angular-kitchens",`angular-storage-${String(i+1).padStart(2,"0")}`))],
    ["PILOT-AK-06", "Mechanism Comparison", "MechanismComparison", "compare", "comparison", "landscape", "3:2", [1200,800], [1600,1000], "interaction-only", [
      planned("angular-kitchens-compare-shelf-pullout-landscape","Сравнение глубокой полки и выдвижного механизма углового шкафа","AI-концепт: одинаковый угол с разными вариантами доступа.","Разделённый кадр одного углового корпуса: слева простая полка, справа выдвижная система; одинаковые масштаб, свет и содержимое."),
      fromOld("angular-kitchens","angular-compare-01"), fromOld("angular-kitchens","angular-compare-02"),
    ]],
    ["PILOT-AK-07", "Technical Cutaways", "CornerStorageExplorer", "technical", "cutaway", "landscape", "3:2", [1200,800], [1600,1000], "lazy", [1,2,3,4,5].map((n)=>fromOld("angular-kitchens",`angular-cut-${String(n).padStart(2,"0")}`))],
    ["PILOT-AK-08", "Materials", "MaterialSwatches", "materials", "detail", "square", "1:1", [640,640], [900,900], "near-view", [
      ["light-oak","светлого дуба","Светлый дуб"],["warm-white","тёплого белого цвета","Тёплый белый"],["greige","серо-бежевого цвета","Серо-бежевый"],["green","с зелёным акцентом","Зелёный акцент"],["graphite","с графитовым акцентом","Графитовый акцент"],
    ].map(([slug,alt,label])=>planned(`angular-materials-${slug}-detail-01-v1`,`Фасад угловой кухни ${alt}`,`AI-концепт материала: ${label}.`,`Одинаковый фрагмент фасада и столешницы, меняется только отделка: ${label}.`))],
    ["PILOT-AK-09", "Price Factors", "CostFactors", "price", "detail", "landscape", "4:3", [960,720], [1200,900], "lazy", ["size","facades","worktop","corner-mechanism","hardware","installation"].map((slug,i)=>planned(`angular-price-factors-${slug}-detail-01-v1`,["Размер угловой кухни","Фасады угловой кухни","Столешница угловой кухни","Механизм углового шкафа","Кухонная фурнитура","Монтаж кухонных модулей"][i],"Иллюстрация фактора стоимости без указания цены.",`Предметный фрагмент для карточки фактора стоимости: ${slug}; без цифр, текста и брендов.`))],
  ],
  borisov: [
    ["PILOT-BR-01","Hero Journey","MobileHero","hero","hero","portrait","3:4",[900,1200],[1600,1000],"critical",[1,2,3,4].map(n=>fromOld("borisov",`borisov-hero-${String(n).padStart(2,"0")}`))],
    ["PILOT-BR-02","Production Journey","ProductionJourney","process","gallery","landscape","3:2",[1200,800],[1600,1000],"interaction-only",[
      planned("borisov-journey-application-detail-01-v1","Заявка на проект кухни","Иллюстрация процесса: заявка.","Руки заполняют краткий лист пожеланий без читаемых персональных данных."),
      planned("borisov-journey-estimate-detail-01-v1","Предварительное обсуждение комплектации кухни","Иллюстрация процесса: предварительный расчёт.","Образцы и нейтральная схема кухни на столе без цен и текста."),
      fromOld("borisov","borisov-process-02"), fromOld("borisov","borisov-process-01"), fromOld("borisov","borisov-process-05"), fromOld("borisov","borisov-process-07"), fromOld("borisov","borisov-process-08"),
    ]],
    ["PILOT-BR-03","Kitchen Types","KitchenChoiceDraft","types","gallery","landscape","4:3",[800,600],[1200,900],"interaction-only",[1,2,3,4,6,7].map(n=>fromOld("borisov",`borisov-concept-${String(n).padStart(2,"0")}`))],
    ["PILOT-BR-04","Styles","KitchenChoiceDraft","styles","gallery","landscape","4:3",[800,600],[1200,900],"interaction-only",["minimal","natural","classic"].map((slug,i)=>planned(`borisov-styles-${slug}-room-01-v1`,["Современная лаконичная кухня","Кухня с натуральным деревом","Спокойная кухня с классическими деталями"][i],"AI-концепт стилевого направления.",`Одна и та же кухня, меняется только стилевое направление ${slug}; без географических и проектных заявлений.`))],
    ["PILOT-BR-05","Facade Selection","KitchenChoiceDraft","facades","detail","square","1:1",[640,640],[900,900],"interaction-only",["warm-white","greige","oak","muted-green"].map((slug,i)=>planned(`borisov-facades-${slug}-detail-01-v1`,["Тёплый белый фасад","Серо-бежевый фасад","Фасад с текстурой дуба","Фасад приглушённого зелёного цвета"][i],"AI-концепт внешнего вида фасада.",`Одинаковый макрокадр образца фасада: ${slug}; только внешний вид, без характеристик.`))],
    ["PILOT-BR-06","Worktop Selection","KitchenChoiceDraft","worktops","detail","square","1:1",[640,640],[900,900],"interaction-only",["light-stone","warm-stone","oak","graphite"].map((slug,i)=>planned(`borisov-worktops-${slug}-detail-01-v1`,["Светлая каменная столешница","Тёплая бежевая столешница","Столешница с текстурой дуба","Графитовая столешница"][i],"AI-концепт внешнего вида столешницы.",`Одинаковый макрокадр края столешницы: ${slug}; без заявлений о свойствах.`))],
    ["PILOT-BR-07","Hardware Levels","KitchenChoiceDraft","hardware","comparison","landscape","4:3",[800,600],[1200,900],"interaction-only",["base","daily","extended"].map((slug,i)=>planned(`borisov-hardware-levels-${slug}-cabinet-01-v1`,["Базовый набор механизмов кухни","Механизмы для ежедневного комфорта","Расширенный набор систем хранения"][i],"Техническая иллюстрация уровня комплектации.",`Одинаковый нейтральный шкаф, сценарий ${slug}; без брендов и превосходных степеней.`))],
    ["PILOT-BR-08","Measurement","MeasureStep","measure","gallery","landscape","3:2",[1200,800],[1600,1000],"lazy",[
      planned("borisov-measure-wall-detail-01-v1","Измерение стены в помещении для кухни","Иллюстрация процесса: измерение стены.","Руки специалиста измеряют пустую стену рулеткой и дальномером, без лица и адреса."),
      planned("borisov-measure-communications-detail-01-v1","Фиксация коммуникаций и окна при замере кухни","Иллюстрация процесса: проверка коммуникаций.","Нейтральное помещение, отмечаются окно, розетки и трубы без читаемых записей."),
    ]],
    ["PILOT-BR-09","Production Illustration","ProductionStep","production","gallery","landscape","3:2",[1200,800],[1600,1000],"lazy",[fromOld("borisov","borisov-process-04"),planned("borisov-production-assembly-detail-03-v1","Сборка корпуса кухонного шкафа","Иллюстрация этапа производства, не фотография реального цеха.","Нейтральный сборочный стол, корпус шкафа проверяют по геометрии; без вывесок и узнаваемых лиц.")]],
    ["PILOT-BR-10","Delivery and Installation","DeliveryInstallationStep","delivery-install","gallery","landscape","3:2",[1200,800],[1600,1000],"lazy",[
      planned("borisov-delivery-packaged-modules-detail-01-v1","Упакованные кухонные модули в грузовом отсеке","Иллюстрация процесса: доставка без фирменного автомобиля.","Нейтральный грузовой отсек, упакованные модули закреплены, без номера, бренда и адреса."),
      planned("borisov-installation-modules-detail-01-v1","Установка нижних модулей кухни","Иллюстрация процесса: монтаж кухни.","Монтаж нижних модулей и выравнивание, безопасный инструмент, лица не видны."),
    ]],
    ["PILOT-BR-11","Verified Projects Placeholder","VerifiedProjectLinks","verified-projects","gallery","landscape","4:3",[800,600],[1200,900],"lazy",[1,2,3].map(n=>planned(`borisov-verified-project-placeholder-empty-${String(n).padStart(2,"0")}-v1`,`Место для подтверждённого проекта кухни в Борисове`,"Запись-заглушка: фото появится только после подтверждения происхождения.",null,{origin:"REAL",rightsStatus:"UNKNOWN",status:"PLANNED"}))],
    ["PILOT-BR-12","AI Concepts","AiConcepts","concepts","gallery","landscape","3:2",[1200,800],[1600,1000],"lazy",[5,8].map(n=>fromOld("borisov",`borisov-concept-${String(n).padStart(2,"0")}`)).concat([planned("borisov-ai-concepts-small-oak-room-01-v1","Концепт небольшой кухни с дубовыми деталями","AI-концепт возможной комплектации кухни.","Небольшая светлая кухня с дубовой нишей, без людей, адреса и утверждения о выполненном проекте.")])],
  ],
  hardware: [
    ["PILOT-HW-01","Cabinet Hero","MobileHero","hero","hero","portrait","3:4",[900,1200],[1400,1050],"critical",[1,2,3,4].map(n=>fromOld("hardware",`hardware-hero-${String(n).padStart(2,"0")}`))],
    ["PILOT-HW-02","Hotspot States","HardwareCabinetExplorer","mechanisms","detail","landscape","4:3",[1200,900],[1400,1050],"interaction-only",[1,2,4].map(n=>fromOld("hardware",`hardware-macro-${String(n).padStart(2,"0")}`)).concat([
      planned("hardware-hotspots-corner-landscape","Выдвижной механизм в угловом кухонном шкафу","AI-иллюстрация углового механизма без бренда.","Угловая система выдвинута в проход, механизм и корзины физически правдоподобны."),
      planned("hardware-cabinet-hotspots-base-front-01-v1","Открытый кухонный шкаф с зонами механизмов","Техническая иллюстрация общего шкафа.","Один открытый шкаф целиком, петля, ящик, верхний фасад, узкий модуль и угол хорошо различимы; без текста."),
    ])],
    ["PILOT-HW-03","Drawer Sequence","DrawerMotionDemo","drawer-motion","sequence-frame","landscape","3:2",[1200,800],[1200,800],"interaction-only",Array.from({length:8},(_,i)=>fromOld("hardware",`hardware-drawer-${String(i+1).padStart(2,"0")}`))],
    ["PILOT-HW-04","Runner Cutaway","RunnerCutaway","runner","cutaway","landscape","3:2",[1200,800],[1600,1000],"lazy",[fromOld("hardware","hardware-cut-02"),fromOld("hardware","hardware-compare-01")]],
    ["PILOT-HW-05","Hinges","HingeExplorer","hinges","detail","landscape","3:2",[1200,800],[1600,1000],"interaction-only",[
      planned("hardware-hinges-closed-front-01-v1","Закрытый фасад на кухонной петле","Техническая иллюстрация закрытого фасада.","Один нейтральный фасад полностью закрыт, петля скрыта внутри корпуса."),
      fromOld("hardware","hardware-cut-01"),fromOld("hardware","hardware-compare-02")]],
    ["PILOT-HW-06","Lift Systems","LiftMechanismExplorer","lifts","detail","landscape","3:2",[1200,800],[1600,1000],"interaction-only",[
      planned("hardware-lifts-closed-front-01-v1","Закрытый верхний кухонный фасад","Техническая иллюстрация закрытого подъёмного фасада.","Один верхний шкаф с полностью закрытым фасадом, фиксированный боковой ракурс."),
      fromOld("hardware","hardware-cut-04"),fromOld("hardware","hardware-compare-03")]],
    ["PILOT-HW-07","Cargo Systems","CargoExplorer","cargo","detail","landscape","3:2",[1200,800],[1600,1000],"lazy",[fromOld("hardware","hardware-macro-05"),fromOld("hardware","hardware-macro-06"),fromOld("hardware","hardware-cut-05")]],
    ["PILOT-HW-08","Corner Systems","CornerSystemLink","corner","detail","landscape","3:2",[1200,800],[1600,1000],"lazy",[fromOld("hardware","hardware-macro-09"),fromOld("hardware","hardware-cut-08"),planned("hardware-corner-systems-shelf-front-01-v1","Простая полка в угловом кухонном шкафу","Техническая иллюстрация простой угловой полки.","Нейтральный угловой шкаф с простой полкой, отдельная визуальная семья от угловой страницы.")]],
    ["PILOT-HW-09","Waste Sorting","WasteSortingOptions","waste","detail","landscape","3:2",[1200,800],[1600,1000],"lazy",[fromOld("hardware","hardware-macro-08"),fromOld("hardware","hardware-cut-07"),planned("hardware-waste-sorting-two-bins-front-01-v1","Два контейнера для сортировки под мойкой","Техническая иллюстрация компоновки контейнеров.","Одинаковый модуль под мойкой, два нейтральных контейнера, сифон не пересекается с системой.")]],
    ["PILOT-HW-10","Package Levels","PackageLevelComparison","package","comparison","landscape","4:3",[960,720],[1200,900],"near-view",["base","daily","extended"].map((slug,i)=>planned(`hardware-package-levels-${slug}-board-01-v1`,["Базовый уровень кухонной фурнитуры","Фурнитура для ежедневного комфорта","Расширенный набор кухонных механизмов"][i],"Техническая иллюстрация сценария комплектации без рейтинга.",`Одинаковая доска модулей, уровень ${slug}; различается только набор механизмов, без брендов и слова лучший.`))],
    ["PILOT-HW-11","Picker Results","HardwarePicker","pick","icon","landscape","4:3",[720,540],[1200,900],"lazy",["frequent-drawers","upper-facades","corner-access"].map((slug,i)=>planned(`hardware-picker-results-${slug}-diagram-01-v1`,["Схема частого использования ящиков","Схема открывания верхних фасадов","Схема доступа к угловому шкафу"][i],"Техническая схема вопроса для обсуждения с проектировщиком.",`Простая техническая схема без текста для сценария ${slug}, единая иконографика, без характеристик.`))],
    ["PILOT-HW-12","Related Categories","RelatedLinks","related","cover","landscape","4:3",[800,600],[1200,900],"lazy",["angular-kitchens","materials","prices"].map((slug,i)=>planned(`hardware-related-categories-${slug}-cover-01-v1`,["Угловая кухня с системой хранения","Образцы материалов для кухни","Факторы стоимости кухни"][i],"Запись для существующего медиа категории; происхождение требуется подтвердить.",null,{origin:"REAL",rightsStatus:"UNKNOWN",status:"PLANNED"}))],
  ],
};

function inferAssetType(value) {
  const allowed = ["hero","gallery","detail","cutaway","comparison","sequence-frame","poster","icon","cover"];
  return allowed.includes(value) ? value : "detail";
}

function detectExisting(pilot, filename, deliveryFolder) {
  const base = join(appPilotRoot, pilot);
  const sourceBase = join(root, "prepared-images/generated-sources/pilots", pilot);
  const candidates = {
    master: [join(sourceBase,`${filename}.png`), join(base,"masters",`${filename}.png`), join(base,"masters",`${filename}.tiff`)],
    avif: [join(base,deliveryFolder,`${filename}.avif`), join(base,"avif",`${filename}.avif`)],
    webp: [join(base,deliveryFolder,`${filename}.webp`), join(base,"webp",`${filename}.webp`)],
  };
  return Object.fromEntries(Object.entries(candidates).map(([kind, paths]) => [kind, paths.find(existsSync) ?? paths[0]]));
}

function assetRecord(pilot, pageUrl, group, source, index) {
  const [collectionId, , componentName, sectionId, assetType, orientation, aspectRatio, mobile, desktop, loadingPriority] = group;
  const deliveryFolder = ({ hero:"hero", gallery:"gallery", "sequence-frame":"sequences", cutaway:"cutaways", comparison:"comparisons", detail:"details", cover:"covers", poster:"posters", icon:"details" })[assetType] ?? "gallery";
  const sourceFilename = source.filename;
  const sourcePaths = detectExisting(pilot, sourceFilename, deliveryFolder);
  const hasLegacyMaster = existsSync(sourcePaths.master);
  const filename = /-v\d+$/.test(sourceFilename) || hasLegacyMaster ? sourceFilename : `${sourceFilename}-v1`;
  const paths = detectExisting(pilot, filename, deliveryFolder);
  const hasMaster = existsSync(paths.master);
  const hasDelivery = existsSync(paths.avif) && existsSync(paths.webp);
  const origin = source.origin ?? (source.prompt ? (assetType === "cutaway" || assetType === "icon" ? "TECHNICAL_RENDER" : "AI") : "UNKNOWN");
  const status = source.status ?? (hasMaster && hasDelivery ? (legacyRatioReview.has(filename) ? "REVIEW_REQUIRED" : "REGISTERED") : source.prompt ? "PROMPT_READY" : "PLANNED");
  const sequenceIndex = source.sequenceIndex ?? null;
  const sequenceId = sequenceIndex ? (source.sequenceName ?? source.continuityAnchor ? `${collectionId.toLowerCase()}-sequence` : null) : null;
  const project = (path) => relative(root, path).replaceAll("\\", "/");
  const publicUrl = (path) => `/${relative(join(appRoot,"public"), path).replaceAll("\\", "/")}`;
  return {
    assetId: `${collectionId}-${String(index + 1).padStart(3, "0")}`,
    legacyAssetId: source.assetId ?? null,
    version: 1,
    collectionId,
    pageUrl,
    componentName,
    sectionId,
    purpose: group[1],
    status,
    lifecycleHistory: status === "REGISTERED"
      ? ["GENERATED", "REVIEW_REQUIRED", "SELECTED", "OPTIMIZED", "REGISTERED"]
      : status === "REVIEW_REQUIRED" ? ["GENERATED", "REVIEW_REQUIRED"] : [status],
    origin,
    assetType: inferAssetType(assetType),
    orientation,
    aspectRatio,
    mobileWidth: mobile[0], mobileHeight: mobile[1], desktopWidth: desktop[0], desktopHeight: desktop[1],
    masterFormat: "PNG",
    deliveryFormats: ["AVIF", "WebP"],
    filename,
    namingStatus: /-v\d+$/.test(filename) ? "COMPLIANT" : (hasMaster ? "LEGACY_GRANDFATHERED" : "REVIEW_REQUIRED"),
    paths: {
      master: project(paths.master),
      avif: publicUrl(paths.avif),
      webp: publicUrl(paths.webp),
      projectMaster: project(paths.master), projectAvif: project(paths.avif), projectWebp: project(paths.webp),
    },
    alt: source.alt,
    caption: source.caption ?? null,
    prompt: source.prompt ? `${commonPrompt[pilot].base}${source.prompt}`.trim() : null,
    negativePrompt: source.prompt ? commonPrompt[pilot].negative.trim() : null,
    consistencyInstructions: source.prompt ? (source.continuityAnchor ?? "Сохранять геометрию, материалы, освещение и количество объектов между вариантами; менять только заявленный параметр.") : null,
    cameraInstructions: source.prompt ? (orientation === "portrait" ? "Вертикальный кадр уровня глаз, умеренный 35 мм, без широкоугольных искажений." : "Фиксированный ракурс уровня глаз, умеренный 35–50 мм, вертикали прямые.") : null,
    lightingInstructions: source.prompt ? "Мягкий естественный дневной свет, читаемые детали, без чрезмерного HDR и проваленных теней." : null,
    materialInstructions: source.prompt ? commonPrompt[pilot].materials : null,
    mobileCompositionInstructions: source.prompt ? "Главный объект читается на ширине 360–412 px; края механизма не обрезаны; свободная зона под интерфейс не перекрывает предмет." : null,
    variationInstructions: source.prompt ? (assetType === "hero" ? "Подготовить минимум 4 варианта композиции; менять только ракурс и распределение свободного пространства." : "Подготовить 3 варианта; для технического разреза минимум 2 композиции; выбирать по геометрии и мобильной читаемости.") : null,
    sequenceId,
    sequenceIndex,
    frameCount: sequenceIndex ? group[10].length : null,
    frameRateHint: sequenceIndex ? 8 : null,
    interactionType: sequenceIndex ? "intent-slider-and-buttons" : null,
    preloadPolicy: sequenceIndex ? "poster-only; adjacent-after-intent" : null,
    fallbackPoster: sequenceIndex ? `/media/pilots/${pilot}/posters/${collectionId.toLowerCase()}-poster-v1.webp` : null,
    reducedMotionFallback: sequenceIndex ? "first-and-last-static-states" : null,
    loadingPriority,
    rightsStatus: source.rightsStatus ?? (origin === "AI" || origin === "TECHNICAL_RENDER" ? "AI_GENERATED" : "UNKNOWN"),
    checksum: {
      masterSha256: hasMaster ? hashFile(paths.master) : null,
      avifSha256: existsSync(paths.avif) ? hashFile(paths.avif) : null,
      webpSha256: existsSync(paths.webp) ? hashFile(paths.webp) : null,
    },
    notes: hasMaster
      ? (status === "REGISTERED" ? "Существующий кандидат визуально проверен по contact sheet 2026-07-14; master и delivery-файлы сохранены. Статус не означает подключение к новой странице." : "Существующий кандидат требует нового crop/ratio или дополнительного визуального отбора; файл сохранён и не подключается как target-stage asset.")
      : "Файл не создан на этапе 3; точный prompt и delivery contract готовы.",
  };
}

const pageUrls = { "angular-kitchens":"/catalog/uglovye-kuhni", borisov:"/locations/borisov", hardware:"/materials/furnitura" };
const summary = [];

for (const pilot of pilots) {
  const groups = groupDefinitions[pilot].map((group) => ({
    collectionId: group[0],
    name: group[1],
    pageUrl: pageUrls[pilot],
    componentName: group[2],
    sectionId: group[3],
    loadingPolicy: group[9],
    assets: group[10].map((asset, index) => assetRecord(pilot, pageUrls[pilot], group, asset, index)),
  }));
  const manifest = {
    schemaVersion: 2,
    stage: "ЭТАП 3 — DIGITAL ASSET LIBRARY",
    pilot,
    pageUrl: pageUrls[pilot],
    lifecycle,
    groups,
    totals: {
      groups: groups.length,
      assets: groups.reduce((sum, group) => sum + group.assets.length, 0),
      promptReady: groups.flatMap((group) => group.assets).filter((asset) => asset.prompt).length,
      existingCandidates: groups.flatMap((group) => group.assets).filter((asset) => asset.checksum.masterSha256).length,
      connected: 0,
    },
  };
  writeFileSync(join(outputManifestDir, pilot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  summary.push({ pilot, ...manifest.totals });
}

function hardwareCollection(file) {
  const rules = [
    ["hinges-", "hinges"], ["drawer-runners-", "drawer-runners"], ["drawer-sides-", "drawer-runners"], ["drawers-", "drawer-runners"],
    ["lift-systems-", "lift-systems"], ["storage-bottle-", "bottle-pullouts"], ["corner-systems-", "corner-systems"],
    ["storage-pull-out-", "cargo"], ["organizers-", "drawer-organizers"], ["lighting-", "lighting"], ["electrical-", "lighting"],
    ["appliances-fridge-", "tall-units"],
  ];
  return rules.find(([needle]) => file.includes(needle))?.[1] ?? "comparisons";
}

const legacy = readJson(legacyHardwareRegistry);
const pageLevel = [
  { file:"hardware-hero-open-cabinet-portrait.webp", path:join(appPilotRoot,"hardware/webp/hardware-hero-open-cabinet-portrait.webp"), title:"Hero страницы фурнитуры", alt:"Открытый кухонный шкаф с видимыми механизмами", collection:"technical-cutaways", priority:"cover" },
  { file:"hardware-hotspots-hinge-landscape.webp", path:join(appPilotRoot,"hardware/webp/hardware-hotspots-hinge-landscape.webp"), title:"Начальное состояние виртуального шкафа", alt:"Кухонная петля внутри открытого шкафа", collection:"hinges", priority:"cover" },
];
const sourceRows = legacy.map((item) => ({ ...item, path: join(legacyHardwareRoot, item.file), collection: hardwareCollection(item.file), priority: item.type === "hero" ? "cover" : "normal" })).concat(pageLevel);
const hashGroups = new Map();
for (const row of sourceRows) {
  const hash = hashFile(row.path);
  const list = hashGroups.get(hash) ?? [];
  list.push(row.path);
  hashGroups.set(hash, list);
}
const duplicateIds = new Map();
let duplicateCounter = 0;
for (const [hash, paths] of hashGroups) {
  if (paths.length < 2) continue;
  duplicateCounter += 1;
  duplicateIds.set(hash, `HW-DUP-${String(duplicateCounter).padStart(3,"0")}`);
}
const inventory = sourceRows.map((row, index) => {
  const hash = hashFile(row.path);
  const isReview = row.collection === "comparisons";
  return {
    inventoryId: `HW-EXISTING-${String(index + 1).padStart(3,"0")}`,
    path: relative(root, row.path).replaceAll("\\", "/"),
    collection: row.collection,
    realOrAi: "UNKNOWN",
    sourceStatus: "SOURCE_UNKNOWN",
    duplicateGroup: duplicateIds.get(hash) ?? null,
    altStatus: row.alt ? "PRESENT_REVIEW_REQUIRED" : "MISSING",
    qualityStatus: isReview ? "REVIEW_REQUIRED" : "VISUAL_REVIEW_REQUIRED",
    displayPriority: row.priority,
    title: row.title,
    alt: row.alt,
    sha256: hash,
    notes: isReview ? "Категория не входит напрямую в 10 предметных коллекций; сохранена в comparisons до ручного тематического аудита." : "Файл не удалён и не считается подтверждённо реальным без provenance.",
  };
});
const inventoryDocument = {
  schemaVersion: 1,
  pageUrl: "/materials/furnitura",
  inventoryScope: "203 image nodes исходного mobile DOM: 201 legacy gallery records + hero + initial HardwareShowroom state",
  total: inventory.length,
  physicalFilesDeleted: 0,
  exactDuplicateGroups: duplicateIds.size,
  sourceUnknown: inventory.filter((item) => item.sourceStatus === "SOURCE_UNKNOWN").length,
  collections: Object.fromEntries([...new Set(inventory.map((item) => item.collection))].sort().map((collection) => [collection, inventory.filter((item) => item.collection === collection).length])),
  items: inventory,
};
writeFileSync(join(outputManifestDir, "hardware/existing-hardware-inventory.json"), `${JSON.stringify(inventoryDocument, null, 2)}\n`, "utf8");

writeFileSync(join(root, "docs/assets/asset-library-build-summary.json"), `${JSON.stringify({ generatedAt: "2026-07-14", manifests: summary, hardwareInventory: { total: inventory.length, duplicateGroups: duplicateIds.size, sourceUnknown: inventoryDocument.sourceUnknown } }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ manifests: summary, hardwareInventory: { total: inventory.length, duplicateGroups: duplicateIds.size } }, null, 2));
