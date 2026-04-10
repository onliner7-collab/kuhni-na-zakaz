"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RULE_TYPES = ["INCOMPATIBLE", "REQUIRES", "WARNING"];

interface Props {
  initial?: Record<string, unknown>;
  id?: number;
}

export default function CompatibilityRuleForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    ruleType: initial?.ruleType ?? "INCOMPATIBLE",
    sourceEntity: initial?.sourceEntity ?? "",
    sourceSlug: initial?.sourceSlug ?? "",
    targetEntity: initial?.targetEntity ?? "",
    targetSlug: initial?.targetSlug ?? "",
    message: initial?.message ?? "",
    isActive: initial?.isActive ?? true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = id
      ? `/kapi/admin/configurator-visual/compatibility/${id}`
      : "/kapi/admin/configurator-visual/compatibility";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Ошибка");
      setLoading(false);
      return;
    }
    router.push("/admin/configurator-visual/compatibility");
    router.refresh();
  }

  const inp =
    "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Тип правила *</label>
        <select
          className={inp}
          value={String(form.ruleType)}
          onChange={(e) =>
            setForm((f) => ({ ...f, ruleType: e.target.value }))
          }
        >
          {RULE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Сущность-источник *
          </label>
          <input
            className={inp}
            value={String(form.sourceEntity)}
            onChange={(e) =>
              setForm((f) => ({ ...f, sourceEntity: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Слаг источника *
          </label>
          <input
            className={inp}
            value={String(form.sourceSlug)}
            onChange={(e) =>
              setForm((f) => ({ ...f, sourceSlug: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Сущность-цель *
          </label>
          <input
            className={inp}
            value={String(form.targetEntity)}
            onChange={(e) =>
              setForm((f) => ({ ...f, targetEntity: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Слаг цели *
          </label>
          <input
            className={inp}
            value={String(form.targetSlug)}
            onChange={(e) =>
              setForm((f) => ({ ...f, targetSlug: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Сообщение</label>
        <textarea
          className={inp}
          rows={3}
          value={String(form.message)}
          onChange={(e) =>
            setForm((f) => ({ ...f, message: e.target.value }))
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={Boolean(form.isActive)}
          onChange={(e) =>
            setForm((f) => ({ ...f, isActive: e.target.checked }))
          }
        />
        <label htmlFor="isActive" className="text-sm">
          Активно
        </label>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Сохраняем…" : "Сохранить"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border px-6 py-2 rounded hover:bg-gray-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
