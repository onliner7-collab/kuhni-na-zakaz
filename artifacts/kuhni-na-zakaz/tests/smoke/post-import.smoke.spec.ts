import { expect, test } from "@playwright/test";

async function expectNoHardFailure(page: import("@playwright/test").Page) {
  await expect(page.locator("main")).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toContain("Application error");
  expect(bodyText).not.toContain("Unhandled Runtime Error");
  expect(bodyText).not.toContain("PrismaClientInitializationError");
}

test.describe("bulk import v1 post-import smoke", () => {
  test("homepage renders critical sections and FAQ", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBeTruthy();
    await expectNoHardFailure(page);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByTestId("hero-cta-order")).toBeVisible();
    expect(await page.locator("[data-testid^='faq-item-']").count()).toBeGreaterThan(0);
    await expect(page.locator("a[href^='/catalog/']").first()).toBeVisible();
    await expect(page.locator("a[href^='/portfolio/']").first()).toBeVisible();
    expect(await page.locator("section").count()).toBeGreaterThanOrEqual(8);
  });

  test("catalog index and kitchen detail are populated", async ({ page }) => {
    const catalogResponse = await page.goto("/catalog", { waitUntil: "domcontentloaded" });
    expect(catalogResponse?.ok()).toBeTruthy();
    await expectNoHardFailure(page);

    await expect(page.locator("h1")).toBeVisible();
    const catalogCards = page.locator("a[href^='/catalog/']");
    await expect(catalogCards.first()).toBeVisible();
    expect(await catalogCards.count()).toBeGreaterThan(0);

    const detailResponse = await page.goto("/catalog/uglovye-kuhni", { waitUntil: "domcontentloaded" });
    expect(detailResponse?.ok()).toBeTruthy();
    await expectNoHardFailure(page);

    await expect(page.locator("h1")).toBeVisible();
    expect(await page.locator("h2").count()).toBeGreaterThanOrEqual(1);
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator("li")).not.toHaveCount(0);
  });

  test("portfolio index stays non-empty", async ({ page }) => {
    const response = await page.goto("/portfolio", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBeTruthy();
    await expectNoHardFailure(page);

    await expect(page.locator("h1")).toBeVisible();
    const cards = page.locator("a[href^='/portfolio/']");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("materials index stays non-empty", async ({ page }) => {
    const response = await page.goto("/materials", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBeTruthy();
    await expectNoHardFailure(page);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("table")).toBeVisible();
    const tableRows = page.locator("tbody tr");
    expect(await tableRows.count()).toBeGreaterThan(0);
    await expect(page.locator("a[href^='/materials/']").first()).toBeVisible();
  });

  test("location page renders local content without empty critical blocks", async ({ page }) => {
    const response = await page.goto("/locations/brest", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBeTruthy();
    await expectNoHardFailure(page);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
    expect(await page.locator("section").count()).toBeGreaterThanOrEqual(3);
    const mainText = (await page.locator("main").innerText()).replace(/\s+/g, " ").trim();
    expect(mainText.length).toBeGreaterThan(400);
  });
});
