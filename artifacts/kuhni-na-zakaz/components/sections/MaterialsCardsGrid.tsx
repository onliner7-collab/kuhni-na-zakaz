"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Maximize2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { optimizedImageSrc } from "@/lib/image-optimization";

export interface MaterialCardItem {
  slug: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  budgetLevel: string;
  priceFrom: number;
  image: string;
}

interface MaterialsCardsGridProps {
  materials: MaterialCardItem[];
  budgetColor: Record<string, string>;
}

const materialGalleryImages: Record<string, LightboxImage[]> = {
  "mdf-emal": [
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-a-front.webp",
      alt: "Крупный план фасада МДФ эмаль для кухни",
      caption: "Тип A: фронтальный крупный план окрашенной поверхности МДФ эмаль.",
    },
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-b-angle.webp",
      alt: "Фасад МДФ эмаль под косым светом",
      caption: "Тип B: косой ракурс показывает мягкое отражение и геометрию фасада.",
    },
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-c-macro.webp",
      alt: "Макро кромки фасада МДФ эмаль",
      caption: "Тип C: макро кромки и ровного окрашенного слоя.",
    },
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-d-kitchen.webp",
      alt: "Кухня с фасадами МДФ эмаль крупным планом",
      caption: "Тип D: фасады МДФ эмаль в реальном кухонном фрагменте.",
    },
  ],
  "mdf-fasady": [
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-a-front.webp",
      alt: "Крупный план фасада МДФ для кухни",
      caption: "Тип A: фронтальный крупный план гладкой поверхности МДФ.",
    },
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-b-angle.webp",
      alt: "Фасад МДФ под косым светом",
      caption: "Тип B: косой ракурс показывает свет, форму и финиш фасада.",
    },
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-c-macro.webp",
      alt: "Макро кромки фасада МДФ",
      caption: "Тип C: макро кромки и слоя покрытия.",
    },
    {
      src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-d-kitchen.webp",
      alt: "Кухня с фасадами МДФ крупным планом",
      caption: "Тип D: фасады МДФ в кухонном фрагменте.",
    },
  ],
  ldsp: [
    {
      src: "/images/materials-gallery-v2/ldsp/ldsp-a-front.webp",
      alt: "Крупный план ЛДСП с древесным декором",
      caption: "Тип A: фронтальный крупный план ламинированной поверхности ЛДСП.",
    },
    {
      src: "/images/materials-gallery-v2/ldsp/ldsp-b-angle.webp",
      alt: "ЛДСП под косым светом с видимой кромкой",
      caption: "Тип B: косой ракурс показывает матовую поверхность и толщину плиты.",
    },
    {
      src: "/images/materials-gallery-v2/ldsp/ldsp-c-macro.webp",
      alt: "Макро среза и кромки ЛДСП",
      caption: "Тип C: макро среза, кромки и структуры плиты.",
    },
    {
      src: "/images/materials-gallery-v2/ldsp/ldsp-d-kitchen.webp",
      alt: "Кухня из ЛДСП под дерево крупным планом",
      caption: "Тип D: ЛДСП в кухонных фасадах и выдвижных секциях.",
    },
  ],
  "plastik-hpl": [
    {
      src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-a-front.webp",
      alt: "Крупный план пластика HPL для кухни",
      caption: "Тип A: фронтальный крупный план ровной поверхности пластика HPL.",
    },
    {
      src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-b-angle.webp",
      alt: "Пластик HPL под косым светом",
      caption: "Тип B: косой свет показывает плоскость, край и матовый финиш.",
    },
    {
      src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-c-macro.webp",
      alt: "Макро кромки фасада из пластика HPL",
      caption: "Тип C: макро края панели и декоративного слоя HPL.",
    },
    {
      src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-d-kitchen.webp",
      alt: "Кухня с фасадами из пластика HPL крупным планом",
      caption: "Тип D: пластик HPL на фасадах в современном кухонном фрагменте.",
    },
  ],
  akril: [
    {
      src: "/images/materials-gallery-v2/akril/akril-a-front.webp",
      alt: "Крупный план глянцевого акрилового фасада",
      caption: "Тип A: фронтальный крупный план глубокого цвета и глянца акрила.",
    },
    {
      src: "/images/materials-gallery-v2/akril/akril-b-angle.webp",
      alt: "Акриловый фасад под косым светом",
      caption: "Тип B: косой ракурс показывает отражение и полированную поверхность.",
    },
    {
      src: "/images/materials-gallery-v2/akril/akril-c-macro.webp",
      alt: "Макро кромки акрилового фасада",
      caption: "Тип C: макро полированной кромки и цветного слоя.",
    },
    {
      src: "/images/materials-gallery-v2/akril/akril-d-kitchen.webp",
      alt: "Кухня с акриловыми фасадами крупным планом",
      caption: "Тип D: акриловые фасады в кухне с заметным отражением.",
    },
  ],
  shpon: [
    {
      src: "/images/materials-gallery-v2/shpon/shpon-a-front.webp",
      alt: "Крупный план натурального шпона для кухни",
      caption: "Тип A: фронтальный крупный план натурального древесного рисунка.",
    },
    {
      src: "/images/materials-gallery-v2/shpon/shpon-b-angle.webp",
      alt: "Шпон под косым боковым светом",
      caption: "Тип B: косой свет проявляет волокна, поры и сатиновый финиш.",
    },
    {
      src: "/images/materials-gallery-v2/shpon/shpon-c-macro.webp",
      alt: "Макро кромки фасада со шпоном",
      caption: "Тип C: макро кромки, слоя шпона и древесной фактуры.",
    },
    {
      src: "/images/materials-gallery-v2/shpon/shpon-d-kitchen.webp",
      alt: "Кухня со шпонированными фасадами крупным планом",
      caption: "Тип D: шпон на фасадах в реальном кухонном фрагменте.",
    },
  ],
};

