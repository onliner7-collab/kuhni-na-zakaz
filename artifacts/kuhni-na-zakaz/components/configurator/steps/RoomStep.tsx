"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, DoorOpen, Frame, Plus, Trash2 } from "lucide-react";
import { Room2D } from "@/components/configurator/canvas/Room2D";
import type { ConfigWarning, RoomConfig, RoomOpening, RoomProtrusion } from "@/lib/kitchen-configurator";

interface RoomStepProps {
  roomConfig: RoomConfig;
  warnings: ConfigWarning[];
  onChange: (config: Partial<RoomConfig>) => void;
}

const WALL_NAMES = ["Верхняя", "Правая", "Нижняя", "Левая"];

function uid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9);
}

export function RoomStep({ roomConfig, warnings, onChange }: RoomStepProps) {
  const [activeTab, setActiveTab] = useState<"dimensions" | "openings" | "protrusions">("dimensions");
  const { dimensions, openings, protrusions } = roomConfig;

  function updateDim(field: keyof typeof dimensions, value: number) {
    onChange({ dimensions: { ...dimensions, [field]: Math.max(50, Math.min(2000, value || 0)) } });
  }

  function addOpening(type: "door" | "window") {
    const opening: RoomOpening = {
      id: uid(),
      type,
      wallIndex: 2,
      offsetCm: 50,
      widthCm: type === "door" ? 90 : 120,
      heightCm: type === "door" ? 205 : 130,
      ...(type === "window" ? { sillHeightCm: 90 } : {}),
    };
    onChange({ openings: [...openings, opening] });
  }

  function updateOpening(id: string, patch: Partial<RoomOpening>) {
    onChange({ openings: openings.map((opening) => (opening.id === id ? { ...opening, ...patch } : opening)) });
  }

  function addProtrusion() {
    const protrusion: RoomProtrusion = { id: uid(), wallIndex: 0, offsetCm: 50, widthCm: 60, depthCm: 20, label: "Выступ" };
    onChange({ protrusions: [...protrusions, protrusion] });
  }

  function updateProtrusion(id: string, patch: Partial<RoomProtrusion>) {
    onChange({ protrusions: protrusions.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  }

  const roomErrors = warnings.filter((warning) => ["ROOM_TOO_NARROW", "ROOM_TOO_SHALLOW", "ROOM_LOW_CEILING"].includes(warning.code));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1 text-sm">
          {(["dimensions", "openings", "protrusions"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`min-h-10 flex-1 rounded-md px-3 py-2 font-semibold transition-all ${
                activeTab === tab ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "dimensions" ? "Размеры" : tab === "openings" ? "Проемы" : "Выступы"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "dimensions" && (
            <motion.div key="dimensions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-5">
              <DimField label="Ширина, см" hint="Расстояние слева направо" value={dimensions.widthCm} min={150} max={700} onChange={(value) => updateDim("widthCm", value)} />
              <DimField label="Глубина, см" hint="Расстояние от входа до дальней стены" value={dimensions.depthCm} min={120} max={600} onChange={(value) => updateDim("depthCm", value)} />
              <DimField label="Высота потолка, см" hint="Влияет на верхние шкафы и пеналы" value={dimensions.heightCm} min={200} max={360} onChange={(value) => updateDim("heightCm", value)} />
            </motion.div>
          )}

          {activeTab === "openings" && (
            <motion.div key="openings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => addOpening("door")} className="flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted">
                  <DoorOpen className="h-4 w-4" /> Добавить дверь
                </button>
                <button type="button" onClick={() => addOpening("window")} className="flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted">
                  <Frame className="h-4 w-4" /> Добавить окно
                </button>
              </div>
              {openings.length === 0 && <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Проемы не добавлены</p>}
              {openings.map((opening) => (
                <motion.div key={opening.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 rounded-lg border bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold text-stone-900">{opening.type === "door" ? "Дверь" : "Окно"}</span>
                    <button type="button" onClick={() => onChange({ openings: openings.filter((item) => item.id !== opening.id) })} className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive" aria-label="Удалить проем">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SmallField label="Стена" type="select" value={opening.wallIndex} onChange={(value) => updateOpening(opening.id, { wallIndex: Number(value) })}>
                      {WALL_NAMES.map((name, index) => (
                        <option key={name} value={index}>{name}</option>
                      ))}
                    </SmallField>
                    <SmallField label="Отступ, см" type="number" value={opening.offsetCm} onChange={(value) => updateOpening(opening.id, { offsetCm: Number(value) })} />
                    <SmallField label="Ширина, см" type="number" value={opening.widthCm} onChange={(value) => updateOpening(opening.id, { widthCm: Number(value) })} />
                    <SmallField label="Высота, см" type="number" value={opening.heightCm} onChange={(value) => updateOpening(opening.id, { heightCm: Number(value) })} />
                    {opening.type === "window" && (
                      <SmallField label="Подоконник, см" type="number" value={opening.sillHeightCm ?? 90} onChange={(value) => updateOpening(opening.id, { sillHeightCm: Number(value) })} />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "protrusions" && (
            <motion.div key="protrusions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <button type="button" onClick={addProtrusion} className="flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted">
                <Plus className="h-4 w-4" /> Добавить выступ или нишу
              </button>
              {protrusions.length === 0 && <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Выступы не добавлены</p>}
              {protrusions.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 rounded-lg border bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold text-stone-900">{item.label || "Выступ"}</span>
                    <button type="button" onClick={() => onChange({ protrusions: protrusions.filter((p) => p.id !== item.id) })} className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive" aria-label="Удалить выступ">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SmallField label="Название" type="text" value={item.label ?? ""} onChange={(value) => updateProtrusion(item.id, { label: String(value) })} />
                    <SmallField label="Стена" type="select" value={item.wallIndex} onChange={(value) => updateProtrusion(item.id, { wallIndex: Number(value) })}>
                      {WALL_NAMES.map((name, index) => (
                        <option key={name} value={index}>{name}</option>
                      ))}
                    </SmallField>
                    <SmallField label="Отступ, см" type="number" value={item.offsetCm} onChange={(value) => updateProtrusion(item.id, { offsetCm: Number(value) })} />
                    <SmallField label="Ширина, см" type="number" value={item.widthCm} onChange={(value) => updateProtrusion(item.id, { widthCm: Number(value) })} />
                    <SmallField label="Глубина, см" type="number" value={item.depthCm} onChange={(value) => updateProtrusion(item.id, { depthCm: Number(value) })} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {roomErrors.length > 0 && (
          <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3">
            {roomErrors.map((warning) => (
              <p key={warning.code} className="flex items-start gap-2 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {warning.message}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-muted-foreground">Предварительный план</p>
        <Room2D roomConfig={roomConfig} placedModules={[]} moduleCatalog={[]} warnings={warnings} readOnly />
        <p className="text-center text-xs text-muted-foreground">Желтый цвет — двери, голубой — окна, серый — выступы.</p>
      </div>
    </div>
  );
}

function DimField({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-stone-800">{label}</span>
      <span className="mb-2 block text-xs text-muted-foreground">{hint}</span>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} step={10} value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-h-10 flex-1 accent-amber-600" />
        <input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-24 rounded-lg border bg-background px-3 py-2 text-center text-sm font-semibold" />
      </div>
    </label>
  );
}

function SmallField({ label, type, value, onChange, children }: { label: string; type: string; value: string | number; onChange: (value: string | number) => void; children?: React.ReactNode }) {
  const className = "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground";
  return (
    <label className="text-xs font-semibold text-muted-foreground">
      {label}
      {type === "select" ? (
        <select className={className} value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
      ) : (
        <input type={type} className={className} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}
