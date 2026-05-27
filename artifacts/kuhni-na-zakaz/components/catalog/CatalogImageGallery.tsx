"use client";

import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { getImageDisclosure } from "@/lib/image-disclosure";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { cn } from "@/lib/utils";

interface CatalogImageGalleryProps {
  title: string;
  projectImages: LightboxImage[];
  exampleImages?: LightboxImage[];
}

export function CatalogImageGallery({ title, projectImages, exampleImages = [] }: CatalogImageGalleryProps) {
  const images = useMemo(
    () => [...projectImages, ...exampleImages].filter((image) => image.src),
    [exampleImages, projectImages],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = images[activeIndex];
  const activeDisclosure = getImageDisclosure(activeImage?.src);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function renderThumbnails(items: LightboxImage[], offset: number, label: string) {
    if (items.length === 0) return null;

    return (
      <div>
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{label}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((image, index) => {
            const imageIndex = offset + index;
            const disclosure = getImageDisclosure(image.src);

            return (
              <div
                key={`${image.src}-${imageIndex}`}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-md border bg-gray-100 transition-colors",
                  imageIndex === activeIndex ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(imageIndex)}
                  aria-label={`Показать фото ${imageIndex + 1}`}
                  aria-current={imageIndex === activeIndex ? "true" : undefined}
                  className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="sr-only">{`Миниатюра ${imageIndex + 1}`}</span>
                </button>
                <Image
                  src={optimizedImageSrc(image.src) || image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="140px"
                  className="object-cover"
                />
                <BrandedImageWatermark show={disclosure.kind === "generated"} compact />
                <button
                  type="button"
                  onClick={() => openLightbox(imageIndex)}
                  className={cn(
                    "absolute right-1.5 top-1.5 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    "pointer-events-none opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100",
                    imageIndex === activeIndex && "pointer-events-auto opacity-95",
                  )}
                  aria-label={`Открыть фото ${imageIndex + 1} в увеличенном виде`}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!activeImage) return null;

  return (
    <section className="mb-8 space-y-4" aria-labelledby="catalog-gallery-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="catalog-gallery-heading" className="font-serif text-2xl font-semibold">
          Фото проекта и примеры
        </h2>
        <p className="text-sm text-muted-foreground">
          {activeIndex + 1} / {images.length}
        </p>
      </div>

      <button
        type="button"
        onClick={() => openLightbox(activeIndex)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-gray-100 text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Открыть фото в увеличенном виде"
      >
        <Image
          src={optimizedImageSrc(activeImage.src) || activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 820px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <BrandedImageWatermark show={activeDisclosure.kind === "generated"} />
        <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
          {activeDisclosure.label}
        </span>
        <span className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors group-hover:bg-white">
          <Maximize2 className="h-4 w-4" />
          Увеличить
        </span>
        {(activeImage.caption || activeImage.alt) && (
          <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm text-white">
            {activeImage.caption || activeImage.alt}
          </span>
        )}
      </button>

      <div className="space-y-5">
        {renderThumbnails(projectImages, 0, "Ракурсы этого проекта")}
        {renderThumbnails(exampleImages, projectImages.length, "Дополнительные примеры")}
      </div>

      <ImageLightbox
        images={images}
        open={isLightboxOpen}
        currentIndex={activeIndex}
        onOpenChange={setIsLightboxOpen}
        onIndexChange={setActiveIndex}
        label={`Увеличенное фото: ${title}`}
      />
    </section>
  );
}
