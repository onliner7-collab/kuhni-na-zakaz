"use client";
import { useState, type FormEvent } from "react";
import { tariffDefinitions, type Tariff } from "@/lib/calculator/config";
export function CalculatorTariffs({ rules }: { rules: Tariff[] }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/kapi/admin/calculator-tariffs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tariffDefinitions.map(def => ({ key: def.key, value: String(form.get(def.key) || "").trim() === "" ? null : Number(String(form.get(def.key)).replace(",", ".")) }))) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось сохранить тарифы");
      setMessage("Тарифы сохранены. Проверьте нужные комплектации в калькуляторе.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Не удалось сохранить тарифы"); }
    finally { setBusy(false); }
  }
  return <form onSubmit={save} className="space-y-5">{[...new Set(tariffDefinitions.map(def => def.group))].map(group => <fieldset key={group} className="rounded-xl border p-4 space-y-3"><legend className="px-2 font-bold">{group}</legend>{tariffDefinitions.filter(def => def.group === group).map(def => <label key={def.key} className="grid gap-2 sm:grid-cols-[1fr_180px] items-center text-sm"><span>{def.label}, BYN/м</span><input className="rounded border px-3 py-3 min-w-0" name={def.key} type="number" step="0.01" min={def.positive ? 0.01 : 0} max={100000} placeholder="Не опубликован" disabled={busy} defaultValue={rules.find(rule => rule.key === def.key && rule.active)?.value ?? ""} /></label>)}</fieldset>)}<button className="rounded-lg bg-primary text-white px-6 py-3 min-h-12" disabled={busy}>{busy ? "Сохраняем…" : "Сохранить и опубликовать тарифы"}</button>{message && <p role="status">{message}</p>}<a className="block underline py-3" href="/calculator" target="_blank" rel="noreferrer">Проверить калькулятор</a></form>;
}
