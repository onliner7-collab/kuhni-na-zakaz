"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Trash2, Plus, X, Globe, Eye } from "lucide-react";

interface Feature { icon: string; title: string; description: string; }

interface ScenarioData {
  id?: number;
  slug: string;
  icon: string;
  badge: string;
  title: string;
  headline: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  needs: string[];
  solutions: string[];
  features: Feature[];
  tips: string[];
  relatedStyles: string[];
  relatedMaterials: string[];
  relatedCaseSlugs: string[];
  ctaText: string;
  ctaHref: string;
  order: number;
  published: boolean;
}

const EMPTY: ScenarioData = {
  slug: "", icon: "🏠", badge: "", title: "", headline: "", intro: "",
  seoTitle: "", seoDescription: "", seoKeywords: "",
  needs: [""], solutions: [""], features: [{ icon: "✅", title: "", description: "" }],
  tips: [""], relatedStyles: [""], relatedMaterials: [""], relatedCaseSlugs: [""],
  ctaText: "Заказать замер", ctaHref: "/contacts#form", order: 0, published: true,
};

const TABS = [
  { id: "main", label: "Основное" },
  { id: "content", label: "Контент" },
  { id: "relations", label: "Связи" },
  { id: "seo", label: "SEO" },
];

const inputCls = "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors";
const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5";
const textareaCls = `${inputCls} resize-none`;

