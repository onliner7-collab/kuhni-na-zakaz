import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import sitemap from "../app/sitemap";

const OUTPUT_PATH = path.join(process.cwd(), "public", "sitemap-static.xml");

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value: Date | string | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function serializeEntry(entry: MetadataRoute.Sitemap[number]) {
  const lines = ["<url>", `<loc>${escapeXml(String(entry.url))}</loc>`];
  const lastModified = formatDate(entry.lastModified);

  if (lastModified) {
    lines.push(`<lastmod>${lastModified}</lastmod>`);
  }

  if (entry.changeFrequency) {
    lines.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
  }

  if (typeof entry.priority === "number") {
    lines.push(`<priority>${entry.priority.toFixed(1)}</priority>`);
  }

  lines.push("</url>");
  return lines.join("\n");
}

async function main() {
  const entries = await sitemap();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(serializeEntry),
    "</urlset>",
    "",
  ].join("\n");

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, xml, "utf8");
  console.log(`Wrote ${entries.length} sitemap URLs to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
