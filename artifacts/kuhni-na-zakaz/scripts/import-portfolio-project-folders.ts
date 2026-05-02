import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REPO_ROOT = path.resolve(process.cwd(), "..", "..");
const PROJECTS_ROOT = path.join(REPO_ROOT, "prepared-images", "portfolio-projects");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads", "kitchens", "portfolio");
const REPORT_PATH = path.join(
  REPO_ROOT,
  "project-docs",
  "stage-4-2-photo-import",
  "portfolio-folders-import-report.json",
);

const DEFAULT_PRICE_NOTE = "Стоимость зависит от размеров, материалов и комплектации.";

const STYLE_SLUGS: Record<string, string> = {
  sovremennaya: "sovremennye",
  minimalizm: "minimalizm",
  klassika: "klassicheskie",
  neoklassika: "neoklassika",
  loft: "loft",
  skandinavskaya: "skandinavskie",
  "hay-tek": "hay-tek",
  provans: "provans",
};

const STYLE_LABELS: Record<string, string> = {
  sovremennaya: "Современный",
  minimalizm: "Минимализм",
  klassika: "Классический",
  neoklassika: "Неоклассика",
  loft: "Лофт",
  skandinavskaya: "Скандинавский",
};

const LAYOUT_LABELS: Record<string, string> = {
  "uglovaya-kuhnya": "Угловая",
  "pryamaya-kuhnya": "Прямая",
  "p-obraznaya-kuhnya": "П-образная",
  "kuhnya-s-ostrovom": "С островом",
  "malenkaya-kuhnya": "Маленькая",
  "kuhnya-do-potolka": "До потолка",
  "kuhnya-bez-ruchek": "Без ручек",
};

interface ManifestImage {
  file: string;
  alt: string;
  caption?: string;
}

interface PortfolioProjectManifest {
  externalId: string;
  slug: string;
  title: string;
  shortTitle?: string;
  layoutType: string;
  style: string;
  color?: string;
  material?: string;
  materials?: string[];
  materialSlugs?: string[];
  city?: string;
  cityKey?: string;
  region?: string;
  district?: string;
  size?: string;
  workDuration?: string;
  priceFrom?: number;
  priceTo?: number;
  priceNote?: string;
  relatedLocationSlugs?: string[];
  description?: string;
  task?: string;
  constraints?: string;
  solution?: string;
  result?: string;
  features?: string[];
  scenarioSlugs?: string[];
  published?: boolean;
  featured?: boolean;
  order?: number;
  mainImageIndex?: number;
  images: ManifestImage[];
}

