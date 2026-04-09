// ──────────────────────────────────────────────────────
// Web Share API + fallback
// Этап 10
// ──────────────────────────────────────────────────────

export interface SharePayload {
  title: string;
  text: string;
  url: string;
  file?: File; // PNG превью
}

export type ShareMethod = "native" | "clipboard" | "telegram" | "whatsapp" | "email";

/** Попытка нативного шаринга; возвращает true если открыт системный диалог */
export async function nativeShare(payload: SharePayload): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    const shareData: ShareData = { title: payload.title, text: payload.text, url: payload.url };
    if (payload.file && navigator.canShare && navigator.canShare({ files: [payload.file] })) {
      (shareData as ShareData & { files: File[] }).files = [payload.file];
    }
    await navigator.share(shareData);
    return true;
  } catch {
    return false;
  }
}

/** Копировать ссылку в буфер обмена */
export async function copyLinkToClipboard(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // fallback execCommand
    try {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}

/** Генерация ссылок для мессенджеров */
export function buildShareLinks(text: string, url: string) {
  const encoded = encodeURIComponent(`${text} ${url}`);
  return {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    whatsapp: `https://wa.me/?text=${encoded}`,
    viber: `viber://forward?text=${encoded}`,
    email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
  };
}
