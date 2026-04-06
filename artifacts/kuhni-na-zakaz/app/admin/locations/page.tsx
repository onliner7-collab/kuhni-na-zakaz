"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Plus, ExternalLink, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface LocationRow {
  id: number; city: string; slug: string; region: string;
  priceFrom: number; published: boolean; areas: string[]; images: string[];
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/kapi/admin/locations");
    if (res.ok) setLocations(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, city: string) => {
    if (!confirm(`Удалить страницу «${city}»? Действие нельзя отменить.`)) return;
    setDeleting(id);
    await fetch(`/kapi/admin/locations/${id}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  };

  const togglePublished = async (loc: LocationRow) => {
    await fetch(`/kapi/admin/locations/${loc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...loc, published: !loc.published }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Города и регионы</h1>
          <p className="text-muted-foreground mt-1 text-sm">SEO-страницы нового поколения по городам Беларуси</p>
        </div>
        <Link
          href="/admin/locations/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новая страница
        </Link>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-violet-50 rounded-2xl border border-primary/20 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Локальные SEO-страницы нового поколения</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Каждая страница уникальна. Содержит реальные кейсы и отзывы из региона, фото работ,
              особенности замера и монтажа, локальный FAQ с JSON-LD разметкой для Google и карту зоны работы.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/30 rounded-2xl animate-pulse" />)}
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-border">
          <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-lg font-semibold text-foreground mb-1">Нет страниц городов</p>
          <p className="text-muted-foreground text-sm mb-6">Создайте первую страницу из готового шаблона</p>
          <Link href="/admin/locations/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />Создать первую страницу
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-muted/20 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{locations.length} страниц</span>
            <span className="text-xs text-muted-foreground">{locations.filter(l => l.published).length} опубликовано</span>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Город / регион</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">URL</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Наполнение</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Статус</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {locations.map(loc => (
                <tr key={loc.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{loc.city}</p>
                    {loc.region && <p className="text-xs text-muted-foreground mt-0.5">{loc.region}</p>}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-muted-foreground">/locations/{loc.slug}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-xs">
                      <span className={loc.images.length > 0 ? "text-green-600" : "text-muted-foreground"}>
                        📷 {loc.images.length}
                      </span>
                      <span className={loc.areas.length > 0 ? "text-green-600" : "text-muted-foreground"}>
                        📍 {loc.areas.length} зон
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => togglePublished(loc)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        loc.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {loc.published ? <><Eye className="w-3 h-3" />Опубликована</> : <><EyeOff className="w-3 h-3" />Скрыта</>}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/locations/${loc.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        title="Открыть страницу"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/locations/${loc.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(loc.id, loc.city)}
                        disabled={deleting === loc.id}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
