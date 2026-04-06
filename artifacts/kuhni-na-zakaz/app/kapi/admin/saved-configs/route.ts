import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const configs = await prisma.savedConfig.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(configs);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
