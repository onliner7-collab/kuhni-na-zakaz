"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaticPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}

export default function EditStaticPagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [page, setPage] = useState<StaticPage | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/kapi/admin/static-pages/${id}`)
      .then((r) => r.json())
      .then(setPage)
      .catch(() => setError("Не удалось загрузить страницу"));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!page) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/kapi/admin/static-pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          content: page.content,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          published: page.published,
        }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Не удалось сохранить. Попробуйте снова.");
    } finally {
      setSaving(false);
    }
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {error || <Loader2 className="w-5 h-5 animate-spin" />}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/pages" className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Редактировать: {page.title}</h1>
          <p className="text-xs text-muted-foreground">/{page.slug}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-medium text-foreground text-sm uppercase tracking-wide text-muted-foreground">Контент</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Заголовок страницы</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Заголовок"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Содержимое</label>
            <p className="text-xs text-muted-foreground">
              Используйте <code className="bg-muted px-1 rounded">## Заголовок</code> для разделов,{" "}
              <code className="bg-muted px-1 rounded">- пункт</code> для списков, пустую строку для новых абзацев.
            </p>
            <textarea
              value={page.content}
              onChange={(e) => setPage({ ...page, content: e.target.value })}
              rows={20}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              placeholder="Текст страницы..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-medium text-foreground text-sm uppercase tracking-wide text-muted-foreground">SEO</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">SEO заголовок</label>
            <input
              type="text"
              value={page.seoTitle}
              onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="SEO Title"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">SEO описание</label>
            <textarea
              value={page.seoDescription}
              onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Meta description..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage({ ...page, published: !page.published })}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                page.published
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              {page.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {page.published ? "Опубликована" : "Скрыта"}
            </button>
            <span className="text-xs text-muted-foreground">Нажмите для переключения</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">Сохранено!</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Сохранить
          </Button>
          <Link href={`/${page.slug}`} target="_blank" className="text-sm text-muted-foreground hover:text-primary underline">
            Открыть страницу →
          </Link>
        </div>
      </form>
    </div>
  );
}
