import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const pilots = ["angular-kitchens", "borisov", "hardware"];
const compliant = /^[a-z0-9]+(?:-[a-z0-9]+)*-v\d+$/;
const invalid = [];
const legacy = [];
for (const pilot of pilots) {
  const manifest = JSON.parse(readFileSync(resolve(root, `content/media/pilots/${pilot}/manifest.json`), "utf8"));
  for (const asset of manifest.groups.flatMap((group) => group.assets)) {
    if (compliant.test(asset.filename)) continue;
    if (asset.namingStatus === "LEGACY_GRANDFATHERED" && asset.checksum.masterSha256) legacy.push(asset.filename);
    else invalid.push(asset.filename);
  }
}
console.log(JSON.stringify({ ok: invalid.length === 0, compliantPolicy: "latin-kebab-case-with-vN", legacyPreserved: legacy.length, invalid }, null, 2));
if (invalid.length) process.exit(1);
