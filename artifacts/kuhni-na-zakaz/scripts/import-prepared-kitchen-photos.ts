import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

const INPUT_DIR = path.join(process.cwd(), "project-docs", "stage-4-2-photo-import");
const REPORT_PATH = path.join(INPUT_DIR, "import-report.json");
const BACKUP_DIR = path.join(process.cwd(), "backups", "stage-4-2-photo-import");

interface PortfolioCsvRow {
  projectGroupId: string;
  suggestedSlug: string;
  suggestedTitle: string;
  mainImage: string;
  images: string;
  layoutType: string;
  style: string;
  color: string;
  material: string;
  city: string;
  priceFrom: string;
  days: string;
  description: string;
  task: string;
  solution: string;
  result: string;
  confidence: string;
  needs_review: string;
}

interface StyleCsvRow {
  styleUrl: string;
  styleName: string;
  mainImage: string;
  additionalImages: string;
  alt: string;
  confidence: string;
  needs_review: string;
}

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

function readCsv<T>(fileName: string): T[] {
  const workbook = XLSX.readFile(path.join(INPUT_DIR, fileName), { type: "file" });
  const [sheetName] = workbook.SheetNames;
  if (!sheetName) return [];

  return XLSX.utils.sheet_to_json<T>(workbook.Sheets[sheetName], {
    defval: "",
    raw: false,
  });
}

function isSafe(row: { confidence: string; needs_review: string }) {
  return ["high", "medium"].includes(row.confidence) && row.needs_review !== "true";
}

function publicImagePath(sourcePath: string, section: "portfolio" | "styles" | "catalog" | "materials") {
  if (!sourcePath) return "";

  const fileName = sourcePath.split(/[\\/]/).filter(Boolean).at(-1) || "";

  return fileName ? `/uploads/kitchens/${section}/${fileName}` : "";
}

function publicImageList(sourcePaths: string, section: "portfolio" | "styles" | "catalog" | "materials") {
  return sourcePaths
    .split("|")
    .map((item) => publicImagePath(item, section))
    .filter(Boolean);
}

function safePortfolioText(row: PortfolioCsvRow) {
  const title = row.suggestedTitle.replace("минимизм", "минимализм");
  const layout = LAYOUT_LABELS[row.layoutType] || "";
  const style = STYLE_LABELS[row.style] || "";
  const material = row.material && row.material !== "unknown" ? row.material : "";

  return {
    title,
    layout,
    style,
    styleSlug: STYLE_SLUGS[row.style] || "",
    material,
    materialSlugs: material ? [material] : [],
    description:
      row.description ||
      "Визуальный пример кухни по индивидуальным размерам. Точные размеры, материалы, комплектация и бюджет уточняются после замера и согласования проекта.",
    task:
      row.task ||
      "Подготовить кухню под индивидуальные размеры помещения, разместить хранение, рабочую поверхность и встроенную технику.",
    constraints:
      "Стоимость и комплектация рассчитываются индивидуально после замера, выбора материалов и согласования проекта.",
    solution:
      row.solution ||
      "Использована подходящая планировка, спокойная цветовая гамма и практичная организация хранения. Комплектация уточняется по проекту.",
    result:
      row.result ||
      "Получился аккуратный визуальный пример кухни, который можно использовать как ориентир для будущего проекта.",
  };
}

function seoKeywords(row: PortfolioCsvRow, text: ReturnType<typeof safePortfolioText>) {
  return [text.title, text.layout && `${text.layout.toLowerCase()} кухня`, text.style, row.color]
    .filter(Boolean)
    .join(", ");
}

async function importStyles() {
  const rows = readCsv<StyleCsvRow>("style-image-mapping.csv");
  const updated: string[] = [];
  const unchanged: string[] = [];
  const skipped: Array<{ styleUrl: string; reason: string }> = [];

  for (const row of rows) {
    const slug = row.styleUrl.split("/").filter(Boolean).at(-1) || "";
    const image = publicImagePath(row.mainImage, "styles");

    if (!slug || !image) {
      skipped.push({ styleUrl: row.styleUrl, reason: "Нет slug или изображения" });
      continue;
    }

    if (!isSafe(row)) {
      skipped.push({ styleUrl: row.styleUrl, reason: "needs_review=true или низкая уверенность" });
      continue;
    }

    const existing = await prisma.stylePage.findUnique({ where: { slug } });
    if (!existing) {
      skipped.push({ styleUrl: row.styleUrl, reason: "Страница стиля не найдена в БД" });
      continue;
    }

    if (existing.image === image) {
      unchanged.push(slug);
      continue;
    }

    await prisma.stylePage.update({
      where: { slug },
      data: { image },
    });
    updated.push(slug);
  }

  return { updated, unchanged, skipped };
}

