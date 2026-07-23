import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const appRoot = path.resolve(import.meta.dirname, "..");
const evidenceRoot = path.resolve(appRoot, "..", "..", "artifacts", "visual-rescue", "stages-13-15");
const targets = [
  { route: "/styles/provans", seriesId: "STYLE-PROVENCE-2026-07-23" },
  { route: "/styles/loft", seriesId: "STYLE-LOFT-2026-07-23" },
  { route: "/styles/sovremennye", seriesId: "STYLE-MODERN-2026-07-23" },
];

const browser = await chromium.launch();
const report = [];

for (const target of targets) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const initialImages = [];

  page.on("response", (response) => {
    if (response.request().resourceType() === "image") {
      initialImages.push({
        url: response.url(),
        status: response.status(),
        transferSize: Number(response.headers()["content-length"] || 0),
      });
    }
  });

  await page.goto(`http://127.0.0.1:3100${target.route}`, { waitUntil: "networkidle" });
  const explorer = page.locator(`[data-series-id="${target.seriesId}"]`);
  const image = explorer.locator("img");
  const firstAction = explorer.locator("button").nth(1);
  const dock = page.getByTestId("mobile-bottom-nav");

  const metrics = await page.evaluate(({ seriesId }) => {
    const explorerElement = document.querySelector(`[data-series-id="${seriesId}"]`);
    const imageElement = explorerElement?.querySelector("img");
    const firstButton = explorerElement?.querySelector("button");
    const h1 = document.querySelector("h1");
    const heroSection = h1?.closest("section");
    const promise = heroSection?.querySelector("h1 + p");
    const scripts = performance.getEntriesByType("resource")
      .filter((entry) => entry.name.includes("/_next/static/") && entry.name.endsWith(".js"));
    return {
      heroHeight: imageElement?.getBoundingClientRect().height ?? 0,
      firstActionTop: firstButton?.getBoundingClientRect().top ?? 0,
      seriesImageCount: explorerElement?.querySelectorAll("img").length ?? 0,
      currentSrc: imageElement?.currentSrc ?? "",
      naturalWidth: imageElement?.naturalWidth ?? 0,
      h1: h1?.textContent?.trim() ?? "",
      promise: promise?.textContent?.trim() ?? "",
      clientJsTransferBytes: scripts.reduce((sum, entry) => sum + (entry.transferSize || entry.encodedBodySize || 0), 0),
    };
  }, { seriesId: target.seriesId });

  await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press("Tab");
    if (await firstAction.evaluate((element) => document.activeElement === element)) break;
  }
  const focusIndicator = await firstAction.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outline: `${style.outlineStyle} ${style.outlineWidth}`,
      boxShadow: style.boxShadow,
    };
  });
  const animationName = await image.evaluate((element) => getComputedStyle(element).animationName);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const dockOverlap = await page.evaluate(() => {
    const dockElement = document.querySelector('[data-testid="mobile-bottom-nav"]');
    const finalCta = document.querySelector('a[href="/calculator"]');
    if (!dockElement || !finalCta) return null;
    const dockRect = dockElement.getBoundingClientRect();
    const ctaRect = finalCta.getBoundingClientRect();
    return Math.max(0, Math.min(dockRect.bottom, ctaRect.bottom) - Math.max(dockRect.top, ctaRect.top));
  });

  report.push({
    ...target,
    ...metrics,
    initialMediaRequests: initialImages,
    initialSeriesMediaRequests: initialImages.filter((item) => item.url.includes(`/media/visual-rescue/${target.route.split("/").at(-1)}/`)),
    focusIndicator,
    reducedMotionAnimationName: animationName,
    dockOverlap,
    viewport: { width: 390, height: 844 },
  });

  await context.close();
}

await browser.close();
await fs.mkdir(evidenceRoot, { recursive: true });
await fs.writeFile(
  path.join(evidenceRoot, "performance-evidence.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(report, null, 2));
