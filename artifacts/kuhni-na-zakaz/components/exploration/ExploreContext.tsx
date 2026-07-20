"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyExploreContext, readExploreContext, writeExploreContext, type ExploreContextValue } from "@/lib/explore-context";

interface ExploreContextApi {
  context: ExploreContextValue;
  updateContext: (patch: Partial<ExploreContextValue>, action?: string) => void;
  clearContext: (key?: keyof ExploreContextValue) => void;
}

const Context = createContext<ExploreContextApi | null>(null);

export function ExploreContextProvider({ sourceRoute, children }: { sourceRoute: string; children: ReactNode }) {
  const [context, setContext] = useState(() => emptyExploreContext(sourceRoute));
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
  }, [sourceRoute]);
  const value = useMemo(() => ({ context, updateContext, clearContext }), [clearContext, context, updateContext]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useExploreContext() {
  const value = useContext(Context);
  if (!value) throw new Error("useExploreContext должен использоваться внутри ExploreContextProvider");
  return value;
}
