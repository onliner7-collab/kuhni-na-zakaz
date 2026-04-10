import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1), slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  brand: z.string().default(""),
  applianceType: z.enum(["OVEN","MICROWAVE","DISHWASHER","FRIDGE","HOOD","SINK","COOKTOP","WASHER"]),
  widthCm: z.number().int().min(1), heightCm: z.number().int().min(1), depthCm: z.number().int().min(1).default(60),
  imageUrl: z.string().default(""), price: z.number().int().min(0).default(0),
  isEnabled: z.boolean().default(true), sortOrder: z.number().int().default(0),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });
  const item = await prisma.kitchenAppliance.create({ data: parsed.data }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Слаг уже занят" }, { status: 400 });
  return NextResponse.json(item, { status: 201 });
}
