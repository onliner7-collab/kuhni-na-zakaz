import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null);
  return NextResponse.json(settings || {});
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await req.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...body },
    update: body,
  }).catch((e: Error) => { throw e; });

  return NextResponse.json(settings);
}
