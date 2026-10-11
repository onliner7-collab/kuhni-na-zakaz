import { createRequire } from "node:module";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
const require = createRequire(resolve("artifacts/kuhni-na-zakaz/package.json"));
const { chromium } = require("@playwright/test");
const phase = process.argv[2] ?? "after";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const records = [];
for (const path of ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura", "/locations/borisov", "/prices"]) {
  const response = await page.goto(`https://kuhni.minsk.by${path}`, { waitUntil: "domcontentloaded" });
  records.push({ path, status: response.status(), ...await page.evaluate(() => ({ title: document.title, h1: [...document.querySelectorAll("h1")].map((x) => x.textContent), canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"), description: document.querySelector('meta[name="description"]')?.getAttribute("content") })) });
}
writeFileSync(`outputs/catalog-implementation-2026-10-11/${phase}-protected.json`, JSON.stringify(records, null, 2));
if (phase === "after") {
  const before = JSON.parse(readFileSync("outputs/catalog-implementation-2026-10-11/before-protected.json", "utf8"));
  if (JSON.stringify(before) !== JSON.stringify(records)) throw new Error("Protected metadata changed");
  await page.goto("https://kuhni.minsk.by/catalog", { waitUntil: "networkidle" });
  const links = await page.locator('.catalog-page a[href^="/"]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.getAttribute("href").split("#")[0]))]);
  const linkResults = [];
  for (const href of links) {
    const response = await page.request.get(`https://kuhni.minsk.by${href}`);
    linkResults.push({ href, status: response.status() });
    if (response.status() !== 200) throw new Error(`Broken link ${href}: ${response.status()}`);
  }
  writeFileSync("outputs/catalog-implementation-2026-10-11/links.json", JSON.stringify(linkResults, null, 2));
  const sitemap = await page.request.get("https://kuhni.minsk.by/sitemap.xml");
  const xml = await sitemap.text();
  const catalog = xml.match(/<url>\s*<loc>https:\/\/kuhni\.minsk\.by\/catalog<\/loc>[\s\S]*?<\/url>/)?.[0];
  if (!catalog?.includes("2026-10-11")) throw Error("Catalog sitemap date missing");
  writeFileSync("outputs/catalog-implementation-2026-10-11/sitemap.json", JSON.stringify({ status: sitemap.status(), urls: [...xml.matchAll(/<loc>/g)].length, catalog, robotsStatus: (await page.request.get("https://kuhni.minsk.by/robots.txt")).status() }, null, 2));
  console.log(JSON.stringify({ protected: records.length, links: linkResults.length, sitemapUrls: [...xml.matchAll(/<loc>/g)].length, catalog }));
} else console.log("Captured current production baseline", records.length);
await browser.close();
