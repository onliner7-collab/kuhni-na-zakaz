"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserCheck, Pencil, Check, X } from "lucide-react";

interface Props {
  leadId: number;
  assignedTo: string;
}

export function LeadAssignedEditor({ leadId, assignedTo: initial }: Props) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/kapi/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: draft }),
      });
      if (res.ok) {
        setValue(draft);
        setEditing(false);
        toast.success("Ответственный обновлён");
      } else {
        toast.error("Ошибка сохранения");
      }
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5 group">
        <UserCheck className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-muted-foreground">
          {value || <span className="italic">Назначить менеджера…</span>}
        </span>
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-muted-foreground hover:text-primary"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <UserCheck className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/30 w-32"
        placeholder="Имя менеджера"
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="text-xs px-1.5 py-1 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
      >
        <Check className="w-3 h-3" />
      </button>
      <button
        onClick={() => setEditing(false)}
        className="text-xs px-1.5 py-1 border border-border rounded-lg text-muted-foreground hover:bg-muted/50"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
