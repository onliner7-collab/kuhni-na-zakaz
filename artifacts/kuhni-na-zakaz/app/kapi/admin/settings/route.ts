import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null);
  if (!settings) return NextResponse.json({});

  if (session.role === "SUPER_ADMIN") {
    return NextResponse.json(settings);
  }

  const { telegramBotToken, telegramChatId, ...safeSettings } = settings;
  return NextResponse.json({
    ...safeSettings,
    telegramBotToken: "",
    telegramChatId: "",
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const body = await req.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...body },
    update: body,
  }).catch((e: Error) => { throw e; });

  return NextResponse.json(settings);
}
