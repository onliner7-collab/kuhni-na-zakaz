import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const ADMIN_PATHS = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const CLOSED_ROBOTS_PATHS = ["/admin", "/api", "/kapi", "/login", "/thanks"];
const NOINDEX_HEADER_VALUE = "noindex, nofollow, noarchive";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = (req.headers.get("host") || req.nextUrl.host)
    .split(":")[0]
    .toLowerCase();

  if (hostname === "www.kuhni.minsk.by") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "kuhni.minsk.by";
    url.port = "";
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
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Guest access: check allowed sections
  if (session.guestSections) {
    const allowedSections = session.guestSections;
    const isAllowed = allowedSections.some((s) => pathname.includes(s));
    if (!isAllowed && pathname !== "/admin/dashboard") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return addPathnameHeader(req, pathname);
}

function addPathnameHeader(req: NextRequest, pathname: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (CLOSED_ROBOTS_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    response.headers.set("X-Robots-Tag", NOINDEX_HEADER_VALUE);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
