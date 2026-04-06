export const STATUS_OPTIONS = [
  { value: "new", label: "Новая", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "contacted", label: "Связались", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "working", label: "В работе", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "done", label: "Готово", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "lost", label: "Отказ", color: "bg-red-100 text-red-700 border-red-200" },
] as const;

export type LeadStatus = (typeof STATUS_OPTIONS)[number]["value"];
