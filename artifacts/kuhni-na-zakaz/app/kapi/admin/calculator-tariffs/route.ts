import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { tariffDefinitions } from "@/lib/calculator/config";
const schema = z.array(z.object({ key: z.string(), value: z.number().finite().min(0).max(100000).nullable() }).strict()).length(tariffDefinitions.length);
export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Требуется вход администратора" }, { status: 401 }); }
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin && origin !== "https://kuhni.minsk.by") return NextResponse.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Проверьте тарифы: только неотрицательные числа до 100 000 BYN/м." }, { status: 400 });
  const values = parsed.data;
  if (new Set(values.map(v => v.key)).size !== tariffDefinitions.length || values.some(v => !tariffDefinitions.some(def => def.key === v.key) || (tariffDefinitions.find(def => def.key === v.key)!.positive && v.value !== null && v.value <= 0))) return NextResponse.json({ error: "Проверьте состав тарифов. Стоимость мебели должна быть больше нуля." }, { status: 400 });
  try {
    await prisma.$transaction(values.map(value => {
      const definition = tariffDefinitions.find(def => def.key === value.key)!;
      const data = { value: value.value ?? 0, active: value.value !== null };
      return prisma.priceRule.upsert({ where: { key: value.key }, update: data, create: { key: value.key, category: "calculator_v2", label: definition.label, unit: "BYN/м", description: definition.group, ...data } });
    }));
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Не удалось сохранить тарифы. Повторите попытку." }, { status: 500 }); }
}
