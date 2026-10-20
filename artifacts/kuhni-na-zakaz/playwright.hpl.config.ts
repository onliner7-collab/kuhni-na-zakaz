import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:"./tests/smoke",
  testMatch:"hpl-page.spec.ts",
  timeout:180_000,
  expect:{timeout:15_000},
  workers:1,
  reporter:[["list"],["json",{outputFile:"../../docs/seo/materials-comparison/stage-5/browser-results.json"}]],
  outputDir:"../../docs/seo/materials-comparison/stage-5/browser-artifacts",
  use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||"http://127.0.0.1:3315",viewport:{width:1440,height:960},screenshot:"only-on-failure",trace:"retain-on-failure"},
});
