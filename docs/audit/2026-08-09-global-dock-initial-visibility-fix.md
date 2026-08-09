# Global Dock initial visibility fix

Дата: 2026-08-09. Scope: только существующий Global Dock.

## Baseline

- production: `434467f9858c0a54e856f771ddaaf36b4abf6094`;
- local/origin before fix: `d25a7d9b93fb67da7a4bb74dd14446b470c84d9e`;
- между ними один docs/audit commit stage 8;
- dirty worktree сохранён, unrelated files не очищались и не включались в scope.

## Root cause

`PublicChromeBottom` подключал Dock внутри `DeferredPublicEnhancements`. Компонент возвращал `null` до pointer/keyboard/touch/scroll или таймера 3500 ms, а сам `MobileBottomNav` был dynamic import с `ssr:false`. Поэтому Dock отсутствовал в initial HTML и DOM.

Первый scroll активировал deferred subtree уже при `window.scrollY >= 32`. Mount-effect немедленно выполнял `setIsScrollHidden(true)`, из-за чего первый наблюдаемый state получал `mobile-page-dock--hidden`, opacity 0 и translate за viewport.

## Исправление

- `MobileBottomNav` напрямую рендерится в существующем `PublicChromeBottom` и присутствует в server HTML;
- analytics и `FloatingSocialButtons` остаются deferred;
- initial `isScrollHidden=false` не перезаписывается текущей позицией scroll;
- hide использует accumulated downward travel >48 px; upward delta >8 px и top возвращают Dock;
- explorer suppression включается реальным pointer/focus interaction;
- initial bottom compensation использует `body:has(.mobile-page-dock)` с прежним dataset fallback;
- ширины колонок уточнены так, чтобы четыре русские подписи не обрезались на 360/390/412.

## Local evidence

- `pnpm run typecheck`: PASS;
- `pnpm run build`: PASS, 127 pages; локальная Prisma DB недоступна, штатный static fallback сработал;
- `pnpm exec playwright test -c playwright.global-dock.config.ts`: 12/12 PASS;
- raw server HTML содержит `data-testid="mobile-bottom-nav"`;
- 360/390/412: initial visible, opacity 1, pointer events enabled, rect within viewport, targets ≥44 px, labels не обрезаны, overflow отсутствует;
- 768/1440: Dock скрыт CSS;
- public route matrix и technical exclusions: PASS;
- scroll slight/down/up/top, client navigation и browser back: PASS;
- LeadFormSheet: один dialog, Escape, scroll lock и focus restore: PASS;
- floating contact: visible/clickable, overlap отсутствует;
- observed layout shift after hydration/activation: 0; Dock-related console/hydration errors: 0;
- screenshots: `artifacts/global-dock-fix/screenshots/` (18 файлов, initial/down/up для шести URL).

## Scope boundary

Не изменялись page content, Borisov intent, furnitura interaction geometry, portfolio provenance, SEO, metadata, sitemap contract, Telegram, lead backend, Prisma или media.

## Rollback

Revert отдельного Dock-fix commit, push `work`, standard deploy и повтор regression matrix. Data/schema rollback не требуется.

## Production

Pending exact-path commit, push, deploy и live smoke.
