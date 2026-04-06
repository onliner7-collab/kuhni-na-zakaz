"use client";

import { Heart } from "lucide-react";
import { usePersonalization } from "@/hooks/usePersonalization";
import { cn } from "@/lib/utils";

interface Props {
  caseSlug: string;
  className?: string;
}

export function FavoriteButton({ caseSlug, className }: Props) {
  const { isFavorite, toggleFavorite, hydrated } = usePersonalization();
  const active = isFavorite(caseSlug);

  if (!hydrated) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(caseSlug);
      }}
      className={cn(
        "group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-medium",
        active
          ? "bg-rose-50 border-rose-200 text-rose-600"
          : "bg-white/80 border-border text-muted-foreground hover:border-rose-200 hover:text-rose-500",
        className
      )}
      title={active ? "Убрать из избранного" : "Добавить в избранное"}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <Heart className={cn("w-3.5 h-3.5 transition-transform", active ? "fill-rose-500 text-rose-500" : "group-hover:scale-110")} />
      {active ? "В избранном" : "В избранное"}
    </button>
  );
}
