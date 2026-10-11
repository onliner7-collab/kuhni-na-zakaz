import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke", testMatch: "catalog-showcase.spec.ts", workers: 1,
  timeout: 90000, reporter: "list",
  outputDir: process.env.CATALOG_TEST_OUTPUT ?? "test-results/catalog",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3026", screenshot: "only-on-failure", trace: "retain-on-failure" },
});
