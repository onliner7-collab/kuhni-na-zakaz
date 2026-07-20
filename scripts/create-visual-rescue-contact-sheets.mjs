import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { default: sharp } = await import(pathToFileURL(path.resolve("artifacts/kuhni-na-zakaz/node_modules/sharp/lib/index.js")).href);

const appPublic = path.resolve("artifacts/kuhni-na-zakaz/public");
const outputRoot = path.resolve("artifacts/visual-rescue");

const sheets = [
  {
    output: path.join(outputRoot, "stage-2", "angular-kitchens-contact-sheet.webp"),
    files: [
      "media/pilots/angular-kitchens/gallery/angular-kitchens-angles-full-room-front-landscape-v1.webp",
      "media/pilots/angular-kitchens/webp/angular-kitchens-angles-long-side-landscape.webp",
      "media/pilots/angular-kitchens/gallery/angular-kitchens-angles-short-side-landscape-v1.webp",
      "media/pilots/angular-kitchens/gallery/angular-corner-types-straight-corner-front-01-v1.webp",
      "media/pilots/angular-kitchens/gallery/angular-corner-types-sink-corner-front-01-v1.webp",
      "media/pilots/angular-kitchens/details/angular-storage-pullout-landscape-v2.webp",
    ],
  },
  {
    output: path.join(outputRoot, "stage-3", "borisov-process-contact-sheet.webp"),
    files: [
      "media/pilots/borisov/webp/borisov-process-request.webp",
      "media/pilots/borisov/webp/borisov-process-estimate.webp",
      "media/pilots/borisov/webp/borisov-process-measure.webp",
      "media/pilots/borisov/webp/borisov-process-project.webp",
      "media/pilots/borisov/webp/borisov-process-production.webp",
      "media/pilots/borisov/webp/borisov-process-delivery.webp",
      "media/pilots/borisov/webp/borisov-process-installation.webp",
    ],
  },
];

for (const sheet of sheets) {
  await fs.mkdir(path.dirname(sheet.output), { recursive: true });
  const thumbs = await Promise.all(sheet.files.map(async (file) => ({
    input: await sharp(path.join(appPublic, file)).resize(560, 374, { fit: "cover" }).webp({ quality: 78 }).toBuffer(),
  })));
  const width = 1160;
  const height = Math.ceil(thumbs.length / 2) * 394 + 20;
  const composite = thumbs.map((item, index) => ({ ...item, left: 20 + (index % 2) * 570, top: 20 + Math.floor(index / 2) * 394 }));
  await sharp({ create: { width, height, channels: 3, background: "#f5f4ef" } })
    .composite(composite)
    .webp({ quality: 82 })
    .toFile(sheet.output);
}
