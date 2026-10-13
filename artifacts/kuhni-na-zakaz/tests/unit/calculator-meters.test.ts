import assert from "node:assert/strict";
import test from "node:test";
import { estimate, initialSelection, lengthError, parseMeters, tariffKeys, totalMeters, describeSelection, type Selection } from "../../lib/calculator/config";
import { selectionSchema } from "../../lib/calculator/validation";
import { canUseCalculatorEmail, leadInputSchema } from "../../lib/leads/validation";
const straight: Selection = { ...initialSelection, lengths: ["3", "", ""] };
test("accepts decimal comma and dot, rejects malformed or out-of-range dimensions", () => {
  assert.equal(parseMeters("2,4"), 2.4); assert.equal(parseMeters("2.4"), 2.4);
  for (const value of ["", "2м", "2,4,1", "Infinity", "2e3", "-2"]) assert.ok(Number.isNaN(parseMeters(value)));
  for (const value of ["0", "0,5", "12"]) assert.ok(lengthError({ ...straight, lengths: [value, "", ""] }));
});
test("sums only active sides without double-counting the upper row", () => {
  assert.equal(totalMeters({ ...straight, lengths: ["3", "4", "5"] }), 3);
  assert.equal(totalMeters({ ...straight, layout: "corner", lengths: ["2,4", "1.8", "9"] }), 4.2);
  assert.equal(totalMeters({ ...straight, layout: "u_shape", lengths: ["2", "3", "2"] }), 7);
});
test("missing, disabled or corrupt tariffs never produce a zero price", () => {
  assert.equal(estimate(straight, []).status, "unpriced");
  const rules = tariffKeys(straight).map((key, index) => ({ key, value: index === 0 ? 1000 : 0, active: true }));
  assert.equal(estimate(straight, rules).status, "priced");
  assert.equal(estimate(straight, rules.slice(1)).status, "unpriced");
  assert.equal(estimate(straight, rules.map((rule, index) => ({ ...rule, active: index !== 2 }))).status, "unpriced");
  assert.equal(estimate(straight, rules.map((rule, index) => ({ ...rule, value: index === 0 ? 0 : rule.value }))).status, "unpriced");
  assert.equal(estimate({ ...straight, undecided: true }, rules).status, "unpriced");
});
test("price scales with metres; countertop and hardware scale too", () => {
  const rules = tariffKeys(straight).map((key, index) => ({ key, value: [1000, 200, 100, 0][index], active: true }));
  assert.deepEqual(estimate(straight, rules), { status: "priced", length: 3, rate: 1300, price: 3900, version: "meters-v2" });
  const longer = estimate({ ...straight, lengths: ["6", "", ""] }, rules);
  assert.equal(longer.status === "priced" && longer.price, 7800);
});
test("selection server schema rejects unknown options and malformed requests", () => {
  assert.ok(selectionSchema.safeParse(straight).success);
  assert.equal(selectionSchema.safeParse({ ...straight, layout: "unknown" }).success, false);
  assert.equal(selectionSchema.safeParse({ ...straight, price: 1 }).success, false);
  assert.equal(selectionSchema.safeParse(null).success, false);
});
test("undecided customers do not get attributed unchosen materials", () => {
  const summary = describeSelection({ ...straight, material: "enamel", undecided: true }).join(" ");
  assert.ok(summary.includes("пока не выбраны")); assert.ok(!summary.includes("эмали"));
});
test("email-only contact allowed only for calculator, and never masks a bad phone", () => {
  const input = { source: "calculator", formType: "calculator", phone: "", email: "test@example.invalid" };
  assert.equal(canUseCalculatorEmail(input), true);
  assert.equal(canUseCalculatorEmail({ ...input, source: "home" }), false);
  assert.equal(canUseCalculatorEmail({ ...input, email: "wrong" }), false);
  assert.equal(canUseCalculatorEmail({ ...input, email: "" }), false);
  assert.equal(canUseCalculatorEmail({ ...input, phone: "123" }), false);
  assert.equal(leadInputSchema.safeParse({ ...input, name: "Тест", agreement: true }).success, true);
});
