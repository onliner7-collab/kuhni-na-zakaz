import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const appRoot = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(appRoot, "..", "..");
const mediaRoot = path.join(appRoot, "public", "media", "visual-rescue");

const series = {
  "kuhni-bez-ruchek": [
    "handleless-overview",
    "handleless-profile",
    "handleless-push",
    "handleless-integrated",
    "handleless-lower-drawers",
    "handleless-upper-cabinet",
  ],
  neoklassika: [
    "neo-overview",
    "neo-frame",
    "neo-proportions",
    "neo-material",
    "neo-light",
    "neo-classic-compare",
  ],
  "hay-tek": [
    "hightech-overview",
    "hightech-appliances",
    "hightech-lines",
    "hightech-surface",
    "hightech-lighting",
    "hightech-minimal-compare",
  ],
};

for (const [slug, stems] of Object.entries(series)) {
  const directory = path.join(mediaRoot, slug);
  const prepared = [];

  for (const stem of stems) {
    const master = path.join(directory, "masters", `${stem}.png`);
    const webp = path.join(directory, `${stem}.webp`);
    const avif = path.join(directory, `${stem}.avif`);

    await sharp(master)
      .resize(1200, 800, { fit: "cover", position: "centre" })
      .webp({ quality: 78, effort: 6 })
      .toFile(webp);
    await sharp(master)
      .resize(1200, 800, { fit: "cover", position: "centre" })
      .avif({ quality: 56, effort: 6 })
      .toFile(avif);

    prepared.push(
      await sharp(webp)
        .resize(560, 374, { fit: "cover", position: "centre" })
        .webp({ quality: 76 })
        .toBuffer(),
    );
  }

  const tileWidth = 560;
  const tileHeight = 374;
  const gap = 16;
  const width = tileWidth * 3 + gap * 4;
  const height = tileHeight * 2 + gap * 3;
  const composite = prepared.map((input, index) => ({
    input,
    left: gap + (index % 3) * (tileWidth + gap),
    top: gap + Math.floor(index / 3) * (tileHeight + gap),
  }));

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#f5f4ef",
    },
  })
    .composite(composite)
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(directory, "contact-sheet.webp"));
}

const report = [];
for (const [slug, stems] of Object.entries(series)) {
  for (const stem of stems) {
    for (const extension of ["webp", "avif"]) {
      const file = path.join(mediaRoot, slug, `${stem}.${extension}`);
      const metadata = await sharp(file).metadata();
      const stat = await fs.stat(file);
      report.push({
        file: path.relative(workspaceRoot, file).replaceAll("\\", "/"),
        width: metadata.width,
        height: metadata.height,
        bytes: stat.size,
      });
    }
  }
}

console.log(JSON.stringify(report, null, 2));
