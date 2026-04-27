"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Plus, Trash2 } from "lucide-react";
import { Room2D } from "@/components/configurator/canvas/Room2D";
import type { CatalogModule, ConfigWarning, PlacedModule, RoomConfig, WallSide } from "@/lib/kitchen-configurator";

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
  LOWER: "Нижние",
  UPPER: "Верхние",
  TALL: "Пеналы",
  CORNER: "Угловые",
  SINK: "Под мойку",
  DRAWER: "Ящики",
  GLASS_DOOR: "Витрины",
  LIFT_MECHANISM: "Подъемные",
};

const WALL_OPTIONS: { value: WallSide; label: string }[] = [
  { value: "top", label: "Верхняя стена" },
  { value: "right", label: "Правая стена" },
  { value: "bottom", label: "Нижняя стена" },
  { value: "left", label: "Левая стена" },
  { value: "island", label: "Остров" },
];

function uid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9);
}

export function ModulesStep({
  roomConfig,
  placedModules,
  moduleCatalog,
  warnings,
  onAddModule,
  onRemoveModule,
  onMoveModule,
}: ModulesStepProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>();
  const [filterType, setFilterType] = useState("ALL");
  const [addWall, setAddWall] = useState<WallSide>("bottom");

  const types = ["ALL", ...Array.from(new Set(moduleCatalog.map((module) => module.moduleType)))];
  const filtered = filterType === "ALL" ? moduleCatalog : moduleCatalog.filter((module) => module.moduleType === filterType);
  const selectedModule = placedModules.find((module) => module.id === selectedModuleId);
  const selectedCatalog = selectedModule ? moduleCatalog.find((module) => module.slug === selectedModule.moduleSlug) : null;
  const errorIds = new Set(warnings.flatMap((warning) => warning.relatedIds ?? []));

  function handleAdd(module: CatalogModule) {
    onAddModule({ id: uid(), moduleSlug: module.slug, wallSide: addWall, offsetCm: 10 });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <p className="font-extrabold text-stone-900">Каталог модулей</p>
          <p className="text-sm text-muted-foreground">Выберите стену и добавляйте шкафы одним нажатием.</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`min-h-9 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                filterType === type ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground hover:bg-stone-200"
              }`}
            >
              {type === "ALL" ? "Все" : TYPE_LABELS[type] ?? type}
            </button>
          ))}
        </div>

        <label className="block text-xs font-semibold text-muted-foreground">
          Размещать на
          <select
            value={addWall}
            onChange={(event) => setAddWall(event.target.value as WallSide)}
            className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
          >
            {WALL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {moduleCatalog.length === 0 ? (
          <div className="rounded-lg border bg-muted/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">Модули пока не добавлены.</p>
          </div>
        ) : (
          <div className="max-h-[27rem] space-y-2 overflow-y-auto pr-1">
            {filtered.map((module, idx) => (
              <motion.button
                key={module.id}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleAdd(module)}
                className="group flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left transition-all hover:border-amber-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-stone-100 text-xs font-black text-stone-600">
                  {module.widthCm}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-stone-900">{module.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {TYPE_LABELS[module.moduleType]} · {module.widthCm}×{module.heightCm}×{module.depthCm} см
                  </p>
                  <p className="text-xs font-semibold text-stone-700">{module.priceBase.toLocaleString("ru-RU")} ₽</p>
                </div>
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-amber-700" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 lg:col-span-3">
        <Room2D
          roomConfig={roomConfig}
          placedModules={placedModules}
          moduleCatalog={moduleCatalog}
          warnings={warnings}
          selectedModuleId={selectedModuleId}
          onSelectModule={(id) => setSelectedModuleId(id ?? undefined)}
          onMoveModule={onMoveModule}
        />

        {selectedModule && selectedCatalog && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-3 rounded-lg border p-4 ${errorIds.has(selectedModule.id) ? "border-red-300 bg-red-50" : "bg-white"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-stone-900">{selectedCatalog.name}</p>
              <button
                type="button"
                onClick={() => {
                  onRemoveModule(selectedModule.id);
                  setSelectedModuleId(undefined);
                }}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                aria-label="Удалить модуль"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Стена
                <select
                  value={selectedModule.wallSide}
                  onChange={(event) => onMoveModule(selectedModule.id, event.target.value, selectedModule.offsetCm)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {WALL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold text-muted-foreground">
                Отступ, см
                <input
                  type="number"
                  min={0}
                  value={selectedModule.offsetCm}
                  onChange={(event) => onMoveModule(selectedModule.id, selectedModule.wallSide, Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
                />
              </label>
            </div>
            {errorIds.has(selectedModule.id) && (
              <p className="flex items-start gap-1 text-xs text-red-700">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {warnings.find((warning) => warning.relatedIds?.includes(selectedModule.id))?.message}
              </p>
            )}
          </motion.div>
        )}

        {placedModules.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Размещено модулей: {placedModules.length}</p>
            <div className="flex flex-wrap gap-1.5">
              {placedModules.map((module) => {
                const catalogItem = moduleCatalog.find((item) => item.slug === module.moduleSlug);
                const hasError = errorIds.has(module.id);
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setSelectedModuleId(module.id)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      module.id === selectedModuleId
                        ? "border-amber-500 bg-amber-50"
                        : hasError
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-stone-200 bg-stone-50 hover:border-stone-400"
                    }`}
                  >
                    {catalogItem?.widthCm ?? "?"} см · {module.wallSide}
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
