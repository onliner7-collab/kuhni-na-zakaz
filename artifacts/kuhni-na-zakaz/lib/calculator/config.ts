export const layouts = [
  { id: "straight", title: "Прямая", description: "Вдоль одной стены", sides: 1 },
  { id: "corner", title: "Угловая", description: "Вдоль двух стен", sides: 2 },
  { id: "u_shape", title: "П-образная", description: "Вдоль трёх стен", sides: 3 },
] as const;
export type Layout = typeof layouts[number]["id"];
export const materials = [
  { id: "mdf_film", title: "МДФ в плёнке", description: "Фасады с плёночным покрытием" },
  { id: "ldsp", title: "ЛДСП", description: "Ламинированная плита" },
  { id: "plastic", title: "Пластик", description: "Фасады с пластиковым покрытием" },
  { id: "enamel", title: "МДФ в эмали", description: "Окрашенные фасады" },
] as const;
export const uppers = [
  { id: "standard", title: "Обычные верхние шкафы" },
  { id: "ceiling", title: "Шкафы до потолка" },
  { id: "none", title: "Без верхних шкафов" },
] as const;
export const countertops = [
  { id: "laminate", title: "Ламинированная столешница" },
  { id: "acrylic", title: "Искусственный камень — акрил" },
  { id: "quartz", title: "Кварцевый агломерат" },
] as const;
export const hardwareOptions = [
  { id: "basic", title: "Базовая", description: "Обычные петли и направляющие" },
  { id: "soft_close", title: "С доводчиками", description: "Плавное закрывание дверей и ящиков" },
] as const;
export interface Selection {
  layout: Layout;
  lengths: string[];
  approximate: boolean;
  undecided: boolean;
  material: typeof materials[number]["id"];
  upper: typeof uppers[number]["id"];
  countertop: typeof countertops[number]["id"];
  hardware: typeof hardwareOptions[number]["id"];
}
export const initialSelection: Selection = {
  layout: "straight", lengths: ["", "", ""], approximate: true, undecided: false,
  material: "mdf_film", upper: "standard", countertop: "laminate", hardware: "basic",
};
export const packages = [
  { id: "basic", title: "Простая комплектация", description: "МДФ в плёнке, обычные верхние шкафы, ламинированная столешница и базовая фурнитура.", upper: "standard", hardware: "basic" },
  { id: "comfort", title: "С плавным закрыванием", description: "Та же основа, с доводчиками для дверей и ящиков.", upper: "standard", hardware: "soft_close" },
  { id: "ceiling", title: "Больше хранения", description: "Шкафы до потолка, МДФ в плёнке, ламинированная столешница и доводчики.", upper: "ceiling", hardware: "soft_close" },
] as const;
export const examples = [
  { id: "straight", title: "Прямая кухня, 3 м", description: "Одна сторона, обычные верхние шкафы", image: "/images/prices-showcase/generated/scandi-straight-3m-1.webp", layout: "straight", lengths: ["3", "", ""], packageId: "basic" },
  { id: "corner", title: "Угловая кухня, 3 × 2 м", description: "Две стороны, плавное закрывание", image: "/images/prices-showcase/generated/modern-corner-3x2-1.webp", layout: "corner", lengths: ["3", "2", ""], packageId: "comfort" },
  { id: "ceiling", title: "Кухня до потолка, 3 м", description: "Одна сторона, больше места для хранения", image: "/images/prices-showcase/generated/modern-ceiling-3m-1.webp", layout: "straight", lengths: ["3", "", ""], packageId: "ceiling" },
] as const;
export function parseMeters(value: string): number {
  const normalized = value.trim().replace(",", ".");
  return /^\d+(?:\.\d{1,2})?$/.test(normalized) ? Number(normalized) : NaN;
}
export function lengthError(selection: Selection): string | null {
  const count = layouts.find(l => l.id === selection.layout)!.sides;
  for (let i = 0; i < count; i++) {
    const value = parseMeters(selection.lengths[i] || "");
    if (!Number.isFinite(value) || value < 0.6 || value > 10) return `Укажите сторону ${["А", "Б", "В"][i]} от 0,6 до 10 м. Например: 2,4.`;
  }
  return null;
}
export function getLengths(selection: Selection): number[] {
  return selection.lengths.slice(0, layouts.find(l => l.id === selection.layout)!.sides).map(parseMeters);
}
export function totalMeters(selection: Selection): number {
  return Math.round(getLengths(selection).reduce((sum, length) => sum + length, 0) * 100) / 100;
}
export function meters(value: number): string { return value.toLocaleString("ru-RU", { maximumFractionDigits: 2 }); }
export function describeSelection(selection: Selection): string[] {
  return [
    layouts.find(l => l.id === selection.layout)!.title,
    `Стороны: ${getLengths(selection).map(meters).join(" × ")} м; сумма сторон: ${meters(totalMeters(selection))} м`,
    ...(selection.undecided ? ["Материалы и комплектация пока не выбраны"] : [
      materials.find(m => m.id === selection.material)!.title,
      uppers.find(u => u.id === selection.upper)!.title,
      countertops.find(c => c.id === selection.countertop)!.title,
      `Фурнитура: ${hardwareOptions.find(h => h.id === selection.hardware)!.title.toLowerCase()}`,
    ]),
    selection.approximate ? "Размеры примерные" : "Размеры измерены самостоятельно",
  ];
}
export const tariffDefinitions = [
  ...materials.flatMap(m => uppers.map(u => ({ key: `calc_v2_cabinet_${m.id}_${u.id}`, label: `${m.title} · ${u.title}`, group: "Мебель: корпус и фасады", positive: true }))),
  ...countertops.map(c => ({ key: `calc_v2_countertop_${c.id}`, label: c.title, group: "Столешница", positive: false })),
  ...hardwareOptions.map(h => ({ key: `calc_v2_hardware_${h.id}`, label: h.title, group: "Фурнитура", positive: false })),
  ...layouts.map(l => ({ key: `calc_v2_layout_${l.id}`, label: l.title, group: "Поправка на планировку за метр", positive: false })),
];
export function tariffKeys(selection: Selection): string[] {
  return [`calc_v2_cabinet_${selection.material}_${selection.upper}`, `calc_v2_countertop_${selection.countertop}`, `calc_v2_hardware_${selection.hardware}`, `calc_v2_layout_${selection.layout}`];
}
export interface Tariff { key: string; value: number; active: boolean }
export type Estimate = { status: "unpriced"; length: number } | {
  status: "priced"; length: number; price: number; rate: number; version: "meters-v2";
};
export function estimate(selection: Selection, tariffs: Tariff[]): Estimate {
  if (lengthError(selection)) throw new Error("Некорректные размеры");
  const length = totalMeters(selection);
  const selected = tariffKeys(selection).map(key => tariffs.find(t => t.key === key && t.active));
  if (selection.undecided || selected.some(t => !t || !Number.isFinite(t.value) || t.value < 0) || !selected[0] || selected[0].value <= 0) return { status: "unpriced", length };
  const rate = selected.reduce((sum, t) => sum + t!.value, 0);
  return { status: "priced", length, rate, price: Math.round(length * rate / 50) * 50, version: "meters-v2" };
}
