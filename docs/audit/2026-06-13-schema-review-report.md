# Отзывы, Product/AggregateRating и schema review

Дата: 13 июня 2026  
Сайт: `https://kuhni.minsk.by`  
Страницы: `/`, `/reviews`, `/catalog/*`, `/blog/*`

## Итог

- Product/AggregateRating удалён с главной страницы: главная не является отдельной товарной карточкой, поэтому review-разметка на Product могла выглядеть натянутой.
- Видимый блок отзывов на главной теперь использует только содержательные опубликованные отзывы: оценка 4-5, имя заполнено, текст не короче 45 символов и без чрезмерной пунктуации.
- `/reviews` сохраняет LocalBusiness schema, но AggregateRating и Review строятся только по тем же качественным отзывам.
- Короткие или шумные отзывы остаются видимыми, если опубликованы администратором, но не усиливают schema.

## Изменённые файлы

| Файл | Что изменено |
|---|---|
| `artifacts/kuhni-na-zakaz/lib/schema-org.tsx` | Добавлен общий фильтр `isTrustedReviewForSchema`; rating/review schema считают только качественные отзывы. |
| `artifacts/kuhni-na-zakaz/app/page.tsx` | Убран Product JSON-LD с главной; блок отзывов показывает только качественные отзывы. |
| `artifacts/kuhni-na-zakaz/app/reviews/page.tsx` | LocalBusiness AggregateRating/Review построены через общий фильтр. |

## Проверка соответствия видимому контенту

| Страница | Schema | Проверка |
|---|---|---|
| `/` | WebSite, LocalBusiness, BreadcrumbList, FAQPage | Нет Product/AggregateRating; отзывы в schema не заявляются. |
| `/reviews` | BreadcrumbList, LocalBusiness, AggregateRating, Review | Рейтинг строится только на опубликованных содержательных отзывах. |
| `/catalog/[slug]` | BreadcrumbList, Product, Offer, FAQPage при наличии FAQ | Product schema остаётся на карточках категорий/товаров, где есть коммерческая страница и оффер. |
| `/blog/[slug]` | BreadcrumbList, Article/BlogPosting | Review schema не добавляется. |

## Validation checklist после деплоя

- Проверить исходный HTML `/`: отсутствует `"@type":"Product"` на главной.
- Проверить исходный HTML `/reviews`: `AggregateRating.reviewCount` не больше числа качественных опубликованных отзывов.
- Прогнать `/` и `/reviews` через Schema.org Validator.
- Проверить Rich Results Test для `/reviews`; если Google не показывает review snippet для LocalBusiness, оставить schema как entity/trust-сигнал, не обещая расширенный сниппет.
- В GSC после деплоя проверить разделы Breadcrumbs, FAQ и улучшения, связанные с отзывами.
- Production DOM smoke после деплоя: главная содержит LocalBusiness, не содержит Product schema; `/reviews` содержит AggregateRating и Review schema.

## Открытые пункты

- Нужен процесс получения 30+ реальных отзывов: Яндекс, Google, сайт `/reviews`.
- Для каждого внешнего отзыва желательно хранить источник и ссылку в админке, если отзыв используется как доказательство.
- Не добавлять отзывы в schema, если они короткие, неподтверждённые, без смысла или выглядят сгенерированными.
