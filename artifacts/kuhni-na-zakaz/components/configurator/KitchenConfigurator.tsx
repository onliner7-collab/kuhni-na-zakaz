"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import {
  configuratorReducer,
  createInitialState,
  selectCanProceedToStep,
  selectHasErrors,
} from "@/lib/kitchen-configurator/store";
import { checkCompatibility } from "@/lib/kitchen-configurator/compatibility";
import { calculatePrice } from "@/lib/kitchen-configurator/price";
import { loadProjectFromIDB, saveProjectToIDB } from "@/lib/kitchen-configurator/idb-storage";
import type {
  CatalogAppliance,
  CatalogCountertop,
  CatalogFacade,
  CatalogHandle,
  CatalogModule,
  CatalogSkinal,
  CatalogTemplate,
  ConfiguratorStep,
  MaterialsConfig,
  PlacedModule,
  RoomConfig,
} from "@/lib/kitchen-configurator";
import type { StylePreset } from "@/lib/kitchen-configurator/style-presets";

import { ConfiguratorStepper, STEPS } from "./ConfiguratorStepper";
import { MaterialsStep } from "./steps/MaterialsStep";
import { ModulesStep } from "./steps/ModulesStep";
import { RoomStep } from "./steps/RoomStep";
import { StyleStep } from "./steps/StyleStep";
import { SummaryStep } from "./steps/SummaryStep";
import { TemplateStep } from "./steps/TemplateStep";
import { View3DStep } from "./steps/View3DStep";

interface Catalog {
  modules: CatalogModule[];
  templates: CatalogTemplate[];
  facades: CatalogFacade[];
  countertops: CatalogCountertop[];
  skinals: CatalogSkinal[];
  handles: CatalogHandle[];
  appliances: CatalogAppliance[];
  settings?: {
    shareTextTemplate: string;
    exportBrandingText: string;
    defaultRoomWidthCm: number;
    defaultRoomDepthCm: number;
    defaultRoomHeightCm: number;
  } | null;
}

interface KitchenConfiguratorProps {
  catalog: Catalog;
}

const AUTOSAVE_INTERVAL_MS = 8000;

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
  const autosaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadProjectFromIDB().then((saved) => {
      if (!saved) return;
      dispatch({ type: "LOAD_PROJECT", payload: saved });
      setRestoredFromIDB(true);
      setTimeout(() => setRestoredFromIDB(false), 3500);
    });
  }, []);

  useEffect(() => {
    if (autosaveTimer.current) clearInterval(autosaveTimer.current);
    autosaveTimer.current = setInterval(() => {
      if (state.isDirty) saveProjectToIDB(state);
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      if (autosaveTimer.current) clearInterval(autosaveTimer.current);
    };
  }, [state]);

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

  const currentIdx = STEPS.findIndex((s) => s.key === state.currentStep);
  const stepMeta = STEPS[currentIdx] ?? STEPS[0];
  const hasGlobalErrors = selectHasErrors(state);

  const canProceed = useCallback(
    (step: ConfiguratorStep) => selectCanProceedToStep(state, step),
    [state],
  );

  function goPrev() {
    if (currentIdx > 0) dispatch({ type: "SET_STEP", payload: STEPS[currentIdx - 1].key });
  }

  function goNext() {
    const next = STEPS[currentIdx + 1];
    if (next && canProceed(next.key)) dispatch({ type: "SET_STEP", payload: next.key });
  }

  function handlePresetApply(preset: StylePreset) {
    setActivePresetId(preset.id);
    const patch: Partial<MaterialsConfig> = {};
    if (preset.facadeSlug) patch.facadeSlug = preset.facadeSlug;
    if (preset.countertopSlug) patch.countertopSlug = preset.countertopSlug;
    if (preset.skinalSlug) patch.skinalSlug = preset.skinalSlug;
    if (preset.handleSlug) patch.handleSlug = preset.handleSlug;
    dispatch({ type: "UPDATE_MATERIALS", payload: patch });
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
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.project) return null;
      dispatch({ type: "MARK_SAVED", payload: { id: data.project.id, sessionId, savedAt: new Date() } });
      return { id: data.project.id };
    } catch {
      return null;
    }
  }

  function renderStep() {
    switch (state.currentStep) {
      case "room":
        return (
          <RoomStep
            roomConfig={state.roomConfig}
            warnings={state.warnings}
            onChange={(patch: Partial<RoomConfig>) => dispatch({ type: "UPDATE_ROOM", payload: patch })}
          />
        );
      case "template":
        return (
          <TemplateStep
            templates={catalog.templates}
            selectedSlug={state.selectedTemplateSlug}
            onSelect={(template) => dispatch({ type: "APPLY_TEMPLATE", payload: template })}
          />
        );
      case "modules":
        return (
          <ModulesStep
            roomConfig={state.roomConfig}
            placedModules={state.placedModules}
            moduleCatalog={catalog.modules}
            warnings={state.warnings}
            onAddModule={(module) => dispatch({ type: "ADD_MODULE", payload: module })}
            onRemoveModule={(id) => dispatch({ type: "REMOVE_MODULE", payload: id })}
            onMoveModule={(id, wallSide, offsetCm) =>
              dispatch({ type: "MOVE_MODULE", payload: { id, wallSide: wallSide as PlacedModule["wallSide"], offsetCm } })
            }
          />
        );
      case "materials":
        return (
          <div className="space-y-4">
            <div className="inline-flex rounded-lg bg-muted p-1 text-sm">
              {(["style", "materials"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMaterialsSubTab(tab)}
                  className={`rounded-md px-4 py-2 font-semibold transition-all ${
                    materialsSubTab === tab ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "style" ? "Стиль-пресет" : "Вручную"}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {materialsSubTab === "style" ? (
                <motion.div key="style" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <StyleStep config={state.materialsConfig} onApplyPreset={handlePresetApply} activePresetId={activePresetId} />
                </motion.div>
              ) : (
                <motion.div key="materials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MaterialsStep
                    facades={catalog.facades}
                    countertops={catalog.countertops}
                    skinals={catalog.skinals}
                    handles={catalog.handles}
                    appliances={catalog.appliances}
                    config={state.materialsConfig}
                    onChange={(patch) => dispatch({ type: "UPDATE_MATERIALS", payload: patch })}
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

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col bg-background">
      <div className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-stone-900">{stepMeta.label}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {state.isDirty && (
                <span className="flex items-center gap-1 text-amber-700">
                  <Loader2 className="h-3 w-3 animate-spin" /> не сохранено
                </span>
              )}
              {!state.isDirty && state.lastSavedAt && <span className="text-emerald-700">сохранено</span>}
              {hasGlobalErrors && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="h-3 w-3" /> есть ошибки
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

      <AnimatePresence>
        {restoredFromIDB && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-800"
          >
            Восстановлен предыдущий черновик
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-6xl">
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

      <div className="sticky bottom-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIdx === 0}
            aria-label="Назад"
            className="flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Назад</span>
          </button>

          {state.priceBreakdown.total > 0 && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Оценка</p>
              <p className="font-extrabold text-amber-700">{state.priceBreakdown.total.toLocaleString("ru-RU")} ₽</p>
            </div>
          )}

          <button
            type="button"
            onClick={goNext}
            disabled={currentIdx === STEPS.length - 1 || !canProceed(STEPS[currentIdx + 1]?.key)}
            aria-label={currentIdx === STEPS.length - 2 ? "К итогу" : "Далее"}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">{currentIdx === STEPS.length - 2 ? "К итогу" : "Далее"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
