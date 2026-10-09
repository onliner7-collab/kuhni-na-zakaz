import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { minskGroups } from "../data/minsk-page";

async function main() {
  const output = path.join(
    process.cwd(),
    "public/uploads/locations/minsk-selection",
  );
  await fs.mkdir(output, { recursive: true });
  const sources = [
    ...new Set(
      minskGroups.flatMap((group) =>
        group.options.map((option) => option.image),
      ),
    ),
  ];
  for (const source of sources) {
    const input = path.join(process.cwd(), "public", source);
    const basename = source
      .split("/")
      .slice(-2)
      .join("-")
      .replace(/\.webp$/, "");
    for (const width of [480, 960]) {
      await sharp(input)
        .resize(width, Math.round((width * 2) / 3), { fit: "cover" })
        .webp({ quality: 82 })
        .toFile(path.join(output, `${basename}-${width}.webp`));
    }
  }
  console.log(
    `Created ${sources.length * 2} WebP previews from existing project sources.`,
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
