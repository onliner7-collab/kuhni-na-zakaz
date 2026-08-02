import React from "react";
import Link from "@/components/navigation/Link";
import type { StyleFamilyConfig } from "@/data/exploration-families";
import { getTransitionActionLabel } from "@/lib/transition-action-labels";
import { ExploreContextProvider } from "./ExploreContext";
import { ContextSummary } from "./ContextSummary";
import { MediaSequence } from "./MediaSequence";
import { StyleVariantControls } from "./FamilyDecisionControls";
import { StyleVisualExplorer } from "./StyleVisualExplorer";

export function StyleFamilyPage({ config }: { config: StyleFamilyConfig }) {
  const route = `/styles/${config.slug}`;
  return (
    <main className="bg-stone-50 pb-16 text-stone-950">
      <section className="border-b border-stone-200 bg-white">
        <div className="container-site py-8 sm:py-12">
          <nav
            aria-label="Хлебные крошки"
            className="flex flex-wrap items-center gap-1 text-sm text-stone-600"
          >
            <Link
              href="/"
              className="inline-flex min-h-11 min-w-11 items-center justify-center"
            >
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/styles"
              className="inline-flex min-h-11 min-w-11 items-center justify-center"
            >
              Стили
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{config.h1}</span>
          </nav>
          <p className="mt-8 text-xs font-black uppercase tracking-[.16em] text-stone-500">
            Визуальное направление · концепция, созданная нейросетью
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            {config.h1}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-stone-700">
            {config.promise}
          </p>
          {!config.visualFrames ? (
            <div className="mt-6 rounded-2xl bg-stone-950 p-5 text-white">
              <p className="text-sm font-bold text-stone-300">Главный вопрос</p>
              <p className="mt-1 text-xl font-black">{config.question}</p>
            </div>
          ) : null}
        </div>
      </section>
      <ExploreContextProvider sourceRoute={route}>
        <div className="container-site grid gap-8 py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,.6fr)]">
          <div className="space-y-8">
            {config.visualFrames ? (
              <StyleVisualExplorer config={config} />
            ) : (
              <section
                aria-labelledby="style-series"
                data-series-id={config.seriesId}
              >
                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[.14em] text-stone-500">
                    Последовательность вариантов стиля
                  </p>
                  <h2 id="style-series" className="mt-2 text-2xl font-black">
                    Один образ — три проверки
                  </h2>
                </div>
                <MediaSequence
                  label={`Последовательность ракурсов: ${config.h1}`}
                  items={config.media.map((item, index) => ({
                    ...item,
                    id: `${config.seriesId}-${index}`,
                  }))}
                />
                <p className="mt-3 rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm">
                  <strong>Происхождение:</strong> визуальная концепция,
                  созданная нейросетью. Она помогает сравнить направление, но не
                  является фотографией выполненного объекта.
                </p>
              </section>
            )}
            {!config.visualFrames ? (
              <StyleVariantControls config={config} />
            ) : null}
            <section
              className="grid gap-4 sm:grid-cols-3"
              aria-label="Визуальный язык, материалы и ограничения"
            >
              {[
                ["Визуальный язык", config.visualLanguage],
                ["Материалы для проверки", config.materials],
                ["Ограничения", config.constraints],
              ].map(([title, items]) => (
                <article
                  key={title as string}
                  className="rounded-3xl border border-stone-200 bg-white p-5"
                >
                  <h2 className="text-lg font-black">{title as string}</h2>
                  <ul className="mt-3 space-y-3 text-sm text-stone-700">
                    {(items as string[]).map((item) => (
                      <li
                        key={item}
                        className="border-l-2 border-stone-300 pl-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
            <section className="rounded-3xl bg-stone-900 p-6 text-white">
              <h2 className="text-2xl font-black">{config.comparison.title}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {config.comparison.items.map((item) => (
                  <p key={item} className="rounded-2xl bg-white/10 p-4 text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-black">
                Следующие осмысленные шаги
              </h2>
              <nav
                aria-label="Продолжить выбор"
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
                Если изображения или интерактив недоступны:{" "}
                {config.visualLanguage.join("; ")}. Проверить перед решением:{" "}
                {config.constraints.join("; ")}.
              </p>
            </section>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <ContextSummary />
            <a
              href="/calculator"
              className="flex min-h-12 items-center justify-center rounded-2xl bg-stone-950 px-5 py-3 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
            >
              Перейти к расчёту
            </a>
          </aside>
        </div>
      </ExploreContextProvider>
    </main>
  );
}
