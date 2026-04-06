"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown, ChevronRight, Plus, Trash2, Save, Eye, EyeOff, GripVertical, Tag
} from "lucide-react";

interface Option {
  id: number; stepId: number; key: string; label: string; description: string;
  emoji: string; tags: string[]; order: number; active: boolean;
}
interface Step {
  id: number; key: string; question: string; hint: string;
  emoji: string; type: string; order: number; active: boolean; options: Option[];
}

interface Props { initialSteps: Step[] }

// Tag badge colours
const TAG_COLORS: Record<string, string> = {
  style: "bg-violet-100 text-violet-700",
  budget: "bg-green-100 text-green-700",
  material: "bg-blue-100 text-blue-700",
  layout: "bg-orange-100 text-orange-700",
  tech: "bg-pink-100 text-pink-700",
  storage: "bg-teal-100 text-teal-700",
  children: "bg-yellow-100 text-yellow-700",
  hardware: "bg-indigo-100 text-indigo-700",
  priority: "bg-red-100 text-red-700",
};
function tagColor(tag: string) {
  const prefix = tag.split(":")[0];
  return TAG_COLORS[prefix] ?? "bg-gray-100 text-gray-600";
}

// ── Step row ─────────────────────────────────────────────────
function StepRow({ step, onUpdate, onDelete }: {
  step: Step;
  onUpdate: (s: Step) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState(step);
  const [addingOption, setAddingOption] = useState(false);
  const [newOpt, setNewOpt] = useState({ key: "", label: "", description: "", emoji: "", tags: "" });

  async function saveStep() {
    setSaving(true);
    try {
      const res = await fetch(`/kapi/admin/configurator/steps/${step.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: local.question, hint: local.hint, emoji: local.emoji, active: local.active }),
      });
      if (!res.ok) throw new Error();
      onUpdate({ ...step, ...local });
      toast.success("Шаг сохранён");
    } catch { toast.error("Ошибка сохранения"); }
    setSaving(false);
  }

  async function toggleActive() {
    const next = !local.active;
    setLocal(l => ({ ...l, active: next }));
    await fetch(`/kapi/admin/configurator/steps/${step.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
    onUpdate({ ...step, active: next });
  }

  async function deleteStep() {
    if (!confirm(`Удалить шаг «${step.question}» и все его варианты?`)) return;
    const res = await fetch(`/kapi/admin/configurator/steps/${step.id}`, { method: "DELETE" });
    if (res.ok) { onDelete(step.id); toast.success("Шаг удалён"); }
    else toast.error("Ошибка удаления");
  }

  async function addOption() {
    if (!newOpt.key || !newOpt.label) { toast.error("Укажите ключ и название"); return; }
    const tags = newOpt.tags.split(",").map(t => t.trim()).filter(Boolean);
    const res = await fetch("/kapi/admin/configurator/options", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newOpt, tags, stepId: step.id, order: step.options.length + 1 }),
    });
    if (res.ok) {
      const opt = await res.json();
      onUpdate({ ...step, options: [...step.options, opt] });
      setNewOpt({ key: "", label: "", description: "", emoji: "", tags: "" });
      setAddingOption(false);
      toast.success("Вариант добавлен");
    } else toast.error("Ошибка");
  }

  return (
    <div className={`card-base overflow-hidden ${!local.active ? "opacity-60" : ""}`}>
      {/* Step header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
        <button onClick={() => setOpen(o => !o)} className="flex-1 flex items-center gap-2 text-left">
          <span className="text-lg">{local.emoji}</span>
          <div>
            <span className="font-semibold text-sm">{local.question}</span>
            <span className="ml-2 text-xs text-muted-foreground font-mono bg-gray-100 px-1.5 py-0.5 rounded">{step.key}</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{step.options.length} вариантов</span>
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </button>
        <button onClick={toggleActive} title={local.active ? "Скрыть" : "Показать"}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-gray-200 transition-colors">
          {local.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button onClick={deleteStep} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="p-5 space-y-5">
          {/* Step edit fields */}
          <div className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr] gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Эмодзи</label>
              <input className="form-input w-full text-xl text-center" value={local.emoji}
                onChange={e => setLocal(l => ({ ...l, emoji: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Вопрос</label>
              <input className="form-input w-full text-sm" value={local.question}
                onChange={e => setLocal(l => ({ ...l, question: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Подсказка (под вопросом)</label>
              <input className="form-input w-full text-sm" value={local.hint}
                onChange={e => setLocal(l => ({ ...l, hint: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={saveStep} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> {saving ? "Сохраняю..." : "Сохранить шаг"}
            </button>
          </div>

          {/* Options */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Варианты ответа</h4>
            <div className="space-y-2">
              {step.options.map(opt => (
                <OptionRow key={opt.id} option={opt}
                  onUpdate={updated => onUpdate({ ...step, options: step.options.map(o => o.id === updated.id ? updated : o) })}
                  onDelete={id => onUpdate({ ...step, options: step.options.filter(o => o.id !== id) })} />
              ))}
            </div>

            {/* Add option */}
            {addingOption ? (
              <div className="mt-3 border border-dashed border-primary/30 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">Новый вариант</p>
                <div className="grid grid-cols-[60px_100px_1fr] gap-2">
                  <input className="form-input text-xl text-center" placeholder="🔹" value={newOpt.emoji}
                    onChange={e => setNewOpt(o => ({ ...o, emoji: e.target.value }))} />
                  <input className="form-input text-xs font-mono" placeholder="ключ" value={newOpt.key}
                    onChange={e => setNewOpt(o => ({ ...o, key: e.target.value }))} />
                  <input className="form-input text-sm" placeholder="Название варианта" value={newOpt.label}
                    onChange={e => setNewOpt(o => ({ ...o, label: e.target.value }))} />
                </div>
                <input className="form-input w-full text-sm" placeholder="Описание (необязательно)" value={newOpt.description}
                  onChange={e => setNewOpt(o => ({ ...o, description: e.target.value }))} />
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Теги (через запятую): style:modern, budget:standard…</label>
                  <input className="form-input w-full text-xs font-mono" placeholder="style:modern, budget:standard" value={newOpt.tags}
                    onChange={e => setNewOpt(o => ({ ...o, tags: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <button onClick={addOption} className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold">Добавить</button>
                  <button onClick={() => setAddingOption(false)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500">Отмена</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingOption(true)}
                className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline">
                <Plus className="w-4 h-4" /> Добавить вариант
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Option row ────────────────────────────────────────────────
function OptionRow({ option, onUpdate, onDelete }: {
  option: Option;
  onUpdate: (o: Option) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState({ ...option, tagsStr: option.tags.join(", ") });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const tags = local.tagsStr.split(",").map(t => t.trim()).filter(Boolean);
    try {
      const res = await fetch(`/kapi/admin/configurator/options/${option.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: local.label, description: local.description, emoji: local.emoji, tags }),
      });
      if (!res.ok) throw new Error();
      onUpdate({ ...option, label: local.label, description: local.description, emoji: local.emoji, tags });
      setEditing(false);
      toast.success("Вариант сохранён");
    } catch { toast.error("Ошибка"); }
    setSaving(false);
  }

  async function del() {
    if (!confirm(`Удалить вариант «${option.label}»?`)) return;
    const res = await fetch(`/kapi/admin/configurator/options/${option.id}`, { method: "DELETE" });
    if (res.ok) { onDelete(option.id); toast.success("Вариант удалён"); }
    else toast.error("Ошибка");
  }

  async function toggleActive() {
    const next = !option.active;
    await fetch(`/kapi/admin/configurator/options/${option.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
    onUpdate({ ...option, active: next });
  }

  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-3 ${!option.active ? "opacity-50" : ""}`}>
      {editing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-[50px_100px_1fr] gap-2">
            <input className="form-input text-lg text-center" value={local.emoji}
              onChange={e => setLocal(l => ({ ...l, emoji: e.target.value }))} placeholder="🔹" />
            <input className="form-input text-xs font-mono" value={local.key} readOnly />
            <input className="form-input text-sm" value={local.label}
              onChange={e => setLocal(l => ({ ...l, label: e.target.value }))} placeholder="Название" />
          </div>
          <input className="form-input w-full text-sm" value={local.description}
            onChange={e => setLocal(l => ({ ...l, description: e.target.value }))} placeholder="Описание" />
          <div>
            <label className="block text-xs text-muted-foreground mb-0.5">Теги (через запятую)</label>
            <input className="form-input w-full text-xs font-mono" value={local.tagsStr}
              onChange={e => setLocal(l => ({ ...l, tagsStr: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold">
              {saving ? "..." : "Сохранить"}
            </button>
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500">Отмена</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <span className="text-xl">{option.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{option.label}</span>
              <span className="text-xs font-mono text-gray-400">{option.key}</span>
            </div>
            {option.description && <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>}
            {option.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                <Tag className="w-3 h-3 text-gray-400 mt-0.5" />
                {option.tags.map(t => (
                  <span key={t} className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${tagColor(t)}`}>{t}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-gray-100 rounded-lg transition-colors text-xs">
              Ред.
            </button>
            <button onClick={toggleActive} className="p-1.5 text-muted-foreground hover:bg-gray-100 rounded-lg transition-colors">
              {option.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button onClick={del} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────
export function ConfigStepsEditor({ initialSteps }: Props) {
  const [steps, setSteps] = useState(initialSteps);
  const [addingStep, setAddingStep] = useState(false);
  const [newStep, setNewStep] = useState({ key: "", question: "", hint: "", emoji: "" });
  const [creating, setCreating] = useState(false);

  function updateStep(updated: Step) {
    setSteps(ss => ss.map(s => s.id === updated.id ? updated : s));
  }
  function removeStep(id: number) {
    setSteps(ss => ss.filter(s => s.id !== id));
  }

  async function createStep() {
    if (!newStep.key || !newStep.question) { toast.error("Укажите ключ и вопрос"); return; }
    setCreating(true);
    try {
      const res = await fetch("/kapi/admin/configurator/steps", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newStep, order: steps.length + 1 }),
      });
      if (!res.ok) throw new Error();
      const step = await res.json();
      setSteps(ss => [...ss, { ...step, options: [] }]);
      setNewStep({ key: "", question: "", hint: "", emoji: "" });
      setAddingStep(false);
      toast.success("Шаг создан");
    } catch { toast.error("Ошибка создания"); }
    setCreating(false);
  }

  return (
    <div className="space-y-4">
      {steps.map(step => (
        <StepRow key={step.id} step={step} onUpdate={updateStep} onDelete={removeStep} />
      ))}

      {addingStep ? (
        <div className="card-base p-5 border-dashed border-primary/30 space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Новый шаг</p>
          <div className="grid grid-cols-[60px_120px_1fr] gap-3">
            <input className="form-input text-xl text-center" placeholder="📐" value={newStep.emoji}
              onChange={e => setNewStep(s => ({ ...s, emoji: e.target.value }))} />
            <input className="form-input font-mono text-sm" placeholder="ключ_шага" value={newStep.key}
              onChange={e => setNewStep(s => ({ ...s, key: e.target.value }))} />
            <input className="form-input text-sm" placeholder="Вопрос пользователю" value={newStep.question}
              onChange={e => setNewStep(s => ({ ...s, question: e.target.value }))} />
          </div>
          <input className="form-input w-full text-sm" placeholder="Подсказка под вопросом (необязательно)" value={newStep.hint}
            onChange={e => setNewStep(s => ({ ...s, hint: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={createStep} disabled={creating}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
              {creating ? "Создаю..." : "Создать шаг"}
            </button>
            <button onClick={() => setAddingStep(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAddingStep(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-4 h-4" /> Добавить шаг
        </button>
      )}
    </div>
  );
}
