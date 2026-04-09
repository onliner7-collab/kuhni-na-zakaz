// ──────────────────────────────────────────────────────
// IndexedDB хранилище для автосохранения проекта
// Этап 8: локальное сохранение
// ──────────────────────────────────────────────────────

import type { VisualProjectState } from "./types";

const DB_NAME = "kuhni-configurator";
const DB_VERSION = 1;
const STORE_NAME = "projects";
const AUTOSAVE_KEY = "autosave";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProjectToIDB(state: VisualProjectState): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ key: AUTOSAVE_KEY, data: state, savedAt: new Date().toISOString() });
    await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
  } catch {
    // IndexedDB может быть недоступен (приватный режим, SSR)
  }
}

export async function loadProjectFromIDB(): Promise<VisualProjectState | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(AUTOSAVE_KEY);
    return await new Promise((res, rej) => {
      req.onsuccess = () => res(req.result?.data ?? null);
      req.onerror = () => rej(req.error);
    });
  } catch {
    return null;
  }
}

export async function clearProjectFromIDB(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(AUTOSAVE_KEY);
  } catch {
    // silent
  }
}

/** Сохранение под именованным ключом (список проектов) */
export async function saveNamedProjectToIDB(key: string, state: VisualProjectState): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ key: `project_${key}`, data: state, savedAt: new Date().toISOString() });
    await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
  } catch {
    // silent
  }
}

export async function listNamedProjectsFromIDB(): Promise<{ key: string; name: string; savedAt: string }[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    return await new Promise((res, rej) => {
      req.onsuccess = () => {
        const results = (req.result as { key: string; data: VisualProjectState; savedAt: string }[])
          .filter((r) => r.key.startsWith("project_"))
          .map((r) => ({ key: r.key.slice(8), name: r.data.name, savedAt: r.savedAt }));
        res(results);
      };
      req.onerror = () => rej(req.error);
    });
  } catch {
    return [];
  }
}
