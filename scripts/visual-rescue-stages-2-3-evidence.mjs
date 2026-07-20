import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(pathToFileURL(path.resolve("artifacts/kuhni-na-zakaz/node_modules/@playwright/test/index.mjs")).href);

const baseURL = process.env.EVIDENCE_BASE_URL || "http://127.0.0.1:3001";
const root = path.resolve("artifacts/visual-rescue");
const cases = [
  {
    stage: "stage-2",
    route: "/catalog/uglovye-kuhni",
    first: 'main [role="tab"]',
    firstText: "Рабочая зона",
    resultImage: "#angular-quick-choice-panel img",
  },
  {
    stage: "stage-3",
    route: "/locations/borisov",
    first: "main button",
    firstText: "Предварительный расчёт",
    resultImage: "#process article img",
  },
];

await fs.mkdir(path.join(root, "stage-2", "screenshots"), { recursive: true });
await fs.mkdir(path.join(root, "stage-3", "screenshots"), { recursive: true });
await fs.mkdir(path.join(root, "videos"), { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
for (const item of cases) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    recordVideo: { dir: path.join(root, "videos"), size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  const imageRequests = [];
  page.on("response", (response) => { if (response.request().resourceType() === "image") imageRequests.push({ url: response.url(), status: response.status() }); });
  await page.goto(`${baseURL}${item.route}`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.screenshot({ path: path.join(root, item.stage, "screenshots", "initial-390x844.png") });
  const before = await page.locator(item.resultImage).getAttribute("src");
  const candidate = page.locator(item.first).filter({ hasText: item.firstText });
  const candidateCount = await candidate.count();
  if (candidateCount !== 1) throw new Error(`${item.route}: expected one first action, got ${candidateCount}`);
  await candidate.click();
  await page.screenshot({ path: path.join(root, item.stage, "screenshots", "after-first-action-390x844.png") });
  const after = await page.locator(item.resultImage).getAttribute("src");
  await page.screenshot({ path: path.join(root, item.stage, "screenshots", "visual-result-390x844.png") });
  const metrics = await page.evaluate(() => ({
    h1: document.querySelectorAll("main h1").length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    brokenImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).length,
    firstActionY: Math.round((document.querySelector('main [role="tablist"], main [aria-label="Этапы заказа кухни"]')?.getBoundingClientRect().top || 0)),
    jsResources: performance.getEntriesByType("resource").filter((entry) => entry.name.includes("/_next/") && entry.name.endsWith(".js")).length,
    initialImageRequests: performance.getEntriesByType("resource").filter((entry) => entry.initiatorType === "img").length,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  }));
  results.push({ ...item, before, after, changed: before !== after, candidateCount, imageRequests, metrics });
  const video = page.video();
  await page.close();
  const videoPath = video ? await video.path() : null;
  await context.close();
  if (videoPath) {
    const finalVideoPath = path.join(root, "videos", `${item.stage}.webm`);
    await fs.rm(finalVideoPath, { force: true });
    await fs.rename(videoPath, finalVideoPath);
  }
}
await browser.close();
await fs.writeFile(path.join(root, "stage-2-3-evidence.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify(results, null, 2));
