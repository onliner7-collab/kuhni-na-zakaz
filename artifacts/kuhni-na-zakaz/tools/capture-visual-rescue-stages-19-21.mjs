import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3011";
const chromePath = process.env.PLAYWRIGHT_CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const evidenceRoot = path.resolve("../../artifacts/visual-rescue/stages-19-21");
const routes = [
  { slug: "s-ostrovom", path: "/scenarios/s-ostrovom", series: "SCENARIO-ISLAND-2026-07-23" },
  { slug: "do-potolka", path: "/scenarios/do-potolka", series: "SCENARIO-CEILING-2026-07-23" },
  { slug: "dlya-semi", path: "/scenarios/dlya-semi", series: "SCENARIO-FAMILY-2026-07-23" },
];

await fs.mkdir(path.join(evidenceRoot, "screenshots"), { recursive: true });
await fs.mkdir(path.join(evidenceRoot, "videos"), { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath });
const report = { generatedAt: new Date().toISOString(), baseURL, routes: [], widths: [360, 390, 412, 768, 1440] };

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    recordVideo: { dir: path.join(evidenceRoot, "videos"), size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  const mediaResponses = [];
  let hasInteracted = false;
  page.on("response", (response) => {
    if (response.url().includes(`/media/visual-rescue/${route.slug}/`)) {
      mediaResponses.push({ url: response.url(), status: response.status(), beforeInteraction: !hasInteracted });
    }
  });
  await page.addInitScript(() => {
    window.__visualRescueCls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__visualRescueCls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  const response = await page.goto(`${baseURL}${route.path}`, { waitUntil: "domcontentloaded" });
  const explorer = page.locator(`[data-series-id="${route.series}"]`);
  const image = explorer.locator("img");
  const tabs = explorer.getByRole("tab");
  await image.waitFor({ state: "visible" });
  await image.evaluate((node) => node.decode());
  const initialHeight = await image.evaluate((node) => node.getBoundingClientRect().height);
  const states = [];
  await page.evaluate(() => { window.__visualRescueCls = 0; });
  hasInteracted = true;

  for (let index = 0; index < 5; index += 1) {
    await tabs.nth(index).click();
    await image.evaluate((node) => node.decode());
    const imageBox = await image.boundingBox();
    states.push({
      index,
      label: (await tabs.nth(index).innerText()).replace(", выбрано", "").trim(),
      src: await image.getAttribute("src"),
      naturalWidth: await image.evaluate((node) => node.naturalWidth),
      frameHeight: imageBox?.height,
      frameHeightStable: imageBox ? Math.abs(imageBox.height - initialHeight) < 0.5 : false,
      visiblePixelsAfterSelection: imageBox ? Math.max(0, Math.min(844, imageBox.y + imageBox.height) - Math.max(0, imageBox.y)) : 0,
      scrollY: await page.evaluate(() => window.scrollY),
      panelVisible: await explorer.getByRole("tabpanel").isVisible(),
    });
    await page.screenshot({
      path: path.join(evidenceRoot, "screenshots", `${route.slug}-390-state-${index}.png`),
      fullPage: false,
    });
  }

  await page.mouse.wheel(0, 700);
  const dockHiddenDown = await page.getByTestId("mobile-bottom-nav").evaluate((node) => node.classList.contains("mobile-page-dock--hidden"));
  await tabs.nth(2).click();
  const dockHiddenDuringSelection = await page.getByTestId("mobile-bottom-nav").evaluate((node) => node.classList.contains("mobile-page-dock--hidden"));
  await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
  await page.waitForFunction(() => window.scrollY >= 100);
  await page.mouse.wheel(0, -220);
  await page.waitForFunction(() => !document.querySelector('[data-testid="mobile-bottom-nav"]')?.classList.contains("mobile-page-dock--hidden"));
  const dockReturnsUp = await page.getByTestId("mobile-bottom-nav").evaluate((node) => !node.classList.contains("mobile-page-dock--hidden"));

  report.routes.push({
    ...route,
    status: response?.status(),
    h1Count: await page.locator("h1").count(),
    canonical: await page.locator('link[rel="canonical"]').getAttribute("href"),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
    cls: await page.evaluate(() => window.__visualRescueCls ?? 0),
    initialMediaRequests: mediaResponses.filter((item) => item.beforeInteraction),
    mediaResponses,
    reducedMotionAnimation: await image.evaluate((node) => getComputedStyle(node).animationName),
    dockHiddenDown,
    dockHiddenDuringSelection,
    dockReturnsUp,
    states,
  });

  const video = page.video();
  await context.close();
  if (video) {
    const sourceVideo = await video.path();
    const targetVideo = path.join(evidenceRoot, "videos", `${route.slug}-journey.webm`);
    await fs.rm(targetVideo, { force: true });
    await fs.rename(sourceVideo, targetVideo);
  }
}

for (const width of report.widths) {
  const context = await browser.newContext({ viewport: { width, height: width <= 412 ? 844 : 1024 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${baseURL}${route.path}`, { waitUntil: "domcontentloaded" });
    const explorer = page.locator(`[data-series-id="${route.series}"]`);
    await explorer.locator("img").waitFor({ state: "visible" });
    await explorer.getByRole("tab").last().click();
    await explorer.locator("img").evaluate((node) => node.decode());
    await page.screenshot({
      path: path.join(evidenceRoot, "screenshots", `${route.slug}-${width}-selected.png`),
      fullPage: false,
    });
  }
  await context.close();
}

await browser.close();
await fs.writeFile(path.join(evidenceRoot, "local-evidence.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
