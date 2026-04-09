"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Save, CheckCircle, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import type { VisualProjectState } from "@/lib/kitchen-configurator";
import { exportProjectAsJSON, exportProjectAsPDF } from "@/lib/kitchen-configurator/export";
import { nativeShare, copyLinkToClipboard, buildShareLinks } from "@/lib/kitchen-configurator/share";
import { saveProjectToIDB } from "@/lib/kitchen-configurator/idb-storage";

interface SummaryStepProps {
  state: VisualProjectState;
  onSaveToServer: () => Promise<{ id: number } | null>;
  brandingText?: string;
  shareTextTemplate?: string;
}

export function SummaryStep({
  state, onSaveToServer,
  brandingText = "Создано на kuhniby.by",
  shareTextTemplate = "Смотри мой проект кухни!",
}: SummaryStepProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(state.id ?? null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { priceBreakdown: p, placedModules, roomConfig, warnings, name } = state;
  const hasErrors = warnings.some((w) => w.level === "error");
  const hasWarnings = warnings.some((w) => w.level === "warning");

  const projectUrl = projectId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/kitchen-configurator?project=${projectId}`
    : typeof window !== "undefined"
    ? window.location.href
    : "";

  async function handleSave() {
    setSaving(true);
    try {
      await saveProjectToIDB(state);
      const result = await onSaveToServer();
      if (result) { setProjectId(result.id); }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    const text = shareTextTemplate;
    const url = projectUrl;
    const opened = await nativeShare({ title: name, text, url });
    if (!opened) setShowSharePanel(true);
  }

  async function handleCopyLink() {
    const ok = await copyLinkToClipboard(projectUrl);
    if (ok) { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2500); }
  }

  const links = buildShareLinks(shareTextTemplate, projectUrl);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — price breakdown */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Предварительная смета</h3>

        {hasErrors && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">Есть ошибки в планировке — смета может быть неточной.</p>
          </div>
        )}

        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {[
                { label: "Модули и корпуса", val: p.modules },
                { label: "Фасады", val: p.facades },
                { label: "Столешница", val: p.countertop },
                { label: "Скиналь", val: p.skinal },
                { label: "Ручки", val: p.handles },
                { label: "Механизмы", val: p.mechanisms },
                { label: "Встраиваемая техника", val: p.appliances },
                { label: "Монтаж (~15%)", val: p.installation },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 text-muted-foreground">{row.label}</td>
                  <td className="px-4 py-2.5 text-right font-medium">
                    {row.val > 0 ? `${row.val.toLocaleString("ru-RU")} ₽` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-stone-50 border-t-2">
                <td className="px-4 py-3 font-bold text-base">Итого</td>
                <td className="px-4 py-3 text-right font-black text-lg text-amber-700">
                  {p.total.toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          * Предварительная оценка. Финальная цена уточняется у менеджера после замера.
        </p>

        {/* Room summary */}
        <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-1">
          <p className="font-medium">Параметры помещения</p>
          <p className="text-muted-foreground">
            {roomConfig.dimensions.widthCm}×{roomConfig.dimensions.depthCm}×{roomConfig.dimensions.heightCm} см
          </p>
          <p className="text-muted-foreground">Модулей: {placedModules.length}</p>
          {hasWarnings && (
            <p className="text-amber-700">⚠ Есть предупреждения — проверьте планировку</p>
          )}
        </div>
      </div>

      {/* RIGHT — actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Действия</h3>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #92400e, #d97706)" }}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Сохраняем…" : saved ? "Сохранено" : "Сохранить проект"}
        </motion.button>

        {/* Export */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => exportProjectAsJSON(state)}
            className="flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />JSON
          </button>
          <button
            onClick={() => exportProjectAsPDF(state, brandingText)}
            className="flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />PDF / Печать
          </button>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 px-4 font-medium text-sm hover:border-amber-400 hover:bg-amber-50 transition-colors"
        >
          <Share2 className="w-4 h-4" />Поделиться проектом
        </button>

        {/* Share panel fallback */}
        <AnimatePresence>
          {showSharePanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border bg-card p-4 space-y-3"
            >
              <p className="text-sm font-medium">Поделиться через:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Telegram", href: links.telegram, emoji: "✈️" },
                  { label: "WhatsApp", href: links.whatsapp, emoji: "💬" },
                  { label: "Viber", href: links.viber, emoji: "📲" },
                  { label: "Email", href: links.email, emoji: "📧" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <span>{l.emoji}</span>{l.label}
                    <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                  </a>
                ))}
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 rounded-lg border py-2 text-sm hover:bg-muted transition-colors"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? "Ссылка скопирована!" : "Скопировать ссылку"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA — консультация */}
        <div className="rounded-xl border bg-amber-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-900">Нужна консультация?</p>
          <p className="text-xs text-amber-800">
            Наш дизайнер проверит проект, уточнит детали и подготовит финальное предложение.
          </p>
          <a
            href="/contacts"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2"
          >
            Оставить заявку →
          </a>
        </div>
      </div>
    </div>
  );
}
