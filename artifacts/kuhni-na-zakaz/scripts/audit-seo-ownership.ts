import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { regionalLocations } from "../data/locations";

// Read-only HTTP audit. Writes only its generated Markdown report, never site data.
async function main() {
const root = resolve(process.cwd(), "../..");
const registry = JSON.parse(await readFile(resolve(root, "docs/page-registry-v2.json"), "utf8"));
const base = process.env.SEO_AUDIT_BASE_URL || "http://127.0.0.1:3396";
const seeds: Record<string, string> = {
  "/": "купить кухню; купить кухню на заказ; кухни на заказ; заказать кухню",
  "/catalog": "каталог кухонь; модели кухонь; варианты кухонь",
  "/prices": "цены на кухни на заказ; стоимость кухни; сколько стоит кухня",
  "/calculator": "калькулятор кухни; рассчитать стоимость кухни онлайн",
  "/design-proekt-kuhni": "дизайн-проект кухни; 3D-проект кухни",
  "/catalog/uglovye-kuhni": "угловые кухни; купить угловую кухню",
  "/catalog/pryamye-kuhni": "прямые кухни; купить прямую кухню; линейная кухня",
  "/catalog/p-obraznye-kuhni": "П-образные кухни; П-образная кухня на заказ",
  "/catalog/kuhni-s-ostrovom": "кухни с островом; купить кухню с островом",
  "/catalog/malenkie-kuhni": "маленькие кухни; компактные кухни на заказ",
  "/catalog/kuhni-do-potolka": "кухни до потолка; кухни с антресолями",
  "/catalog/kuhni-bez-ruchek": "кухни без ручек; кухни с профилем",
  "/styles": "стили кухонь; дизайн кухни",
  "/styles/neoklassika": "кухни неоклассика на заказ; неоклассическая кухня",
  "/styles/hay-tek": "кухни хай-тек; кухня в стиле хай-тек на заказ",
  "/styles/provans": "кухни прованс; кухня в стиле прованс",
  "/styles/loft": "кухни лофт; кухня в стиле лофт на заказ",
  "/styles/sovremennye": "современные кухни; кухни в современном стиле",
  "/styles/skandinavskie": "скандинавские кухни; кухня в скандинавском стиле",
  "/styles/klassicheskie": "классические кухни; кухни в классическом стиле",
  "/styles/minimalizm": "кухни минимализм; кухня в стиле минимализм",
  "/materials": "материалы для кухни; материалы кухонных фасадов",
  "/materials/furnitura": "фурнитура для кухни; кухонные механизмы",
  "/materials/mdf-fasady": "фасады МДФ для кухни; покрытия фасадов МДФ",
  "/materials/mdf-emal": "кухни МДФ эмаль; крашеные фасады для кухни",
  "/materials/ldsp": "кухни из ЛДСП; ЛДСП для кухни",
  "/materials/plastik-hpl": "кухни пластик HPL; пластиковые фасады для кухни",
  "/materials/shpon": "кухни из шпона; шпонированные фасады",
  "/materials/akril": "акриловые кухни; акриловые фасады",
  "/scenarios": "как выбрать кухню под свои задачи",
  "/scenarios/s-ostrovom": "нужен ли остров на кухне; как использовать кухонный остров",
  "/scenarios/do-potolka": "как организовать хранение до потолка",
  "/scenarios/dlya-semi": "кухня для семьи; планировка семейной кухни",
  "/scenarios/dlya-studii": "кухня для студии; зонирование кухни в студии",
  "/scenarios/dlya-malenkoy-kuhni": "как организовать маленькую кухню; хранение на маленькой кухне",
  "/scenarios/byudzhetnaya-kuhnya": "как сэкономить на кухне; комплектация бюджетной кухни",
  "/about": "КухниBY о компании; производитель КухниBY",
  "/contacts": "КухниBY контакты; телефон КухниBY",
  "/reviews": "КухниBY отзывы",
  "/portfolio": "примеры кухонь КухниBY; работы КухниBY",
  "/blog": "советы по выбору кухни; статьи о кухнях",
  "/locations": "города заказа кухонь КухниBY; география работы",
  "/warranty": "гарантия на кухню КухниBY",
  "/delivery-installation": "доставка и монтаж кухни КухниBY",
};
for (const city of regionalLocations) {
  const area = city.slug === "minskaya-oblast" ? "по Минской области" : `в ${city.cityPrepositional}`;
  seeds[`/locations/${city.slug}`] = `купить кухню ${area}; кухни на заказ ${area}; заказать кухню ${area}`;
}
const text = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const cell = (value: unknown) => String(value ?? "").replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
const results: { url: string; keywords: string; basis: string; status: number; title: string; h1: string; canonical: string; issues: string[] }[] = [];
const routes = [...registry.routes];
try {
  const response = await fetch(new URL("/sitemap.xml", base), { signal: AbortSignal.timeout(25_000) });
  if (response.ok) {
    const sitemap = await response.text();
    const known = new Set(routes.map(row => row.url));
    for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const path = new URL(match[1]).pathname;
      if (!known.has(path)) {
        routes.push({ url: path, userEntryQuestion: "Тема требует редакционной проверки" });
        known.add(path);
      }
    }
  }
} catch { console.warn("Sitemap unavailable; audit uses the saved registry."); }
await Promise.all(Array.from({ length: 3 }, async () => {
  while (routes.length) {
    const row = routes.shift();
    if (!row) break;
    let status = 0, title = "", h1 = "", canonical = "";
    const issues: string[] = [];
    try {
      const response = await fetch(new URL(row.url, base), { signal: AbortSignal.timeout(25_000) });
      status = response.status;
      const html = await response.text();
      title = text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
      const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
      h1 = text(headings[0]?.[1] || "");
      const tag = [...html.matchAll(/<link\b[^>]*>/gi)].map(x => x[0]).find(x => /rel="canonical"/.test(x));
      canonical = tag?.match(/href="([^"]+)"/)?.[1] || "";
      if (status !== 200) issues.push(`HTTP ${status}`);
      if (headings.length !== 1) issues.push(`H1: ${headings.length}`);
      if (!title) issues.push("нет title");
      if (!canonical || new URL(canonical).href !== new URL(row.url, "https://kuhni.minsk.by").href) issues.push("проверить canonical");
    } catch (error) { issues.push(error instanceof Error ? error.message : "HTTP error"); }
    results.push({ url: row.url, keywords: seeds[row.url] || (status === 200 && h1 ? h1 : row.userEntryQuestion), basis: seeds[row.url] ? "Назначенный кластер" : "Тема из H1/реестра; нужна редакционная проверка", status, title, h1, canonical, issues });
  }
}));
results.sort((a, b) => a.url.localeCompare(b.url));
const output = [
  "# Постраничная карта запросов и проверка HTML", "",
  `Дата проверки: ${new Date().toISOString()}. Источник HTML: ${base}.`, "",
  "URL взяты из исторического реестра 112 страниц и дополнены доступным sitemap. Назначение кластера не означает проверенную позицию или частотность. Для статей и проектов тема получена из H1; она не заменяет отдельную редакционную проверку. Локальная сборка без БД не подтверждает production-контент.", "",
  `Проверено: ${results.length}. HTTP 200: ${results.filter(x => x.status === 200).length}. Строк с замечаниями: ${results.filter(x => x.issues.length).length}.`, "",
  "| URL | Запросы / тема | Основание | HTTP | Title | H1 | Замечания |",
  "|---|---|---|---:|---|---|---|",
  ...results.map(x => `| ${[x.url, x.keywords, x.basis, x.status, x.title, x.h1, x.issues.join("; ") || "HTML-проверка пройдена"].map(cell).join(" | ")} |`), "",
].join("\n");
const filename = new URL(base).hostname === "kuhni.minsk.by" ? "2026-09-06-production-ownership-baseline.md" : "2026-09-06-page-ownership-audit.md";
await writeFile(resolve(root, `docs/seo/${filename}`), output, "utf8");
console.log(JSON.stringify({ checked: results.length, ok: results.filter(x => x.status === 200).length, issues: results.filter(x => x.issues.length).map(x => ({ url: x.url, issues: x.issues })) }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
