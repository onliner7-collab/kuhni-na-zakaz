import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/smoke", testMatch: "calculator-mobile.spec.ts", workers: 1,
  timeout: 60000, reporter: "list", use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3217", viewport: { width: 390, height: 844 }, screenshot: "only-on-failure", trace: "retain-on-failure" },
});
