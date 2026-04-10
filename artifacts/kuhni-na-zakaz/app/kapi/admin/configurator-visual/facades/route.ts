import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  material: z.string().default(""),
  finish: z.string().default(""),
  colorHex: z.string().default(""),
  colorName: z.string().default(""),
  imageUrl: z.string().default(""),
  priceMultiplier: z.number().min(0).default(1.0),
  isEnabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });
  const item = await prisma.kitchenFacade.create({ data: parsed.data }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Слаг уже занят" }, { status: 400 });
  return NextResponse.json(item, { status: 201 });
}
