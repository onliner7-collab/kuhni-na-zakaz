import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3040";
const serverUrl = new URL(baseURL);
const usesExternalServer = !["127.0.0.1", "localhost"].includes(serverUrl.hostname);
const reportLabel = process.env.PLAYWRIGHT_REPORT_LABEL ?? "playwright-local";

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "location-visual-l1a.spec.ts",
  outputDir: `../../artifacts/location-visual-corrective/l1a/${reportLabel}-results`,
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: `../../artifacts/location-visual-corrective/l1a/${reportLabel}.json` }],
  ],
  webServer: usesExternalServer
    ? undefined
    : {
        command: "pnpm run start",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: false,
        env: { PORT: serverUrl.port || "3040", HOST: serverUrl.hostname },
      },
  use: {
    baseURL,
    ...devices["Pixel 5"],
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "on",
    video: "on",
  },
});
