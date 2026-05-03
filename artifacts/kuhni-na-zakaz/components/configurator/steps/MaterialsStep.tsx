"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CookingPot, Grid2X2, Grip, PanelTop, SquareStack } from "lucide-react";
import type {
  CatalogAppliance,
  CatalogCountertop,
  CatalogFacade,
  CatalogHandle,
  CatalogSkinal,
  MaterialsConfig,
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

const TABS: { key: Tab; label: string; Icon: typeof PanelTop }[] = [
  { key: "facade", label: "Фасады", Icon: PanelTop },
  { key: "countertop", label: "Столешница", Icon: SquareStack },
  { key: "skinal", label: "Скиналь", Icon: Grid2X2 },
  { key: "handle", label: "Ручки", Icon: Grip },
  { key: "appliances", label: "Техника", Icon: CookingPot },
];

const APPLIANCE_LABELS: Record<string, string> = {
  oven: "Духовой шкаф",
  hob: "Варочная панель",
  dishwasher: "Посудомоечная машина",
  fridge: "Холодильник",
  microwave: "Микроволновка",
  hood: "Вытяжка",
};

export function MaterialsStep({ facades, countertops, skinals, handles, appliances, config, onChange }: MaterialsStepProps) {
  const [tab, setTab] = useState<Tab>("facade");

  function toggleAppliance(slug: string) {
    const current = config.appliances ?? [];
    onChange({ appliances: current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug] });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1 text-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-md px-3 py-2 font-semibold transition-all ${
              tab === key ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "facade" && (
          <motion.div key="facade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaterialGrid
              items={facades.map((item) => ({
                id: item.id,
                slug: item.slug,
                name: item.name,
                subtitle: `${item.material} · ${item.finish}`,
                colorHex: item.colorHex,
                imageUrl: item.imageUrl,
                price: `×${item.priceMultiplier}`,
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
              items={countertops.map((item) => ({
                id: item.id,
                slug: item.slug,
                name: item.name,
                subtitle: `${item.material} · ${item.thicknessMm} мм`,
                imageUrl: item.imageUrl,
                price: `${item.pricePerMeter.toLocaleString("ru-RU")} ₽/пм`,
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
              items={skinals.map((item) => ({
                id: item.id,
                slug: item.slug,
                name: item.name,
                subtitle: item.material,
                imageUrl: item.imageUrl,
                price: `${item.pricePerSqMeter.toLocaleString("ru-RU")} ₽/м²`,
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
              items={handles.map((item) => ({
                id: item.id,
                slug: item.slug,
                name: item.name,
                subtitle: `${item.material} · ${item.finishName}`,
                imageUrl: item.imageUrl,
                price: `${item.pricePerPiece.toLocaleString("ru-RU")} ₽/шт.`,
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {appliances.map((item, idx) => {
                  const selected = (config.appliances ?? []).includes(item.slug);
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => toggleAppliance(item.slug)}
                      className={`relative overflow-hidden rounded-lg border-2 bg-white text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        selected ? "border-amber-500 shadow-lg shadow-amber-100" : "border-stone-200 hover:border-stone-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex aspect-video items-center justify-center bg-stone-100">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            width={640}
                            height={360}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <CookingPot className="h-9 w-9 text-stone-500" />
                        )}
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-sm font-extrabold text-stone-900">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{APPLIANCE_LABELS[item.applianceType] ?? item.applianceType}</p>
                        <p className="text-xs font-semibold text-stone-700">{item.priceBase.toLocaleString("ru-RU")} ₽</p>
                      </div>
                      {selected && (
                        <div className="absolute right-2 top-2 rounded-full bg-amber-500 text-white shadow">
                          <CheckCircle2 className="h-5 w-5" />
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

interface GridItem {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  colorHex?: string;
  imageUrl?: string;
  price?: string;
}

function MaterialGrid({ items, selected, onSelect }: { items: GridItem[]; selected: string; onSelect: (slug: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item, idx) => {
        const isSelected = item.slug === selected;
        return (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => onSelect(item.slug)}
            className={`relative overflow-hidden rounded-lg border-2 bg-white text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isSelected ? "border-amber-500 shadow-lg shadow-amber-100" : "border-stone-200 hover:border-stone-300 hover:shadow-md"
            }`}
          >
            <div
              className="aspect-square"
              style={{
                backgroundColor: item.colorHex || "#e8e1d6",
                backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : "linear-gradient(135deg, rgba(255,255,255,.35), rgba(0,0,0,.08))",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <div className="space-y-0.5 p-2">
              <p className="truncate text-xs font-extrabold text-stone-900">{item.name}</p>
              {item.subtitle && <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>}
              {item.price && <p className="text-xs font-semibold text-stone-700">{item.price}</p>}
            </div>
            {isSelected && (
              <div className="absolute right-1.5 top-1.5 rounded-full bg-amber-500 text-white shadow">
                <CheckCircle2 className="h-4 w-4" />
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
    <div className="rounded-lg border bg-muted/40 p-8 text-center">
      <p className="text-sm text-muted-foreground">{entity} пока не добавлены в админке.</p>
    </div>
  );
}
