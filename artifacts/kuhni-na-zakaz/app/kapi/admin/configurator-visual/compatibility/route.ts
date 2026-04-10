import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  ruleType: z.enum(["INCOMPATIBLE","REQUIRES","WARNING"]),
  sourceEntity: z.string().min(1), sourceSlug: z.string().min(1),
  targetEntity: z.string().min(1), targetSlug: z.string().min(1),
  message: z.string().default(""),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const items = await prisma.compatibilityRule.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });
  const item = await prisma.compatibilityRule.create({ data: parsed.data }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Ошибка создания" }, { status: 400 });
  return NextResponse.json(item, { status: 201 });
}
