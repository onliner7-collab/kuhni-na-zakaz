"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STYLES = ["Современный", "Классический", "Скандинавский", "Лофт", "Минимализм", "Прованс"];
const STYLE_SLUGS: Record<string, string> = {
  "Современный": "sovremennye", "Классический": "klassicheskie",
  "Скандинавский": "skandinavskie", "Лофт": "loft", "Минимализм": "minimalizm",
};
const LAYOUTS = ["Прямая", "Угловая", "П-образная", "Г-образная", "С островом", "Прямая + остров"];
const MATERIALS_MAP = [
  { label: "МДФ плёнка ПВХ", slug: "mdf" },
  { label: "Пластик HPL / акрил", slug: "plastik" },
  { label: "Эмаль матовая / глянец", slug: "emal" },
  { label: "Натуральный шпон", slug: "shpon" },
  { label: "ЛДСП EGGER", slug: "egger" },
];
const SCENARIOS = [
  { label: "Семья с детьми", slug: "semya-s-detmi" },
  { label: "Маленькая кухня", slug: "malenkaya-kukhnya" },
  { label: "Кухня-гостиная", slug: "kukhnya-gostinaya" },
  { label: "Для тех, кто любит готовить", slug: "lyublyu-gotovit" },
  { label: "Без переплаты", slug: "bez-pereplaty" },
  { label: "Максимум хранения", slug: "maksimum-khraneniya" },
];
const TABS = ["Основное", "История проекта", "Фото", "SEO"];

interface CaseData {
  id?: number;
  title: string; slug: string; city: string; region: string;
  area: number; layout: string; completedAt: string;
  style: string; styleSlug: string; material: string; materialSlugs: string[];
  scenarioSlugs: string[];
  priceFrom: number; priceTo: number; days: number;
  description: string; task: string; constraints: string; solution: string; result: string;
  mainImage: string; images: string[]; photosBefore: string[]; photosAfter: string[];
  featured: boolean; order: number; published: boolean;
  seoTitle: string; seoDescription: string; seoKeywords: string;
}

function generateSlug(title: string) {
  const map: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"j",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
  };
  return title.toLowerCase().replace(/[а-яё]/g, c => map[c] ?? c).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ArrayUrlField({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  const [input, setInput] = useState("");
  const isValidUrl = (v: string) => v.startsWith("http://") || v.startsWith("https://");
  const add = () => {
    const v = input.trim();
    if (v) { onChange([...value, v]); setInput(""); }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div className="flex gap-2 mb-3">
        <input
          className={`form-input flex-1 text-sm font-mono ${input && !isValidUrl(input) ? "border-red-300 focus:ring-red-200" : ""}`}
          value={input} onChange={e => setInput(e.target.value)} type="url"
          placeholder="https://example.com/photo.jpg"
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} />
        <button type="button" onClick={add} className="px-3 py-2 bg-primary text-white rounded-lg text-sm shrink-0">+ Добавить</button>
      </div>
      {input && !isValidUrl(input) && (
        <p className="text-xs text-red-500 mb-2">URL должен начинаться с https://</p>
      )}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
              <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover"
                onError={e => { (e.currentTarget.style.opacity = "0.2"); }} />
              {i === 0 && <span className="absolute top-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded font-medium">1</span>}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs truncate block">{url.split("/").pop()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {value.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-lg h-20 flex items-center justify-center bg-gray-50">
          <span className="text-xs text-gray-400">Фото пока не добавлены</span>
        </div>
      )}
    </div>
  );
}

const EMPTY: CaseData = {
  title: "", slug: "", city: "Минск", region: "Минск", area: 12, layout: "Угловая", completedAt: "",
  style: "Современный", styleSlug: "sovremennye", material: "МДФ плёнка ПВХ", materialSlugs: ["mdf"],
  scenarioSlugs: [], priceFrom: 0, priceTo: 0, days: 21, description: "", task: "",
  constraints: "", solution: "", result: "", mainImage: "", images: [], photosBefore: [], photosAfter: [],
  featured: false, order: 0, published: true, seoTitle: "", seoDescription: "", seoKeywords: "",
};

interface Props { portfolioCase?: Partial<CaseData> }

