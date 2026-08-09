import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3041";
const serverUrl = new URL(baseURL);
const usesExternalServer = !["127.0.0.1", "localhost"].includes(serverUrl.hostname);

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "global-dock-visibility.spec.ts",
  outputDir: "../../artifacts/global-dock-fix/playwright-results",
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../artifacts/global-dock-fix/playwright-report.json" }],
  ],
  webServer: usesExternalServer
    ? undefined
    : {
        command: "pnpm run start",
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer: false,
        env: { PORT: serverUrl.port || "3041", HOST: serverUrl.hostname },
      },
  use: {
    baseURL,
    ...devices["Pixel 5"],
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
