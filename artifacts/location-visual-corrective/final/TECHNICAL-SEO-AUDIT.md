# Финальный technical SEO audit

Дата проверки: 2026-08-21. Источник: production crawl 112 URL, Lighthouse 12.6.1, Playwright 32 URL и встроенный Browser.

| Область | Балл | Evidence |
|---|---:|---|
| Crawlability | 10/10 | robots 200, sitemap объявлен, 112/112 URL доступны |
| Indexability | 10/10 | 112/112 self-canonical, без HTTP/noindex-блокеров в проверенном наборе |
| Performance | 10/10 | все representative L3 прогоны: P≥90, LCP<2500, TBT≤200, CLS=0 |
| Mobile | 10/10 | 360/390/412/768/1440, touch targets и overflow PASS |
| Security | 10/10 | HTTP→HTTPS 301, HSTS, CSP, Referrer-Policy, Permissions-Policy, nosniff |
| URL structure | 10/10 | canonical host/protocol согласованы, стабильные читаемые slugs |
| Structured data | 10/10 | Lighthouse SEO 100, structured-data audit PASS |
| International SEO | N/A | один русскоязычный региональный сайт, hreflang не требуется |

Итог: 100/100 по применимым техническим разделам. P0/P1 дефектов нет.

P2-наблюдение: robots.txt не фиксирует отдельную политику для AI crawlers; это не влияет на acceptance текущего ТЗ, но stance allow/block-training стоит определить отдельным бизнес-решением.