export function PortfolioCaseForm({ portfolioCase }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<CaseData>({ ...EMPTY, ...portfolioCase });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof CaseData, v: any) => setForm(f => ({ ...f, [k]: v }));

  function toggleMaterial(slug: string, label: string) {
    if (form.materialSlugs.includes(slug)) {
      set("materialSlugs", form.materialSlugs.filter(s => s !== slug));
    } else {
      set("materialSlugs", [...form.materialSlugs, slug]);
      if (!form.material) set("material", label);
    }
  }

  function toggleScenario(slug: string) {
    set("scenarioSlugs", form.scenarioSlugs.includes(slug)
      ? form.scenarioSlugs.filter(s => s !== slug)
      : [...form.scenarioSlugs, slug]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = form.id ? `/kapi/admin/portfolio/${form.id}` : "/kapi/admin/portfolio";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, area: Number(form.area), priceFrom: Number(form.priceFrom), priceTo: Number(form.priceTo), days: Number(form.days) }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Ошибка"); }
      toast.success(form.id ? "Проект обновлён" : "Проект создан");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!form.id || !confirm("Удалить проект? Это действие необратимо.")) return;
    try {
      await fetch(`/kapi/admin/portfolio/${form.id}`, { method: "DELETE" });
      router.push("/admin/portfolio");
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="portfolio-case-form">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-1">
        {TABS.map((t, i) => (
          <button key={t} type="button" onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === i ? "bg-white border border-b-white border-gray-200 text-primary -mb-px" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0: Основное */}
      {tab === 0 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название проекта *</label>
              <input className="form-input w-full" value={form.title} required
                onChange={e => { const t = e.target.value; set("title", t); if (!form.id) set("slug", generateSlug(t)); }}
                placeholder="Угловая кухня в стиле минимализм" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (slug) *</label>
              <input className="form-input w-full font-mono text-sm" value={form.slug} required
                onChange={e => set("slug", e.target.value)} placeholder="uglovaya-kuhnya-minimalizm" />
              <p className="text-xs text-gray-400 mt-1">/portfolio/{form.slug || "slug"}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Город *</label>
              <input className="form-input w-full" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Минск" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Регион / область</label>
              <input className="form-input w-full" value={form.region} onChange={e => set("region", e.target.value)} placeholder="Минская область" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата завершения</label>
              <input className="form-input w-full" value={form.completedAt} onChange={e => set("completedAt", e.target.value)} placeholder="Март 2025" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Площадь (м²)</label>
              <input className="form-input w-full" type="number" min={1} value={form.area} onChange={e => set("area", Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Планировка</label>
              <select className="form-input w-full" value={form.layout} onChange={e => set("layout", e.target.value)}>
                <option value="">— выберите —</option>
                {LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок выполнения (дней)</label>
              <input className="form-input w-full" type="number" min={1} value={form.days} onChange={e => set("days", Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость от (BYN)</label>
              <input className="form-input w-full" type="number" min={0} value={form.priceFrom} onChange={e => set("priceFrom", Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость до (BYN)</label>
              <input className="form-input w-full" type="number" min={0} value={form.priceTo} onChange={e => set("priceTo", Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Стиль кухни</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button key={s} type="button" onClick={() => { set("style", s); set("styleSlug", STYLE_SLUGS[s] || ""); }}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.style === s ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Материалы фасадов</label>
            <div className="flex flex-wrap gap-2">
              {MATERIALS_MAP.map(m => (
                <button key={m.slug} type="button" onClick={() => toggleMaterial(m.slug, m.label)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.materialSlugs.includes(m.slug) ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Сценарии (ситуации заказчика)</label>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map(s => (
                <button key={s.slug} type="button" onClick={() => toggleScenario(s.slug)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.scenarioSlugs.includes(s.slug) ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание проекта</label>
            <textarea className="form-input w-full" rows={3} value={form.description}
              onChange={e => set("description", e.target.value)} placeholder="2-3 предложения о проекте — для карточки в каталоге" />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-gray-700">Опубликован</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
              <span className="text-sm text-gray-700">Показать на главной</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Порядок:</label>
              <input className="form-input w-20" type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: История проекта */}
      {tab === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
            Рассказывайте как о реальном человеке и реальной истории — это лучше продаёт, чем технические описания.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Задача клиента</label>
            <p className="text-xs text-gray-400 mb-1">Что клиент хотел получить? Чего боялся?</p>
            <textarea className="form-input w-full" rows={4} value={form.task}
              onChange={e => set("task", e.target.value)} placeholder="Разместить максимум хранения на угловой кухне 14 м² без ощущения тесноты..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ограничения проекта</label>
            <p className="text-xs text-gray-400 mb-1">Низкий потолок, нестандартный угол, бюджетные ограничения...</p>
            <textarea className="form-input w-full" rows={3} value={form.constraints}
              onChange={e => set("constraints", e.target.value)} placeholder="Низкий потолок 2,55 м. Радиатор у окна — нельзя делать столешницу у подоконника..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Наше решение</label>
            <p className="text-xs text-gray-400 mb-1">Как конкретно решили каждое ограничение?</p>
            <textarea className="form-input w-full" rows={4} value={form.solution}
              onChange={e => set("solution", e.target.value)} placeholder="Закрытые фасады до потолка в матовой эмали, встроенная техника, скрытые ручки..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Результат</label>
            <p className="text-xs text-gray-400 mb-1">Что в итоге получил клиент? Конкретные цифры. Реакция клиента.</p>
            <textarea className="form-input w-full" rows={4} value={form.result}
              onChange={e => set("result", e.target.value)} placeholder="Клиент получил 4,8 погонных метра фасадов, встроенную технику и оставил 5-звёздочный отзыв..." />
          </div>
        </div>
      )}

      {/* Tab 2: Фото */}
      {tab === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Главное фото (превью карточки)</label>
            <p className="text-xs text-gray-400 mb-1">Отображается в каталоге — подбирайте широкоформатное фото</p>
            <input className="form-input w-full font-mono text-sm" type="url" value={form.mainImage} onChange={e => set("mainImage", e.target.value)} placeholder="https://example.com/kitchen-main.jpg" />
            {form.mainImage ? (
              <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                <img src={form.mainImage} alt="Главное фото" className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget.parentElement!.style.display = "none"); }} />
                <span className="absolute top-1.5 left-1.5 text-xs bg-primary text-white px-2 py-0.5 rounded font-medium">Обложка</span>
              </div>
            ) : (
              <div className="mt-2 rounded-lg border-2 border-dashed border-gray-200 h-28 flex items-center justify-center bg-gray-50">
                <span className="text-xs text-gray-400">Превью появится после вставки URL</span>
              </div>
            )}
          </div>
          <ArrayUrlField label="Галерея готовой кухни" value={form.images} onChange={v => set("images", v)}
            hint="Фото результата — показываются в галерее на странице проекта" />
          <ArrayUrlField label="Фото ДО" value={form.photosBefore} onChange={v => set("photosBefore", v)}
            hint="Исходное состояние кухни до начала работ" />
          <ArrayUrlField label="Фото ПОСЛЕ" value={form.photosAfter} onChange={v => set("photosAfter", v)}
            hint="Результат — те же ракурсы что и до, для сравнения" />
        </div>
      )}

      {/* Tab 3: SEO */}
      {tab === 3 && (
        <div className="space-y-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Превью в поиске Google</p>
            <p className="text-blue-700 text-sm font-medium">{form.seoTitle || form.title || "SEO заголовок"}</p>
            <p className="text-green-700 text-xs">{`kuhniby.by/portfolio/${form.slug}`}</p>
            <p className="text-gray-600 text-xs mt-1">{form.seoDescription || form.description || "SEO описание"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO заголовок (title)</label>
            <input className="form-input w-full" value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)}
              placeholder="Угловая кухня в минимализме 14 м² в Минске — кейс КухниBY" />
            <p className="text-xs text-gray-400 mt-1">{form.seoTitle.length}/60 символов</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO описание (description)</label>
            <textarea className="form-input w-full" rows={3} value={form.seoDescription}
              onChange={e => set("seoDescription", e.target.value)} placeholder="Реализованный проект угловой кухни в стиле минимализм..." />
            <p className="text-xs text-gray-400 mt-1">{form.seoDescription.length}/160 символов</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
            <input className="form-input w-full" value={form.seoKeywords} onChange={e => set("seoKeywords", e.target.value)}
              placeholder="угловая кухня минимализм Минск, кухня на заказ" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        {form.id ? (
          <button type="button" onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
            Удалить проект
          </button>
        ) : <div />}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/admin/portfolio")}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Отмена
          </button>
          <button type="submit" data-testid="btn-save-case" disabled={loading}
            className="px-6 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {loading ? "Сохранение..." : form.id ? "Сохранить изменения" : "Создать проект"}
          </button>
        </div>
      </div>
    </form>
  );
}
