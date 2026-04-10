import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).optional(), slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  brand: z.string().optional(),
  applianceType: z.enum(["OVEN","MICROWAVE","DISHWASHER","FRIDGE","HOOD","SINK","COOKTOP","WASHER"]).optional(),
  widthCm: z.number().int().min(1).optional(), heightCm: z.number().int().min(1).optional(), depthCm: z.number().int().min(1).optional(),
  imageUrl: z.string().optional(), price: z.number().int().min(0).optional(),
  isEnabled: z.boolean().optional(), sortOrder: z.number().int().optional(),
});

interface P { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: P) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  const item = await prisma.kitchenAppliance.update({ where: { id: parseInt(id) }, data: parsed.data }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: P) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const { id } = await params;
  await prisma.kitchenAppliance.delete({ where: { id: parseInt(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
