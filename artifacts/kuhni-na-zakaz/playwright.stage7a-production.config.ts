import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "general-rollout-stage7a-production.spec.ts",
  outputDir: "../../artifacts/general-rollout/stage-7a/playwright-production-smoke-results",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../artifacts/general-rollout/stage-7a/playwright-production-smoke.json" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "https://kuhni.minsk.by",
    ...devices["Pixel 5"],
    viewport: { width: 390, height: 844 },
    launchOptions: process.env.PLAYWRIGHT_BASE_URL
      ? undefined
      : { args: ["--host-resolver-rules=MAP kuhni.minsk.by 5.42.108.140"] },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
