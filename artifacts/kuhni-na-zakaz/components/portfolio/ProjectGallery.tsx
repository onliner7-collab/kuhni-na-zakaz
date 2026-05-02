"use client";

import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { PortfolioProjectImage } from "@/data/portfolio-projects";
import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  title: string;
  images: PortfolioProjectImage[];
}

export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const galleryImages = useMemo(
    () =>
      images
        .filter((image) => image.src)
        .map((image, index): LightboxImage => ({
          src: image.src,
          alt: image.alt || `${title}, фото ${index + 1}`,
          caption: image.caption,
        })),
    [images, title],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = galleryImages[activeIndex];

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  if (!activeImage) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-sm text-muted-foreground">
        Фото проекта скоро появится
      </div>
    );
  }

  return (
    <section aria-labelledby="project-gallery-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 id="project-gallery-heading" className="font-serif text-3xl font-bold">
          Галерея проекта
        </h2>
        <p className="text-sm text-muted-foreground">
          {activeIndex + 1} / {galleryImages.length}
        </p>
      </div>

      <button
        type="button"
        onClick={() => openLightbox(activeIndex)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Открыть фото в увеличенном виде"
      >
        <Image
          src={optimizedImageSrc(activeImage.src) || activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 820px"
          className="object-contain object-center"
        />
        <span className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors group-hover:bg-white">
          <Maximize2 className="h-4 w-4" />
          Увеличить
        </span>
        {activeImage.caption && (
          <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm text-white">
            {activeImage.caption}
          </span>
        )}
      </button>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {galleryImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-md border bg-gray-100 transition-colors",
                index === activeIndex ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/60",
              )}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Показать фото ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="sr-only">{`Миниатюра ${index + 1}`}</span>
              </button>
              <Image
                src={optimizedImageSrc(image.src) || image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="120px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className={cn(
                  "absolute right-1.5 top-1.5 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  "pointer-events-none opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:group-hover:pointer-events-auto sm:group-focus-within:pointer-events-auto",
                  index === activeIndex && "pointer-events-auto opacity-95",
                )}
                aria-label={`Открыть фото ${index + 1} в увеличенном виде`}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ImageLightbox
        images={galleryImages}
        open={isLightboxOpen}
        currentIndex={activeIndex}
        onOpenChange={setIsLightboxOpen}
        onIndexChange={setActiveIndex}
        label="Увеличенное фото проекта"
      />
    </section>
  );
}
