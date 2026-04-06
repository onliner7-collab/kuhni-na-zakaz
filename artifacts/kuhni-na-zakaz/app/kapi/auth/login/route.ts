import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, createGuestSession, COOKIE_CONFIG } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  login: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  password: z.string().min(1),
  guestToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 });
    }

    const { login, email, password, guestToken } = parsed.data;
    const loginValue = (login || email || "").trim();

    // Guest token login
    if (guestToken) {
      const guestAccess = await prisma.guestAccess.findUnique({
        where: { loginToken: guestToken },
      });
      if (
        !guestAccess ||
        guestAccess.revokedAt ||
        new Date() > guestAccess.expiresAt
      ) {
        return NextResponse.json({ error: "Токен недействителен или истёк" }, { status: 401 });
      }
      const token = await createGuestSession({
        userId: 0,
        email: guestAccess.name,
        name: guestAccess.name,
        role: "GUEST",
        guestAccessId: guestAccess.id,
        guestSections: guestAccess.allowedSections,
        guestActions: guestAccess.allowedActions,
      });
      const response = NextResponse.json({ ok: true });
      response.cookies.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG.options);
      return response;
    }

    // Regular login — find by email field (used as login/username)
    const user = await prisma.user.findUnique({ where: { email: loginValue } });
    if (!user) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG.options);

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        ip: req.headers.get("x-forwarded-for") || "",
        userAgent: req.headers.get("user-agent") || "",
      },
    }).catch(() => {});

    return response;
  } catch (err) {
    console.error("[AUTH LOGIN]", err);
    return NextResponse.json({ error: "Внутренняя ошибка" }, { status: 500 });
  }
}
