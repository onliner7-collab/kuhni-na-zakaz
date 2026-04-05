import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const blocks = await prisma.homepageBlock.findMany({ orderBy: [{ type: "asc" }, { order: "asc" }] });
    return NextResponse.json(blocks);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const block = await prisma.homepageBlock.create({ data });
    return NextResponse.json(block, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
