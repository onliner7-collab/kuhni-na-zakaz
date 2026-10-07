# Борисов: эмоциональное описание и короткие тексты

Поручение владельца: внедрить согласованный основной description и пять текстов групп запросов, затем опубликовать.

Основной description: «Ваша семья заслуживает кухни, от которой ахнут гости. Создадим её под ваши размеры и бюджет. Своё производство в Борисове, доставка и монтаж по договору.» Единый источник data/locations.ts автоматически используется metadata, Open Graph и Twitter. Отдельные descriptions по запросам не создаются.

Diff audit: ADAPT — hero и housing intro; ADD — короткие абзацы бюджета, планировки и производства. KEEP — заголовки, URL, canonical, контакты/адрес, визуальные идеи и alt, формы, параметры выбора, баннер связи, FAQ и ссылки. Scope трёх runtime-файлов ограничен Борисовом. Новые медиа и зависимости не нужны.

PRODUCTION_PASS: runtime 29dce6d опубликован; локальная типизация и серверные typecheck/build (173 страницы) PASS, service active.

Live: meta description, Open Graph и Twitter совпадают с утверждённым текстом; все пять новых абзацев присутствуют. Один H1, self canonical, HTTP 200 для страницы/robots/sitemap. 320/390/430/768/1440: нет overflow и обрезанных абзацев. Выбор «Для дачи»/«Угловая», смена картинки/заголовка, сброс и переход к форме работают. Баннер связи раскрывается в шапке. Пустая форма показывает ошибки имени, телефона и согласия; действующая заявка не отправлялась. Видимых битых изображений нет, browser error logs пусты.

Regression: SHA256 main HTML, title, description и canonical пяти защищённых URL полностью совпали с данными до деплоя (/; /design-proekt-kuhni; /locations/minskaya-oblast; /locations/minsk; /materials/furnitura).

Rollback: предыдущая .next сохранена в /var/www/kuhni-na-zakaz/.deploy-backups/next-before-borisov-copy-20261007. Для отката вернуть этот symlink вместо текущего .next, перезапустить kuhni-na-zakaz; предыдущий runtime e59f707.
