import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public", "uploads", "locations");
const evidenceRoot = path.resolve(projectRoot, "..", "..", "artifacts", "location-visual-corrective");
const batches = {
  l3b: ["cherven", "kletsk", "kopyl"],
  l3c: ["krupki", "lyuban", "starye-dorogi"],
};

for (const [batch, cities] of Object.entries(batches)) {
  const contactSheetRoot = path.join(evidenceRoot, batch, "contact-sheets");
  await fs.mkdir(contactSheetRoot, { recursive: true });

  for (const city of cities) {
    const directory = path.join(publicRoot, `${city}-visual-${batch}`);
    const masters = (await fs.readdir(directory)).filter((file) => file.endsWith(".png")).sort();
    if (masters.length !== 4) throw new Error(`${city}: expected 4 PNG masters, got ${masters.length}`);

    const contactFrames = [];
    for (const master of masters) {
      const source = path.join(directory, master);
      const stem = path.basename(master, ".png");
      const pipeline = sharp(source, { failOn: "error" }).rotate().resize(1200, 800, { fit: "cover" });
      await pipeline.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(directory, `${stem}.webp`));
      await pipeline.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(directory, `${stem}.avif`));
      await pipeline.clone().resize(480, 320, { fit: "cover" }).webp({ quality: 76, effort: 6 }).toFile(path.join(directory, `${stem}-mobile.webp`));
      contactFrames.push(await pipeline.clone().resize(600, 400, { fit: "cover" }).webp({ quality: 76 }).toBuffer());
    }

    await sharp({ create: { width: 1200, height: 800, channels: 3, background: "#e7e5e4" } })
      .composite(contactFrames.map((input, index) => ({ input, left: (index % 2) * 600, top: Math.floor(index / 2) * 400 })))
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(contactSheetRoot, `${city}-contact-sheet.webp`));
  }
}

console.log("Prepared 24 L3B/L3C masters with WebP/AVIF parity, mobile derivatives and six contact sheets.");
