import { MATERIAL_EXPLORATION } from "./material-exploration";
import { catalogModels } from "./catalog-showcase";
import { MDF_PHOTOS } from "./mdf-gallery";
import { ENAMEL_PHOTOS } from "./enamel-content";
import { HPL_PHOTOS } from "./hpl-content";
import { ACRYLIC_PHOTOS } from "./acrylic-content";
export type MaterialPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  material: string;
  color: string;
  finish: string;
  texture: string;
  milling: string;
  layout: string;
};
const generated: MaterialPhoto[] = [
  [
    "hero-ivory",
    "hero-ivory",
    "mdf-enamel",
    "Светлая прямая кухня с фасадами цвета слоновой кости и древесным декором",
    "Светлые",
    "Матовая",
    "Комбинированная",
    "Гладкая",
    "Прямая",
  ],
  [
    "enamel-green",
    "enamel-green",
    "mdf-enamel",
    "Зелёная угловая кухня с рамочными фасадами и светлой столешницей",
    "Цветные",
    "Матовая",
    "Однотонная",
    "Рамочная",
    "Угловая",
  ],
  [
    "ldsp-home",
    "ldsp-home",
    "ldsp",
    "Прямая кухня с древесным декором, чёрными ручками и серой столешницей для дома",
    "Древесные",
    "Матовая",
    "Под дерево",
    "Гладкая",
    "Прямая",
  ],
  [
    "hpl-graphite",
    "hpl-graphite",
    "hpl",
    "Графитовая угловая кухня с гладкими фасадами и светлым верхом",
    "Тёмные",
    "Матовая",
    "Однотонная",
    "Гладкая",
    "Угловая",
  ],
  [
    "acrylic-grey",
    "acrylic-grey",
    "acrylic",
    "Светло-серая прямая кухня с глянцевыми фасадами у окна",
    "Светлые",
    "Глянцевая",
    "Однотонная",
    "Гладкая",
    "Прямая",
  ],
  [
    "veneer-oak",
    "veneer-oak",
    "veneer",
    "Кухня с вертикальным древесным рисунком фасадов и островом",
    "Древесные",
    "Матовая",
    "Под дерево",
    "Гладкая",
    "С островом",
  ],
  [
    "film-country",
    "film-country",
    "mdf-film",
    "Светлая кухня с рамочными фасадами и древесной столешницей для загородного дома",
    "Светлые",
    "Матовая",
    "Однотонная",
    "Рамочная",
    "Прямая",
  ],
  [
    "facade-detail",
    "facade-detail",
    "mdf-enamel",
    "Крупный план бежевого рамочного фасада рядом с древесной панелью и столешницей",
    "Светлые",
    "Матовая",
    "Комбинированная",
    "Рамочная",
    "Деталь",
  ],
].map(([id, file, material, alt, color, finish, texture, milling, layout]) => ({
  id,
  src: `/images/materials-hub-20261014/${file}.webp`,
  material,
  alt,
  caption: alt,
  color,
  finish,
  texture,
  milling,
  layout,
}));
const idMap: Record<string, string> = {
  "mdf-emal": "mdf-enamel",
  "plastik-hpl": "hpl",
  akril: "acrylic",
  shpon: "veneer",
  ldsp: "ldsp",
  film: "mdf-film",
  enamel: "mdf-enamel",
};
const details: MaterialPhoto[] = Object.values(MATERIAL_EXPLORATION).flatMap(
  (m) =>
    m.frames.map((f) => ({
      id: `surface-${m.slug}-${f.id}`,
      src: f.image,
      alt: f.alt,
      caption: f.result,
      material: idMap[m.slug],
      color: "По образцу",
      finish: "По образцу",
      texture: "По образцу",
      milling: "По образцу",
      layout: f.id === "d-kitchen" ? "Интерьер" : "Деталь",
    })),
);
// Из существующего каталога берём только визуальные концепции. Материал — направление
// подбора, а не вывод о фактическом составе изображения. Подпись сохраняет это различие.
const catalog: MaterialPhoto[] = catalogModels
  .filter((m) => m.visualization === true)
  .slice(0, 18)
  .flatMap((m) =>
    m.images
      .slice(0, 2)
      .map((src, i) => ({
        id: `idea-${m.id}-${i === 0 ? "main" : "angle"}`,
        src,
        alt: `${m.name}: ${i === 0 ? "общий вид" : "другой ракурс"}, визуальный пример кухни`,
        caption: `${m.name}. ${m.facade}. Точное покрытие согласуем по образцу.`,
        material: idMap[m.material] || "mdf-film",
        color:
          (
            {
              light: "Светлые",
              dark: "Тёмные",
              wood: "Древесные",
              colored: "Цветные",
            } as Record<string, string>
          )[m.color] || "По образцу",
        finish: "По образцу",
        texture: "По образцу",
        milling: "По образцу",
        layout:
          (
            {
              straight: "Прямая",
              corner: "Угловая",
              island: "С островом",
            } as Record<string, string>
          )[m.layout] || "Другая",
      })),
  );
export const MATERIAL_PHOTOS: MaterialPhoto[] = [
  ...generated,
  ...details,
  ...catalog,
  ...MDF_PHOTOS,
  ...ENAMEL_PHOTOS,
  ...HPL_PHOTOS,
  ...ACRYLIC_PHOTOS,
].filter((p, i, arr) => arr.findIndex((x) => x.src === p.src) === i);
