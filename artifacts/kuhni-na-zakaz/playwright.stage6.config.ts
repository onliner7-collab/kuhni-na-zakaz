import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3030";
const serverUrl = new URL(baseURL);
const usesExternalServer = !["127.0.0.1", "localhost"].includes(serverUrl.hostname);
const reportLabel = process.env.PLAYWRIGHT_REPORT_LABEL ?? "playwright-report";

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "general-rollout-stage6.spec.ts",
  outputDir:
    reportLabel === "playwright-report"
      ? "../../artifacts/general-rollout/stage-6/playwright-results"
      : `../../artifacts/general-rollout/stage-6/${reportLabel}-results`,
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: `../../artifacts/general-rollout/stage-6/${reportLabel}.json` }],
  ],
  webServer: usesExternalServer
    ? undefined
    : {
        command: "pnpm run start",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: false,
        env: { PORT: serverUrl.port || "3030", HOST: serverUrl.hostname },
      },
  use: {
    baseURL,
    ...devices["Pixel 5"],
    launchOptions: usesExternalServer
      ? { args: ["--host-resolver-rules=MAP kuhni.minsk.by 5.42.108.140"] }
      : undefined,
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
