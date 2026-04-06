import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const option = await prisma.configOption.create({ data });
    return NextResponse.json(option);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
