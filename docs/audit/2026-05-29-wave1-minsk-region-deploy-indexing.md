# Волна 1 SEO/GEO: деплой и индексация

Дата: 2026-05-29  
Сайт: `https://kuhni.minsk.by`  
Коммит внедрения: `dd4c5e0` (`Add Minsk region wave 1 location pages`)

## Деплой

- Ветка `work` отправлена в GitHub: `origin/work`.
- Production обновлен через серверный скрипт `deploy/scripts/update-production.sh work`.
- Первый запуск деплоя остановился из-за неотслеживаемого серверного файла `artifacts/kuhni-na-zakaz/public/llms.txt`.
- Серверная копия сохранена как `artifacts/kuhni-na-zakaz/public/llms.txt.server-backup-20260529`, после чего деплой прошел успешно.
- `pnpm install --frozen-lockfile`, `prisma generate`, `prisma db push`, импорт подготовленных фото, запись static sitemap, синхронизация NAP и `next build` на сервере прошли успешно.
- Сервис `kuhni-na-zakaz` после деплоя: `active (running)`.

## Production QA

Проверены URL:

- `https://kuhni.minsk.by/locations/dzerzhinsk`
- `https://kuhni.minsk.by/locations/zaslavl`
- `https://kuhni.minsk.by/locations/logoisk`
- `https://kuhni.minsk.by/locations/vileyka`
- `https://kuhni.minsk.by/locations/nesvizh`

Результат:

- Все 5 страниц отдают HTTP 200.
- Title, H1, meta description и canonical присутствуют.
- Canonical ведет на production URL соответствующего города.
- На страницах есть блоки с маркировкой `3D-визуализация КухниBY`.
- 3D-изображения загружаются через Next Image, alt-тексты на русском.
- Форма на `/locations/dzerzhinsk` проверена без отправки заявки: поля заполняются, `sourcePage=/locations/dzerzhinsk`, `sourceType=location-region`, `cityKey=dzerzhinsk`, согласие отмечается.
- Переход CTA к форме и переход на `/prices` работают.
- На desktop и mobile горизонтального переполнения не найдено.
- Production `/sitemap.xml` содержит новые URL.
- Production `/robots.txt` доступен и содержит sitemap.
- Production `/llms.txt` доступен и содержит новые URL.

Скриншоты:

- `C:/Users/User/Desktop/kuhni-na-zakaz/production-logoisk-desktop.png`
- `C:/Users/User/Desktop/kuhni-na-zakaz/production-nesvizh-mobile.png`

## Google Search Console

- OAuth API-токен Google Search Console больше не действителен: `invalid_grant`, токен истек или отозван.
- Проверка и действия выполнены через UI Google Search Console в браузере.
- Sitemap `https://kuhni.minsk.by/sitemap.xml` повторно отправлен.
- После отправки GSC показал: отправлено 29 мая 2026, обработано 29 мая 2026, статус `Успешно`, выявлено 84 страницы.
- Сообщение GSC от 29 мая 2026 `Новые причины препятствуют индексированию страниц с сайта kuhni.minsk.by` проверено.
- Новая причина: `Вариант страницы с тегом canonical`.
- Затронутый пример: `https://kuhni.minsk.by/?sourceType=home_3d_ideas`.
- Это не одна из новых городских страниц. Причина относится к параметрическому URL главной, который канонизируется на главную страницу.
- Для `/locations/dzerzhinsk` выполнена URL Inspection: статус `URL нет в индексе Google`, причина `URL неизвестен Google`.
- Для `/locations/dzerzhinsk` успешно отправлен запрос на индексирование: `URL добавлен в приоритетную очередь сканирования`.
- После первого запроса Google показал reCAPTCHA/anti-spam iframe, поэтому автоматическую отправку оставшихся четырех URL не продолжали.

Оставшиеся URL для ручной отправки в GSC после прохождения reCAPTCHA:

- `https://kuhni.minsk.by/locations/zaslavl`
- `https://kuhni.minsk.by/locations/logoisk`
- `https://kuhni.minsk.by/locations/vileyka`
- `https://kuhni.minsk.by/locations/nesvizh`

## Яндекс Вебмастер

Проверка выполнена через официальный API Яндекс Вебмастера.

- Пользователь API доступен: HTTP 200.
- Хост найден и подтвержден: `https:kuhni.minsk.by:443`.
- Sitemap найден: `https://kuhni.minsk.by/sitemap.xml`.
- Sitemap в Яндексе: `errors_count=0`, `urls_count=112`, источники `ROBOTS_TXT` и `WEBMASTER`.
- Все 5 новых URL отправлены на переобход, API вернул HTTP 202.
- Очередь переобхода подтвердила состояние `IN_PROGRESS` для всех 5 новых URL.
- Остаток квоты после отправки: 146.

Отправленные URL:

- `https://kuhni.minsk.by/locations/dzerzhinsk`
- `https://kuhni.minsk.by/locations/zaslavl`
- `https://kuhni.minsk.by/locations/logoisk`
- `https://kuhni.minsk.by/locations/vileyka`
- `https://kuhni.minsk.by/locations/nesvizh`

## Рекомендации

- Обновить OAuth-доступ Google Search Console, чтобы снова работали API-проверки без UI.
- В GSC вручную пройти reCAPTCHA и запросить индексирование для оставшихся четырех новых URL.
- Отдельной задачей убрать или минимизировать crawlable URL с параметром `sourceType` на главной, если не нужно, чтобы Google видел такие варианты как отдельные URL.
