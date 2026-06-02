"use client";

import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { furnituraGalleryRegistry } from "@/lib/furnitura-gallery-registry";
import { cn } from "@/lib/utils";

const basePath = "/images/materials-gallery-v2/furnitura";

const baseStageTitle = "Базовая фурнитура";

const shotLabels: Record<string, string> = {
  product: "Общий вид",
  closeup: "Крупный план",
  installed: "В модуле",
  "in-use": "В работе",
  "kitchen-context": "В кухне",
};

const galleryItems = furnituraGalleryRegistry
  .filter((item) => item.type !== "hero")
  .map((item) => ({
    ...item,
    src: `${basePath}/${item.file}`,
    caption: `${item.title}: ${shotLabels[item.type] ?? "демонстрационное фото"}`,
  }));

export function FurnituraHardwareGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = useMemo<LightboxImage[]>(
    () => galleryItems.map(({ src, alt, caption }) => ({ src, alt, caption })),
    [],
  );

  const categories = useMemo(
    () => {
      const grouped = new Map<string, Map<string, typeof galleryItems>>();

      galleryItems.forEach((item) => {
        const stage = item.stage ?? baseStageTitle;
        if (!grouped.has(stage)) {
          grouped.set(stage, new Map());
        }

        const stageCategories = grouped.get(stage);
        if (!stageCategories) return;

        const categoryImages = stageCategories.get(item.title) ?? [];
        categoryImages.push(item);
        stageCategories.set(item.title, categoryImages);
      });

      return Array.from(grouped.entries()).map(([stage, stageCategories]) => ({
        stage,
        categories: Array.from(stageCategories.entries()).map(([title, categoryImages]) => ({
          title,
          images: categoryImages,
        })),
      }));
    },
    [],
  );

  const openImage = (src: string) => {
    const index = images.findIndex((image) => image.src === src);
    setActiveIndex(index >= 0 ? index : 0);
    setIsLightboxOpen(true);
  };

  return (
    <section className="mt-16 scroll-mt-24" aria-labelledby="furnitura-gallery-heading">
      <div className="mb-7 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">Демонстрационные изображения</p>
        <h2 id="furnitura-gallery-heading" className="font-serif text-3xl font-bold">
          Как выглядит кухонная фурнитура в деталях и в готовой кухне
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Демонстрационные изображения помогают понять виды фурнитуры и варианты применения. Финальная
          комплектация подбирается индивидуально под проект кухни.
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((stageGroup) => (
          <div key={stageGroup.stage} className="space-y-5">
            <h3 className="font-serif text-2xl font-semibold">{stageGroup.stage}</h3>
            <div className="space-y-6">
              {stageGroup.categories.map((category) => (
                <article key={category.title} className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
                  <h4 className="font-serif text-xl font-semibold">{category.title}</h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {category.images.map((image) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => openImage(image.src)}
                        className={cn(
                          "group relative block aspect-video overflow-hidden rounded-xl bg-muted text-left shadow-sm transition duration-200",
                          "hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                        )}
                        aria-label={`Открыть изображение: ${image.alt}`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 220px"
                          className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                        <span className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm">
                          <Maximize2 className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-xs font-semibold leading-4 text-white">
                          {shotLabels[image.type] ?? "Фото"}
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ImageLightbox
        images={images}
        open={isLightboxOpen}
        currentIndex={activeIndex}
        onOpenChange={setIsLightboxOpen}
        onIndexChange={setActiveIndex}
        label="Галерея фурнитуры для кухни на заказ"
      />
    </section>
  );
}
