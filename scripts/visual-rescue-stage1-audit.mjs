import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.AUDIT_BASE_URL || "https://kuhni.minsk.by";
const outputRoot = path.resolve("artifacts/visual-rescue/stage-1");
const routes = [
  "/catalog/uglovye-kuhni",
  "/locations/borisov",
  "/materials/mdf-fasady",
  "/catalog/pryamye-kuhni",
  "/catalog/p-obraznye-kuhni",
  "/catalog/kuhni-s-ostrovom",
  "/catalog/malenkie-kuhni",
  "/catalog/kuhni-do-potolka",
  "/catalog/kuhni-bez-ruchek",
  "/styles/neoklassika",
  "/styles/hay-tek",
  "/styles/provans",
  "/styles/loft",
  "/styles/sovremennye",
  "/styles/skandinavskie",
  "/styles/klassicheskie",
  "/styles/minimalizm",
  "/scenarios/s-ostrovom",
  "/scenarios/do-potolka",
  "/scenarios/dlya-semi",
  "/scenarios/dlya-studii",
  "/scenarios/dlya-malenkoy-kuhni",
  "/scenarios/byudzhetnaya-kuhnya",
];

const slugFor = (route) => route.slice(1).replaceAll("/", "--");
await fs.mkdir(path.join(outputRoot, "screenshots"), { recursive: true });
await fs.mkdir(path.join(outputRoot, "videos"), { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of routes) {
  const slug = slugFor(route);
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    recordVideo: { dir: path.join(outputRoot, "videos"), size: { width: 390, height: 844 } },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const mediaRequests = [];
  page.on("response", (response) => {
    const type = response.request().resourceType();
    if (type === "image") mediaRequests.push({ url: response.url(), status: response.status() });
  });

  let error = null;
  let metrics = null;
  try {
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
    await page.screenshot({ path: path.join(outputRoot, "screenshots", `${slug}--initial.png`) });
    metrics = await page.evaluate(() => {
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
      };
      const main = document.querySelector("main") || document.body;
      const controls = [...main.querySelectorAll("button[aria-pressed], [role=tab], button[data-state], button")]
        .filter(visible)
        .filter((el) => !el.closest("form") && !el.closest("header") && !el.closest("nav"));
      const first = controls.find((el) => el.getAttribute("aria-pressed") === "false") || controls[0] || null;
      const images = [...main.querySelectorAll("img")].filter(visible).map((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        y: Math.round(img.getBoundingClientRect().top + scrollY),
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
      const sections = [...main.querySelectorAll("section")].filter(visible);
      const textOnlySections = sections.filter((section) => !section.querySelector("img, picture, video, canvas, svg") && (section.innerText || "").trim().length > 180).length;
      return {
        status: document.readyState,
        h1Count: main.querySelectorAll("h1").length,
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        title: document.title,
        imageCount: images.length,
        images,
        uniqueImageSources: [...new Set(images.map((item) => item.src))],
        firstImageY: images[0]?.y ?? null,
        firstActionY: first ? Math.round(first.getBoundingClientRect().top + scrollY) : null,
        firstActionText: first ? (first.getAttribute("aria-label") || first.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120) : null,
        firstActionSelector: first ? (first.getAttribute("data-testid") ? `[data-testid="${first.getAttribute("data-testid")}"]` : first.getAttribute("aria-label") ? `button[aria-label="${CSS.escape(first.getAttribute("aria-label"))}"]` : null) : null,
        textOnlySections,
        bodyScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        visibleCopyBeforeAction: first ? (main.innerText || "").slice(0, Math.max(0, (main.innerText || "").indexOf(first.textContent || ""))).trim().replace(/\s+/g, " ").slice(0, 500) : null,
      };
    });

    const beforeSources = metrics.uniqueImageSources;
    let actionPerformed = false;
    const candidates = page.locator('main button[aria-pressed="false"]:visible');
    const candidateCount = await candidates.count();
    if (candidateCount > 0) {
      await candidates.nth(0).click();
      actionPerformed = true;
    } else {
      const next = page.getByRole("button", { name: "Следующий этап" });
      if (await next.count() === 1) {
        await next.click();
        actionPerformed = true;
      }
    }
    await page.screenshot({ path: path.join(outputRoot, "screenshots", `${slug}--after-first-action.png`) });

    let secondActionPerformed = false;
    const remaining = page.locator('main button[aria-pressed="false"]:visible');
    const remainingCount = await remaining.count();
    if (remainingCount > 1) {
      await remaining.nth(1).click();
      secondActionPerformed = true;
    } else {
      const next = page.getByRole("button", { name: "Следующий этап" });
      if (await next.count() === 1) {
        await next.click();
        secondActionPerformed = true;
      }
    }
    await page.screenshot({ path: path.join(outputRoot, "screenshots", `${slug}--visual-result.png`) });
    const afterSources = await page.locator("main img").evaluateAll((imgs) => [...new Set(imgs.map((img) => img.currentSrc || img.src))]);
    const changedSources = afterSources.filter((src) => !beforeSources.includes(src));

    results.push({
      route,
      httpStatus: response?.status() ?? null,
      ...metrics,
      actionPerformed,
      secondActionPerformed,
      changedSources,
      initialMediaRequests: [...new Map(mediaRequests.map((item) => [item.url, item])).values()],
      screenshotInitial: `screenshots/${slug}--initial.png`,
      screenshotAfterFirstAction: `screenshots/${slug}--after-first-action.png`,
      screenshotVisualResult: `screenshots/${slug}--visual-result.png`,
    });
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    results.push({ route, error, ...(metrics || {}), initialMediaRequests: mediaRequests });
  }

  const video = page.video();
  await page.close();
  if (video) {
    const currentVideoPath = await video.path();
    await context.close();
    await fs.rename(currentVideoPath, path.join(outputRoot, "videos", `${slug}.webm`));
  } else {
    await context.close();
  }
  process.stdout.write(`${route}: ${error ? "ERROR" : "OK"}\n`);
}

await browser.close();

const sourceUsage = new Map();
for (const result of results) {
  for (const src of result.uniqueImageSources || []) {
    const key = new URL(src).pathname;
    const routesForSource = sourceUsage.get(key) || [];
    routesForSource.push(result.route);
    sourceUsage.set(key, routesForSource);
  }
}
for (const result of results) {
  const uniqueSources = result.uniqueImageSources || [];
  result.genericReuse = uniqueSources.filter((src) => (sourceUsage.get(new URL(src).pathname) || []).length > 1);
  result.routeSpecificMasters = uniqueSources.length - result.genericReuse.length;
  const changes = result.changedSources?.length || 0;
  result.meaningfulVisualChangesObserved = changes;
  result.auditStatus = result.error
    ? "BLOCKED_MEDIA"
    : result.routeSpecificMasters >= 4 && changes >= 1 && (result.firstActionY ?? Infinity) <= 1688 && result.textOnlySections <= 1
      ? "KEEP_VISUAL"
      : result.routeSpecificMasters < 4
        ? "VISUAL_BACKFILL"
        : "REDESIGN_VISUAL_FLOW";
}

await fs.writeFile(path.join(outputRoot, "audit.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, viewport: "390x844", results }, null, 2)}\n`, "utf8");
