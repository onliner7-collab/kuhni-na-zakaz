import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const kitchenSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  style: z.string().optional(),
  material: z.string().optional(),
  priceFrom: z.number().min(0).optional(),
  priceTo: z.number().nullable().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  mainImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean().optional(),
});

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = kitchenSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные" }, { status: 400 });

  const kitchen = await prisma.kitchen.update({
    where: { id: parseInt(id) },
    data: parsed.data,
  }).catch(() => null);

  if (!kitchen) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(kitchen);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  if (session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  const { id } = await params;
  await prisma.kitchen.delete({ where: { id: parseInt(id) } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
