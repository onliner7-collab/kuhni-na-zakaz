import path from "node:path";
import { defineConfig } from "@playwright/test";

const evidenceRoot = path.resolve(
  process.cwd(),
  "..",
  "..",
  "artifacts",
  "final-acceptance",
);

process.env.FINAL_ACCEPTANCE_EVIDENCE_ROOT = evidenceRoot;

export default defineConfig({
  testDir: "./tests/visual-rescue",
  testMatch: "stage-25.spec.ts",
  outputDir: path.join(evidenceRoot, "playwright-results"),
  timeout: 600_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: path.join(evidenceRoot, "playwright-report.json") }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3011",
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROME_PATH ??
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
