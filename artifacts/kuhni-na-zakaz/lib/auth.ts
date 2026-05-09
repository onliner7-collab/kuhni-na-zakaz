import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "kuhni-minsk-secret-change-in-prod"
);

const COOKIE_NAME = "kuhni_session";

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
  role: string;
  guestAccessId?: number;
  guestSections?: string[];
  guestActions?: string[];
  exp?: number;
};

export async function createSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

export async function createGuestSession(
  payload: SessionPayload
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function isAdminRole(role: string | undefined): boolean {
  return role === "SUPER_ADMIN" || role === "MANAGER";
}

export function isSuperAdminRole(role: string | undefined): boolean {
  return role === "SUPER_ADMIN";
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireSuperAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !isSuperAdminRole(session.role)) {
    redirect("/admin/dashboard");
  }
  return session;
}

export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function getSessionFromRequestSync(
  req: NextRequest
): Promise<SessionPayload | null> {
  return getSessionFromRequest(req);
}

export const COOKIE_CONFIG = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  },
};
