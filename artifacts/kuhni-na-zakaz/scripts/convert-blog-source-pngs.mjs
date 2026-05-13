/**
 * Конвертирует исходные PNG из папки «фото для блога» (нумерация (1)…(9))
 * в public/images/blog/*.webp 1200×800.
 *
 * Файл без номера в скобках (например …21_06_53.png) считается коллажем и пропускается.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const SRC_DIR = path.join(REPO_ROOT, "фото для блога");
const OUT_DIR = path.resolve(__dirname, "..", "public", "images", "blog");

/** Порядок как на странице /blog (новые сверху) — соответствует суффиксам (1)…(9) в именах файлов. */
const OUTPUT_NAMES = [
  "kuhnya-do-potolka.webp",
  "uglovaya-kuhnya-planirovka.webp",
  "stoimost-kuhni-na-zakaz-minsk-2026.webp",
  "kak-vybrat-kuhnyu-na-zakaz.webp",
  "skolko-stoit-kuhnya-na-zakaz-v-belarusi.webp",
  "kuhnya-dlya-malenkoy-kvartiry.webp",
  "fasady-mdf-plastik-emal-shpon.webp",
  "furnitura-dlya-kuhni-yashchiki-petli.webp",
  "kuhnya-s-ostrovom.webp",
];

function extractBracketNumber(filename) {
  const m = filename.match(/\((\d)\)\.png$/i);
  return m ? parseInt(m[1], 10) : null;
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error("Папка не найдена:", SRC_DIR);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith(".png"));
  const numbered = files
    .map((name) => ({ name, n: extractBracketNumber(name) }))
    .filter((x) => x.n != null && x.n >= 1 && x.n <= 9)
    .sort((a, b) => a.n - b.n);

  if (numbered.length < 9) {
    console.error("Ожидалось 9 PNG с суффиксами (1)…(9), найдено:", numbered.length);
    process.exit(1);
  }

  for (let i = 0; i < 9; i++) {
    const { name, n } = numbered[i];
    if (n !== i + 1) {
      console.warn("Нестандартный порядок номеров:", numbered.map((x) => x.n).join(","));
    }
    const inPath = path.join(SRC_DIR, name);
    const outPath = path.join(OUT_DIR, OUTPUT_NAMES[i]);
    await sharp(inPath)
      .resize(1200, 800, { fit: "cover", position: "attention" })
      .webp({ quality: 88 })
      .toFile(outPath);
    console.log("OK", name, "->", OUTPUT_NAMES[i]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
