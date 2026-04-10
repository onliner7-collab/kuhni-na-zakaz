import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
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
