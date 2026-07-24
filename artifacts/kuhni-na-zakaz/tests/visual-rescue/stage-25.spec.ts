import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

type Target = {
  route: string;
  slug: string;
  explorer: string;
  actionRole: "button" | "tab";
  firstAction: string;
};

const targets: Target[] = [
  { route: "/catalog/uglovye-kuhni", slug: "uglovye-kuhni", explorer: '[aria-labelledby="angular-quick-choice-title"]', actionRole: "tab", firstAction: "Рабочая зона" },
  { route: "/locations/borisov", slug: "borisov", explorer: "#process", actionRole: "button", firstAction: "Замер" },
  { route: "/materials/mdf-fasady", slug: "mdf-fasady", explorer: '[data-interaction-role="material-surface-compare"]', actionRole: "button", firstAction: "Дневной свет" },
  { route: "/catalog/pryamye-kuhni", slug: "pryamye-kuhni", explorer: '[data-interaction-role="line-layout-check"]', actionRole: "button", firstAction: "Компактная" },
  { route: "/catalog/p-obraznye-kuhni", slug: "p-obraznye-kuhni", explorer: '[data-interaction-role="clearance-comparison"]', actionRole: "button", firstAction: "Открыта техника" },
  { route: "/catalog/kuhni-s-ostrovom", slug: "kuhni-s-ostrovom", explorer: '[data-interaction-role="island-clearance-planner"]', actionRole: "button", firstAction: "Подготовка" },
  { route: "/catalog/malenkie-kuhni", slug: "malenkie-kuhni", explorer: '[data-interaction-role="small-space-trade-off-explorer"]', actionRole: "button", firstAction: "Столешница" },
  { route: "/catalog/kuhni-do-potolka", slug: "kuhni-do-potolka", explorer: '[data-interaction-role="vertical-storage-explorer"]', actionRole: "button", firstAction: "Ежедневная зона" },
  { route: "/catalog/kuhni-bez-ruchek", slug: "kuhni-bez-ruchek", explorer: '[data-interaction-role="opening-mechanism-comparison"]', actionRole: "button", firstAction: "Профиль" },
  { route: "/styles/neoklassika", slug: "neoklassika", explorer: '[data-series-id="STYLE-NEOCLASSIC-2026-07-23"]', actionRole: "tab", firstAction: "Тонкая рамка" },
  { route: "/styles/hay-tek", slug: "hay-tek", explorer: '[data-series-id="STYLE-HIGHTECH-2026-07-23"]', actionRole: "tab", firstAction: "Техника" },
  { route: "/styles/provans", slug: "provans", explorer: '[data-series-id="STYLE-PROVENCE-2026-07-23"]', actionRole: "tab", firstAction: "Витринный акцент" },
  { route: "/styles/loft", slug: "loft", explorer: '[data-series-id="STYLE-LOFT-2026-07-23"]', actionRole: "tab", firstAction: "Металл" },
  { route: "/styles/sovremennye", slug: "sovremennye", explorer: '[data-series-id="STYLE-MODERN-2026-07-23"]', actionRole: "tab", firstAction: "Главная плоскость" },
  { route: "/styles/skandinavskie", slug: "skandinavskie", explorer: '[data-series-id="STYLE-SCANDINAVIAN-2026-07-23"]', actionRole: "tab", firstAction: "Больше дерева" },
  { route: "/styles/klassicheskie", slug: "klassicheskie", explorer: '[data-series-id="STYLE-CLASSIC-2026-07-23"]', actionRole: "tab", firstAction: "Глубже рамка" },
  { route: "/styles/minimalizm", slug: "minimalizm", explorer: '[data-series-id="STYLE-MINIMAL-2026-07-23"]', actionRole: "tab", firstAction: "Открыть хранение" },
  { route: "/scenarios/s-ostrovom", slug: "scenario-s-ostrovom", explorer: '[data-series-id="SCENARIO-ISLAND-2026-07-23"]', actionRole: "tab", firstAction: "Подготовка" },
  { route: "/scenarios/do-potolka", slug: "scenario-do-potolka", explorer: '[data-series-id="SCENARIO-CEILING-2026-07-23"]', actionRole: "tab", firstAction: "Каждый день" },
  { route: "/scenarios/dlya-semi", slug: "scenario-dlya-semi", explorer: '[data-series-id="SCENARIO-FAMILY-2026-07-23"]', actionRole: "tab", firstAction: "Хранение" },
  { route: "/scenarios/dlya-studii", slug: "scenario-dlya-studii", explorer: '[data-series-id="SCENARIO-STUDIO-2026-07-24"]', actionRole: "tab", firstAction: "Лёгкая граница" },
  { route: "/scenarios/dlya-malenkoy-kuhni", slug: "scenario-dlya-malenkoy-kuhni", explorer: '[data-series-id="SCENARIO-SMALL-KITCHEN-2026-07-24"]', actionRole: "tab", firstAction: "Рабочая зона" },
  { route: "/scenarios/byudzhetnaya-kuhnya", slug: "scenario-byudzhetnaya-kuhnya", explorer: '[data-series-id="SCENARIO-BUDGET-2026-07-24"]', actionRole: "tab", firstAction: "Рабочая зона" },
];

