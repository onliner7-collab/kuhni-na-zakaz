// ──────────────────────────────────────────────────────
// Экспорт проекта
// Этап 9: JSON, PNG, PDF (базовый)
// ──────────────────────────────────────────────────────

import type { VisualProjectState } from "./types";

// ── JSON экспорт ────────────────────────────────────────
export function exportProjectAsJSON(state: VisualProjectState): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, `${sanitizeFilename(state.name)}.json`);
}

// ── PNG экспорт (скриншот SVG-плана) ───────────────────
export async function exportPlanAsPNG(
  svgElement: SVGSVGElement,
  projectName: string
): Promise<void> {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.src = url;
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; });

  const canvas = document.createElement("canvas");
  canvas.width = svgElement.viewBox.baseVal.width * 2;
  canvas.height = svgElement.viewBox.baseVal.height * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);

  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, `${sanitizeFilename(projectName)}-plan.png`);
  }, "image/png");
}

// ── PDF экспорт (базовый HTML → print) ─────────────────
export function exportProjectAsPDF(state: VisualProjectState, brandingText: string): void {
  const { roomConfig, priceBreakdown, name } = state;
  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<title>${name}</title>
<style>
  body { font-family: Arial, sans-serif; color: #1c1917; max-width: 720px; margin: 40px auto; }
  h1 { font-size: 24px; margin-bottom: 4px; }
  .meta { color: #78716c; font-size: 13px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  td, th { padding: 8px 12px; border-bottom: 1px solid #e7e5e4; text-align: left; }
  th { font-weight: 600; background: #f5f3f0; }
  .total { font-weight: 700; font-size: 18px; }
  .footer { color: #a8a29e; font-size: 11px; margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 12px; }
</style>
</head>
<body>
<h1>${name}</h1>
<p class="meta">Помещение: ${roomConfig.dimensions.widthCm}×${roomConfig.dimensions.depthCm}×${roomConfig.dimensions.heightCm} см &nbsp;·&nbsp; ${new Date().toLocaleDateString("ru-RU")}</p>
<h2>Смета</h2>
<table>
  <tr><th>Статья</th><th>Сумма</th></tr>
  <tr><td>Модули и корпуса</td><td>${fmt(priceBreakdown.modules)} ₽</td></tr>
  <tr><td>Фасады</td><td>${fmt(priceBreakdown.facades)} ₽</td></tr>
  <tr><td>Столешница</td><td>${fmt(priceBreakdown.countertop)} ₽</td></tr>
  <tr><td>Скиналь</td><td>${fmt(priceBreakdown.skinal)} ₽</td></tr>
  <tr><td>Ручки</td><td>${fmt(priceBreakdown.handles)} ₽</td></tr>
  <tr><td>Техника</td><td>${fmt(priceBreakdown.appliances)} ₽</td></tr>
  <tr><td>Монтаж</td><td>${fmt(priceBreakdown.installation)} ₽</td></tr>
  <tr><td class="total">Итого</td><td class="total">${fmt(priceBreakdown.total)} ₽</td></tr>
</table>
<p>Размещено модулей: ${state.placedModules.length}</p>
<div class="footer">${brandingText}</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    // fallback — download html
    const blob = new Blob([html], { type: "text/html" });
    downloadBlob(blob, `${sanitizeFilename(name)}.html`);
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

// ── Helpers ────────────────────────────────────────────
function downloadBlob(blob: Blob, filename: string): void {
  // showSaveFilePicker progressive enhancement
  if ("showSaveFilePicker" in window) {
    (async () => {
      try {
        const handle = await (window as Window & { showSaveFilePicker: (opts: unknown) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: "File", accept: { [blob.type]: ["." + filename.split(".").pop()] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch {
        // user cancelled or API not supported — fallback below
      }
    })();
    return;
  }
  // Standard fallback
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
}

function fmt(n: number): string { return n.toLocaleString("ru-RU"); }
function sanitizeFilename(name: string): string { return name.replace(/[^\w\u0400-\u04ff\s-]/g, "").trim().replace(/\s+/g, "-") || "project"; }
