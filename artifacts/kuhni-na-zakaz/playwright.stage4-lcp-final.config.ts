import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3011";
const serverUrl = new URL(baseURL);

export default defineConfig({
  testDir: "./tests/visual-rescue",
  testMatch: "stage-25.spec.ts",
  outputDir: "../../artifacts/general-rollout/stage-4-lcp-final/playwright-results",
  timeout: 600_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../artifacts/general-rollout/stage-4-lcp-final/playwright-report.json" }],
  ],
  webServer: {
    command: "pnpm run start",
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: true,
    env: {
      PORT: serverUrl.port || "3011",
      HOST: serverUrl.hostname,
    },
  },
  use: {
    baseURL,
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROME_PATH ??
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    trace: "retain-on-failure",
    video: "off",
    screenshot: "only-on-failure",
  },
});
