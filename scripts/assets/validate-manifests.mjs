import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const pilots = ["angular-kitchens", "borisov", "hardware"];
const expectedGroups = { "angular-kitchens": 9, borisov: 12, hardware: 12 };
const forbiddenStatuses = new Set(["CONNECTED", "VERIFIED", "LIVE"]);
const requiredPromptFields = [
  "prompt", "negativePrompt", "consistencyInstructions", "cameraInstructions", "lightingInstructions",
  "materialInstructions", "mobileCompositionInstructions", "variationInstructions",
];
const errors = [];
const warnings = [];
const assetIds = new Set();
const collectionIds = new Set();
let assetCount = 0;
let promptCount = 0;

for (const pilot of pilots) {
  const path = resolve(root, `content/media/pilots/${pilot}/manifest.json`);
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  if (manifest.schemaVersion !== 2) errors.push(`${pilot}: schemaVersion должен быть 2`);
  if (manifest.groups.length !== expectedGroups[pilot]) errors.push(`${pilot}: ожидалось ${expectedGroups[pilot]} групп, найдено ${manifest.groups.length}`);
  for (const group of manifest.groups) {
    if (collectionIds.has(group.collectionId)) errors.push(`Дублирующий collectionId: ${group.collectionId}`);
    collectionIds.add(group.collectionId);
    if (!group.assets.length) errors.push(`${group.collectionId}: пустая группа`);
    const sequence = group.assets.filter((asset) => asset.sequenceIndex !== null);
    if (sequence.length) {
      const indexes = sequence.map((asset) => asset.sequenceIndex).sort((a, b) => a - b);
      indexes.forEach((value, index) => {
        if (value !== index + 1) errors.push(`${group.collectionId}: sequence имеет пропуск у индекса ${index + 1}`);
      });
      const ratios = new Set(sequence.map((asset) => `${asset.aspectRatio}:${asset.mobileWidth}x${asset.mobileHeight}`));
      if (ratios.size !== 1) errors.push(`${group.collectionId}: кадры sequence имеют разные размеры или ratio`);
    }
    for (const asset of group.assets) {
      assetCount += 1;
      if (assetIds.has(asset.assetId)) errors.push(`Дублирующий assetId: ${asset.assetId}`);
      assetIds.add(asset.assetId);
      for (const field of ["assetId","collectionId","pageUrl","componentName","sectionId","purpose","status","origin","assetType","aspectRatio","filename","alt","loadingPriority","rightsStatus"]) {
        if (asset[field] === undefined || asset[field] === null || asset[field] === "") errors.push(`${asset.assetId}: отсутствует ${field}`);
      }
      if (forbiddenStatuses.has(asset.status)) errors.push(`${asset.assetId}: статус ${asset.status} запрещён на этапе 3`);
      if (!/[А-Яа-яЁё]/.test(asset.alt)) errors.push(`${asset.assetId}: alt должен быть на русском языке`);
      if (["AI","TECHNICAL_RENDER"].includes(asset.origin)) {
        promptCount += 1;
        for (const field of requiredPromptFields) if (!asset[field]) errors.push(`${asset.assetId}: отсутствует prompt-поле ${field}`);
      }
      if (asset.namingStatus === "REVIEW_REQUIRED") errors.push(`${asset.assetId}: имя не соответствует policy и не является существующим legacy-файлом`);
      if (asset.namingStatus === "LEGACY_GRANDFATHERED") warnings.push(`${asset.assetId}: существующее legacy-имя сохранено без переименования`);
    }
  }
}

if (collectionIds.size !== 33) errors.push(`Всего должно быть 33 группы, найдено ${collectionIds.size}`);
console.log(JSON.stringify({ ok: errors.length === 0, groups: collectionIds.size, assets: assetCount, prompts: promptCount, warnings: warnings.length, errors }, null, 2));
if (errors.length) process.exit(1);
