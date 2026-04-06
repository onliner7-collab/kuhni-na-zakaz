"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Square, Clock, Star } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

const STYLE_OPTS = ["Все стили", "Современный", "Классический", "Скандинавский", "Минимализм", "Лофт", "Прованс"];
const AREA_OPTS = [
  { label: "Любая площадь", min: 0, max: 9999 },
  { label: "До 8 м²", min: 0, max: 8 },
  { label: "8–14 м²", min: 8, max: 14 },
  { label: "14–20 м²", min: 14, max: 20 },
  { label: "Более 20 м²", min: 20, max: 9999 },
];
const PRICE_OPTS = [
  { label: "Любой бюджет", min: 0, max: 999999 },
  { label: "До 2 000 BYN", min: 0, max: 2000 },
  { label: "2 000–4 000 BYN", min: 2000, max: 4000 },
  { label: "4 000+ BYN", min: 4000, max: 999999 },
];

interface Case {
  id: number; title: string; slug: string; city: string; region: string;
  area: number; layout: string | null; style: string; material: string;
  priceFrom: number; priceTo: number; days: number; completedAt: string | null;
  description: string; mainImage: string; featured: boolean;
}

export function PortfolioFilters({ cases }: { cases: Case[] }) {
  const [styleFilter, setStyleFilter] = useState("Все стили");
  const [areaIdx, setAreaIdx] = useState(0);
  const [priceIdx, setPriceIdx] = useState(0);

  const areaOpt = AREA_OPTS[areaIdx];
  const priceOpt = PRICE_OPTS[priceIdx];
  const hasFilters = styleFilter !== "Все стили" || areaIdx !== 0 || priceIdx !== 0;

  const filtered = cases.filter(c => {
    if (styleFilter !== "Все стили" && c.style !== styleFilter) return false;
    if (c.area < areaOpt.min || c.area > areaOpt.max) return false;
    const from = c.priceFrom;
    const to = c.priceTo || c.priceFrom;
    if (from > 0 && from > priceOpt.max) return false;
    if (priceOpt.min > 0 && to > 0 && to < priceOpt.min) return false;
    return true;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Стиль</label>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_OPTS.map(s => (
              <button key={s} type="button" onClick={() => setStyleFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${styleFilter === s ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Площадь</label>
            <select className="form-input text-sm py-1.5" value={areaIdx} onChange={e => setAreaIdx(Number(e.target.value))}>
              {AREA_OPTS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Бюджет</label>
            <select className="form-input text-sm py-1.5" value={priceIdx} onChange={e => setPriceIdx(Number(e.target.value))}>
              {PRICE_OPTS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button type="button" onClick={() => { setStyleFilter("Все стили"); setAreaIdx(0); setPriceIdx(0); }}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-primary transition-colors border border-gray-200 rounded-lg bg-white">
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      {hasFilters && (
        <p className="text-sm text-muted-foreground mb-4">
          Найдено: {filtered.length} {filtered.length === 1 ? "проект" : filtered.length < 5 ? "проекта" : "проектов"}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">Проектов по выбранным фильтрам не найдено</p>
          <button onClick={() => { setStyleFilter("Все стили"); setAreaIdx(0); setPriceIdx(0); }}
            className="text-primary hover:underline text-sm">Сбросить фильтры</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map(c => (
            <Link key={c.slug} href={`/portfolio/${c.slug}`}
              className="card-base hover:shadow-lg transition-all duration-200 group overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-stone-200 to-amber-100 flex items-center justify-center overflow-hidden relative">
                {c.mainImage ? (
                  <img src={c.mainImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="text-stone-400 text-sm">Фото проекта</span>
                )}
                {c.featured && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Избранное
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-white text-xs font-medium">{c.style}</span>
                  {c.layout && <span className="text-white/70 text-xs ml-2">· {c.layout}</span>}
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-serif font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2">{c.title}</h2>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city}</span>
                  <span className="flex items-center gap-1"><Square className="w-3 h-3" />{c.area} м²</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.days} дней</span>
                </div>
                {c.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-primary font-semibold text-sm">
                    {c.priceFrom > 0 && c.priceTo > 0
                      ? `${c.priceFrom.toLocaleString("ru")}–${c.priceTo.toLocaleString("ru")} BYN`
                      : c.priceFrom > 0 ? `от ${c.priceFrom.toLocaleString("ru")} BYN`
                      : "Цена по запросу"}
                  </span>
                  <FavoriteButton caseSlug={c.slug} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
