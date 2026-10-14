"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyExploreContext, readExploreContext, writeExploreContext, type ExploreContextValue } from "@/lib/explore-context";
import { trackExplorationEvent } from "@/lib/analytics";
import { useOptionalMaterials } from '@/components/materials/MaterialsSelection';
import { materialById } from '@/data/material-solutions';

interface ExploreContextApi {
  context: ExploreContextValue;
  updateContext: (patch: Partial<ExploreContextValue>, action?: string) => void;
  clearContext: (key?: keyof ExploreContextValue) => void;
}

const Context = createContext<ExploreContextApi | null>(null);

export function ExploreContextProvider({ sourceRoute, children }: { sourceRoute: string; children: ReactNode }) {
  const [context, setContext] = useState(() => emptyExploreContext(sourceRoute));
  const selection = useOptionalMaterials();
  const selectedIds = selection?.state.comparisonIds.join(',') || '';
  useEffect(()=>{if(!selection?.ready)return;setContext(previous=>{const next={...previous,materials:selectedIds.split(',').filter(Boolean).map(id=>materialById(id)!.title)};writeExploreContext(next);return next;});},[selectedIds,selection?.ready]);
  useEffect(() => setContext(readExploreContext(sourceRoute)), [sourceRoute]);
  const updateContext = useCallback((patch: Partial<ExploreContextValue>, action = "") => {
    setContext((previous) => {
      const next = { ...previous, ...patch, sourceRoute, lastMeaningfulAction: action || previous.lastMeaningfulAction };
      writeExploreContext(next);
      return next;
    });
  }, [sourceRoute]);
  const clearContext = useCallback((key?: keyof ExploreContextValue) => {
    setContext((previous) => {
      const next = key ? { ...previous, [key]: undefined } : emptyExploreContext(sourceRoute);
      writeExploreContext(next);
      return next;
    });
    trackExplorationEvent("exploration_context_clear", {
      source_route: sourceRoute,
      selected_dimension: key || "all",
    });
  }, [sourceRoute]);
  const value = useMemo(() => ({ context, updateContext, clearContext }), [clearContext, context, updateContext]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useExploreContext() {
  const value = useContext(Context);
  if (!value) throw new Error("useExploreContext должен использоваться внутри ExploreContextProvider");
  return value;
}

export function useOptionalExploreContext() {
  return useContext(Context);
}
