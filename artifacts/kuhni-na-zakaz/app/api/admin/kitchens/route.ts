import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const kitchenSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().default(""),
  category: z.string().default(""),
  style: z.string().default(""),
  material: z.string().default(""),
  priceFrom: z.number().min(0),
  priceTo: z.number().nullable().optional(),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  mainImage: z.string().default(""),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });

  const body = await req.json();
  const parsed = kitchenSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });

  const kitchen = await prisma.kitchen.create({ data: parsed.data }).catch((e: Error) => {
    if (e.message.includes("Unique")) return null;
    throw e;
  });

  if (!kitchen) return NextResponse.json({ error: "Слаг уже занят" }, { status: 400 });
  return NextResponse.json(kitchen, { status: 201 });
}
