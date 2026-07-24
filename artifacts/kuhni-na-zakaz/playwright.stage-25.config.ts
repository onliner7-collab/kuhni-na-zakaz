import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual-rescue",
  testMatch: "stage-25.spec.ts",
  outputDir: "../../artifacts/visual-rescue/stage-25/playwright-results",
  timeout: 600_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../artifacts/visual-rescue/stage-25/playwright-report.json" }],
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
