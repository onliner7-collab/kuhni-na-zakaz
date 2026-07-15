import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(50),
  phoneDisplay: z.string().trim().max(50),
  email: z.string().trim().email().or(z.literal("")),
  address: z.string().trim().max(300),
  workingHours: z.string().trim().max(200),
  telegram: z.string().trim().max(300),
  viber: z.string().trim().max(100),
  whatsapp: z.string().trim().max(100),
  metaTitle: z.string().trim().max(200),
  metaDescription: z.string().trim().max(500),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null);
  if (!settings) return NextResponse.json({});
  const { telegramBotToken: _token, telegramChatId: _chatId, ...safeSettings } = settings;
  return NextResponse.json(safeSettings);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }
  const parsed = settingsSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Проверьте поля", details: parsed.error.flatten() }, { status: 400 });
  }
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...parsed.data },
    update: parsed.data,
  });
  const { telegramBotToken: _token, telegramChatId: _chatId, ...safeSettings } = settings;
  return NextResponse.json(safeSettings);
}
