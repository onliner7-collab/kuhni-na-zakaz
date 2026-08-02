import type { PilotMedia } from "./types";

interface MediaPictureProps {
  media: PilotMedia;
  eager?: boolean;
  className?: string;
}

export function MediaPicture({ media, eager = false, className = "h-full w-full object-cover" }: MediaPictureProps) {
  const fallback = media.webp || media.avif;
  if (!fallback) return null;

  return (
    <picture>
      {media.avif ? <source srcSet={media.avif} type="image/avif" /> : null}
      {media.webp ? <source srcSet={media.webp} type="image/webp" /> : null}
      <img
        src={fallback}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? undefined : "async"}
        className={className}
      />
    </picture>
  );
}
