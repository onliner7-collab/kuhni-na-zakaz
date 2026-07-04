import { expect, test, type Page } from "@playwright/test";

async function gotoDesignProjectPage(page: Page) {
  const response = await page.goto("/design-proekt-kuhni", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.ok()).toBeTruthy();
}

test.describe("design project page", () => {
  test("opens with the expected core content", async ({ page }) => {
    await gotoDesignProjectPage(page);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "3D-проект кухни на заказ",
      }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("link", {
          name: /Создать проект|Получить проект кухни|Получить 3D-проект|Оставить заявку на проект|Отправить заявку на проект|Закажите 3D-проект/i,
        })
        .first(),
    ).toBeVisible();
    await expect(page.getByText("FAQ", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Примеры кухонь, которые можно спроектировать",
      }),
    ).toBeVisible();
    await expect(
      page.locator("#idea-builder").getByRole("img", { name: "Угловая кухня в 3D-проекте" }).first(),
    ).toBeVisible();
    await expect(page.locator("#visual-gallery").getByRole("link", { name: /Смотреть похожие/ })).toHaveCount(10);
    await expect(page.locator("#design-hero-stage").getByRole("link", { name: "До/после" })).toBeVisible();
    await expect(page.locator("#before-after")).toContainText("До и после проектирования");
    await expect(page.locator("#before-after").getByRole("img", { name: /До проектирования/ })).toBeVisible();
    await expect(page.locator("#before-after").getByRole("img", { name: /После проектирования/ })).toBeVisible();
  });

  test("redirects old configurator URL to design project page", async ({
    page,
  }) => {
    await page.goto("/kitchen-configurator", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/design-proekt-kuhni\/?$/);
  });

  test("does not create horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoDesignProjectPage(page);

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

    expect(hasHorizontalScroll).toBe(false);
  });

  test("has alt text for all rendered content images", async ({ page }) => {
    await gotoDesignProjectPage(page);

    const imagesWithoutAlt = await page.locator("img").evaluateAll((images) =>
      images
        .map((image) => image as HTMLImageElement)
        .filter((image) => image.currentSrc || image.getAttribute("src"))
        .map((image) => ({
          alt: image.getAttribute("alt"),
          src: image.currentSrc || image.getAttribute("src"),
        }))
        .filter((image) => !image.alt?.trim()),
    );

    expect(imagesWithoutAlt).toEqual([]);
  });

  test("does not expose internal 404 links", async ({ page, request }) => {
    await gotoDesignProjectPage(page);

    const internalPaths = await page.locator("a[href]").evaluateAll((links) => {
      const origin = window.location.origin;
      const paths = links
        .map((link) => link.getAttribute("href"))
        .filter((href): href is string => Boolean(href))
        .filter((href) => !href.startsWith("#"))
        .filter((href) => !href.startsWith("tel:"))
        .filter((href) => !href.startsWith("mailto:"))
        .map((href) => new URL(href, origin))
        .filter((url) => url.origin === origin)
        .map((url) => `${url.pathname}${url.search}`);

      return Array.from(new Set(paths));
    });

    const brokenLinks: string[] = [];

    for (const path of internalPaths) {
      const response = await request.get(path, { maxRedirects: 5 });

      if (response.status() === 404) {
        brokenLinks.push(path);
      }
    }

    expect(brokenLinks).toEqual([]);
  });

  test("keeps stage 21-23 SEO links, metadata, and schema visible", async ({ page }) => {
    await gotoDesignProjectPage(page);

    const requiredLinks = [
      "/catalog/uglovye-kuhni",
      "/catalog/pryamye-kuhni",
      "/catalog/malenkie-kuhni",
      "/catalog/p-obraznye-kuhni",
      "/catalog/kuhni-s-ostrovom",
      "/catalog/kuhni-do-potolka",
      "/catalog/kuhni-bez-ruchek",
      "/portfolio?style=neoklassika",
      "/catalog",
      "/portfolio",
      "/materials",
      "/materials/furnitura",
      "/prices",
      "/contacts",
    ];

    for (const href of requiredLinks) {
      await expect(page.locator(`#seo-content a[href="${href}"]`)).toBeVisible();
    }

    await expect(page).toHaveTitle("3D-проект кухни на заказ в Минске — дизайн, планировка и визуализация");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Разработаем 3D-проект кухни по вашим размерам: планировка, материалы, техника, системы хранения и предварительный расчёт стоимости. Работаем в Минске и по Беларуси.",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /3d-proekt-kuhni-hero\.webp/);

    const schemaTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
      nodes
        .flatMap((node) => {
          const parsed = JSON.parse(node.textContent || "[]");
          return Array.isArray(parsed) ? parsed : [parsed];
        })
        .map((item) => item?.["@type"]),
    );

    expect(schemaTypes).toEqual(expect.arrayContaining([
      "BreadcrumbList",
      "WebPage",
      "Service",
      "LocalBusiness",
      "ImageObject",
      "FAQPage",
    ]));
  });
});
