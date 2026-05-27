import { cn } from "@/lib/utils";

interface BrandedImageWatermarkProps {
  show?: boolean;
  compact?: boolean;
  className?: string;
}

export function BrandedImageWatermark({
  show = true,
  compact = false,
  className,
}: BrandedImageWatermarkProps) {
  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-[2] overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.18)_100%)]" />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 select-none whitespace-nowrap rounded-lg border border-white/35 bg-black/18 px-4 py-2 font-serif font-bold uppercase tracking-[0.18em] text-white/48 shadow-sm backdrop-blur-[1px]",
          compact ? "text-sm sm:text-base" : "text-xl sm:text-2xl md:text-3xl",
        )}
      >
        КухниBY
      </div>
      {!compact && (
        <div className="absolute bottom-3 right-3 rounded-md border border-white/25 bg-black/24 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/62 shadow-sm backdrop-blur-[1px]">
          КухниBY
        </div>
      )}
    </div>
  );
}