const protectedRoutes = ["/", "/design-proekt-kuhni", "/locations/minskaya-oblast", "/locations/minsk", "/materials/furnitura"];
const evidenceRoot = process.env.FINAL_ACCEPTANCE_EVIDENCE_ROOT
  ? path.resolve(process.env.FINAL_ACCEPTANCE_EVIDENCE_ROOT)
  : path.resolve(process.cwd(), "..", "..", "artifacts", "visual-rescue", "stage-25");
const screenshotRoot = path.join(evidenceRoot, "screenshots");

test.beforeAll(() => {
  fs.mkdirSync(screenshotRoot, { recursive: true });
});

test("23 routes keep a meaningful visible visual change", async ({ page }) => {
  const evidence: Array<Record<string, unknown>> = [];
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const target of targets) {
    const response = await page.goto(target.route, { waitUntil: "networkidle" });
    expect(response?.status(), target.route).toBe(200);
    await expect(page.locator("h1"), target.route).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]'), target.route).toHaveAttribute("href", new RegExp(`${target.route.replaceAll("/", "\\/")}$`));
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), target.route).toBe(false);
    expect(await page.locator("main img").evaluateAll((images: HTMLImageElement[]) =>
      images.filter((image) => image.complete && image.naturalWidth === 0).length
    ), target.route).toBe(0);

    const explorer = page.locator(target.explorer);
    await expect(explorer, target.route).toBeVisible();
    const image = explorer.locator("img");
    await expect(image, target.route).toBeVisible();
    await explorer.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshotRoot, `${target.slug}-initial.png`) });
    const before = await image.evaluate((node: HTMLImageElement) => node.currentSrc);

    const action = explorer.getByRole(target.actionRole, { name: target.firstAction });
    await expect(action, target.route).toHaveCount(1);
    await action.click();
    await image.evaluate((node: HTMLImageElement) => node.decode());
    const after = await image.evaluate((node: HTMLImageElement) => node.currentSrc);
    expect(after, target.route).not.toBe(before);
    const box = await image.boundingBox();
    expect(box?.height ?? 0, target.route).toBeGreaterThan(0);
    expect(Math.max(0, Math.min(844, (box?.y ?? 0) + (box?.height ?? 0)) - Math.max(0, box?.y ?? 0)), target.route).toBeGreaterThan(120);
    await page.screenshot({ path: path.join(screenshotRoot, `${target.slug}-after-first.png`) });

    if (target.actionRole === "tab") {
      const tabs = explorer.getByRole("tab");
      expect(await tabs.count(), target.route).toBeGreaterThan(1);
      expect(await tabs.evaluateAll((nodes) => nodes.some((node) => node.hasAttribute("aria-pressed"))), target.route).toBe(false);
      await expect(action, target.route).toHaveAttribute("aria-selected", "true");
      await expect(action, target.route).toHaveAttribute("aria-controls", /.+/);
      expect(await tabs.evaluateAll((nodes) => nodes.filter((node) => (node as HTMLElement).tabIndex === 0).length), target.route).toBe(1);

      await action.press("ArrowRight");
      const selectedAfterArrow = explorer.locator('[role="tab"][aria-selected="true"]');
      await expect(selectedAfterArrow, target.route).toBeFocused();
      const focusStyle = await selectedAfterArrow.evaluate((node) => {
        const style = getComputedStyle(node);
        return { outline: style.outlineStyle, shadow: style.boxShadow };
      });
      expect(focusStyle.outline !== "none" || focusStyle.shadow !== "none", target.route).toBe(true);

      await selectedAfterArrow.press("Home");
      await expect(tabs.first(), target.route).toBeFocused();
      await expect(tabs.first(), target.route).toHaveAttribute("aria-selected", "true");
      await tabs.first().press("End");
      await expect(tabs.last(), target.route).toBeFocused();
      await expect(tabs.last(), target.route).toHaveAttribute("aria-selected", "true");
    }

    await expect(page.getByTestId("mobile-bottom-nav"), target.route).toHaveClass(/mobile-page-dock--hidden/);

    const entries = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => {
      const resource = entry as PerformanceResourceTiming;
      return { name: resource.name, initiatorType: resource.initiatorType, transferSize: resource.transferSize };
    }));
    evidence.push({
      route: target.route,
      status: response?.status(),
      before,
      after,
      initialScripts: entries.filter((entry) => entry.initiatorType === "script").length,
      initialScriptTransfer: entries.filter((entry) => entry.initiatorType === "script").reduce((sum, entry) => sum + entry.transferSize, 0),
      mediaRequests: entries.filter((entry) => entry.initiatorType === "img").length,
      overflow: false,
      naturalWidth: await image.evaluate((node: HTMLImageElement) => node.naturalWidth),
    });
  }

  fs.writeFileSync(path.join(evidenceRoot, "route-evidence.json"), JSON.stringify(evidence, null, 2), "utf8");
});

