# Этап 6 — production acceptance

Статус: `STAGE_6_ACCEPTED`

- Runtime HEAD: `f96b4f9ec9db95eb20eed0466ee1de098cf9ad9c`.
- Scope: `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/materials/furnitura`.
- Local Playwright: 30/30 PASS.
- Production smoke: 5/5 routes + sitemap + robots HTTP 200.
- Production journey: 5/5 PASS с отдельным успешным повтором одного transport timeout.
- Production Lighthouse: 5/5 standard simulated mobile PASS; Performance 98–100, LCP 1502–2137 мс, CLS 0, TBT 0–6 мс, Accessibility 93–96, SEO 100.
- Media: REUSE, новые изображения не генерировались.

Подробности: `docs/audit/2026-08-02-general-rollout-stage-6.md`.
