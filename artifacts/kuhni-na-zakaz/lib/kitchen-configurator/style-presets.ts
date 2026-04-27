export interface StylePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  previewGradient: string;
  facadeSlug?: string;
  countertopSlug?: string;
  skinalSlug?: string;
  handleSlug?: string;
  tags: string[];
}

export const BUILTIN_PRESETS: StylePreset[] = [
  {
    id: "minimalism",
    name: "Минимализм",
    icon: "□",
    description: "Белые матовые фасады, светлая столешница и спокойная фурнитура.",
    previewGradient: "linear-gradient(135deg, #f8f7f2 0%, #ded8ce 100%)",
    facadeSlug: "matte-white",
    countertopSlug: "light-quartz",
    skinalSlug: "white-glass",
    handleSlug: "integrated-profile",
    tags: ["светлая", "матовая"],
  },
  {
    id: "warm-oak",
    name: "Теплый дуб",
    icon: "▥",
    description: "Деревянная фактура, каменная рабочая поверхность и темные акценты.",
    previewGradient: "linear-gradient(135deg, #c89255 0%, #7f5635 100%)",
    facadeSlug: "warm-oak",
    countertopSlug: "light-quartz",
    skinalSlug: "marble-light",
    handleSlug: "slim-rail",
    tags: ["дерево", "теплая"],
  },
  {
    id: "graphite",
    name: "Графит и камень",
    icon: "▦",
    description: "Контрастная кухня с темными фасадами, камнем и лаконичными ручками.",
    previewGradient: "linear-gradient(135deg, #2e2a27 0%, #77706a 100%)",
    facadeSlug: "graphite",
    countertopSlug: "dark-stone",
    skinalSlug: "concrete",
    handleSlug: "slim-rail",
    tags: ["контраст", "премиум"],
  },
  {
    id: "olive",
    name: "Оливковый сатин",
    icon: "▤",
    description: "Мягкий природный оттенок фасадов, светлый фартук и профиль шампань.",
    previewGradient: "linear-gradient(135deg, #89946f 0%, #efe5d3 100%)",
    facadeSlug: "olive-soft",
    countertopSlug: "terrazzo",
    skinalSlug: "white-glass",
    handleSlug: "integrated-profile",
    tags: ["цвет", "уютная"],
  },
];
