import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const data = await req.json();
    const { id: _id, ...rest } = data;
    const block = await prisma.homepageBlock.update({ where: { id: parseInt(id) }, data: rest });
    return NextResponse.json(block);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.homepageBlock.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
