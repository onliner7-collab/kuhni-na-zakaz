import test from "node:test";
import assert from "node:assert/strict";
import { emptyExploreContext } from "@/lib/explore-context";
import { readTransitions } from "@/lib/transition-registry";

test("ExploreContext has no URL facet state", () => {
  const context = emptyExploreContext("/catalog/uglovye-kuhni");
  assert.equal(context.sourceRoute, "/catalog/uglovye-kuhni");
  assert.equal(Object.prototype.hasOwnProperty.call(context, "href"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(context, "searchParams"), false);
});

test("Transition Registry returns crawlable angular continuations", () => {
  const transitions = readTransitions("/catalog/uglovye-kuhni");
  assert.equal(transitions.length, 4);
  assert.ok(transitions.every((item) => item.anchorRu && item.toRoute && item.fallbackRoute));
  assert.equal(transitions.find((item) => item.actionType === "PROOF")?.requiresEvidence, true);
});
