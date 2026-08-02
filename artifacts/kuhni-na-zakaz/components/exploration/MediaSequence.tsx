"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PilotMedia } from "@/components/pilots/library/types";

export function MediaSequence({
  items,
  label,
  eagerInitial = true,
}: {
  items: PilotMedia[];
  label: string;
  eagerInitial?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  if (!items.length)
    return (
      <p
        role="status"
        className="rounded-2xl border border-dashed p-4 text-sm text-stone-600"
      >
        Изображения для этой последовательности пока не подготовлены.
      </p>
    );
  const active = items[Math.min(index, items.length - 1)];
  const src = active.webp || active.avif;
  return (
    <section
      data-component="MediaSequence"
      aria-label={label}
      className="space-y-3"
    >
      <figure className="overflow-hidden rounded-3xl border bg-white">
        <div className="aspect-[3/2] bg-stone-100">
          {failed || !src ? (
            <div
              role="status"
              className="grid h-full place-items-center p-6 text-center text-sm text-stone-600"
            >
              Не удалось загрузить этот ракурс. Выберите соседний кадр или
              продолжите по текстовому описанию.
            </div>
          ) : (
            <img
              src={src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              loading={index === 0 && eagerInitial ? "eager" : "lazy"}
              decoding="async"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover motion-reduce:transition-none"
            />
          )}
        </div>
        <figcaption className="p-4 text-sm text-stone-700">
          {active.caption || active.alt}
        </figcaption>
      </figure>
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-bold">
          {index + 1} / {items.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setFailed(false);
              setIndex(Math.max(0, index - 1));
            }}
            disabled={index === 0}
            aria-label="Предыдущий кадр"
            className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setFailed(false);
              setIndex(Math.min(items.length - 1, index + 1));
            }}
            disabled={index === items.length - 1}
            aria-label="Следующий кадр"
            className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-40"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
