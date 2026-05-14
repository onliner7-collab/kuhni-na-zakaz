import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["page.tsx", "page.ts", "route.ts", "route.tsx"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
