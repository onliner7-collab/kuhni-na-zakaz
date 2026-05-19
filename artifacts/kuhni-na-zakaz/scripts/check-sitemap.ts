import assert from "node:assert/strict";
import sitemap from "../app/sitemap";
import robots from "../app/robots";

const BASE_URL = "https://kuhni.minsk.by";

const requiredPaths = [
  "/",
  "/catalog",
  "/styles",
  "/materials",
  "/locations",
  "/blog",
  "/portfolio",
  "/calculator",
  "/prices",
  "/about",
  "/contacts",
  "/design-proekt-kuhni",
  "/privacy-policy",
  "/personal-data",
  "/terms",
] as const;

const forbiddenPathPrefixes = [
  "/admin",
  "/api",
  "/kapi",
  "/search",
  "/thanks",
  "/configurator",
  "/kitchen-configurator",
] as const;

async function main() {
  const entries = await sitemap();
  const urls = entries.map((entry) => String(entry.url));
  const uniqueUrls = new Set(urls);

  assert.equal(urls.length, uniqueUrls.size, "sitemap must not contain duplicate URLs");

  for (const path of requiredPaths) {
    assert.ok(uniqueUrls.has(`${BASE_URL}${path === "/" ? "/" : path}`), `missing required URL: ${path}`);
  }

  for (const entry of entries) {
    const url = String(entry.url);
    const parsed = new URL(url);

    assert.equal(parsed.protocol, "https:", `URL must use https: ${url}`);
    assert.equal(parsed.hostname, "kuhni.minsk.by", `URL must use non-www host: ${url}`);
    assert.equal(parsed.search, "", `URL must not contain query string: ${url}`);
    assert.equal(parsed.hash, "", `URL must not contain hash: ${url}`);
    assert.ok(entry.lastModified, `URL must include lastModified: ${url}`);
    assert.ok(entry.changeFrequency, `URL must include changeFrequency: ${url}`);
    assert.equal(typeof entry.priority, "number", `URL must include numeric priority: ${url}`);
    assert.ok(
      !forbiddenPathPrefixes.some((prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`)),
      `sitemap must not include private or redirected URL: ${url}`,
    );
  }

  const robotsConfig = robots();
  assert.equal(robotsConfig.sitemap, `${BASE_URL}/sitemap.xml`, "robots.txt must point to the canonical sitemap");

  console.log(`Sitemap check passed: ${entries.length} URLs`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
