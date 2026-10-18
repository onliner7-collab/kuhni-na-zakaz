import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

async function main() {
  const manifest = JSON.parse(
    await fs.readFile(
      path.resolve(
        process.cwd(),
        "../../outputs/minsk-visual-20261018/generated-sources.json",
      ),
      "utf8",
    ),
  ) as Record<string, { source: string }>;
  const output = path.resolve(
    process.cwd(),
    "public/uploads/locations/minsk-v2-20261018",
  );
  const existing = JSON.parse(
    await fs.readFile(
      path.resolve(
        process.cwd(),
        "../../outputs/minsk-visual-20261018/existing-sources.json",
      ),
      "utf8",
    ),
  ) as Record<string, string>;
  await fs.mkdir(path.join(output, "sources"), { recursive: true });
  for (const [id, { source }] of Object.entries(manifest)) {
    const master = path.join(output, "sources", `${id}.png`);
    if (await fs.access(source).then(() => true, () => false)) await fs.copyFile(source, master);
    else await fs.access(master);
    for (const width of [480, 960, 1200]) {
      await sharp(master)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(
          path.join(output, `${id}${width === 1200 ? "" : `-${width}`}.webp`),
        );
    }
  }
  for (const [id, source] of Object.entries(existing)) {
    const input = path.join(output, "sources", `${id}-existing.webp`);
    const original = path.join(process.cwd(), "public", source);
    if (await fs.access(original).then(() => true, () => false)) await fs.copyFile(original, input);
    else await fs.access(input);
    for (const width of [480, 960, 1200]) {
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(
          path.join(output, `${id}${width === 1200 ? "" : `-${width}`}.webp`),
        );
    }
  }
  console.log(
    `Сохранены ${Object.keys(manifest).length} исходников и WebP-комплекты.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
