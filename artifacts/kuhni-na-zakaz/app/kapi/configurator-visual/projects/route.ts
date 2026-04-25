import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const saveSchema = z.object({
  id: z.number().optional(),
  sessionId: z.string().min(1).max(100),
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
    const { id, sessionId, ...data } = parsed.data;
    const payload: Prisma.VisualProjectUncheckedCreateInput = {
      sessionId,
      ...data,
      roomConfig: data.roomConfig as Prisma.InputJsonValue,
      modulePlacement: data.modulePlacement as Prisma.InputJsonValue,
      materialsConfig: data.materialsConfig as Prisma.InputJsonValue,
      isDraft: true,
    };

    let project;
    if (id) {
      const existing = await prisma.visualProject.findUnique({
        where: { id },
        select: { sessionId: true },
      });
      if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (existing.sessionId !== sessionId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      project = await prisma.visualProject.update({
        where: { id },
        data: payload,
      });
    } else {
      project = await prisma.visualProject.create({
        data: payload,
      });
    }

    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
