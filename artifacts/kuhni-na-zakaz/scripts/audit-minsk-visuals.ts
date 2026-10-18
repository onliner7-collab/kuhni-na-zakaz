import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { minskGroups } from "../data/minsk-page";

async function main() {
  const records = [];
  const seen = new Map<string, string>();
  for (const group of minskGroups) {
    for (const item of group.options) {
      const file = path.join(process.cwd(), "public", item.image);
      const bytes = await fs.readFile(file);
      const hash = crypto.createHash("sha256").update(bytes).digest("hex");
      if (seen.has(hash))
        throw new Error(
          `Повтор изображения: ${seen.get(hash)} и ${group.id}/${item.label}`,
        );
      seen.set(hash, `${group.id}/${item.label}`);
      const metadata = await sharp(bytes).metadata();
      const modules = item.visual?.modules;
      if (
        modules &&
        modules.reduce((sum, module) => sum + module.width, 0) !==
          Number.parseFloat(item.label.replace(",", ".")) * 1000
      )
        throw new Error(`Неверная длина: ${item.label}`);
      const room = item.visual?.room;
      if (
        room &&
        (room.width * room.depth) / 1_000_000 !== Number.parseInt(item.label)
      )
        throw new Error(`Неверная площадь: ${item.label}`);
      const preview = item.image.startsWith("/uploads/locations/minsk-v2-")
        ? item.image.replace(/\.webp$/, "-480.webp")
        : `/uploads/locations/minsk-selection/${item.image
            .split("/")
            .slice(-2)
            .join("-")
            .replace(/\.webp$/, "")}-480.webp`;
      const previewFile = path.join(process.cwd(), "public", preview);
      const previewMeta = await sharp(previewFile).metadata();
      if (previewMeta.width !== 480)
        throw new Error(`Нет мобильной версии: ${item.label}`);
      records.push({
        group: group.id,
        label: item.label,
        image: item.image,
        bytes: bytes.length,
        width: metadata.width,
        height: metadata.height,
        preview,
        hash,
        modules,
        room,
      });
    }
  }
  const output = path.resolve(
    process.cwd(),
    "../../outputs/minsk-visual-20261018",
  );
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(
    path.join(output, "asset-audit.json"),
    JSON.stringify(records, null, 2),
    "utf8",
  );
  console.log(
    `${records.length} вариантов: уникальность, размеры и мобильные файлы проверены.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
