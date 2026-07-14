"use client";

import type { ReactNode } from "react";

export interface ContextDockItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface ContextDockProps {
  label: string;
  items: [ContextDockItem, ContextDockItem, ContextDockItem, ContextDockItem];
}

export function ContextDock({ label, items }: ContextDockProps) {
  return (
    <nav data-component="ContextDock" aria-label={label} className="rounded-3xl bg-[#17120e] p-2 text-white shadow-xl">
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <a href={item.href} className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center text-[11px] font-bold hover:bg-white/10 focus-visible:bg-white/10 sm:text-xs">
              {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
              <span className="max-w-full truncate">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
