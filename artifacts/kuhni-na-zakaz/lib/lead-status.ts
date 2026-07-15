export const STATUS_OPTIONS = [
  { value: "new", label: "Новая", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "in_progress", label: "В работе", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "waiting_for_client", label: "Ожидаем клиента", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "measurement_scheduled", label: "Замер назначен", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { value: "calculation_prepared", label: "Расчёт подготовлен", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { value: "completed", label: "Завершена", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "closed", label: "Закрыта", color: "bg-stone-100 text-stone-700 border-stone-200" },
  { value: "spam", label: "Спам", color: "bg-red-100 text-red-700 border-red-200" },
] as const;

export type LeadStatus = (typeof STATUS_OPTIONS)[number]["value"];
