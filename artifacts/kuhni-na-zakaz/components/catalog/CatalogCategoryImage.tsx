"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

type CatalogCategoryImageProps = {
  src?: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
};

export function CatalogCategoryImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px",
}: CatalogCategoryImageProps) {
  const [failed, setFailed] = useState(false);
  const shouldShowImage = Boolean(src) && !failed;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-amber-100">
      {shouldShowImage ? (
        <Image
          src={src as string}
          alt={alt}
          width={1200}
          height={900}
          quality={85}
          decoding="async"
          {...(priority ? { priority: true } : { loading: "lazy" as const })}
          sizes={sizes}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-stone-500 shadow-sm ring-1 ring-black/5">
            <ImageIcon className="h-7 w-7" aria-hidden="true" />
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
    </div>
  );
}
