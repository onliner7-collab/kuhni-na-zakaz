"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";
import { countertops, describeSelection, examples, getLengths, hardwareOptions, initialSelection, layouts, lengthError, materials, meters, packages, parseMeters, totalMeters, uppers, type Estimate, type Selection } from "@/lib/calculator/config";
import { KitchenPlan } from "./KitchenPlan";
import { CalculatorLeadForm } from "./CalculatorLeadForm";

export function MobileCalculator({ hasPrices = false }: { hasPrices?: boolean }) {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<Selection>({ ...initialSelection });
  const [result, setResult] = useState<Estimate | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const navigation = useRef(false);
  const layout = layouts.find(item => item.id === selection.layout)!;
  const valid = !lengthError(selection);
  const summary = valid ? describeSelection(selection) : [];
  const activePackage = !selection.undecided && selection.material === "mdf_film" && selection.countertop === "laminate"
    ? packages.find(item => item.upper === selection.upper && item.hardware === selection.hardware)?.id : undefined;

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!navigation.current) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "auto" });
    navigation.current = false;
  }, [step]);

  function start() {
    if (started.current) return;
    started.current = true;
    trackAnalyticsEvent(ANALYTICS_EVENTS.CALCULATOR_START, { source: "calculator_meters" });
  }
  function update(patch: Partial<Selection>) {
    start(); setSelection(current => ({ ...current, ...patch })); setError("");
  }
  function go(next: number) { navigation.current = true; setError(""); setStep(next); }
  function next() {
    start();
    const message = lengthError(selection);
    if (message) {
      setError(message);
      const index = getLengths(selection).findIndex(n => !Number.isFinite(n) || n < 0.6 || n > 10);
      document.getElementById(`calc-length-${index}`)?.focus();
      return;
    }
    go(1);
  }
  function choosePackage(id: string) {
    const preset = packages.find(item => item.id === id)!;
    update({ material: "mdf_film", countertop: "laminate", upper: preset.upper, hardware: preset.hardware, undecided: false });
  }
  async function prepare() {
    if (loading) return;
    start(); setError(""); setLoading(true);
    const abort = new AbortController(); controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 15000);
    try {
      const response = await fetch("/kapi/calculator/estimate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(selection), signal: abort.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось проверить расчёт. Попробуйте ещё раз.");
      if (data.status !== "priced" && data.status !== "unpriced") throw new Error("Не удалось проверить расчёт. Попробуйте ещё раз.");
      if (data.status === "priced" && (!Number.isFinite(data.price) || data.price <= 0)) throw new Error("Стоимость требует уточнения. Попробуйте ещё раз.");
      setPreviousPrice(result?.status === "priced" ? result.price : null); setResult(data);
      trackAnalyticsEvent(ANALYTICS_EVENTS.COST_CALCULATION, { source: "calculator_meters", pricing_available: data.status === "priced", length: totalMeters(selection), layout: selection.layout });
      go(2);
    } catch (caught) {
      setError(caught instanceof Error && caught.name !== "AbortError" ? caught.message : "Связь прервалась. Параметры сохранены — попробуйте ещё раз.");
    } finally { window.clearTimeout(timeout); setLoading(false); }
  }
  function useExample(id: string) {
    const example = examples.find(item => item.id === id)!;
    const preset = packages.find(item => item.id === example.packageId)!;
    update({ ...initialSelection, layout: example.layout, lengths: [...example.lengths], upper: preset.upper, hardware: preset.hardware });
    setResult(null); setPreviousPrice(null);
    if (step === 0) { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "start" }); }
    else go(0);
  }
  function changeLength(index: number, value: string) {
    const lengths = [...selection.lengths]; lengths[index] = value; update({ lengths });
  }

  return <>
    <section id="kitchen-calculator" className="calc-tool" aria-label="Подготовка расчёта кухни" data-calculator-version="meters-v2">
      <ol className="calc-progress" aria-label="Этапы расчёта">{["Размеры", "Комплектация", "Итог"].map((title, index) => <li key={title} aria-current={step === index ? "step" : undefined} className={index <= step ? "is-active" : ""}><span>{index < step ? <Check size={14} /> : index + 1}</span>{title}</li>)}</ol>
      <div className="calc-body">
        <p className="calc-eyebrow">Шаг {step + 1} из 3</p>
        <h2 ref={heading} tabIndex={-1} className="calc-step-title">{["Какая у вас кухня?", "Что вам подходит?", result?.status === "priced" ? "Ваш предварительный расчёт" : "Параметры кухни готовы"][step]}</h2>
        {step === 0 && <>
          <p className="calc-muted">Выберите форму и укажите длину каждой стороны в метрах.</p>
          <fieldset className="calc-fieldset"><legend className="sr-only">Форма кухни</legend><div className="calc-layouts">{layouts.map(item => <label key={item.id} className={`calc-layout ${selection.layout === item.id ? "is-selected" : ""}`}>
            <input type="radio" name="calc-layout" value={item.id} checked={selection.layout === item.id} onChange={() => update({ layout: item.id })} />
            <KitchenPlan layout={item.id} /><strong>{item.title}</strong><small>{item.description}</small>
          </label>)}</div></fieldset>
          <div className="calc-measure-grid">
            <div className="calc-measure-visual"><KitchenPlan layout={selection.layout} detailed /><p>Вид сверху. Буквы на схеме соответствуют полям.</p></div>
            <div><p id="calc-measure-help" className="calc-help">Измерьте участки вдоль стен, где будет кухня. Верхние шкафы второй раз не прибавляйте. Отдельно стоящий холодильник вне гарнитура не учитывайте.</p>
              {Array.from({ length: layout.sides }, (_, index) => {
                const value = parseMeters(selection.lengths[index]);
                const invalid = Boolean(error) && (!Number.isFinite(value) || value < 0.6 || value > 10);
                const letter = ["А", "Б", "В"][index];
                return <div className="calc-length" key={index}><label htmlFor={`calc-length-${index}`}>Сторона {letter}</label><div className="calc-number">
                  <button type="button" aria-label={`Уменьшить сторону ${letter} на 0,1 м`} disabled={!Number.isFinite(value) || value <= 0.6} onClick={() => changeLength(index, meters(Math.max(0.6, Math.round((value - 0.1) * 10) / 10)))}>−</button>
                  <input id={`calc-length-${index}`} type="text" inputMode="decimal" autoComplete="off" maxLength={6} placeholder="Например, 2,4" value={selection.lengths[index]} aria-invalid={invalid} aria-describedby={`calc-measure-help${invalid ? " calc-error" : ""}`} onChange={event => changeLength(index, event.target.value)} /><span>м</span>
                  <button type="button" aria-label={`Увеличить сторону ${letter} на 0,1 м`} disabled={Number.isFinite(value) && value >= 10} onClick={() => changeLength(index, meters(Math.min(10, Math.round(((Number.isFinite(value) ? value : 0.5) + 0.1) * 10) / 10)))}>+</button>
                </div></div>;
              })}
              {valid && <p className="calc-total" aria-live="polite">Общая длина: <strong>{meters(totalMeters(selection))} м</strong></p>}
              <label className="calc-check"><input type="checkbox" checked={selection.approximate} onChange={event => update({ approximate: event.target.checked })} /><span>Размеры пока примерные</span></label>
              <details className="calc-details"><summary>Пока не знаю размеры</summary><p>Измерьте рулеткой доступные участки вдоль стен. Если это пока невозможно, <a href="/contacts#form">оставьте заявку на консультацию</a> — размеры и условия замера уточним вместе.</p></details>
            </div>
          </div>
        </>}
        {step === 1 && <>
          <p className="calc-muted">Начните с готового варианта. Материалы можно изменить ниже.</p>
          <figure className="calc-package-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={examples[selection.upper === "ceiling" ? 2 : selection.layout === "corner" ? 1 : 0].image} alt="Визуализация кухни для выбора комплектации" width={600} height={400} decoding="async" />
            <figcaption>Пример дизайна. Цвета, размеры и наполнение согласуем при расчёте.</figcaption>
          </figure>
          <fieldset className="calc-fieldset" disabled={loading}><legend className="sr-only">Комплектация кухни</legend><div className="calc-packages">{packages.map((item, index) => <label key={item.id} className={`calc-package ${activePackage === item.id ? "is-selected" : ""}`}>
            <input type="radio" name="calc-package" checked={activePackage === item.id} onChange={() => choosePackage(item.id)} />
            <span><strong>{item.title}</strong>{index === 0 && <small className="calc-tag">Можно начать с этого</small>}<span>{item.description}</span></span>
          </label>)}<label className={`calc-package ${selection.undecided ? "is-selected" : ""}`}><input type="radio" name="calc-package" checked={selection.undecided} onChange={() => update({ undecided: true })} /><span><strong>Пока не знаю</strong><span>Сохраним размеры. Материалы подберём при обсуждении заявки.</span></span></label></div></fieldset>
          <details className="calc-details calc-custom"><summary>Настроить материалы отдельно</summary><fieldset className="calc-custom-grid" disabled={loading}><legend className="sr-only">Материалы и наполнение</legend>
            <label>Фасады <small>Дверцы и передние панели ящиков</small><select value={selection.material} onChange={event => update({ material: event.target.value as Selection["material"], undecided: false })}>{materials.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
            <label>Верхние шкафы <small>Хранение над рабочей поверхностью</small><select value={selection.upper} onChange={event => update({ upper: event.target.value as Selection["upper"], undecided: false })}>{uppers.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
            <label>Столешница <small>Рабочая поверхность кухни</small><select value={selection.countertop} onChange={event => update({ countertop: event.target.value as Selection["countertop"], undecided: false })}>{countertops.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
            <label>Открывание и закрывание <small>Петли дверей и направляющие ящиков</small><select value={selection.hardware} onChange={event => update({ hardware: event.target.value as Selection["hardware"], undecided: false })}>{hardwareOptions.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          </fieldset></details>
          {!hasPrices && <p className="calc-note">Сейчас доступна заявка на расчёт. Цену выбранной комплектации уточнит менеджер.</p>}
        </>}
        {step === 2 && result && <div className="calc-result-grid"><div>
          {result.status === "priced" ? <div className="calc-price" role="status"><span>Ориентировочная стоимость мебели</span><strong>{result.price.toLocaleString("ru-RU")} BYN</strong><p>{meters(result.length)} м × {result.rate.toLocaleString("ru-RU")} BYN/м, с округлением до 50 BYN.</p>{previousPrice !== null && previousPrice !== result.price && <p>{result.price > previousPrice ? "Дороже" : "Дешевле"} предыдущего варианта на {Math.abs(result.price - previousPrice).toLocaleString("ru-RU")} BYN.</p>}<small>Итоговая смета — после проверки размеров и состава заказа.</small></div>
            : <div className="calc-price calc-unpriced"><span>Стоимость уточнит менеджер</span><strong>Осталось указать контакты</strong><p>Онлайн-цена этой комплектации пока недоступна. Отправьте параметры — подготовим индивидуальный расчёт.</p></div>}
          <h3 className="calc-subtitle">Вы выбрали</h3><ul className="calc-summary">{summary.map(line => <li key={line}><Check size={16} aria-hidden="true" /><span>{line}</span></li>)}</ul>
          <div className="calc-included"><h3>Что обсуждаем в расчёте</h3><p>Корпуса, фасады, выбранные верхние шкафы, столешницу, петли и направляющие. Высоту, количество ящиков, ручки и конкретные механизмы уточняем перед сметой.</p><h3>Отдельно</h3><p>Техника, мойка, смеситель, фартук, подсветка, доставка, подъём, монтаж и подключение техники.</p></div>
          <div className="calc-edit"><button type="button" className="calc-secondary" onClick={() => go(1)}>Изменить комплектацию</button><button type="button" className="calc-text-button" onClick={() => go(0)}>Изменить размеры</button></div>
        </div><CalculatorLeadForm selection={selection} result={result} /></div>}
        {error && <p id="calc-error" role="alert" className="calc-error">{error}</p>}
        {step < 2 && <div className="calc-navigation">{step > 0 && <button type="button" className="calc-back" disabled={loading} onClick={() => go(step - 1)}><ArrowLeft size={18} /> Назад</button>}<button type="button" className="calc-primary" disabled={loading} data-testid={step === 0 ? "calculator-next" : "calculator-submit"} onClick={step === 0 ? next : prepare}>{loading ? <><Loader2 size={18} className="calc-spinner" /> Проверяем…</> : <>{step === 0 ? "Далее — комплектация" : hasPrices ? "Посмотреть расчёт" : "Посмотреть итог"}<ArrowRight size={18} /></>}</button></div>}
      </div>
    </section>
    <section className="calc-examples" aria-labelledby="calc-examples-title"><h2 id="calc-examples-title">Начните с похожей кухни</h2><p className="calc-muted">Визуализации для выбора планировки. Подставьте примерные размеры и комплектацию, затем измените их под себя.</p><div className="calc-example-grid">{examples.map(example => <article key={example.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={example.image} alt={`Визуализация: ${example.title.toLowerCase()}`} width={600} height={400} loading="lazy" decoding="async" />
      <div><span className="calc-eyebrow">Пример дизайна</span><h3>{example.title}</h3><p>{example.description}</p><button type="button" className="calc-secondary" disabled={loading} onClick={() => useExample(example.id)}>Выбрать этот пример</button></div>
    </article>)}</div></section>
  </>;
}
