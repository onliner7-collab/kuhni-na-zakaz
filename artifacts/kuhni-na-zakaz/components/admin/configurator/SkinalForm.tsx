"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  initial?: Record<string, unknown>;
  id?: number;
}

export default function SkinalForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    material: initial?.material ?? "",
    colorName: initial?.colorName ?? "",
    imageUrl: initial?.imageUrl ?? "",
    pricePerSqMeter: initial?.pricePerSqMeter ?? 0,
    isEnabled: initial?.isEnabled ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = id
      ? `/kapi/admin/configurator-visual/skinals/${id}`
      : "/kapi/admin/configurator-visual/skinals";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pricePerSqMeter: Number(form.pricePerSqMeter),
        sortOrder: Number(form.sortOrder),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Ошибка");
      setLoading(false);
      return;
    }
    router.push("/admin/configurator-visual/skinals");
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название *</label>
          <input
            className={inp}
            value={String(form.name)}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Слаг *</label>
          <input
            className={inp}
            value={String(form.slug)}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            pattern="[a-z0-9-]+"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Материал</label>
          <input
            className={inp}
            value={String(form.material)}
            onChange={(e) =>
              setForm((f) => ({ ...f, material: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Название цвета
          </label>
          <input
            className={inp}
            value={String(form.colorName)}
            onChange={(e) =>
              setForm((f) => ({ ...f, colorName: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Цена за м² (₽)
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.pricePerSqMeter)}
            onChange={(e) =>
              setForm((f) => ({ ...f, pricePerSqMeter: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Порядок сортировки
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.sortOrder)}
            onChange={(e) =>
              setForm((f) => ({ ...f, sortOrder: e.target.value }))
            }
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          URL изображения
        </label>
        <input
          className={inp}
          value={String(form.imageUrl)}
          onChange={(e) =>
            setForm((f) => ({ ...f, imageUrl: e.target.value }))
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isEnabled"
          checked={Boolean(form.isEnabled)}
          onChange={(e) =>
            setForm((f) => ({ ...f, isEnabled: e.target.checked }))
          }
        />
        <label htmlFor="isEnabled" className="text-sm">
          Активен
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
