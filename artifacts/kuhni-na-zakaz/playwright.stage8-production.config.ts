import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "general-rollout-stage8-production.spec.ts",
  outputDir: "../../artifacts/general-rollout/stage-8/playwright-production-results",
  timeout: 360_000,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "../../artifacts/general-rollout/stage-8/playwright-production-smoke.json" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "https://kuhni.minsk.by",
    ...devices["Pixel 5"],
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
