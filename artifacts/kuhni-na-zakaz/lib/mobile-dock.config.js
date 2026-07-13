/**
 * Единая конфигурация контекстного мобильного Dock для публичных страниц.
 * Каждый маршрут получает ровно четыре действия без копирования разметки.
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
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", target: "#prices" },
      { label: "Портфолио", icon: "images", target: "#projects", alternatives: [{ label: "Портфолио", icon: "images", href: "/portfolio" }] },
      { label: "Заявка", icon: "send", action: "open-calculation-form", fallbackTarget: "#calculate", primary: true },
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

  angularKitchen: {
    match: ["/catalog/uglovye-kuhni"],
    items: [
      { label: "Планировка", icon: "ruler", target: "#planning" },
      { label: "Внутри", icon: "layers", target: "#inside" },
      { label: "Цена", icon: "wallet", target: "#catalog-prices" },
      { label: "Рассчитать", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#calculate", primary: true },
    ],
  },

  borisovPilot: {
    match: ["/locations/borisov"],
    items: [
      { label: "Виды", icon: "layout-grid", target: "#types" },
      { label: "Процесс", icon: "layers", target: "#process" },
      { label: "Стоимость", icon: "wallet", target: "#location-prices" },
      { label: "Замер", icon: "ruler", action: "open-measurement-form", fallbackTarget: "#measure", primary: true },
    ],
  },

  hardwarePilot: {
    match: ["/materials/furnitura"],
    items: [
      { label: "Механизмы", icon: "sliders", target: "#mechanisms" },
      { label: "Сравнить", icon: "layers", target: "#compare" },
      { label: "Комплектация", icon: "layout-grid", target: "#package" },
      { label: "Подобрать", icon: "calculator", action: "open-calculation-form", fallbackTarget: "#pick", primary: true },
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

  locationsIndex: {
    match: ["/locations"],
    items: [
      { label: "Города", icon: "layout-grid", href: "/locations/minskaya-oblast" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Каталог", icon: "grid-2x2", href: "/catalog" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  portfolio: {
    match: ["/portfolio"],
    items: [
      { label: "Фильтр", icon: "sliders", target: "#all-projects" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", action: "open-calculation-form", fallbackTarget: "#portfolio-request", primary: true },
    ],
  },

  location: {
    match: ["/locations/*"],
    items: [
      { label: "Замер", icon: "ruler", action: "open-measurement-form", fallbackTarget: "#form" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  regionalLocation: {
    match: ["/locations/minsk", "/locations/minskaya-oblast"],
    items: [
      { label: "Замер", icon: "ruler", action: "open-measurement-form", fallbackTarget: "#form" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  category: {
    match: ["/catalog/*"],
    items: [
      { label: "Фото", icon: "images", target: "#catalog-gallery-heading", alternatives: [{ label: "Фото", icon: "images", href: "/portfolio" }] },
      { label: "Цена", icon: "wallet", target: "#catalog-prices", alternatives: [{ label: "Цена", icon: "wallet", href: "/prices" }] },
      { label: "Материалы", icon: "layers", href: "/materials" },
      { label: "Заявка", icon: "send", action: "open-calculation-form", fallbackTarget: "#form", primary: true },
    ],
  },

  materialsIndex: {
    match: ["/materials"],
    items: [
      { label: "Фактуры", icon: "layers", href: "/materials/mdf-fasady" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  materials: {
    match: ["/materials/*"],
    items: [
      {
        label: "Фактуры",
        icon: "images",
        target: "#material-detail-gallery",
        targetPrefix: true,
        alternatives: [{ label: "Фактуры", icon: "layers", href: "/materials" }],
      },
      {
        label: "Цены",
        icon: "wallet",
        target: "#material-price",
        requiredIdStatus: "add-in-chat-2",
        alternatives: [{ label: "Цены", icon: "wallet", href: "/prices" }],
      },
      {
        label: "Каталог",
        icon: "layout-grid",
        href: "/catalog",
      },
      {
        label: "Заявка",
        icon: "send",
        action: "open-calculation-form",
        fallbackTarget: "#form",
        primary: true,
        alternatives: [{ label: "Заявка", icon: "send", href: "/contacts#form", primary: true }],
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

  stylesIndex: {
    match: ["/styles"],
    items: [
      { label: "Стили", icon: "palette", href: "/styles/sovremennye" },
      { label: "Материалы", icon: "layers", href: "/materials" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  calculator: {
    match: ["/calculator"],
    items: [
      { label: "Расчёт", icon: "calculator", href: "/calculator" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  scenariosIndex: {
    match: ["/scenarios"],
    items: [
      { label: "Сценарии", icon: "layout-template", href: "/scenarios" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  scenario: {
    match: ["/scenarios/*"],
    items: [
      { label: "Решение", icon: "layout-template", href: "/scenarios" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  blogIndex: {
    match: ["/blog"],
    items: [
      { label: "Статьи", icon: "grid-2x2", href: "/blog" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  blog: {
    match: ["/blog/*"],
    items: [
      { label: "Статьи", icon: "grid-2x2", href: "/blog" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  trust: {
    match: ["/about", "/reviews", "/warranty", "/delivery-installation", "/contacts"],
    items: [
      { label: "О компании", icon: "message-circle", href: "/about" },
      { label: "Отзывы", icon: "sparkles", href: "/reviews" },
      { label: "Портфолио", icon: "images", href: "/portfolio" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },

  legal: {
    match: ["/privacy-policy", "/personal-data", "/terms"],
    items: [
      { label: "Контакты", icon: "message-circle", href: "/contacts" },
      { label: "Каталог", icon: "layout-grid", href: "/catalog" },
      { label: "Цены", icon: "wallet", href: "/prices" },
      { label: "Заявка", icon: "send", href: "/contacts#form", primary: true },
    ],
  },
};

export const MOBILE_DOCK_DISABLED_PATH_PREFIXES = [
  "/admin",
  "/kapi",
  "/thanks",
  "/robots.txt",
  "/sitemap.xml",
];
