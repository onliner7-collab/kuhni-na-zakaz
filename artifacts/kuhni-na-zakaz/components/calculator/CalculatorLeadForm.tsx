"use client";
import { useRef, useState, type FormEvent } from "react";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";
import { describeSelection, getLengths, layouts, meters, totalMeters, type Estimate, type Selection } from "@/lib/calculator/config";
import { normalizePhone } from "@/lib/leads/validation";

export function CalculatorLeadForm({ selection, result }: { selection: Selection; result: Estimate }) {
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = "Укажите имя — хотя бы 2 буквы.";
    if (!phone && !email) nextErrors.phone = "Укажите телефон или электронную почту. Можно оба.";
    if (phone && !normalizePhone(phone)) nextErrors.phone = "Проверьте номер телефона.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Проверьте адрес электронной почты.";
    if (!form.get("agreement")) nextErrors.agreement = "Нужно согласие на обработку данных.";
    setErrors(nextErrors); setError("");
    if (Object.keys(nextErrors).length) { document.getElementById(`calc-contact-${Object.keys(nextErrors)[0]}`)?.focus(); return; }
    inFlight.current = true; setBusy(true);
    const params = new URLSearchParams(window.location.search);
    const comment = [
      ...describeSelection(selection),
      result.status === "priced" ? `Предварительная оценка: ${result.price} BYN. Требует проверки менеджером.` : "Стоимость не рассчитана. Прошу подготовить смету.",
      "Техника, мойка, смеситель, фартук, подсветка, доставка и монтаж — отдельно.",
    ].join("\n");
    const payload = {
      name, phone, email, agreement: true, preferredContact: phone ? "phone" : "email", continueInTelegram: false,
      honeypot: String(form.get("website") || ""), source: "calculator", sourceType: "calculator", formType: "calculator", sourceBlock: "calculator_meters",
      sourcePage: window.location.href, referrer: document.referrer,
      kitchenType: layouts.find(item => item.id === selection.layout)!.title,
      dimensions: `${getLengths(selection).map(meters).join(" × ")} м; сумма сторон ${meters(totalMeters(selection))} м`,
      comment, hasMeasurements: !selection.approximate,
      answers: { calculator: { selection, result, estimateIsPreliminary: true } },
      utmSource: params.get("utm_source") || "", utmMedium: params.get("utm_medium") || "", utmCampaign: params.get("utm_campaign") || "",
    };
    try {
      const response = await fetch("/kapi/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || "Не удалось отправить заявку. Попробуйте ещё раз.");
      setSent(true);
      trackAnalyticsEvent(ANALYTICS_EVENTS.CALCULATOR_SUBMIT, { source: "calculator_meters" });
      trackAnalyticsEvent(ANALYTICS_EVENTS.LEAD_SUCCESS, { source: "calculator", form_type: "calculator" });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Не удалось отправить заявку. Параметры сохранены, попробуйте ещё раз."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  if (sent) return <div className="calc-lead calc-success" role="status" tabIndex={-1}><span aria-hidden="true">✓</span><h3>Заявка получена</h3><p>Размеры и комплектация отправлены. Менеджер свяжется с вами по указанному телефону или электронной почте.</p></div>;
  return <form className="calc-lead" ref={formRef} onSubmit={submit} noValidate aria-label="Заявка на расчёт кухни">
    <h3>Куда отправить расчёт?</h3><p className="calc-muted">Укажите телефон или электронную почту. Можно оба. Размеры и комплектацию приложим автоматически.</p>
    <label className="calc-honeypot" aria-hidden="true">Сайт<input name="website" tabIndex={-1} autoComplete="off" /></label>
    {[
      { key: "name", title: "Ваше имя", type: "text", autocomplete: "given-name", placeholder: "Как к вам обращаться", max: 100 },
      { key: "phone", title: "Телефон", type: "tel", autocomplete: "tel", placeholder: "+375 …", max: 30 },
      { key: "email", title: "Электронная почта", type: "email", autocomplete: "email", placeholder: "name@example.com", max: 200 },
    ].map(field => <div className="calc-contact-field" key={field.key}><label htmlFor={`calc-contact-${field.key}`}>{field.title}{field.key === "name" ? " *" : ""}</label><input id={`calc-contact-${field.key}`} name={field.key} type={field.type} autoComplete={field.autocomplete} placeholder={field.placeholder} maxLength={field.max} disabled={busy} required={field.key === "name"} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `calc-contact-error-${field.key}` : undefined} />{errors[field.key] && <p id={`calc-contact-error-${field.key}`} className="calc-field-error" role="alert">{errors[field.key]}</p>}</div>)}
    <label className="calc-check calc-consent"><input id="calc-contact-agreement" name="agreement" type="checkbox" disabled={busy} aria-invalid={Boolean(errors.agreement)} aria-describedby={errors.agreement ? "calc-contact-error-agreement" : undefined} /><span>Согласен на <a href="/personal-data">обработку персональных данных</a> и с <a href="/privacy-policy">политикой обработки данных</a>.</span></label>
    {errors.agreement && <p id="calc-contact-error-agreement" className="calc-field-error" role="alert">{errors.agreement}</p>}
    {error && <p className="calc-error" role="alert">{error}</p>}
    <button type="submit" className="calc-primary" disabled={busy}>{busy ? "Отправляем…" : "Отправить на расчёт"}</button>
  </form>;
}
