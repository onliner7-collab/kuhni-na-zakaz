import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  defaultRoomWidthCm: z.number().int().min(100).optional(),
  defaultRoomDepthCm: z.number().int().min(100).optional(),
  defaultRoomHeightCm: z.number().int().min(200).optional(),
  minRoomWidthCm: z.number().int().min(50).optional(),
  minRoomDepthCm: z.number().int().min(50).optional(),
  installationPct: z.number().int().min(0).max(100).optional(),
  shareTextTemplate: z.string().optional(),
  pdfBrandingText: z.string().optional(),
  isEnabled: z.boolean().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const settings = await prisma.kitchenConfiguratorSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    // Return defaults if not yet seeded
    return NextResponse.json({
      id: 1, defaultRoomWidthCm: 400, defaultRoomDepthCm: 300, defaultRoomHeightCm: 270,
      minRoomWidthCm: 150, minRoomDepthCm: 120, installationPct: 15,
      shareTextTemplate: "Посмотрите мой проект кухни!", pdfBrandingText: "Кухни на заказ", isEnabled: true,
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Неверные данные", details: parsed.error.flatten() }, { status: 400 });
  const settings = await prisma.kitchenConfiguratorSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  }).catch(() => null);
  if (!settings) return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  return NextResponse.json(settings);
}
