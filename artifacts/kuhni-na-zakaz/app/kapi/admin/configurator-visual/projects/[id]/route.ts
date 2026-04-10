import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface P { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: P) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { id } = await params;
  const item = await prisma.visualProject.findUnique({
    where: { id: parseInt(id) },
    include: { lead: { select: { id: true, name: true, phone: true, email: true } } },
  });
  if (!item) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: P) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { id } = await params;
  await prisma.visualProject.delete({ where: { id: parseInt(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
