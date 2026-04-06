import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ConfigStepsEditor } from "@/components/admin/ConfigStepsEditor";
import { ExternalLink, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Конфигуратор — Админ" };

export default async function AdminConfiguratorPage() {
  await requireAdmin();

  const steps = await prisma.configStep.findMany({
    orderBy: { order: "asc" },
    include: { options: { orderBy: { order: "asc" } } },
  });

  const resultsCount = await prisma.configResult.count();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Конфигуратор кухни</h1>
          <p className="text-muted-foreground mt-1">
            Управление шагами, вариантами, подсказками и тегами рекомендаций
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-sm text-blue-700">
            <BarChart3 className="w-4 h-4" />
            <span><strong>{resultsCount}</strong> сессий пройдено</span>
          </div>
          <Link href="/configure" target="_blank"
            className="flex items-center gap-2 text-sm text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition-colors">
            <ExternalLink className="w-4 h-4" /> Открыть конфигуратор
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 text-sm text-amber-800 space-y-1.5">
        <p><strong>Как работает рекомендационная логика:</strong></p>
        <p>Каждый вариант ответа имеет набор <strong>тегов</strong>. При завершении конфигуратора теги агрегируются и на странице результата из БД подтягиваются: StylePage (по <code className="bg-amber-100 px-1 rounded">style:…</code>), MaterialPage (по <code className="bg-amber-100 px-1 rounded">budget:…</code>), PortfolioCase (по <code className="bg-amber-100 px-1 rounded">style:…</code>).</p>
        <p>Примеры тегов: <code className="bg-amber-100 px-1 rounded">style:scandinavian</code>, <code className="bg-amber-100 px-1 rounded">budget:standard</code>, <code className="bg-amber-100 px-1 rounded">layout:corner</code>, <code className="bg-amber-100 px-1 rounded">material:veneer</code>, <code className="bg-amber-100 px-1 rounded">hardware:premium</code>, <code className="bg-amber-100 px-1 rounded">storage:maximum</code></p>
      </div>

      <ConfigStepsEditor initialSteps={steps} />
    </div>
  );
}
