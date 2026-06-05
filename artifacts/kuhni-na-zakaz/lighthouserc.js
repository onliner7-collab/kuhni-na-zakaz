const port = Number(process.env.PORT ?? 3001);
const baseUrl = process.env.LHCI_BASE_URL ?? `http://127.0.0.1:${port}`;

const paths = [
  "/",
  "/catalog/uglovye-kuhni",
  "/catalog/pryamye-kuhni",
  "/materials/mdf-fasady",
  "/materials/ldsp",
  "/locations/minsk",
  "/locations/gomel",
  "/blog/kuhnya-do-potolka-plyusy-minusy-cena",
  "/portfolio/kuhnya-s-ostrovom-minimalizm-005",
  "/portfolio/uglovaya-kuhnya-sovremennaya-001",
];

module.exports = {
  ci: {
    collect: {
      url: paths.map((path) => new URL(path, baseUrl).toString()),
      startServerCommand: "pnpm dev",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 120000,
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage --disable-gpu",
        preset: "desktop",
      },
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
        "categories:accessibility": ["warn", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.85 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 5000 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.25 }],
        "total-blocking-time": ["warn", { maxNumericValue: 900 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
