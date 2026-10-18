import type { MinskVisual } from "@/data/minsk-visuals";

export function MinskDimensions({ visual }: { visual?: MinskVisual }) {
  if (visual?.modules) {
    const total = visual.modules.reduce((sum, item) => sum + item.width, 0);
    return (
      <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3">
        <p className="text-sm font-semibold">
          Компоновка: {total.toLocaleString("ru")} мм
        </p>
        <div
          className="mt-2 flex h-12 overflow-hidden rounded border border-stone-400"
          aria-hidden="true"
        >
          {visual.modules.map((item, index) => (
            <span
              key={index}
              style={{ width: `${(item.width / total) * 100}%` }}
              className={`flex items-center justify-center border-r border-white text-xs font-bold text-stone-900 last:border-0 ${index % 2 ? "bg-stone-300" : "bg-stone-200"}`}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <ol className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-stone-700">
          {visual.modules.map((item, index) => (
            <li key={index}>
              {index + 1}. {item.label} — {item.width} мм
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-stone-600">
          Размеры модулей — ориентир для проекта; нужны зазоры, доборы и
          проверка техники.
        </p>
      </div>
    );
  }
  if (!visual?.room) return null;
  const { width, depth, layout, table } = visual.room;
  const scale = 170 / Math.max(width, depth);
  const w = width * scale;
  const h = depth * scale;
  const cabinet = 600 * scale;
  const x = (240 - w) / 2;
  const y = 25;
  const format = (value: number) => (value / 1000).toLocaleString("ru");
  return (
    <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3">
      <p className="text-sm font-semibold">
        План комнаты: {format(width)} × {format(depth)} м ={" "}
        {(width * depth) / 1_000_000} м²
      </p>
      <svg
        viewBox="0 0 260 225"
        role="img"
        aria-label={`Пример плана комнаты ${format(width)} на ${format(depth)} метра, шкафы глубиной 60 сантиметров`}
        className="mx-auto mt-2 max-h-48 w-full"
      >
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="#fafaf9"
          stroke="#57534e"
          strokeWidth="2"
        />
        {layout !== "straight-left" && (
          <rect
            x={x + 2}
            y={y + 2}
            width={w - 4}
            height={cabinet}
            fill="#a8b3a1"
          />
        )}
        {layout !== "straight-back" && (
          <rect
            x={x + 2}
            y={y + 2}
            width={cabinet}
            height={h * 0.8}
            fill="#a8b3a1"
          />
        )}
        {table && (
          <rect
            x={x + w - table[1] * scale - 5}
            y={y + h * 0.62}
            width={table[1] * scale}
            height={table[0] * scale}
            rx="4"
            fill="#e7cda7"
            stroke="#a88760"
          />
        )}
        <text
          x={x + w / 2}
          y="16"
          textAnchor="middle"
          fontSize="12"
          fill="#44403c"
        >
          {format(width)} м
        </text>
        <text x={x + w + 7} y={y + h / 2} fontSize="12" fill="#44403c">
          {format(depth)} м
        </text>
        <text x="130" y="218" textAnchor="middle" fontSize="11" fill="#57534e">
          Зелёный — мебель · бежевый — стол
        </text>
      </svg>
      <p className="text-xs text-stone-600">
        Вариант для сравнения площади. Двери, окна и проходы уточняем по плану
        квартиры.
      </p>
    </div>
  );
}
