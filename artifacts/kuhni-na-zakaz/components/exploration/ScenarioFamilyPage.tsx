import React from "react";
import Link from "@/components/navigation/Link";
import { MediaPicture } from "@/components/pilots/library/MediaPicture";
import type { ScenarioFamilyConfig } from "@/data/exploration-families";
import { getTransitionActionLabel } from "@/lib/transition-action-labels";
import { ExploreContextProvider } from "./ExploreContext";
import { ContextSummary } from "./ContextSummary";
import { ScenarioDecisionControls } from "./FamilyDecisionControls";
import { ScenarioVisualExplorer } from "./ScenarioVisualExplorer";

export function ScenarioFamilyPage({
  config,
}: {
  config: ScenarioFamilyConfig;
}) {
  const route = `/scenarios/${config.slug}`;
  return (
    <main className="bg-amber-50/30 pb-16 text-stone-950">
      <section className="bg-stone-950 text-white">
        <div
          className={`container-site gap-8 py-4 sm:py-12 ${config.visualFrames ? "" : "grid lg:grid-cols-2 lg:items-center"}`}
        >
          <div>
            <nav
              aria-label="Хлебные крошки"
              className={`flex flex-wrap items-center gap-1 text-sm text-stone-300 ${config.visualFrames ? "sr-only sm:not-sr-only sm:flex" : ""}`}
            >
              <Link
                href="/"
                className="inline-flex min-h-11 min-w-11 items-center justify-center"
              >
                Главная
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/scenarios"
                className="inline-flex min-h-11 min-w-11 items-center justify-center"
              >
                Сценарии
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{config.h1}</span>
            </nav>
            <p
              className={`mt-4 text-xs font-black uppercase tracking-[.16em] text-amber-300 sm:mt-6 ${config.visualFrames ? "hidden sm:block" : ""}`}
            >
              Жизненная задача · визуальный сценарий
            </p>
            <h1 className="max-w-4xl text-3xl font-black leading-tight sm:mt-3 sm:text-5xl">
              {config.h1}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-6 text-stone-300 sm:mt-4 sm:text-lg">
              {config.promise}
            </p>
            {!config.visualFrames ? (
              <div className="mt-6 rounded-2xl border border-white/20 p-5">
                <p className="text-sm text-stone-300">Вопрос страницы</p>
                <p className="mt-1 text-xl font-black">{config.question}</p>
              </div>
            ) : null}
          </div>
          {!config.visualFrames ? (
            <figure className="overflow-hidden rounded-3xl bg-stone-800">
              <div className="aspect-[3/2]">
                <MediaPicture
                  eager
                  media={{ ...config.visual, id: `scenario-${config.slug}` }}
                />
              </div>
              <figcaption className="p-4 text-sm text-stone-300">
                {config.visual.caption}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>
      <ExploreContextProvider sourceRoute={route}>
        <div className="container-site grid gap-8 py-6 sm:py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,.6fr)]">
          <div className="min-w-0 space-y-8">
            {config.visualFrames ? (
              <ScenarioVisualExplorer config={config} />
            ) : (
              <ScenarioDecisionControls config={config} />
            )}
            <section className="rounded-3xl border border-red-200 bg-white p-5">
              <h2 className="text-2xl font-black">Что нужно проверить</h2>
              <ul className="mt-4 space-y-3">
                {config.constraints.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-red-300 pl-3 text-sm text-stone-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-black">
                Следующие осмысленные шаги
              </h2>
              <nav
                aria-label="Следующие шаги сценария"
                className="mt-4 grid gap-3 sm:grid-cols-2"
              >
                {config.links.map((link) => {
                  const actionLabel = getTransitionActionLabel(link.type);
                  return (
                    <a
                      key={link.type}
                      data-transition={link.type}
                      href={link.href}
                      className="min-h-12 rounded-2xl border border-stone-200 bg-white p-4 font-bold hover:border-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
                    >
                      {actionLabel ? (
                        <span className="text-xs text-stone-500">
                          {actionLabel}
                        </span>
                      ) : null}
                      <span className="mt-1 block">{link.label}</span>
                      <span className="mt-1 block text-sm font-normal text-stone-600">
                        {link.reason}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </section>
            <section className="rounded-2xl border border-dashed border-stone-400 p-5">
              <h2 className="font-black">Если интерактив недоступен</h2>
              <p className="mt-2 text-sm text-stone-700">
                Без изображения и JavaScript начните с вопроса: «
                {config.question}» Затем проверьте:{" "}
                {config.constraints.join("; ")}. Все ссылки на планировки,
                материалы, статью, портфолио и расчёт доступны в обычном HTML.
              </p>
            </section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <ContextSummary />
            <a
              href="/calculator"
              className="flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
            >
              Передать ограничения в расчёт
            </a>
          </aside>
        </div>
      </ExploreContextProvider>
    </main>
  );
}
