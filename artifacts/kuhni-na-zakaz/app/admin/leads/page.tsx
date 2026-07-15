import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { STATUS_OPTIONS } from "@/lib/lead-status";
import { requireAdmin } from "@/lib/auth";
import { Phone, User, MapPin, Calendar, Cpu, Palette, Package, Wallet, Route, FileText, Search } from "lucide-react";

export const metadata: Metadata = { title: "\u0417\u0430\u044f\u0432\u043a\u0438 — \u041a\u0443\u0445\u043d\u0438BY" };

const FORM_TYPE_LABELS: Record<string, string> = {
  contact: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442",
  calculator: "\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440",
  catalog: "\u041a\u0430\u0442\u0430\u043b\u043e\u0433",
  portfolio: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e",
  blog: "\u0411\u043b\u043e\u0433",
  "": "\u0424\u043e\u0440\u043c\u0430",
};

const BUDGET_LABELS: Record<string, string> = {
  economy: "\u042d\u043a\u043e\u043d\u043e\u043c",
  standard: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442",
  comfort: "\u041a\u043e\u043c\u0444\u043e\u0440\u0442",
  premium: "\u041f\u0440\u0435\u043c\u0438\u0443\u043c",
};

const STYLE_LABELS: Record<string, string> = {
  minimalizm: "\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u0438\u0437\u043c",
  sovremennye: "\u0421\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0439",
  skandinavskie: "\u0421\u043a\u0430\u043d\u0434\u0438\u043d\u0430\u0432\u0441\u043a\u0438\u0439",
  klassicheskie: "\u041a\u043b\u0430\u0441\u0441\u0438\u043a\u0430",
  loft: "\u041b\u043e\u0444\u0442",
  provansskie: "\u041f\u0440\u043e\u0432\u0430\u043d\u0441",
};

const MATERIAL_LABELS: Record<string, string> = {
  mdf: "\u041c\u0414\u0424 \u043f\u043b\u0451\u043d\u043a\u0430",
  plastik: "\u041f\u043b\u0430\u0441\u0442\u0438\u043a",
  emal: "\u042d\u043c\u0430\u043b\u044c",
  shpon: "\u0428\u043f\u043e\u043d",
  massiv: "\u041c\u0430\u0441\u0441\u0438\u0432",
};

type Lead = Awaited<ReturnType<typeof prisma.lead.findFirst>>;

function formatDate(d: Date) {
  return new Date(d).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const statusFilter = sp.status && sp.status !== "all" ? sp.status : undefined;
  const searchQuery = sp.q?.trim() ?? "";

  const leads = await prisma.lead.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { phone: { contains: searchQuery } },
              { city: { contains: searchQuery, mode: "insensitive" } },
              { comment: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 300,
  }).catch(() => []);

  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: { id: true },
  }).catch(() => []);

  const countMap: Record<string, number> = {};
  counts.forEach((c) => {
    countMap[c.status] = c._count.id;
  });
  const total = counts.reduce((sum, c) => sum + c._count.id, 0);
  countMap.all = total;

  const hasConfig = (lead: NonNullable<Lead>) =>
    !!(lead.styleSlug || lead.materialSlug || lead.budgetLevel || lead.scenarioSlug || lead.configSessionId);

  const tabOptions = [
    { value: "all", label: "\u0412\u0441\u0435" },
    ...STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-3xl font-bold">\u0417\u0430\u044f\u0432\u043a\u0438</h1>
        <span className="text-sm text-muted-foreground">{total} \u0432\u0441\u0435\u0433\u043e</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <form method="GET" action="/admin/leads" className="relative flex-1 min-w-[220px] max-w-sm">
          <input type="hidden" name="status" value={sp.status ?? "all"} />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0438\u043c\u0435\u043d\u0438, \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0443, \u0433\u043e\u0440\u043e\u0434\u0443…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          />
        </form>
        {searchQuery && (
          <a
            href={`/admin/leads${statusFilter ? `?status=${statusFilter}` : ""}`}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            \u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u043e\u0438\u0441\u043a
          </a>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {tabOptions.map((tab) => {
          const active = (statusFilter ?? "all") === tab.value;
          const cnt = countMap[tab.value] ?? 0;
          const href = `/admin/leads?status=${tab.value}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`;
          return (
            <a
              key={tab.value}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
              {cnt > 0 && <span className="ml-1.5 opacity-75">{cnt}</span>}
            </a>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <div className="card-base p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? `\u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443 «${searchQuery}»` : "\u0417\u0430\u044f\u0432\u043e\u043a \u043d\u0435\u0442"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="card-base p-4 hover:border-primary/20 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-semibold text-sm text-foreground">{lead.name}</span>
                    </div>
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
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

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {FORM_TYPE_LABELS[lead.formType] ?? lead.formType}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {lead.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground">№{lead.publicNumber}</span>
                  </div>

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

                  {lead.comment && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{lead.comment}</span>
                    </div>
                  )}

                  {(lead.assignedTo || lead.managerNote) && (
                    <div className="space-y-1 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                      {lead.assignedTo && <p>Менеджер: {lead.assignedTo}</p>}
                      {lead.managerNote && <p>Старая заметка: {lead.managerNote}</p>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge className={STATUS_OPTIONS.find((item) => item.value === lead.status)?.color || ""}>
                    {STATUS_OPTIONS.find((item) => item.value === lead.status)?.label || lead.status}
                  </Badge>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-xs px-3 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> \u041f\u043e\u0437\u0432\u043e\u043d\u0438\u0442\u044c
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
