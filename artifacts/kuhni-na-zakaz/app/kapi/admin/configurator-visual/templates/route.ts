import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  layoutType: z.enum(["STRAIGHT","CORNER","U_SHAPE","ISLAND","PENINSULA","LINEAR_COLUMNS","COMPACT"]),
  description: z.string().default(""),
  previewImageUrl: z.string().default(""),
  modulesConfig: z.array(z.unknown()).default([]),
  minWidthCm: z.number().int().nullable().optional(),
  maxWidthCm: z.number().int().nullable().optional(),
  isEnabled: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });
  const item = await prisma.kitchenTemplate.create({ data: { ...parsed.data, modulesConfig: parsed.data.modulesConfig as object[] } }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Слаг уже занят" }, { status: 400 });
  return NextResponse.json(item, { status: 201 });
}
