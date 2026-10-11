import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const folder = path.resolve("public/images/small-kitchens-20261011");
for (const filename of await readdir(folder)) {
  if (!filename.endsWith(".png")) continue;
  const output = path.join(folder, filename.replace(/\.png$/, ".webp"));
  await sharp(path.join(folder, filename)).resize({ width: 1200, height: 800, fit: "inside", withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(output);
  const { size } = await stat(output);
  console.log(`${path.basename(output)}: ${size} bytes`);
  if (size > 250_000) throw new Error(`Image is too large: ${filename}`);
}
