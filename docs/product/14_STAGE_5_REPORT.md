# Отчёт Product этапа 5
Изменены `PublicChrome`, `MobileBottomNav`, `ContactForm`, `globals.css`; добавлен `LeadFormSheet`.

Старый Dock был контекстным и менял состав по маршруту. Новый Dock имеет четыре подписанных действия, обычные ссылки, active state и safe-area-компенсацию. Форма открывается одним нажатием, удерживает фокус, закрывается Escape и возвращает фокус на кнопку.

`pnpm typecheck` и `pnpm build` прошли. Build вывел ожидаемые предупреждения о недоступной локальной Prisma БД. Responsive smoke на 360/390/412/768/1440 прошёл; overflow не обнаружен. Deploy выполняется после отдельного подтверждения smoke-результатов.

## 2026-08-09 — исправление initial visibility

Production Reality Audit обнаружил, что Dock был исключён из initial HTML из-за общего activation gate и `ssr:false`, а первый scroll монтировал его уже скрытым. Существующий `MobileBottomNav` перенесён из deferred enhancement в прямой render `PublicChromeBottom`; новый Dock не создавался.

Initial state теперь visible. Малое движение до 48 px не скрывает Dock, устойчивая прокрутка вниз скрывает, прокрутка вверх и возврат к top возвращают. Контентная компенсация применяется сразу по наличию server-rendered Dock, safe-area и reduced-motion сохранены. Порядок, URL, active mapping, LeadFormSheet и floating contact не изменялись.

Локально: typecheck и production build PASS; Playwright 12/12 PASS, включая raw server HTML, 360/390/412, desktop, public/exclusion routes, scroll, navigation/back, lead focus, floating contact, CLS=0 и screenshots. Production deploy фиксируется отдельным acceptance follow-up после live smoke.
