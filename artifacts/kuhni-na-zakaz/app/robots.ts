import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const BASE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  const closedPaths = [
    "/admin/",
    "/admin/imports/",
    "/login/",
    "/api/",
    "/kapi/",
    "/search/",
    "/*?*",
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
  };
}
