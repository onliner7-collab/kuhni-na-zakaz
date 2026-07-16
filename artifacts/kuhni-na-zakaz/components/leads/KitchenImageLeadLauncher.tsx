"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calculator, Share2, X } from "lucide-react";

interface ImageTarget {
  element: HTMLImageElement;
  key: string;
  alt: string;
  src: string;
  imageId: string;
  kitchenId: string;
  top: number;
  left: number;
}

interface LeadFormState {
  name: string;
  phone: string;
  city: string;
  dimensions: string;
  comment: string;
  agreement: boolean;
}

const EMPTY_FORM: LeadFormState = {
  name: "",
  phone: "",
  city: "",
  dimensions: "",
  comment: "",
  agreement: false,
};

export function KitchenImageLeadLauncher() {
  const [targets, setTargets] = useState<ImageTarget[]>([]);
  const [selected, setSelected] = useState<ImageTarget | null>(null);
  const [shareTarget, setShareTarget] = useState<ImageTarget | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [form, setForm] = useState<LeadFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successNumber, setSuccessNumber] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shareDialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    let frame = 0;
    function scheduleScan() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setTargets(scanKitchenImages()));
    }

    const observer = new MutationObserver(scheduleScan);
    const contentRoot = document.querySelector("main");
    if (contentRoot) {
      observer.observe(contentRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "alt"] });
    }
    document.addEventListener("scroll", scheduleScan, { passive: true, capture: true });
    window.addEventListener("resize", scheduleScan);
    document.addEventListener("load", scheduleScan, true);
    scheduleScan();
    return () => {
      observer.disconnect();
      document.removeEventListener("scroll", scheduleScan, true);
      window.removeEventListener("resize", scheduleScan);
      document.removeEventListener("load", scheduleScan, true);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!selected && !shareTarget) return;
    const activeDialogRef = selected ? dialogRef : shareDialogRef;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.setTimeout(() => activeDialogRef.current?.querySelector<HTMLElement>("input, button, a")?.focus(), 0);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (selected) closeDialog();
        else setShareTarget(null);
      }
      if (event.key !== "Tab" || !activeDialogRef.current) return;
      const items = Array.from(activeDialogRef.current.querySelectorAll<HTMLElement>("button, a, input, textarea, [tabindex]:not([tabindex='-1'])"))
        .filter((item) => !item.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [selected, shareTarget]);

  const portal = useMemo(() => (typeof document === "undefined" ? null : document.body), []);
  if (!portal) return null;

  function openDialog(target: ImageTarget) {
    setSelected(target);
    setForm(EMPTY_FORM);
    setError("");
    setSuccessNumber(null);
  }

  function closeDialog() {
    if (isSubmitting) return;
    setSelected(null);
    setError("");
  }

  async function shareKitchen(target: ImageTarget) {
    const shareData = getShareData(target);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      }
    }
    setShareCopied(false);
    setShareTarget(target);
  }

  async function copyShareLink() {
    if (!shareTarget) return;
    try {
      await navigator.clipboard.writeText(getShareData(shareTarget).url);
      setShareCopied(true);
    } catch {
      setShareCopied(false);
    }
  }

  async function submit(continueInTelegram: boolean) {
    if (!selected) return;
    if (form.name.trim().length < 2) {
      setError("Укажите имя.");
      return;
    }
    if (!continueInTelegram && form.phone.replace(/\D/g, "").length < 7) {
      setError("Для заявки без Telegram нужен корректный телефон.");
      return;
    }
    if (!form.agreement) {
      setError("Подтвердите согласие на обработку персональных данных.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/kapi/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          continueInTelegram,
          preferredContact: continueInTelegram ? "telegram" : "phone",
          agreement: form.agreement,
          source: "kitchen-image",
          formType: "catalog",
          sourceType: "kitchen_gallery",
          sourcePage: window.location.href,
          sourceBlock: "Изображение кухни",
          kitchenType: selected.alt,
          kitchenId: selected.kitchenId,
          imageId: selected.imageId,
          imageUrl: selected.src,
          referrer: document.referrer,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Не удалось отправить заявку");
      if (continueInTelegram && typeof result.telegramUrl === "string") {
        window.location.assign(result.telegramUrl);
        return;
      }
      setSuccessNumber(typeof result.publicNumber === "number" ? result.publicNumber : null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <>
      <div className="pointer-events-none fixed inset-0 z-[65]" aria-hidden={Boolean(selected || shareTarget)} data-testid="kitchen-image-lead-layer">
        {targets.map((target) => (
          <div
            key={target.key}
            className="pointer-events-auto fixed flex items-center gap-2"
            data-testid="kitchen-image-action-group"
            style={{ top: target.top, left: target.left }}
          >
            <button
              type="button"
              className="inline-flex min-h-10 max-w-[calc(100vw-4.5rem)] items-center gap-1.5 rounded-full bg-stone-950/92 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-lg ring-1 ring-white/30 backdrop-blur hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:px-3 md:text-xs"
              onClick={() => openDialog(target)}
              aria-label={`Рассчитать эту кухню: ${target.alt}`}
            >
              <Calculator className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Хочу такую
            </button>
            <button
              type="button"
              className="grid min-h-10 min-w-10 place-items-center rounded-full bg-white/95 text-stone-950 shadow-lg ring-1 ring-stone-300 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              onClick={() => shareKitchen(target)}
              aria-label={`Поделиться: ${target.alt}`}
              title="Поделиться"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {shareTarget && (
        <div className="fixed inset-0 z-[91] flex items-end justify-center bg-black/65 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && setShareTarget(null)}>
          <div ref={shareDialogRef} role="dialog" aria-modal="true" aria-label="Поделиться кухней" className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-950">Поделиться кухней</h2>
                <p className="mt-2 line-clamp-2 text-sm text-stone-600">{shareTarget.alt}</p>
              </div>
              <button type="button" onClick={() => setShareTarget(null)} className="grid min-h-11 min-w-11 place-items-center rounded-full border border-stone-200" aria-label="Закрыть меню отправки">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              <a href={getTelegramShareUrl(shareTarget)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-600 px-4 py-3 font-bold text-white">Отправить в Telegram</a>
              <button type="button" onClick={copyShareLink} className="min-h-12 rounded-xl bg-stone-950 px-4 py-3 font-bold text-white">Скопировать ссылку</button>
            </div>
            {shareCopied && <p className="mt-3 text-center text-sm font-semibold text-emerald-700" role="status">Ссылка скопирована</p>}
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Вы выбрали конкретную кухню</p>
                <h2 id={titleId} className="mt-1 font-serif text-2xl font-bold text-stone-950">Рассчитать выбранную кухню</h2>
              </div>
              <button type="button" onClick={closeDialog} className="grid min-h-11 min-w-11 place-items-center rounded-full border border-stone-200" aria-label="Закрыть форму">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <figure className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
              <img
                src={selected.src}
                alt={selected.alt}
                width="720"
                height="480"
                className="aspect-[3/2] w-full object-cover"
              />
              <figcaption className="p-3 text-sm leading-5 text-stone-700">
                <span className="block font-bold text-stone-950">Именно эта кухня будет прикреплена к заявке</span>
                <span className="mt-1 block line-clamp-2">{selected.alt}</span>
              </figcaption>
            </figure>

            {successNumber !== null ? (
              <div className="py-10 text-center" role="status">
                <p className="text-4xl" aria-hidden="true">✓</p>
                <p className="mt-3 text-xl font-bold">Заявка №{successNumber} сохранена</p>
                <p className="mt-2 text-sm text-stone-600">Дмитрий или Александр свяжется с вами выбранным способом.</p>
                <button type="button" onClick={closeDialog} className="mt-6 min-h-11 rounded-xl bg-stone-950 px-5 py-3 font-bold text-white">Закрыть</button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <Field label="Имя *"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" className={inputClass} /></Field>
                <Field label="Телефон"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" className={inputClass} /></Field>
                <Field label="Город"><input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} autoComplete="address-level2" placeholder="Минск" className={inputClass} /></Field>
                <Field label="Примерные размеры"><input value={form.dimensions} onChange={(event) => setForm({ ...form, dimensions: event.target.value })} placeholder="Например: 3,2 × 2,4 м" className={inputClass} /></Field>
                <Field label="Комментарий"><textarea value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} rows={3} className={inputClass} /></Field>
                <label className="flex items-start gap-3 rounded-xl bg-stone-100 p-3 text-xs leading-5 text-stone-600">
                  <input type="checkbox" checked={form.agreement} onChange={(event) => setForm({ ...form, agreement: event.target.checked })} className="mt-1 h-4 w-4 accent-stone-950" />
                  <span>Согласен на <a href="/personal-data" className="font-semibold underline">обработку персональных данных</a> и с <a href="/privacy-policy" className="font-semibold underline">политикой обработки данных</a>.</span>
                </label>
                {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" disabled={isSubmitting} onClick={() => submit(true)} className="min-h-12 rounded-xl bg-sky-600 px-4 py-3 font-bold text-white disabled:opacity-60">Продолжить в Telegram</button>
                  <button type="button" disabled={isSubmitting} onClick={() => submit(false)} className="min-h-12 rounded-xl bg-stone-950 px-4 py-3 font-bold text-white disabled:opacity-60">Отправить без Telegram</button>
                </div>
                <p className="text-xs leading-5 text-stone-500">При переходе в Telegram телефон можно не указывать. Без Telegram телефон обязателен.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    portal,
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-stone-800">{label}{children}</label>;
}

const inputClass = "mt-1 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-base font-normal outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-200";

function scanKitchenImages(): ImageTarget[] {
  return Array.from(document.querySelectorAll<HTMLImageElement>("main img"))
    .filter(isEligibleKitchenImage)
    .map((element, index) => {
      const rect = element.getBoundingClientRect();
      const src = element.currentSrc || element.src;
      const alt = element.alt.trim() || "Изображение кухни";
      const linkedPath = element.closest<HTMLAnchorElement>("a[href]")?.getAttribute("href") || "";
      const imageId = getImageId(src, index);
      return {
        element,
        key: `${imageId}:${Math.round(rect.top)}:${Math.round(rect.left)}`,
        alt,
        src,
        imageId,
        kitchenId: linkedPath || window.location.pathname,
        top: Math.max(8, Math.min(window.innerHeight - 48, rect.top + rect.height / 2 - 20)),
        left: Math.max(8, Math.min(window.innerWidth - (window.innerWidth < 640 ? 184 : 205), rect.right - (window.innerWidth < 640 ? 176 : 197))),
      };
    });
}

function getShareData(target: ImageTarget) {
  return {
    title: target.alt,
    text: `${target.alt}\nИзображение: ${target.src}`,
    url: window.location.href,
  };
}

function getTelegramShareUrl(target: ImageTarget): string {
  const data = getShareData(target);
  return `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`;
}

function isEligibleKitchenImage(image: HTMLImageElement): boolean {
  if (window.location.pathname.startsWith("/materials")) return false;
  if (image.closest("[data-no-kitchen-lead], header, footer, [role='dialog']")) return false;
  if (isPrimaryPageVisual(image)) return false;
  const alt = image.alt.trim().toLowerCase();
  const source = (image.currentSrc || image.src).toLowerCase();
  const kitchenWords = ["кухн", "гарнитур"];
  const detailWords = ["материал", "фурнитур", "механизм", "петл", "направляющ", "ящик", "ручк", "образец", "текстур", "кромк", "профиль", "макро", "крупным планом", "фасад", "столешниц", "фартук", "хранен", "техник", "подсвет", "рабочая зон", "рабочая поверх", "мойк", "шкаф", "полк", "внутри", "компоновк", "детал"];
  const detailSourceWords = ["/materials", "furnitur", "fasady-krupno", "facade-detail", "stolesh", "countertop", "yashch", "drawer", "tehnik", "podsvet", "lighting", "hranenie", "mechan", "hardware", "detail", "macro"];
  const isVerifiedKitchenGallery = Boolean(image.closest("[data-kitchen-lead-gallery]"));
  if (!kitchenWords.some((word) => alt.includes(word))) return false;
  if (!isVerifiedKitchenGallery && (detailWords.some((word) => alt.includes(word)) || detailSourceWords.some((word) => source.includes(word)))) return false;
  if (!isVisuallyDisplayed(image)) return false;
  const rect = image.getBoundingClientRect();
  if (rect.width < 220 || rect.height < 150 || rect.bottom < 0 || rect.top > window.innerHeight) return false;
  const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const horizontalVisibility = visibleWidth / Math.min(rect.width, window.innerWidth);
  if (horizontalVisibility < 0.6) return false;
  const excludes = ["logo", "логотип", "avatar", "аватар", "map", "карта", "icon", "икон", "review", "отзыв", "person", "человек"];
  return !excludes.some((word) => alt.includes(word));
}

function isPrimaryPageVisual(image: HTMLImageElement): boolean {
  const contentSection = image.closest("section, article");
  if (contentSection?.querySelector("h1")) return true;

  const source = (image.currentSrc || image.src).toLowerCase();
  const documentTop = image.getBoundingClientRect().top + window.scrollY;
  return source.includes("hero") && documentTop < Math.max(1200, window.innerHeight * 1.5);
}

function isVisuallyDisplayed(image: HTMLImageElement): boolean {
  let element: HTMLElement | null = image;
  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number.parseFloat(style.opacity || "1") < 0.1) return false;
    if (element.hidden || element.getAttribute("aria-hidden") === "true") return false;
    element = element.parentElement;
  }
  return true;
}

function getImageId(src: string, index: number): string {
  try {
    const url = new URL(src, window.location.origin);
    const source = url.searchParams.get("src") || url.pathname;
    return decodeURIComponent(source.split("/").pop() || `image-${index + 1}`).slice(0, 150);
  } catch {
    return `image-${index + 1}`;
  }
}
