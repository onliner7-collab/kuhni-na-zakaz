import React from "react";
import type { Lead } from "@prisma/client";
import { answerRows, safeLeadUrl } from "@/lib/leads/details";
import { LEAD_SOURCE_LABELS, type LeadSourceType } from "@/lib/leads/constants";
import { STATUS_OPTIONS } from "@/lib/lead-status";
export function LeadDetail({ lead }: { lead: Lead }) {
  const rows = answerRows(lead.answers);
  const image = safeLeadUrl(lead.imageUrl);
  const source = safeLeadUrl(lead.sourcePage);
  const fields = [
    ["Клиент", lead.name], ["Телефон", lead.phone], ["Электронная почта", lead.email], ["Город", lead.city],
    ["Тип кухни", lead.kitchenType], ["Размеры", lead.dimensions], ["Стиль", lead.styleSlug], ["Материал", lead.materialSlug], ["Бюджет", lead.budgetLevel], ["Сценарий", lead.scenarioSlug],
  ].filter(([, value]) => value);
  return <article className="mx-auto max-w-4xl space-y-5 break-words" data-testid="lead-details">
    <a href="/admin/leads" className="inline-flex min-h-11 items-center underline">← Все заявки</a>
    <header><h1 className="text-3xl font-bold">Заявка №{lead.publicNumber}</h1><p className="mt-2 text-sm text-muted-foreground">{new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Minsk" }).format(lead.createdAt)} · {STATUS_OPTIONS.find(item => item.value === lead.status)?.label || "Заявка"}</p></header>
    <p className="rounded-xl bg-primary/5 p-4">Здесь сохранены данные, отправленные клиентом. Изменения на исходной странице сайта не меняют эту заявку.</p>
    <section className="card-base p-4 sm:p-6"><h2 className="mb-4 text-xl font-semibold">Контакты и выбранная кухня</h2><dl className="grid gap-4 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 whitespace-pre-wrap">{value}</dd></div>)}</dl></section>
    {image && <section className="card-base p-4 sm:p-6"><h2 className="mb-4 text-xl font-semibold">Выбранное изображение</h2><a href={image} target="_blank" rel="noreferrer"><img src={image} alt="Изображение кухни, выбранное клиентом при отправке заявки" className="max-h-[480px] w-full rounded-xl object-contain" /></a></section>}
    <section className="card-base p-4 sm:p-6"><h2 className="mb-3 text-xl font-semibold">Комментарий клиента</h2><p className="whitespace-pre-wrap">{lead.comment || "Комментарий не добавлен."}</p></section>
    <section className="card-base p-4 sm:p-6"><h2 className="mb-4 text-xl font-semibold">Ответы и параметры при отправке</h2>{rows.length ? <dl className="space-y-4">{rows.map((row, i) => <div key={i} className="border-b border-border pb-3"><dt className="text-sm text-muted-foreground">{row.label}</dt><dd className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]">{row.value}</dd></div>)}</dl> : <p>Дополнительные ответы не были переданы этой формой. Выше показаны все сохранённые данные.</p>}</section>
    <section className="card-base p-4 sm:p-6"><h2 className="mb-3 text-xl font-semibold">Откуда пришла заявка</h2><p>{LEAD_SOURCE_LABELS[lead.sourceType as LeadSourceType] || "Форма сайта"}</p>{source && <a href={source} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center underline">Открыть исходную страницу сайта</a>}</section>
  </article>;
}
