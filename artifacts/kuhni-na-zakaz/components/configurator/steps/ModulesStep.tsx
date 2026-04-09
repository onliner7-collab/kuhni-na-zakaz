"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Info } from "lucide-react";
import { Room2D } from "@/components/configurator/canvas/Room2D";
import type { CatalogModule, PlacedModule, RoomConfig, ConfigWarning, WallSide } from "@/lib/kitchen-configurator";

interface ModulesStepProps {
  roomConfig: RoomConfig;
  placedModules: PlacedModule[];
  moduleCatalog: CatalogModule[];
  warnings: ConfigWarning[];
  onAddModule: (pm: PlacedModule) => void;
  onRemoveModule: (id: string) => void;
  onMoveModule: (id: string, wallSide: string, offsetCm: number) => void;
}

const TYPE_LABELS: Record<string, string> = {
  LOWER: "Нижний", UPPER: "Верхний", TALL: "Пенал",
  CORNER: "Угловой", SINK: "Под мойку", DRAWER: "С ящиками",
  GLASS_DOOR: "Витрина", LIFT_MECHANISM: "Подъёмный мех.",
};

const WALL_OPTIONS: { value: WallSide; label: string }[] = [
  { value: "top", label: "Верхняя стена" },
  { value: "right", label: "Правая стена" },
  { value: "bottom", label: "Нижняя стена" },
  { value: "left", label: "Левая стена" },
  { value: "island", label: "Остров" },
];

function uid() { return Math.random().toString(36).slice(2, 9); }

export function ModulesStep({
  roomConfig, placedModules, moduleCatalog, warnings,
  onAddModule, onRemoveModule, onMoveModule,
}: ModulesStepProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<string>("ALL");
  const [addWall, setAddWall] = useState<WallSide>("bottom");

  const types = ["ALL", ...Array.from(new Set(moduleCatalog.map((m) => m.moduleType)))];
  const filtered = filterType === "ALL" ? moduleCatalog : moduleCatalog.filter((m) => m.moduleType === filterType);

  function handleAdd(mod: CatalogModule) {
    const pm: PlacedModule = {
      id: uid(),
      moduleSlug: mod.slug,
      wallSide: addWall,
      offsetCm: 10,
    };
    onAddModule(pm);
  }

  const selectedModule = placedModules.find((m) => m.id === selectedModuleId);
  const selectedCatalog = selectedModule ? moduleCatalog.find((m) => m.slug === selectedModule.moduleSlug) : null;

  const errorIds = new Set(warnings.flatMap((w) => w.relatedIds ?? []));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Catalog */}
      <div className="lg:col-span-2 space-y-3">
        <p className="text-sm font-medium">Каталог модулей</p>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterType === t ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {t === "ALL" ? "Все" : (TYPE_LABELS[t] ?? t)}
            </button>
          ))}
        </div>

        {/* Wall selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground shrink-0">Разместить на:</span>
          <select
            value={addWall}
            onChange={(e) => setAddWall(e.target.value as WallSide)}
            className="text-xs border rounded-lg px-2 py-1.5 bg-background"
          >
            {WALL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {moduleCatalog.length === 0 ? (
          <div className="rounded-xl border bg-muted/40 p-8 text-center">
            <p className="text-xs text-muted-foreground">Модули не добавлены. Добавьте их через администрирование.</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {filtered.map((mod, i) => (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleAdd(mod)}
                className="w-full text-left flex items-center gap-3 rounded-xl border bg-card p-2.5 hover:border-amber-400 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-xs font-mono text-stone-500">
                  {mod.widthCm}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{mod.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {TYPE_LABELS[mod.moduleType]} · {mod.widthCm}×{mod.heightCm}×{mod.depthCm} см
                  </p>
                </div>
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-amber-600 shrink-0 ml-auto" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Canvas + placed list */}
      <div className="lg:col-span-3 space-y-3">
        <Room2D
          roomConfig={roomConfig}
          placedModules={placedModules}
          moduleCatalog={moduleCatalog}
          warnings={warnings}
          selectedModuleId={selectedModuleId}
          onSelectModule={setSelectedModuleId}
          onMoveModule={onMoveModule}
        />

        {/* Selected module panel */}
        {selectedModule && selectedCatalog && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-3 space-y-2 ${errorIds.has(selectedModule.id) ? "border-red-300 bg-red-50" : "bg-card"}`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{selectedCatalog.name}</p>
              <button onClick={() => { onRemoveModule(selectedModule.id); setSelectedModuleId(undefined); }}
                className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Стена</label>
                <select
                  value={selectedModule.wallSide}
                  onChange={(e) => onMoveModule(selectedModule.id, e.target.value, selectedModule.offsetCm)}
                  className="w-full text-xs border rounded-lg px-2 py-1.5 bg-background mt-0.5"
                >
                  {WALL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Отступ, см</label>
                <input
                  type="number" min={0}
                  value={selectedModule.offsetCm}
                  onChange={(e) => onMoveModule(selectedModule.id, selectedModule.wallSide, Number(e.target.value))}
                  className="w-full text-xs border rounded-lg px-2 py-1.5 bg-background mt-0.5"
                />
              </div>
            </div>
            {errorIds.has(selectedModule.id) && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {warnings.find((w) => w.relatedIds?.includes(selectedModule.id))?.message}
              </p>
            )}
          </motion.div>
        )}

        {/* Placed modules list */}
        {placedModules.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Размещено модулей: {placedModules.length}</p>
            <div className="flex flex-wrap gap-1.5">
              {placedModules.map((pm) => {
                const cat = moduleCatalog.find((m) => m.slug === pm.moduleSlug);
                const hasErr = errorIds.has(pm.id);
                return (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedModuleId(pm.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      pm.id === selectedModuleId ? "border-amber-500 bg-amber-50" :
                      hasErr ? "border-red-400 bg-red-50 text-red-700" :
                      "border-stone-200 bg-stone-50 hover:border-stone-400"
                    }`}
                  >
                    {cat?.widthCm ?? "?"} · {pm.wallSide[0].toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
