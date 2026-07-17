# Реализация глобальной навигации
На базе существующих `PublicChrome` и `MobileBottomNav` реализован постоянный Dock без изменения URL, metadata, schema, sitemap и содержимого защищённых страниц.

До 767 px порядок фиксирован: «Выбрать» (`/catalog`), «Цены» (`/prices`), «Наши работы» (`/portfolio`), «Оставить заявку». Первые три пункта — обычные ссылки; active state определяется по маршруту и обозначается цветом, формой и `aria-current`. С 768 px Dock скрыт, desktop-навигация сохраняется.

`LeadFormSheet` открывается без перехода со страницы. Компактный режим существующего `ContactForm` требует имя, телефон и согласие, передаёт `sourcePage`, `pageUrl`, `pageTitle` и использует действующий `/kapi/leads`. Telegram/outbox и `FloatingSocialButtons` не изменялись. Пилотные PageActionRail не подключались по решению владельца.

