"use client";

import dynamic from "next/dynamic";

import { furnituraGalleryRegistry } from "@/lib/furnitura-gallery-registry";

const FurnituraHardwareGallery = dynamic(
  () =>
    import("@/components/sections/FurnituraHardwareGallery").then(
      (module) => module.FurnituraHardwareGallery,
    ),
  { ssr: false, loading: GalleryOutline },
);

const galleryGroups = Array.from(
  furnituraGalleryRegistry
    .filter((item) => item.type !== "hero")
    .reduce((stages, item) => {
      const stage = item.stage ?? "Базовая фурнитура";
      const categories = stages.get(stage) ?? new Set<string>();
      categories.add(item.title);
      stages.set(stage, categories);
      return stages;
    }, new Map<string, Set<string>>()),
);

function GalleryOutline() {
  return (
    <div className="space-y-10" data-gallery-loading>
      {galleryGroups.map(([stage, categories]) => (
        <section key={stage}>
          <h3 className="font-serif text-2xl font-bold">{stage}</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from(categories).map((category) => (
              <article key={category} className="rounded-2xl border border-border bg-white p-5">
                <h4 className="font-serif text-xl font-semibold">{category}</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Изображения появятся после загрузки интерактивной галереи.
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function DeferredFurnituraHardwareGallery() {
  return <FurnituraHardwareGallery />;
}
