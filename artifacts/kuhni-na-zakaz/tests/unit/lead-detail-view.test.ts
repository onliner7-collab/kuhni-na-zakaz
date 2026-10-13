import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Lead } from "@prisma/client";
import { LeadDetail } from "../../components/admin/LeadDetail";
import { initialSelection } from "../../lib/calculator/config";

const fixture = {
  publicNumber: 1009, name: "Проверка заявки", phone: "", email: "test@example.invalid", city: "Минск", kitchenType: "Угловая", dimensions: "2,4 × 1,8 м", comment: "Клиент выбрал шкафы до потолка", sourceType: "price_calculator", sourcePage: "https://kuhni.minsk.by/calculator", imageUrl: "/images/prices-showcase/generated/modern-corner-3x2-1.webp", styleSlug: "", materialSlug: "", budgetLevel: "", scenarioSlug: "", status: "new", createdAt: new Date("2026-10-13T12:00:00Z"), answers: { calculator: { selection: { ...initialSelection, layout: "corner", lengths: ["2,4", "1.8", ""], upper: "ceiling" }, result: { status: "unpriced", length: 4.2 } } },
} as unknown as Lead;
test("saved request view renders selected photo, contacts and calculator snapshot", () => {
  const html = renderToStaticMarkup(React.createElement(LeadDetail, { lead: fixture }));
  for (const expected of ["Заявка №1009", "test@example.invalid", "4,2 м", "Шкафы до потолка", "modern-corner-3x2-1.webp"]) assert.ok(html.includes(expected));
});
test("stored user text is escaped and unsafe image URLs are omitted", () => {
  const html = renderToStaticMarkup(React.createElement(LeadDetail, { lead: { ...fixture, comment: '<script>alert("test")</script>', imageUrl: "javascript:alert(1)" } }));
  assert.ok(html.includes("&lt;script&gt;")); assert.ok(!html.includes("<script>")); assert.ok(!html.includes('src="javascript:'));
});
