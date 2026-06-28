import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PriceRulesEditor } from "@/components/admin/PriceRulesEditor";
import Link from "@/components/navigation/Link";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Цены и калькулятор — Админ" };

const CATEGORY_LABELS: Record<string, string> = {
  material:   "Материал фасадов — базовая цена (BYN/п.м кухни)",
  layout:     "Планировка — коэффициент",
  style:      "Стиль — коэффициент",
  countertop: "Столешница — надбавка (BYN)",
  hardware:   "Фурнитура — надбавка (BYN/п.м)",
  tech:       "Встроенная техника — надбавка (BYN)",
  priority:   "Приоритет клиента — корректировка",
  config:     "Настройки расчёта",
};

const CATEGORY_ORDER = ["material","layout","style","countertop","hardware","tech","priority","config"];

export default async function AdminPricesPage() {
  await requireAdmin();
  const rules = await prisma.priceRule.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  const grouped: Record<string, typeof rules> = {};
  for (const r of rules) {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Цены и калькулятор</h1>
          <p className="text-muted-foreground mt-1">
            Редактируйте коэффициенты — они сразу применяются в публичном калькуляторе
          </p>
        </div>
        <Link href="/calculator" target="_blank"
          className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors">
          <ExternalLink className="w-4 h-4" /> Открыть калькулятор
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        <strong>Формула:</strong> Базовая цена (BYN/п.м × длина) × коэфф. планировки × коэфф. стиля + столешница + фурнитура/п.м + техника ± приоритет. Итог × диапазон (config_range_low … config_range_high).
      </div>

      <PriceRulesEditor grouped={grouped} categoryLabels={CATEGORY_LABELS} categoryOrder={CATEGORY_ORDER} />
    </div>
  );
}
