import { expect, test } from "@playwright/test";

// Контракт публичных соцкнопок (FloatingSocialButtons):
// - На обычных страницах кнопки видны, если в SiteSettings есть валидные
//   ссылки. В тестовом окружении resolveContactInfo возвращает дефолтный
//   instagram (https://www.instagram.com/inside_home1983/), поэтому хотя бы
//   Instagram-кнопка должна быть отрисована — что и проверяем.
// - На /admin страницах кнопок быть не должно: app/layout.tsx отключает их
//   через флаг isAdmin (path.startsWith("/admin")).
// - На мобильном viewport кнопки после скролла переезжают в шапку и не должны
//   физически перекрывать нижнюю мобильную навигацию.

test.describe("FloatingSocialButtons (public)", () => {
  test("visible on public homepage when contact links are configured", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const fab = page.getByTestId("floating-social-buttons");
    await expect(fab).toBeVisible();

    const toggle = page.getByTestId("floating-contact-toggle");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

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

  test("moves into the header and does not overlap mobile bottom nav", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.mouse.wheel(0, 900);

    const mobileNav = page.getByTestId("mobile-bottom-nav");
    const fab = page.getByTestId("floating-social-buttons");

    await expect(mobileNav).toBeVisible();
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute("data-position", "header");
    await page.waitForTimeout(750);

    const navBox = await mobileNav.boundingBox();
    const fabBox = await fab.boundingBox();
    const borderSizing = await page.evaluate(() => {
      const toggle = document.querySelector<HTMLElement>('[data-testid="floating-contact-toggle"]');
      const canvas = document.querySelector<HTMLElement>(".electric-contact-canvas");
      const toggleBox = toggle?.getBoundingClientRect();
      const canvasBox = canvas?.getBoundingClientRect();

      return {
        extraWidth: toggleBox && canvasBox ? canvasBox.width - toggleBox.width : null,
        extraHeight: toggleBox && canvasBox ? canvasBox.height - toggleBox.height : null,
      };
    });

    expect(navBox, "Mobile bottom nav bounding box").not.toBeNull();
    expect(fabBox, "FloatingSocialButtons bounding box").not.toBeNull();
    expect(borderSizing.extraWidth, "Compact electric border horizontal overflow").not.toBeNull();
    expect(borderSizing.extraHeight, "Compact electric border vertical overflow").not.toBeNull();

    if (navBox && fabBox) {
      const fabBottom = fabBox.y + fabBox.height;
      expect(
        fabBottom,
        `FAB bottom=${fabBottom} must be <= mobile nav top=${navBox.y}`,
      ).toBeLessThanOrEqual(navBox.y);

      const fabCenterX = fabBox.x + fabBox.width / 2;
      expect(Math.abs(fabCenterX - 195)).toBeLessThanOrEqual(24);
    }

    if (borderSizing.extraWidth !== null && borderSizing.extraHeight !== null) {
      expect(borderSizing.extraWidth).toBeLessThanOrEqual(32);
      expect(borderSizing.extraHeight).toBeLessThanOrEqual(32);
    }
  });
});
