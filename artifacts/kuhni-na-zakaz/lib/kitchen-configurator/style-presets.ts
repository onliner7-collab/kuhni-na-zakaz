// ──────────────────────────────────────────────────────
// Стилевые пресеты конфигуратора кухни
// Этап 6 — могут быть расширены через admin-managed данные
// ──────────────────────────────────────────────────────

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  previewGradient: string;   // CSS gradient для превью
  facadeSlug?: string;
  countertopSlug?: string;
  skinalSlug?: string;
  handleSlug?: string;
  tags: string[];            // для фильтрации
}

/** Встроенные пресеты. При наличии admin-managed аналогов — приоритет за БД */
export const BUILTIN_PRESETS: StylePreset[] = [
  {
    id: "minimalism",
    name: "Минимализм",
    emoji: "⬜",
    description: "Матовые белые фасады, тонкие линии, безручечная система, светлый кварц",
    previewGradient: "linear-gradient(135deg, #f5f3f0 0%, #e8e4de 100%)",
    tags: ["minimal", "white", "modern"],
  },
  {
    id: "warm-oak",
    name: "Тёплый дуб",
    emoji: "🟫",
    description: "Шпонированные фасады дуба, столешница под камень, медные ручки",
    previewGradient: "linear-gradient(135deg, #c19a6b 0%, #8b6039 100%)",
    tags: ["wood", "warm", "natural"],
  },
  {
    id: "light-stone",
    name: "Светлый камень",
    emoji: "🪨",
    description: "Бежевые фасады, столешница из натурального камня, скиналь под мрамор",
    previewGradient: "linear-gradient(135deg, #e8e0d5 0%, #c8bfb4 100%)",
    tags: ["stone", "beige", "premium"],
  },
  {
    id: "graphite-wood",
    name: "Графит + Дерево",
    emoji: "⬛",
    description: "Графитовые матовые фасады в сочетании с деревянными акцентами",
    previewGradient: "linear-gradient(135deg, #3d3530 0%, #6b5543 100%)",
    tags: ["graphite", "dark", "contrast"],
  },
  {
    id: "matte-facades",
    name: "Матовые фасады",
    emoji: "🫧",
    description: "Матовые фасады пастельных тонов, скрытые петли, встроенные ручки",
    previewGradient: "linear-gradient(135deg, #c4b7d7 0%, #9ca3af 100%)",
    tags: ["matte", "pastel", "modern"],
  },
  {
    id: "glass-light",
    name: "Витрины + Подсветка",
    emoji: "✨",
    description: "Верхние шкафы с витринами, светодиодная подсветка, открытые полки",
    previewGradient: "linear-gradient(135deg, #fde68a 0%, #f3e8c8 100%)",
    tags: ["glass", "light", "open"],
  },
  {
    id: "premium-handle-free",
    name: "Премиум безручечный",
    emoji: "🖤",
    description: "Push-to-open механизм, лакированные фасады, чёрная фурнитура",
    previewGradient: "linear-gradient(135deg, #1c1917 0%, #3d3530 100%)",
    tags: ["premium", "handle-free", "gloss"],
  },
  {
    id: "kitchen-living",
    name: "Кухня-гостиная",
    emoji: "🏡",
    description: "Открытая планировка, остров, сдержанная палитра, максимум функционала",
    previewGradient: "linear-gradient(135deg, #d4e8d0 0%, #a7c5a0 100%)",
    tags: ["open-plan", "island", "family"],
  },
];
