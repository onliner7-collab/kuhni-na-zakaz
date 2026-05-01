"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PortfolioProjectImage } from "@/data/portfolio-projects";
import { Button } from "@/components/ui/button";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  title: string;
  images: PortfolioProjectImage[];
}

export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const galleryImages = useMemo(
    () => images.filter((image) => image.src),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = galleryImages[activeIndex];

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, galleryImages.length]);

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
        onClick={() => setIsLightboxOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Открыть фото в увеличенном виде"
      >
        <Image
          src={optimizedImageSrc(activeImage.src) || activeImage.src}
          alt={activeImage.alt || title}
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
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Показать фото ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-md border bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                index === activeIndex ? "border-primary" : "border-border hover:border-primary/60",
              )}
            >
              <Image
                src={optimizedImageSrc(image.src) || image.src}
                alt={image.alt || `${title}, фото ${index + 1}`}
                fill
                loading="lazy"
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Увеличенное фото проекта"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-3 top-3 z-10 bg-white/10 text-white hover:bg-white/20"
            aria-label="Закрыть галерею"
          >
            <X className="h-5 w-5" />
          </Button>

          {galleryImages.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showNext}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                aria-label="Следующее фото"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <div className="relative h-full max-h-[88vh] w-full max-w-6xl">
            <Image
              src={optimizedImageSrc(activeImage.src) || activeImage.src}
              alt={activeImage.alt || title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-3 left-1/2 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-md bg-black/50 px-4 py-3 text-center text-sm text-white">
            <p>{activeImage.caption || `${title}, фото ${activeIndex + 1}`}</p>
            <p className="mt-1 text-white/70">
              {activeIndex + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