test("responsive and protected regression matrix", async ({ page }) => {
  for (const width of [360, 390, 412, 768, 1440]) {
    await page.setViewportSize({ width, height: width <= 412 ? 844 : 1024 });
    for (const target of targets) {
      const response = await page.goto(target.route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${target.route} @ ${width}`).toBe(200);
      await expect(page.locator("h1"), `${target.route} @ ${width}`).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]'), `${target.route} @ ${width}`).toHaveAttribute(
        "href",
        new RegExp(`${target.route.replaceAll("/", "\\/")}$`),
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), `${target.route} @ ${width}`).toBe(false);
      expect(
        await page.locator("main img").evaluateAll((images: HTMLImageElement[]) =>
          images.filter((image) => !image.hasAttribute("alt")).length
        ),
        `${target.route} @ ${width}`,
      ).toBe(0);
      expect(
        await page.locator("main img").evaluateAll((images: HTMLImageElement[]) =>
          images.filter((image) => image.complete && image.naturalWidth === 0).length
        ),
        `${target.route} @ ${width}`,
      ).toBe(0);

      if (target.route.startsWith("/styles/") || target.route.startsWith("/scenarios/")) {
        expect(
          await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
            scripts.some((script) => {
              try {
                return JSON.parse(script.textContent || "{}")["@type"] === "BreadcrumbList";
              } catch {
                return false;
              }
            })
          ),
          `${target.route} @ ${width}`,
        ).toBe(true);
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of protectedRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), route).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), route).toBe(false);
    expect(
      await page.locator("main img").evaluateAll((images: HTMLImageElement[]) =>
        images.filter((image) => image.complete && image.naturalWidth === 0).length
      ),
      route,
    ).toBe(0);
  }
});
