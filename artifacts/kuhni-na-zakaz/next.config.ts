import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://mc.yandex.ru https://mc.yandex.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://mc.yandex.ru https://mc.yandex.com wss:",
  "frame-src 'self' https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const finalPageLcpImages: Record<string, string> = {
  "/catalog/uglovye-kuhni":
    "/media/pilots/angular-kitchens/gallery/angular-kitchens-angles-full-room-front-landscape-v1.webp",
  "/locations/borisov":
    "/media/pilots/borisov/webp/borisov-process-request.webp",
  "/materials/mdf-fasady":
    "/media/pilots/mdf-fasady/avif/mdf-surface-closeup.avif",
  "/catalog/pryamye-kuhni":
    "/media/visual-rescue/pryamye-kuhni/avif/line-balanced.avif",
  "/catalog/p-obraznye-kuhni":
    "/media/visual-rescue/p-obraznye-kuhni/avif/u-overview.avif",
  "/catalog/kuhni-s-ostrovom":
    "/media/visual-rescue/kuhni-s-ostrovom/avif/island-overview.avif",
  "/catalog/malenkie-kuhni":
    "/media/visual-rescue/malenkie-kuhni/avif/small-overview.avif",
  "/catalog/kuhni-do-potolka":
    "/media/visual-rescue/kuhni-do-potolka/avif/ceiling-overview.avif",
  "/catalog/kuhni-bez-ruchek":
    "/media/visual-rescue/kuhni-bez-ruchek/handleless-overview.avif",
  "/styles/neoklassika":
    "/media/visual-rescue/neoklassika/neo-overview.avif",
  "/styles/hay-tek":
    "/media/visual-rescue/hay-tek/hightech-overview.avif",
  "/styles/provans":
    "/media/visual-rescue/provans/prov-overview.avif",
  "/styles/loft":
    "/media/visual-rescue/loft/loft-overview.avif",
  "/styles/sovremennye":
    "/media/visual-rescue/sovremennye/modern-overview.avif",
  "/styles/skandinavskie":
    "/media/visual-rescue/skandinavskie/scandi-overview.avif",
  "/styles/klassicheskie":
    "/media/visual-rescue/klassicheskie/classic-symmetry.avif",
  "/styles/minimalizm":
    "/media/visual-rescue/minimalizm/minimal-overview.avif",
  "/scenarios/s-ostrovom":
    "/media/visual-rescue/s-ostrovom/island-base.avif",
  "/scenarios/do-potolka":
    "/media/visual-rescue/do-potolka/ceiling-height.avif",
  "/scenarios/dlya-semi":
    "/media/visual-rescue/dlya-semi/family-cooking.avif",
  "/scenarios/dlya-studii":
    "/media/visual-rescue/dlya-studii/studio-base.avif",
  "/scenarios/dlya-malenkoy-kuhni":
    "/media/visual-rescue/dlya-malenkoy-kuhni/small-limit.avif",
  "/scenarios/byudzhetnaya-kuhnya":
    "/media/visual-rescue/byudzhetnaya-kuhnya/budget-base.avif",
};

const nextConfig: NextConfig = {
  compress: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    const revalidateStatic = "public, max-age=0, must-revalidate";
    const longStatic =
      "public, max-age=31536000, stale-while-revalidate=86400";

    return [
      ...Object.entries(finalPageLcpImages).map(([source, image]) => ({
        source,
        headers: [
          {
            key: "Link",
            value: `<${image}>; rel=preload; as=image; fetchpriority=high`,
          },
        ],
      })),
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/_next/image",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/logo.png",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/icon.svg",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/apple-icon.png",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: longStatic }],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/\\+375293720674",
        destination: "/contacts",
        statusCode: 301,
      },
      {
        source: "/locations/zhodzina",
        destination: "/locations/zhodino",
        statusCode: 301,
      },
      {
        source: "/scenarios/kuhnya-dlya-studii",
        destination: "/scenarios/dlya-studii",
        statusCode: 301,
      },
      {
        source: "/preload",
        destination: "/",
        statusCode: 301,
      },
      {
        source: "/catalog/preload",
        destination: "/catalog",
        statusCode: 301,
      },
      {
        source: "/locations/preload",
        destination: "/locations",
        statusCode: 301,
      },
      {
        source: "/https\\:/kuhni.minsk.by/images/blog/:image*",
        destination: "/images/blog/:image*",
        statusCode: 301,
      },
      {
        source: "/configurator",
        destination: "/design-proekt-kuhni",
        statusCode: 301,
      },
      {
        source: "/kitchen-configurator",
        destination: "/design-proekt-kuhni",
        statusCode: 301,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 64, 80, 96, 112, 128, 160, 240, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "0.0.0.0",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
