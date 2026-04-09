"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import type { RoomConfig, PlacedModule, CatalogModule, ConfigWarning } from "@/lib/kitchen-configurator";

interface Room2DProps {
  roomConfig: RoomConfig;
  placedModules: PlacedModule[];
  moduleCatalog: CatalogModule[];
  warnings: ConfigWarning[];
  selectedModuleId?: string;
  onSelectModule?: (id: string | null) => void;
  onMoveModule?: (id: string, wallSide: string, offsetCm: number) => void;
  readOnly?: boolean;
}

const SCALE_MAX_PX = 520; // максимальная ширина холста
const WALL_THICKNESS = 8;
const GRID_STEP_CM = 30;
const MODULE_DEPTH_LOWER_CM = 60;
const MODULE_DEPTH_UPPER_CM = 35;

export function Room2D({
  roomConfig,
  placedModules,
  moduleCatalog,
  warnings,
  selectedModuleId,
  onSelectModule,
  onMoveModule,
  readOnly = false,
}: Room2DProps) {
  const { widthCm, depthCm } = roomConfig.dimensions;
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ id: string; startX: number } | null>(null);

  // Scale so largest dimension fits SCALE_MAX_PX
  const scale = useMemo(() => {
    const maxDim = Math.max(widthCm, depthCm, 200);
    return SCALE_MAX_PX / maxDim;
  }, [widthCm, depthCm]);

  const W = widthCm * scale;
  const D = depthCm * scale;
  const PAD = 32;
  const svgW = W + PAD * 2 + WALL_THICKNESS * 2;
  const svgH = D + PAD * 2 + WALL_THICKNESS * 2;

  const ox = PAD + WALL_THICKNESS; // origin x (inner)
  const oy = PAD + WALL_THICKNESS; // origin y (inner)

  // Openings on walls
  const openings = roomConfig.openings || [];
  const protrusions = roomConfig.protrusions || [];

  // Error module ids
  const errorIds = new Set(warnings.flatMap((w) => w.relatedIds ?? []));

  // ── Helpers ────────────────────────────────────────────
  function wallStartXY(wallSide: string): [number, number] {
    switch (wallSide) {
      case "top": return [ox, oy];
      case "right": return [ox + W, oy];
      case "bottom": return [ox, oy + D];
      case "left": return [ox, oy];
      default: return [ox + W / 2, oy + D / 2]; // island
    }
  }

  function getModuleRect(pm: PlacedModule, catalogItem: CatalogModule) {
    const ws = pm.wallSide;
    const depthPx =
      ["LOWER", "SINK", "CORNER", "DRAWER"].includes(catalogItem.moduleType)
        ? MODULE_DEPTH_LOWER_CM * scale
        : MODULE_DEPTH_UPPER_CM * scale;
    const wPx = catalogItem.widthCm * scale;
    const hPx = catalogItem.heightCm * scale * 0.3; // 2D height hint
    const oPx = pm.offsetCm * scale;

    switch (ws) {
      case "top":
        return { x: ox + oPx, y: oy, w: wPx, h: depthPx };
      case "bottom":
        return { x: ox + oPx, y: oy + D - depthPx, w: wPx, h: depthPx };
      case "left":
        return { x: ox, y: oy + oPx, w: depthPx, h: wPx };
      case "right":
        return { x: ox + W - depthPx, y: oy + oPx, w: depthPx, h: wPx };
      default: // island – centered
        return {
          x: ox + W / 2 - wPx / 2 + oPx,
          y: oy + D / 2 - depthPx / 2,
          w: wPx,
          h: depthPx,
        };
    }
  }

  // ── Drag handling ──────────────────────────────────────
  const handleModuleMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (readOnly) return;
      e.stopPropagation();
      onSelectModule?.(id);
      setDragging({ id, startX: e.clientX });
    },
    [readOnly, onSelectModule]
  );

  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !onMoveModule) return;
      const dx = e.clientX - dragging.startX;
      const pm = placedModules.find((m) => m.id === dragging.id);
      if (!pm) return;
      const newOffsetCm = Math.max(0, pm.offsetCm + dx / scale);
      onMoveModule(dragging.id, pm.wallSide, Math.round(newOffsetCm));
      setDragging({ id: dragging.id, startX: e.clientX });
    },
    [dragging, placedModules, scale, onMoveModule]
  );

  const handleSvgMouseUp = useCallback(() => setDragging(null), []);

  // ── Grid ────────────────────────────────────────────────
  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = 0; x <= widthCm; x += GRID_STEP_CM) {
      lines.push({ x1: ox + x * scale, y1: oy, x2: ox + x * scale, y2: oy + D });
    }
    for (let y = 0; y <= depthCm; y += GRID_STEP_CM) {
      lines.push({ x1: ox, y1: oy + y * scale, x2: ox + W, y2: oy + y * scale });
    }
    return lines;
  }, [widthCm, depthCm, scale, ox, oy, W, D]);

  return (
    <div className="w-full overflow-auto rounded-xl border bg-stone-50">
      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="select-none cursor-default"
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onMouseLeave={handleSvgMouseUp}
        onClick={() => onSelectModule?.(null)}
      >
        {/* Grid */}
        {gridLines.map((l, i) => (
          <line key={i} {...l} stroke="#e5e1dc" strokeWidth={0.5} />
        ))}

        {/* Room floor */}
        <rect
          x={ox} y={oy} width={W} height={D}
          fill="#faf9f7" stroke="none"
        />

        {/* Protrusions */}
        {protrusions.map((p) => {
          const isH = p.wallIndex === 0 || p.wallIndex === 2;
          const px = p.wallIndex === 3 ? ox : p.wallIndex === 1 ? ox + W - p.depthCm * scale : ox + p.offsetCm * scale;
          const py = p.wallIndex === 0 ? oy : p.wallIndex === 2 ? oy + D - p.depthCm * scale : oy + p.offsetCm * scale;
          const pw = isH ? p.widthCm * scale : p.depthCm * scale;
          const ph = isH ? p.depthCm * scale : p.widthCm * scale;
          return (
            <rect key={p.id} x={px} y={py} width={pw} height={ph} fill="#d6cfc5" stroke="#b5aea5" strokeWidth={1} />
          );
        })}

        {/* Walls */}
        {/* Top */}
        <rect x={ox - WALL_THICKNESS} y={oy - WALL_THICKNESS} width={W + WALL_THICKNESS * 2} height={WALL_THICKNESS} fill="#3d3530" rx={1} />
        {/* Bottom */}
        <rect x={ox - WALL_THICKNESS} y={oy + D} width={W + WALL_THICKNESS * 2} height={WALL_THICKNESS} fill="#3d3530" rx={1} />
        {/* Left */}
        <rect x={ox - WALL_THICKNESS} y={oy - WALL_THICKNESS} width={WALL_THICKNESS} height={D + WALL_THICKNESS * 2} fill="#3d3530" rx={1} />
        {/* Right */}
        <rect x={ox + W} y={oy - WALL_THICKNESS} width={WALL_THICKNESS} height={D + WALL_THICKNESS * 2} fill="#3d3530" rx={1} />

        {/* Openings (doors / windows) */}
        {openings.map((o) => {
          const isH = o.wallIndex === 0 || o.wallIndex === 2;
          let rx = 0, ry = 0, rw = 0, rh = 0;
          const wPx = o.widthCm * scale;
          const tPx = WALL_THICKNESS + 2;
          if (o.wallIndex === 0) { rx = ox + o.offsetCm * scale; ry = oy - WALL_THICKNESS; rw = wPx; rh = tPx; }
          else if (o.wallIndex === 2) { rx = ox + o.offsetCm * scale; ry = oy + D; rw = wPx; rh = tPx; }
          else if (o.wallIndex === 3) { rx = ox - WALL_THICKNESS; ry = oy + o.offsetCm * scale; rw = tPx; rh = wPx; }
          else { rx = ox + W; ry = oy + o.offsetCm * scale; rw = tPx; rh = wPx; }

          return (
            <g key={o.id}>
              <rect x={rx} y={ry} width={rw} height={rh}
                fill={o.type === "door" ? "#fde68a" : "#bae6fd"} stroke="none" />
              {/* Door arc */}
              {o.type === "door" && isH && (
                <path
                  d={`M ${rx} ${oy} A ${wPx} ${wPx} 0 0 1 ${rx + wPx} ${oy}`}
                  fill="none" stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 2"
                />
              )}
            </g>
          );
        })}

        {/* Modules */}
        {placedModules.map((pm) => {
          const cat = moduleCatalog.find((m) => m.slug === pm.moduleSlug);
          if (!cat) return null;
          const r = getModuleRect(pm, cat);
          const selected = pm.id === selectedModuleId;
          const hasError = errorIds.has(pm.id);
          const fill = hasError ? "#fecaca" : selected ? "#ddd6fe" : "#e8e4e0";
          const stroke = hasError ? "#ef4444" : selected ? "#7c3aed" : "#b5aea5";

          const isLower = ["LOWER", "SINK", "CORNER", "DRAWER"].includes(cat.moduleType);

          return (
            <g key={pm.id}
              style={{ cursor: readOnly ? "default" : "grab" }}
              onMouseDown={(e) => handleModuleMouseDown(e, pm.id)}
              onClick={(e) => { e.stopPropagation(); onSelectModule?.(pm.id); }}
            >
              <rect
                x={r.x} y={r.y} width={r.w} height={r.h}
                fill={fill} stroke={stroke} strokeWidth={selected ? 1.5 : 1}
                rx={2}
              />
              {/* Label */}
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={Math.max(8, Math.min(11, r.w / 5))}
                fill={hasError ? "#dc2626" : "#57534e"}
                pointerEvents="none"
              >
                {cat.widthCm}
              </text>
              {/* Lower indicator */}
              {isLower && (
                <rect
                  x={r.x + 2} y={r.y + r.h - 4} width={r.w - 4} height={2}
                  fill={stroke} rx={1}
                />
              )}
            </g>
          );
        })}

        {/* Dimensions */}
        <text x={ox + W / 2} y={oy - WALL_THICKNESS - 6} textAnchor="middle" fontSize={10} fill="#78716c">
          {widthCm} см
        </text>
        <text
          x={ox - WALL_THICKNESS - 6} y={oy + D / 2}
          textAnchor="middle" fontSize={10} fill="#78716c"
          transform={`rotate(-90, ${ox - WALL_THICKNESS - 6}, ${oy + D / 2})`}
        >
          {depthCm} см
        </text>
      </svg>
    </div>
  );
}
