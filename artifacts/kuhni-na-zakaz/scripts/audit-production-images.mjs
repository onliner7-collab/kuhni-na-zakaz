/**
 * Аудит: все URL из sitemap → извлечение путей к /uploads/* и /images/* из HTML (Next Image + og + JSON-LD).
 * node scripts/audit-production-images.mjs https://kuhni.minsk.by
 */
const BASE = (process.argv[2] || "https://kuhni.minsk.by").replace(/\/$/, "");

async function fetchText(url) {
  const r = await fetch(url, { redirect: "follow" });
  return { ok: r.ok, status: r.status, text: await r.text() };
}

/** Абсолютный URL файла на том же хосте */
function absolutize(pathOrUrl) {
  if (!pathOrUrl) return null;
  try {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return new URL(pathOrUrl).href.split("#")[0];
    }
    const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return new URL(path, BASE).href.split("#")[0];
  } catch {
    return null;
  }
}

function extractUploadImageUrls(html) {
  const found = new Set();
  // RSC/HTML может разрывать длинные URL переносами строк — склеиваем для парсера.
  html = html.replace(/\r?\n/g, "");

  // Next Image /preload: ?url=%2Fuploads%2F...
  const nextRe = /\/_next\/image\?([^"'>\s]+)/g;
  let m;
  while ((m = nextRe.exec(html))) {
    const qs = m[1].replace(/&amp;/g, "&").replace(/&quot;/g, "");
    try {
      const params = new URLSearchParams(qs.split("&").filter(Boolean).join("&"));
      const inner = params.get("url");
      if (!inner) continue;
      const path = decodeURIComponent(inner);
      const abs = absolutize(path);
      if (abs && /\/uploads\/|\/images\//.test(abs)) found.add(abs);
    } catch {
      /* skip */
    }
  }

  // og:image, twitter:image
  const metaRe = /(?:property|name)="(?:og:image|twitter:image)"[^>]*content="([^"]+)"/gi;
  while ((m = metaRe.exec(html))) {
    const abs = absolutize(m[1].replace(/&amp;/g, "&"));
    if (abs && /\/uploads\/|\/images\//.test(abs)) found.add(abs);
  }

  // JSON-LD contentUrl (минимально)
  const jsonLdUrl = /"contentUrl"\s*:\s*"([^"]+\.(?:webp|png|jpe?g))"/gi;
  while ((m = jsonLdUrl.exec(html))) {
    const abs = absolutize(m[1].replace(/\\\//g, "/"));
    if (abs && /\/uploads\/|\/images\//.test(abs)) found.add(abs);
  }

  // Прямые кавычки /uploads/... в атрибутах src= (без next/image)
  const srcQuoted = /(?:src|href)="(\/uploads\/[^"]+\.(?:webp|png|jpe?g|gif|avif))"/gi;
  while ((m = srcQuoted.exec(html))) {
    const abs = absolutize(m[1]);
    if (abs) found.add(abs);
  }

  return [...found];
}

async function headStatus(url) {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 12000);
    let r = await fetch(url, { method: "HEAD", signal: c.signal });
    clearTimeout(t);
    if (r.status === 405 || r.status === 501) {
      const c2 = new AbortController();
      const t2 = setTimeout(() => c2.abort(), 12000);
      r = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" }, signal: c2.signal });
      clearTimeout(t2);
    }
    return r.status;
  } catch {
    return 0;
  }
}

async function pool(items, limit, fn) {
  let i = 0;
  const results = new Array(items.length);
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function main() {
  const sm = await fetchText(`${BASE}/sitemap.xml`);
  if (!sm.ok) {
    console.error("sitemap failed", sm.status);
    process.exit(1);
  }
  const pageUrls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((x) => x[1].trim());
  console.log("sitemap pages:", pageUrls.length);

  const htmlResults = await pool(pageUrls, 8, async (u) => {
    const res = await fetchText(u);
    return { u, ...res };
  });

  const badPages = htmlResults.filter((x) => !x.ok).map((x) => ({ url: x.u, status: x.status }));

  const uniqueImages = new Set();
  const pageToImages = new Map();
  for (const row of htmlResults) {
    if (!row.ok) continue;
    const imgs = extractUploadImageUrls(row.text);
    pageToImages.set(row.u, imgs);
    for (const im of imgs) uniqueImages.add(im);
  }

  console.log("unique asset URLs:", uniqueImages.size);

  const imgList = [...uniqueImages];
  const statuses = await pool(imgList, 16, async (url) => ({ url, status: await headStatus(url) }));

  const badImages = statuses.filter((x) => x.status !== 200 && x.status !== 304);
  if (badImages.length) {
    console.error("\n--- Проблемные картинки ---");
    for (const { url, status } of badImages) {
      const refs = [...pageToImages.entries()]
        .filter(([, imgs]) => imgs.includes(url))
        .map(([p]) => p);
      console.error(status || "ERR", url);
      console.error("  refs:", refs.slice(0, 5).join(" | "));
    }
  }

  if (badPages.length) {
    console.error("\n--- Страницы не OK ---");
    for (const b of badPages) console.error(b.status, b.url);
  }

  if (!badPages.length && !badImages.length) {
    console.log("\nOK: страницы из sitemap отдают HTML; все извлечённые /uploads и /images — 200/304.");
  }

  process.exit(badPages.length || badImages.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
