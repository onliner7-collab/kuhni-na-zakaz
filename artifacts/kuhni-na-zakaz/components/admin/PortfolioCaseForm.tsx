"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STYLES = ["Современный", "Классический", "Скандинавский", "Лофт", "Минимализм", "Прованс"];
const STYLE_SLUGS: Record<string, string> = {
  Современный: "sovremennye",
  Классический: "klassicheskie",
  Скандинавский: "skandinavskie",
  Лофт: "loft",
  Минимализм: "minimalizm",
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
  title: string; shortTitle: string; slug: string; city: string; cityKey: string; region: string; district: string;
  area: number; layout: string; kitchenType: string; color: string; completedAt: string;
  style: string; styleSlug: string; material: string; materials: string[]; materialSlugs: string[];
  scenarioSlugs: string[];
  priceFrom: number; priceTo: number; priceNote: string; size: string; facades: string; countertop: string; fittings: string; workDuration: string; days: number;
  description: string; task: string; constraints: string; solution: string; result: string;
  features: string[]; relatedLocationSlugs: string[];
  mainImage: string; images: string[]; imageAlts: string[]; imageCaptions: string[]; alt: string; photosBefore: string[]; photosAfter: string[];
  featured: boolean; order: number; published: boolean;
  seoTitle: string; seoDescription: string; seoKeywords: string;
}

function generateSlug(title: string) {
  const map: Record<string, string> = {
    "\u0430":"a","\u0431":"b","\u0432":"v","\u0433":"g","\u0434":"d","\u0435":"e","\u0451":"yo","\u0436":"zh","\u0437":"z","\u0438":"i","\u0439":"j","\u043a":"k","\u043b":"l","\u043c":"m","\u043d":"n","\u043e":"o","\u043f":"p","\u0440":"r","\u0441":"s","\u0442":"t","\u0443":"u","\u0444":"f","\u0445":"kh","\u0446":"ts","\u0447":"ch","\u0448":"sh","\u0449":"shch","\u044a":"","\u044b":"y","\u044c":"","\u044d":"e","\u044e":"yu","\u044f":"ya"
  };
  return title
    .toLowerCase()
    .replace(/[\u0430-\u044f\u0451]/g, c => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uploadPortfolioImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/kapi/admin/uploads/portfolio", {
    method: "POST",
    body: formData,
  });

  const payload: any = await res.json().catch(() => ({}));
  if (!res.ok || typeof payload.url !== "string") {
    throw new Error(payload.error || "Не удалось загрузить изображение");
  }

  return payload.url as string;
}

async function deletePortfolioImage(imagePath: string) {
  const res = await fetch("/kapi/admin/uploads/portfolio", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imagePath }),
  });

  const payload: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || "Не удалось удалить изображение");
  }
}

function isLocalPortfolioImage(url: string) {
  return url.startsWith("/uploads/portfolio/");
}

