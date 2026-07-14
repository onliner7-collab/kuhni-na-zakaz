import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const pilots = ["angular-kitchens", "borisov", "hardware"];
const requiredForFileStatuses = new Set(["GENERATED","REVIEW_REQUIRED","SELECTED","UPSCALED","OPTIMIZED","REGISTERED"]);
const errors = [];
let plannedWithoutFiles = 0;
let completeTriplets = 0;
for (const pilot of pilots) {
  const manifest = JSON.parse(readFileSync(resolve(root, `content/media/pilots/${pilot}/manifest.json`), "utf8"));
  for (const asset of manifest.groups.flatMap((group) => group.assets)) {
    const paths = [asset.paths.projectMaster, asset.paths.projectAvif, asset.paths.projectWebp].map((path) => resolve(root, path));
    const present = paths.map(existsSync);
    if (present.every(Boolean)) completeTriplets += 1;
    else if (requiredForFileStatuses.has(asset.status)) errors.push(`${asset.assetId}: статус ${asset.status}, но отсутствует ${paths.filter((_,index)=>!present[index]).join(", ")}`);
    else plannedWithoutFiles += 1;
  }
}
console.log(JSON.stringify({ ok: errors.length === 0, completeTriplets, plannedWithoutFiles, errors }, null, 2));
if (errors.length) process.exit(1);
