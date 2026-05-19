export type KitchenIdea3DType =
  | "straight"
  | "corner"
  | "small"
  | "wood"
  | "built-in"
  | "family";

export interface KitchenIdea3D {
  id: string;
  title: string;
  shortDescription: string;
  image: string;
  alt: string;
  badge: "3D-визуализация";
  disclosure: string;
  suitableFor: string[];
  ideaType: KitchenIdea3DType;
}

export const kitchenIdeas3D: KitchenIdea3D[] = [
  {
    id: "svetlaya-pryamaya-kuhnya",
    title: "Светлая прямая кухня",
    shortDescription:
      "Лаконичная прямая компоновка для квартиры, студии или вытянутого помещения.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-pryamaya-svetlaya.webp",
    alt: "3D-визуализация светлой прямой кухни, пример дизайна для заказа",
    badge: "3D-визуализация",
    disclosure: "Пример дизайна, не фото выполненной работы.",
    suitableFor: ["узкие помещения", "студии", "понятный бюджет"],
    ideaType: "straight",
  },
  {
    id: "uglovaya-kuhnya-do-potolka",
    title: "Угловая кухня до потолка",
    shortDescription:
      "Высокие шкафы помогают добавить хранение и визуально собрать кухню в единую линию.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-uglovaya-do-potolka.webp",
    alt: "3D-визуализация угловой кухни до потолка, пример дизайна для заказа",
    badge: "3D-визуализация",
    disclosure: "Идея для кухни на заказ, не снимок реализованной кухни.",
    suitableFor: ["квартиры", "новостройки", "много хранения"],
    ideaType: "corner",
  },
  {
    id: "malenkaya-kuhnya-hranenie",
    title: "Маленькая кухня с максимумом хранения",
    shortDescription:
      "Компактная идея для небольшого помещения, где важны каждый ящик и рабочая зона.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-malenkaya-hranenie.webp",
    alt: "3D-визуализация маленькой кухни с максимумом хранения, пример дизайна",
    badge: "3D-визуализация",
    disclosure: "Пример дизайна, не фото выполненной работы.",
    suitableFor: ["маленькие кухни", "хрущевки", "арендные квартиры"],
    ideaType: "small",
  },
  {
    id: "derevo-svetlaya-stoleshnica",
    title: "Кухня с деревянными фасадами и светлой столешницей",
    shortDescription:
      "Теплое сочетание древесной фактуры, светлой рабочей поверхности и спокойной геометрии.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-derevo-svetlaya-stoleshnica.webp",
    alt: "3D-визуализация кухни с деревянными фасадами и светлой столешницей",
    badge: "3D-визуализация",
    disclosure: "Идея для заказа, не снимок реализованного проекта.",
    suitableFor: ["семейные кухни", "дома", "теплый современный интерьер"],
    ideaType: "wood",
  },
  {
    id: "vstroennaya-tehnika-skrytye-ruchki",
    title: "Кухня со встроенной техникой и скрытыми ручками",
    shortDescription:
      "Минималистичная идея с чистыми фасадами, пеналами и местом под встроенную технику.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-vstroennaya-tehnika-skrytye-ruchki.webp",
    alt: "3D-визуализация кухни со встроенной техникой и скрытыми ручками",
    badge: "3D-визуализация",
    disclosure: "Пример дизайна, не фото выполненной работы.",
    suitableFor: ["современный стиль", "встроенная техника", "скрытые ручки"],
    ideaType: "built-in",
  },
  {
    id: "semeynaya-kuhnya-dom",
    title: "Просторная семейная кухня для дома или большой квартиры",
    shortDescription:
      "Больше рабочей поверхности, мест хранения и сценариев для большой семьи.",
    image: "/uploads/kitchen-ideas-3d/idea-3d-semeynaya-dom.webp",
    alt: "3D-визуализация просторной семейной кухни для дома или большой квартиры",
    badge: "3D-визуализация",
    disclosure: "Это 3D-визуализация, а не фото реализованного объекта.",
    suitableFor: ["частный дом", "большая квартира", "семейное хранение"],
    ideaType: "family",
  },
];

export function getKitchenIdea3DById(id: string | null | undefined) {
  if (!id) return null;

  return kitchenIdeas3D.find((idea) => idea.id === id) ?? null;
}
