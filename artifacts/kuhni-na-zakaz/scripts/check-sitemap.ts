import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sitemap, { FINAL_POLISH_PATHS } from "../app/sitemap";
import robots from "../app/robots";

const BASE_URL = "https://kuhni.minsk.by";

const requiredPaths = [
  "/",
  "/catalog",
  "/styles",
  "/materials",
  "/locations",
  "/blog",
  "/portfolio",
  "/calculator",
  "/prices",
  "/about",
  "/contacts",
  "/design-proekt-kuhni",
] as const;

const forbiddenPathPrefixes = [
  "/admin",
  "/api",
  "/kapi",
  "/search",
  "/thanks",
  "/configurator",
  "/kitchen-configurator",
] as const;

const forbiddenExactPaths = [
  "/privacy-policy",
  "/personal-data",
  "/terms",
  "/catalog/kuhnya-bez-ruchek-minsk",
  "/catalog/kuhnya-do-potolka-minsk",
  "/catalog/malenkaya-kuhnya-minsk",
  "/catalog/pryamaya-kuhnya-minsk",
  "/catalog/uglovaya-kuhnya-minsk",
  "/catalog/p-obraznaya-kuhnya-minsk",
  "/catalog/kuhnya-s-ostrovom-minsk",
  "/catalog/kuhnya-dlya-studii-minsk",
  "/catalog/sovremennaya-kuhnya-minsk",
  "/catalog/kuhnya-ekonom-minsk",
] as const;

async function main() {
  const entries = await sitemap();
  const urls = entries.map((entry) => String(entry.url));
  const uniqueUrls = new Set(urls);

  assert.equal(urls.length, uniqueUrls.size, "sitemap must not contain duplicate URLs");
  assert.equal(urls.length, 112, "sitemap must contain exactly 112 canonical URLs");
  assert.equal(FINAL_POLISH_PATHS.size, 23, "final polish release must track exactly 23 URLs");

  for (const path of requiredPaths) {
    assert.ok(uniqueUrls.has(`${BASE_URL}${path === "/" ? "/" : path}`), `missing required URL: ${path}`);
  }

  for (const entry of entries) {
    const url = String(entry.url);
    const parsed = new URL(url);

    assert.equal(parsed.protocol, "https:", `URL must use https: ${url}`);
    assert.equal(parsed.hostname, "kuhni.minsk.by", `URL must use non-www host: ${url}`);
    assert.equal(parsed.search, "", `URL must not contain query string: ${url}`);
    assert.equal(parsed.hash, "", `URL must not contain hash: ${url}`);
    assert.ok(entry.lastModified, `URL must include lastModified: ${url}`);
    assert.ok(entry.changeFrequency, `URL must include changeFrequency: ${url}`);
    assert.equal(typeof entry.priority, "number", `URL must include numeric priority: ${url}`);
    assert.ok(
      !forbiddenPathPrefixes.some((prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`)),
      `sitemap must not include private or redirected URL: ${url}`,
    );
    assert.ok(
      !forbiddenExactPaths.includes(parsed.pathname as (typeof forbiddenExactPaths)[number]),
      `sitemap must not include non-canonical or low-value URL: ${url}`,
    );
  }

  for (const path of FINAL_POLISH_PATHS) {
    const entry = entries.find((item) => new URL(String(item.url)).pathname === path);
    assert.ok(entry, `missing final polish URL: ${path}`);
    assert.equal(
      new Date(String(entry.lastModified)).toISOString(),
      "2026-07-24T19:30:00.000Z",
      `incorrect final polish lastmod: ${path}`,
    );
  }

  const robotsConfig = robots();
  assert.equal(robotsConfig.sitemap, `${BASE_URL}/sitemap.xml`, "robots.txt must point to the canonical sitemap");

  const staticSitemapPath = path.join(process.cwd(), "public", "sitemap-static.xml");
  const staticSitemapXml = await readFile(staticSitemapPath, "utf8");
  const staticUrls = [...staticSitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'"),
  );
  assert.deepEqual(
    staticUrls.sort(),
    urls.slice().sort(),
    "public/sitemap-static.xml must be regenerated from app/sitemap.ts",
  );

  console.log(`Sitemap check passed: ${entries.length} URLs`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
