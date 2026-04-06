import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const ToggleSchema = z.object({
  sessionId: z.string().min(1).max(100),
  caseSlug: z.string().min(1).max(200),
  action: z.enum(["add", "remove"]),
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ slugs: [] });
  try {
    const favs = await prisma.favoriteCase.findMany({
      where: { sessionId },
      select: { caseSlug: true },
    });
    return NextResponse.json({ slugs: favs.map(f => f.caseSlug) });
  } catch {
    return NextResponse.json({ slugs: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, caseSlug, action } = ToggleSchema.parse(body);
    if (action === "add") {
      await prisma.favoriteCase.upsert({
        where: { sessionId_caseSlug: { sessionId, caseSlug } },
        create: { sessionId, caseSlug },
        update: {},
      });
    } else {
      await prisma.favoriteCase.deleteMany({ where: { sessionId, caseSlug } });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 400 });
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
