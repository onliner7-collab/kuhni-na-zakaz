# Этап 8 — итоговая приёмка

Дата: 2026-08-09  
Production: `https://kuhni.minsk.by`  
Runtime: `434467f`

## Волны

- 8A: `/locations` и 29 городских страниц.
- 8B: `/portfolio` и 13 целевых карточек.
- 8C: `/blog` и 24 статьи.
- 8D: 7 сервисных и trust-страниц.
- 8E: 6 utility/noindex/redirect-контрактов.
- 8F: полный crawl, перелинковка, Lighthouse и панели поисковых систем.

## Результаты

- Production build: успешно, 173 сгенерированные страницы.
- Sitemap: 112 canonical URL.
- Crawl: 112/112 с HTTP 200, H1, `lang=ru`, canonical и валидным JSON-LD.
- Перелинковка: 0 сиротских sitemap-страниц; все 112 URL достижимы с главной; глубина не более 4 кликов.
- Responsive/a11y smoke: 13/13 представителей без горизонтального overflow и изображений без alt.
- Utility: `/kitchen-configurator` перенаправляет на `/design-proekt-kuhni`; preview закрыт 404; 4 юридических/служебных URL отдают noindex.
- Playwright production: 4/4.
- Lighthouse, 13 семейств: performance 92–100, accessibility 91–100, SEO 100, CLS 0–0,024, TBT 5–91 мс.
- Контроль статьи после оптимизации: performance 98, accessibility 96, SEO 100, LCP 2276 мс, CLS 0, TBT 8 мс.
- Google Search Console: sitemap уже добавлен, статус «Успешно», обнаружено 112 страниц.
- Яндекс Вебмастер: sitemap добавлен вручную и найден в robots.txt, оба статуса «ок», 112 ссылок.

Артефакты находятся в `artifacts/general-rollout/stage-8/`.
