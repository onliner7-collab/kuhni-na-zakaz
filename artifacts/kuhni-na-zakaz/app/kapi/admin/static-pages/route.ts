import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const pages = await prisma.staticPage.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
