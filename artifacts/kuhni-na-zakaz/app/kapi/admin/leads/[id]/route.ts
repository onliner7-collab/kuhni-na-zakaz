import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } });
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  void req;
  void params;
  await requireAdmin();
  return NextResponse.json(
    { error: "Управление заявками выполняется только через Telegram" },
    { status: 405, headers: { Allow: "GET" } },
  );
}
