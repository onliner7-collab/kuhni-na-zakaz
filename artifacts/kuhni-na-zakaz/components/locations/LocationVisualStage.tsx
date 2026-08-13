import type { LocationVisualState } from "@/types/location-visual";

interface LocationVisualStageProps {
  state: LocationVisualState;
  eager: boolean;
  onError: () => void;
  onLoad: () => void;
}

export function LocationVisualStage({ state, eager, onError, onLoad }: LocationVisualStageProps) {
  const mobileImage = /-visual-l(?:1[ab]|2a)\//.test(state.image)
    ? state.image.replace(/\.webp$/, "-mobile.webp")
    : null;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-stone-200" data-location-visual-stage>
      <picture key={state.id}>
        <source media="(min-width: 768px)" srcSet={state.avifImage} type="image/avif" />
        <img
          src={state.image}
          srcSet={mobileImage ? `${mobileImage} 480w, ${state.image} 1200w` : undefined}
          alt={state.altRu}
          width={1200}
          height={800}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 3rem), 1080px"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding={eager ? "sync" : "async"}
          onError={onError}
          onLoad={onLoad}
          className={`aspect-[3/2] h-auto w-full object-cover ${
            eager ? "transform-gpu" : "motion-safe:animate-[fade-in_.2s_ease-out] motion-reduce:animate-none"
          }`}
        />
      </picture>
      <span className="absolute left-3 top-3 rounded-full bg-stone-950/90 px-3 py-1.5 text-xs font-bold text-white">
        AI-концепция
      </span>
    </div>
  );
}
