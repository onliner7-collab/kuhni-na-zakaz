import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/locations", "/locations/vitebsk", "/portfolio", "/portfolio/kuhnya-japandi-zelenye-fasady-minsk",
  "/blog", "/blog/kak-vybrat-kuhnyu", "/about", "/calculator", "/prices", "/contacts", "/reviews",
  "/delivery-installation", "/warranty",
] as const;

test("production: sitemap содержит 112 целостных canonical URL", async ({ request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  const urls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  expect(urls).toHaveLength(112);
  const sitemapPaths = new Set(urls.map((url) => new URL(url).pathname));
  const linksByPath = new Map<string, Set<string>>();
  const incoming = new Map(Array.from(sitemapPaths, (path) => [path, 0]));

  for (const url of urls) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    const html = await response.text();
    expect(html, `${url}: lang`).toMatch(/<html[^>]+lang="ru"/i);
    expect(html, `${url}: h1`).toMatch(/<h1[\s>]/i);
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
    expect(canonical, `${url}: canonical`).toBeTruthy();
    expect(new URL(canonical || "", url).pathname, `${url}: canonical path`).toBe(new URL(url).pathname.replace(/\/$/, "") || "/");
    for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      expect(() => JSON.parse(match[1]), `${url}: JSON-LD`).not.toThrow();
    }
    const sourcePath = new URL(url).pathname;
    const targets = new Set<string>();
    for (const match of html.matchAll(/<a[^>]+href="([^"]+)"/gi)) {
      const target = new URL(match[1].replaceAll("&amp;", "&"), url);
      if (target.origin === "https://kuhni.minsk.by" && sitemapPaths.has(target.pathname)) targets.add(target.pathname);
    }
    linksByPath.set(sourcePath, targets);
    for (const target of targets) incoming.set(target, (incoming.get(target) || 0) + 1);
  }

  expect(Array.from(incoming).filter(([path, count]) => path !== "/" && count === 0), "сиротские страницы").toEqual([]);
  const depths = new Map([["/", 0]]);
  const queue = ["/"];
  while (queue.length) {
    const source = queue.shift()!;
    for (const target of linksByPath.get(source) || []) {
      if (!depths.has(target)) {
        depths.set(target, (depths.get(source) || 0) + 1);
        queue.push(target);
      }
    }
  }
  expect(depths.size, "все sitemap URL достижимы с главной").toBe(112);
  expect(Math.max(...depths.values()), "максимальная глубина клика").toBeLessThanOrEqual(4);
});

test("production: 13 семейств этапа 8 адаптивны и доступны", async ({ page }) => {
  for (const route of representativeRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45_000 });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), route).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), route).toBe(false);
    expect(await page.locator("img:not([alt])").count(), route).toBe(0);
    await expect(page.locator('[data-component="RelatedExplorationRail"] a[href]'), route).toHaveCount(3);
  }
});

test("production: utility routes сохраняют redirect, noindex и 404 contracts", async ({ request }) => {
  const redirect = await request.get("/kitchen-configurator", { maxRedirects: 0 });
  expect([301, 302, 307, 308]).toContain(redirect.status());
  expect(new URL(redirect.headers().location || "", "https://kuhni.minsk.by").pathname).toBe("/design-proekt-kuhni");

  const preview = await request.get("/component-library-preview");
  expect(preview.status()).toBe(404);

  for (const route of ["/personal-data", "/privacy-policy", "/terms", "/thanks"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect((await response.text()).toLowerCase(), route).toContain("noindex");
  }
});

test("production: robots и sitemap доступны", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap: https://kuhni.minsk.by/sitemap.xml");
});
