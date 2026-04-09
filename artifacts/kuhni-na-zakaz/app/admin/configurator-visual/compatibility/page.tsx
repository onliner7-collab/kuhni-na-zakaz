import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Edit } from "lucide-react";

export const metadata: Metadata = { title: "Правила совместимости" };

const RULE_COLORS: Record<string, string> = {
  INCOMPATIBLE: "destructive",
  REQUIRES: "default",
  WARNING: "secondary",
};

const RULE_LABELS: Record<string, string> = {
  INCOMPATIBLE: "Несовместимо",
  REQUIRES: "Обязательно",
  WARNING: "Предупреждение",
};

export default async function AdminCompatibilityPage() {
  const rules = await prisma.compatibilityRule
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black">Правила совместимости</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Несовместимые и обязательные комбинации компонентов конфигуратора
          </p>
        </div>
        <Link
          href="/admin/configurator-visual/compatibility/new"
          className={cn(buttonVariants(), "text-white")}
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
        >
          <Plus className="w-4 h-4 mr-2" />Добавить правило
        </Link>
      </div>

      {rules.length === 0 ? (
        <div className="rounded-xl border bg-muted/40 p-12 text-center text-muted-foreground">
          Правила ещё не добавлены.
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Тип</th>
                <th className="text-left px-4 py-3 font-medium">Источник</th>
                <th className="text-left px-4 py-3 font-medium">Цель</th>
                <th className="text-left px-4 py-3 font-medium">Сообщение</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <Badge variant={RULE_COLORS[r.ruleType] as "destructive" | "default" | "secondary"}>
                      {RULE_LABELS[r.ruleType] ?? r.ruleType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {r.sourceEntity}:{r.sourceSlug}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {r.targetEntity}:{r.targetSlug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {r.message || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={r.isEnabled ? "outline" : "secondary"}>
                      {r.isEnabled ? "Активно" : "Откл."}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/configurator-visual/compatibility/${r.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      <Edit className="w-3 h-3 mr-1" />Изменить
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
