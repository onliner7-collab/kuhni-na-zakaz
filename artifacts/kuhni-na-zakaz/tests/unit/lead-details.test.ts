import assert from "node:assert/strict";
import test from "node:test";
import { answerRows, leadDetailsPath, safeLeadUrl } from "../../lib/leads/details";
import { initialSelection } from "../../lib/calculator/config";

test("lead links identify a saved request, not its source page", () => {
  assert.equal(leadDetailsPath(1009), "/admin/leads/1009");
  for (const invalid of [NaN, -1, 0, 1.5]) assert.throws(() => leadDetailsPath(invalid));
});
test("calculator snapshot includes selected dimensions, materials and historical estimate", () => {
  const rows = answerRows({ calculator: { selection: { ...initialSelection, layout: "corner", lengths: ["2,4", "1.8", ""], upper: "ceiling" }, result: { status: "unpriced", length: 4.2 } } });
  const text = rows.map(row => row.value).join("\n");
  assert.match(text, /4,2 м/); assert.match(text, /Шкафы до потолка/); assert.match(text, /Стоимость уточнит менеджер/);
});
test("nested selections from any page and boolean false survive rendering", () => {
  const rows = answerRows({ smolevichiKitchenSelection: { modelName: "Светлая кухня", dimensions: "3 × 2 м" }, hasMeasurements: false, customFutureSelection: { customOption: "Выбранный вариант" } });
  assert.ok(rows.some(row => row.value === "Светлая кухня"));
  assert.ok(rows.some(row => row.value === "3 × 2 м"));
  assert.ok(rows.some(row => row.value === "Нет"));
  assert.ok(rows.some(row => row.value === "Выбранный вариант"));
});
test("unsafe image and page URLs cannot become executable or external links", () => {
  assert.equal(safeLeadUrl("javascript:alert(1)"), "");
  assert.equal(safeLeadUrl("https://example.com/image.jpg"), "");
  assert.equal(safeLeadUrl("//evil.test/x"), "");
  assert.equal(safeLeadUrl("/images/example.webp"), "https://kuhni.minsk.by/images/example.webp");
});
