"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LAYOUT_TYPES = ["LINEAR","L_SHAPED","U_SHAPED","PARALLEL","PENINSULA","ISLAND"];

interface Props {
  initial?: Record<string, unknown>;
  id?: number;
}

export default function TemplateForm({ initial, id }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    layoutType: initial?.layoutType ?? "LINEAR",
    description: initial?.description ?? "",
    previewImageUrl: initial?.previewImageUrl ?? "",
    minRoomWidthCm: initial?.minRoomWidthCm ?? 200,
    minRoomDepthCm: initial?.minRoomDepthCm ?? 150,
    modulesConfig: initial?.modulesConfig ? JSON.stringify(initial.modulesConfig, null, 2) : "[]",
    isPublished: initial?.isPublished ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    let modulesConfig;
    try { modulesConfig = JSON.parse(String(form.modulesConfig)); } catch { setError("Неверный JSON в поле modulesConfig"); setLoading(false); return; }
    const url = id ? `/kapi/admin/configurator-visual/templates/${id}` : "/kapi/admin/configurator-visual/templates";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      ...form,
      modulesConfig,
      minRoomWidthCm: Number(form.minRoomWidthCm),
      minRoomDepthCm: Number(form.minRoomDepthCm),
      sortOrder: Number(form.sortOrder),
    }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Ошибка"); setLoading(false); return; }
    router.push("/admin/configurator-visual/templates");
    router.refresh();
  }

  const inp = "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <div className="bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Название *</label><input className={inp} value={String(form.name)} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
        <div><label className="block text-sm font-medium mb-1">Слаг *</label><input className={inp} value={String(form.slug)} onChange={e => setForm(f => ({...f, slug: e.target.value}))} pattern="[a-z0-9-]+" required /></div>
      </div>
      <div><label className="block text-sm font-medium mb-1">Тип планировки *</label>
        <select className={inp} value={String(form.layoutType)} onChange={e => setForm(f => ({...f, layoutType: e.target.value}))}>
          {LAYOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div><label className="block text-sm font-medium mb-1">Описание</label><textarea className={inp} rows={3} value={String(form.description)} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
      <div><label className="block text-sm font-medium mb-1">URL превью</label><input className={inp} value={String(form.previewImageUrl)} onChange={e => setForm(f => ({...f, previewImageUrl: e.target.value}))} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Мин. ширина комнаты (см)</label><input type="number" className={inp} value={Number(form.minRoomWidthCm)} onChange={e => setForm(f => ({...f, minRoomWidthCm: e.target.value}))} /></div>
        <div><label className="block text-sm font-medium mb-1">Мин. глубина комнаты (см)</label><input type="number" className={inp} value={Number(form.minRoomDepthCm)} onChange={e => setForm(f => ({...f, minRoomDepthCm: e.target.value}))} /></div>
      </div>
      <div><label className="block text-sm font-medium mb-1">Конфигурация модулей (JSON)</label><textarea className={`${inp} font-mono`} rows={8} value={String(form.modulesConfig)} onChange={e => setForm(f => ({...f, modulesConfig: e.target.value}))} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">Порядок сортировки</label><input type="number" className={inp} value={Number(form.sortOrder)} onChange={e => setForm(f => ({...f, sortOrder: e.target.value}))} /></div>
        <div className="flex items-center gap-2 mt-6"><input type="checkbox" id="isPublished" checked={Boolean(form.isPublished)} onChange={e => setForm(f => ({...f, isPublished: e.target.checked}))} /><label htmlFor="isPublished" className="text-sm">Опубликован</label></div>
      </div>
      <div className="flex gap-3"><button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{loading ? "Сохраняем…" : "Сохранить"}</button><button type="button" onClick={() => router.back()} className="border px-6 py-2 rounded hover:bg-gray-50">Отмена</button></div>
    </form>
  );
}
