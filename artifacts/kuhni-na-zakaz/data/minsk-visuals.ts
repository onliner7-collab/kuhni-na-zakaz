export type MinskModule = { label: string; width: number };
export type MinskVisual = {
  image: string;
  alt: string;
  caption: string;
  modules?: MinskModule[];
  room?: {
    width: number;
    depth: number;
    layout: "straight-back" | "straight-left" | "corner";
    table?: [number, number];
  };
};
const folder = "/uploads/locations/minsk-v2-20261018";
const assets: Record<string, string[]> = {
  layout: [
    "layout-corner",
    "layout-straight",
    "layout-small",
    "layout-ceiling",
    "layout-u-shape",
    "layout-island",
    "layout-peninsula",
    "layout-galley",
    "layout-handleless",
    "layout-integrated",
  ],
  length: [
    "length-2m",
    "length-2-5m",
    "length-3m",
    "length-3-5m",
    "length-4m",
    "length-5m",
    "length-corner-2x2",
    "length-corner-2x3",
    "length-custom",
  ],
  area: [
    "area-5m2",
    "area-6m2",
    "area-7m2",
    "area-8m2",
    "area-9m2",
    "area-10m2",
    "area-12m2",
  ],
  room: [
    "room-apartment",
    "room-new-build",
    "room-studio",
    "room-khrushchev",
    "room-house",
    "room-dacha",
    "room-narrow",
  ],
  material: [
    "material-mdf-film",
    "material-ldsp",
    "material-enamel",
    "material-hpl",
    "material-acrylic",
    "material-veneer",
    "material-matte-mix",
    "material-worktop-laminate",
    "material-worktop-quartz",
  ],
  style: [
    "",
    "",
    "style-neoclassic",
    "",
    "style-scandi",
    "style-classic",
    "style-provence",
    "",
    "style-japandi",
    "style-white",
  ],
};
const lengthModules: MinskModule[][] = [
  [
    { label: "Ящики", width: 400 },
    { label: "Духовка", width: 600 },
    { label: "Ящики", width: 400 },
    { label: "Мойка", width: 600 },
  ],
  [
    { label: "Мойка", width: 600 },
    { label: "ПММ", width: 450 },
    { label: "Хранение", width: 350 },
    { label: "Духовка", width: 600 },
    { label: "Ящики", width: 500 },
  ],
  [
    { label: "Мойка", width: 600 },
    { label: "ПММ", width: 450 },
    { label: "Ящики", width: 450 },
    { label: "Духовка", width: 600 },
    { label: "Шкаф", width: 900 },
  ],
  [
    { label: "Холод.", width: 600 },
    { label: "Мойка", width: 600 },
    { label: "ПММ", width: 450 },
    { label: "Ящики", width: 650 },
    { label: "Духовка", width: 600 },
    { label: "Ящики", width: 600 },
  ],
  [
    { label: "Холод.", width: 600 },
    { label: "Мойка", width: 600 },
    { label: "ПММ", width: 600 },
    { label: "Ящики", width: 1000 },
    { label: "Духовка", width: 600 },
    { label: "Пенал", width: 600 },
  ],
  [
    { label: "Холод.", width: 600 },
    { label: "Пенал", width: 600 },
    { label: "Мойка", width: 600 },
    { label: "ПММ", width: 600 },
    { label: "Ящики", width: 800 },
    { label: "Духовка", width: 600 },
    { label: "Ящики", width: 600 },
    { label: "Пенал", width: 600 },
  ],
];
const rooms: NonNullable<MinskVisual["room"]>[] = [
  { width: 2000, depth: 2500, layout: "straight-back" },
  { width: 2000, depth: 3000, layout: "straight-left", table: [600, 350] },
  { width: 2500, depth: 2800, layout: "corner", table: [650, 650] },
  { width: 2500, depth: 3200, layout: "corner", table: [750, 500] },
  { width: 3000, depth: 3000, layout: "corner", table: [800, 800] },
  { width: 2500, depth: 4000, layout: "straight-left", table: [1000, 650] },
  { width: 3000, depth: 4000, layout: "corner", table: [1200, 750] },
];
export function minskVisual(
  group: string,
  index: number,
  label: string,
): MinskVisual | undefined {
  if (group === "style" && !assets.style[index]) return undefined;
  const sourceIndex = index;
  const id = assets[group]?.[sourceIndex];
  if (!id) throw new Error(`Нет иллюстрации Минска: ${group}/${index}`);
  const modules = group === "length" ? lengthModules[index] : undefined;
  const room = group === "area" ? rooms[index] : undefined;
  let caption = `Иллюстрация: ${label.toLocaleLowerCase("ru")}. Отделку согласуем по образцам.`;
  if (modules)
    caption = `Пример прямой кухни ${label}: компоновка из ${modules.length} модулей.${index < 3 ? " Холодильник размещается отдельно." : ""} Ширины — на схеме, посадка — по замеру.`;
  if (group === "length" && index >= 6)
    caption =
      index === 6
        ? "Угловая компоновка вдоль стен 2 × 2 м. Угловой модуль учитывается в обеих сторонах."
        : index === 7
          ? "Угловая компоновка вдоль стен 2 × 3 м: длинная сторона содержит больше хранения."
          : "Индивидуальная компоновка: разные ширины шкафов и доборы под геометрию стен.";
  if (room)
    caption = `Иллюстрация для комнаты ${(room.width / 1000).toLocaleString("ru")} × ${(room.depth / 1000).toLocaleString("ru")} м. План показывает мебель и свободное пространство.`;
  return {
    image: `${folder}/${id}.webp`,
    alt: `Иллюстрация кухни: ${label.toLocaleLowerCase("ru")}`,
    caption,
    modules,
    room,
  };
}
