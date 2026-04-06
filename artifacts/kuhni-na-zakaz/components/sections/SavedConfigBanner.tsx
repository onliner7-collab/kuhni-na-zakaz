"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

export function SavedConfigBanner() {
  const [config, setConfig] = useState<{ label: string; tags: string[] } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kuhniby_saved_config");
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.label) setConfig(data);
      }
    } catch {}
  }, []);

  if (!config || dismissed) return null;

  const resultUrl = `/configure/result?tags=${(config.tags ?? []).join(",")}`;

  return (
    <div className="bg-primary/[0.06] border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">У вас есть сохранённый вариант</p>
          <p className="text-xs text-muted-foreground">{config.label}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href={resultUrl}
          className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
          Продолжить
        </Link>
        <button onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
