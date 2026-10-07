"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Compact navigation is scoped to the Borisov pilot. */
export function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  const isBorisov = usePathname() === "/locations/borisov";
  const heading = <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">{title}</p>;
  if (!isBorisov) return <div>{heading}{children}</div>;
  return <>
    <details className="border-t border-white/15 md:hidden"><summary className="min-h-12 cursor-pointer content-center text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{title}</summary><div className="pb-4 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">{children}</div></details>
    <div className="hidden md:block">{heading}{children}</div>
  </>;
}
