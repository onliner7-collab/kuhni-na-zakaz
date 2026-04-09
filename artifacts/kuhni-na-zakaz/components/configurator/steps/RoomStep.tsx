"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, DoorOpen, Frame, AlertTriangle } from "lucide-react";
import type { RoomConfig, RoomOpening, RoomProtrusion, ConfigWarning } from "@/lib/kitchen-configurator";
import { Room2D } from "@/components/configurator/canvas/Room2D";

interface RoomStepProps {
  roomConfig: RoomConfig;
  warnings: ConfigWarning[];
  onChange: (config: Partial<RoomConfig>) => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const WALL_NAMES = ["Верхняя", "Правая", "Нижняя", "Левая"];

export function RoomStep({ roomConfig, warnings, onChange }: RoomStepProps) {
  const [activeTab, setActiveTab] = useState<"dimensions" | "openings" | "protrusions">("dimensions");

  const { dimensions, openings, protrusions } = roomConfig;

  function updateDim(field: "widthCm" | "depthCm" | "heightCm", value: number) {
    onChange({ dimensions: { ...dimensions, [field]: Math.max(50, Math.min(2000, value)) } });
  }

  function addOpening(type: "door" | "window") {
    const o: RoomOpening = {
      id: uid(), type, wallIndex: 2, offsetCm: 50, widthCm: 90,
      ...(type === "window" ? { heightCm: 120, sillHeightCm: 90 } : { heightCm: 200 }),
    };
    onChange({ openings: [...openings, o] });
  }

  function updateOpening(id: string, patch: Partial<RoomOpening>) {
    onChange({ openings: openings.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  }

  function removeOpening(id: string) {
    onChange({ openings: openings.filter((o) => o.id !== id) });
  }

  function addProtrusion() {
    const p: RoomProtrusion = { id: uid(), wallIndex: 0, offsetCm: 50, widthCm: 60, depthCm: 20, label: "Выступ" };
    onChange({ protrusions: [...protrusions, p] });
  }

  function updateProtrusion(id: string, patch: Partial<RoomProtrusion>) {
    onChange({ protrusions: protrusions.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  function removeProtrusion(id: string) {
    onChange({ protrusions: protrusions.filter((p) => p.id !== id) });
  }

  const roomErrors = warnings.filter((w) =>
    ["ROOM_TOO_NARROW", "ROOM_TOO_SHALLOW", "ROOM_LOW_CEILING"].includes(w.code)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — form */}
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-muted p-1 text-sm">
          {(["dimensions", "openings", "protrusions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 font-medium transition-all ${
                activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "dimensions" ? "Размеры" : tab === "openings" ? "Проёмы" : "Выступы"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "dimensions" && (
            <motion.div key="dim" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
              <DimField label="Ширина, см" value={dimensions.widthCm} onChange={(v) => updateDim("widthCm", v)} min={150} max={2000} hint="Расстояние слева направо" />
              <DimField label="Глубина, см" value={dimensions.depthCm} onChange={(v) => updateDim("depthCm", v)} min={120} max={1500} hint="Расстояние от входа до дальней стены" />
              <DimField label="Высота потолка, см" value={dimensions.heightCm} onChange={(v) => updateDim("heightCm", v)} min={200} max={400} hint="Нужна для верхних шкафов" />
            </motion.div>
          )}

          {activeTab === "openings" && (
            <motion.div key="open" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => addOpening("door")} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                  <DoorOpen className="w-4 h-4" />Добавить дверь
                </button>
                <button onClick={() => addOpening("window")} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                  <Frame className="w-4 h-4" />Добавить окно
                </button>
              </div>
              {openings.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">Проёмы не добавлены</p>
              )}
              {openings.map((o) => (
                <motion.div key={o.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-3 space-y-3 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{o.type === "door" ? "🚪 Дверь" : "🪟 Окно"}</span>
                    <button onClick={() => removeOpening(o.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SmallField label="Стена" type="select" value={o.wallIndex} onChange={(v) => updateOpening(o.id, { wallIndex: Number(v) })}>
                      {WALL_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
                    </SmallField>
                    <SmallField label="Отступ, см" type="number" value={o.offsetCm} onChange={(v) => updateOpening(o.id, { offsetCm: Number(v) })} />
                    <SmallField label="Ширина, см" type="number" value={o.widthCm} onChange={(v) => updateOpening(o.id, { widthCm: Number(v) })} />
                    <SmallField label="Высота, см" type="number" value={o.heightCm} onChange={(v) => updateOpening(o.id, { heightCm: Number(v) })} />
                    {o.type === "window" && (
                      <SmallField label="Подоконник, см" type="number" value={o.sillHeightCm ?? 90} onChange={(v) => updateOpening(o.id, { sillHeightCm: Number(v) })} />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "protrusions" && (
            <motion.div key="prot" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <button onClick={addProtrusion} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                <Plus className="w-4 h-4" />Добавить выступ / нишу
              </button>
              {protrusions.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">Выступы не добавлены</p>
              )}
              {protrusions.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border rounded-xl p-3 space-y-3 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">📦 {p.label || "Выступ"}</span>
                    <button onClick={() => removeProtrusion(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SmallField label="Название" type="text" value={p.label ?? ""} onChange={(v) => updateProtrusion(p.id, { label: String(v) })} />
                    <SmallField label="Стена" type="select" value={p.wallIndex} onChange={(v) => updateProtrusion(p.id, { wallIndex: Number(v) })}>
                      {WALL_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
                    </SmallField>
                    <SmallField label="Отступ, см" type="number" value={p.offsetCm} onChange={(v) => updateProtrusion(p.id, { offsetCm: Number(v) })} />
                    <SmallField label="Ширина, см" type="number" value={p.widthCm} onChange={(v) => updateProtrusion(p.id, { widthCm: Number(v) })} />
                    <SmallField label="Глубина, см" type="number" value={p.depthCm} onChange={(v) => updateProtrusion(p.id, { depthCm: Number(v) })} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warnings */}
        {roomErrors.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1">
            {roomErrors.map((w, i) => (
              <p key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{w.message}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — canvas */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Предварительный план</p>
        <Room2D
          roomConfig={roomConfig}
          placedModules={[]}
          moduleCatalog={[]}
          warnings={warnings}
          readOnly
        />
        <p className="text-xs text-muted-foreground text-center">
          Жёлтые — двери, голубые — окна, серые — выступы
        </p>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────

function DimField({ label, value, onChange, min, max, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-stone-700">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-1">{hint}</p>}
      <div className="flex items-center gap-3">
        <input
          type="range" min={min} max={max} step={10} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-amber-600"
        />
        <input
          type="number" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded-lg border bg-background px-2 py-1.5 text-sm text-center font-mono"
        />
      </div>
    </div>
  );
}

function SmallField({ label, type, value, onChange, children }: {
  label: string; type: string; value: string | number;
  onChange: (v: string | number) => void;
  children?: React.ReactNode;
}) {
  const cls = "w-full rounded-lg border bg-background px-2 py-1.5 text-sm";
  return (
    <div>
      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
      {type === "select" ? (
        <select className={cls} value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
      ) : (
        <input type={type} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
