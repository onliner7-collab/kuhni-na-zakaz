"use client";

import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { cn } from "@/lib/utils";

type MaterialGallerySlug = "mdf-emal" | "mdf-fasady" | "ldsp" | "plastik-hpl" | "akril" | "shpon";

interface MaterialDetailGalleryProps {
  slug: string;
  title: string;
}

const galleries: Record<MaterialGallerySlug, LightboxImage[]> = {
  "mdf-emal": [
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-a-front.webp", alt: "Фасад МДФ эмаль крупным планом", caption: "Тип A: фронтальный крупный план поверхности МДФ эмаль." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-b-angle.webp", alt: "Фасад МДФ эмаль под косым светом", caption: "Тип B: косой ракурс показывает матовый финиш и свет на эмали." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-c-macro.webp", alt: "Макро кромки МДФ эмаль", caption: "Тип C: макро кромки, слоя покрытия и основы фасада." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-d-kitchen.webp", alt: "Кухня с фасадами МДФ эмаль крупным планом", caption: "Тип D: МДФ эмаль в кухне, крупный фрагмент фасадов." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-kitchen-1.webp", alt: "Кухня с матовыми фасадами МДФ эмаль крупным планом", caption: "Кухня 1: матовые фасады МДФ эмаль, крупный фрагмент шкафов." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-kitchen-2.webp", alt: "Угловая кухня с фасадами МДФ эмаль", caption: "Кухня 2: угловой фрагмент с окрашенными фасадами и ручками." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-kitchen-3.webp", alt: "П-образная кухня с фасадами МДФ эмаль под углом", caption: "Кухня 3: другой ракурс, матовая эмаль на высоких шкафах." },
    { src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-kitchen-4.webp", alt: "Приближенный кадр фасадов МДФ эмаль с ручкой", caption: "Кухня 4: приближенный кадр фасада, ручки и окрашенной кромки." },
  ],
  "mdf-fasady": [],
  ldsp: [
    { src: "/images/materials-gallery-v2/ldsp/ldsp-a-front.webp", alt: "ЛДСП с древесным декором крупным планом", caption: "Тип A: фронтальный крупный план ламинированной поверхности ЛДСП." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-b-angle.webp", alt: "ЛДСП под косым светом", caption: "Тип B: косой ракурс показывает толщину плиты и кромку." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-c-macro.webp", alt: "Макро среза ЛДСП", caption: "Тип C: макро среза, стружечной основы и кромки." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-d-kitchen.webp", alt: "Кухня из ЛДСП крупным планом", caption: "Тип D: ЛДСП в кухне, крупный фрагмент фасадов." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-kitchen-1.webp", alt: "Кухня из ЛДСП со светлыми фасадами", caption: "Кухня 1: светлый ЛДСП, фасады и кромка в рабочей зоне." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-kitchen-2.webp", alt: "Прямая кухня из ЛДСП под темное дерево", caption: "Кухня 2: темный древесный декор ЛДСП в прямой кухне." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-kitchen-3.webp", alt: "Кухня из ЛДСП в разных декорах под углом", caption: "Кухня 3: угловой ракурс, ЛДСП под бетон и дерево." },
    { src: "/images/materials-gallery-v2/ldsp/ldsp-kitchen-4.webp", alt: "Приближенный кадр ЛДСП фасада с кромкой", caption: "Кухня 4: приближенный кадр ручки, кромки и древесного декора." },
  ],
  "plastik-hpl": [
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-a-front.webp", alt: "Пластик HPL крупным планом", caption: "Тип A: фронтальный крупный план матовой поверхности HPL." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-b-angle.webp", alt: "Пластик HPL под косым светом", caption: "Тип B: косой ракурс показывает финиш, плоскость и край." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-c-macro.webp", alt: "Макро кромки пластика HPL", caption: "Тип C: макро декоративного слоя, кромки и основы." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-d-kitchen.webp", alt: "Кухня с фасадами HPL крупным планом", caption: "Тип D: пластик HPL на фасадах в кухонном фрагменте." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-kitchen-1.webp", alt: "Кухня с фасадами HPL в бежевом и графитовом цвете", caption: "Кухня 1: HPL в двух оттенках, фрагмент мойки и столешницы." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-kitchen-2.webp", alt: "Кухня с матовыми зелеными фасадами HPL", caption: "Кухня 2: матовый HPL под боковым светом." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-kitchen-3.webp", alt: "Кухня с красными фасадами HPL под углом", caption: "Кухня 3: другой ракурс, HPL на ровных фасадах." },
    { src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-kitchen-4.webp", alt: "Приближенный кадр графитового фасада HPL", caption: "Кухня 4: приближенный кадр кромки, ручки и матовой фактуры." },
  ],
  akril: [
    { src: "/images/materials-gallery-v2/akril/akril-a-front.webp", alt: "Глянцевый акриловый фасад крупным планом", caption: "Тип A: фронтальный крупный план глянцевого акрила." },
    { src: "/images/materials-gallery-v2/akril/akril-b-angle.webp", alt: "Акриловый фасад под косым светом", caption: "Тип B: косой ракурс показывает глянец и отражение." },
    { src: "/images/materials-gallery-v2/akril/akril-c-macro.webp", alt: "Макро кромки акрилового фасада", caption: "Тип C: макро полированной кромки и акрилового слоя." },
    { src: "/images/materials-gallery-v2/akril/akril-d-kitchen.webp", alt: "Кухня с глянцевыми акриловыми фасадами", caption: "Тип D: акрил в кухне, крупный фрагмент фасадов." },
    { src: "/images/materials-gallery-v2/akril/akril-kitchen-1.webp", alt: "Кухня с красными глянцевыми акриловыми фасадами", caption: "Кухня 1: глянцевый акрил с заметными отражениями." },
    { src: "/images/materials-gallery-v2/akril/akril-kitchen-2.webp", alt: "Кухня с белыми и бирюзовыми акриловыми фасадами", caption: "Кухня 2: акрил в светлом интерьере с оконным отражением." },
    { src: "/images/materials-gallery-v2/akril/akril-kitchen-3.webp", alt: "Кухня с серыми глянцевыми акриловыми фасадами под углом", caption: "Кухня 3: угловой ракурс, глянец и профиль без ручек." },
    { src: "/images/materials-gallery-v2/akril/akril-kitchen-4.webp", alt: "Приближенный кадр черного акрилового фасада", caption: "Кухня 4: приближенный кадр глянцевого фасада, ручки и кромки." },
  ],
  shpon: [
    { src: "/images/materials-gallery-v2/shpon/shpon-a-front.webp", alt: "Натуральный шпон крупным планом", caption: "Тип A: фронтальный крупный план натурального древесного рисунка." },
    { src: "/images/materials-gallery-v2/shpon/shpon-b-angle.webp", alt: "Шпон под косым светом", caption: "Тип B: косой ракурс показывает поры, волокна и финиш." },
    { src: "/images/materials-gallery-v2/shpon/shpon-c-macro.webp", alt: "Макро кромки шпонированного фасада", caption: "Тип C: макро слоя шпона, кромки и основы." },
    { src: "/images/materials-gallery-v2/shpon/shpon-d-kitchen.webp", alt: "Кухня со шпонированными фасадами", caption: "Тип D: шпон в кухне, крупный фрагмент фасадов." },
    { src: "/images/materials-gallery-v2/shpon/shpon-kitchen-1.webp", alt: "Кухня со светлым шпоном дуба", caption: "Кухня 1: светлый шпон, вертикальный рисунок и профильная ручка." },
    { src: "/images/materials-gallery-v2/shpon/shpon-kitchen-2.webp", alt: "Кухня с темным шпоном ореха", caption: "Кухня 2: темный шпон, горизонтальный рисунок на ящиках." },
    { src: "/images/materials-gallery-v2/shpon/shpon-kitchen-3.webp", alt: "Кухня со шпоном эвкалипта под углом", caption: "Кухня 3: угловой ракурс, шпон и теплая подсветка." },
    { src: "/images/materials-gallery-v2/shpon/shpon-kitchen-4.webp", alt: "Приближенный кадр шпонированного фасада с ручкой", caption: "Кухня 4: приближенный кадр пор, ручки и края шпона." },
  ],
};

galleries["mdf-fasady"] = galleries["mdf-emal"];

function resolveGallery(slug: string) {
  return galleries[slug as MaterialGallerySlug] ?? galleries["mdf-emal"];
}

export function getMaterialDetailHeroImage(slug: string) {
  return resolveGallery(slug)[3]?.src ?? resolveGallery(slug)[0]?.src ?? "";
}

export function MaterialDetailGallery({ slug, title }: MaterialDetailGalleryProps) {
  const images = useMemo(() => resolveGallery(slug), [slug]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section className="mt-12 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6" aria-labelledby={`material-detail-gallery-${slug}`}>
      <div className="mb-5 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">Фото материала и кухонь</p>
        <h2 id={`material-detail-gallery-${slug}`} className="font-serif text-3xl font-bold">
          Как выглядит {title} в образцах и в кухне
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Сначала показаны четыре ракурса материала: фронтально, под углом, макро и в кухне. Затем идут дополнительные кухни из этого материала в разных ракурсах, включая приближенные кадры фасадов.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Открыть фото материала ${title} в увеличенном виде`}
      >
        <Image
          src={optimizedImageSrc(activeImage.src) || activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
          {activeIndex + 1} / {images.length}
        </span>
        <span className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors group-hover:bg-white">
          <Maximize2 className="h-4 w-4" aria-hidden />
          Увеличить
        </span>
        <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm leading-5 text-white">
          {activeImage.caption}
        </span>
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8" aria-label={`Миниатюры материала ${title}`}>
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Показать фото ${index + 1}: ${image.caption}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              index === activeIndex ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/60",
            )}
          >
            <Image
              src={optimizedImageSrc(image.src) || image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 50vw, 140px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        open={isLightboxOpen}
        currentIndex={activeIndex}
        onOpenChange={setIsLightboxOpen}
        onIndexChange={setActiveIndex}
        label={`Фото материала ${title}`}
      />
    </section>
  );
}