function sha256Buffer(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

function urlToAbsolutePublicPath(siteUrl: string): string | null {
  if (!siteUrl.startsWith("/uploads/kitchens/portfolio/")) return null;
  const clean = siteUrl.split("?")[0];
  const rel = clean.replace(/^\//, "");
  return path.join(PUBLIC_ROOT, rel);
}

async function buildHashOwnersMap(excludeSlug?: string): Promise<Map<string, Set<string>>> {
  const map = new Map<string, Set<string>>();
  const cases = await prisma.portfolioCase.findMany({
    select: { slug: true, mainImage: true, images: true },
  });

  for (const c of cases) {
    if (excludeSlug && c.slug === excludeSlug) continue;
    const urls = [c.mainImage, ...c.images].filter(Boolean);
    for (const url of urls) {
      const abs = urlToAbsolutePublicPath(url);
      if (!abs) continue;
      try {
        const buf = readFileSync(abs);
        const h = sha256Buffer(buf);
        if (!map.has(h)) map.set(h, new Set());
        map.get(h)!.add(c.slug);
      } catch {
        /* ignore missing */
      }
    }
  }

  return map;
}

function assertNoDuplicateAcrossProjects(hashOwners: Map<string, Set<string>>, hash: string) {
  const owners = hashOwners.get(hash);
  if (!owners || owners.size === 0) return;
  throw new Error(
    `Файл с таким содержимым уже используется в проекте(ах): ${[...owners].join(", ")}. Один файл — один проект.`,
  );
}

function normalizeCityKey(city: string): string {
  const value = city.trim().toLowerCase();
  const map: Record<string, string> = {
    минск: "minsk",
    гомель: "gomel",
    могилев: "mogilev",
    могилёв: "mogilev",
    витебск: "vitebsk",
    брест: "brest",
    гродно: "grodno",
  };
  return map[value] || "";
}

function safePortfolioCopy(manifest: PortfolioProjectManifest, layoutLabel: string, styleLabel: string) {
  const material =
    manifest.material && manifest.material.trim() && manifest.material.toLowerCase() !== "unknown"
      ? manifest.material.trim()
      : "";
  const materials = manifest.materials?.length ? manifest.materials : material ? [material] : [];

  const description =
    (manifest.description && manifest.description.trim()) ||
    "Визуальный пример кухни по индивидуальным размерам. Точные размеры, материалы, комплектация и бюджет уточняются после замера и согласования проекта.";

  const task =
    (manifest.task && manifest.task.trim()) ||
    "Подготовить кухню под индивидуальные размеры помещения, разместить хранение, рабочую поверхность и встроенную технику.";

  const constraints =
    (manifest.constraints && manifest.constraints.trim()) ||
    "Точные размеры, материалы, комплектация, город, сроки и стоимость не подтверждены и требуют ручной проверки перед публикацией.";

  const solution =
    (manifest.solution && manifest.solution.trim()) ||
    "Использована подходящая планировка, спокойная цветовая гамма и практичная организация хранения. Комплектация уточняется по проекту.";

  const result =
    (manifest.result && manifest.result.trim()) ||
    "Получился аккуратный визуальный пример кухни, который можно использовать как ориентир для будущего проекта.";

  return {
    material,
    materials,
    description,
    task,
    constraints,
    solution,
    result,
    layoutLabel,
    styleLabel,
  };
}

function seoKeywords(title: string, layoutLabel: string, styleLabel: string, color: string) {
  return [title, layoutLabel && `${layoutLabel.toLowerCase()} кухня`, styleLabel, color].filter(Boolean).join(", ");
}

function sanitizeDestBase(fileName: string): string {
  const base = path.basename(fileName);
  return base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
}

async function main() {
  mkdirSync(UPLOAD_DIR, { recursive: true });

  if (!existsSync(PROJECTS_ROOT)) {
    console.error(`Нет каталога проектов: ${PROJECTS_ROOT}`);
    process.exit(1);
  }

  const entries = readdirSync(PROJECTS_ROOT, { withFileTypes: true });
  const projectDirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
    .map((e) => path.join(PROJECTS_ROOT, e.name));

  const processed: string[] = [];
  const skipped: Array<{ dir: string; reason: string }> = [];
  const errors: Array<{ dir: string; error: string }> = [];

  let orderCursor =
    (
      await prisma.portfolioCase.aggregate({
        _max: { order: true },
      })
    )._max.order ?? 0;

  for (const dir of projectDirs) {
    const manifestPath = path.join(dir, "manifest.json");
    if (!existsSync(manifestPath)) {
      skipped.push({ dir, reason: "Нет manifest.json" });
      continue;
    }

    let manifest: PortfolioProjectManifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as PortfolioProjectManifest;
    } catch (e) {
      errors.push({ dir, error: `manifest.json: ${e instanceof Error ? e.message : String(e)}` });
      continue;
    }

    const slug = manifest.slug?.trim();
    const externalId = manifest.externalId?.trim();
    if (!externalId || !slug || !manifest.title?.trim()) {
      errors.push({ dir, error: "Нужны externalId, slug и title" });
      continue;
    }

    if (!manifest.images?.length) {
      errors.push({ dir, error: "Массив images пуст" });
      continue;
    }

    const existingSlug = await prisma.portfolioCase.findUnique({ where: { slug } });
    const existingExternal = await prisma.portfolioCase.findUnique({ where: { externalId } });
    if (existingSlug && existingSlug.externalId !== externalId) {
      errors.push({ dir, error: `slug «${slug}» уже занят другим externalId` });
      continue;
    }
    if (existingExternal && existingExternal.slug !== slug) {
      errors.push({ dir, error: `externalId уже привязан к slug «${existingExternal.slug}»` });
      continue;
    }

    const layoutLabel =
      LAYOUT_LABELS[manifest.layoutType] || manifest.layoutType || "";
    const styleLabel = STYLE_LABELS[manifest.style] || manifest.style || "";
    const styleSlug = STYLE_SLUGS[manifest.style] || "";
    const color = (manifest.color ?? "").trim();
    const city = (manifest.city ?? "").trim();
    const cityKey = (manifest.cityKey ?? "").trim() || normalizeCityKey(city);

    const copy = safePortfolioCopy(manifest, layoutLabel, styleLabel);

    const mainIdx = Math.min(Math.max(manifest.mainImageIndex ?? 0, 0), manifest.images.length - 1);

    const hashOwners = await buildHashOwnersMap(slug);
    const batchSeenHashes = new Set<string>();

    const destUrls: string[] = [];
    const alts: string[] = [];
    const captions: string[] = [];

    try {
      for (let i = 0; i < manifest.images.length; i++) {
        const item = manifest.images[i];
        const alt = (item.alt ?? "").trim();
        if (!alt) {
          throw new Error(`images[${i}]: пустой alt`);
        }
        const caption = (item.caption ?? "").trim();
        const srcPath = path.join(dir, item.file);
        if (!existsSync(srcPath)) {
          throw new Error(`Файл не найден: ${item.file}`);
        }

        const buf = readFileSync(srcPath);
        const hash = sha256Buffer(buf);
        if (batchSeenHashes.has(hash)) {
          throw new Error(`Дубликат изображения по содержимому в этом manifest (файл ${item.file})`);
        }
        batchSeenHashes.add(hash);

        assertNoDuplicateAcrossProjects(hashOwners, hash);

        const ext = path.extname(item.file) || path.extname(srcPath) || ".webp";
        const destBase = `${slug}__${String(i + 1).padStart(2, "0")}__${sanitizeDestBase(path.basename(item.file, ext))}${ext}`;
        const destPath = path.join(UPLOAD_DIR, destBase);
        copyFileSync(srcPath, destPath);

        const publicUrl = `/uploads/kitchens/portfolio/${destBase}`;
        destUrls.push(publicUrl);
        alts.push(alt);
        captions.push(caption);
      }
    } catch (e) {
      errors.push({ dir, error: e instanceof Error ? e.message : String(e) });
      continue;
    }

    const mainImage = destUrls[mainIdx] ?? destUrls[0];
    const altMain = alts[mainIdx] ?? alts[0];

    const priceFrom = manifest.priceFrom ?? 0;
    const priceTo = manifest.priceTo ?? 0;
    const priceNote = (manifest.priceNote ?? "").trim() || DEFAULT_PRICE_NOTE;
    const district = (manifest.district ?? "").trim();
    const size = (manifest.size ?? "").trim();
    const workDuration = (manifest.workDuration ?? "").trim();
    const region = (manifest.region ?? "").trim();

    let relatedLocationSlugs = manifest.relatedLocationSlugs?.filter(Boolean) ?? [];
    if (!relatedLocationSlugs.length && cityKey) {
      relatedLocationSlugs = [cityKey];
    }

    const materials = copy.materials;
    const materialSlugs = manifest.materialSlugs?.length ? manifest.materialSlugs : [];
    const scenarioSlugs = manifest.scenarioSlugs ?? [];
    const features = manifest.features ?? [];

    const published = manifest.published !== false;
    const featured = manifest.featured === true;

    const assignedOrder =
      typeof manifest.order === "number" && Number.isFinite(manifest.order)
        ? manifest.order
        : ++orderCursor;

    const payload = {
      title: manifest.title.trim(),
      shortTitle: (manifest.shortTitle ?? "").trim(),
      slug,
      city,
      cityKey,
      region,
      district,
      kitchenType: layoutLabel,
      area: 0,
      layout: layoutLabel,
      style: copy.styleLabel,
      styleSlug,
      color: color || "Светлая",
      material: copy.material,
      materials,
      materialSlugs,
      scenarioSlugs,
      priceFrom,
      priceTo,
      priceNote,
      size,
      facades: copy.material,
      countertop: "",
      fittings: "",
      workDuration,
      days: 0,
      completedAt: "",
      description: copy.description,
      task: copy.task,
      constraints: copy.constraints,
      solution: copy.solution,
      result: copy.result,
      features,
      relatedLocationSlugs,
      mainImage,
      images: destUrls,
      imageAlts: alts,
      imageCaptions: captions,
      alt: altMain,
      photosBefore: [],
      photosAfter: [],
      reviewIds: [],
      featured,
      order: assignedOrder,
      seoTitle: `${manifest.title.trim()} | портфолио кухонь`,
      seoDescription: copy.description,
      seoKeywords: seoKeywords(manifest.title.trim(), layoutLabel, copy.styleLabel, color),
      published,
    };

    await prisma.portfolioCase.upsert({
      where: { externalId },
      create: {
        externalId,
        ...payload,
      },
      update: payload,
    });

    processed.push(slug);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    projectsRoot: PROJECTS_ROOT,
    processed,
    skipped,
    errors,
  };

  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
