"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Check, X, Eye, EyeOff } from "lucide-react";

interface Block {
  id: number; type: string; title: string; subtitle: string;
  description: string; icon: string; href: string; badge: string;
  order: number; published: boolean;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  scenario: { label: "Сценарий входа", color: "bg-violet-100 text-violet-700" },
  step: { label: "Шаг работы", color: "bg-blue-100 text-blue-700" },
  advantage: { label: "Преимущество", color: "bg-green-100 text-green-700" },
  trust: { label: "Доверие / цифра", color: "bg-amber-100 text-amber-700" },
};

const EMPTY: Omit<Block, "id"> = {
  type: "scenario", title: "", subtitle: "", description: "",
  icon: "🏠", href: "", badge: "", order: 0, published: true,
};

export default function AdminHomepagePage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Block | null>(null);
  const [adding, setAdding] = useState<typeof EMPTY | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/kapi/admin/homepage");
    if (res.ok) setBlocks(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/kapi/admin/homepage/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        });
        setEditing(null);
      } else if (adding) {
        await fetch("/kapi/admin/homepage", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adding),
        });
        setAdding(null);
      }
      await load();
    } finally { setSaving(false); }
  };

  const del = async (id: number, title: string) => {
    if (!confirm(`Удалить блок «${title}»?`)) return;
    await fetch(`/kapi/admin/homepage/${id}`, { method: "DELETE" });
    await load();
  };

  const toggle = async (b: Block) => {
    await fetch(`/kapi/admin/homepage/${b.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, published: !b.published }),
    });
    await load();
  };

  const filtered = filterType === "all" ? blocks : blocks.filter(b => b.type === filterType);
  const grouped = Object.entries(TYPE_LABELS).reduce((acc, [type]) => {
    acc[type] = blocks.filter(b => b.type === type);
    return acc;
  }, {} as Record<string, Block[]>);

  const inputCls = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1";

  const EditForm = ({ data, onChange }: { data: typeof EMPTY; onChange: (d: typeof EMPTY) => void }) => (
    <div className="space-y-3 pt-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Тип блока</label>
          <select className={inputCls} value={data.type} onChange={e => onChange({ ...data, type: e.target.value })}>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Порядок (число)</label>
          <input className={inputCls} type="number" value={data.order} onChange={e => onChange({ ...data, order: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Иконка (emoji)</label>
          <input className={inputCls} value={data.icon} onChange={e => onChange({ ...data, icon: e.target.value })} placeholder="🏠" />
        </div>
        <div>
          <label className={labelCls}>Заголовок *</label>
          <input className={inputCls} value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} placeholder="Подобрать кухню" />
        </div>
        <div>
          <label className={labelCls}>Подзаголовок</label>
          <input className={inputCls} value={data.subtitle} onChange={e => onChange({ ...data, subtitle: e.target.value })} placeholder="под образ жизни" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Описание</label>
        <textarea className={inputCls} rows={2} value={data.description} onChange={e => onChange({ ...data, description: e.target.value })} placeholder="Короткое пояснение для пользователя" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Ссылка (href)</label>
          <input className={inputCls} value={data.href} onChange={e => onChange({ ...data, href: e.target.value })} placeholder="/catalog" />
        </div>
        <div>
          <label className={labelCls}>Бейдж (необязательно)</label>
          <input className={inputCls} value={data.badge} onChange={e => onChange({ ...data, badge: e.target.value })} placeholder="Быстро" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={data.published} onChange={e => onChange({ ...data, published: e.target.checked })} className="rounded" />
        <span className="text-sm">Опубликован</span>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Главная страница</h1>
          <p className="text-muted-foreground mt-1 text-sm">Сценарии входа, шаги, преимущества, блоки доверия</p>
        </div>
        <button
          onClick={() => setAdding({ ...EMPTY })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />Добавить блок
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(TYPE_LABELS).map(([type, { label, color }]) => (
          <div key={type} className="bg-white rounded-xl border border-border p-4">
            <p className="text-2xl font-bold text-foreground">{grouped[type]?.length ?? 0}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
            <p className="text-xs text-muted-foreground mt-1">{grouped[type]?.filter(b => b.published).length ?? 0} опубликовано</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-2xl border-2 border-primary/30 p-6">
          <h3 className="font-semibold text-foreground mb-2">Новый блок</h3>
          <EditForm data={adding} onChange={setAdding} />
          <div className="flex gap-3 mt-4">
            <button onClick={save} disabled={saving || !adding.title} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50">
              {saving ? "Сохранение..." : "Создать"}
            </button>
            <button onClick={() => setAdding(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/50">Отмена</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-muted/30 rounded-xl p-1 border border-border overflow-x-auto">
        {[["all", "Все блоки"], ...Object.entries(TYPE_LABELS).map(([k, v]) => [k, v.label])].map(([type, label]) => (
          <button key={type} onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap font-medium transition-colors ${filterType === type ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >{label}</button>
        ))}
      </div>

      {/* Blocks list */}
      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(block => (
            <div key={block.id}>
              {editing?.id === block.id ? (
                <div className="bg-white rounded-2xl border-2 border-primary/30 p-5">
                  <EditForm data={editing} onChange={d => setEditing({ ...d, id: block.id })} />
                  <div className="flex gap-3 mt-4">
                    <button onClick={save} disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50">
                      {saving ? "..." : <><Check className="w-4 h-4 inline mr-1" />Сохранить</>}
                    </button>
                    <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted/50">
                      <X className="w-4 h-4 inline mr-1" />Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-border hover:border-primary/20 p-4 flex items-center gap-4 transition-colors">
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 cursor-grab" />
                  <span className="text-2xl w-8 text-center flex-shrink-0">{block.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-sm">{block.title}</span>
                      {block.subtitle && <span className="text-xs text-muted-foreground">{block.subtitle}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_LABELS[block.type]?.color ?? "bg-muted text-muted-foreground"}`}>
                        {TYPE_LABELS[block.type]?.label ?? block.type}
                      </span>
                      {block.badge && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{block.badge}</span>}
                      <span className="text-xs text-muted-foreground/60">#{block.order}</span>
                    </div>
                    {block.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{block.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggle(block)} title={block.published ? "Скрыть" : "Показать"}
                      className={`p-2 rounded-lg transition-colors ${block.published ? "text-green-600 hover:bg-green-50" : "text-muted-foreground hover:bg-muted"}`}>
                      {block.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setEditing(block)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => del(block.id, block.title)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Нет блоков этого типа</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
