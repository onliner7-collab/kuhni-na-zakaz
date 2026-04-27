import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const BASE_URL = getSiteUrl();
const HOST = new URL(BASE_URL).host;

export default function robots(): MetadataRoute.Robots {
  const closedPaths = [
    "/admin",
    "/admin/",
    "/admin/login",
    "/api",
    "/api/",
    "/kapi",
    "/kapi/",
    "/login",
    "/thanks",
    "/thanks/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: closedPaths,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: HOST,
  };
}
