import fs from "node:fs/promises";
import path from "node:path";
import { chromium, request } from "@playwright/test";

const appRoot = path.resolve(import.meta.dirname, "..");
const workspaceRoot = path.resolve(appRoot, "..", "..");
const evidenceRoot = path.join(workspaceRoot, "artifacts", "visual-rescue", "stages-13-15");
const manifest = JSON.parse(
  await fs.readFile(path.join(workspaceRoot, "content", "media", "visual-rescue-stages-13-15-2026-07-23.json"), "utf8"),
);
const origin = "https://kuhni.minsk.by";
const targets = manifest.series.map((series, index) => ({
  route: series.route,
  seriesId: series.seriesId,
  slug: `stage-${13 + index}`,
}));
const protectedRoutes = ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const targetResults = [];

for (const target of targets) {
  const response = await page.goto(`${origin}${target.route}`, { waitUntil: "networkidle" });
  const explorer = page.locator(`[data-series-id="${target.seriesId}"]`);
  const image = explorer.locator("img");
  const initialSrc = await image.evaluate((element) => element.currentSrc);
  await explorer.locator("button").last().click();
  await page.waitForFunction(
    ({ selector, source }) => {
      const image = document.querySelector(selector);
      return image?.currentSrc && image.currentSrc !== source && image.complete && image.naturalWidth > 0;
    },
    { selector: `[data-series-id="${target.seriesId}"] img`, source: initialSrc },
  );

  targetResults.push({
    route: target.route,
    status: response?.status() ?? 0,
    canonical: await page.locator('link[rel="canonical"]').getAttribute("href"),
    h1Count: await page.locator("h1").count(),
    frameCount: await explorer.locator("button").count(),
    currentSrc: await image.evaluate((element) => element.currentSrc),
    naturalWidth: await image.evaluate((element) => element.naturalWidth),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    brokenImages: await page.locator("img").evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).length),
    missingAlt: await page.locator("img").evaluateAll((images) => images.filter((image) => !image.hasAttribute("alt")).length),
  });
  await page.screenshot({ path: path.join(evidenceRoot, `${target.slug}-390-production-result.png`), fullPage: false });
}

const protectedResults = [];
for (const route of protectedRoutes) {
  const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  protectedResults.push({
    route,
    status: response?.status() ?? 0,
    h1Count: await page.locator("h1").count(),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    brokenImages: await page.locator("img").evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).length),
    missingAlt: await page.locator("img").evaluateAll((images) => images.filter((image) => !image.hasAttribute("alt")).length),
  });
}
await browser.close();

const requestContext = await request.newContext();
const deliveryUrls = manifest.series.flatMap((series) => [
  ...series.assets.flatMap((asset) => [
    `${origin}${series.deliveryRoot}/${asset.mediaId}.webp`,
    `${origin}${series.deliveryRoot}/${asset.mediaId}.avif`,
  ]),
  `${origin}${series.contactSheet}`,
]);
const deliveryResults = [];
for (const url of deliveryUrls) {
  const response = await requestContext.get(url);
  deliveryResults.push({ url, status: response.status(), bytes: (await response.body()).length });
}
await requestContext.dispose();

const report = {
  commit: "4486482",
  checkedAt: new Date().toISOString(),
  targetResults,
  protectedResults,
  deliveryResults,
  pass:
    targetResults.every((item) =>
      item.status === 200 &&
      item.canonical?.endsWith(item.route) &&
      item.h1Count === 1 &&
      item.frameCount === 6 &&
      item.naturalWidth === 1200 &&
      item.overflow <= 1 &&
      item.brokenImages === 0 &&
      item.missingAlt === 0
    ) &&
    protectedResults.every((item) =>
      item.status === 200 &&
      item.h1Count === 1 &&
      item.overflow <= 1 &&
      item.brokenImages === 0 &&
      item.missingAlt === 0
    ) &&
    deliveryResults.every((item) => item.status === 200 && item.bytes > 0),
};

await fs.writeFile(path.join(evidenceRoot, "production-smoke.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
if (!report.pass) process.exitCode = 1;
