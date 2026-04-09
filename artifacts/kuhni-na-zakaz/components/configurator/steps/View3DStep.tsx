"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { RotateCcw, Maximize2, ZoomIn, ZoomOut, Smartphone } from "lucide-react";
import type { RoomConfig, PlacedModule, CatalogModule, CatalogFacade, MaterialsConfig } from "@/lib/kitchen-configurator";

// Динамический импорт — Three.js не должен рендериться на сервере
const Scene3D = dynamic(() => import("@/components/configurator/canvas/Scene3D").then((m) => ({ default: m.Scene3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-xl bg-stone-100 flex items-center justify-center">
      <div className="text-sm text-muted-foreground animate-pulse">Загрузка 3D-сцены…</div>
    </div>
  ),
});

interface View3DStepProps {
  roomConfig: RoomConfig;
  placedModules: PlacedModule[];
  moduleCatalog: CatalogModule[];
  facadeCatalog: CatalogFacade[];
  materialsConfig: MaterialsConfig;
}

const PRESETS = [
  { label: "Спереди", icon: "↑" },
  { label: "Угол", icon: "↗" },
  { label: "Сверху", icon: "⊙" },
];

export function View3DStep(props: View3DStepProps) {
  const [lite, setLite] = useState(false);
  const [key, setKey] = useState(0); // для сброса камеры

  const hasModules = props.placedModules.length > 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              title={p.label}
              className="px-3 py-1.5 rounded text-xs font-medium hover:bg-background hover:shadow-sm transition-all"
              onClick={() => setKey((k) => k + 1)}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setLite((l) => !l)}
            title={lite ? "Высокое качество" : "Облегчённый режим"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${lite ? "bg-amber-50 border-amber-300 text-amber-700" : "hover:bg-muted"}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {lite ? "Lite ON" : "Lite"}
          </button>
          <button
            onClick={() => setKey((k) => k + 1)}
            title="Сбросить камеру"
            className="px-2.5 py-1.5 rounded-lg border hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!hasModules ? (
        <div className="w-full h-80 rounded-xl border bg-stone-50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <span className="text-4xl">🏠</span>
          <p className="text-sm">Добавьте модули в шаге «Модули»</p>
          <p className="text-xs">3D-сцена появится здесь</p>
        </div>
      ) : (
        <div className="relative w-full" style={{ height: "480px" }}>
          <Scene3D key={key} {...props} lite={lite} />
          {/* Controls hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 text-xs text-stone-400 bg-white/80 backdrop-blur rounded-full px-3 py-1.5">
            <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" />Прокрутка — зум</span>
            <span>·</span>
            <span className="flex items-center gap-1"><ZoomOut className="w-3 h-3" />Перетащить — поворот</span>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-stone-700 mb-1">Управление камерой</p>
        <ul className="text-xs space-y-0.5 list-disc ml-4">
          <li>Левая кнопка мыши / один палец — поворот</li>
          <li>Колесо / щипок двумя пальцами — зум</li>
          <li>Правая кнопка / два пальца — панорама</li>
        </ul>
      </div>
    </div>
  );
}
