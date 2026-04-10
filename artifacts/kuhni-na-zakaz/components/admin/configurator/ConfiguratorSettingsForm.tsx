"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfiguratorSettingsForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    defaultRoomWidthCm: 300,
    defaultRoomDepthCm: 250,
    defaultRoomHeightCm: 250,
    minRoomWidthCm: 150,
    minRoomDepthCm: 150,
    installationPct: 0,
    shareTextTemplate: "",
    pdfBrandingText: "",
    isEnabled: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/kapi/admin/configurator-visual/settings");
        if (res.ok) {
          const data = await res.json();
          setForm({
            defaultRoomWidthCm: data.defaultRoomWidthCm ?? 300,
            defaultRoomDepthCm: data.defaultRoomDepthCm ?? 250,
            defaultRoomHeightCm: data.defaultRoomHeightCm ?? 250,
            minRoomWidthCm: data.minRoomWidthCm ?? 150,
            minRoomDepthCm: data.minRoomDepthCm ?? 150,
            installationPct: data.installationPct ?? 0,
            shareTextTemplate: data.shareTextTemplate ?? "",
            pdfBrandingText: data.pdfBrandingText ?? "",
            isEnabled: data.isEnabled ?? true,
          });
        }
      } catch {
        // ignore fetch errors on mount — user will see current defaults
      } finally {
        setFetching(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const res = await fetch("/kapi/admin/configurator-visual/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        defaultRoomWidthCm: Number(form.defaultRoomWidthCm),
        defaultRoomDepthCm: Number(form.defaultRoomDepthCm),
        defaultRoomHeightCm: Number(form.defaultRoomHeightCm),
        minRoomWidthCm: Number(form.minRoomWidthCm),
        minRoomDepthCm: Number(form.minRoomDepthCm),
        installationPct: Number(form.installationPct),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Ошибка");
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  const inp =
    "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (fetching) {
    return (
      <div className="text-sm text-gray-500">Загрузка настроек…</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 rounded p-3 text-sm">
          Настройки успешно сохранены.
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Ширина комнаты по умолч. (см)
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.defaultRoomWidthCm)}
            onChange={(e) =>
              setForm((f) => ({ ...f, defaultRoomWidthCm: e.target.value as unknown as number }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Глубина комнаты по умолч. (см)
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.defaultRoomDepthCm)}
            onChange={(e) =>
              setForm((f) => ({ ...f, defaultRoomDepthCm: e.target.value as unknown as number }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Высота комнаты по умолч. (см)
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.defaultRoomHeightCm)}
            onChange={(e) =>
              setForm((f) => ({ ...f, defaultRoomHeightCm: e.target.value as unknown as number }))
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Мин. ширина комнаты (см)
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.minRoomWidthCm)}
            onChange={(e) =>
              setForm((f) => ({ ...f, minRoomWidthCm: e.target.value as unknown as number }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Мин. глубина комнаты (см)
          </label>
          <input
            type="number"
            className={inp}
            value={Number(form.minRoomDepthCm)}
            onChange={(e) =>
              setForm((f) => ({ ...f, minRoomDepthCm: e.target.value as unknown as number }))
            }
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Процент монтажа (%)
        </label>
        <input
          type="number"
          className={inp}
          value={Number(form.installationPct)}
          onChange={(e) =>
            setForm((f) => ({ ...f, installationPct: e.target.value as unknown as number }))
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Шаблон текста для шаринга
        </label>
        <textarea
          className={inp}
          rows={3}
          value={String(form.shareTextTemplate)}
          onChange={(e) =>
            setForm((f) => ({ ...f, shareTextTemplate: e.target.value }))
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Текст брендинга PDF
        </label>
        <textarea
          className={inp}
          rows={3}
          value={String(form.pdfBrandingText)}
          onChange={(e) =>
            setForm((f) => ({ ...f, pdfBrandingText: e.target.value }))
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
          Конфигуратор активен
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
