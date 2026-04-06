import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
  page: z.string().default("home"),
  order: z.number().int().default(0),
});

export async function GET() {
  try {
    await requireAdmin();
    const items = await prisma.fAQItem.findMany({
      orderBy: [{ page: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const data = CreateSchema.parse(body);
    const item = await prisma.fAQItem.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
