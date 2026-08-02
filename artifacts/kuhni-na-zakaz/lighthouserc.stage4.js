const baseUrl = process.env.LHCI_BASE_URL ?? "http://127.0.0.1:3011";
const reportLabel = process.env.LHCI_REPORT_LABEL ?? "local-before";
const routeFilter = process.env.LHCI_ROUTE;
const routes = [
  "/catalog/uglovye-kuhni",
  "/styles/minimalizm",
  "/scenarios/dlya-malenkoy-kuhni",
  "/materials/furnitura",
];

module.exports = {
  ci: {
    collect: {
      url: routes
        .filter((route) => !routeFilter || route === routeFilter)
        .map((route) => new URL(route, baseUrl).toString()),
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage --disable-gpu",
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
      outputDir: `../../artifacts/general-rollout/stage-4-lcp-final/${reportLabel}`,
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
