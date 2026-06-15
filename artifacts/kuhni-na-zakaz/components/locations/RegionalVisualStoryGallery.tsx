"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { cn } from "@/lib/utils";

interface RegionalVisualStoryGalleryProps {
  images: LightboxImage[];
}

export function RegionalVisualStoryGallery({ images }: RegionalVisualStoryGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function openImage(index: number) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  return (
    <>
      <div className="grid auto-rows-[190px] gap-3 sm:auto-rows-[220px] md:grid-cols-6 lg:auto-rows-[240px]">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => openImage(index)}
            className={cn(
              "group relative overflow-hidden rounded-lg bg-stone-900 text-left shadow-sm transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-white",
              index === 0 && "md:col-span-3 md:row-span-2",
              index === 1 && "md:col-span-3",
              index > 1 && index < 6 && "md:col-span-2",
              index >= 6 && "md:col-span-2",
            )}
            aria-label={`Открыть фото: ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                index === 0
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              loading={index < 2 ? "eager" : "lazy"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <BrandedImageWatermark compact />
            <span className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/78 via-black/30 to-transparent p-4 text-white">
              <span className="block text-sm font-semibold">{image.caption || image.alt}</span>
            </span>
            <span className="absolute right-3 top-3 z-[3] rounded-full bg-white/16 p-2 text-white backdrop-blur transition-colors group-hover:bg-white/26">
              <Maximize2 className="h-4 w-4" aria-hidden />
            </span>
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        open={isOpen}
        currentIndex={activeIndex}
        onOpenChange={setIsOpen}
        onIndexChange={setActiveIndex}
        label="Галерея кухонь и этапов производства"
      />
    </>
  );
}
