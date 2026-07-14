"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { MediaPicture } from "./MediaPicture";
import type { PilotMedia } from "./types";

interface SwipeGalleryProps { items: PilotMedia[]; label: string; }

export function SwipeGallery({ items, label }: SwipeGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));

  function show(index: number) {
    const next = Math.min(Math.max(index, 0), items.length - 1);
    setActiveIndex(next);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = scrollerRef.current;
    const child = scroller?.children.item(next) as HTMLElement | null;
    if (scroller && child) scroller.scrollTo({ left: child.offsetLeft - scroller.offsetLeft, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  if (items.length === 0) return <p>Изображения пока не подготовлены.</p>;

  return (
    <section data-component="SwipeGallery" aria-label={label} className="space-y-3">
      <div ref={scrollerRef} className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain" onScroll={(event) => {
        const node = event.currentTarget;
        const children = Array.from(node.children) as HTMLElement[];
        const nearest = children.reduce((best, child, index) => Math.abs(child.offsetLeft - node.offsetLeft - node.scrollLeft) < best.distance ? { index, distance: Math.abs(child.offsetLeft - node.offsetLeft - node.scrollLeft) } : best, { index: 0, distance: Number.POSITIVE_INFINITY });
        setActiveIndex(nearest.index);
      }}>
        {items.map((item) => (
          <figure key={item.id} className="min-w-full snap-start overflow-hidden rounded-3xl border bg-white">
            <div className="aspect-[3/2]"><MediaPicture media={item} /></div>
            <figcaption className="p-4 text-sm text-stone-700">{item.caption || item.alt}</figcaption>
          </figure>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-bold">{safeIndex + 1} / {items.length}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => show(safeIndex - 1)} disabled={safeIndex === 0} aria-label="Предыдущий ракурс" className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-40"><ChevronLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => show(safeIndex + 1)} disabled={safeIndex === items.length - 1} aria-label="Следующий ракурс" className="grid h-11 w-11 place-items-center rounded-full border disabled:opacity-40"><ChevronRight aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
