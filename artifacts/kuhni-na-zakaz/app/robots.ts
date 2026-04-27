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
    "/account",
    "/account/",
    "/dashboard",
    "/dashboard/",
    "/login",
    "/login/",
    "/thanks",
    "/thanks/",
    "/user",
    "/user/",
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
