"use client";

import { useReducer, useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import {
  configuratorReducer,
  createInitialState,
  selectCanProceedToStep,
  selectHasErrors,
} from "@/lib/kitchen-configurator/store";
import { checkCompatibility } from "@/lib/kitchen-configurator/compatibility";
import { calculatePrice } from "@/lib/kitchen-configurator/price";
import { saveProjectToIDB, loadProjectFromIDB } from "@/lib/kitchen-configurator/idb-storage";
import type {
  CatalogModule, CatalogTemplate, CatalogFacade, CatalogCountertop,
  CatalogSkinal, CatalogHandle, CatalogAppliance, ConfiguratorStep,
  PlacedModule, RoomConfig, MaterialsConfig,
} from "@/lib/kitchen-configurator";
import type { StylePreset } from "@/lib/kitchen-configurator/style-presets";

import { ConfiguratorStepper, STEPS } from "./ConfiguratorStepper";
import { RoomStep } from "./steps/RoomStep";
import { TemplateStep } from "./steps/TemplateStep";
import { ModulesStep } from "./steps/ModulesStep";
import { StyleStep } from "./steps/StyleStep";
import { MaterialsStep } from "./steps/MaterialsStep";
import { View3DStep } from "./steps/View3DStep";
import { SummaryStep } from "./steps/SummaryStep";

interface Catalog {
  modules: CatalogModule[];
  templates: CatalogTemplate[];
  facades: CatalogFacade[];
  countertops: CatalogCountertop[];
  skinals: CatalogSkinal[];
  handles: CatalogHandle[];
  appliances: CatalogAppliance[];
  settings?: { shareTextTemplate: string; exportBrandingText: string; defaultRoomWidthCm: number; defaultRoomDepthCm: number; defaultRoomHeightCm: number } | null;
}

interface KitchenConfiguratorProps {
  catalog: Catalog;
}

const AUTOSAVE_INTERVAL_MS = 8000;

// Материалы-вкладка объединяет Style + Materials
// Логика: сначала StyleStep (выбор пресета), потом MaterialsStep (ручная настройка)

export function KitchenConfigurator({ catalog }: KitchenConfiguratorProps) {
  const initState = createInitialState();
  if (catalog.settings) {
    initState.roomConfig.dimensions.widthCm = catalog.settings.defaultRoomWidthCm;
    initState.roomConfig.dimensions.depthCm = catalog.settings.defaultRoomDepthCm;
    initState.roomConfig.dimensions.heightCm = catalog.settings.defaultRoomHeightCm;
  }

  const [state, dispatch] = useReducer(configuratorReducer, initState);
  const [activePresetId, setActivePresetId] = useState<string>();
  const [materialsSubTab, setMaterialsSubTab] = useState<"style" | "materials">("style");
  const [restoredFromIDB, setRestoredFromIDB] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setInterval>>();

  // ── Restore from IndexedDB on mount ────────────────────
  useEffect(() => {
    loadProjectFromIDB().then((saved) => {
      if (saved) {
        dispatch({ type: "LOAD_PROJECT", payload: saved });
        setRestoredFromIDB(true);
        setTimeout(() => setRestoredFromIDB(false), 4000);
      }
    });
  }, []);

  // ── Autosave ────────────────────────────────────────────
  useEffect(() => {
    if (autosaveTimer.current) clearInterval(autosaveTimer.current);
    autosaveTimer.current = setInterval(() => {
      if (state.isDirty) saveProjectToIDB(state);
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(autosaveTimer.current);
  }, [state]);

  // ── Recompute warnings + price on state change ──────────
  useEffect(() => {
    const warnings = checkCompatibility({
      roomConfig: state.roomConfig,
      placedModules: state.placedModules,
      moduleCatalog: catalog.modules,
      materialsConfig: state.materialsConfig,
      rules: [],
    });
    dispatch({ type: "SET_WARNINGS", payload: warnings });

    const price = calculatePrice({
      placedModules: state.placedModules,
      materialsConfig: state.materialsConfig,
      roomConfig: state.roomConfig,
      moduleCatalog: catalog.modules,
      facadeCatalog: catalog.facades,
      countertopCatalog: catalog.countertops,
      skinalCatalog: catalog.skinals,
      handleCatalog: catalog.handles,
      applianceCatalog: catalog.appliances,
    });
    dispatch({ type: "UPDATE_PRICE", payload: price });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.placedModules, state.materialsConfig, state.roomConfig]);

  // ── Navigation ──────────────────────────────────────────
  const currentIdx = STEPS.findIndex((s) => s.key === state.currentStep);

  function goPrev() {
    if (currentIdx > 0) dispatch({ type: "SET_STEP", payload: STEPS[currentIdx - 1].key });
  }

  function goNext() {
    if (currentIdx < STEPS.length - 1) dispatch({ type: "SET_STEP", payload: STEPS[currentIdx + 1].key });
  }

  const canProceed = useCallback(
    (step: ConfiguratorStep) => selectCanProceedToStep(state, step),
    [state]
  );

  // ── Handlers ────────────────────────────────────────────
  function handleRoomChange(patch: Partial<RoomConfig>) {
    dispatch({ type: "UPDATE_ROOM", payload: patch });
  }

  function handleTemplateSelect(template: CatalogTemplate) {
    dispatch({ type: "APPLY_TEMPLATE", payload: template });
  }

  function handleAddModule(pm: PlacedModule) {
    dispatch({ type: "ADD_MODULE", payload: pm });
  }

  function handleRemoveModule(id: string) {
    dispatch({ type: "REMOVE_MODULE", payload: id });
  }

  function handleMoveModule(id: string, wallSide: string, offsetCm: number) {
    dispatch({ type: "MOVE_MODULE", payload: { id, wallSide: wallSide as PlacedModule["wallSide"], offsetCm } });
  }

  function handleMaterialsChange(patch: Partial<MaterialsConfig>) {
    dispatch({ type: "UPDATE_MATERIALS", payload: patch });
  }

  function handlePresetApply(preset: StylePreset) {
    setActivePresetId(preset.id);
    const patch: Partial<MaterialsConfig> = {};
    if (preset.facadeSlug) patch.facadeSlug = preset.facadeSlug;
    if (preset.countertopSlug) patch.countertopSlug = preset.countertopSlug;
    if (preset.skinalSlug) patch.skinalSlug = preset.skinalSlug;
    if (preset.handleSlug) patch.handleSlug = preset.handleSlug;
    if (Object.keys(patch).length) dispatch({ type: "UPDATE_MATERIALS", payload: patch });
    setMaterialsSubTab("materials");
  }

  async function handleSaveToServer() {
    try {
      const sessionId = state.sessionId ?? crypto.randomUUID();
      const res = await fetch("/kapi/configurator-visual/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: state.id,
          sessionId,
          name: state.name,
          roomConfig: state.roomConfig as unknown as Record<string, unknown>,
          modulePlacement: state.placedModules as unknown[],
          materialsConfig: state.materialsConfig as unknown as Record<string, unknown>,
          priceEstimate: state.priceBreakdown.total,
        }),
      });
      const data = await res.json();
      if (data.project) {
        dispatch({
          type: "MARK_SAVED",
          payload: { id: data.project.id, sessionId, savedAt: new Date() },
        });
        return { id: data.project.id };
      }
    } catch {
      // silent
    }
    return null;
  }

  // ── Render step content ─────────────────────────────────
  function renderStep() {
    switch (state.currentStep) {
      case "room":
        return <RoomStep roomConfig={state.roomConfig} warnings={state.warnings} onChange={handleRoomChange} />;
      case "template":
        return <TemplateStep templates={catalog.templates} selectedSlug={state.selectedTemplateSlug} onSelect={handleTemplateSelect} />;
      case "modules":
        return (
          <ModulesStep
            roomConfig={state.roomConfig}
            placedModules={state.placedModules}
            moduleCatalog={catalog.modules}
            warnings={state.warnings}
            onAddModule={handleAddModule}
            onRemoveModule={handleRemoveModule}
            onMoveModule={handleMoveModule}
          />
        );
      case "materials":
        return (
          <div className="space-y-4">
            {/* Sub-tabs: Style Preset / Manual */}
            <div className="flex gap-1 rounded-xl bg-muted p-1 text-sm w-fit">
              {(["style", "materials"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMaterialsSubTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    materialsSubTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab === "style" ? "🎨 Стиль-пресет" : "⚙️ Вручную"}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {materialsSubTab === "style" ? (
                <motion.div key="style" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <StyleStep config={state.materialsConfig} onApplyPreset={handlePresetApply} activePresetId={activePresetId} />
                </motion.div>
              ) : (
                <motion.div key="mat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MaterialsStep
                    facades={catalog.facades}
                    countertops={catalog.countertops}
                    skinals={catalog.skinals}
                    handles={catalog.handles}
                    appliances={catalog.appliances}
                    config={state.materialsConfig}
                    onChange={handleMaterialsChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case "view3d":
        return (
          <View3DStep
            roomConfig={state.roomConfig}
            placedModules={state.placedModules}
            moduleCatalog={catalog.modules}
            facadeCatalog={catalog.facades}
            materialsConfig={state.materialsConfig}
          />
        );
      case "summary":
        return (
          <SummaryStep
            state={state}
            onSaveToServer={handleSaveToServer}
            brandingText={catalog.settings?.exportBrandingText}
            shareTextTemplate={catalog.settings?.shareTextTemplate}
          />
        );
    }
  }

  const stepMeta = STEPS[currentIdx];
  const hasGlobalErrors = selectHasErrors(state);

  return (
    <div className="flex flex-col gap-0 bg-background min-h-[calc(100vh-120px)]">
      {/* Stepper header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="font-bold text-base text-stone-800 flex items-center gap-2">
              <span>{stepMeta.emoji}</span>
              <span>{stepMeta.label}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {state.isDirty && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Loader2 className="w-3 h-3 animate-spin" />не сохранено
                </span>
              )}
              {!state.isDirty && state.lastSavedAt && (
                <span className="text-green-600">✓ сохранено</span>
              )}
              {hasGlobalErrors && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" />ошибки
                </span>
              )}
            </div>
          </div>
          <ConfiguratorStepper
            currentStep={state.currentStep}
            canProceed={canProceed}
            onStepClick={(step) => dispatch({ type: "SET_STEP", payload: step })}
          />
        </div>
      </div>

      {/* Restored from IDB notification */}
      <AnimatePresence>
        {restoredFromIDB && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-green-50 border-b border-green-200 px-4 py-2 text-sm text-green-800 text-center"
          >
            ✓ Восстановлен предыдущий черновик
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation — sticky on mobile */}
      <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur border-t px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Назад</span>
          </button>

          {/* Price indicator */}
          {state.priceBreakdown.total > 0 && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Оценка</p>
              <p className="font-bold text-amber-700">{state.priceBreakdown.total.toLocaleString("ru-RU")} ₽</p>
            </div>
          )}

          <button
            onClick={goNext}
            disabled={currentIdx === STEPS.length - 1 || !canProceed(STEPS[currentIdx + 1]?.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
          >
            <span className="hidden sm:inline">Далее</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
