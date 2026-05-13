import { expect, test } from "@playwright/test";

// Контракт публичных соцкнопок (FloatingSocialButtons):
// - На обычных страницах кнопки видны, если в SiteSettings есть валидные
//   ссылки. В тестовом окружении resolveContactInfo возвращает дефолтный
//   instagram (https://www.instagram.com/inside_home1983/), поэтому хотя бы
//   Instagram-кнопка должна быть отрисована — что и проверяем.
// - На /admin страницах кнопок быть не должно: app/layout.tsx отключает их
//   через флаг isAdmin (path.startsWith("/admin")).
// - На мобильном viewport (где появляется MobileCTA после скролла) кнопки
//   не должны физически перекрывать панель MobileCTA.

test.describe("FloatingSocialButtons (public)", () => {
  test("visible on public homepage when contact links are configured", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const fab = page.getByTestId("floating-social-buttons");
    await expect(fab).toBeVisible();

    const instagramLink = page.getByTestId("floating-social-instagram");
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute("target", "_blank");
    await expect(instagramLink).toHaveAttribute(
      "rel",
      /noopener.*noreferrer|noreferrer.*noopener/,
    );
    await expect(instagramLink).toHaveAttribute(
      "href",
      /^https?:\/\/(?:www\.)?instagram\.com\//,
    );
    await expect(instagramLink).toHaveAttribute("aria-label", /Instagram/i);
  });

  test("not rendered on /admin pages", async ({ page }) => {
    await page.goto("/admin/login", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("login-form")).toBeVisible();
    await expect(page.getByTestId("floating-social-buttons")).toHaveCount(0);
  });

  test("does not overlap MobileCTA on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // MobileCTA появляется только после скролла > 300px (см. MobileCTA.tsx).
    await page.evaluate(() => window.scrollTo(0, 800));

    const mobileCTA = page.getByTestId("mobile-cta-bar");
    const fab = page.getByTestId("floating-social-buttons");

    await expect(mobileCTA).toBeVisible();
    await expect(fab).toBeVisible();

    const ctaBox = await mobileCTA.boundingBox();
    const fabBox = await fab.boundingBox();

    expect(ctaBox, "MobileCTA bounding box").not.toBeNull();
    expect(fabBox, "FloatingSocialButtons bounding box").not.toBeNull();

    if (ctaBox && fabBox) {
      const fabBottom = fabBox.y + fabBox.height;
      // Нижняя граница плавающих кнопок должна быть выше верхней границы
      // MobileCTA — иначе кнопки и панель визуально перекрывают друг друга.
      expect(
        fabBottom,
        `FAB bottom=${fabBottom} must be <= MobileCTA top=${ctaBox.y}`,
      ).toBeLessThanOrEqual(ctaBox.y);
    }
  });
});