function getMaterialImages(slug: string, image: string): LightboxImage[] {
  const galleryImages = materialGalleryImages[slug];
  if (galleryImages?.length) return galleryImages;

  if (!image) return [];
  return [{ src: image, alt: "Материал для кухни крупным планом", caption: "Материал для кухни крупным планом." }];
}

function getCardImage(material: MaterialCardItem) {
  return material.image || getMaterialImages(material.slug, material.image)[0]?.src || "";
}

export function MaterialsCardsGrid({ materials, budgetColor }: MaterialsCardsGridProps) {
  const [activeMaterial, setActiveMaterial] = useState<MaterialCardItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const lightboxImages = useMemo(
    () => (activeMaterial ? getMaterialImages(activeMaterial.slug, activeMaterial.image) : []),
    [activeMaterial],
  );

  function openGallery(material: MaterialCardItem) {
    setActiveMaterial(material);
    setActiveImageIndex(0);
  }

  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => {
          const cardImage = getCardImage(material);
          const images = getMaterialImages(material.slug, material.image);

          return (
            <article key={material.slug} className="card-base group overflow-hidden transition-all duration-200 hover:shadow-lg">
              <button
                type="button"
                onClick={() => openGallery(material)}
                className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-stone-200 to-stone-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Открыть фото материала ${material.title}`}
              >
                {cardImage ? (
                  <Image
                    src={optimizedImageSrc(cardImage) || cardImage}
                    alt={material.title}
                    width={720}
                    height={480}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm text-stone-400">Образец материала</span>
                )}
                {material.budgetLevel && (
                  <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-medium ${budgetColor[material.budgetLevel] || "border-gray-200 bg-gray-100 text-gray-600"}`}>
                    {material.budgetLevel}
                  </span>
                )}
                {images.length > 0 && (
                  <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow-sm transition-colors group-hover:bg-white">
                    <Maximize2 className="h-4 w-4" aria-hidden />
                  </span>
                )}
              </button>

              <div className="p-5">
                <h2 className="mb-1 font-serif text-lg font-semibold transition-colors group-hover:text-primary">
                  <Link href={`/materials/${material.slug}`}>{material.title}</Link>
                </h2>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{material.description}</p>
                {material.pros.length > 0 && material.cons.length > 0 && (
                  <div className="mb-3 space-y-1">
                    <div className="flex items-start gap-1.5 text-xs text-green-700">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="line-clamp-1">{material.pros[0]}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-red-600">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="line-clamp-1">{material.cons[0]}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="text-sm font-semibold text-primary">
                    от {material.priceFrom.toLocaleString("ru")} BYN
                  </span>
                  <Link
                    href={`/materials/${material.slug}`}
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    Подробнее →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ImageLightbox
        images={lightboxImages}
        open={Boolean(activeMaterial)}
        currentIndex={activeImageIndex}
        onOpenChange={(open) => {
          if (!open) setActiveMaterial(null);
        }}
        onIndexChange={setActiveImageIndex}
        label={activeMaterial ? `Фото материала ${activeMaterial.title}` : "Фото материала"}
      />
    </>
  );
}
