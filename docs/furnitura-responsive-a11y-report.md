# Responsive и accessibility отчет /materials/furnitura

Дата обновления: 2026-06-02

## Статус этапа 4

Этап 4 реализован локально: на странице подключена интерактивная галерея фурнитуры и переиспользован существующий компонент `ImageLightbox`.

## Что реализовано

- Hover для миниатюр: легкое увеличение, мягкая тень, плавный переход, pointer через кнопку.
- Click по миниатюре открывает lightbox.
- Закрытие lightbox: кнопка с aria-label, Esc, клик вне изображения.
- Навигация: стрелки на экране, ArrowLeft/ArrowRight на клавиатуре.
- Mobile swipe: используется существующая обработка touch-свайпа в `ImageLightbox`.
- Focus management: при открытии фокус переводится на кнопку закрытия, внутри lightbox работает focus trap, при закрытии фокус возвращается на исходную миниатюру.
- Доступность: миниатюры являются `button`, имеют русские `aria-label`; изображения имеют уникальные русские `alt`.
- Performance: все изображения имеют стабильный `aspect-video`; hero загружается с `priority`, галерея через lazy loading; размеры заданы через `sizes`.
- Reduced motion: hover-анимации отключаются через `motion-reduce`.

## Локальная browser QA

- Desktop 1440px: проверены один H1, canonical, отсутствие noindex, отсутствие горизонтального overflow, 50 кнопок галереи и 10 категорий.
- Lightbox: открытие по клику, закрытие Esc, навигация ArrowRight, возврат фокуса и aria-label проверены через Browser/Playwright.
- Mobile 390px: проверены один H1, отсутствие горизонтального overflow, 50 кнопок галереи, открытие lightbox и закрытие Esc.
- Консоль: ошибок нет; предупреждения только про third-party cookies браузера.

## Production QA 2026-06-02

- Desktop production с cache-bust URL: 50 кнопок галереи, 10 категорий, один H1, canonical корректный, `noindex` нет, горизонтального overflow нет, console errors 0.
- Lightbox на production: открытие по клику, фокус на `Закрыть галерею`, ArrowRight листает, Esc закрывает, фокус возвращается на исходную миниатюру.
- Mobile production 390px: 50 кнопок галереи, один H1, горизонтального overflow нет, console errors 0.
- Mobile swipe реализован в существующем `ImageLightbox` через touchstart/touchend; ручной синтетический TouchEvent в Browser не пролистнул кадр, keyboard/arrow navigation проверены.
