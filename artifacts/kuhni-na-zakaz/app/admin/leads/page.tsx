import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { LeadStatusControl } from "@/components/admin/LeadStatusControl";
import { STATUS_OPTIONS } from "@/lib/lead-status";
import { LeadNoteEditor } from "@/components/admin/LeadNoteEditor";
import { Phone, User, MapPin, Calendar, Cpu, Palette, Package, Wallet, Route, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Заявки — КухниBY" };

const FORM_TYPE_LABELS: Record<string, string> = {
  contact: "Контакт",
  configurator_result: "Конфигуратор",
  calculator: "Калькулятор",
  catalog: "Каталог",
  portfolio: "Портфолио",
  blog: "Блог",
  "": "Форма",
};

const BUDGET_LABELS: Record<string, string> = {
  economy: "Эконом",
  standard: "Стандарт",
  comfort: "Комфорт",
  premium: "Премиум",
};

const STYLE_LABELS: Record<string, string> = {
  minimalizm: "Минимализм",
  sovremennye: "Современный",
  skandinavskie: "Скандинавский",
  klassicheskie: "Классика",
  loft: "Лофт",
  provansskie: "Прованс",
};

const MATERIAL_LABELS: Record<string, string> = {
  mdf: "МДФ плёнка",
  plastik: "Пластик",
  emal: "Эмаль",
  shpon: "Шпон",
  massiv: "Массив",
};

type Lead = Awaited<ReturnType<typeof prisma.lead.findFirst>>;

function formatDate(d: Date) {
  return new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string }>;
}) {
  const sp = await searchParams;
  const statusFilter = sp.status && sp.status !== "all" ? sp.status : undefined;

  const leads = await prisma.lead.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: "desc" },
    take: 300,
  }).catch(() => []);

  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: { id: true },
  }).catch(() => []);

  const countMap: Record<string, number> = { all: leads.length };
  counts.forEach(c => { countMap[c.status] = c._count.id; });
  const total = counts.reduce((sum, c) => sum + c._count.id, 0);
  countMap.all = total;

  const hasConfig = (lead: NonNullable<Lead>) =>
    !!(lead.styleSlug || lead.materialSlug || lead.budgetLevel || lead.scenarioSlug || lead.configSessionId);

  const tabOptions = [
    { value: "all", label: "Все" },
    ...STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Заявки</h1>
        <span className="text-sm text-muted-foreground">{total} всего</span>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {tabOptions.map(tab => {
          const active = (statusFilter ?? "all") === tab.value;
          const cnt = countMap[tab.value] ?? 0;
          return (
            <a key={tab.value}
              href={`/admin/leads?status=${tab.value}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}>
              {tab.label}
              {cnt > 0 && <span className="ml-1.5 opacity-75">{cnt}</span>}
            </a>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <div className="card-base p-12 text-center">
          <p className="text-muted-foreground">Заявок нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="card-base p-4 hover:border-primary/20 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                {/* Left: Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-semibold text-sm text-foreground">{lead.name}</span>
                    </div>
                    <a href={`tel:${lead.phone}`}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                      <Phone className="w-3.5 h-3.5" />
                      {lead.phone}
                    </a>
                    {lead.city && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {lead.city}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" /> {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  {/* Source badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {FORM_TYPE_LABELS[lead.formType] ?? lead.formType}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {lead.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{lead.id}</span>
                  </div>

                  {/* Config details */}
                  {hasConfig(lead) && (
                    <div className="flex items-center gap-2 flex-wrap py-2 px-3 bg-primary/[0.04] rounded-xl border border-primary/10">
                      <Cpu className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {lead.styleSlug && (
                        <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-lg px-2 py-0.5">
                          <Palette className="w-3 h-3 text-violet-500" />
                          {STYLE_LABELS[lead.styleSlug] ?? lead.styleSlug}
                        </span>
                      )}
                      {lead.materialSlug && (
                        <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-lg px-2 py-0.5">
                          <Package className="w-3 h-3 text-amber-500" />
                          {MATERIAL_LABELS[lead.materialSlug] ?? lead.materialSlug}
                        </span>
                      )}
                      {lead.budgetLevel && (
                        <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-lg px-2 py-0.5">
                          <Wallet className="w-3 h-3 text-green-500" />
                          {BUDGET_LABELS[lead.budgetLevel] ?? lead.budgetLevel}
                        </span>
                      )}
                      {lead.scenarioSlug && (
                        <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-lg px-2 py-0.5">
                          <Route className="w-3 h-3 text-blue-500" />
                          {lead.scenarioSlug}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Comment */}
                  {lead.comment && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{lead.comment}</span>
                    </div>
                  )}

                  {/* Manager note */}
                  <div className="pt-1 border-t border-border/50">
                    <LeadNoteEditor leadId={lead.id} note={lead.managerNote} />
                  </div>
                </div>

                {/* Right: Status control */}
                <div className="flex flex-col items-end gap-2">
                  <LeadStatusControl
                    leadId={lead.id}
                    status={lead.status as any}
                  />
                  <a href={`tel:${lead.phone}`}
                    className="text-xs px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Позвонить
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
