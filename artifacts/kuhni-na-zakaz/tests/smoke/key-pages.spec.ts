import { expect, test, type Page } from "@playwright/test";

const keyPages = [
  "/",
  "/catalog/uglovye-kuhni",
  "/catalog/pryamye-kuhni",
  "/materials/mdf-fasady",
  "/materials/ldsp",
  "/locations/minsk",
  "/locations/minskaya-oblast",
  "/locations/berezino",
  "/locations/volozhin",
  "/locations/stolbtsy",
  "/locations/uzda",
  "/locations/cherven",
  "/locations/maryina-gorka",
  "/locations/kletsk",
  "/locations/kopyl",
  "/locations/krupki",
  "/locations/lyuban",
  "/locations/myadel",
  "/locations/starye-dorogi",
  "/locations/molodechno",
  "/locations/gomel",
  "/locations/grodno",
  "/locations/mogilev",
  "/blog/kuhnya-do-potolka-plyusy-minusy-cena",
  "/portfolio/kuhnya-s-ostrovom-minimalizm-005",
  "/portfolio/uglovaya-kuhnya-sovremennaya-001",
  "/portfolio/seraya-uglovaya-kuhnya-novostrojka-minsk",
] as const;

const forbiddenPublicPhrases = [
  "не подтверждены",
  "требуют ручной проверки",
  "фейков",
  "Other styles",
  "Other materials",
] as const;

function collectPageProblems(page: Page) {
  const problems: string[] = [];

  page.on("pageerror", (error) => {
    problems.push(`pageerror: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(`console error: ${message.text()}`);
    }
  });

  return problems;
}

async function expectPublicPageHealthy(page: Page, path: string) {
  const problems = collectPageProblems(page);
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });

  expect(response, `${path} should return a response`).toBeTruthy();
  expect(response?.status(), `${path} should not return 404/500`).toBeLessThan(400);

  await expect(page.locator("h1").first(), `${path} should have h1`).toBeVisible();
  await expect(page).toHaveTitle(/.+/);

  const bodyText = await page.locator("body").innerText();
  expect(bodyText, `${path} should not show app errors`).not.toMatch(
    /Application error|Unhandled Runtime Error|PrismaClientInitializationError/,
  );

  for (const phrase of forbiddenPublicPhrases) {
    expect(bodyText, `${path} should not expose "${phrase}"`).not.toContain(phrase);
  }

  const imagesWithoutAlt = await page.locator("img").evaluateAll((images) =>
    images
      .map((image) => image as HTMLImageElement)
      .filter((image) => image.currentSrc || image.getAttribute("src"))
      .map((image) => ({
        src: image.currentSrc || image.getAttribute("src") || "",
        alt: image.getAttribute("alt") || "",
      }))
      .filter((image) => !image.alt.trim()),
  );

  expect(imagesWithoutAlt, `${path} should have alt text for rendered images`).toEqual([]);
  expect(problems, `${path} should not emit obvious browser errors`).toEqual([]);
}

test.describe("key public pages smoke", () => {
  for (const path of keyPages) {
    test(`${path} opens with title, h1, image alt text and no service phrases`, async ({ page }) => {
      await expectPublicPageHealthy(page, path);
    });
  }

  test("sitemap.xml and robots.txt return 200", async ({ request }) => {
    for (const path of ["/sitemap.xml", "/robots.txt"]) {
      const response = await request.get(path, { failOnStatusCode: false });
      expect(response.status(), `${path} should return 200`).toBe(200);
      expect(await response.text(), `${path} should not be empty`).not.toHaveLength(0);
    }
  });

  test("home and Minsk region page use the same current header", async ({ page }) => {
    const paths = ["/", "/locations/minskaya-oblast"] as const;
    const expectedHeaderText = [
      "\u041a\u0430\u0442\u0430\u043b\u043e\u0433",
      "\u0421\u0442\u0438\u043b\u0438",
      "\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b",
      "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e",
      "3D-\u043f\u0440\u043e\u0435\u043a\u0442",
      "\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440",
      "\u0426\u0435\u043d\u044b",
      "\u0411\u043b\u043e\u0433",
      "+375 (29) 372-06-74",
    ] as const;

    for (const path of paths) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const headerText = await page.locator("header").innerText();
      for (const expected of expectedHeaderText) {
        expect(headerText, `${path} header should include ${expected}`).toContain(expected);
      }
      expect(headerText, `${path} header should not show old phone`).not.toContain("+375 (29) 626-15-47");
      expect(headerText, `${path} header should not show old configurator link`).not.toContain(
        "\u041a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043e\u0440",
      );
    }
  });

  test("location pages disclose 3D images and do not show cross-city project cards", async ({ page }) => {
    for (const path of ["/locations/minsk", "/locations/molodechno", "/locations/gomel", "/locations/grodno", "/locations/mogilev"]) {
      await expectPublicPageHealthy(page, path);

      const bodyText = await page.locator("body").innerText();
      expect(bodyText, `${path} should label design examples as 3D`).toContain("3D-визуализация");

      if (bodyText.includes("Пока нет подтверждённых проектов из этого города")) {
        const portfolioSection = page.getByRole("heading", { name: /Проекты/ }).locator("..");
        await expect(portfolioSection.locator("a[href^='/portfolio/']")).toHaveCount(0);
      }
    }
  });
});
