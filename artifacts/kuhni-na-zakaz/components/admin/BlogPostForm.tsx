"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: number;
  coverImage: string;
  relatedCaseSlugs: string[];
  relatedStyleSlugs: string[];
  relatedScenarioSlugs: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
}

interface Props {
  post?: BlogPost;
}

export function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "",
    tags: post?.tags.join(", ") ?? "",
    readTime: post?.readTime ?? 5,
    coverImage: post?.coverImage ?? "",
    relatedCaseSlugs: post?.relatedCaseSlugs.join(", ") ?? "",
    relatedStyleSlugs: post?.relatedStyleSlugs.join(", ") ?? "",
    relatedScenarioSlugs: post?.relatedScenarioSlugs.join(", ") ?? "",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
    published: post?.published ?? false,
  });

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (c) => {
        const map: Record<string, string> = {
          а: "a",
          б: "b",
          в: "v",
          г: "g",
          д: "d",
          е: "e",
          ё: "yo",
          ж: "zh",
          з: "z",
          и: "i",
          й: "j",
          к: "k",
          л: "l",
          м: "m",
          н: "n",
          о: "o",
          п: "p",
          р: "r",
          с: "s",
          т: "t",
          у: "u",
          ф: "f",
          х: "kh",
          ц: "ts",
          ч: "ch",
          ш: "sh",
          щ: "shch",
          ъ: "",
          ы: "y",
          ь: "",
          э: "e",
          ю: "yu",
          я: "ya",
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
      const url = isEdit ? `/kapi/admin/blog/${post!.id}` : "/kapi/admin/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          relatedCaseSlugs: form.relatedCaseSlugs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          relatedStyleSlugs: form.relatedStyleSlugs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          relatedScenarioSlugs: form.relatedScenarioSlugs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          readTime: Number(form.readTime),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка сохранения");
      }
      toast.success(isEdit ? "Статья обновлена" : "Статья создана");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="blog-post-form"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 bg-white rounded-xl border border-border p-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Заголовок *
            </label>
            <input
              type="text"
              data-testid="input-title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: f.slug || generateSlug(title),
                }));
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              placeholder="Как выбрать кухонный гарнитур"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              URL (slug) *
            </label>
            <input
              type="text"
              data-testid="input-slug"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm text-foreground bg-background"
              placeholder="kak-vybrat-kukhonnyj-garnitur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Краткое описание *
            </label>
            <textarea
              data-testid="input-excerpt"
              required
              rows={2}
              value={form.excerpt}
              onChange={(e) =>
                setForm((f) => ({ ...f, excerpt: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background resize-none"
              placeholder="Краткое описание для карточки статьи"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Содержание *
            </label>
            <textarea
              data-testid="input-content"
              required
              rows={12}
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background resize-y font-mono text-sm"
              placeholder="Поддерживается Markdown..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Поддерживается Markdown-разметка
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Публикация</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid="input-published"
                checked={form.published}
                onChange={(e) =>
                  setForm((f) => ({ ...f, published: e.target.checked }))
                }
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">
                Опубликовать статью
              </span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Обложка статьи</h3>
            <p className="text-xs text-muted-foreground">
              URL изображения — отображается на карточке и в шапке статьи
            </p>
            <input
              type="url"
              data-testid="input-cover-image"
              value={form.coverImage}
              onChange={(e) =>
                setForm((f) => ({ ...f, coverImage: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background font-mono text-sm"
              placeholder="https://example.com/image.jpg"
            />
            {form.coverImage && (
              <div className="relative rounded-lg overflow-hidden border border-border aspect-video bg-muted">
                <img
                  src={form.coverImage}
                  alt="Превью обложки"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = "none";
                  }}
                />
              </div>
            )}
            {!form.coverImage && (
              <div className="rounded-lg border-2 border-dashed border-border aspect-video flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  Превью появится после вставки URL
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Параметры</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Категория
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              >
                <option value="">Без категории</option>
                <option value="Дизайн">Дизайн</option>
                <option value="Материалы">Материалы</option>
                <option value="Советы">Советы</option>
                <option value="Тренды">Тренды</option>
                <option value="Уход">Уход и обслуживание</option>
                <option value="Новости">Новости компании</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Теги
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
                placeholder="кухня, дизайн, советы"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Через запятую
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Время чтения (мин)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={form.readTime}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    readTime: parseInt(e.target.value) || 5,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Связанный контент</h3>
            <p className="text-xs text-muted-foreground">
              Slug-и через запятую. Показываются в конце статьи блоками «Похожие
              проекты», «Стили», «Сценарии».
            </p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Кейсы портфолио
              </label>
              <input
                type="text"
                value={form.relatedCaseSlugs}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relatedCaseSlugs: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background text-sm"
                placeholder="slug-keisa-1, slug-keisa-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Стили кухонь
              </label>
              <input
                type="text"
                value={form.relatedStyleSlugs}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relatedStyleSlugs: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background text-sm"
                placeholder="minimalizm, skandinavskie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Сценарии использования
              </label>
              <input
                type="text"
                value={form.relatedScenarioSlugs}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    relatedScenarioSlugs: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background text-sm"
                placeholder="malenkaya-kukhnya, semya-s-detmi"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground">SEO</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                SEO-заголовок
              </label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, seoTitle: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background"
                placeholder="Оставьте пустым для авто"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                SEO-описание
              </label>
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, seoDescription: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground bg-background resize-none"
                placeholder="Оставьте пустым для авто"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              data-testid="btn-save-post"
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
