import sharp from "sharp";
import { readFile, copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
const sources = JSON.parse(
  await readFile(
    new URL("./prices-showcase-sources.json", import.meta.url),
    "utf8",
  ),
);
const root = path.resolve("public/images/prices-showcase/generated");
await mkdir(root, { recursive: true });
const results = [];
const tiles = [];
for (const source of sources) {
  const original = path.join(root, source.id + "-source.png");
  // После первой подготовки исходники уже лежат в проекте.
  const exists = await stat(original).then(() => true, () => false);
  if (!exists) await copyFile(source.path, original);
  const metadata = await sharp(original).metadata();
  const width = Math.floor(metadata.width / 2),
    height = Math.floor(metadata.height / 2);
  const files = [];
  for (let index = 0; index < 4; index++) {
    const name = source.id + "-" + (index + 1) + ".webp";
    const output = path.join(root, name);
    await sharp(original)
      .extract({
        left: (index % 2) * width + 3,
        top: Math.floor(index / 2) * height + 3,
        width: width - 6,
        height: height - 6,
      })
      .webp({ quality: 82, effort: 6 })
      .toFile(output);
    files.push({ name, bytes: (await stat(output)).size });
  }
  results.push({
    id: source.id,
    width: width - 6,
    height: height - 6,
    files,
    prompt:
      source.prompt ??
      "Four consistent photographs of a straight Scandinavian kitchen, white upper and oak lower cabinets, 3 metres. Built-in OpenAI imagegen.",
  });
  tiles.push({
    input: await sharp(original)
      .resize(450, 300, { fit: "contain", background: "white" })
      .png()
      .toBuffer(),
    left: (tiles.length % 3) * 450,
    top: Math.floor(tiles.length / 3) * 300,
  });
}
await writeFile(
  path.join(root, "manifest.json"),
  JSON.stringify(
    {
      generatedWith: "OpenAI imagegen",
      disclosure:
        "Примеры дизайна, созданные с помощью ИИ, не выполненные проекты",
      examples: results,
    },
    null,
    2,
  ),
  "utf8",
);
await sharp({
  create: {
    width: 1350,
    height: Math.ceil(tiles.length / 3) * 300,
    channels: 3,
    background: "white",
  },
})
  .composite(tiles)
  .jpeg({ quality: 90 })
  .toFile(path.resolve("scripts/prices-showcase-review.jpg"));
const all = results.flatMap((r) => r.files);
console.log(
  JSON.stringify(
    {
      examples: results.length,
      images: all.length,
      totalBytes: all.reduce((n, f) => n + f.bytes, 0),
      maxBytes: Math.max(...all.map((f) => f.bytes)),
      dimensions: results.map((r) => ({
        id: r.id,
        width: r.width,
        height: r.height,
      })),
    },
    null,
    2,
  ),
);
