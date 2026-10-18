import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { minskGroups, MINSK_HERO } from "../data/minsk-page";

async function main() {
  const only = process.argv[2];
  let sources = minskGroups
    .flatMap((group) =>
      group.options.map((item, index) => ({
        id: `${group.id}-${index + 1}`,
        image: item.image,
      })),
    )
    .filter(
      (item) =>
        !only ||
        (only === "existing"
          ? !item.image.includes("minsk-v2-")
          : item.id.startsWith(only)),
    );
  if (only === "reused")
    sources = Object.entries(
      JSON.parse(
        await fs.readFile(
          path.resolve(
            process.cwd(),
            "../../outputs/minsk-visual-20261018/existing-sources.json",
          ),
          "utf8",
        ),
      ) as Record<string, string>,
    ).map(([id, image]) => ({ id, image }));
  if (only === "existing")
    sources.push(
      { id: "hero", image: MINSK_HERO },
      {
        id: "measurement",
        image:
          "/uploads/locations/minsk-stage56/minsk-measurement-02-lazernaya-ruletka-mobile.webp",
      },
    );
  const tiles = [];
  for (const item of sources) {
    const image = await sharp(path.join(process.cwd(), "public", item.image))
      .resize(300, 200, { fit: "contain", background: "#eee" })
      .toBuffer();
    const label = Buffer.from(
      `<svg width="300" height="25"><rect width="300" height="25" fill="white"/><text x="8" y="18" font-size="15">${item.id}</text></svg>`,
    );
    tiles.push(
      await sharp({
        create: { width: 300, height: 225, channels: 3, background: "white" },
      })
        .composite([
          { input: image, left: 0, top: 0 },
          { input: label, left: 0, top: 200 },
        ])
        .png()
        .toBuffer(),
    );
  }
  const output = path.resolve(
    process.cwd(),
    `../../outputs/minsk-visual-20261018/sheet-${only || "all"}.jpg`,
  );
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp({
    create: {
      width: 900,
      height: Math.ceil(tiles.length / 3) * 225,
      channels: 3,
      background: "white",
    },
  })
    .composite(
      tiles.map((input, index) => ({
        input,
        left: (index % 3) * 300,
        top: Math.floor(index / 3) * 225,
      })),
    )
    .jpeg({ quality: 85 })
    .toFile(output);
  console.log(output);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
