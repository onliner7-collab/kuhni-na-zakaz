import { cn } from "@/lib/utils";

interface BrandedImageWatermarkProps {
  show?: boolean;
  compact?: boolean;
  className?: string;
  label?: string;
}

export function BrandedImageWatermark({
  show = true,
  compact = false,
  className,
  label = "КухниBY",
}: BrandedImageWatermarkProps) {
  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-[2] overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute bottom-3 right-3 select-none rounded-md border border-white/25 bg-black/28 px-3 py-1.5 shadow-sm backdrop-blur-[1px]",
          compact && "bottom-2 right-2 px-2.5 py-1",
        )}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 74 12"
          className={cn("h-3 w-[74px] fill-white/70", compact && "h-2.5 w-[62px]")}
        >
          <text
            x="37"
            y="9"
            textAnchor="middle"
            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
          >
            {label}
          </text>
        </svg>
      </div>
    </div>
  );
}
