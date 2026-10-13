import { budgetImage, budgetParts, budgetResponsiveImage } from '@/data/budget-kitchens';
import { budgetPartVisuals } from '@/data/budget-kitchen-visuals';

export function BudgetKitchenParts() {
  return <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {budgetParts.map((part, index) => {
      const visual = budgetPartVisuals[index];
      return <article key={part.title} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <figure>
          <img src={budgetImage(visual.image)} {...budgetResponsiveImage(visual.image, '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw')} alt={visual.alt} width={1200} height={800} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" />
          <figcaption className="border-b border-stone-100 p-4 text-sm leading-6 text-stone-600">{visual.caption}</figcaption>
        </figure>
        <div className="p-5"><p className="text-xs font-bold text-stone-400">0{index + 1}</p><h3 className="mt-1 text-lg font-bold">{part.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{part.text}</p></div>
      </article>;
    })}
  </div>;
}
