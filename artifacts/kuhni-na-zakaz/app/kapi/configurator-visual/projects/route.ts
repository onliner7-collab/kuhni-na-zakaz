import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const saveSchema = z.object({
  id: z.number().optional(),
  sessionId: z.string().optional(),
  name: z.string().max(200).default("Мой проект"),
  roomConfig: z.record(z.unknown()).default({}),
  modulePlacement: z.array(z.unknown()).default([]),
  materialsConfig: z.record(z.unknown()).default({}),
  priceEstimate: z.number().int().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Неверный формат", details: parsed.error.flatten() }, { status: 400 });
    }
    const { id, ...data } = parsed.data;

    let project;
    if (id) {
      project = await prisma.visualProject.update({
        where: { id },
        data: { ...data, isDraft: true },
      });
    } else {
      project = await prisma.visualProject.create({
        data: { ...data, isDraft: true },
      });
    }

    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
