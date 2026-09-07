import type { MetadataRoute } from "next";
import { CANONICAL_SITE_URL } from "@/lib/seo";

const BASE_URL = CANONICAL_SITE_URL;

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const closedPaths = [
    "/admin/",
    "/admin/imports/",
    "/login/",
    "/api/",
    "/kapi/",
    "/search/",
    "/thanks/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/kapi/watermarked-image"],
        disallow: closedPaths,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
