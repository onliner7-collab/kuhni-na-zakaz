import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual-rescue",
  testMatch: "stages-22-24.spec.ts",
  outputDir: "../../artifacts/visual-rescue/stages-22-24/playwright-results",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../artifacts/visual-rescue/stages-22-24/playwright-report.json" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3011",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    trace: "retain-on-failure",
    video: "on",
    screenshot: "only-on-failure",
  },
});
