"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/navigation/Link";
import { MATERIAL_PHOTOS } from "@/data/material-hub-gallery";
import {
  MATERIAL_ROUTES,
  MATERIAL_SOLUTIONS,
  materialById,
  materialForRoute,
} from "@/data/material-solutions";
import {
  buildMaterialLink,
  comparisonHref,
  EMPTY_MATERIAL_STATE,
  MATERIAL_STORAGE_KEY,
  readMaterialState,
  reconcileMaterialUrl,
  sanitizeMaterialState,
  safeMaterialReturn,
  writeMaterialState,
  type MaterialState,
} from "@/lib/material-selection";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";

type API = {
  state: MaterialState;
  ready: boolean;
  addToCompare: (id: string, prefer?: boolean) => void;
  removeFromCompare: (id: string) => void;
  setPreferred: (id: string) => void;
  clearMaterialsSelection: () => void;
  updateView: (patch: Partial<MaterialState>) => void;
  openComparison: () => void;
};
const Context = createContext<API | null>(null);
export const materialButton =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:border-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:opacity-50";
export function useMaterials() {
  const c = useContext(Context);
  if (!c) throw Error("Требуется MaterialsSelectionProvider");
  return c;
}
export function useOptionalMaterials() {
  return useContext(Context);
}
export function MaterialsSubmitPreview() {
  const context = useOptionalMaterials();
  const [local, setLocal] = useState(EMPTY_MATERIAL_STATE);
  useEffect(() => setLocal(readMaterialState()), []);
  const s = context?.state || local;
  return (
    <div className="mb-4 rounded-xl bg-violet-50 p-4 text-sm leading-6">
      <p className="font-bold">Варианты для расчёта</p>
      <p>
        {s.comparisonIds.length
          ? s.comparisonIds.map((id) => materialById(id)!.title).join(", ")
          : "Помогите выбрать материал"}
      </p>
      {s.preferredId && (
        <p>Предпочитаю: {materialById(s.preferredId)?.title}</p>
      )}
    </div>
  );
}
export function MaterialsSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<MaterialState>(EMPTY_MATERIAL_STATE);
  const ref = useRef(state);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState<{
    id: string;
    prefer: boolean;
  } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  function publish(next: MaterialState) {
    ref.current = next;
    setState(next);
    writeMaterialState(next);
  }
  function updateView(patch: Partial<MaterialState>) {
    const next = { ...ref.current, ...patch };
    if ("galleryFilters" in patch || "onlyDifferences" in patch || ("mdfGallery" in patch && (patch.mdfGallery?.material !== ref.current.mdfGallery.material || patch.mdfGallery?.layout !== ref.current.mdfGallery.layout))) {
      const view = (s: MaterialState) => ({
        galleryFilters: s.galleryFilters,
        galleryLimit: s.galleryLimit,
        activePhoto: s.activePhoto,
        onlyDifferences: s.onlyDifferences,
        mdfGallery: s.mdfGallery,
      });
      history.replaceState(
        { ...history.state, materialsView: view(ref.current) },
        "",
        location.href,
      );
      history.pushState(
        { ...history.state, materialsView: view(next) },
        "",
        location.href,
      );
    }
    publish(next);
  }
  useEffect(() => {
    function load() {
      const before = readMaterialState();
      const p = new URLSearchParams(location.search);
      const raw = (p.get("compare") || "").split(",").filter(Boolean);
      if (raw.some((id) => !materialById(id)))
        setNotice("Неизвестные варианты удалены из сравнения.");
      const historical = history.state?.materialsView;
      const view =
        historical && typeof historical === "object"
          ? sanitizeMaterialState({ ...before, ...historical })
          : before;
      const next = {
        ...before,
        galleryFilters: view.galleryFilters,
        galleryLimit: view.galleryLimit,
        activePhoto: view.activePhoto,
        onlyDifferences: view.onlyDifferences,
        mdfGallery: view.mdfGallery,
        recentViews: [
          pathname,
          ...before.recentViews.filter((v) => v !== pathname),
        ].slice(0, 10),
      };
      publish(next);
      setReady(true);
    }
    function sync(e: StorageEvent) {
      if (
        e.key !== MATERIAL_STORAGE_KEY ||
        new URLSearchParams(location.search).has("compare")
      )
        return;
      try {
        publish(
          sanitizeMaterialState(
            e.newValue ? JSON.parse(e.newValue) : EMPTY_MATERIAL_STATE,
          ),
        );
      } catch {
        /* Keep this tab usable. */
      }
    }
    load();
    window.addEventListener("popstate", load);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("popstate", load);
      window.removeEventListener("storage", sync);
    };
  }, [pathname]);
  useEffect(() => {
    if (pending) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      previousFocus.current?.focus();
    }
  }, [pending]);
  function explicit(next: MaterialState, action: string, id = "") {
    const old = new URL(location.href);
    if (!old.searchParams.has("compare")) {
      old.searchParams.set("compare", ref.current.comparisonIds.join(","));
      if (ref.current.preferredId)
        old.searchParams.set("preferred", ref.current.preferredId);
      history.replaceState(
        history.state,
        "",
        old.pathname + old.search + old.hash,
      );
    }
    const value = { ...next, updatedAt: Date.now() };
    publish(value);
    const u = new URL(location.href);
    u.searchParams.set("compare", value.comparisonIds.join(","));
    if (value.preferredId) u.searchParams.set("preferred", value.preferredId);
    else u.searchParams.delete("preferred");
    history.pushState(null, "", u.pathname + u.search + u.hash);
    setNotice(
      action === "remove"
        ? "Вариант удалён"
        : action === "clear"
          ? "Сравнение очищено"
          : `Сохранено: ${materialById(id)?.title || "сравнение"}`,
    );
    try {
      trackAnalyticsEvent(ANALYTICS_EVENTS.EXPLORATION_SELECT, {
        action: `materials_${action}`,
        material_id: id,
        comparison_count: value.comparisonIds.length,
      });
    } catch {
      /* Analytics does not block a choice. */
    }
  }
  function addToCompare(id: string, prefer = false) {
    if (!materialById(id)) return;
    const s = ref.current;
    if (s.comparisonIds.includes(id)) {
      if (prefer) explicit({ ...s, preferredId: id }, "preferred", id);
      return;
    }
    if (s.comparisonIds.length === 3) {
      setPending({ id, prefer });
      return;
    }
    explicit(
      {
        ...s,
        comparisonIds: [...s.comparisonIds, id],
        preferredId: prefer ? id : s.preferredId,
      },
      prefer ? "preferred" : "add",
      id,
    );
  }
  function removeFromCompare(id: string) {
    const s = ref.current;
    explicit(
      {
        ...s,
        comparisonIds: s.comparisonIds.filter((x) => x !== id),
        preferredId: s.preferredId === id ? null : s.preferredId,
      },
      "remove",
      id,
    );
  }
  function openComparison() {
    location.assign(comparisonHref(ref.current));
  }
  const value: API = {
    state,
    ready,
    addToCompare,
    removeFromCompare,
    setPreferred: (id) => addToCompare(id, true),
    clearMaterialsSelection: () =>
      explicit(
        { ...ref.current, comparisonIds: [], preferredId: null },
        "clear",
      ),
    updateView,
    openComparison,
  };
  const isMaterial = (MATERIAL_ROUTES as readonly string[]).includes(pathname);
  const current = materialForRoute(pathname);
  return (
    <Context.Provider value={value}>
      {isMaterial && (
        <div className="container-site pt-4">
          <div
            className="rounded-2xl border border-violet-200 bg-violet-50 p-4"
              data-testid="materials-selection"
              inert={!ready}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {!ready
                  ? "Сравнение материалов"
                  : state.comparisonIds.length
                    ? `В сравнении: ${state.comparisonIds.length} из 3`
                    : "Добавьте варианты, чтобы сравнить"}
              </p>
              <Link className={materialButton} href={comparisonHref(state)}>
                Моё сравнение
                {state.comparisonIds.length
                  ? ` (${state.comparisonIds.length})`
                  : ""}
              </Link>
            </div>
            {ready && state.comparisonIds.length > 0 && (
              <details className="mt-2">
                <summary className="min-h-11 cursor-pointer py-3 text-sm">
                  {state.comparisonIds
                    .map((id) => materialById(id)!.title)
                    .join(", ")}
                  {state.preferredId &&
                    ` · Предпочитаю: ${materialById(state.preferredId)!.title}`}
                </summary>
                <ul className="grid gap-2">
                  {state.comparisonIds.map((id) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-2"
                    >
                      <Link
                        className="py-3 text-sm underline"
                        href={buildMaterialLink(
                          state,
                          materialById(id)!.href,
                          true,
                        )}
                      >
                        {materialById(id)!.title}
                      </Link>
                      <button
                        className={materialButton}
                        onClick={() => removeFromCompare(id)}
                        aria-label={`Удалить ${materialById(id)!.title}`}
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className={`${materialButton} mt-3`}
                  onClick={value.clearMaterialsSelection}
                >
                  Очистить сравнение материалов
                </button>
              </details>
            )}
            {pathname !== "/materials" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  className={materialButton}
                  href={comparisonHref(state, "/materials", "#gallery")}
                >
                  Все материалы
                </Link>
                <Link
                  className={materialButton}
                  href={comparisonHref(
                    state,
                    safeMaterialReturn(
                      new URLSearchParams(
                        typeof window === "undefined" ? "" : location.search,
                      ).get("returnTo") || state.returnTo,
                    )
                      .split("?")[0]
                      .split("#")[0],
                  )}
                >
                  Вернуться к сравнению
                </Link>
                {current && pathname !== '/materials/mdf-fasady' && <SelectionButtons id={current.id} />}
              </div>
            )}
          </div>
        </div>
      )}
      {isMaterial && <p
        role="status"
        aria-live="polite"
        className="container-site my-2 text-sm text-violet-900"
      >
        {notice}
      </p>}
      {children}
      {isMaterial && (
        <div className="container-site pb-10">
          <nav
            aria-label="Другие материалы"
            inert={!ready}
            className="rounded-2xl bg-stone-100 p-5"
          >
            <h2 className="text-xl font-bold">Другие материалы</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {MATERIAL_ROUTES.map((route) => (
                <Link
                  key={route}
                  aria-current={pathname === route ? "page" : undefined}
                  className={`${materialButton} ${pathname === route ? "border-violet-700 bg-violet-50" : ""}`}
                  href={buildMaterialLink(state, route)}
                >
                  {route === "/materials"
                    ? "Все материалы"
                    : route === "/materials/mdf-fasady"
                      ? "МДФ и плёнка"
                      : materialForRoute(route)?.title}
                </Link>
              ))}
            </div>
          </nav>
          <RecentMaterials />
        </div>
      )}
      <dialog
        ref={dialog}
        onCancel={() => setPending(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPending(null);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-6 backdrop:bg-black/50"
        aria-labelledby="replace-material-title"
      >
        <h2 id="replace-material-title" className="text-xl font-bold">
          В сравнении уже три варианта
        </h2>
        <p className="mt-2 text-sm">
          Выберите, какой заменить на «
          {pending && materialById(pending.id)?.title}». До подтверждения ваш
          выбор сохранится.
        </p>
        <div className="mt-4 grid gap-3">
          {state.comparisonIds.map((id) => (
            <button
              key={id}
              className={materialButton}
              onClick={() => {
                if (!pending) return;
                const s = ref.current;
                const ids = s.comparisonIds.map((x) =>
                  x === id ? pending.id : x,
                );
                explicit(
                  {
                    ...s,
                    comparisonIds: ids,
                    preferredId: pending.prefer
                      ? pending.id
                      : s.preferredId === id
                        ? null
                        : s.preferredId,
                  },
                  "replace",
                  pending.id,
                );
                setPending(null);
              }}
            >
              Заменить {materialById(id)!.title}
            </button>
          ))}
          <button className={materialButton} onClick={() => setPending(null)}>
            Отмена
          </button>
        </div>
      </dialog>
    </Context.Provider>
  );
}
export function SelectionButtons({ id }: { id: string }) {
  const { state, ready, addToCompare, setPreferred } = useMaterials();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        disabled={!ready}
        aria-pressed={state.comparisonIds.includes(id)}
        className={materialButton}
        onClick={() => addToCompare(id)}
      >
        {state.comparisonIds.includes(id)
          ? "В сравнении"
          : "Добавить к сравнению"}
      </button>
      <button
        disabled={!ready}
        className={materialButton}
        aria-pressed={state.preferredId === id}
        onClick={() => setPreferred(id)}
      >
        {state.preferredId === id
          ? "Предпочитаю ✓"
          : "Предпочитаю этот вариант"}
      </button>
    </div>
  );
}
export function MaterialDetailsLink({
  id,
  children,
  fromComparison = false,
  anchor,
}: {
  id: string;
  children?: ReactNode;
  fromComparison?: boolean;
  anchor?: "#material-explorer" | "#material-detail-gallery";
}) {
  const { state, ready } = useMaterials();
  const item = materialById(id);
  const href = item ? (anchor ? item.href.split("#")[0] + anchor : item.href) : "";
  return item ? (
    <Link
      className="inline-flex min-h-11 items-center font-semibold text-violet-800 underline underline-offset-4"
      href={ready ? buildMaterialLink(state, href, fromComparison) : href}
      aria-disabled={!ready}
      tabIndex={ready ? undefined : -1}
      onClick={event=>{if(!ready)event.preventDefault();}}
    >
      {children || "Подробнее о материале →"}
    </Link>
  ) : null;
}
export function RecentMaterials() {
  const { state, updateView } = useMaterials();
  const routes = state.recentViews.filter(
    (v) =>
      ((MATERIAL_ROUTES as readonly string[]).includes(v) &&
        v !== "/materials") ||
      MATERIAL_PHOTOS.some((p) => p.id === v),
  );
  if (!routes.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold">Вы недавно смотрели</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {routes.map((route) => {
          const m = materialForRoute(route);
          const photo = MATERIAL_PHOTOS.find((p) => p.id === route);
          if (photo)
            return (
              <Link
                key={route}
                className="flex min-h-16 items-center gap-3 rounded-xl border p-3 text-sm"
                href={comparisonHref(state, "/materials", "#gallery")}
                onClick={() =>
                  updateView({
                    galleryFilters: {},
                    galleryLimit: Math.max(
                      12,
                      MATERIAL_PHOTOS.findIndex((p) => p.id === route) + 1,
                    ),
                    activePhoto: photo.id,
                  })
                }
              >
                <img
                  src={photo.src}
                  alt=""
                  width={72}
                  height={48}
                  loading="lazy"
                  className="h-12 w-18 rounded-lg object-cover"
                />
                <span>{photo.alt}</span>
              </Link>
            );
          return (
            m && (
              <Link
                key={route}
                className="flex min-h-16 items-center gap-3 rounded-xl border p-3"
                href={buildMaterialLink(state, route)}
              >
                <img
                  src={m.image}
                  alt=""
                  width={72}
                  height={48}
                  loading="lazy"
                  className="h-12 w-18 rounded-lg object-cover"
                />
                {m.title}
              </Link>
            )
          );
        })}
      </div>
    </section>
  );
}
