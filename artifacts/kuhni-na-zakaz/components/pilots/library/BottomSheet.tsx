"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const focusableSelector = "button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";

interface BottomSheetProps { triggerLabel: string; title: string; children: ReactNode; }

export function BottomSheet({ triggerLabel, title, children }: BottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => setHasMounted(true), []);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(focusableSelector);
    first?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setIsOpen(false); return; }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (!controls.length) return;
      const firstControl = controls[0];
      const lastControl = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === firstControl) { event.preventDefault(); lastControl.focus(); }
      else if (!event.shiftKey && document.activeElement === lastControl) { event.preventDefault(); firstControl.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <div data-component="BottomSheet">
      <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)} className="min-h-11 rounded-xl bg-stone-900 px-5 py-3 font-bold text-white">{triggerLabel}</button>
      {hasMounted && isOpen ? createPortal(
        <div className="fixed inset-0 z-[90] flex items-end bg-black/55" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[88svh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:mx-auto sm:max-w-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 id={titleId} className="text-xl font-black">{title}</h2>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Закрыть панель" className="grid h-11 w-11 place-items-center rounded-full border"><X aria-hidden="true" /></button>
            </div>
            {children}
          </div>
        </div>, document.body) : null}
    </div>
  );
}
