# Прямые кухни: содержание, иллюстрации и расчёт

Дата: 12 октября 2026. URL: /catalog/pryamye-kuhni. Пользователь разрешил внедрение, узкий деплой, обновление sitemap и отправку URL Google/Яндексу.

## Семантика и география

Основной кластер: прямые кухни на заказ, купить прямую кухню, заказать прямую кухню, прямая кухня по индивидуальным размерам, линейные кухни на заказ. Поддержка: 2/2,5/3/4 метра, фото, стоимость, недорогие прямые кухни, пенал, посудомойка, встроенный холодильник, студия, до потолка.

Список составлен по поиску московских предложений: НОРДЛИС, LORENA, Kitchen Design, «Дешевая Мебель». Белорусская терминология сверена с Mebelhaus. Это исследование формулировок и интента, не замер частотности Wordstat с установленным регионом Москва, KD или позиций Google/Яндекса. Московские объёмы не переносились на Беларусь. Геозапросы остаются за /locations/..., общие «кухни на заказ» за главной, бюджет и верхние шкафы — соответствующими разделами.

## Diff-аудит

KEEP: шесть состояний визуального сравнения, ExploreContext, действующая ContactForm/Lead система, URL, глобальный Dock и связь. ADAPT: коммерческий H1/title/description, русский lead, источник формы, внутренние ссылки, честный provenance. REPLACE: отвлечённое вступление и служебные тексты формы на клиентский выбор. ADD: фото кухни целиком, хранение, четыре схемы модулей, схема предварительного замера, комплектация/стоимость, шесть FAQ. Другие категории и Борисов не редактируются.

Релиз изолирован от production 09e3d4ac9e891d13128212f922697ae11235f49c в codex/straight-kitchens-release. Не публиковать весь dirty diff основного workspace.

## Реализация

Title: Прямые кухни на заказ — по вашим размерам. H1: Прямые кухни на заказ. Description: Прямые кухни на заказ по вашим размерам. Сравните схемы на 2, 3 и 4 метра, расположение техники и хранение. Отправьте размеры для расчёта комплектации.

Canonical прежний; индексирование разрешено. CollectionPage/Service, BreadcrumbList и FAQPage совпадают с видимым содержанием, без вымышленных Product/Offer, цен и отзывов. sitemap: только /catalog/pryamye-kuhni получает lastmod 2026-10-12; статическая копия пересоздаётся перед build и на сервере.

Размерные схемы: 200 = 60+40+60+40; 250 = 60+45+45+60+40; 300 = 60+60+45+75+60; 400 = 60+60+60+60+100+60 см. Первые две исключают холодильник, последние включают. Это примеры до уточнения доборов, монтажных зазоров и спецификаций техники, не обещание готовых комплектов. Подробности раскрываются в native details; новое содержание server rendered, ограниченный клиентский код для выбора длины и формы. Ручные изменения размеров сохраняются при смене схемы.

Ссылки: цены, калькулятор, бюджет, студия, маленькие/угловые/до потолка, сравнение планировок, ЛДСП/МДФ и география.

## Медиа и prompts

Встроенный imagegen Codex/OpenAI, два новых реалистичных изображения: светлая прямая кухня целиком; открытые ящики и пенал. Идеи дизайна с видимыми подписями, не реальные объекты. PNG originals: public/images/straight-kitchens/generated/straight-hero.png и straight-storage.png. WebP 1200×800 через sharp quality80: 56 496 и 96 734 байт; только WebP используется в src и OG. Шесть прежних состояний сохраняют WebP/AVIF. Новые схемы созданы непосредственно SVG/React для точности и доступности.

Prompt hero: photorealistic-natural, landscape3:2; entire single-wall straight kitchen, warm ivory matte and oak cabinets, sink left, clear preparation zone, hob right, oven below, tall refrigerator cabinet left, natural daylight, no corner return/island/people/text/logos/watermark; photograph, not 3D render.

Prompt storage: photorealistic-natural, landscape3:2; straight ivory/oak kitchen, pulled-out cutlery and pot drawers next to open pantry shelves, believable joinery/hardware, natural daylight, no corner/island/people/text/logos/watermark; photograph, not 3D render.

## Проверки и известные ограничения

Типизация PASS. Локальная build проходит со статическими fallback: локальная БД 127.0.0.1:5434 недоступна. First attempt без тестового SESSION_SECRET завершился ошибкой окружения; повтор с локальным тестовым secret успешен. Dev CSP блокирует eval Next dev; UI проверяется на production build без изменения политики безопасности. Динамический SVG title исправлен на одну строку для совпадения server/client HTML.

Форма тестируется только с перехватом /kapi/leads, без отправки реального лида. Evidence: outputs/straight-kitchens-20261012, tests/smoke/straight-kitchens.spec.ts. Перед релизом: все 112 production URL HTTP200, один H1, canonical есть; сохранены sitemap и metadata baseline.

Использованные skills: keyword-research, serp, technical-seo-developer, meta-tags-optimizer, schema-markup-generator, internal-linking-optimizer, on-page-seo-auditor, technical-seo-checker, accessibility-performance-qa, playwright, mcp-doc-router, image-generation-brief, imagegen. Документация Next.js15: Context7; правила lastmod и URL Inspection — официальные Google Search Central/Help. Частотности, CWV полевых данных, рост заявок и индексация новой версии не измерены.

## Публикация и поисковые панели

Статус будет дополнен после production QA. Google панель доступна. Яндекс /sites/ показывает официальную страницу временной недоступности сервиса; отправка пока не выполнена. API-токены не использовались.

Rollback: остановить service на замену .next, вернуть сохранённую .next-before-straight-<release>, источник на 09e3d4ac9e891d13128212f922697ae11235f49c, запустить service и пересоздать static sitemap. Не сбрасывать пользовательский dirty workspace.
