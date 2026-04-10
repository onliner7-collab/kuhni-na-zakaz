import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.visualProject.findMany({
      skip, take: limit,
      orderBy: { updatedAt: "desc" },
      include: { lead: { select: { id: true, name: true, phone: true } } },
    }),
    prisma.visualProject.count(),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}
