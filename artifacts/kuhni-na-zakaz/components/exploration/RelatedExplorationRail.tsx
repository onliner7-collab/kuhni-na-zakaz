import { readTransitions } from "@/lib/transition-registry";

export function RelatedExplorationRail({ route, state }: { route: string; state?: string }) {
  const transitions = readTransitions(route, state);
  if (!transitions.length) return <p className="rounded-2xl border border-dashed p-4 text-sm text-stone-600">Связанные продолжения появятся после выбора параметра.</p>;
  return <nav data-component="RelatedExplorationRail" aria-label="Следующие шаги" className="rounded-3xl border border-stone-200 bg-white p-5"><p className="text-sm font-black uppercase tracking-[0.14em] text-stone-500">Следующий вопрос</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{transitions.map((item) => <a key={`${item.actionType}-${item.toRoute}`} href={item.toRoute} data-transition={item.actionType} className="min-h-12 rounded-2xl border border-stone-200 p-4 font-bold hover:border-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950"><span>{item.anchorRu}</span><span className="mt-1 block text-sm font-normal text-stone-600">{item.reasonRu}</span></a>)}</div></nav>;
}
