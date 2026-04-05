import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CaseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  city: z.string().default("Минск"),
  area: z.number().int().default(0),
  style: z.string().default(""),
  material: z.string().default(""),
  priceFrom: z.number().int().default(0),
  priceTo: z.number().int().default(0),
  days: z.number().int().default(30),
  description: z.string().default(""),
  task: z.string().default(""),
  solution: z.string().default(""),
  images: z.array(z.string()).default([]),
  mainImage: z.string().default(""),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

export async function GET() {
  try {
    await requireAdmin();
    const cases = await prisma.portfolioCase.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(cases);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = CaseSchema.parse(body);
    const portfolioCase = await prisma.portfolioCase.create({ data });
    return NextResponse.json(portfolioCase, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    if (err.code === "P2002") return NextResponse.json({ error: "Slug уже занят" }, { status: 409 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
