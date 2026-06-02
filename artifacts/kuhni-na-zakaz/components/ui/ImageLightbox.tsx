"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { optimizedImageSrc } from "@/lib/image-optimization";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  open: boolean;
  currentIndex: number;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  label?: string;
}

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function ImageLightbox({
  images,
  open,
  currentIndex,
  onOpenChange,
  onIndexChange,
  label = "Просмотр фотографии",
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const previousBodyOverflowRef = useRef<string>("");
  const previousHtmlOverflowRef = useRef<string>("");
  const [hasMounted, setHasMounted] = useState(false);

  const safeImages = useMemo(() => images.filter((image) => image.src), [images]);
  const imageCount = safeImages.length;
  const activeIndex = imageCount > 0 ? ((currentIndex % imageCount) + imageCount) % imageCount : 0;
  const activeImage = safeImages[activeIndex];

  const showPrevious = useCallback(() => {
    if (imageCount < 2) return;
    onIndexChange(activeIndex === 0 ? imageCount - 1 : activeIndex - 1);
  }, [activeIndex, imageCount, onIndexChange]);

  const showNext = useCallback(() => {
    if (imageCount < 2) return;
    onIndexChange(activeIndex === imageCount - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, imageCount, onIndexChange]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !activeImage) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousBodyOverflowRef.current = document.body.style.overflow;
    previousHtmlOverflowRef.current = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousBodyOverflowRef.current;
      document.documentElement.style.overflow = previousHtmlOverflowRef.current;
      previousFocusRef.current?.focus();
    };
  }, [activeImage, open]);

  useEffect(() => {
    if (!open || !activeImage) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      );
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!activeElement || !dialogRef.current?.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeImage, onOpenChange, open, showNext, showPrevious]);

  if (!open || !activeImage || !hasMounted) return null;

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchStart = touchStartRef.current;
    touchStartRef.current = null;
    if (!touchStart || imageCount < 2) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    if (deltaX < 0) showNext();
    else showPrevious();
  };

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onClick={() => onOpenChange(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Button
        ref={closeButtonRef}
        type="button"
        variant="ghost"
        size="icon"
        onClick={(event) => {
          event.stopPropagation();
          onOpenChange(false);
        }}
        className="absolute right-3 top-3 z-20 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white"
        aria-label="Закрыть галерею"
      >
        <X className="h-5 w-5" />
      </Button>

      {imageCount > 1 && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white sm:left-4"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white sm:right-4"
            aria-label="Следующее фото"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      <div
        className="relative h-[calc(100svh-7.5rem)] max-h-[760px] w-full max-w-6xl touch-pan-y select-none"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={optimizedImageSrc(activeImage.src) || activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      <div
        className="absolute bottom-3 left-1/2 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-md bg-black/55 px-4 py-3 text-center text-sm text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <p>{activeImage.caption || activeImage.alt}</p>
        {imageCount > 1 && (
          <p className="mt-1 text-white/70">
            {activeIndex + 1} / {imageCount}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