function TagListEditor({
  label, items, onChange, placeholder,
}: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const update = (i: number, v: string) => { const n = [...items]; n[i] = v; onChange(n); };
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={labelCls.replace("mb-1.5", "")}>{label}</label>
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Plus className="w-3 h-3" />Добавить
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls} value={item} placeholder={placeholder} onChange={e => update(i, e.target.value)} />
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesEditor({ features, onChange }: { features: Feature[]; onChange: (f: Feature[]) => void }) {
  const update = (i: number, key: keyof Feature, v: string) => {
    const n = [...features]; n[i] = { ...n[i], [key]: v }; onChange(n);
  };
  const add = () => onChange([...features, { icon: "✅", title: "", description: "" }]);
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={labelCls.replace("mb-1.5", "")}>Ключевые особенности (карточки)</label>
        <button type="button" onClick={add} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Plus className="w-3 h-3" />Добавить
        </button>
      </div>
      <div className="space-y-3">
        {features.map((f, i) => (
          <div key={i} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
            <div className="flex gap-2 items-start">
              <input className={`${inputCls} w-16 text-center text-lg`} value={f.icon} onChange={e => update(i, "icon", e.target.value)} placeholder="✅" />
              <input className={`${inputCls} flex-1`} value={f.title} onChange={e => update(i, "title", e.target.value)} placeholder="Заголовок особенности" />
              {features.length > 1 && (
                <button type="button" onClick={() => remove(i)} className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <textarea className={textareaCls} rows={2} value={f.description} onChange={e => update(i, "description", e.target.value)} placeholder="Описание особенности..." />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScenarioForm({ initial }: { initial?: Partial<ScenarioData> }) {
  const [data, setData] = useState<ScenarioData>({ ...EMPTY, ...initial });
  const [tab, setTab] = useState("main");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const set = (key: keyof ScenarioData, value: any) => setData(d => ({ ...d, [key]: value }));

  const save = async () => {
    if (!data.title || !data.slug) { toast.error("Заполните название и slug"); return; }
    setSaving(true);
    try {
      const payload = {
        ...data,
        needs: data.needs.filter(Boolean),
        solutions: data.solutions.filter(Boolean),
        tips: data.tips.filter(Boolean),
        relatedStyles: data.relatedStyles.filter(Boolean),
        relatedMaterials: data.relatedMaterials.filter(Boolean),
        relatedCaseSlugs: data.relatedCaseSlugs.filter(Boolean),
        features: data.features.filter(f => f.title),
      };
      const url = data.id ? `/kapi/admin/scenarios/${data.id}` : "/kapi/admin/scenarios";
      const method = data.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Ошибка сохранения"); }
      const saved = await res.json();
      toast.success("Сценарий сохранён");
      router.push("/admin/scenarios");
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  const del = async () => {
    if (!data.id) return;
    if (!confirm(`Удалить сценарий «${data.title}»? Это действие необратимо.`)) return;
    setDeleting(true);
    try {
      await fetch(`/kapi/admin/scenarios/${data.id}`, { method: "DELETE" });
      toast.success("Сценарий удалён");
      router.push("/admin/scenarios");
    } catch { toast.error("Ошибка удаления"); }
    finally { setDeleting(false); }
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[а-яё]/g, (ch) => {
      const map: Record<string, string> = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
      return map[ch] ?? ch;
    }).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl">{data.icon || "🏠"}</span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{data.title || "Новый сценарий"}</h1>
            {data.slug && <p className="text-xs text-muted-foreground font-mono">/scenarios/{data.slug}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {data.id && data.slug && (
            <a href={`/scenarios/${data.slug}`} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg border border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Открыть страницу">
              <Globe className="w-4 h-4" />
            </a>
          )}
          {data.id && (
            <button onClick={del} disabled={deleting}
              className="p-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" title="Удалить">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors text-sm">
            <input type="checkbox" checked={data.published} onChange={e => set("published", e.target.checked)} className="rounded" />
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span>{data.published ? "Опубликован" : "Скрыт"}</span>
          </label>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 rounded-xl p-1 border border-border">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Main */}
      {tab === "main" && (
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Иконка (emoji)</label>
              <input className={`${inputCls} text-2xl text-center`} value={data.icon} onChange={e => set("icon", e.target.value)} placeholder="🏠" />
            </div>
            <div>
              <label className={labelCls}>Slug (URL)</label>
              <input className={inputCls} value={data.slug} placeholder="semya-s-detmi"
                onChange={e => set("slug", e.target.value)}
                onBlur={e => { if (!data.slug && data.title) set("slug", autoSlug(data.title)); }} />
            </div>
            <div>
              <label className={labelCls}>Бейдж (необязательно)</label>
              <input className={inputCls} value={data.badge} onChange={e => set("badge", e.target.value)} placeholder="Популярный" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Название сценария * (H2 на главной)</label>
            <input className={inputCls} value={data.title} onChange={e => {
              set("title", e.target.value);
              if (!data.slug) set("slug", autoSlug(e.target.value));
            }} placeholder="Кухня для семьи с детьми" />
          </div>
          <div>
            <label className={labelCls}>Заголовок H1 страницы сценария</label>
            <input className={inputCls} value={data.headline} onChange={e => set("headline", e.target.value)} placeholder="Кухня, где безопасно готовить и приятно собираться всей семьёй" />
          </div>
          <div>
            <label className={labelCls}>Вводный текст (intro)</label>
            <textarea className={textareaCls} rows={4} value={data.intro} onChange={e => set("intro", e.target.value)} placeholder="Развёрнутое описание для кого эта кухня и почему..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Текст CTA-кнопки</label>
              <input className={inputCls} value={data.ctaText} onChange={e => set("ctaText", e.target.value)} placeholder="Заказать замер" />
            </div>
            <div>
              <label className={labelCls}>Ссылка CTA</label>
              <input className={inputCls} value={data.ctaHref} onChange={e => set("ctaHref", e.target.value)} placeholder="/contacts#form" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Порядок отображения (число)</label>
            <input className={inputCls} type="number" value={data.order} onChange={e => set("order", parseInt(e.target.value) || 0)} />
          </div>
        </div>
      )}

      {/* Tab: Content */}
      {tab === "content" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border p-6">
            <TagListEditor
              label="Ключевые потребности покупателя"
              items={data.needs}
              onChange={v => set("needs", v)}
              placeholder="Например: Безопасные углы без острых кромок"
            />
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <TagListEditor
              label="Рекомендуемые решения"
              items={data.solutions}
              onChange={v => set("solutions", v)}
              placeholder="Например: Фасады МДФ с плёнкой — гладкие, легко моются"
            />
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <FeaturesEditor features={data.features} onChange={v => set("features", v)} />
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <TagListEditor
              label="Советы и лайфхаки"
              items={data.tips}
              onChange={v => set("tips", v)}
              placeholder="Например: Выбирайте матовые фасады — меньше отпечатков"
            />
          </div>
        </div>
      )}

      {/* Tab: Relations */}
      {tab === "relations" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border p-6">
            <TagListEditor
              label="Связанные стили (slug'и страниц стилей)"
              items={data.relatedStyles}
              onChange={v => set("relatedStyles", v)}
              placeholder="Например: sovremennye"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Slug из раздела /styles/[slug]. Пример: sovremennye, klassicheskie, skandinavskie, minimalizm, loft
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <TagListEditor
              label="Связанные материалы (slug'и страниц материалов)"
              items={data.relatedMaterials}
              onChange={v => set("relatedMaterials", v)}
              placeholder="Например: mdf"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Slug из раздела /materials/[slug]. Пример: mdf, ldsp, iskusstvennyy-kamen, shpon, derevo
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <TagListEditor
              label="Связанные кейсы (slug'и портфолио)"
              items={data.relatedCaseSlugs}
              onChange={v => set("relatedCaseSlugs", v)}
              placeholder="Например: kuhnya-dlya-semi-ivanovykh"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Slug из раздела /portfolio/[slug]. Свяжите реальные проекты с этим сценарием.
            </p>
          </div>
        </div>
      )}

      {/* Tab: SEO */}
      {tab === "seo" && (
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <div>
            <label className={labelCls}>SEO Title (title тег)</label>
            <input className={inputCls} value={data.seoTitle} onChange={e => set("seoTitle", e.target.value)}
              placeholder="Кухня для семьи с детьми на заказ — безопасно, практично | КухниBY" />
            <p className="text-xs text-muted-foreground mt-1">Оптимально: 55–70 символов. Сейчас: {data.seoTitle.length}</p>
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea className={textareaCls} rows={3} value={data.seoDescription} onChange={e => set("seoDescription", e.target.value)}
              placeholder="Кухни на заказ для семей с детьми: безопасные материалы, вместительное хранение. Производим по всей Беларуси." />
            <p className="text-xs text-muted-foreground mt-1">Оптимально: 120–160 символов. Сейчас: {data.seoDescription.length}</p>
          </div>
          <div>
            <label className={labelCls}>Ключевые слова (Keywords)</label>
            <input className={inputCls} value={data.seoKeywords} onChange={e => set("seoKeywords", e.target.value)}
              placeholder="кухня для семьи с детьми, безопасная кухня Беларусь" />
          </div>
          <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Превью в поиске</p>
            <p className="text-blue-600 text-sm font-medium">{data.seoTitle || data.title || "Название сценария"}</p>
            <p className="text-green-700 text-xs">kuhni.minsk.by › scenarios › {data.slug || "slug"}</p>
            <p className="text-muted-foreground text-sm mt-1">{data.seoDescription || data.intro.slice(0, 155) || "Описание страницы..."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
