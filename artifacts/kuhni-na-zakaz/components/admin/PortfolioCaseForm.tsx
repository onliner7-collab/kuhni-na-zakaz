"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PortfolioCase {
  id?: number;
  title: string;
  slug: string;
  city: string;
  area: number;
  style: string;
  material: string;
  priceFrom: number;
  priceTo: number;
  days: number;
  description: string;
  task: string;
  solution: string;
  images: string[];
  mainImage: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
}

interface Props {
  portfolioCase?: PortfolioCase;
}

export function PortfolioCaseForm({ portfolioCase }: Props) {
  const router = useRouter();
  const isEdit = !!portfolioCase;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: portfolioCase?.title ?? "",
    slug: portfolioCase?.slug ?? "",
    city: portfolioCase?.city ?? "Минск",
    area: portfolioCase?.area ?? 12,
    style: portfolioCase?.style ?? "",
    material: portfolioCase?.material ?? "",
    priceFrom: portfolioCase?.priceFrom ?? 0,
    priceTo: portfolioCase?.priceTo ?? 0,
    days: portfolioCase?.days ?? 30,
    description: portfolioCase?.description ?? "",
    task: portfolioCase?.task ?? "",
    solution: portfolioCase?.solution ?? "",
    mainImage: portfolioCase?.mainImage ?? "",
    seoTitle: portfolioCase?.seoTitle ?? "",
    seoDescription: portfolioCase?.seoDescription ?? "",
    published: portfolioCase?.published ?? true,
  });

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (c) => {
        const map: Record<string, string> = {
          а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"j",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
        };
        return map[c] ?? c;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/portfolio/${portfolioCase!.id}` : "/kapi/admin/portfolio";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          area: Number(form.area),
          priceFrom: Number(form.priceFrom),
          priceTo: Number(form.priceTo),
          days: Number(form.days),
          images: form.mainImage ? [form.mainImage] : [],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка сохранения");
      }
      toast.success(isEdit ? "Проект обновлён" : "Проект создан");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="portfolio-case-form" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 bg-white rounded-xl border border-border p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Название *</label>
              <input
                type="text"
                data-testid="input-title"
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: f.slug || generateSlug(title) }));
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
                placeholder="Кухня в стиле лофт"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">URL (slug) *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm text-foreground bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Город *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Площадь (м²)</label>
              <input
                type="number"
                min={1}
                value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Описание</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background resize-none"
              placeholder="Общее описание проекта"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Задача</label>
            <textarea
              rows={3}
              value={form.task}
              onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background resize-none"
              placeholder="Что нужно было сделать"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Решение</label>
            <textarea
              rows={3}
              value={form.solution}
              onChange={(e) => setForm((f) => ({ ...f, solution: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background resize-none"
              placeholder="Что было сделано"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">URL главного фото</label>
            <input
              type="url"
              value={form.mainImage}
              onChange={(e) => setForm((f) => ({ ...f, mainImage: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Публикация</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Опубликовать проект</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Стиль и материал</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Стиль</label>
              <select
                value={form.style}
                onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              >
                <option value="">Выберите стиль</option>
                <option value="Современный">Современный</option>
                <option value="Классический">Классический</option>
                <option value="Скандинавский">Скандинавский</option>
                <option value="Лофт">Лофт</option>
                <option value="Минимализм">Минимализм</option>
                <option value="Прованс">Прованс</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Материал</label>
              <select
                value={form.material}
                onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              >
                <option value="">Выберите материал</option>
                <option value="МДФ плёнка">МДФ плёнка</option>
                <option value="МДФ эмаль">МДФ эмаль</option>
                <option value="Массив дерева">Массив дерева</option>
                <option value="AGT">AGT</option>
                <option value="Акрил">Акрил</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Стоимость и сроки</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">От (BYN)</label>
                <input
                  type="number"
                  min={0}
                  value={form.priceFrom}
                  onChange={(e) => setForm((f) => ({ ...f, priceFrom: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">До (BYN)</label>
                <input
                  type="number"
                  min={0}
                  value={form.priceTo}
                  onChange={(e) => setForm((f) => ({ ...f, priceTo: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Срок выполнения (дней)</label>
              <input
                type="number"
                min={1}
                value={form.days}
                onChange={(e) => setForm((f) => ({ ...f, days: parseInt(e.target.value) || 30 }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/portfolio")}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              data-testid="btn-save-case"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
