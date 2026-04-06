"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Loader2 } from "lucide-react";
import { STATUS_OPTIONS, type LeadStatus } from "@/lib/lead-status";

export { STATUS_OPTIONS, type LeadStatus };

interface Props {
  leadId: number;
  status: LeadStatus;
  onUpdate?: (status: LeadStatus) => void;
}

export function LeadStatusControl({ leadId, status: initialStatus, onUpdate }: Props) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const current = STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[0];

  const handleChange = async (next: LeadStatus) => {
    setOpen(false);
    if (next === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/kapi/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setStatus(next);
        onUpdate?.(next);
        toast.success("Статус обновлён");
      } else {
        toast.error("Ошибка обновления статуса");
      }
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${current.color}`}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        {current.label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[120px]">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleChange(opt.value)}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition-colors ${opt.value === status ? "opacity-50 cursor-default" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
