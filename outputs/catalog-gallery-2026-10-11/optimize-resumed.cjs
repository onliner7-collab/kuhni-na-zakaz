const path = require("node:path");
const fs = require("node:fs/promises");
const sharp = require("../../artifacts/kuhni-na-zakaz/node_modules/sharp");
const directory = path.resolve(__dirname, "../../artifacts/kuhni-na-zakaz/public/images/catalog-showcase");
const stems = ["country-blue-angle","country-blue-detail","country-blue-interior","cottage-white-detail","cottage-white-interior","log-neoclassic-angle","log-neoclassic-detail","log-neoclassic-interior","studio-green-angle","studio-green-detail","studio-green-interior","corner-green-interior","classic-corner-angle-v2","hightech-corner-angle-v2","cottage-white-angle-v2"];

async function main() {
  for (const stem of stems) {
    const output = path.join(directory, stem + ".webp");
    await sharp(path.join(directory, stem + ".png")).resize(1200, 800, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
    const metadata = await sharp(output).metadata();
    console.log(stem, metadata.width, metadata.height, (await fs.stat(output)).size);
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
