import type { LocationVisualState } from "@/types/location-visual";

export function LocationVisualInitialStage({ state }: { state: LocationVisualState }) {
  const mobileImage = state.image.includes("-visual-l1a/")
    ? state.image.replace(/\.webp$/, "-mobile.webp")
    : null;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-200" data-location-visual-stage>
      <picture>
        <source media="(min-width: 768px)" srcSet={state.avifImage} type="image/avif" />
        <img
          src={state.image}
          srcSet={mobileImage ? `${mobileImage} 480w, ${state.image} 1200w` : undefined}
          alt={state.altRu}
          width={1200}
          height={800}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 3rem), 1080px"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="aspect-[3/2] h-auto w-full transform-gpu object-cover"
        />
      </picture>
      <span className="absolute left-3 top-3 rounded-full bg-stone-950/90 px-3 py-1.5 text-xs font-bold text-white">
        AI-концепция
      </span>
    </div>
  );
}
