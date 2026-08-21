import { preload } from "react-dom";

import type { LocationVisualState } from "@/types/location-visual";

export function LocationVisualInitialStage({ state }: { state: LocationVisualState }) {
  const mobileImage = /-visual-l(?:1[ab]|2[ab]|3[ab])\//.test(state.image)
    ? state.image.replace(/\.webp$/, "-mobile.webp")
    : null;
  const sizes = "(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 3rem), 1080px";

  if (mobileImage) {
    preload(mobileImage, { as: "image", fetchPriority: "high", media: "(max-width: 767px)" });
  }
  preload(state.avifImage, {
    as: "image",
    fetchPriority: "high",
    media: mobileImage ? "(min-width: 768px)" : undefined,
    type: "image/avif",
  });

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-200" data-location-visual-stage>
      <picture>
        {mobileImage ? <source media="(max-width: 767px)" srcSet={mobileImage} type="image/webp" /> : null}
        <source media="(min-width: 768px)" srcSet={state.avifImage} type="image/avif" />
        <img
          src={state.image}
          alt={state.altRu}
          width={1200}
          height={800}
          sizes={sizes}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="aspect-[3/2] h-auto w-full object-cover"
        />
      </picture>
      <span className="absolute left-3 top-3 rounded-full bg-stone-950/90 px-3 py-1.5 text-xs font-bold text-white">
        AI-концепция
      </span>
    </div>
  );
}
