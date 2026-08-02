import { defineConfig, devices } from "@playwright/test";

const port = 3011;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 960 },
      },
    },
    {
      name: "mobile",
      use: devices["Pixel 5"],
    },
  ],
  webServer: {
    command: "pnpm start",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: String(port),
      HOST: "127.0.0.1",
    },
  },
});
