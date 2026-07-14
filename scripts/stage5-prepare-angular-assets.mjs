import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import crypto from "node:crypto";

const root = process.cwd();
const require = createRequire(path.join(root, "artifacts/kuhni-na-zakaz/package.json"));
const sharp = require("sharp");
const generated = "C:/Users/User/.codex/generated_images/019f621c-39e0-72b3-acd0-11c4bd7bd3a4";
const targetStatus = process.env.STAGE5_ASSET_STATUS || "CONNECTED";
const masterDir = path.join(root, "prepared-images/generated-sources/pilots/angular-kitchens");
const publicDir = path.join(root, "artifacts/kuhni-na-zakaz/public/media/pilots/angular-kitchens");

const assets = [
  ["exec-f644c961-6f55-404f-8df7-1a197c3bc62f.png", "angular-kitchens-angles-full-room-front-landscape-v1", "gallery"],
  ["exec-09937d77-7224-41c9-b3e9-380a684ba3da.png", "angular-kitchens-angles-short-side-landscape-v1", "gallery"],
  ["exec-45a416cb-e16e-4ef3-b20e-92daddddb973.png", "angular-corner-types-straight-corner-front-01-v1", "gallery"],
  ["exec-2c9b1b27-2d1e-4c04-bfff-0abfc43e488b.png", "angular-corner-types-sink-corner-front-01-v1", "gallery"],
  ["exec-e37548b4-a8d2-4331-9b0f-9026a0455c54.png", "angular-storage-deep-shelf-landscape-v2", "details"],
  ["exec-c9b770b9-a4b2-47d9-ba4d-67b7f2796ba9.png", "angular-storage-carousel-landscape-v2", "details"],
  ["exec-8de935bc-4864-42f5-babf-cad0a4e7ec63.png", "angular-storage-pullout-landscape-v2", "details"],
  ["exec-86fe0a4c-0313-4cb5-ad7d-0cac346fcc65.png", "angular-materials-warm-white-detail-01-v1", "details"],
  ["exec-dbc88812-bde6-4e62-9514-e2f96d6cfa48.png", "angular-materials-green-detail-01-v1", "details"],
  ["exec-faf8e6e1-890d-494d-aa85-743ed75b6309.png", "angular-materials-graphite-detail-01-v1", "details"],
];

await fs.mkdir(masterDir, { recursive: true });
for (const [sourceName, stem, collection] of assets) {
  const source = path.join(generated, sourceName);
  const master = path.join(masterDir, `${stem}.png`);
  const delivery = path.join(publicDir, collection);
  await fs.mkdir(delivery, { recursive: true });
  await fs.copyFile(source, master);
  const pipeline = sharp(master).resize(1200, 800, { fit: "cover", position: "centre" });
  await pipeline.clone().webp({ quality: 76, effort: 5 }).toFile(path.join(delivery, `${stem}.webp`));
  await pipeline.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(delivery, `${stem}.avif`));
}

console.log(`Prepared ${assets.length} Angular stage-5 assets.`);

const manifestPath = path.join(root, "content/media/pilots/angular-kitchens/manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const updates = new Map([
  ["PILOT-AK-02-001", ["angular-kitchens-angles-full-room-front-landscape-v1", "gallery", 1]],
  ["PILOT-AK-02-003", ["angular-kitchens-angles-short-side-landscape-v1", "gallery", 1]],
  ["PILOT-AK-03-001", ["angular-corner-types-straight-corner-front-01-v1", "gallery", 1]],
  ["PILOT-AK-03-003", ["angular-corner-types-sink-corner-front-01-v1", "gallery", 1]],
  ["PILOT-AK-05-001", ["angular-storage-deep-shelf-landscape-v2", "details", 2]],
  ["PILOT-AK-05-002", ["angular-storage-carousel-landscape-v2", "details", 2]],
  ["PILOT-AK-05-003", ["angular-storage-pullout-landscape-v2", "details", 2]],
  ["PILOT-AK-08-002", ["angular-materials-warm-white-detail-01-v1", "details", 1]],
  ["PILOT-AK-08-004", ["angular-materials-green-detail-01-v1", "details", 1]],
  ["PILOT-AK-08-005", ["angular-materials-graphite-detail-01-v1", "details", 1]],
]);
const connectedIds = new Set([
  "PILOT-AK-01-001", "PILOT-AK-02-001", "PILOT-AK-02-002", "PILOT-AK-02-003",
  "PILOT-AK-03-001", "PILOT-AK-03-003", ...Array.from({ length: 12 }, (_, index) => `PILOT-AK-04-${String(index + 1).padStart(3, "0")}`),
  "PILOT-AK-05-001", "PILOT-AK-05-002", "PILOT-AK-05-003", "PILOT-AK-08-002", "PILOT-AK-08-004", "PILOT-AK-08-005",
]);

for (const group of manifest.groups) {
  for (const asset of group.assets) {
    const update = updates.get(asset.assetId);
    if (update) {
      const [stem, collection, version] = update;
      const master = path.join(masterDir, `${stem}.png`);
      const avif = path.join(publicDir, collection, `${stem}.avif`);
      const webp = path.join(publicDir, collection, `${stem}.webp`);
      asset.version = version;
      asset.filename = stem;
      asset.orientation = "landscape";
      asset.aspectRatio = "3:2";
      asset.mobileWidth = 1200;
      asset.mobileHeight = 800;
      asset.paths = {
        master: path.relative(root, master).replaceAll("\\", "/"),
        avif: `/media/pilots/angular-kitchens/${collection}/${stem}.avif`,
        webp: `/media/pilots/angular-kitchens/${collection}/${stem}.webp`,
        projectMaster: path.relative(root, master).replaceAll("\\", "/"),
        projectAvif: path.relative(root, avif).replaceAll("\\", "/"),
        projectWebp: path.relative(root, webp).replaceAll("\\", "/"),
      };
      asset.checksum = {
        masterSha256: await sha(master),
        avifSha256: await sha(avif),
        webpSha256: await sha(webp),
      };
      asset.lifecycleHistory = ["PROMPT_READY", "GENERATED", "REVIEW_REQUIRED", "SELECTED", "OPTIMIZED", "REGISTERED", "CONNECTED"];
      asset.notes = "Сгенерировано встроенным imagegen для этапа 5, визуально отобрано, оптимизировано и подключено к пилотной странице.";
    }
    if (connectedIds.has(asset.assetId)) {
      asset.status = targetStatus;
      asset.lifecycleHistory = [...new Set([...(asset.lifecycleHistory || []), "CONNECTED", ...(targetStatus === "VERIFIED" || targetStatus === "LIVE" ? ["VERIFIED"] : []), ...(targetStatus === "LIVE" ? ["LIVE"] : [])])];
    }
  }
}
manifest.stage = "ЭТАП 5 — ANGULAR KITCHENS IMPLEMENTATION";
manifest.totals.connected = connectedIds.size;
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated manifest: ${connectedIds.size} assets at ${targetStatus}.`);

async function sha(file) {
  return crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");
}
