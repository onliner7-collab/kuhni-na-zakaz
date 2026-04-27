const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const seoShowcaseDir = path.join(publicDir, "uploads", "seo-showcase");
const portfolioDir = path.join(publicDir, "uploads", "portfolio");
const stylesDir = path.join(publicDir, "uploads", "styles");
const kitchensDir = path.join(publicDir, "uploads", "kitchens");
const imagesDir = path.join(publicDir, "images");

const imageExtensions = new Set([".png", ".jpg", ".jpeg"]);

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function optimizeSeoShowcase() {
  await optimizeDirectory(seoShowcaseDir, { width: 1400, webpQuality: 72, avifQuality: 48 });
}

async function optimizeDirectory(dir, options) {
  if (!fs.existsSync(dir)) return;

  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.promises.stat(fullPath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.has(ext)) continue;

    const input = sharp(fullPath, { failOn: "none" });
    const meta = await input.metadata();

    let pipeline = input.rotate();
    if ((meta.width || 0) > options.width) {
      pipeline = pipeline.resize({ width: options.width, withoutEnlargement: true });
    }

    const tempPath = `${fullPath}.tmp`;
    if (ext === ".png") {
      await pipeline.png({ compressionLevel: 9, quality: 72, effort: 10, palette: true }).toFile(tempPath);
    } else if (ext === ".webp") {
      await pipeline.webp({ quality: 74, effort: 6 }).toFile(tempPath);
    } else {
      await pipeline.jpeg({ quality: 76, mozjpeg: true }).toFile(tempPath);
    }

    const tempStat = await fs.promises.stat(tempPath);
    if (tempStat.size < stat.size) {
      await fs.promises.rename(tempPath, fullPath);
    } else {
      await fs.promises.unlink(tempPath);
    }

    await writeModernVariants(fullPath, options);
  }
}

async function optimizeHeroImage() {
  const heroPath = path.join(imagesDir, "hero.png");
  if (!fs.existsSync(heroPath)) return;

  await writeModernVariants(heroPath, { width: 1920, webpQuality: 76, avifQuality: 52 });

  const stat = await fs.promises.stat(heroPath);
  const tempPath = `${heroPath}.tmp`;
  await sharp(heroPath, { failOn: "none" })
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 74, effort: 10, palette: true })
    .toFile(tempPath);

  const tempStat = await fs.promises.stat(tempPath);
  if (tempStat.size < stat.size) {
    await fs.promises.rename(tempPath, heroPath);
  } else {
    await fs.promises.unlink(tempPath);
  }
}

async function writeModernVariants(sourcePath, options) {
  const parsed = path.parse(sourcePath);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
  const avifPath = path.join(parsed.dir, `${parsed.name}.avif`);
  const pipeline = sharp(sourcePath, { failOn: "none" })
    .rotate()
    .resize({ width: options.width, withoutEnlargement: true });

  await pipeline.clone().webp({ quality: options.webpQuality, effort: 6 }).toFile(webpPath);
  await pipeline.clone().avif({ quality: options.avifQuality, effort: 6 }).toFile(avifPath);
}

async function createLegacyAliases() {
  await ensureDir(portfolioDir);
  await ensureDir(stylesDir);

  const portfolioTarget = path.join(portfolioDir, "portfolio-brest-1.jpg");
  const portfolioSource = path.join(seoShowcaseDir, "portfolio-brest-pryamaya-1.png");

  const styleTarget = path.join(stylesDir, "style-modern.png");
  const styleSource = path.join(seoShowcaseDir, "kuhnya-pryamaya-svetlaya-1.png");

  await sharp(portfolioSource)
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(portfolioTarget);

  await sharp(styleSource)
    .resize({ width: 1400, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 78, effort: 10, palette: true })
    .toFile(styleTarget);
}

async function main() {
  await optimizeSeoShowcase();
  await optimizeHeroImage();
  await createLegacyAliases();
  await optimizeDirectory(kitchensDir, { width: 1400, webpQuality: 74, avifQuality: 50 });
  await optimizeDirectory(portfolioDir, { width: 1400, webpQuality: 74, avifQuality: 50 });
  await optimizeDirectory(stylesDir, { width: 1200, webpQuality: 72, avifQuality: 48 });
  console.log("Optimized hero/showcase images, generated WebP/AVIF variants, and restored legacy aliases.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
