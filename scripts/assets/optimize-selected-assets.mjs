import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const require = createRequire(resolve(root, "artifacts/kuhni-na-zakaz/package.json"));
const sharp = require("sharp");
const args = Object.fromEntries(process.argv.slice(2).map((value) => value.split("=", 2)));
if (!args.input || !args.pilot || !args.stem || !args.folder) {
  console.error("Usage: node optimize-selected-assets.mjs input=<png> pilot=<pilot> stem=<stem> folder=<hero|gallery|...>");
  process.exit(1);
}

const input = resolve(args.input);
const sourceDirectory = resolve(root, `prepared-images/generated-sources/pilots/${args.pilot}`);
const sourceArchive = resolve(sourceDirectory, "originals");
const master = resolve(sourceDirectory, `${args.stem}.png`);
const deliveryDirectory = resolve(root, `artifacts/kuhni-na-zakaz/public/media/pilots/${args.pilot}/${args.folder}`);
mkdirSync(sourceArchive, { recursive: true });
mkdirSync(deliveryDirectory, { recursive: true });
copyFileSync(input, resolve(sourceArchive, `${args.stem}-source.png`));

await sharp(input).resize(900, 1200, { fit: "cover", position: "attention" }).png({ compressionLevel: 9 }).toFile(master);
await sharp(master).avif({ quality: 58, effort: 6 }).toFile(resolve(deliveryDirectory, `${args.stem}.avif`));
await sharp(master).webp({ quality: 78, effort: 6 }).toFile(resolve(deliveryDirectory, `${args.stem}.webp`));
const metadata = await sharp(master).metadata();
console.log(JSON.stringify({ input: basename(input), stem: args.stem, width: metadata.width, height: metadata.height }, null, 2));
