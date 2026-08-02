const baseUrl = process.env.LHCI_BASE_URL ?? "http://127.0.0.1:3030";
const routeFilter = process.env.LHCI_ROUTE;
const routes = [
  "/",
  "/design-proekt-kuhni",
  "/locations/minsk",
  "/locations/minskaya-oblast",
  "/materials/furnitura",
];

module.exports = {
  ci: {
    collect: {
      url: routes
        .filter((route) => !routeFilter || route === routeFilter)
        .map((route) => new URL(route, baseUrl).toString()),
      numberOfRuns: 1,
      settings: {
        chromeFlags:
          "--no-sandbox --disable-dev-shm-usage --disable-gpu --host-resolver-rules=MAP kuhni.minsk.by 5.42.108.140",
        formFactor: "mobile",
        throttlingMethod: "simulate",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "../../artifacts/general-rollout/stage-6/lighthouse-production",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
