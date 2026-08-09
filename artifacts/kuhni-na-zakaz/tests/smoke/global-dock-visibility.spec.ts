import { expect, test, type Locator, type Page } from "@playwright/test";

const MOBILE_VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
] as const;

const PUBLIC_ROUTES = [
  "/",
  "/catalog",
  "/catalog/uglovye-kuhni",
  "/prices",
  "/calculator",
  "/portfolio",
  "/styles",
  "/materials",
  "/materials/furnitura",
  "/scenarios",
  "/locations",
  "/locations/minsk",
  "/locations/minskaya-oblast",
  "/locations/borisov",
  "/design-proekt-kuhni",
  "/contacts",
  "/blog/kak-vybrat-kuhnyu",
  "/privacy-policy",
] as const;

const SCREENSHOT_ROUTES = [
  { route: "/", name: "home" },
  { route: "/catalog", name: "catalog" },
  { route: "/prices", name: "prices" },
  { route: "/portfolio", name: "portfolio" },
  { route: "/locations/borisov", name: "borisov" },
  { route: "/materials/furnitura", name: "furnitura" },
] as const;

function getDock(page: Page) {
  return page.getByTestId("mobile-bottom-nav");
}

async function expectDockVisible(page: Page, dock: Locator = getDock(page)) {
  await expect(dock).toBeVisible();
  await expect(dock).not.toHaveClass(/mobile-page-dock--hidden/);
  await expect
    .poll(() =>
      dock.evaluate((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return Number(style.opacity) === 1 && rect.bottom <= window.innerHeight;
      }),
    )
    .toBe(true);

  const geometry = await dock.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      display: style.display,
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      transform: style.transform,
      visibility: style.visibility,
      rect: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left },
      viewport: { width: window.innerWidth, height: window.innerHeight },
    };
  });

  expect(geometry.display).not.toBe("none");
  expect(geometry.opacity).toBe("1");
  expect(geometry.pointerEvents).not.toBe("none");
  expect(geometry.visibility).not.toBe("hidden");
  expect(geometry.transform).not.toMatch(/matrix\([^)]*,\s*[1-9]\d*(?:\.\d+)?\)$/);
  expect(geometry.rect.left).toBeGreaterThanOrEqual(0);
  expect(geometry.rect.right).toBeLessThanOrEqual(geometry.viewport.width);
  expect(geometry.rect.top).toBeGreaterThanOrEqual(0);
  expect(geometry.rect.bottom).toBeLessThanOrEqual(geometry.viewport.height);

  await expect(dock.locator("a, button")).toHaveCount(4);
  await expect(dock.locator(".mobile-page-dock__label")).toHaveText([
    "Выбрать",
    "Цены",
    "Наши работы",
    "Оставить заявку",
  ]);

  const labelWidths = await dock.locator(".mobile-page-dock__label").evaluateAll((labels) =>
    labels.map((label) => ({ text: label.textContent, scrollWidth: label.scrollWidth, clientWidth: label.clientWidth })),
  );
  for (const label of labelWidths) {
    expect(label.scrollWidth, label.text ?? "подпись Dock").toBeLessThanOrEqual(label.clientWidth);
  }

  const targetSizes = await dock.locator("a, button").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  );
  expect(targetSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
}

test("Dock присутствует уже в серверном HTML", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain('data-testid="mobile-bottom-nav"');
});

