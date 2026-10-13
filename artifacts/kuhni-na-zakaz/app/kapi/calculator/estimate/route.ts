import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { estimate, lengthError, tariffKeys } from "@/lib/calculator/config";
import { selectionSchema } from "@/lib/calculator/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = selectionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Проверьте выбранные параметры кухни." }, { status: 400 });
  const error = lengthError(parsed.data);
  if (error) return NextResponse.json({ error }, { status: 400 });
  try {
    const tariffs = await prisma.priceRule.findMany({ where: { key: { in: tariffKeys(parsed.data) }, active: true }, select: { key: true, value: true, active: true } });
    return NextResponse.json(estimate(parsed.data, tariffs), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось проверить расчёт. Ваши параметры сохранены на этом экране. Попробуйте ещё раз." }, { status: 503 });
  }
}
