"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Copy, Download, ExternalLink, Save, Share2 } from "lucide-react";
import type { VisualProjectState } from "@/lib/kitchen-configurator";
import { exportProjectAsJSON, exportProjectAsPDF } from "@/lib/kitchen-configurator/export";
import { saveProjectToIDB } from "@/lib/kitchen-configurator/idb-storage";
import { buildShareLinks, copyLinkToClipboard, nativeShare } from "@/lib/kitchen-configurator/share";

interface SummaryStepProps {
  state: VisualProjectState;
  onSaveToServer: () => Promise<{ id: number } | null>;
  brandingText?: string;
  shareTextTemplate?: string;
}

export function SummaryStep({
  state,
  onSaveToServer,
  brandingText = "Создано в конфигураторе кухонь",
  shareTextTemplate = "Смотри мой проект кухни",
}: SummaryStepProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(state.id ?? null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const { priceBreakdown, placedModules, roomConfig, warnings, name } = state;
  const hasErrors = warnings.some((warning) => warning.level === "error");
  const hasWarnings = warnings.some((warning) => warning.level === "warning");
  const projectUrl = projectId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/kitchen-configurator?project=${projectId}`
    : typeof window !== "undefined"
    ? window.location.href
    : "";
  const links = buildShareLinks(shareTextTemplate, projectUrl);

  async function handleSave() {
    setSaving(true);
    try {
      await saveProjectToIDB(state);
      const result = await onSaveToServer();
      if (result) setProjectId(result.id);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    const opened = await nativeShare({ title: name, text: shareTextTemplate, url: projectUrl });
    if (!opened) setShowSharePanel((value) => !value);
  }

  async function handleCopyLink() {
    const ok = await copyLinkToClipboard(projectUrl);
    if (!ok) return;
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-stone-900">Предварительная смета</h3>

        {hasErrors && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">В планировке есть ошибки. Вернитесь к модулям и проверьте пересечения.</p>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {[
                { label: "Модули и корпуса", val: priceBreakdown.modules },
                { label: "Фасады", val: priceBreakdown.facades },
                { label: "Столешница", val: priceBreakdown.countertop },
                { label: "Скиналь", val: priceBreakdown.skinal },
                { label: "Ручки", val: priceBreakdown.handles },
                { label: "Механизмы", val: priceBreakdown.mechanisms },
                { label: "Встраиваемая техника", val: priceBreakdown.appliances },
                { label: "Монтаж (~15%)", val: priceBreakdown.installation },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 text-muted-foreground">{row.label}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{row.val > 0 ? `${row.val.toLocaleString("ru-RU")} ₽` : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-stone-50">
                <td className="px-4 py-3 text-base font-extrabold">Итого</td>
                <td className="px-4 py-3 text-right text-lg font-black text-amber-700">{priceBreakdown.total.toLocaleString("ru-RU")} ₽</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Это предварительная оценка. Финальная стоимость уточняется после замера, проверки материалов и комплектации.
        </p>

        <div className="space-y-1 rounded-lg bg-muted/40 p-4 text-sm">
          <p className="font-extrabold text-stone-900">Параметры помещения</p>
          <p className="text-muted-foreground">
            {roomConfig.dimensions.widthCm}×{roomConfig.dimensions.depthCm}×{roomConfig.dimensions.heightCm} см
          </p>
          <p className="text-muted-foreground">Модулей: {placedModules.length}</p>
          {hasWarnings && <p className="text-amber-700">Есть предупреждения: проверьте планировку перед отправкой дизайнеру.</p>}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-stone-900">Действия</h3>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 font-extrabold text-white shadow-md shadow-amber-200 transition-colors hover:bg-amber-700 disabled:opacity-60"
        >
          {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Сохраняем..." : saved ? "Проект сохранен" : "Сохранить проект"}
        </motion.button>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => exportProjectAsJSON(state)} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
            <Download className="h-4 w-4" /> JSON
          </button>
          <button type="button" onClick={() => exportProjectAsPDF(state, brandingText)} className="flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>

        <button type="button" onClick={handleShare} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm font-semibold transition-colors hover:border-amber-400 hover:bg-amber-50">
          <Share2 className="h-4 w-4" /> Поделиться проектом
        </button>

        <AnimatePresence>
          {showSharePanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 rounded-lg border bg-white p-4">
              <p className="text-sm font-extrabold text-stone-900">Отправить через</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Telegram", href: links.telegram },
                  { label: "WhatsApp", href: links.whatsapp },
                  { label: "Viber", href: links.viber },
                  { label: "Email", href: links.email },
                ].map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted">
                    {link.label}
                    <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                  </a>
                ))}
              </div>
              <button type="button" onClick={handleCopyLink} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-semibold transition-colors hover:bg-muted">
                {copiedLink ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? "Ссылка скопирована" : "Скопировать ссылку"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 rounded-lg border bg-amber-50 p-4">
          <p className="text-sm font-extrabold text-amber-950">Нужна консультация?</p>
          <p className="text-xs leading-relaxed text-amber-900">
            Дизайнер проверит проект, уточнит материалы и подготовит финальное предложение.
          </p>
          <a href="/contacts" className="inline-flex text-sm font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950">
            Оставить заявку
          </a>
        </div>
      </div>
    </div>
  );
}
