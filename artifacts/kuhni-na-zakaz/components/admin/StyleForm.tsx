"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STYLE_UPLOAD_ENDPOINT = "/kapi/admin/uploads/styles";

const BUDGET_LEVELS = ["Экономный", "Средний", "Выше среднего", "Премиум"];
const TABS = ["Основное", "Контент", "Связи", "SEO"];

interface StyleData {
  id?: number;
  slug: string;
  title: string;
  headline: string;
  description: string;
  intro: string;
  content: string;
  suitableFor: string[];
  pros: string[];
  cons: string[];
  careGuide: string[];
  pairsWith: string[];
  budgetLevel: string;
  priceFrom: number;
  image: string;
  relatedMaterials: string[];
  relatedCaseSlugs: string[];
  relatedScenarioSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  order: number;
  published: boolean;
}

function ArrayField({
  label, value, onChange, placeholder,
}: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) { onChange([...value, v]); setInput(""); }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input className="form-input flex-1 text-sm" value={input} onChange={e => setInput(e.target.value)}
          placeholder={placeholder || "Введите значение"} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} />
        <button type="button" onClick={add} className="px-3 py-2 bg-primary text-white rounded-lg text-sm">+</button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((v, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs">
              {v}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 ml-1">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY: StyleData = {
  slug: "", title: "", headline: "", description: "", intro: "", content: "",
  suitableFor: [], pros: [], cons: [], careGuide: [], pairsWith: [],
  budgetLevel: "Средний", priceFrom: 2000, image: "",
  relatedMaterials: [], relatedCaseSlugs: [], relatedScenarioSlugs: [],
  seoTitle: "", seoDescription: "", seoKeywords: "", order: 0, published: true,
};

export default function StyleForm({ initial }: { initial?: Partial<StyleData> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<StyleData>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof StyleData, v: any) => setData(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(STYLE_UPLOAD_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Не удалось загрузить изображение");

      set("image", payload.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingImage(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!data.image) return;

    setRemovingImage(true);
    setError("");

    try {
      if (data.image.startsWith("/uploads/styles/")) {
        const res = await fetch(STYLE_UPLOAD_ENDPOINT, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imagePath: data.image }),
        });

        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || "Не удалось удалить изображение");
      }

      set("image", "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRemovingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const method = data.id ? "PUT" : "POST";
      const url = data.id ? `/kapi/admin/styles/${data.id}` : "/kapi/admin/styles";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Ошибка сохранения"); }
      router.push("/admin/styles");
      router.refresh();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!data.id || !confirm("Удалить стиль? Это действие необратимо.")) return;
    setDeleting(true);
    try {
      await fetch(`/kapi/admin/styles/${data.id}`, { method: "DELETE" });
      router.push("/admin/styles");
    } catch (e: any) { setError(e.message); }
    finally { setDeleting(false); }
  };

  return (
    <div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
              <input className="form-input w-full" value={data.slug} onChange={e => set("slug", e.target.value)} placeholder="sovremennye" />
              <p className="text-xs text-gray-400 mt-1">/styles/{data.slug || "slug"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
              <input className="form-input w-full" type="number" value={data.order} onChange={e => set("order", Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название (для каталога) *</label>
            <input className="form-input w-full" value={data.title} onChange={e => set("title", e.target.value)} placeholder="Современные кухни на заказ" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок страницы (H1)</label>
            <input className="form-input w-full" value={data.headline} onChange={e => set("headline", e.target.value)} placeholder="Современная кухня — функциональность как главная ценность" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание (для карточки)</label>
            <textarea className="form-input w-full" rows={2} value={data.description} onChange={e => set("description", e.target.value)} placeholder="Короткое описание для карточки в каталоге" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Бюджетный уровень</label>
              <select className="form-input w-full" value={data.budgetLevel} onChange={e => set("budgetLevel", e.target.value)}>
                {BUDGET_LEVELS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена от (BYN)</label>
              <input className="form-input w-full" type="number" value={data.priceFrom} onChange={e => set("priceFrom", Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на изображение стиля</label>
            <p className="text-xs text-gray-400 mb-1">Главное фото — отображается на карточке и странице стиля</p>
            <div className="mb-2 flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {uploadingImage ? "Загрузка..." : "Загрузить фото"}
              </button>
              {data.image ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={removingImage}
                  className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {removingImage ? "Удаление..." : "Удалить фото"}
                </button>
              ) : null}
            </div>
            <input className="form-input w-full font-mono text-sm" type="text" value={data.image} onChange={e => set("image", e.target.value)} placeholder="https://example.com/style-photo.jpg" />
            <p className="text-xs text-gray-400 mt-1">Можно загрузить файл в админке или вставить прямую ссылку/локальный путь вида /uploads/styles/...</p>
            {data.image ? (
              <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                <img
                  src={data.image}
                  alt="Превью"
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={e => {
                    e.currentTarget.parentElement!.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="mt-2 rounded-lg border-2 border-dashed border-gray-200 h-28 flex items-center justify-center bg-gray-50">
                <span className="text-xs text-gray-400">Превью появится после вставки URL</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="pub" checked={data.published} onChange={e => set("published", e.target.checked)} className="w-4 h-4 accent-primary" />
            <label htmlFor="pub" className="text-sm font-medium text-gray-700">Опубликован</label>
          </div>
        </div>
      )}

      {/* Tab 1: Контент */}
      {tab === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Вводный абзац</label>
            <textarea className="form-input w-full" rows={4} value={data.intro} onChange={e => set("intro", e.target.value)} placeholder="Развёрнутое вступление — 3-4 предложения о стиле" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Основной текст</label>
            <textarea className="form-input w-full" rows={5} value={data.content} onChange={e => set("content", e.target.value)} placeholder="Дополнительный текстовый контент" />
          </div>
          <ArrayField label="Кому подходит" value={data.suitableFor} onChange={v => set("suitableFor", v)} placeholder="Напр: Семьям с детьми — светло и просторно" />
          <ArrayField label="Плюсы" value={data.pros} onChange={v => set("pros", v)} placeholder="Напр: Лёгкая уборка — нет декора и выступов" />
          <ArrayField label="Минусы" value={data.cons} onChange={v => set("cons", v)} placeholder="Напр: Требует идеального монтажа" />
          <ArrayField label="Советы по уходу" value={data.careGuide} onChange={v => set("careGuide", v)} placeholder="Напр: Матовые фасады протирать мягкой тканью" />
          <ArrayField label="Сочетается с материалами" value={data.pairsWith} onChange={v => set("pairsWith", v)} placeholder="Напр: МДФ с матовой плёнкой" />
        </div>
      )}

      {/* Tab 2: Связи */}
      {tab === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">Вводите slug через Enter или нажмите «+». Slug должен совпадать с реальными записями.</p>
          <ArrayField label="Связанные материалы (slug)" value={data.relatedMaterials} onChange={v => set("relatedMaterials", v)} placeholder="mdf, emal, shpon..." />
          <ArrayField label="Связанные сценарии (slug)" value={data.relatedScenarioSlugs} onChange={v => set("relatedScenarioSlugs", v)} placeholder="semya-s-detmi, kukhnya-gostinaya..." />
          <ArrayField label="Связанные кейсы портфолио (slug)" value={data.relatedCaseSlugs} onChange={v => set("relatedCaseSlugs", v)} placeholder="slug кейса из портфолио" />
        </div>
      )}

      {/* Tab 3: SEO */}
      {tab === 3 && (
        <div className="space-y-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Превью в поиске</p>
            <p className="text-blue-700 text-sm font-medium">{data.seoTitle || data.title || "SEO заголовок"}</p>
            <p className="text-green-700 text-xs">{`kuhni.minsk.by/styles/${data.slug}`}</p>
            <p className="text-gray-600 text-xs mt-1">{data.seoDescription || data.description || "SEO описание"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO заголовок (title)</label>
            <input className="form-input w-full" value={data.seoTitle} onChange={e => set("seoTitle", e.target.value)} placeholder="Современные кухни на заказ — от 1 800 BYN | КухниBY" />
            <p className="text-xs text-gray-400 mt-1">{data.seoTitle.length}/60 символов</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO описание (description)</label>
            <textarea className="form-input w-full" rows={3} value={data.seoDescription} onChange={e => set("seoDescription", e.target.value)} placeholder="Современный стиль кухни на заказ: встроенная техника, скрытые ручки..." />
            <p className="text-xs text-gray-400 mt-1">{data.seoDescription.length}/160 символов</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
            <input className="form-input w-full" value={data.seoKeywords} onChange={e => set("seoKeywords", e.target.value)} placeholder="современные кухни на заказ, кухня современный стиль Беларусь" />
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        {data.id ? (
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">
            {deleting ? "Удаление..." : "Удалить стиль"}
          </button>
        ) : <div />}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/admin/styles")}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Отмена
          </button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {saving ? "Сохранение..." : data.id ? "Сохранить изменения" : "Создать стиль"}
          </button>
        </div>
      </div>
    </div>
  );
}
