"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Home, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import type { CatalogFacade, CatalogModule, MaterialsConfig, PlacedModule, RoomConfig } from "@/lib/kitchen-configurator";

interface View3DStepProps {
  roomConfig: RoomConfig;
  placedModules: PlacedModule[];
  moduleCatalog: CatalogModule[];
  facadeCatalog: CatalogFacade[];
  materialsConfig: MaterialsConfig;
}

const WALL_ROTATION: Record<string, number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: -90,
  island: 0,
};

export function View3DStep({ roomConfig, placedModules, moduleCatalog, facadeCatalog, materialsConfig }: View3DStepProps) {
  const [view, setView] = useState<"front" | "corner" | "top">("corner");
  const [zoom, setZoom] = useState(1);
  const hasModules = placedModules.length > 0;
  const facadeColor = useMemo(() => {
    const facade = facadeCatalog.find((item) => item.slug === materialsConfig.facadeSlug);
    return facade?.colorHex || "#d8cec1";
  }, [facadeCatalog, materialsConfig.facadeSlug]);

  const roomWidth = Math.max(roomConfig.dimensions.widthCm, 240);
  const roomDepth = Math.max(roomConfig.dimensions.depthCm, 200);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {[
            { key: "front", label: "Фронт" },
            { key: "corner", label: "Угол" },
            { key: "top", label: "Сверху" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setView(item.key as typeof view)}
              className={`min-h-10 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                view === item.key ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.82, value - 0.08))} className="flex min-h-10 items-center justify-center rounded-lg border px-3 py-2 transition-colors hover:bg-muted" aria-label="Уменьшить">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoom(1)} className="flex min-h-10 items-center justify-center rounded-lg border px-3 py-2 transition-colors hover:bg-muted" aria-label="Сбросить вид">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.18, value + 0.08))} className="flex min-h-10 items-center justify-center rounded-lg border px-3 py-2 transition-colors hover:bg-muted" aria-label="Увеличить">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!hasModules ? (
        <div className="flex h-80 w-full flex-col items-center justify-center gap-2 rounded-lg border bg-stone-50 text-muted-foreground">
          <Home className="h-10 w-10" />
          <p className="text-sm font-semibold">Добавьте модули на предыдущем шаге</p>
          <p className="text-xs">После этого здесь появится 3D-просмотр.</p>
        </div>
      ) : (
        <div className="relative h-[420px] overflow-hidden rounded-lg border bg-[linear-gradient(180deg,#f8f6f2_0%,#eee7de_100%)] sm:h-[520px]">
          <div
            className="absolute left-1/2 top-1/2 h-[260px] w-[320px] origin-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 sm:h-[330px] sm:w-[460px]"
            style={{
              transform: `translate(-50%, -50%) scale(${zoom}) rotateX(${view === "top" ? 58 : 58}deg) rotateZ(${view === "front" ? 0 : view === "top" ? 45 : 38}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute inset-0 rounded-md border-4 border-stone-700 bg-stone-100 shadow-2xl" />
            <div className="absolute inset-x-0 top-0 h-6 origin-top bg-stone-200 shadow" style={{ transform: "rotateX(-90deg)" }} />
            <div className="absolute bottom-0 left-0 top-0 w-6 origin-left bg-stone-300 shadow" style={{ transform: "rotateY(90deg)" }} />

            {placedModules.map((module) => {
              const catalogItem = moduleCatalog.find((item) => item.slug === module.moduleSlug);
              if (!catalogItem) return null;

              const widthPct = Math.max(12, (catalogItem.widthCm / roomWidth) * 100);
              const depthPct = Math.max(11, (catalogItem.depthCm / roomDepth) * 100);
              const offsetPct = Math.min(86, (module.offsetCm / (module.wallSide === "left" || module.wallSide === "right" ? roomDepth : roomWidth)) * 100);
              const isTall = catalogItem.moduleType === "TALL";
              const isUpper = catalogItem.moduleType === "UPPER" || catalogItem.moduleType === "GLASS_DOOR" || catalogItem.moduleType === "LIFT_MECHANISM";

              const style = moduleStyle(module, offsetPct, widthPct, depthPct);
              return (
                <div
                  key={module.id}
                  className="absolute rounded-sm border border-stone-800/25 shadow-lg"
                  style={{
                    ...style,
                    background: facadeColor,
                    height: isTall ? 58 : isUpper ? 24 : 34,
                    transform: `${style.transform} translateZ(${isUpper ? 58 : isTall ? 34 : 17}px) rotateZ(${WALL_ROTATION[module.wallSide] ?? 0}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                  title={catalogItem.name}
                >
                  <span className="absolute inset-x-1 top-1 h-1 rounded bg-white/35" />
                  <span className="absolute bottom-1 left-1 right-1 h-1 rounded bg-black/10" />
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1.5 text-xs text-stone-600 shadow backdrop-blur">
            SVG 3D-просмотр: без WebGL, работает на мобильных и в старых браузерах
          </div>
        </div>
      )}
    </div>
  );
}

function moduleStyle(module: PlacedModule, offsetPct: number, widthPct: number, depthPct: number): CSSProperties {
  switch (module.wallSide) {
    case "top":
      return { left: `${offsetPct}%`, top: "5%", width: `${widthPct}%`, transform: "translateZ(0)" };
    case "bottom":
      return { left: `${offsetPct}%`, bottom: "5%", width: `${widthPct}%`, transform: "translateZ(0)" };
    case "left":
      return { left: "5%", top: `${offsetPct}%`, width: `${depthPct}%`, transform: "translateZ(0)" };
    case "right":
      return { right: "5%", top: `${offsetPct}%`, width: `${depthPct}%`, transform: "translateZ(0)" };
    default:
      return { left: "42%", top: "42%", width: `${widthPct}%`, transform: "translateZ(0)" };
  }
}
