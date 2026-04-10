import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  layoutType: z.enum(["STRAIGHT","CORNER","U_SHAPE","ISLAND","PENINSULA","LINEAR_COLUMNS","COMPACT"]).optional(),
  description: z.string().optional(),
  previewImageUrl: z.string().optional(),
  modulesConfig: z.array(z.unknown()).optional(),
  minWidthCm: z.number().int().nullable().optional(),
  maxWidthCm: z.number().int().nullable().optional(),
  isEnabled: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

interface P { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: P) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  const data = parsed.data as Record<string, unknown>;
  const item = await prisma.kitchenTemplate.update({ where: { id: parseInt(id) }, data }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: P) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { id } = await params;
  await prisma.kitchenTemplate.delete({ where: { id: parseInt(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
