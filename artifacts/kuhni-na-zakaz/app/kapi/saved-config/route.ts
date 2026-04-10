import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const SaveSchema = z.object({
  sessionId: z.string().min(1).max(100),
  answers: z.record(z.unknown()).default({}),
  tags: z.array(z.string()).default([]),
  styleSlug: z.string().default(""),
  materialSlug: z.string().default(""),
  scenarioSlug: z.string().default(""),
  budgetLevel: z.string().default(""),
  label: z.string().default(""),
  phone: z.string().default(""),
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  try {
    const config = await prisma.savedConfig.findUnique({ where: { sessionId } });
    return NextResponse.json(config ?? null);
  } catch {
    return NextResponse.json({ error: "Ошибка БД" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SaveSchema.parse(body);
    const createData: Prisma.SavedConfigUncheckedCreateInput = {
      ...data,
      answers: data.answers as Prisma.InputJsonValue,
    };
    const config = await prisma.savedConfig.upsert({
      where: { sessionId: data.sessionId },
      create: createData,
      update: {
        answers: data.answers as Prisma.InputJsonValue,
        tags: data.tags,
        styleSlug: data.styleSlug,
        materialSlug: data.materialSlug,
        scenarioSlug: data.scenarioSlug,
        budgetLevel: data.budgetLevel,
        label: data.label,
        phone: data.phone,
      },
    });
    return NextResponse.json({ ok: true, id: config.id });
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
