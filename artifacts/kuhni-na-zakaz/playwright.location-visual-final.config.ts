import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "location-visual-final.spec.ts",
  outputDir: "../../artifacts/location-visual-corrective/final/playwright-production-results",
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../artifacts/location-visual-corrective/final/playwright-production.json" }],
  ],
  use: {
    baseURL: "https://kuhni.minsk.by",
    ...devices["Pixel 5"],
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "on",
    video: "on",
  },
});