function ArrayUrlField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isValidUrl = (v: string) => v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/uploads/");

  const add = () => {
    const v = input.trim();
    if (v) {
      onChange([...value, v]);
      setInput("");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(files.map(uploadPortfolioImage));
      onChange([...value, ...uploadedUrls]);
      toast.success(files.length === 1 ? "Фото загружено" : "Фото загружены");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  const removeAt = async (index: number) => {
    const currentValue = [...value];
    const image = currentValue[index];
    const nextValue = currentValue.filter((_, i) => i !== index);

    onChange(nextValue);

    if (!image || !isLocalPortfolioImage(image)) return;

    try {
      await deletePortfolioImage(image);
    } catch (err: any) {
      onChange(currentValue);
      toast.error(err.message);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {uploading ? "Загрузка..." : "Загрузить фото"}
        </button>
        <p className="text-xs text-gray-400 self-center">PNG, JPG, WEBP, GIF до 8 MB</p>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          className={`form-input flex-1 text-sm font-mono ${input && !isValidUrl(input) ? "border-red-300 focus:ring-red-200" : ""}`}
          value={input}
          onChange={e => setInput(e.target.value)}
          type="text"
          placeholder="https://example.com/photo.jpg или /uploads/portfolio/..."
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-primary text-white rounded-lg text-sm shrink-0">
          + Добавить
        </button>
      </div>

      {input && !isValidUrl(input) && (
        <p className="text-xs text-red-500 mb-2">Используйте `https://`, `http://` или `/uploads/...`</p>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
              <img
                src={url}
                alt={`Фото ${i + 1}`}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.opacity = "0.2"; }}
              />
              {i === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded font-medium">
                  1
                </span>
              )}
              <button
                type="button"
                onClick={() => void removeAt(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                x
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

function ArrayTextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <textarea
        className="form-input w-full"
        rows={4}
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
        placeholder={placeholder}
      />
    </div>
  );
}

const EMPTY: CaseData = {
  title: "",
  shortTitle: "",
  slug: "",
  city: "Минск",
  cityKey: "minsk",
  region: "Минск",
  district: "",
  area: 12,
  layout: "Угловая",
  kitchenType: "Угловая",
  color: "Светлая",
  completedAt: "",
  style: "Современный",
  styleSlug: "sovremennye",
  material: "МДФ плёнка ПВХ",
  materials: ["МДФ"],
  materialSlugs: ["mdf"],
  scenarioSlugs: [],
  priceFrom: 0,
  priceTo: 0,
  priceNote: "Стоимость зависит от размеров, материалов и комплектации.",
  size: "",
  facades: "",
  countertop: "",
  fittings: "",
  workDuration: "",
  days: 21,
  description: "",
  task: "",
  constraints: "",
  solution: "",
  result: "",
  features: [],
  relatedLocationSlugs: ["minsk"],
  mainImage: "",
  images: [],
  imageAlts: [],
  imageCaptions: [],
  alt: "",
  photosBefore: [],
  photosAfter: [],
  featured: false,
  order: 0,
  published: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

interface Props { portfolioCase?: Partial<CaseData> }

export function PortfolioCaseForm({ portfolioCase }: Props) {
  const router = useRouter();
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<CaseData>({ ...EMPTY, ...portfolioCase });
  const [loading, setLoading] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [removingMainImage, setRemovingMainImage] = useState(false);

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
    set(
      "scenarioSlugs",
      form.scenarioSlugs.includes(slug)
        ? form.scenarioSlugs.filter(s => s !== slug)
        : [...form.scenarioSlugs, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = form.id ? `/kapi/admin/portfolio/${form.id}` : "/kapi/admin/portfolio";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          area: Number(form.area),
          priceFrom: Number(form.priceFrom),
          priceTo: Number(form.priceTo),
          days: Number(form.days),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Ошибка сохранения");
      }
      toast.success(form.id ? "Проект обновлён" : "Проект создан");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!form.id || !confirm("Удалить проект? Это действие необратимо.")) return;
    try {
      await fetch(`/kapi/admin/portfolio/${form.id}`, { method: "DELETE" });
      router.push("/admin/portfolio");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingMainImage(true);
    try {
      const url = await uploadPortfolioImage(file);
      set("mainImage", url);
      toast.success("Главное фото загружено");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingMainImage(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleRemoveMainImage = async () => {
    if (!form.mainImage) return;

    const currentImage = form.mainImage;
    setRemovingMainImage(true);
    try {
      if (isLocalPortfolioImage(currentImage)) {
        await deletePortfolioImage(currentImage);
      }
      set("mainImage", "");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRemovingMainImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="portfolio-case-form">
      <div className="flex border-b border-gray-200 mb-6 gap-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === i ? "bg-white border border-b-white border-gray-200 text-primary -mb-px" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название проекта *</label>
              <input
                className="form-input w-full"
                value={form.title}
                required
                onChange={e => {
                  const t = e.target.value;
                  set("title", t);
                  if (!form.id) set("slug", generateSlug(t));
                }}
                placeholder="Угловая кухня в стиле минимализм"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (slug) *</label>
              <input
                className="form-input w-full font-mono text-sm"
                value={form.slug}
                required
                onChange={e => set("slug", e.target.value)}
                placeholder="uglovaya-kuhnya-minimalizm"
              />
              <p className="text-xs text-gray-400 mt-1">/portfolio/{form.slug || "slug"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Короткое название</label>
              <input
                className="form-input w-full"
                value={form.shortTitle}
                onChange={e => set("shortTitle", e.target.value)}
                placeholder="Угловая кухня в Минске"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt проекта</label>
              <input
                className="form-input w-full"
                value={form.alt}
                onChange={e => set("alt", e.target.value)}
                placeholder="Угловая кухня на заказ в Минске"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Город *</label>
              <input className="form-input w-full" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Минск" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ключ города</label>
              <input className="form-input w-full font-mono text-sm" value={form.cityKey} onChange={e => set("cityKey", e.target.value)} placeholder="minsk" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Регион / область</label>
              <input className="form-input w-full" value={form.region} onChange={e => set("region", e.target.value)} placeholder="Минская область" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Район</label>
              <input className="form-input w-full" value={form.district} onChange={e => set("district", e.target.value)} placeholder="Центральный район" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата завершения</label>
              <input className="form-input w-full" value={form.completedAt} onChange={e => set("completedAt", e.target.value)} placeholder="Март 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
              <input className="form-input w-full" value={form.color} onChange={e => set("color", e.target.value)} placeholder="Светлая" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Длина гарнитура (п.м)</label>
              <input className="form-input w-full" type="number" min={1} value={form.area} onChange={e => set("area", Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Планировка</label>
              <select className="form-input w-full" value={form.layout} onChange={e => set("layout", e.target.value)}>
                <option value="">-- выберите --</option>
                {LAYOUTS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип кухни для каталога</label>
              <input className="form-input w-full" value={form.kitchenType} onChange={e => set("kitchenType", e.target.value)} placeholder="Угловая" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Размер текстом</label>
              <input className="form-input w-full" value={form.size} onChange={e => set("size", e.target.value)} placeholder="3 п.м" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок выполнения (дней)</label>
              <input className="form-input w-full" type="number" min={1} value={form.days} onChange={e => set("days", Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок текстом</label>
              <input className="form-input w-full" value={form.workDuration} onChange={e => set("workDuration", e.target.value)} placeholder="21 день" />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Примечание к цене</label>
            <input className="form-input w-full" value={form.priceNote} onChange={e => set("priceNote", e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Стиль кухни</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { set("style", s); set("styleSlug", STYLE_SLUGS[s] || ""); }}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.style === s ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Материалы фасадов</label>
            <div className="flex flex-wrap gap-2">
              {MATERIALS_MAP.map(m => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => toggleMaterial(m.slug, m.label)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.materialSlugs.includes(m.slug) ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <ArrayTextField
            label="Материалы для каталога"
            value={form.materials}
            onChange={v => set("materials", v)}
            placeholder={"МДФ\nЛДСП"}
            hint="Каждый материал с новой строки. Эти значения показываются на /portfolio."
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Фасады</label>
              <input className="form-input w-full" value={form.facades} onChange={e => set("facades", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Столешница</label>
              <input className="form-input w-full" value={form.countertop} onChange={e => set("countertop", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Фурнитура</label>
              <input className="form-input w-full" value={form.fittings} onChange={e => set("fittings", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Сценарии</label>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map(s => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => toggleScenario(s.slug)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.scenarioSlugs.includes(s.slug) ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary/50"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <ArrayTextField
            label="Связанные slug локаций"
            value={form.relatedLocationSlugs}
            onChange={v => set("relatedLocationSlugs", v)}
            placeholder={"minsk\nminskaya-oblast"}
            hint="Используется для связей с региональными страницами и фильтрами."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание проекта</label>
            <textarea
              className="form-input w-full"
              rows={3}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="2-3 предложения для карточки проекта"
            />
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

      {tab === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
            Рассказывайте как о реальном клиенте и реальном проекте. Структура раздела сохранена без рефакторинга.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Задача клиента</label>
            <p className="text-xs text-gray-400 mb-1">Что клиент хотел получить?</p>
            <textarea className="form-input w-full" rows={4} value={form.task} onChange={e => set("task", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ограничения проекта</label>
            <p className="text-xs text-gray-400 mb-1">Низкий потолок, нестандартный угол, бюджетные ограничения...</p>
            <textarea className="form-input w-full" rows={3} value={form.constraints} onChange={e => set("constraints", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Наше решение</label>
            <p className="text-xs text-gray-400 mb-1">Как была решена задача?</p>
            <textarea className="form-input w-full" rows={4} value={form.solution} onChange={e => set("solution", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Результат</label>
            <p className="text-xs text-gray-400 mb-1">Что клиент получил в итоге?</p>
            <textarea className="form-input w-full" rows={4} value={form.result} onChange={e => set("result", e.target.value)} />
          </div>
          <ArrayTextField
            label="Особенности проекта"
            value={form.features}
            onChange={v => set("features", v)}
            placeholder={"Угловая планировка\nВстроенная техника\nШкафы до потолка"}
            hint="Каждая особенность с новой строки. Используется в каталоге и на странице проекта."
          />
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Главное фото</label>
            <p className="text-xs text-gray-400 mb-1">Ручной URL сохранён. Upload автоматически подставляет локальный путь `/uploads/portfolio/...`.</p>
            <div className="mb-2 flex flex-wrap gap-2">
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleMainImageUpload}
              />
              <button
                type="button"
                onClick={() => mainImageInputRef.current?.click()}
                disabled={uploadingMainImage}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {uploadingMainImage ? "Загрузка..." : "Загрузить фото"}
              </button>
              {form.mainImage ? (
                <button
                  type="button"
                  onClick={() => void handleRemoveMainImage()}
                  disabled={removingMainImage}
                  className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {removingMainImage ? "Удаление..." : "Удалить фото"}
                </button>
              ) : null}
              <p className="text-xs text-gray-400 self-center">PNG, JPG, WEBP, GIF до 8 MB</p>
            </div>
            <input
              className="form-input w-full font-mono text-sm"
              type="text"
              value={form.mainImage}
              onChange={e => set("mainImage", e.target.value)}
              placeholder="https://example.com/kitchen-main.jpg или /uploads/portfolio/..."
            />
            {form.mainImage ? (
              <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                <img
                  src={form.mainImage}
                  alt="Главное фото"
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.parentElement!.style.display = "none"; }}
                />
                <span className="absolute top-1.5 left-1.5 text-xs bg-primary text-white px-2 py-0.5 rounded font-medium">Обложка</span>
              </div>
            ) : (
              <div className="mt-2 rounded-lg border-2 border-dashed border-gray-200 h-28 flex items-center justify-center bg-gray-50">
                <span className="text-xs text-gray-400">Превью появится после URL или upload</span>
              </div>
            )}
          </div>

          <ArrayUrlField
            label="Галерея"
            value={form.images}
            onChange={v => set("images", v)}
            hint="Поддержка ручных URL сохранена. Upload добавляет локальные файлы."
          />
          <ArrayTextField
            label="Alt для фото галереи"
            value={form.imageAlts}
            onChange={v => set("imageAlts", v)}
            placeholder={"Угловая кухня на заказ в Минске со светлыми фасадами\nРакурс угловой кухни в Минске"}
            hint="Одна строка соответствует одному фото в галерее."
          />
          <ArrayTextField
            label="Подписи к фото галереи"
            value={form.imageCaptions}
            onChange={v => set("imageCaptions", v)}
            placeholder={"Общий вид кухни\nВид с другого ракурса"}
            hint="Одна строка соответствует одному фото в галерее."
          />
          <ArrayUrlField
            label="Фото ДО"
            value={form.photosBefore}
            onChange={v => set("photosBefore", v)}
            hint="Фотографии до начала работ."
          />
          <ArrayUrlField
            label="Фото ПОСЛЕ"
            value={form.photosAfter}
            onChange={v => set("photosAfter", v)}
            hint="Фотографии после выполнения работ."
          />
        </div>
      )}

      {tab === 3 && (
        <div className="space-y-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Превью в Google</p>
            <p className="text-blue-700 text-sm font-medium">{form.seoTitle || form.title || "SEO title"}</p>
            <p className="text-green-700 text-xs">{`kuhni.minsk.by/portfolio/${form.slug}`}</p>
            <p className="text-gray-600 text-xs mt-1">{form.seoDescription || form.description || "SEO description"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO title</label>
            <input className="form-input w-full" value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">{form.seoTitle.length}/60 символов</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO description</label>
            <textarea className="form-input w-full" rows={3} value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">{form.seoDescription.length}/160 символов</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ключевые слова</label>
            <input className="form-input w-full" value={form.seoKeywords} onChange={e => set("seoKeywords", e.target.value)} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        {form.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            Удалить проект
          </button>
        ) : <div />}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/portfolio")}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            data-testid="btn-save-case"
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Сохранение..." : form.id ? "Сохранить изменения" : "Создать проект"}
          </button>
        </div>
      </div>
    </form>
  );
}
