"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import Link from "@/components/navigation/Link";
import { ContextSummary } from "@/components/exploration/ContextSummary";
import { useExploreContext } from "@/components/exploration/ExploreContext";

type LocationMode = "minsk" | "minskaya-oblast";

const minskOptions = [
  { id: "flat", title: "Квартира", text: "Проверить стены, технику, проходы и хранение.", image: "/uploads/locations/minsk-stage34/minsk-project-02-corner-ceiling-obshchiy-vid.webp", alt: "Визуализация угловой кухни для квартиры в Минске", href: "/catalog/uglovye-kuhni" },
  { id: "newbuild", title: "Новостройка", text: "Согласовать коммуникации и проект до чистовой отделки.", image: "/uploads/locations/minsk-stage34/minsk-project-01-light-straight-obshchiy-vid.webp", alt: "Визуализация светлой кухни для новостройки в Минске", href: "/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera" },
  { id: "house", title: "Дом", text: "Проверить большие рабочие зоны, остров и логистику монтажа.", image: "/uploads/locations/minsk-stage34/minsk-project-06-private-house-obshchiy-vid.webp", alt: "Визуализация кухни для частного дома рядом с Минском", href: "/scenarios/s-ostrovom" },
  { id: "small", title: "Маленькая кухня", text: "Расставить приоритеты между техникой, проходами и хранением.", image: "/images/design-proekt-kuhni/3d-proekt-malenkaya-kuhnya.webp", alt: "Визуализация компактной кухни для квартиры в Минске", href: "/scenarios/dlya-malenkoy-kuhni" },
];

const oblastOptions = [
  { id: "borisov", title: "Борисов", text: "Отдельная городская страница с процессом заказа.", image: "/uploads/locations/minskaya-oblast/minskaya-oblast-zamer-kuhni.webp", alt: "Замер помещения перед заказом кухни в Минской области", href: "/locations/borisov" },
  { id: "zhodino", title: "Жодино", text: "Уточнить адрес, готовность помещения и условия выезда.", image: "/uploads/locations/minskaya-oblast/minskaya-oblast-soglasovanie-proekta.webp", alt: "Согласование проекта кухни для города Минской области", href: "/locations/zhodino" },
  { id: "molodechno", title: "Молодечно", text: "Перейти к локальной странице и подготовить исходные данные.", image: "/uploads/locations/minskaya-oblast/minskaya-oblast-materialy-fasadov.webp", alt: "Выбор материалов для кухни в Минской области", href: "/locations/molodechno" },
  { id: "slutsk", title: "Слуцк", text: "Проверить порядок замера, доставки и монтажа по адресу.", image: "/uploads/locations/minskaya-oblast/minskaya-oblast-montazh-kuhni.webp", alt: "Монтаж кухни в маршруте по Минской области", href: "/locations/slutsk" },
];

export function Stage6LocationDecision({ mode }: { mode: LocationMode }) {
  const options = mode === "minsk" ? minskOptions : oblastOptions;
  const [activeId, setActiveId] = useState(options[0].id);
  const { updateContext } = useExploreContext();
  const active = options.find((item) => item.id === activeId) || options[0];

  const choose = (id: string) => {
    const next = options.find((item) => item.id === id) || options[0];
    setActiveId(id);
    updateContext(
      mode === "minsk"
        ? { location: "Минск", scenario: next.title }
        : { location: next.title, scenario: "Выезд, замер и монтаж по адресу" },
      mode === "minsk" ? "Выбрана задача помещения в Минске" : "Выбран город Минской области",
    );
  };

  return (
    <section className="bg-[#f6f1ea] py-10 text-[#201912] md:py-14" aria-labelledby={`${mode}-decision-title`} data-stage6-location-decision>
      <div className="container-site">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9b6b3e]">Первый вопрос</p>
        <h2 id={`${mode}-decision-title`} className="mt-2 max-w-3xl font-serif text-3xl font-bold">
          {mode === "minsk" ? "Для какого помещения нужна кухня в Минске?" : "В каком городе или районе находится объект?"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#75695f]">
          {mode === "minsk"
            ? "Выбор ведёт к подходящему маршруту проекта без обещания точного результата до замера."
            : "Условия выезда, доставки и монтажа подтверждаются после адреса и проверки готовности помещения."}
        </p>
        <div className="mt-7 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1" role="group" aria-label={mode === "minsk" ? "Тип помещения" : "Город Минской области"}>
            {options.map((item) => (
              <button key={item.id} type="button" data-stage6-location-id={item.id} onClick={() => choose(item.id)} aria-pressed={activeId === item.id} className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border p-4 text-left ${activeId === item.id ? "border-[#9b6b3e] bg-white" : "border-[#e2d7ca] bg-white/60"}`}>
                <span><span className="block font-black">{item.title}</span><span className="mt-1 block text-sm text-[#75695f]">{item.text}</span></span>
                {activeId === item.id ? <Check className="h-5 w-5 shrink-0 text-[#9b6b3e]" aria-hidden /> : null}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e2d7ca] bg-white">
            <div className="relative aspect-[16/10]" data-stage6-location-result>
              <Image src={active.image} alt={active.alt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black">{active.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#75695f]">{active.text}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={active.href} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#201912] px-4 py-2 text-sm font-bold text-white">
                  Открыть подходящий маршрут <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/design-proekt-kuhni" className="inline-flex min-h-11 items-center rounded-xl border border-[#cdbda9] px-4 py-2 text-sm font-bold">Перейти к проекту</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6"><ContextSummary /></div>
      </div>
    </section>
  );
}
