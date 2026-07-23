import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3001";
const evidenceRoot = path.resolve("../../artifacts/visual-rescue/stages-16-18");
const routes = [
  { slug: "skandinavskie", path: "/styles/skandinavskie", series: "STYLE-SCANDINAVIAN-2026-07-23" },
  { slug: "klassicheskie", path: "/styles/klassicheskie", series: "STYLE-CLASSIC-2026-07-23" },
  { slug: "minimalizm", path: "/styles/minimalizm", series: "STYLE-MINIMAL-2026-07-23" },
];

await fs.mkdir(path.join(evidenceRoot, "screenshots"), { recursive: true });
await fs.mkdir(path.join(evidenceRoot, "videos"), { recursive: true });
for (const file of await fs.readdir(path.join(evidenceRoot, "videos"))) {
  if (file.startsWith("page@") && file.endsWith(".webm")) {
    await fs.rm(path.join(evidenceRoot, "videos", file));
  }
}

const browser = await chromium.launch();
const report = { generatedAt: new Date().toISOString(), baseURL, routes: [], widths: [360, 390, 412, 768, 1440] };

for (const route of routes) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    recordVideo: { dir: path.join(evidenceRoot, "videos"), size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  const mediaResponses = [];
  page.on("response", (response) => {
    if (response.url().includes(`/media/visual-rescue/${route.slug}/`)) {
      mediaResponses.push({ url: response.url(), status: response.status() });
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

  const response = await page.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });
  const explorer = page.locator(`[data-series-id="${route.series}"]`);
  const image = explorer.locator("img");
  const tabs = explorer.getByRole("tab");
  const initialHeight = await image.evaluate((node) => node.getBoundingClientRect().height);
  const states = [];
  await page.evaluate(() => { window.__visualRescueCls = 0; });

  for (let index = 0; index < 6; index += 1) {
    if (index > 0) await tabs.nth(index).click();
    await image.evaluate((node) => node.decode());
    const selected = tabs.nth(index);
    const imageBox = await image.boundingBox();
    states.push({
      index,
      label: (await selected.innerText()).replace(", выбрано", "").trim(),
      src: await image.getAttribute("src"),
      naturalWidth: await image.evaluate((node) => node.naturalWidth),
      frameHeight: imageBox?.height,
      frameHeightStable: imageBox ? Math.abs(imageBox.height - initialHeight) < 0.5 : false,
      visualVisibleAfterSelection: Boolean(imageBox && imageBox.y < 844 && imageBox.y + imageBox.height > 0),
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
  await page.mouse.wheel(0, -350);
  const dockReturnsUp = await page.getByTestId("mobile-bottom-nav").evaluate((node) => !node.classList.contains("mobile-page-dock--hidden"));

  report.routes.push({
    ...route,
    status: response?.status(),
    h1Count: await page.locator("h1").count(),
    canonical: await page.locator('link[rel="canonical"]').getAttribute("href"),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
    cls: await page.evaluate(() => window.__visualRescueCls ?? 0),
    initialMediaRequests: mediaResponses.slice(0, 1),
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
    await page.goto(`${baseURL}${route.path}`, { waitUntil: "networkidle" });
    await page.locator(`[data-series-id="${route.series}"]`).getByRole("tab").nth(4).click();
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
