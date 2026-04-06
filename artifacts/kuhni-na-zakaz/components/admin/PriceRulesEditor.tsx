"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";

interface Rule {
  id: number; key: string; category: string; label: string;
  description: string; value: number; unit: string; active: boolean;
}

interface Props {
  grouped: Record<string, Rule[]>;
  categoryLabels: Record<string, string>;
  categoryOrder: string[];
}

function formatValue(value: number, unit: string): string {
  if (unit === "×") return `×${value.toFixed(2)}`;
  if (unit === "%") return value >= 0 ? `+${(value * 100).toFixed(0)}%` : `${(value * 100).toFixed(0)}%`;
  if (unit === "+BYN") return value === 0 ? "бесплатно" : `+${value.toLocaleString("ru")} BYN`;
  if (unit.includes("BYN")) return `${value.toLocaleString("ru")} ${unit}`;
  return `${value} ${unit}`;
}

export function PriceRulesEditor({ grouped, categoryLabels, categoryOrder }: Props) {
  const [values, setValues] = useState<Record<number, number>>({});
  const [labels, setLabels] = useState<Record<number, string>>({});
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const allRules = Object.values(grouped).flat();

  function getValue(rule: Rule): number {
    return values[rule.id] !== undefined ? values[rule.id] : rule.value;
  }
  function getLabel(rule: Rule): string {
    return labels[rule.id] !== undefined ? labels[rule.id] : rule.label;
  }
  function getDesc(rule: Rule): string {
    return descriptions[rule.id] !== undefined ? descriptions[rule.id] : rule.description;
  }

  function handleValueChange(rule: Rule, rawStr: string) {
    const num = parseFloat(rawStr);
    if (!isNaN(num)) { setValues(v => ({ ...v, [rule.id]: num })); setDirty(true); }
  }
  function handleLabelChange(rule: Rule, val: string) {
    setLabels(l => ({ ...l, [rule.id]: val })); setDirty(true);
  }
  function handleDescChange(rule: Rule, val: string) {
    setDescriptions(d => ({ ...d, [rule.id]: val })); setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updates = allRules
        .filter(r => values[r.id] !== undefined || labels[r.id] !== undefined || descriptions[r.id] !== undefined)
        .map(r => ({
          id: r.id,
          ...(values[r.id] !== undefined && { value: values[r.id] }),
          ...(labels[r.id] !== undefined && { label: labels[r.id] }),
          ...(descriptions[r.id] !== undefined && { description: descriptions[r.id] }),
        }));
      if (updates.length === 0) { toast("Нет изменений"); setSaving(false); return; }
      const res = await fetch("/kapi/admin/prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Ошибка"); }
      toast.success(`Сохранено ${updates.length} правил`);
      setDirty(false);
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  function handleReset() {
    setValues({}); setLabels({}); setDescriptions({}); setDirty(false);
    toast("Сброшено к исходным значениям");
  }

  const toggleCollapse = (cat: string) => setCollapsed(c => ({ ...c, [cat]: !c[cat] }));

  return (
    <div className="space-y-4">
      {/* Sticky save bar */}
      {dirty && (
        <div className="sticky top-2 z-20 flex items-center justify-between bg-primary text-white px-4 py-2.5 rounded-xl shadow-lg">
          <span className="text-sm font-medium">Есть несохранённые изменения</span>
          <div className="flex gap-2">
            <button type="button" onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Сбросить
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary hover:bg-white/90 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {categoryOrder.filter(cat => grouped[cat]?.length > 0).map(cat => {
        const rules = grouped[cat] ?? [];
        const isOpen = !collapsed[cat];
        return (
          <div key={cat} className="card-base overflow-hidden">
            <button type="button" onClick={() => toggleCollapse(cat)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors">
              <span className="font-semibold text-sm text-gray-800">{categoryLabels[cat] ?? cat}</span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {rules.length} правил
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="divide-y divide-gray-50">
                {rules.map(rule => (
                  <div key={rule.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_160px_200px] gap-3 items-start">
                      {/* Label + description */}
                      <div className="space-y-1.5">
                        <input
                          className="w-full text-sm font-medium text-gray-800 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary focus:outline-none py-0.5 transition-colors"
                          value={getLabel(rule)}
                          onChange={e => handleLabelChange(rule, e.target.value)}
                          placeholder="Название"
                        />
                        <input
                          className="w-full text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary focus:outline-none py-0.5 transition-colors"
                          value={getDesc(rule)}
                          onChange={e => handleDescChange(rule, e.target.value)}
                          placeholder="Описание (показывается в калькуляторе)"
                        />
                        <p className="text-xs text-gray-300 font-mono">{rule.key}</p>
                      </div>

                      {/* Current display */}
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Текущее значение</p>
                        <span className="text-primary font-bold text-sm">{formatValue(getValue(rule), rule.unit)}</span>
                      </div>

                      {/* Value input */}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Значение ({rule.unit})</label>
                        <input
                          type="number"
                          className="form-input w-full text-sm"
                          value={getValue(rule)}
                          onChange={e => handleValueChange(rule, e.target.value)}
                          step={rule.unit === "×" || rule.unit === "%" ? "0.01" : "1"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom save */}
      <div className="flex justify-end gap-3 pt-2">
        {dirty && (
          <button type="button" onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
            Сбросить изменения
          </button>
        )}
        <button type="button" onClick={handleSave} disabled={saving || !dirty}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors">
          <Save className="w-4 h-4" /> {saving ? "Сохранение..." : "Сохранить все изменения"}
        </button>
      </div>
    </div>
  );
}
