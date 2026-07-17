"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { ContactForm } from "@/components/sections/ContactForm";

interface LeadFormSheetProps {
  pathname: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function LeadFormSheet({ pathname, triggerRef, onClose }: LeadFormSheetProps) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    setPortal(document.body);
  }, []);

  useEffect(() => {
    if (!portal) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = triggerRef.current || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    document.body.style.overflow = "hidden";

    const focusSheet = () => document.getElementById(titleId)?.focus();
    window.setTimeout(focusSheet, 0);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const sheet = document.getElementById(titleId)?.closest<HTMLElement>("[role='dialog']");
      if (!sheet) return;
      const focusable = Array.from(sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
  }, [onClose, portal, titleId, triggerRef]);

  if (!portal) return null;
  const pageTitle = typeof document === "undefined" ? "Кухни на заказ" : document.title;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[min(92dvh,760px)] w-full overflow-y-auto rounded-t-3xl bg-background p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Свяжемся с вами</p>
            <h2 id={titleId} tabIndex={-1} className="mt-1 font-serif text-2xl font-bold">Оставить заявку</h2>
            <p className="mt-2 text-sm text-muted-foreground">Оставьте имя и номер телефона — уточним задачу и предложим следующий шаг.</p>
          </div>
          <button type="button" onClick={onClose} className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full border border-border" aria-label="Закрыть форму заявки">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5">
          <ContactForm
            source="global-dock"
            sourcePage={pathname}
            sourceType="global-navigation"
            formType="global-dock"
            formLocation="global-dock"
            showCity={false}
            showKitchenType={false}
            showMessenger={false}
            compact
            submitLabel="Отправить заявку"
            defaultAnswers={{ pageUrl: pathname, pageTitle }}
          />
        </div>
      </section>
    </div>,
    portal,
  );
}


