import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface Ctx { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const data = await req.json();
    const rule = await prisma.priceRule.update({ where: { id: Number(id) }, data });
    return NextResponse.json(rule);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
