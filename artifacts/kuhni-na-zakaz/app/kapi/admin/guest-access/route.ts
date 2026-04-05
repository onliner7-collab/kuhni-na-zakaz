import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const guestSchema = z.object({
  name: z.string().min(1),
  allowedSections: z.array(z.string()),
  allowedActions: z.array(z.string()),
  expiresAt: z.string().transform((s) => new Date(s)),
});

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  const accesses = await prisma.guestAccess.findMany({
    include: { createdBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(accesses);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  const body = await req.json();
  const parsed = guestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

  const access = await prisma.guestAccess.create({
    data: {
      name: parsed.data.name,
      createdById: session.userId,
      allowedSections: parsed.data.allowedSections,
      allowedActions: parsed.data.allowedActions,
      expiresAt: parsed.data.expiresAt,
    },
  });

  return NextResponse.json({ ...access, loginUrl: `/admin/login?token=${access.loginToken}` }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  const { id } = await req.json();
  await prisma.guestAccess.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
