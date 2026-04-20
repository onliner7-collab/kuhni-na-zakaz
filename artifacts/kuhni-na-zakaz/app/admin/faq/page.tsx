"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Pencil, Check, X, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  page: string;
  order: number;
}

const PAGE_OPTIONS = [
  { value: "home", label: "\u0413\u043b\u0430\u0432\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430" },
  { value: "catalog", label: "\u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u043a\u0443\u0445\u043e\u043d\u044c" },
  { value: "prices", label: "\u0426\u0435\u043d\u044b / \u043a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440" },
  { value: "warranty", label: "\u0413\u0430\u0440\u0430\u043d\u0442\u0438\u044f" },
  { value: "delivery", label: "\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0438 \u043c\u043e\u043d\u0442\u0430\u0436" },
  { value: "about", label: "\u041e \u043d\u0430\u0441" },
];

function pageLabel(v: string) {
  return PAGE_OPTIONS.find((p) => p.value === v)?.label ?? v;
}

function ItemRow({
  item,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  item: FAQItem;
  onSave: (updated: FAQItem) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/kapi/admin/faq/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: draft.question, answer: draft.answer, page: draft.page }),
      });
      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        setEditing(false);
        toast.success("\u0412\u043e\u043f\u0440\u043e\u0441 \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d");
      } else {
        toast.error("\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f");
      }
    } catch {
      toast.error("\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  if (editing) {
    return (
      <div className="border border-primary/30 rounded-xl p-4 bg-primary/[0.02] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">\u0412\u043e\u043f\u0440\u043e\u0441</label>
            <input
              className={inputCls}
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0432\u043e\u043f\u0440\u043e\u0441"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430</label>
            <select
              className={inputCls}
              value={draft.page}
              onChange={(e) => setDraft({ ...draft, page: e.target.value })}
            >
              {PAGE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">\u041e\u0442\u0432\u0435\u0442</label>
          <textarea
            className={inputCls}
            rows={4}
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u044b\u0439 \u043e\u0442\u0432\u0435\u0442"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !draft.question || !draft.answer}
            className="flex items-center gap-1.5 text-sm px-4 py-2 bg-primary text-white rounded-xl font-medium disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> {saving ? "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u2026" : "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"}
          </button>
          <button
            onClick={() => {
              setDraft(item);
              setEditing(false);
            }}
            className="flex items-center gap-1.5 text-sm px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted/50"
          >
            <X className="w-4 h-4" /> \u041e\u0442\u043c\u0435\u043d\u0430
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl hover:border-primary/20 transition-colors bg-white">
      <div className="flex items-start gap-3 p-4">
        <div className="flex flex-col gap-0.5 pt-0.5 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-0.5 text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-0.5 text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block text-xs font-medium text-primary bg-primary/10 rounded-lg px-2 py-0.5 mb-1.5">
                {pageLabel(item.page)}
              </span>
              <p className="font-semibold text-sm text-foreground">{item.question}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setDraft(item);
                  setEditing(true);
                }}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {expanded && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed border-t border-border/50 pt-2">
              {item.answer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const emptyItem = { question: "", answer: "", page: "home", order: 0 };

export default function AdminFAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageFilter, setPageFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ ...emptyItem });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/kapi/admin/faq")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = pageFilter === "all" ? items : items.filter((i) => i.page === pageFilter);

  const handleSave = (updated: FAQItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u044d\u0442\u043e\u0442 \u0432\u043e\u043f\u0440\u043e\u0441? \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043d\u0435\u043e\u0431\u0440\u0430\u0442\u0438\u043c\u043e.")) return;
    const res = await fetch(`/kapi/admin/faq/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("\u0412\u043e\u043f\u0440\u043e\u0441 \u0443\u0434\u0430\u043b\u0451\u043d");
    } else {
      toast.error("\u041e\u0448\u0438\u0431\u043a\u0430 \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f");
    }
  };

  const swapOrder = async (idx: number, direction: "up" | "down") => {
    const arr = [...filtered];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;

    const a = arr[idx];
    const b = arr[swapIdx];
    await Promise.all([
      fetch(`/kapi/admin/faq/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/kapi/admin/faq/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === a.id) return { ...i, order: b.order };
          if (i.id === b.id) return { ...i, order: a.order };
          return i;
        })
        .sort((x, y) => x.order - y.order || x.id - y.id),
    );
    toast.success("\u041f\u043e\u0440\u044f\u0434\u043e\u043a \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d");
  };

  const handleAdd = async () => {
    if (!newItem.question.trim() || !newItem.answer.trim()) {
      toast.error("\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0432\u043e\u043f\u0440\u043e\u0441 \u0438 \u043e\u0442\u0432\u0435\u0442");
      return;
    }
    setSaving(true);
    const maxOrder = items.filter((i) => i.page === newItem.page).reduce((m, i) => Math.max(m, i.order), -1);
    try {
      const res = await fetch("/kapi/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, order: maxOrder + 1 }),
      });
      if (res.ok) {
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        setNewItem({ ...emptyItem });
        setAdding(false);
        toast.success("\u0412\u043e\u043f\u0440\u043e\u0441 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d");
      } else {
        toast.error("\u041e\u0448\u0438\u0431\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f");
      }
    } catch {
      toast.error("\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0442\u0438");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
  const pageCounts: Record<string, number> = {};
  items.forEach((i) => {
    pageCounts[i.page] = (pageCounts[i.page] ?? 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-primary" /> FAQ — \u0412\u043e\u043f\u0440\u043e\u0441\u044b \u0438 \u043e\u0442\u0432\u0435\u0442\u044b
          </h1>
          <p className="text-muted-foreground mt-1">
            \u0412\u043e\u043f\u0440\u043e\u0441\u044b \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u044e\u0442\u0441\u044f \u043d\u0430 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0445 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u0445 \u0441\u0430\u0439\u0442\u0430. \u041c\u043e\u0436\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u043b\u044f\u0442\u044c, \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c, \u0443\u0434\u0430\u043b\u044f\u0442\u044c \u0438 \u043c\u0435\u043d\u044f\u0442\u044c \u043f\u043e\u0440\u044f\u0434\u043e\u043a.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432\u043e\u043f\u0440\u043e\u0441
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {[{ value: "all", label: "\u0412\u0441\u0435" }, ...PAGE_OPTIONS].map((p) => {
          const cnt = p.value === "all" ? items.length : (pageCounts[p.value] ?? 0);
          const active = pageFilter === p.value;
          return (
            <button
              key={p.value}
              onClick={() => setPageFilter(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {p.label}
              {cnt > 0 && <span className="ml-1.5 opacity-75">{cnt}</span>}
            </button>
          );
        })}
      </div>

      {adding && (
        <div className="border-2 border-primary/30 border-dashed rounded-xl p-5 bg-primary/[0.02] space-y-3">
          <h3 className="font-semibold text-sm text-primary">\u041d\u043e\u0432\u044b\u0439 \u0432\u043e\u043f\u0440\u043e\u0441</h3>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">\u0412\u043e\u043f\u0440\u043e\u0441 *</label>
              <input
                className={inputCls}
                value={newItem.question}
                onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                placeholder="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440: \u0421\u043a\u043e\u043b\u044c\u043a\u043e \u0441\u0442\u043e\u0438\u0442 \u043a\u0443\u0445\u043d\u044f \u043d\u0430 \u0437\u0430\u043a\u0430\u0437 \u0432 \u041c\u0438\u043d\u0441\u043a\u0435?"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 *</label>
              <select
                className={inputCls}
                value={newItem.page}
                onChange={(e) => setNewItem({ ...newItem, page: e.target.value })}
              >
                {PAGE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">\u041e\u0442\u0432\u0435\u0442 *</label>
            <textarea
              className={inputCls}
              rows={4}
              value={newItem.answer}
              onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
              placeholder="\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u044b\u0439 \u043e\u0442\u0432\u0435\u0442 \u043d\u0430 \u0432\u043e\u043f\u0440\u043e\u0441 \u043a\u043b\u0438\u0435\u043d\u0442\u0430"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving || !newItem.question || !newItem.answer}
              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-primary text-white rounded-xl font-semibold disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> {saving ? "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u2026" : "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c"}
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewItem({ ...emptyItem });
              }}
              className="flex items-center gap-1.5 text-sm px-4 py-2 border border-border rounded-xl text-muted-foreground hover:bg-muted/50"
            >
              <X className="w-4 h-4" /> \u041e\u0442\u043c\u0435\u043d\u0430
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430\u2026</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <HelpCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">\u0412\u043e\u043f\u0440\u043e\u0441\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442</p>
          <p className="text-muted-foreground text-xs mt-1">
            \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432\u043e\u043f\u0440\u043e\u0441\u00bb \u0447\u0442\u043e\u0431\u044b \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0435\u0440\u0432\u044b\u0439
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              onSave={handleSave}
              onDelete={() => handleDelete(item.id)}
              onMoveUp={() => swapOrder(idx, "up")}
              onMoveDown={() => swapOrder(idx, "down")}
              isFirst={idx === 0}
              isLast={idx === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
