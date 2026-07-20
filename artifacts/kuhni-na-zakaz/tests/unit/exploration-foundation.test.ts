import test from "node:test";
import assert from "node:assert/strict";
import { emptyExploreContext } from "@/lib/explore-context";
import { readTransitions } from "@/lib/transition-registry";
import { SCENARIO_FAMILY, STYLE_FAMILY, type FamilyLink } from "@/data/exploration-families";

test("ExploreContext has no URL facet state", () => {
  const context = emptyExploreContext("/catalog/uglovye-kuhni");
  assert.equal(context.sourceRoute, "/catalog/uglovye-kuhni");
  assert.equal(Object.prototype.hasOwnProperty.call(context, "href"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(context, "searchParams"), false);
});

test("style and scenario families keep unique contracts and four server transitions", () => {
  assert.equal(Object.keys(STYLE_FAMILY).length, 8);
  assert.equal(Object.keys(SCENARIO_FAMILY).length, 6);
  for (const [family, configs] of [["styles", STYLE_FAMILY], ["scenarios", SCENARIO_FAMILY]] as const) {
    const titles = new Set<string>();
    const headings = new Set<string>();
    for (const config of Object.values(configs)) {
      assert.ok(!titles.has(config.title));
      assert.ok(!headings.has(config.h1));
      titles.add(config.title);
      headings.add(config.h1);
      assert.deepEqual(config.links.map((link: FamilyLink) => link.type), ["DEEPEN", "COMPARE", "PROOF", "CONVERT"]);
      assert.equal(readTransitions(`/${family}/${config.slug}`, "RESULT").length, 4);
    }
  }
});

test("Transition Registry returns crawlable angular continuations", () => {
  const transitions = readTransitions("/catalog/uglovye-kuhni");
  assert.equal(transitions.length, 4);
  assert.ok(transitions.every((item) => item.anchorRu && item.toRoute && item.fallbackRoute));
  assert.equal(transitions.find((item) => item.actionType === "PROOF")?.requiresEvidence, true);
});
