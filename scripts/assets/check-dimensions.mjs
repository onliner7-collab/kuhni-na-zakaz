import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const require = createRequire(resolve(root, "artifacts/kuhni-na-zakaz/package.json"));
const sharp = require("sharp");
const pilots = ["angular-kitchens", "borisov", "hardware"];
const rows = [];
const errors = [];
const warnings = [];
for (const pilot of pilots) {
  const manifest = JSON.parse(readFileSync(resolve(root, `content/media/pilots/${pilot}/manifest.json`), "utf8"));
  for (const asset of manifest.groups.flatMap((group) => group.assets)) {
    const master = resolve(root, asset.paths.projectMaster);
    if (!existsSync(master)) continue;
    const metadata = await sharp(master).metadata();
    const expectedRatio = asset.mobileWidth / asset.mobileHeight;
    const actualRatio = metadata.width / metadata.height;
    const ratioMatches = Math.abs(expectedRatio - actualRatio) <= 0.035 || asset.assetType === "hero";
    rows.push({ assetId: asset.assetId, width: metadata.width, height: metadata.height, expected: `${asset.mobileWidth}x${asset.mobileHeight}`, ratioMatches });
    if (!metadata.width || !metadata.height) errors.push(`${asset.assetId}: dimensions не читаются`);
    if (!ratioMatches) {
      const message = `${asset.assetId}: aspect ratio ${metadata.width}x${metadata.height} расходится с ${asset.mobileWidth}x${asset.mobileHeight}`;
      if (asset.status === "REVIEW_REQUIRED") warnings.push(message);
      else errors.push(message);
    }
  }
}
console.log(JSON.stringify({ ok: errors.length === 0, filesChecked: rows.length, warnings, errors }, null, 2));
if (errors.length) process.exit(1);
