"use client";

import Image from "next/image";
import { ExternalLink, Globe, Send, Star } from "lucide-react";
import { useMemo, useState } from "react";

import Link from "@/components/navigation/Link";
import { BrandedImageWatermark } from "@/components/ui/BrandedImageWatermark";
import { getImageDisclosure } from "@/lib/image-disclosure";
import { cn } from "@/lib/utils";

interface LinkedProject {
  slug: string;
  title: string;
  mainImage: string;
  kitchenType: string;
}

export interface ReviewExplorerItem {
  id: number;
  name: string;
  city: string;
  region: string;
  rating: number;
  text: string;
  date: string;
  source: string;
  featured: boolean;
  project: LinkedProject | null;
}

const SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  yandex: "Яндекс",
  telegram: "Telegram",
  instagram: "Instagram",
  vk: "ВКонтакте",
  direct: "Напрямую",
  website: "Сайт",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn("h-3.5 w-3.5", value <= rating ? "fill-primary text-primary" : "text-muted-foreground/20")}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ReviewExplorer({ reviews }: { reviews: ReviewExplorerItem[] }) {
  const [city, setCity] = useState("all");
  const [kitchenType, setKitchenType] = useState("all");

  const cityOptions = useMemo(
    () => [...new Set(reviews.map((review) => review.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru")),
    [reviews],
  );
  const kitchenTypeOptions = useMemo(
    () => [...new Set(reviews.map((review) => review.project?.kitchenType).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "ru")),
    [reviews],
  );
  const filteredReviews = useMemo(
    () => reviews.filter((review) => {
      if (city !== "all" && review.city !== city) return false;
      if (kitchenType !== "all" && review.project?.kitchenType !== kitchenType) return false;
      return true;
    }),
    [city, kitchenType, reviews],
  );

  if (reviews.length === 0) {
    return (
      <div className="mb-16 py-12 text-center text-muted-foreground">
        <p className="mb-2 text-lg">Отзывы пока не опубликованы</p>
        <p className="text-sm">Будьте первым — оставьте отзыв ниже.</p>
      </div>
    );
  }

  return (
    <section id="reviews-list" className="mb-16 scroll-mt-24" aria-labelledby="reviews-list-heading">
      <div className="mb-6 rounded-lg border border-border bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="reviews-list-heading" className="font-serif text-2xl font-bold">Опубликованные отзывы</h2>
            <p className="mt-1 text-sm text-muted-foreground">Найдено: {filteredReviews.length}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold">
              Город
              <select value={city} onChange={(event) => setCity(event.target.value)} className="min-h-11 rounded-md border border-border bg-white px-3 text-sm font-normal">
                <option value="all">Все города</option>
                {cityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Тип кухни
              <select value={kitchenType} onChange={(event) => setKitchenType(event.target.value)} className="min-h-11 rounded-md border border-border bg-white px-3 text-sm font-normal">
                <option value="all">Все типы</option>
                {kitchenTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="font-semibold">По выбранным параметрам отзывов нет.</p>
          <button type="button" onClick={() => { setCity("all"); setKitchenType("all"); }} className="mt-4 min-h-11 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white">
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => {
            const disclosure = getImageDisclosure(review.project?.mainImage);

            return (
              <article key={review.id} className={cn("card-base flex h-full flex-col overflow-hidden", review.featured && "border-2 border-primary/20")}>
                {review.project?.mainImage && (
                  <Link href={`/portfolio/${review.project.slug}`} className="relative block aspect-[3/2] overflow-hidden bg-muted" aria-label={`Связанный проект: ${review.project.title}`}>
                    <Image src={review.project.mainImage} alt={`Связанный проект кухни: ${review.project.title}`} width={720} height={480} loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-contain object-center" />
                    <BrandedImageWatermark show={disclosure.kind === "generated"} compact />
                    <span className="absolute left-3 top-3 z-[3] rounded-md bg-white/90 px-2 py-1 text-xs font-semibold">{disclosure.label}</span>
                  </Link>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <StarRow rating={review.rating} />
                    {review.featured && <span className="text-xs font-semibold text-primary">Избранный отзыв</span>}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.city}{review.region ? `, ${review.region}` : ""}{review.date ? ` · ${review.date}` : ""}</p>
                    {review.source && review.source !== "website" && (
                      <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {review.source === "telegram" ? <Send className="h-3 w-3" aria-hidden="true" /> : <Globe className="h-3 w-3" aria-hidden="true" />}
                        {SOURCE_LABELS[review.source] || review.source}
                      </span>
                    )}
                    {review.project && (
                      <Link href={`/portfolio/${review.project.slug}`} className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        Смотреть проект <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                    {!review.project && (
                      <Link href="/portfolio" className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        Смотреть портфолио <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
