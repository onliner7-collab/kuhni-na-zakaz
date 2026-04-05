import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const locations = await prisma.locationPage.findMany({
      orderBy: [{ published: "desc" }, { city: "asc" }],
      select: {
        id: true, city: true, slug: true, region: true, h1: true,
        priceFrom: true, published: true, createdAt: true, updatedAt: true,
        images: true, areas: true,
      },
    });
    return NextResponse.json(locations);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const loc = await prisma.locationPage.create({ data });
    return NextResponse.json(loc, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
