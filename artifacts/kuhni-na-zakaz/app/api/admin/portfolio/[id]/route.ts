import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CaseSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  city: z.string().optional(),
  area: z.number().int().optional(),
  style: z.string().optional(),
  material: z.string().optional(),
  priceFrom: z.number().int().optional(),
  priceTo: z.number().int().optional(),
  days: z.number().int().optional(),
  description: z.string().optional(),
  task: z.string().optional(),
  solution: z.string().optional(),
  images: z.array(z.string()).optional(),
  mainImage: z.string().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const portfolioCase = await prisma.portfolioCase.findUnique({ where: { id: parseInt(id) } });
    if (!portfolioCase) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(portfolioCase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = CaseSchema.parse(body);
    const portfolioCase = await prisma.portfolioCase.update({ where: { id: parseInt(id) }, data });
    return NextResponse.json(portfolioCase);
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    if (err.code === "P2002") return NextResponse.json({ error: "Slug уже занят" }, { status: 409 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.portfolioCase.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
