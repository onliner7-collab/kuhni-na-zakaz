import { describeSelection } from "@/lib/calculator/config";
import { selectionSchema } from "@/lib/calculator/validation";
import { materialById, MATERIAL_PRICE_SCENARIOS } from '@/data/material-solutions';

export function leadDetailsPath(publicNumber: number) {
  if (!Number.isSafeInteger(publicNumber) || publicNumber < 1) throw new Error("Invalid lead number");
  return `/admin/leads/${publicNumber}`;
}

const labels: Record<string, string> = {
  materialSelection: 'Выбранные фасады', comparisonIds: 'Коды вариантов', comparisonNames: 'Варианты для расчёта', preferredId: 'Код предпочтительного варианта', preferredName: 'Предпочитаю', scenarioId: 'Пример комплектации',
  calculator: "Калькулятор", selection: "Выбранные параметры", result: "Предварительный расчёт", status: "Статус расчёта", price: "Цена, BYN", rate: "Тариф, BYN/м", length: "Общая длина, м", lengths: "Длины сторон, м", approximate: "Примерные размеры", undecided: "Материалы ещё не выбраны", estimateIsPreliminary: "Предварительная оценка",
  layout: "Планировка", cornerType: "Тип угловой кухни", material: "Материал", materials: "Материалы", hardware: "Фурнитура", mechanism: "Механизм", upper: "Верхние шкафы", countertop: "Столешница", style: "Стиль", budget: "Бюджет", priority: "Приоритет", details: "Пожелания", dimensions: "Размеры", model: "Модель", modelName: "Название модели", modelId: "Код модели", priceFrom: "Цена от, BYN", startingPrice: "Цена от", room: "Помещение", kitchenType: "Тип кухни", hasMeasurements: "Есть точные замеры", selectedIdea: "Выбранный пример", selectedIdeaName: "Название примера", view: "Ракурс", objectType: "Тип объекта", settlement: "Населённый пункт",
  wallOneLength: "Первая стена", wallTwoLength: "Вторая стена", windowPosition: "Положение окна", doorPosition: "Положение двери", communicationsPosition: "Коммуникации", designProjectSelection: "Выбор для дизайн-проекта", homeKitchenSelection: "Выбор на главной странице", zhodinoKitchenSelection: "Выбор кухни в Жодино", smolevichiKitchenSelection: "Выбор кухни в Смолевичах", exploreContext: "Параметры подбора", source: "Источник", sourcePage: "Страница обращения", sourceRoute: "Раздел сайта", pageUrl: "Страница", sourceType: "Тип обращения", projectSlug: "Проект", cityKey: "Город", utm: "Источник рекламы", medium: "Канал", campaign: "Кампания", term: "Поисковый запрос", content: "Объявление", agreement: "Согласие на обработку данных", evidencePreference: "Тип примеров", name: "Название", title: "Название", imageUrl: "Изображение", imageId: "Код изображения", kitchenId: "Код кухни", color: "Цвет", colors: "Цвета", appliances: "Техника", furniture: "Фурнитура", area: "Размер", height: "Высота", width: "Ширина", depth: "Глубина", version: "Версия расчёта",
};
const values: Record<string, string> = { straight: "Прямая", corner: "Угловая", u_shape: "П-образная", island: "С островом", mdf_film: "МДФ в плёнке", ldsp: "ЛДСП", plastic: "Пластик", enamel: "МДФ в эмали", standard: "Стандарт", ceiling: "До потолка", none: "Нет", laminate: "Ламинированная", acrylic: "Акрил", quartz: "Кварц", basic: "Базовая", soft_close: "С доводчиками", unpriced: "Стоимость уточнит менеджер", priced: "Предварительная цена", accepted: "Получено", economy: "Эконом", comfort: "Комфорт", premium: "Премиум", ideas: "Идеи", phone: "Телефон", email: "Электронная почта", telegram: "Телеграм", apartment: "Квартира", house: "Дом", minimalism: "Минимализм", modern: "Современный", scandinavian: "Скандинавский", loft: "Лофт", small: "Маленькая", family: "Для семьи", left: "Слева", right: "Справа", center: "По центру" };
export function answerRows(input: unknown): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  function visit(value: unknown, path: string[], depth: number) {
    if (depth > 10 || rows.length >= 250 || value === null || value === undefined || value === "") return;
    if (Array.isArray(value)) { value.forEach((item, i) => visit(item, [...path, `Вариант ${i + 1}`], depth + 1)); return; }
    if (typeof value === "object") {
      for (const [key, item] of Object.entries(value)) {
        if (key === "calculator" && item && typeof item === "object") {
          const calc = item as Record<string, unknown>;
          const selection = selectionSchema.safeParse(calc.selection);
          if (selection.success) {
            rows.push(...describeSelection(selection.data).map(text => ({ label: "Калькулятор", value: text })));
            visit(calc.result, [...path, "Расчёт при отправке"], depth + 1);
            continue;
          }
        }
        visit(item, [...path, labels[key] || "Дополнительные сведения"], depth + 1);
      }
      return;
    }
    rows.push({ label: path.join(" → ") || "Ответ", value: typeof value === "boolean" ? value ? "Да" : "Нет" : materialById(String(value))?.title || MATERIAL_PRICE_SCENARIOS.find(s=>s.id===value)?.title || values[String(value)] || String(value) });
  }
  visit(input, [], 0); return rows;
}

export function safeLeadUrl(value: string) {
  try { const url = new URL(value, "https://kuhni.minsk.by"); return value && url.protocol === "https:" && url.hostname === "kuhni.minsk.by" ? url.href : ""; } catch { return ""; }
}
