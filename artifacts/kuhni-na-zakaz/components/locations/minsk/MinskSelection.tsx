"use client";

import { useState, type ReactNode } from "react";
import Link from "@/components/navigation/Link";
import { ContactForm } from "@/components/sections/ContactForm";
import { MINSK_PATH, minskGroups } from "@/data/minsk-page";

export function minskPreview(source: string, width: number) {
  return `/uploads/locations/minsk-selection/${source
    .split("/")
    .slice(-2)
    .join("-")
    .replace(/\.webp$/, "")}-${width}.webp`;
}

export function MinskSelection({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [budget, setBudget] = useState("");
  const [comment, setComment] = useState("");
  const selected = Object.entries(selection).map(([id, index]) => {
    const group = minskGroups.find((item) => item.id === id)!;
    return { group: group.title, value: group.options[index].label };
  });
  const buttonClass =
    "min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  return (
    <>
      {minskGroups.map((group, groupIndex) => {
        const index = selection[group.id] ?? 0;
        const current = group.options[index];
        const choices = (offset: number, end: number) =>
          group.options.slice(offset, end).map((item, localIndex) => {
            const itemIndex = offset + localIndex;
            const active = selection[group.id] === itemIndex;
            return (
              <button
                key={item.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setSelection((previous) => ({
                    ...previous,
                    [group.id]: itemIndex,
                  }))
                }
                className={`${buttonClass} ${active ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-900"}`}
              >
                {item.label}
              </button>
            );
          });
        return (
          <section
            key={group.id}
            id={`minsk-${group.id}`}
            className={`scroll-mt-24 py-8 md:py-12 ${groupIndex % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
            aria-labelledby={`minsk-${group.id}-title`}
          >
            <div className="container-site">
              <p className="text-xs font-semibold text-stone-600">
                0{groupIndex + 1} · Выберите ориентир
              </p>
              <h2
                id={`minsk-${group.id}-title`}
                className="mt-2 max-w-3xl font-serif text-2xl font-bold md:text-3xl"
              >
                {group.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700">
                {group.intro}
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2 md:items-start">
                <figure>
                  <img
                    data-minsk-preview={group.id}
                    src={minskPreview(current.image, 960)}
                    srcSet={`${minskPreview(current.image, 480)} 480w, ${minskPreview(current.image, 960)} 960w`}
                    sizes="(max-width: 767px) calc(100vw - 32px), 50vw"
                    alt={`Идея кухни для заказа в Минске: ${current.label.toLocaleLowerCase("ru")}`}
                    width={960}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/2] w-full rounded-2xl bg-stone-200 object-cover"
                  />
                  <figcaption className="mt-2 text-xs text-stone-600">
                    Иллюстрация решения. Размеры и комплектация — по вашему
                    проекту.
                  </figcaption>
                </figure>
                <div>
                  <div
                    className="grid grid-cols-2 gap-2"
                    role="group"
                    aria-label={group.title}
                  >
                    {choices(0, 4)}
                  </div>
                  {group.options.length > 4 && (
                    <details className="mt-3 rounded-xl border border-stone-300 bg-white p-3">
                      <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">
                        Все варианты ({group.options.length})
                      </summary>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {choices(4, group.options.length)}
                      </div>
                      <nav
                        aria-label={`Разделы: ${group.title}`}
                        className="mt-4 border-t border-stone-200 pt-3"
                      >
                        <p className="text-xs font-semibold text-stone-600">
                          Подробнее о вариантах
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-4">
                          {[
                            ...new Map(
                              group.options.map((item) => [item.href, item]),
                            ).values(),
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
                            >
                              {item.label} →
                            </Link>
                          ))}
                        </div>
                      </nav>
                    </details>
                  )}
                  <div
                    className="mt-4 rounded-xl bg-stone-100 p-4"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <h3 className="font-bold">
                      {current.label}
                      {selection[group.id] !== undefined ? " · Выбрано" : ""}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      {current.text}
                    </p>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-5">
                    <Link
                      href={current.href}
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
                    >
                      {current.label}: подробнее →
                    </Link>
                    <a
                      href="#minsk-form"
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
                    >
                      Рассчитать для Минска
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <section
        id="minsk-budget"
        className="scroll-mt-24 bg-stone-50 py-8 md:py-12"
      >
        <div className="container-site">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            Купить кухню в Минске недорого: выберите приоритет
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700">
            Стоимость кухни на заказ зависит от размеров, фасадов, столешницы,
            механизмов и работ по адресу. Для бюджетной кухни сравниваем состав,
            а не только цену за метр.
          </p>
          <div
            className="mt-5 grid gap-3 sm:grid-cols-3"
            role="group"
            aria-label="Приоритет бюджета"
          >
            {[
              "Экономкласс: простая комплектация",
              "Баланс цены и удобства",
              "Больше хранения и оснащения",
            ].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={budget === item}
                onClick={() => setBudget(item)}
                className={`${buttonClass} ${budget === item ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5">
            {[
              ["/prices", "Цены и состав сметы"],
              ["/calculator", "Онлайн-калькулятор"],
              ["/scenarios/byudzhetnaya-kuhnya", "Бюджетные решения"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
      {children}
      <section
        id="minsk-form"
        className="scroll-mt-24 bg-stone-100 py-8 md:py-12"
      >
        <div className="container-site grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              Заказать расчёт кухни в Минске
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              Оставьте телефон — уточним размеры, комплектацию и условия замера.
              Выбранные пожелания передадим вместе с заявкой.
            </p>
            <div className="mt-4 rounded-xl border border-stone-300 bg-white p-4">
              <h3 className="font-semibold">Ваш выбор</h3>
              <ul data-minsk-selection className="mt-2 space-y-2 text-sm">
                {selected.map((item) => (
                  <li key={item.group}>{item.value}</li>
                ))}
                {budget && <li>{budget}</li>}
                {!selected.length && !budget && (
                  <li>Можно выбрать варианты выше или сразу описать задачу.</li>
                )}
              </ul>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <Link
                href="/contacts"
                className="inline-flex min-h-11 items-center text-primary underline"
              >
                Контакты
              </Link>
              <Link
                href="/warranty"
                className="inline-flex min-h-11 items-center text-primary underline"
              >
                Гарантия
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 md:p-7">
            <label
              htmlFor="minsk-details"
              className="block text-sm font-semibold"
            >
              Размеры, техника и пожелания (необязательно)
            </label>
            <textarea
              id="minsk-details"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1500}
              rows={3}
              placeholder="Например: стены 2,4 и 1,8 м, кухня 8 м², посудомойка 45 см"
              className="mb-5 mt-2 w-full rounded-xl border border-stone-300 p-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            />
            <ContactForm
              source="location-minsk"
              sourcePage={MINSK_PATH}
              sourceType="location"
              city="Минск"
              cityKey="minsk"
              formType="minsk-calculation"
              formLocation="minsk-final-form"
              showCity={false}
              showKitchenType={false}
              compact
              submitLabel="Получить расчёт"
              defaultComment={[
                ...selected.map((item) => `${item.group}: ${item.value}`),
                budget,
                comment,
              ]
                .filter(Boolean)
                .join("\n")}
              defaultAnswers={{
                minskKitchenSelection: { selected, budget, comment },
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
