import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const scenario = await prisma.scenarioPage.findUnique({ where: { id: parseInt(id) } });
    if (!scenario) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(scenario);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const data = await req.json();
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = data;
    const scenario = await prisma.scenarioPage.update({
      where: { id: parseInt(id) },
      data: rest,
    });
    return NextResponse.json(scenario);
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
    await prisma.scenarioPage.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
