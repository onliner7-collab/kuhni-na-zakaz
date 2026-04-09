"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type {
  CatalogFacade, CatalogCountertop, CatalogSkinal,
  CatalogHandle, CatalogAppliance, MaterialsConfig,
} from "@/lib/kitchen-configurator";

interface MaterialsStepProps {
  facades: CatalogFacade[];
  countertops: CatalogCountertop[];
  skinals: CatalogSkinal[];
  handles: CatalogHandle[];
  appliances: CatalogAppliance[];
  config: MaterialsConfig;
  onChange: (patch: Partial<MaterialsConfig>) => void;
}

type Tab = "facade" | "countertop" | "skinal" | "handle" | "appliances";

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "facade", label: "Фасады", emoji: "🎨" },
  { key: "countertop", label: "Столешница", emoji: "🪨" },
  { key: "skinal", label: "Скиналь", emoji: "🧱" },
  { key: "handle", label: "Ручки", emoji: "🔩" },
  { key: "appliances", label: "Техника", emoji: "🔌" },
];

const APPLIANCE_LABELS: Record<string, string> = {
  oven: "Духовой шкаф", hob: "Варочная панель",
  dishwasher: "Посудомойка", fridge: "Холодильник",
  microwave: "Микроволновка", hood: "Вытяжка",
};

export function MaterialsStep({ facades, countertops, skinals, handles, appliances, config, onChange }: MaterialsStepProps) {
  const [tab, setTab] = useState<Tab>("facade");

  function toggleAppliance(slug: string) {
    const current = config.appliances ?? [];
    if (current.includes(slug)) {
      onChange({ appliances: current.filter((s) => s !== slug) });
    } else {
      onChange({ appliances: [...current, slug] });
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1 text-sm scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium whitespace-nowrap transition-all shrink-0 ${
              tab === t.key ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{t.emoji}</span> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "facade" && (
          <motion.div key="facade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaterialGrid
              items={facades.map((f) => ({
                id: f.id, slug: f.slug, name: f.name,
                subtitle: `${f.material} · ${f.finish}`,
                colorHex: f.colorHex, imageUrl: f.imageUrl,
                price: `×${f.priceMultiplier}`,
              }))}
              selected={config.facadeSlug}
              onSelect={(slug) => onChange({ facadeSlug: slug })}
            />
            {facades.length === 0 && <EmptyState entity="Фасады" />}
          </motion.div>
        )}

        {tab === "countertop" && (
          <motion.div key="countertop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaterialGrid
              items={countertops.map((c) => ({
                id: c.id, slug: c.slug, name: c.name,
                subtitle: `${c.material} · ${c.thicknessMm} мм`,
                imageUrl: c.imageUrl,
                price: `${c.pricePerMeter.toLocaleString("ru-RU")} ₽/пм`,
              }))}
              selected={config.countertopSlug}
              onSelect={(slug) => onChange({ countertopSlug: slug })}
            />
            {countertops.length === 0 && <EmptyState entity="Столешницы" />}
          </motion.div>
        )}

        {tab === "skinal" && (
          <motion.div key="skinal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaterialGrid
              items={skinals.map((s) => ({
                id: s.id, slug: s.slug, name: s.name,
                subtitle: s.material,
                imageUrl: s.imageUrl,
                price: `${s.pricePerSqMeter.toLocaleString("ru-RU")} ₽/м²`,
              }))}
              selected={config.skinalSlug}
              onSelect={(slug) => onChange({ skinalSlug: slug })}
            />
            {skinals.length === 0 && <EmptyState entity="Скинали" />}
          </motion.div>
        )}

        {tab === "handle" && (
          <motion.div key="handle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaterialGrid
              items={handles.map((h) => ({
                id: h.id, slug: h.slug, name: h.name,
                subtitle: `${h.material} · ${h.finishName}`,
                imageUrl: h.imageUrl,
                price: `${h.pricePerPiece.toLocaleString("ru-RU")} ₽/шт.`,
              }))}
              selected={config.handleSlug}
              onSelect={(slug) => onChange({ handleSlug: slug })}
            />
            {handles.length === 0 && <EmptyState entity="Ручки" />}
          </motion.div>
        )}

        {tab === "appliances" && (
          <motion.div key="appliances" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {appliances.length === 0 ? (
              <EmptyState entity="Техника" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {appliances.map((a, idx) => {
                  const selected = (config.appliances ?? []).includes(a.slug);
                  return (
                    <motion.button
                      key={a.id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                      onClick={() => toggleAppliance(a.slug)}
                      className={`relative rounded-xl border-2 text-left overflow-hidden transition-all ${
                        selected ? "border-amber-500 shadow-md" : "border-transparent hover:border-stone-300"
                      }`}
                    >
                      <div className="aspect-video bg-stone-100 flex items-center justify-center">
                        {a.imageUrl
                          ? <img src={a.imageUrl} alt={a.name} className="w-full h-full object-cover" />
                          : <span className="text-3xl">{a.applianceType === "oven" ? "♨️" : a.applianceType === "hob" ? "🍳" : "🔌"}</span>
                        }
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{APPLIANCE_LABELS[a.applianceType] ?? a.applianceType}</p>
                        <p className="text-xs text-stone-600 font-medium mt-0.5">{a.priceBase.toLocaleString("ru-RU")} ₽</p>
                      </div>
                      {selected && (
                        <div className="absolute top-1 right-1 bg-amber-500 rounded-full text-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MaterialGrid ──────────────────────────────────────

interface GridItem {
  id: number; slug: string; name: string; subtitle?: string;
  colorHex?: string; imageUrl?: string; price?: string;
}

function MaterialGrid({ items, selected, onSelect }: {
  items: GridItem[]; selected: string; onSelect: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((item, idx) => {
        const isSelected = item.slug === selected;
        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => onSelect(item.slug)}
            className={`relative rounded-xl border-2 overflow-hidden text-left transition-all ${
              isSelected ? "border-amber-500 shadow-lg shadow-amber-100" : "border-transparent hover:border-stone-300 hover:shadow-sm"
            }`}
          >
            <div
              className="aspect-square"
              style={{
                backgroundColor: item.colorHex || "#e8e4e0",
                backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="p-1.5 bg-white">
              <p className="text-xs font-semibold leading-tight truncate">{item.name}</p>
              {item.subtitle && <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>}
              {item.price && <p className="text-xs text-stone-600">{item.price}</p>}
            </div>
            {isSelected && (
              <div className="absolute top-1 right-1 bg-amber-500 rounded-full text-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function EmptyState({ entity }: { entity: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-8 text-center">
      <p className="text-sm text-muted-foreground">{entity} не добавлены. Перейдите в администрирование.</p>
    </div>
  );
}