async function importPortfolioDrafts() {
  const rows = readCsv<PortfolioCsvRow>("portfolio-draft-mapping.csv");
  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const skipped: Array<{ externalId: string; reason: string }> = [];

  for (const [index, row] of rows.entries()) {
    const externalId = row.projectGroupId;
    const slug = row.suggestedSlug;
    const mainImage = publicImagePath(row.mainImage, "portfolio");
    const images = publicImageList(row.images, "portfolio");

    if (!externalId || !slug || !mainImage) {
      skipped.push({ externalId, reason: "Нет externalId, slug или mainImage" });
      continue;
    }

    const text = safePortfolioText(row);
    const existingByExternalId = await prisma.portfolioCase.findUnique({ where: { externalId } });

    if (existingByExternalId) {
      const nextData = {
        title: existingByExternalId.title || text.title,
        // Existing portfolio records are owned by the richer project-folder
        // importer. The prepared-photo importer may fill empty media fields,
        // but must not replace that canonical gallery on a repeated run.
        mainImage: existingByExternalId.mainImage || mainImage,
        images: existingByExternalId.images.length > 0 ? existingByExternalId.images : images,
        layout: existingByExternalId.layout || text.layout,
        style: existingByExternalId.style || text.style,
        styleSlug: existingByExternalId.styleSlug || text.styleSlug,
        material: existingByExternalId.material || text.material,
        materialSlugs: existingByExternalId.materialSlugs.length > 0 ? existingByExternalId.materialSlugs : text.materialSlugs,
        description: existingByExternalId.description || text.description,
        task: existingByExternalId.task || text.task,
        constraints: existingByExternalId.constraints || text.constraints,
        solution: existingByExternalId.solution || text.solution,
        result: existingByExternalId.result || text.result,
        seoTitle: existingByExternalId.seoTitle || `${text.title} | портфолио кухонь`,
        seoDescription: existingByExternalId.seoDescription || text.description,
        seoKeywords: existingByExternalId.seoKeywords || seoKeywords(row, text),
        featured: existingByExternalId.featured,
        order: existingByExternalId.order,
      };
      const hasChanges = Object.entries(nextData).some(
        ([key, value]) => !isDeepStrictEqual(existingByExternalId[key as keyof typeof existingByExternalId], value),
      );
      if (!hasChanges) {
        unchanged.push(slug);
        continue;
      }

      await prisma.portfolioCase.update({
        where: { externalId },
        data: nextData,
      });
      updated.push(slug);
      continue;
    }

    const existingBySlug = await prisma.portfolioCase.findUnique({ where: { slug } });
    if (existingBySlug) {
      skipped.push({ externalId, reason: `Slug уже занят: ${slug}` });
      continue;
    }

    await prisma.portfolioCase.create({
      data: {
        externalId,
        slug,
        title: text.title,
        city: row.city || "",
        region: "",
        area: 0,
        layout: text.layout,
        style: text.style,
        styleSlug: text.styleSlug,
        material: text.material,
        materialSlugs: text.materialSlugs,
        scenarioSlugs: [],
        priceFrom: Number(row.priceFrom) || 0,
        priceTo: 0,
        days: Number(row.days) || 0,
        completedAt: "",
        description: text.description,
        task: text.task,
        constraints: text.constraints,
        solution: text.solution,
        result: text.result,
        mainImage,
        images,
        photosBefore: [],
        photosAfter: [],
        reviewIds: [],
        featured: false,
        order: 400 + index,
        seoTitle: `${text.title} | портфолио кухонь`,
        seoDescription: text.description,
        seoKeywords: seoKeywords(row, text),
        published: false,
      },
    });
    created.push(slug);
  }

  return { created, updated, unchanged, skipped };
}

async function backupCurrentData() {
  mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `db-backup-${stamp}.json`);
  const data = {
    exportedAt: new Date().toISOString(),
    portfolioCase: await prisma.portfolioCase.findMany(),
    stylePage: await prisma.stylePage.findMany(),
    materialPage: await prisma.materialPage.findMany(),
  };

  writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf8");

  return {
    backupPath,
    counts: {
      portfolioCase: data.portfolioCase.length,
      stylePage: data.stylePage.length,
      materialPage: data.materialPage.length,
    },
  };
}

async function main() {
  readFileSync(path.join(INPUT_DIR, "stage-4-1-report.md"), "utf8");

  const backup = await backupCurrentData();
  const styles = await importStyles();
  const portfolio = await importPortfolioDrafts();
  const report = {
    generatedAt: new Date().toISOString(),
    backup,
    styles,
    portfolio,
    materials: {
      updated: [],
      skippedReason: "material-image-mapping.csv содержит material=unknown/needs_review=true; материалы не назначались автоматически.",
    },
    publishedPortfolioCreated: 0,
    sitemapChangedByPortfolio: false,
  };

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
