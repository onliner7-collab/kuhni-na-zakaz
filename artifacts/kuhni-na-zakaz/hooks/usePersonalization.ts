"use client";

import { useEffect, useState, useCallback } from "react";

const SESSION_KEY = "kuhniby_session_id";
const FAVORITES_KEY = "kuhniby_favorites";
const CONFIG_KEY = "kuhniby_saved_config";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export interface SavedConfigData {
  answers: Record<string, string>;
  tags: string[];
  styleSlug: string;
  materialSlug: string;
  scenarioSlug: string;
  budgetLevel: string;
  label: string;
}

export function usePersonalization() {
  const [sessionId, setSessionId] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedConfig, setSavedConfig] = useState<SavedConfigData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);
    // Load favorites from localStorage
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
    // Load saved config from localStorage
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) setSavedConfig(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback(async (caseSlug: string) => {
    if (!sessionId) return;
    const isAdding = !favorites.includes(caseSlug);
    const next = isAdding
      ? [...favorites, caseSlug]
      : favorites.filter(s => s !== caseSlug);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    // Sync to server (best-effort)
    fetch("/kapi/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, caseSlug, action: isAdding ? "add" : "remove" }),
    }).catch(() => {});
  }, [sessionId, favorites]);

  const saveConfig = useCallback(async (data: SavedConfigData) => {
    if (!sessionId) return;
    setSavedConfig(data);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(data));
    // Sync to server
    fetch("/kapi/saved-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...data }),
    }).catch(() => {});
  }, [sessionId]);

  const clearConfig = useCallback(() => {
    setSavedConfig(null);
    localStorage.removeItem(CONFIG_KEY);
  }, []);

  return { sessionId, favorites, isFavorite, toggleFavorite, savedConfig, saveConfig, clearConfig, hydrated };
}
