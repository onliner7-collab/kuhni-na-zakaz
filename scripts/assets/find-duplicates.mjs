import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const targets = [
  resolve(root, "artifacts/kuhni-na-zakaz/public/media/pilots"),
  resolve(root, "artifacts/kuhni-na-zakaz/public/images/materials-gallery-v2/furnitura"),
];
const extensions = new Set([".png", ".webp", ".avif", ".jpg", ".jpeg", ".tif", ".tiff"]);
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extensions.has(extname(entry.name).toLowerCase())) files.push(path);
  }
}
targets.forEach(walk);
const groups = new Map();
for (const file of files) {
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
  const key = `${statSync(file).size}:${hash}`;
  groups.set(key, [...(groups.get(key) ?? []), file.replaceAll("\\", "/")]);
}
const duplicates = [...groups.values()].filter((group) => group.length > 1);
console.log(JSON.stringify({ mode: "dry-run", filesScanned: files.length, exactDuplicateGroups: duplicates.length, duplicates }, null, 2));
