import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export interface CalcInput {
  area: number;
  layout: string;
  style: string;
  material: string;
  countertop: string;
  hardware: string;
  tech: string;
  priority: string;
}

export async function POST(req: NextRequest) {
  try {
    const input: CalcInput = await req.json();

    const allRules = await prisma.priceRule.findMany({ where: { active: true } });
    const rule = (key: string) => allRules.find(r => r.key === key)?.value ?? 0;

    const area = Math.max(1, Math.min(8, Number(input.area) || 3));

    const basePricePerLm = rule(`material_${input.material}`);
    const layoutCoeff = rule(`layout_${input.layout}`);
    const styleCoeff = rule(`style_${input.style}`);
    const countertopAddon = rule(`countertop_${input.countertop}`);
    const hardwarePerLm = rule(`hardware_${input.hardware}`);
    const techAddon = rule(`tech_${input.tech}`);
    const priorityDelta = rule(`priority_${input.priority}`);

    const rangeLow = rule("config_range_low") || 0.88;
    const rangeHigh = rule("config_range_high") || 1.22;

    const baseEstimate =
      basePricePerLm * area * layoutCoeff * styleCoeff
      + countertopAddon
      + hardwarePerLm * area
      + techAddon;

    const withPriority = baseEstimate * (1 + priorityDelta);

    const rawFrom = withPriority * rangeLow;
    const rawTo = withPriority * rangeHigh;

    // Round to nearest 50
    const round50 = (n: number) => Math.round(n / 50) * 50;

    const priceFrom = round50(rawFrom);
    const priceTo = round50(rawTo);
    const priceCenter = round50(withPriority);

    // Build factor explanations
    const factors: { label: string; impact: "neutral" | "positive" | "warning" }[] = [];
    if (layoutCoeff > 1.1) factors.push({ label: `Планировка «${input.layout === "with_island" ? "с островом" : "П-образная"}» увеличивает стоимость`, impact: "warning" });
    if (styleCoeff > 1.1) factors.push({ label: "Сложный стиль с декором требует дополнительной обработки", impact: "warning" });
    if (countertopAddon > 300) factors.push({ label: "Столешница из натурального материала — значительная статья расходов", impact: "neutral" });
    if (hardwarePerLm >= 95) factors.push({ label: "Фурнитура Blum/Hettich — долговечность и надёжность", impact: "positive" });
    if (techAddon > 0) factors.push({ label: "Встроенная техника — дополнительные +"+techAddon.toLocaleString("ru")+" BYN", impact: "neutral" });
    factors.push({ label: "Точная стоимость — после бесплатного замера и проекта", impact: "neutral" });

    return NextResponse.json({
      priceFrom,
      priceTo,
      priceCenter,
      area,
      factors,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
