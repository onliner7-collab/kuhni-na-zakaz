import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import {
  CANONICAL_SITE_URL,
  SITE_ALTERNATE_NAMES,
  SITE_NAME,
} from "../lib/seo";

const PROJECT_ROOT = join(__dirname, "..");
const EXPECTED_SITE_NAME = "КухниBY";
const EXPECTED_CANONICAL_SITE_URL = "https://kuhni.minsk.by";
const EXPECTED_ALTERNATE_NAMES = [
  "KuhniBY",
  "Кухни Бай",
  "Кухни Минск BY",
  "kuhni.minsk.by",
];

const forbiddenTerms = [
  ["Domain", ".by"].join(""),
  ["domain", ".by"].join(""),
  ["kuhni", "minsk", ".by"].join(""),
  ["Кухни", "Minsk"].join(""),
  ["Kuhni", "Minsk"].join(""),
  ["Кухни", "Минск"].join(""),
];

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".next-codex-build",
  "node_modules",
  "coverage",
  "dist",
  "build",
  "public",
]);
const ignoredFiles = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
]);
const ignoredExtensions = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
  ".xlsx",
  ".zip",
]);

function main() {
  assert.equal(SITE_NAME, EXPECTED_SITE_NAME, "SITE_NAME must be КухниBY");
  assert.equal(
    CANONICAL_SITE_URL,
    EXPECTED_CANONICAL_SITE_URL,
    "CANONICAL_SITE_URL must be https://kuhni.minsk.by",
  );
  assert.deepEqual(
    SITE_ALTERNATE_NAMES,
    EXPECTED_ALTERNATE_NAMES,
    "SITE_ALTERNATE_NAMES must include the canonical brand variants",
  );

  const hits = scanDirectory(PROJECT_ROOT);
  assert.equal(
    hits.length,
    0,
    `Forbidden legacy SEO strings found:\n${hits.join("\n")}`,
  );

  console.log("SEO brand check passed");
}

function scanDirectory(directory: string) {
  const hits: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    const relativePath = relative(PROJECT_ROOT, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        hits.push(...scanDirectory(fullPath));
      }
      continue;
    }

    if (!entry.isFile() || shouldIgnoreFile(entry.name, fullPath)) {
      continue;
    }

    const text = readFileSync(fullPath, "utf8");
    const lines = text.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      for (const term of forbiddenTerms) {
        if (line.includes(term)) {
          hits.push(`${relativePath}:${index + 1}: ${term}`);
        }
      }
    }
  }

  return hits;
}

function shouldIgnoreFile(fileName: string, fullPath: string) {
  if (ignoredFiles.has(fileName)) return true;
  if (fullPath === __filename) return true;
  if (statSync(fullPath).size > 2_000_000) return true;

  const dotIndex = fileName.lastIndexOf(".");
  const extension = dotIndex === -1 ? "" : fileName.slice(dotIndex).toLowerCase();
  return ignoredExtensions.has(extension);
}

main();
