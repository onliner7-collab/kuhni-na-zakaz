"use client";

import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { PortfolioProjectImage } from "@/data/portfolio-projects";
import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { getImageDisclosure } from "@/lib/image-disclosure";

interface PortfolioProjectHeroImageProps {
  title: string;
  mainImage: string;
  alt: string;
  images: PortfolioProjectImage[];
}

export function PortfolioProjectHeroImage({
  title,
  mainImage,
  alt,
  images,
}: PortfolioProjectHeroImageProps) {
  const lightboxImages = useMemo(() => {
    const mappedImages = images
      .filter((image) => image.src)
      .map((image, index): LightboxImage => ({
        src: image.src,
        alt: image.alt || `${title}, фото ${index + 1}`,
        caption: image.caption,
      }));

    if (!mainImage || mappedImages.some((image) => image.src === mainImage)) {
      return mappedImages;
    }

    return [{ src: mainImage, alt, caption: "Главное фото проекта" }, ...mappedImages];
  }, [alt, images, mainImage, title]);

  const mainImageIndex = Math.max(
    0,
    lightboxImages.findIndex((image) => image.src === mainImage),
  );
  const [activeIndex, setActiveIndex] = useState(mainImageIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const disclosure = getImageDisclosure(mainImage);

  if (!mainImage) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Фото проекта скоро появится
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setActiveIndex(mainImageIndex);
          setIsLightboxOpen(true);
        }}
        className="group absolute inset-0 block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Открыть главное фото проекта в увеличенном виде"
      >
        <Image
          src={optimizedImageSrc(mainImage) || mainImage}
          alt={alt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 420px"
          className="object-contain object-center"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
          {disclosure.label}
        </span>
        <span className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-4 w-4" />
          Увеличить
        </span>
      </button>

      <ImageLightbox
        images={lightboxImages}
        open={isLightboxOpen}
        currentIndex={activeIndex}
        onOpenChange={setIsLightboxOpen}
        onIndexChange={setActiveIndex}
        label="Главное фото проекта"
      />
    </>
  );
}
