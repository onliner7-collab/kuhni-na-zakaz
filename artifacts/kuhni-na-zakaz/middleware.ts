import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const ADMIN_PATHS = ["/admin"];
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
