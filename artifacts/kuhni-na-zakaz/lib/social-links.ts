// Утилиты для нормализации соцссылок, заполненных в /admin/contacts.
//
// Админ может ввести значение в нескольких форматах:
//   - полный URL  (https://t.me/handle, https://instagram.com/handle)
//   - короткий путь (t.me/handle, instagram.com/handle)
//   - @handle
//   - просто handle (username)
//
// Хелперы возвращают валидный https-URL либо null, если значение пустое
// или явно непригодно (например, телефон или произвольный текст).

export function buildTelegramHref(raw?: string | null): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(?:t\.me|telegram\.me)\//i.test(value)) return `https://${value}`;
  if (value.startsWith("@")) {
    const handle = value.slice(1).trim();
    return handle ? `https://t.me/${handle}` : null;
  }
  if (/^[A-Za-z0-9_]{3,}$/.test(value)) return `https://t.me/${value}`;
  return null;
}

export function buildInstagramHref(raw?: string | null): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^instagram\.com\//i.test(value)) return `https://${value}`;
  if (value.startsWith("@")) {
    const handle = value.slice(1).trim();
    return handle ? `https://instagram.com/${handle}` : null;
  }
  if (/^[A-Za-z0-9_.]{2,}$/.test(value)) return `https://instagram.com/${value}`;
  return null;
}
