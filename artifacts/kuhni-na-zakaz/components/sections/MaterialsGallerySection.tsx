"use client";

import Image from "next/image";
import Link from "@/components/navigation/Link";
import { ArrowRight, CheckCircle2, Maximize2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import { optimizedImageSrc } from "@/lib/image-optimization";
import { cn } from "@/lib/utils";

interface MaterialGalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface MaterialGalleryItem {
  id: string;
  title: string;
  href: string;
  description: string;
  points: [string, string, string];
  images: [MaterialGalleryImage, MaterialGalleryImage, MaterialGalleryImage, MaterialGalleryImage];
}

const materialGalleryItems: MaterialGalleryItem[] = [
  {
    id: "mdf-emal",
    title: "МДФ эмаль",
    href: "/materials/mdf-fasady",
    description:
      "Гладкий окрашенный фасад с аккуратной геометрией и спокойным сатиновым финишем. Хорошо подходит для современных и неоклассических кухонь.",
    points: [
      "Особенно хороша ровная окрашенная поверхность и выбор оттенков.",
      "Важно заранее согласовать фрезеровку, цвет и правила ухода.",
      "Подходит для кухонь без лишнего визуального шума и мягкой классики.",
    ],
    images: [
      {
        src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-a-front.webp",
        alt: "Крупный план гладкого фасада МДФ эмаль с сатиновым светлым покрытием",
        caption: "Фронтальный close-up: ровная окрашенная поверхность и мягкий сатиновый финиш.",
      },
      {
        src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-b-angle.webp",
        alt: "Фасад МДФ эмаль под косым светом с аккуратной фрезеровкой",
        caption: "Косой свет показывает геометрию фасада и спокойное отражение эмали.",
      },
      {
        src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-c-macro.webp",
        alt: "Макро кромки фасада МДФ эмаль с ровным окрашенным слоем",
        caption: "Макро-деталь: чистая кромка и равномерный окрашенный слой.",
      },
      {
        src: "/images/materials-gallery-v2/mdf-emal/mdf-emal-d-kitchen.webp",
        alt: "Кухонные фасады МДФ эмаль в интерьере крупным планом",
        caption: "Пример в кухне: окрашенные фасады читаются рядом со столешницей и ручками.",
      },
    ],
  },
  {
    id: "ldsp",
    title: "ЛДСП",
    href: "/materials/ldsp",
    description:
      "Практичный ламинированный материал для корпусов и простых фасадов. Визуально лучше раскрывается в спокойных древесных декорах и аккуратной кромке.",
    points: [
      "Сильная сторона — понятный бюджет и широкий выбор декоров.",
      "Стоит смотреть на качество кромки и защиту торцов от влаги.",
      "Подходит для практичных кухонь, аренды, дач и разумного среднего бюджета.",
    ],
    images: [
      {
        src: "/images/materials-gallery-v2/ldsp/ldsp-a-front.webp",
        alt: "Крупный план ламинированной поверхности ЛДСП с древесным декором",
        caption: "Фронтальный close-up: древесный декор и ровная ламинированная поверхность.",
      },
      {
        src: "/images/materials-gallery-v2/ldsp/ldsp-b-angle.webp",
        alt: "ЛДСП под косым светом с видимой толщиной плиты и кромкой",
        caption: "Косой ракурс показывает толщину плиты и спокойную матовую поверхность.",
      },
      {
        src: "/images/materials-gallery-v2/ldsp/ldsp-c-macro.webp",
        alt: "Макро среза ЛДСП с кромкой и древесным ламинированным декором",
        caption: "Макро-деталь: кромка, срез и структура плиты крупным планом.",
      },
      {
        src: "/images/materials-gallery-v2/ldsp/ldsp-d-kitchen.webp",
        alt: "Кухонные фасады из ЛДСП под дерево крупным планом",
        caption: "Пример в кухне: древесный декор на фасадах и выдвижных секциях.",
      },
    ],
  },
  {
    id: "plastik-hpl",
    title: "Пластик HPL",
    href: "/materials/plastik-hpl",
    description:
      "Современный фасадный материал с ровной поверхностью и хорошей геометрией. В матовых декорах выглядит спокойно и подходит для активной ежедневной кухни.",
    points: [
      "Хорош для лаконичных фасадов, где важны практичность и чистая плоскость.",
      "Обратите внимание на декор, кромку и сочетаемость со столешницей.",
      "Подходит для современных кухонь, квартир-студий и семейного использования.",
    ],
    images: [
      {
        src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-a-front.webp",
        alt: "Крупный план матовой поверхности пластика HPL в тёплом нейтральном оттенке",
        caption: "Фронтальный close-up: ровная матовая поверхность пластика HPL.",
      },
      {
        src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-b-angle.webp",
        alt: "Панель пластика HPL под косым светом с чистой геометрией кромки",
        caption: "Косой свет подчёркивает плоскость, край и современный матовый финиш.",
      },
      {
        src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-c-macro.webp",
        alt: "Макро кромки фасада из пластика HPL с тонким верхним слоем",
        caption: "Макро-деталь: край панели и фактура декоративного слоя.",
      },
      {
        src: "/images/materials-gallery-v2/plastik-hpl/plastik-hpl-d-kitchen.webp",
        alt: "Кухонные фасады из пластика HPL в современном интерьере крупным планом",
        caption: "Пример в кухне: HPL на ровных фасадах рядом с рабочей поверхностью.",
      },
    ],
  },
  {
    id: "akril",
    title: "Акрил",
    href: "/materials/akril",
    description:
      "Гладкие фасады с выразительной глубиной цвета и отражающим эффектом. Лучше всего раскрываются в современных кухнях с чистой геометрией.",
    points: [
      "Особенно заметны визуальная глубина цвета и ровность поверхности.",
      "На глянце стоит учитывать следы касаний и отражения в интерьере.",
      "Подходит для эффектных современных кухонь и фасадов без ручек.",
    ],
    images: [
      {
        src: "/images/materials-gallery-v2/akril/akril-a-front.webp",
        alt: "Крупный план глянцевого акрилового фасада глубокого тёмно-зелёного цвета",
        caption: "Фронтальный close-up: глубокий цвет и гладкая отражающая поверхность.",
      },
      {
        src: "/images/materials-gallery-v2/akril/akril-b-angle.webp",
        alt: "Акриловый фасад под косым светом с глянцевым отражением",
        caption: "Косой ракурс показывает глянец, глубину цвета и полированную кромку.",
      },
      {
        src: "/images/materials-gallery-v2/akril/akril-c-macro.webp",
        alt: "Макро кромки акрилового фасада с полированным глянцевым краем",
        caption: "Макро-деталь: полированный край и ровный цветной слой.",
      },
      {
        src: "/images/materials-gallery-v2/akril/akril-d-kitchen.webp",
        alt: "Глянцевые акриловые фасады в современной кухне крупным планом",
        caption: "Пример в кухне: акрил даёт заметное отражение на плоскости фасадов.",
      },
    ],
  },
  {
    id: "shpon",
    title: "Шпон",
    href: "/materials/shpon",
    description:
      "Натуральная древесная фактура с живым рисунком, порами и тёплым оттенком. Такой материал выбирают, когда важны природность и спокойная премиальность.",
    points: [
      "Главное преимущество — натуральный рисунок и тактильная глубина дерева.",
      "Нужно учитывать тон, направление волокон и уход за покрытием.",
      "Подходит для тёплых современных кухонь, минимализма и премиальной классики.",
    ],
    images: [
      {
        src: "/images/materials-gallery-v2/shpon/shpon-a-front.webp",
        alt: "Крупный план натурального шпона ореха с выраженным древесным рисунком",
        caption: "Фронтальный close-up: натуральный рисунок дерева и тёплый тон шпона.",
      },
      {
        src: "/images/materials-gallery-v2/shpon/shpon-b-angle.webp",
        alt: "Панель шпона под косым светом с видимыми порами древесины",
        caption: "Косой свет проявляет поры, волокна и мягкий сатиновый финиш.",
      },
      {
        src: "/images/materials-gallery-v2/shpon/shpon-c-macro.webp",
        alt: "Макро кромки фасада со шпоном и натуральной древесной фактурой",
        caption: "Макро-деталь: кромка, слой шпона и выраженная древесная текстура.",
      },
      {
        src: "/images/materials-gallery-v2/shpon/shpon-d-kitchen.webp",
        alt: "Кухонные фасады со шпоном ореха крупным планом",
        caption: "Пример в кухне: вертикальный рисунок шпона на фасадах рядом со столешницей.",
      },
    ],
  },
];

function getLightboxImages(item: MaterialGalleryItem): LightboxImage[] {
  return item.images.map((image) => ({
    src: image.src,
    alt: image.alt,
    caption: image.caption,
  }));
}

export function MaterialsGallerySection() {
  const [activeMaterialId, setActiveMaterialId] = useState(materialGalleryItems[0].id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeMaterial =
    materialGalleryItems.find((item) => item.id === activeMaterialId) ?? materialGalleryItems[0];
  const activeImage = activeMaterial.images[activeImageIndex] ?? activeMaterial.images[0];
  const lightboxImages = useMemo(() => getLightboxImages(activeMaterial), [activeMaterial]);

  function selectMaterial(id: string) {
    setActiveMaterialId(id);
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }

  return (
    <section className="mb-14 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6 lg:p-8" aria-labelledby="materials-gallery-heading">
      <div className="max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Демонстрация фактур</p>
        <h2 id="materials-gallery-heading" className="font-serif text-3xl font-bold text-foreground">
          Посмотрите материалы крупным планом
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Сравните фактуру, поверхность и поведение материалов на свету. Для каждого варианта показываем несколько профессиональных ракурсов: общий close-up, косой свет, макро-деталь и пример в кухне.
        </p>
      </div>

      <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" role="tablist" aria-label="Материалы для просмотра крупным планом">
        <div className="flex min-w-max gap-2">
          {materialGalleryItems.map((item) => {
            const isActive = item.id === activeMaterial.id;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`material-gallery-panel-${item.id}`}
                id={`material-gallery-tab-${item.id}`}
                onClick={() => selectMaterial(item.id)}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-foreground hover:border-primary/50 hover:bg-muted",
                )}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`material-gallery-panel-${activeMaterial.id}`}
        role="tabpanel"
        aria-labelledby={`material-gallery-tab-${activeMaterial.id}`}
        className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start"
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Открыть изображение материала ${activeMaterial.title} в увеличенном виде`}
          >
            <Image
              src={optimizedImageSrc(activeImage.src) || activeImage.src}
              alt={activeImage.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
              {activeImageIndex + 1} / {activeMaterial.images.length}
            </span>
            <span className="absolute right-3 top-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors group-hover:bg-white">
              <Maximize2 className="h-4 w-4" aria-hidden />
              Увеличить
            </span>
            <span className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm leading-5 text-white">
              {activeImage.caption}
            </span>
          </button>

          <div className="mt-3 grid grid-cols-4 gap-2" aria-label={`Миниатюры материала ${activeMaterial.title}`}>
            {activeMaterial.images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Показать ракурс ${index + 1}: ${image.caption}`}
                aria-current={index === activeImageIndex ? "true" : undefined}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  index === activeImageIndex ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-primary/60",
                )}
              >
                <Image
                  src={optimizedImageSrc(image.src) || image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 25vw, 160px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-muted/35 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Активный материал</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-foreground">{activeMaterial.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{activeMaterial.description}</p>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground">
            {activeMaterial.points.map((point) => (
              <li key={point} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href={activeMaterial.href}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Читать гид
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="#form"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Получить консультацию по материалу
            </Link>
          </div>
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        open={isLightboxOpen}
        currentIndex={activeImageIndex}
        onOpenChange={setIsLightboxOpen}
        onIndexChange={setActiveImageIndex}
        label={`Увеличенный просмотр материала ${activeMaterial.title}`}
      />
    </section>
  );
}
