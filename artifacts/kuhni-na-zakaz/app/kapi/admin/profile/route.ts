import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, COOKIE_CONFIG, createSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await requireAdmin();
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...user, login: user.email });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, login, currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

    // Verify current password always required for profile changes
    if (!currentPassword) {
      return NextResponse.json({ error: "Введите текущий пароль для подтверждения" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Текущий пароль указан неверно" }, { status: 400 });
    }

    const updateData: any = {};

    if (name && name.trim()) updateData.name = name.trim();
    if (login && login.trim() && login.trim() !== user.email) {
      const exists = await prisma.user.findUnique({ where: { email: login.trim() } });
      if (exists && exists.id !== user.id) {
        return NextResponse.json({ error: "Этот логин уже занят" }, { status: 409 });
      }
      updateData.email = login.trim();
    }
    if (newPassword) {
      if (newPassword.length < 4) {
        return NextResponse.json({ error: "Новый пароль должен быть не менее 4 символов" }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 });
    }

    const updated = await prisma.user.update({ where: { id: user.id }, data: updateData });

    // Refresh JWT cookie with updated data
    const newToken = await createSession({
      userId: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });
    const res = NextResponse.json({ ok: true, login: updated.email, name: updated.name });
    res.cookies.set(COOKIE_CONFIG.name, newToken, COOKIE_CONFIG.options);
    return res;
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Этот логин уже занят" }, { status: 409 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