for (const viewport of MOBILE_VIEWPORTS) {
  test(`Dock виден без scroll при ширине ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectDockVisible(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
}

test("Dock использует порог скрытия и возвращается при прокрутке вверх", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const dock = getDock(page);
  await expectDockVisible(page, dock);

  await page.evaluate(() => window.scrollTo(0, 24));
  await expectDockVisible(page, dock);

  await page.evaluate(() => window.scrollTo(0, 240));
  await expect(dock).toHaveClass(/mobile-page-dock--hidden/);

  await page.evaluate(() => window.scrollTo(0, 120));
  await expectDockVisible(page, dock);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expectDockVisible(page, dock);
});

test("active state сохраняется при client navigation и browser back", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await getDock(page).getByRole("link", { name: "Выбрать" }).click();
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(getDock(page).getByRole("link", { name: "Выбрать" })).toHaveAttribute("aria-current", "page");

  await getDock(page).getByRole("link", { name: "Цены" }).click();
  await expect(page).toHaveURL(/\/prices$/);
  await expect(getDock(page).getByRole("link", { name: "Цены" })).toHaveAttribute("aria-current", "page");

  await getDock(page).getByRole("link", { name: "Наши работы" }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(getDock(page).getByRole("link", { name: "Наши работы" })).toHaveAttribute("aria-current", "page");

  await page.goBack({ waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/prices$/);
  await expectDockVisible(page);
  await expect(getDock(page).getByRole("link", { name: "Цены" })).toHaveAttribute("aria-current", "page");
});

test("кнопка заявки работает сразу и возвращает focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const trigger = page.getByTestId("dock-lead");
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Оставить заявку" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expectDockVisible(page);
});

test("публичная route matrix сохраняет initial Dock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of PUBLIC_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expectDockVisible(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true);
  }
});

test("Dock не появляется на desktop и служебной странице", async ({ page }) => {
  for (const width of [768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(getDock(page)).toBeHidden();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/admin/login", "/thanks", "/component-library-preview"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(getDock(page)).toHaveCount(0);
  }

  for (const route of ["/robots.txt", "/sitemap.xml", "/kapi/leads"]) {
    const response = await page.request.get(route);
    expect(await response.text(), route).not.toContain('data-testid="mobile-bottom-nav"');
  }
});

test("hydration не создаёт ошибок или layout shift", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.addInitScript(() => {
    (window as typeof window & { __dockCls?: number }).__dockCls = 0;
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) {
          (window as typeof window & { __dockCls?: number }).__dockCls =
            ((window as typeof window & { __dockCls?: number }).__dockCls ?? 0) + shift.value;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expectDockVisible(page);
  await page.dispatchEvent("body", "pointerdown");
  await expect(page.getByTestId("floating-social-buttons")).toBeVisible();

  const cls = await page.evaluate(() => (window as typeof window & { __dockCls?: number }).__dockCls ?? 0);
  expect(cls).toBe(0);
  expect(consoleErrors.filter((message) => /hydration|mobile-page-dock/i.test(message))).toEqual([]);
});

test("плавающая связь и Dock не перекрываются", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.dispatchEvent("body", "pointerdown");
  const floating = page.getByTestId("floating-social-buttons");
  await expect(floating).toBeVisible();
  await expectDockVisible(page);

  const overlaps = await page.evaluate(() => {
    const dock = document.querySelector<HTMLElement>('[data-testid="mobile-bottom-nav"]')?.getBoundingClientRect();
    const contact = document.querySelector<HTMLElement>('[data-testid="floating-social-buttons"]')?.getBoundingClientRect();
    if (!dock || !contact) return true;
    return dock.left < contact.right && dock.right > contact.left && dock.top < contact.bottom && dock.bottom > contact.top;
  });
  expect(overlaps).toBe(false);
});

test("создаёт visual evidence initial/down/up на 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const target of SCREENSHOT_ROUTES) {
    await page.goto(target.route, { waitUntil: "domcontentloaded" });
    await expectDockVisible(page);
    await page.screenshot({ path: `../../artifacts/global-dock-fix/screenshots/${target.name}-initial.png`, fullPage: false });

    await page.evaluate(() => window.scrollTo(0, 240));
    await expect(getDock(page)).toHaveClass(/mobile-page-dock--hidden/);
    await page.screenshot({ path: `../../artifacts/global-dock-fix/screenshots/${target.name}-scroll-down.png`, fullPage: false });

    await page.evaluate(() => window.scrollTo(0, 100));
    await expectDockVisible(page);
    await page.screenshot({ path: `../../artifacts/global-dock-fix/screenshots/${target.name}-scroll-up.png`, fullPage: false });
  }
});
