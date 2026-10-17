import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import {
  EMPTY_MATERIAL_STATE,
  MATERIAL_TTL,
  sanitizeMaterialState,
  reconcileMaterialUrl,
  safeMaterialReturn,
  comparisonHref,
  normalizeMaterialLead,
} from "../../lib/material-selection";
import { MATERIAL_PHOTOS } from "../../data/material-hub-gallery";
import {
  MATERIAL_ROUTES,
  MATERIAL_SOLUTIONS,
} from "../../data/material-solutions";
import { answerRows } from "../../lib/leads/details";

const now = Date.now();
test("LDSP visual exploration restores safely without becoming a purchase preference", () => {
  const legacy = sanitizeMaterialState({ version: 1 }, now);
  assert.deepEqual(legacy.ldspView, { construction: 0, decor: 0, room: 0, alternative: "mdf-film" });
  const valid = sanitizeMaterialState({ ...EMPTY_MATERIAL_STATE, ldspView: { construction: 2, decor: 3, room: 2, alternative: "mdf-enamel" } }, now);
  assert.equal(valid.ldspView.decor, 3);
  assert.equal(valid.ldspView.alternative, "mdf-enamel");
  assert.deepEqual(valid.comparisonIds, []);
  assert.equal(valid.preferredId, null);
  assert.equal(valid.updatedAt, 0);
  const bad = sanitizeMaterialState({ ...EMPTY_MATERIAL_STATE, ldspView: { construction: 999, decor: -1, room: 2.5, alternative: "unknown" } }, now);
  assert.deepEqual(bad.ldspView, legacy.ldspView);
});
const saved = {
  ...EMPTY_MATERIAL_STATE,
  comparisonIds: ["ldsp", "mdf-film"],
  preferredId: "ldsp",
  updatedAt: now,
};
test("URL overrides saved order and never inherits an old preference", () => {
  const s = reconcileMaterialUrl(saved, "/materials?compare=acrylic,ldsp");
  assert.deepEqual(s.comparisonIds, ["acrylic", "ldsp"]);
  assert.equal(s.preferredId, null);
  assert.deepEqual(
    reconcileMaterialUrl(saved, "/materials?compare=").comparisonIds,
    [],
  );
  assert.equal(reconcileMaterialUrl(saved, "/materials").preferredId, "ldsp");
});
test("unknown, duplicate and excessive URL ids are removed", () => {
  const s = reconcileMaterialUrl(
    saved,
    "/materials?compare=invalid,ldsp,ldsp,mdf-film,acrylic,hpl&preferred=hpl",
  );
  assert.deepEqual(s.comparisonIds, ["ldsp", "mdf-film", "acrylic"]);
  assert.equal(s.preferredId, null);
});
test("expired, malformed and future storage does not select a material", () => {
  assert.deepEqual(
    sanitizeMaterialState({ ...saved, updatedAt: now - MATERIAL_TTL - 1 }, now)
      .comparisonIds,
    [],
  );
  assert.deepEqual(
    sanitizeMaterialState({ version: 2, ...{ comparisonIds: ["ldsp"] } }, now)
      .comparisonIds,
    [],
  );
  assert.deepEqual(
    sanitizeMaterialState({ ...saved, updatedAt: now + 999999 }, now)
      .comparisonIds,
    [],
  );
  assert.equal(
    sanitizeMaterialState({ ...saved, preferredId: "hpl" }, now).preferredId,
    null,
  );
});
test("safe return only accepts known internal routes and allowed parameters", () => {
  for (const bad of [
    "//evil.test",
    "https://evil.test",
    "/admin",
    "/materials/../../admin",
    "javascript:alert(1)",
  ])
    assert.equal(safeMaterialReturn(bad), "/materials#compare");
  assert.equal(
    safeMaterialReturn("/materials?compare=ldsp&name=PRIVATE#compare"),
    "/materials?compare=ldsp#compare",
  );
});
test("portable link and lead serialization exclude contacts, viewing history and untrusted names", () => {
  assert.equal(
    comparisonHref(saved),
    "/materials?compare=ldsp%2Cmdf-film&preferred=ldsp#compare",
  );
  const s = normalizeMaterialLead({
    comparisonIds: ["ldsp", "invalid", "mdf-film", "ldsp"],
    comparisonNames: ["FAKE"],
    preferredId: "hpl",
    name: "PRIVATE",
    recentViews: ["secret"],
  });
  assert.deepEqual(s.comparisonNames, ["Фасады ЛДСП", "МДФ в плёнке"]);
  assert.equal(s.preferredId, null);
  assert.ok(!JSON.stringify(s).includes("PRIVATE"));
  assert.ok(!JSON.stringify(s).includes("FAKE"));
  const rows = answerRows({ materialSelection: s });
  assert.ok(rows.some((r) => r.value === "МДФ в плёнке"));
  assert.ok(rows.some((r) => r.label.includes("Варианты для расчёта")));
});
test("all registry routes and gallery assets exist with stable unique ids", () => {
  assert.equal(MATERIAL_ROUTES.length, 7);
  assert.equal(MATERIAL_SOLUTIONS.length, 6);
  assert.ok(MATERIAL_PHOTOS.length >= 64);
  assert.equal(
    new Set(MATERIAL_PHOTOS.map((p) => p.id)).size,
    MATERIAL_PHOTOS.length,
  );
  assert.equal(
    new Set(MATERIAL_PHOTOS.map((p) => p.src)).size,
    MATERIAL_PHOTOS.length,
  );
  for (const p of MATERIAL_PHOTOS) {
    assert.ok(fs.existsSync("public" + p.src), p.src);
    assert.ok(/[а-яё]/i.test(p.alt));
    assert.ok(p.src.endsWith(".webp"));
  }
});
test("MDF view is restored separately without selecting a material or refreshing its TTL", () => {
  const s = sanitizeMaterialState({ ...saved, galleryFilters: { color: "Тёмные" }, mdfGallery: { material: "mdf-film", layout: "Деталь", limit: 12, activePhoto: "mdf-20261015-film-apartment-edge" } }, now);
  assert.deepEqual(s.comparisonIds, saved.comparisonIds);
  assert.equal(s.preferredId, saved.preferredId);
  assert.equal(s.updatedAt, now);
  assert.equal(s.galleryFilters.color, "Тёмные");
  assert.equal(s.mdfGallery.layout, "Деталь");
  assert.equal(s.mdfGallery.activePhoto, "mdf-20261015-film-apartment-edge");
  assert.deepEqual(sanitizeMaterialState({ version: 1, mdfGallery: { material: "PRIVATE", layout: "PRIVATE", limit: Infinity, activePhoto: "https://example.com" } }).mdfGallery, EMPTY_MATERIAL_STATE.mdfGallery);
});
