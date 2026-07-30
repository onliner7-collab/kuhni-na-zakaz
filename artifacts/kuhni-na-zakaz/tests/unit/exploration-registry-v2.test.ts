import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { RelatedExplorationRail } from "@/components/exploration/RelatedExplorationRail";
import {
  emptyExploreContext,
  migrateExploreContext,
  sanitizeExploreContext,
  serializeExploreContextForLead,
} from "@/lib/explore-context";
import { getTransitionRegistry, readTransitions } from "@/lib/transition-registry";

test("registry v2 has stable unique IDs and valid active fallbacks", () => {
  const registry = getTransitionRegistry();
  const ids = new Set(registry.map((item) => item.id));
  assert.equal(ids.size, registry.length);
  assert.ok(registry.every((item) => item.reasonRu && item.fallbackRoute));
  assert.ok(registry.every((item) => ["active", "planned", "blocked_evidence", "disabled"].includes(item.status)));
  assert.ok(readTransitions("/catalog/uglovye-kuhni").length <= 4);
});

test("planned, disabled and evidence-blocked transitions stay hidden", () => {
  const registry = getTransitionRegistry();
  const visibleIds = new Set(readTransitions("/locations/borisov").map((item) => item.id));
  for (const item of registry.filter((entry) => entry.fromRoute === "/locations/borisov")) {
    if (item.status !== "active") assert.equal(visibleIds.has(item.id), false);
  }
  assert.equal(
    readTransitions("/locations/borisov").some((item) =>
      item.actionType === "PROOF" && item.evidenceStatus !== "verified"),
    false,
  );
});

test("server HTML keeps crawlable href and Russian reason", () => {
  const html = renderToStaticMarkup(
    RelatedExplorationRail({ route: "/catalog/uglovye-kuhni" }),
  );
  assert.match(html, /href="\/portfolio"/);
  assert.match(html, /Проверить подтверждённые работы/);
  assert.doesNotMatch(html, /planned/);
});

test("context v2 migrates legacy data and removes unknown or PII fields", () => {
  const migrated = migrateExploreContext({
    layout: "угловая",
    materials: ["МДФ"],
    sourceRoute: "/catalog/uglovye-kuhni",
    name: "Не сохранять",
    phone: "+375000000000",
    address: "Не сохранять",
    freeText: "Не сохранять",
    exactPrice: 123,
  });
  assert.equal(migrated.layout, "угловая");
  assert.deepEqual(migrated.materials, ["МДФ"]);
  assert.equal("name" in migrated, false);
  assert.equal("phone" in migrated, false);
  assert.equal("address" in migrated, false);
  assert.equal("freeText" in migrated, false);
  assert.equal("exactPrice" in migrated, false);
});

test("context sanitizer handles malformed values without URL facets", () => {
  const context = sanitizeExploreContext({
    style: 42,
    materials: ["МДФ", null, "эмаль"],
    evidencePreference: "unsupported",
    href: "/styles?facet=1",
    searchParams: { style: "loft" },
  }, "/styles");
  assert.equal(context.sourceRoute, "/styles");
  assert.deepEqual(context.materials, ["МДФ", "эмаль"]);
  assert.equal(context.evidencePreference, undefined);
  assert.equal("href" in context, false);
  assert.equal("searchParams" in context, false);
  assert.deepEqual(emptyExploreContext("/"), { sourceRoute: "/", lastMeaningfulAction: "" });
});

test("lead context contains only meaningful whitelisted exploration fields", () => {
  assert.equal(serializeExploreContextForLead(emptyExploreContext("/calculator")), null);
  assert.deepEqual(
    serializeExploreContextForLead({
      layout: "угловая",
      materials: ["МДФ"],
      sourceRoute: "/catalog/uglovye-kuhni",
      lastMeaningfulAction: "выбор планировки",
    }),
    {
      layout: "угловая",
      materials: ["МДФ"],
      sourceRoute: "/catalog/uglovye-kuhni",
      lastMeaningfulAction: "выбор планировки",
      hardware: undefined,
    },
  );
});
