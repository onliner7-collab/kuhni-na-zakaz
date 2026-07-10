/**
 * Chat 1 preparation config for the future mobile page Dock.
 *
 * This file is intentionally not wired into the UI yet. Chat 2 should import
 * or convert it when replacing MobileBottomNav with the contextual Dock.
 */

export const MOBILE_DOCK_BREAKPOINT_PX = 767;

export const MOBILE_DOCK_SCROLL_OFFSETS = {
  header: 92,
  dock: 96,
};

export const MOBILE_DOCK_TYPES = {
  home: {
    match: ["/"],
    items: [
      { label: "Подобрать", icon: "sliders", target: "#selector" },
      { label: "Проекты", icon: "images", target: "#projects" },
      { label: "Цены", icon: "wallet", target: "#prices" },
      { label: "Расчёт", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#calculate", primary: true },
    ],
  },

  prices: {
    match: ["/prices"],
    items: [
      { label: "Стили", icon: "palette", target: "#styles" },
      { label: "Варианты", icon: "layout-grid", target: "#catalog" },
      { label: "Расчёт", icon: "calculator", target: "#calculate" },
      { label: "Заявка", icon: "send", action: "open-calculation-form", fallbackTarget: "#calculate", primary: true },
    ],
  },

  catalogIndex: {
    match: ["/catalog"],
    items: [
      { label: "Типы", icon: "layout-grid", target: "#catalog-types" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Материалы", icon: "layers", href: "/materials" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  designProject: {
    match: ["/design-proekt-kuhni"],
    items: [
      { label: "Форма", icon: "ruler", target: "#idea-builder" },
      { label: "Стиль", icon: "sparkles", target: "#visual-gallery" },
      { label: "Материалы", icon: "layers", target: "#materials-eye" },
      { label: "Проект", icon: "pen-tool", action: "open-design-form", fallbackTarget: "#request", primary: true },
    ],
  },

  portfolio: {
    match: ["/portfolio"],
    items: [
      { label: "Все", icon: "grid-2x2", target: "#all-projects" },
      { label: "Стили", icon: "palette", target: "#styles-filter" },
      { label: "Планировки", icon: "layout-template", target: "#layouts-filter" },
      { label: "Похожую", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#portfolio-request", primary: true },
    ],
  },

  location: {
    match: ["/locations/*"],
    items: [
      { label: "Проекты", icon: "images", target: "#location-projects", requiredIdStatus: "add-in-chat-2" },
      { label: "Цены", icon: "wallet", target: "#location-prices", requiredIdStatus: "add-in-chat-2" },
      {
        label: "Отзывы",
        icon: "message-circle",
        target: "#location-reviews",
        optional: true,
        requiredIdStatus: "add-in-chat-2",
        alternatives: [{ label: "Вопросы", icon: "message-circle", target: "#location-faq" }],
      },
      { label: "Замер", icon: "ruler", action: "open-measurement-form", fallbackTarget: "#form", primary: true },
    ],
  },

  regionalLocation: {
    match: ["/locations/minsk", "/locations/minskaya-oblast"],
    items: [
      { label: "Проекты", icon: "images", target: "#location-projects", requiredIdStatus: "add-in-chat-2" },
      { label: "Цены", icon: "wallet", target: "#location-prices", requiredIdStatus: "add-in-chat-2" },
      {
        label: "Отзывы",
        icon: "message-circle",
        target: "#location-reviews",
        optional: true,
        requiredIdStatus: "add-in-chat-2",
        alternatives: [{ label: "Вопросы", icon: "message-circle", target: "#location-faq" }],
      },
      { label: "Замер", icon: "ruler", action: "open-measurement-form", fallbackTarget: "#form", primary: true },
    ],
  },

  category: {
    match: ["/catalog/*"],
    items: [
      { label: "Примеры", icon: "images", target: "#catalog-gallery-heading" },
      { label: "Планировки", icon: "layout-template", target: "#catalog-layouts", requiredIdStatus: "add-in-chat-2" },
      { label: "Стоимость", icon: "wallet", target: "#catalog-prices", requiredIdStatus: "add-in-chat-2" },
      { label: "Расчёт", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#form", primary: true },
    ],
  },

  materialsIndex: {
    match: ["/materials"],
    items: [
      { label: "Фасады", icon: "layers", href: "/materials/mdf-fasady" },
      { label: "ЛДСП", icon: "square-stack", href: "/materials/ldsp" },
      { label: "Фурнитура", icon: "settings-2", href: "/materials/furnitura" },
      { label: "Расчёт", icon: "calculator", href: "/contacts#form", primary: true },
    ],
  },

  materials: {
    match: ["/materials/*"],
    items: [
      {
        label: "Фото",
        icon: "images",
        target: "#material-detail-gallery",
        targetPrefix: true,
        alternatives: [{ label: "Материалы", icon: "layers", href: "/materials" }],
      },
      {
        label: "Стоимость",
        icon: "wallet",
        target: "#material-price",
        requiredIdStatus: "add-in-chat-2",
        alternatives: [{ label: "Цены", icon: "wallet", href: "/prices" }],
      },
      {
        label: "Примеры",
        icon: "layout-grid",
        target: "#material-projects",
        requiredIdStatus: "add-in-chat-2",
        alternatives: [{ label: "Проекты", icon: "layout-grid", href: "/portfolio" }],
      },
      {
        label: "Подобрать",
        icon: "calculator",
        action: "open-calculation-form",
        fallbackTarget: "#form",
        primary: true,
        alternatives: [{ label: "Расчёт", icon: "calculator", href: "/contacts#form", primary: true }],
      },
    ],
  },

  project: {
    match: ["/portfolio/*"],
    items: [
      { label: "Фото", icon: "images", target: "#project-gallery-heading" },
      {
        label: "Материалы",
        icon: "layers",
        target: "#project-used-heading",
        optional: true,
        alternatives: [{ label: "Описание", icon: "layers", target: "#project-description-heading" }],
      },
      { label: "Цена", icon: "wallet", target: "#project-specs-heading" },
      { label: "Похожую", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#project-request", primary: true },
    ],
  },

  style: {
    match: ["/styles/*"],
    items: [
      { label: "Примеры", icon: "images", target: "#style-projects", requiredIdStatus: "audit-before-chat-2" },
      {
        label: "Цены",
        icon: "wallet",
        target: "#style-prices",
        requiredIdStatus: "audit-before-chat-2",
        alternatives: [{ label: "Цены", icon: "wallet", href: "/prices" }],
      },
      {
        label: "Материалы",
        icon: "layers",
        target: "#style-materials",
        requiredIdStatus: "audit-before-chat-2",
        alternatives: [{ label: "Материалы", icon: "layers", href: "/materials" }],
      },
      { label: "Расчёт", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#form", primary: true },
    ],
  },
};

export const MOBILE_DOCK_DISABLED_PATH_PREFIXES = [
  "/admin",
  "/kapi",
  "/thanks",
  "/privacy-policy",
  "/personal-data",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
];
