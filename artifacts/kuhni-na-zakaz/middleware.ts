import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { CANONICAL_SITE_URL } from "@/lib/seo";

const ADMIN_PATHS = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const CLOSED_ROBOTS_PATHS = [
  "/admin",
  "/api",
  "/kapi",
  "/account",
  "/dashboard",
  "/login",
  "/search",
  "/thanks",
  "/user",
];
const NOINDEX_HEADER_VALUE = "noindex, nofollow, noarchive";
const CANONICAL_HOST = getCanonicalHost();

const LEGACY_REDIRECTS: Record<string, string> = {
  "/kuhni": "/catalog",
  "/katalog": "/catalog",
  "/catalog.html": "/catalog",
  "/portfolio.html": "/portfolio",
  "/ceny": "/prices",
  "/price": "/prices",
  "/prices.html": "/prices",
  "/calculator-калькулятор": "/calculator",
  "/kontakty": "/contacts",
  "/contacts.html": "/contacts",
  "/blog.html": "/blog",
  "/catalog/kuhnya-bez-ruchek": "/catalog/kuhni-bez-ruchek",
  "/catalog/kuhnya-bez-ruchek-minsk": "/catalog/kuhni-bez-ruchek",
  "/catalog/kuhnya-do-potolka": "/catalog/kuhni-do-potolka",
  "/catalog/kuhnya-do-potolka-minsk": "/catalog/kuhni-do-potolka",
  "/catalog/malenkaya-kuhnya": "/catalog/malenkie-kuhni",
  "/catalog/malenkaya-kuhnya-minsk": "/catalog/malenkie-kuhni",
  "/catalog/pryamaya-kuhnya": "/catalog/pryamye-kuhni",
  "/catalog/pryamaya-kuhnya-minsk": "/catalog/pryamye-kuhni",
  "/catalog/uglovaya-kuhnya": "/catalog/uglovye-kuhni",
  "/catalog/uglovaya-kuhnya-minsk": "/catalog/uglovye-kuhni",
  "/catalog/p-obraznaya-kuhnya": "/catalog/p-obraznye-kuhni",
  "/catalog/p-obraznaya-kuhnya-minsk": "/catalog/p-obraznye-kuhni",
  "/catalog/kuhnya-s-ostrovom-minsk": "/catalog/kuhni-s-ostrovom",
  "/catalog/kuhnya-dlya-studii-minsk": "/catalog/malenkie-kuhni",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = (req.headers.get("host") || req.nextUrl.host)
    .split(":")[0]
    .toLowerCase();
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const isLocalhost = ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(hostname);
  const shouldForceHttps =
    !isLocalhost && (req.nextUrl.protocol === "http:" || forwardedProto === "http");
  const legacyTarget = LEGACY_REDIRECTS[normalizePathname(pathname)];

  if (shouldForceHttps || hostname === `www.${CANONICAL_HOST}` || legacyTarget) {
    const url = req.nextUrl.clone();
    if (!isLocalhost) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
    }
    if (legacyTarget) {
      url.pathname = legacyTarget;
      url.search = "";
    }
    return NextResponse.redirect(url, 301);
  }

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  if (!isAdminPath) {
    return addPathnameHeader(req, pathname);
  }
  if (isPublicAdminPath) {
    return addPathnameHeader(req, pathname);
  }

  const session = await getSessionFromRequest(req);

  if (!session) {
    const url = createRedirectUrl(req, "/admin/login", isLocalhost);
    url.searchParams.set("from", pathname);
    return withNoindexHeader(NextResponse.redirect(url));
  }

  // Guest access: check allowed sections
  if (session.guestSections) {
    const allowedSections = session.guestSections;
    const isAllowed = allowedSections.some((s) => pathname.includes(s));
    if (!isAllowed && pathname !== "/admin/dashboard") {
      const url = createRedirectUrl(req, "/admin/dashboard", isLocalhost);
      return withNoindexHeader(NextResponse.redirect(url));
    }
  }

  return addPathnameHeader(req, pathname);
}

function addPathnameHeader(req: NextRequest, pathname: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (CLOSED_ROBOTS_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return withNoindexHeader(response);
  }

  return response;
}

function withNoindexHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", NOINDEX_HEADER_VALUE);
  return response;
}

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1).toLowerCase();
  }

  return pathname.toLowerCase();
}

function getCanonicalHost() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL;

  try {
    return new URL(siteUrl).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return new URL(CANONICAL_SITE_URL).hostname;
  }
}

function createRedirectUrl(req: NextRequest, pathname: string, isLocalhost: boolean) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;

  if (!isLocalhost) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
  }

  return url;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
