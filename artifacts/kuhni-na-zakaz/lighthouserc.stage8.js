const baseUrl = process.env.LHCI_BASE_URL ?? "http://127.0.0.1:3046";
const defaultRoutes = [
  "/locations", "/locations/vitebsk", "/portfolio", "/portfolio/kuhnya-japandi-zelenye-fasady-minsk",
  "/blog", "/blog/kak-vybrat-kuhnyu", "/about", "/calculator", "/prices", "/contacts", "/reviews",
  "/delivery-installation", "/warranty",
];
const routes = process.env.LHCI_ROUTES?.split(",").filter(Boolean) ?? defaultRoutes;

module.exports = {
  ci: {
    collect: {
      url: routes.map((route) => new URL(route, baseUrl).toString()),
      numberOfRuns: 1,
      settings: { chromeFlags: "--no-sandbox --disable-dev-shm-usage --disable-gpu", formFactor: "mobile", throttlingMethod: "simulate" },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
      },
    },
    upload: { target: "filesystem", outputDir: "../../artifacts/general-rollout/stage-8/lighthouse-production", reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%" },
  },
};
