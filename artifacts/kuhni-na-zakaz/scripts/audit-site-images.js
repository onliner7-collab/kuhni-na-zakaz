const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const sourceDirs = ["app", "components", "lib", "data"].map((dir) => path.join(projectRoot, dir));
const imageRefPattern = /["'`]((?:\/uploads|\/images)\/[^"'`]+\.(?:png|jpe?g|webp|avif|svg))["'`]/gi;
const badNamePattern = /(?:\s|%20|[А-Яа-яЁё]|ChatGPT|Pasted|\(|\))/;

function walkFiles(dir, predicate, acc = []) {
  if (!fs.existsSync(dir)) return acc;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, acc);
    } else if (predicate(fullPath)) {
      acc.push(fullPath);
    }
  }

  return acc;
}

function toPublicPath(ref) {
  return path.join(publicDir, ref.replace(/^\//, ""));
}

async function getImageInfo(ref) {
  const filePath = toPublicPath(ref);
  if (!fs.existsSync(filePath)) {
    return { ref, exists: false };
  }

  const stat = fs.statSync(filePath);
  if (/\.svg$/i.test(filePath)) {
    return { ref, exists: true, bytes: stat.size, width: null, height: null };
  }

  const metadata = await sharp(filePath, { failOn: "none" }).metadata();
  return {
    ref,
    exists: true,
    bytes: stat.size,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
  };
}

async function main() {
  const sourceFiles = sourceDirs.flatMap((dir) =>
    walkFiles(dir, (filePath) => /\.(tsx?|jsx?)$/i.test(filePath)),
  );
  const refs = new Map();

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const match of content.matchAll(imageRefPattern)) {
      const ref = match[1];
      const list = refs.get(ref) ?? [];
      list.push(path.relative(projectRoot, filePath));
      refs.set(ref, list);
    }
  }

  const infos = await Promise.all([...refs.keys()].sort().map(getImageInfo));
  const broken = infos.filter((item) => !item.exists);
  const oversized = infos.filter((item) => item.exists && item.bytes > 350_000);
  const badNames = infos.filter((item) => badNamePattern.test(path.basename(item.ref)));
  const generated = infos.filter((item) => item.ref.startsWith("/uploads/seo-showcase/"));

  const report = {
    checkedAt: new Date().toISOString(),
    totalReferencedImages: infos.length,
    broken,
    oversized: oversized.map((item) => ({
      ref: item.ref,
      kb: Math.round(item.bytes / 1024),
      width: item.width,
      height: item.height,
    })),
    badNames: badNames.map((item) => item.ref),
    generatedVisualizations: generated.map((item) => item.ref),
  };

  console.log(JSON.stringify(report, null, 2));

  if (broken.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

