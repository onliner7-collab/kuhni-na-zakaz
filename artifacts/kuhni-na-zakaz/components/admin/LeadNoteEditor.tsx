"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";

interface Props {
  leadId: number;
  note: string;
}

export function LeadNoteEditor({ leadId, note: initialNote }: Props) {
  const [note, setNote] = useState(initialNote);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialNote);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/kapi/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerNote: draft }),
      });
      if (res.ok) {
        setNote(draft);
        setEditing(false);
        toast.success("Заметка сохранена");
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
      <div className="flex items-start gap-2 group">
        <p className="text-xs text-muted-foreground flex-1 min-h-[1.25rem]">{note || <span className="italic">Заметка менеджера…</span>}</p>
        <button onClick={() => { setDraft(note); setEditing(true); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-muted-foreground hover:text-primary">
          <Pencil className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        rows={2}
        className="w-full text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        placeholder="Заметка менеджера…"
        autoFocus
      />
      <div className="flex gap-1.5">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-primary text-white rounded-lg font-medium disabled:opacity-50">
          <Check className="w-3 h-3" /> {saving ? "Сохраняем…" : "Сохранить"}
        </button>
        <button onClick={() => setEditing(false)}
          className="flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-lg text-muted-foreground hover:bg-muted/50">
          <X className="w-3 h-3" /> Отмена
        </button>
      </div>
    </div>
  );
}
