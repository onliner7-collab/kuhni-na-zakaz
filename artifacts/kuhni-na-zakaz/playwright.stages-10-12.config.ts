import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual-rescue",
  outputDir: "../../artifacts/visual-rescue/stages-10-12/playwright-results",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "../../artifacts/visual-rescue/stages-10-12/playwright-report.json" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    video: "on",
    screenshot: "only-on-failure",
  },
});
