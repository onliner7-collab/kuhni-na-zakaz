# Performance Rules

- Основная цель — средний Android 360–412 px и медленная мобильная сеть.
- Server Components по умолчанию; hydration только в небольших интерактивных островах.
- Dynamic import — для тяжёлого не-критического UI; не добавлять библиотеку ради одного эффекта.
- Preload/priority только для истинного LCP hero; media ниже fold lazy, со width/height/aspect-ratio против CLS.
- Скрытые galleries/sequences/bottom sheets не загружают полный payload до потребности.
- Autoplay не обязателен; видео имеет poster; WebGL/полное 3D не является основой сайта.
- Все animations имеют reduced-motion вариант и не блокируют input.
- На каждом этапе сравнивать route JS, LCP, CLS и INP на mobile; фиксировать инструмент, сеть и устройство.
- Не заявлять абсолютные показатели без текущего измерения.

## Baseline risks

79/91 component-файлов client, глобальный `PublicChrome` client-only, крупные интерактивные монолиты, Three/R3F/Framer/Anime dependencies, 358 МБ public media и 203 image elements на furnitura route. Это список для измерения, не доказательство попадания каждого пакета/asset в initial bundle.
