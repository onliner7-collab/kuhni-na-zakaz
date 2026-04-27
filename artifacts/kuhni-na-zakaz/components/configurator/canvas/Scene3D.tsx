"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { RoomConfig, PlacedModule, CatalogModule, CatalogFacade, MaterialsConfig } from "@/lib/kitchen-configurator";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

interface Scene3DProps {
  roomConfig: RoomConfig;
  placedModules: PlacedModule[];
  moduleCatalog: CatalogModule[];
  facadeCatalog: CatalogFacade[];
  materialsConfig: MaterialsConfig;
  /** Облегчённый режим для мобильных — меньше деталей */
  lite?: boolean;
}

// Конвертация см → метры (THREE.js работает в метрах)
const CM = 0.01;

// ── Пол ───────────────────────────────────────────────
function Floor({ widthCm, depthCm }: { widthCm: number; depthCm: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[widthCm * CM, depthCm * CM]} />
      <meshStandardMaterial color="#e8e4e0" roughness={0.9} metalness={0} />
    </mesh>
  );
}

// ── Стены ──────────────────────────────────────────────
function Walls({ widthCm, depthCm, heightCm }: { widthCm: number; depthCm: number; heightCm: number }) {
  const w = widthCm * CM;
  const d = depthCm * CM;
  const h = heightCm * CM;
  const t = 0.02; // толщина стены 2 см

  return (
    <group>
      {/* Back */}
      <mesh position={[0, h / 2, -d / 2]} receiveShadow>
        <boxGeometry args={[w + t * 2, h, t]} />
        <meshStandardMaterial color="#f5f3f0" roughness={0.95} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color="#f0eeeb" roughness={0.95} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color="#f0eeeb" roughness={0.95} />
      </mesh>
    </group>
  );
}

// ── Один шкаф ─────────────────────────────────────────
function KitchenModule3D({
  pm, catalogItem, facadeColor, roomDim,
}: {
  pm: PlacedModule;
  catalogItem: CatalogModule;
  facadeColor: string;
  roomDim: { widthCm: number; depthCm: number };
}) {
  const w = catalogItem.widthCm * CM;
  const h = catalogItem.heightCm * CM;
  const d = catalogItem.depthCm * CM;
  const offset = pm.offsetCm * CM;

  const rW = roomDim.widthCm * CM;
  const rD = roomDim.depthCm * CM;

  const isLower = ["LOWER", "SINK", "CORNER", "DRAWER"].includes(catalogItem.moduleType);
  const depthActual = isLower ? 0.6 : 0.35;
  const heightActual = isLower ? 0.85 : (catalogItem.heightCm * CM);
  const yPos = isLower ? heightActual / 2 : 1.6; // нижние на полу, верхние на высоте ~160 см

  // Позиция по стене
  let position: [number, number, number] = [0, yPos, 0];
  let rotation: [number, number, number] = [0, 0, 0];

  switch (pm.wallSide) {
    case "top":
      position = [-rW / 2 + offset + w / 2, yPos, -rD / 2 + depthActual / 2];
      break;
    case "bottom":
      position = [-rW / 2 + offset + w / 2, yPos, rD / 2 - depthActual / 2];
      rotation = [0, Math.PI, 0];
      break;
    case "left":
      position = [-rW / 2 + depthActual / 2, yPos, -rD / 2 + offset + w / 2];
      rotation = [0, Math.PI / 2, 0];
      break;
    case "right":
      position = [rW / 2 - depthActual / 2, yPos, -rD / 2 + offset + w / 2];
      rotation = [0, -Math.PI / 2, 0];
      break;
    default: // island
      position = [0, yPos, 0];
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Корпус */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, heightActual, depthActual]} />
        <meshStandardMaterial color="#e8e4de" roughness={0.4} />
      </mesh>
      {/* Фасад (передняя панель) */}
      <mesh position={[0, 0, depthActual / 2 + 0.002]} castShadow>
        <boxGeometry args={[w - 0.006, heightActual - 0.006, 0.018]} />
        <meshStandardMaterial color={facadeColor} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Столешница (только нижние) */}
      {isLower && (
        <mesh position={[0, heightActual / 2 + 0.015, 0]}>
          <boxGeometry args={[w, 0.03, depthActual + 0.04]} />
          <meshStandardMaterial color="#c8c2b8" roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

// ── Fallback спиннер ───────────────────────────────────
function LoadingBox() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta;
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#d97706" />
    </mesh>
  );
}

// ── Главная сцена ──────────────────────────────────────
function Scene({
  roomConfig, placedModules, moduleCatalog, facadeCatalog, materialsConfig, lite,
}: Scene3DProps) {
  const { widthCm, depthCm, heightCm } = roomConfig.dimensions;

  const facadeColor = useMemo(() => {
    if (!materialsConfig.facadeSlug) return "#d6cfc5";
    const f = facadeCatalog.find((f) => f.slug === materialsConfig.facadeSlug);
    return f?.colorHex || "#d6cfc5";
  }, [materialsConfig.facadeSlug, facadeCatalog]);

  return (
    <>
      <ambientLight intensity={lite ? 1.2 : 0.6} />
      {!lite && <directionalLight position={[3, 6, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />}
      <pointLight position={[0, heightCm * CM * 0.9, 0]} intensity={0.4} />

      {!lite && <Environment preset="apartment" />}

      <Floor widthCm={widthCm} depthCm={depthCm} />
      <Walls widthCm={widthCm} depthCm={depthCm} heightCm={heightCm} />

      {placedModules.map((pm) => {
        const cat = moduleCatalog.find((m) => m.slug === pm.moduleSlug);
        if (!cat) return null;
        return (
          <KitchenModule3D
            key={pm.id}
            pm={pm}
            catalogItem={cat}
            facadeColor={facadeColor}
            roomDim={{ widthCm, depthCm }}
          />
        );
      })}
    </>
  );
}

// ── Экспортируемый компонент ───────────────────────────
export function Scene3D(props: Scene3DProps) {
  const { widthCm, depthCm, heightCm } = props.roomConfig.dimensions;
  const camDist = Math.max(widthCm, depthCm) * CM * 1.4;

  return (
    <div className="w-full h-full min-h-[320px] rounded-xl overflow-hidden bg-stone-100">
      <Canvas
        shadows={!props.lite}
        gl={{ antialias: !props.lite, powerPreference: props.lite ? "low-power" : "default" }}
        dpr={props.lite ? [1, 1] : [1, 2]}
      >
        <PerspectiveCamera
          makeDefault
          position={[camDist * 0.8, camDist * 0.9, camDist]}
          fov={50}
        />
        <OrbitControls
          enablePan={false}
          minDistance={1}
          maxDistance={camDist * 3}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, heightCm * CM * 0.4, 0]}
        />
        <Suspense fallback={<LoadingBox />}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
