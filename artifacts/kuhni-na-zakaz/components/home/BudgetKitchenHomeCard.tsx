import Image from "next/image";
import Link from "@/components/navigation/Link";
import { BUDGET_KITCHEN_PATH, budgetImage } from "@/data/budget-kitchens";

export function BudgetKitchenHomeCard() {
  return (
    <section id="home-budget-kitchens" aria-labelledby="home-budget-title" className="bg-[#fffaf4] py-10 text-[#201912] md:py-14" data-no-kitchen-lead>
      <div className="container-site">
        <div className="grid overflow-hidden rounded-3xl border border-[#9b6b3e]/20 bg-white md:grid-cols-2">
          <div className="relative aspect-[3/2]">
            <Image src={budgetImage("overview")} alt="Пример недорогой прямой кухни со светлыми гладкими фасадами" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="p-5 sm:p-8">
            <p className="text-sm font-bold text-[#6e4727]">Кухня под ваш бюджет</p>
            <h2 id="home-budget-title" className="mt-2 text-2xl font-black leading-tight md:text-3xl">Недорогие кухни на заказ</h2>
            <p className="mt-4 leading-7 text-[#62564b]">Из чего состоит кухня экономкласса и на чём можно сэкономить: восемь способов с фото, сравнение прямой и угловой комплектаций, решения для деревни, дачи и деревянного дома в Беларуси.</p>
            <Link href={BUDGET_KITCHEN_PATH} className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#6e4727] px-5 py-3 text-sm font-bold text-white hover:bg-[#54351d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e4727]">Как сделать кухню дешевле →</Link>
            <p className="mt-4 text-xs leading-5 text-[#62564b]">На фото — визуализация идеи. Стоимость рассчитываем по размерам и выбранному составу заказа.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
