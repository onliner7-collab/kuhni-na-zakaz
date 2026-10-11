# Дополнение галерей каталога

## Изображения

Генерация через встроенный Codex/OpenAI imagegen снова доступна. Отобраны 15 изображений: по три для country-blue, cottage-white, log-neoclassic и studio-green, открытый нижний шкаф corner-green, исправленные незеркальные ракурсы classic-corner и hightech-corner. Один предварительный ракурс cottage-white отклонён из-за изменённого количества ящиков, подключён angle-v2.

Все 24 модели имеют минимум четыре кадра; corner-green имеет пять. Всего 97 кадров вместо 84. Сохранены PNG-оригиналы и WebP 1200x800, 45940–158094 байт. UI использует только WebP. Общие изображения и данные /prices не изменены.

Для смешанных серий studio-green и corner-green происхождение отмечается отдельно для текущего кадра: исходные фотографии не названы визуализациями, новые сгенерированные кадры не выдаются за выполненные заказы. Наполнение иллюстративное и согласуется при проектировании. Генерация не доказывает точные размеры и полную геометрическую идентичность всех элементов.

Исходники: artifacts/kuhni-na-zakaz/public/images/catalog-showcase/.
Промпты: outputs/catalog-gallery-2026-10-11/resumed-prompts.json.
Оптимизация: outputs/catalog-gallery-2026-10-11/optimize-resumed.cjs.

Title, description, H1, canonical, URL, schema и общие компоненты не менялись. Предыдущее ограничение генерации и неполные серии в отчёте 2026-10-11-catalog-gallery.md описывают историческое состояние до этого дополнения.

## Проверка

Локальная production-сборка и типизация прошли (127 страниц с fallback, локальная БД недоступна). Playwright 7/7: 320/390/768/1440 px, все 97 image URL HTTP200, naturalWidth > 0 для каждого кадра всех 24 галерей, корректное происхождение текущего кадра, счётчик, Escape и возврат фокуса. Форма проверена с перехватом тестового запроса, без настоящего лида. Canonical, JSON-LD и защищённые страницы сохранены. Скриншоты: outputs/catalog-gallery-2026-10-11/resumed-local-tests/.

Серверная production-сборка и типизация прошли, 173/173 страниц с настоящей БД. Изолированный runtime commit: 5fcfd3c79b906ecd2cf649e9bafda9843a3f0902, BUILD_ID fqu7Og5q_4BcRJIOllWsD, service active, tracked worktree чистый.

Production Playwright: 7/7. Все 97 image URL HTTP200; каждый кадр всех 24 моделей загружается, naturalWidth > 0. Ширины 320/390/768/1440 без horizontal overflow; форма проверена без настоящей заявки. MCP дополнительно проверил пятый кадр corner-green на 390 px: WebP, naturalWidth 1200, overflow false, подпись визуализации вместо исходной фотографии.

Скриншот: outputs/catalog-gallery-2026-10-11/resumed-production-gallery-mobile.png. Остальные production-скриншоты: outputs/catalog-gallery-2026-10-11/resumed-production-tests/.
Аудит: 26/26 внутренних ссылок HTTP200; title, description, H1 и canonical семи защищённых страниц совпадают с исходным baseline. Sitemap обновлён: 112 URL, /catalog lastmod 11.10.2026; robots.txt HTTP200.

В MCP остаются существующее предупреждение preload CSS и блокировка iframe mc.yandex.ru текущей CSP. Галереи не затронуты; общая CSP/Метрика этим узким выпуском не изменялась.

Откат: .next-before-gallery-5fcfd3c79b906ecd2cf649e9bafda9843a3f0902 содержит предыдущий runtime; предыдущий код c62ca15123d670e27d0e9ab20c3e546a3dc2bfe4 (документационное продолжение runtime 1c8d4d9). Пользовательский dirty workspace не сбрасывать.

Повторные запросы в поисковые панели в этом дополнении не отправлялись: /catalog уже был отправлен Google 11.10.2026; последний подтверждённый статус Яндекс Вебмастера — временная недоступность сервиса. Новая индексация и позиции не заявляются.
