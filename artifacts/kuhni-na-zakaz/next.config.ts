import type { NextConfig } from "next";

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
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: revalidateStatic }],
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
