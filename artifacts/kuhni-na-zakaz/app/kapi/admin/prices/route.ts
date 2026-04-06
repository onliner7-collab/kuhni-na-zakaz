import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const rules = await prisma.priceRule.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
    return NextResponse.json(rules);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Bulk update: [{ id, value, label?, description?, active? }]
export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const updates: { id: number; value?: number; label?: string; description?: string; active?: boolean }[] = await req.json();
    const results = await Promise.all(
      updates.map(({ id, ...data }) => prisma.priceRule.update({ where: { id }, data }))
    );
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
