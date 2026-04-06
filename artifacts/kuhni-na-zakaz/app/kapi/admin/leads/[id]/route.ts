import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PatchSchema = z.object({
  status: z.enum(["new", "contacted", "working", "done", "lost"]).optional(),
  managerNote: z.string().max(2000).optional(),
  assignedTo: z.string().max(100).optional(),
});

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
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = PatchSchema.parse(body);
    const lead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(lead);
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
