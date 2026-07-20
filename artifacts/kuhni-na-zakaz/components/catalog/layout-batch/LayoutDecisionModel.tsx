"use client";

import { useState } from "react";
import { useExploreContext } from "@/components/exploration";

export type DecisionOption = {
  id: string;
  label: string;
  result: string;
  caution: string;
};

export function LayoutDecisionModel({
  route,
  layout,
  role,
  legend,
  options,
}: {
  route: string;
  layout: string;
  role: string;
  legend: string;
  options: DecisionOption[];
}) {
  const [selected, setSelected] = useState(options[0]?.id || "");
  const { updateContext } = useExploreContext();
  const active = options.find((option) => option.id === selected) || options[0];

  function choose(option: DecisionOption) {
    setSelected(option.id);
    updateContext({ layout, scenario: option.label }, `${role}:${option.id}`);
    window.dispatchEvent(new CustomEvent("layout-batch-answers", {
      detail: {
        sourceRoute: route,
        interactionRole: role,
        layout,
        selectedOption: option.label,
        limitation: option.caution,
      },
    }));
  }

  return (
    <fieldset data-interaction-role={role} className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:p-7">
      <legend className="px-2 text-xl font-black text-stone-950">{legend}</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.id === active?.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => choose(option)}
              className={`min-h-12 rounded-2xl border p-4 text-left font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 ${isSelected ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-950 hover:border-stone-500"}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {active ? (
        <div role="status" aria-live="polite" className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-stone-800">
          <p className="font-bold">{active.result}</p>
          <p className="mt-1"><span className="font-bold">Проверить:</span> {active.caution}</p>
        </div>
      ) : null}
    </fieldset>
  );
}
