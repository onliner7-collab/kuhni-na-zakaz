import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/seo-ownership",
  timeout: 60_000,
  workers: 2,
  reporter: "list",
  outputDir: "test-results/seo-ownership",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3396",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 960 } } },
  ],
});
