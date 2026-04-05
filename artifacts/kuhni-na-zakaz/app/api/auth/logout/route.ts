import { NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_CONFIG.name, "", {
    ...COOKIE_CONFIG.options,
    maxAge: 0,
  });
  return response;
}
