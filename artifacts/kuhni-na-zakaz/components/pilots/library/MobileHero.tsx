import type { ReactNode } from "react";
import { MediaPicture } from "./MediaPicture";
import type { PilotMedia } from "./types";

interface MobileHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  media: PilotMedia;
  disclosure: string;
  actions: ReactNode;
  variant: "spatial" | "journey" | "technical";
  headingLevel?: 1 | 2;
  aside?: ReactNode;
}

const variantClasses = {
  spatial: "bg-[#f3eee7] text-[#302820]",
  journey: "bg-[#e8f1ed] text-[#17382c]",
  technical: "bg-[#e8edf2] text-[#172635]",
};

export function MobileHero({ eyebrow, title, description, media, disclosure, actions, variant, headingLevel = 1, aside }: MobileHeroProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section data-component="MobileHero" data-variant={variant} className={`overflow-hidden rounded-[2rem] ${variantClasses[variant]}`}>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="order-2 space-y-4 p-5 sm:p-8 lg:order-1 lg:p-12">
          <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{eyebrow}</p>
          <Heading className="text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{title}</Heading>
          <p className="max-w-xl text-base leading-7 opacity-85">{description}</p>
          <div className="flex flex-wrap gap-3">{actions}</div>
          {aside ? <div className="pt-2">{aside}</div> : null}
        </div>
        <figure className="order-1 lg:order-2">
          <div className="aspect-[3/4] max-h-[42rem] overflow-hidden lg:aspect-[4/3]">
            <MediaPicture media={media} eager />
          </div>
          <figcaption className="px-5 py-3 text-sm opacity-75 sm:px-8">{disclosure}</figcaption>
        </figure>
      </div>
    </section>
  );
}
