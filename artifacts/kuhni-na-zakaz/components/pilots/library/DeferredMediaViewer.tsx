"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MediaPicture } from "./MediaPicture";
import type { PilotMedia } from "./types";

const LazySwipeGallery = dynamic(() => import("./SwipeGallery").then((module) => module.SwipeGallery), {
  loading: () => <p role="status" className="rounded-2xl bg-stone-100 p-4">Галерея загружается…</p>,
});

interface DeferredMediaViewerProps { items: PilotMedia[]; label: string; triggerLabel?: string; }

export function DeferredMediaViewer({ items, label, triggerLabel = "Открыть галерею" }: DeferredMediaViewerProps) {
  const [hasIntent, setHasIntent] = useState(false);
  const poster = items[0];
  if (!poster) return <p>Медиа пока не подготовлены.</p>;

  return (
    <section data-component="DeferredMediaViewer" data-mounted={hasIntent ? "true" : "false"} className="space-y-4">
      {hasIntent ? <LazySwipeGallery items={items} label={label} /> : (
        <figure className="overflow-hidden rounded-3xl border bg-white">
          <div className="aspect-[3/2]"><MediaPicture media={poster} /></div>
          <figcaption className="p-4 text-sm">{poster.caption || poster.alt}</figcaption>
        </figure>
      )}
      {!hasIntent ? <button type="button" onClick={() => setHasIntent(true)} className="min-h-11 rounded-xl border-2 border-stone-900 px-5 py-2 font-bold">{triggerLabel}</button> : null}
    </section>
  );
}
