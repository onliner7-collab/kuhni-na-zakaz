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
test("veneer view migrates, rejects invalid values and never extends explicit selection TTL", () => {
  assert.deepEqual(sanitizeMaterialState({version:1}, now).veneerView, EMPTY_MATERIAL_STATE.veneerView);
  const s = sanitizeMaterialState({...EMPTY_MATERIAL_STATE, comparisonIds:["veneer","ldsp"], preferredId:"veneer", updatedAt:now, veneerView:{surface:2,combination:1,alternative:"mdf-enamel",layout:"Деталь",photo:"veneer-grain-edge"}},now);
  assert.equal(s.veneerView.surface,2); assert.equal(s.veneerView.photo,"veneer-grain-edge");
  assert.equal(s.updatedAt,now); assert.deepEqual(s.comparisonIds,["veneer","ldsp"]);
  assert.ok(!JSON.stringify(normalizeMaterialLead(s)).includes("veneerView"));
  const expired=sanitizeMaterialState({...s,updatedAt:now-MATERIAL_TTL-1},now);
  assert.deepEqual(expired.comparisonIds,[]); assert.equal(expired.veneerView.surface,2);
  assert.deepEqual(sanitizeMaterialState({version:1,veneerView:{surface:Infinity,combination:-1,alternative:"bad",layout:"bad",photo:"https://evil.test"}},now).veneerView,EMPTY_MATERIAL_STATE.veneerView);
});
test("acrylic views migrate and restore independently of selection and lead data", () => {
  assert.deepEqual(sanitizeMaterialState({version:1}, now).acrylicView, EMPTY_MATERIAL_STATE.acrylicView);
  const state = sanitizeMaterialState({...EMPTY_MATERIAL_STATE, comparisonIds:["acrylic","hpl"], preferredId:"acrylic", updatedAt:now, acrylicView:{surface:2,room:1,alternative:"mdf-enamel",color:"Тёмные",layout:"Деталь",limit:12,photo:"acrylic-edge-macro"}},now);
  assert.equal(state.acrylicView.surface, 2);
  assert.equal(state.acrylicView.photo, "acrylic-edge-macro");
  assert.equal(state.updatedAt, now);
  assert.deepEqual(state.comparisonIds, ["acrylic", "hpl"]);
  assert.equal(state.preferredId, "acrylic");
  assert.ok(!JSON.stringify(normalizeMaterialLead(state)).includes("acrylicView"));
  assert.deepEqual(sanitizeMaterialState({version:1,acrylicView:{surface:8,room:-1,alternative:"bad",color:"bad",layout:"bad",limit:Infinity,photo:"https://evil.test"}},now).acrylicView,EMPTY_MATERIAL_STATE.acrylicView);
  const expired = sanitizeMaterialState({...state,updatedAt:now-MATERIAL_TTL-1},now);
  assert.deepEqual(expired.comparisonIds,[]);
  assert.equal(expired.acrylicView.surface,2);
});
test("HPL view restores safely without changing preference, TTL or lead payload", () => {
  assert.deepEqual(sanitizeMaterialState({version:1},now).hplView,EMPTY_MATERIAL_STATE.hplView);
  const s=sanitizeMaterialState({...EMPTY_MATERIAL_STATE,comparisonIds:["hpl","acrylic"],preferredId:"hpl",updatedAt:now,hplView:{base:1,finish:1,room:2,alternative:"ldsp",color:"Древесные",texture:"Под дерево",layout:"Прямая",limit:12,photo:"hpl-wood-country"}},now);
  assert.equal(s.hplView.base,1);
  assert.equal(s.hplView.photo,"hpl-wood-country");
  assert.equal(s.updatedAt,now);
  assert.equal(s.preferredId,"hpl");
  const bad=sanitizeMaterialState({...s,hplView:{base:-1,finish:50,room:99,alternative:"unknown",color:"PRIVATE",texture:"PRIVATE",layout:"PRIVATE",limit:Infinity,photo:"https://evil.test"}},now);
  assert.deepEqual(bad.hplView,EMPTY_MATERIAL_STATE.hplView);
  const lead=normalizeMaterialLead(s);
  assert.deepEqual(lead.comparisonIds,["hpl","acrylic"]);
  assert.ok(!("hplView" in lead));
  assert.ok(!JSON.stringify(lead).includes("hpl-wood-country"));
});
test("enamel view migrates safely, preserves explicit selection and is excluded from leads", () => {
  assert.deepEqual(sanitizeMaterialState({version:1},now).enamelView,EMPTY_MATERIAL_STATE.enamelView);
  const s=sanitizeMaterialState({...EMPTY_MATERIAL_STATE,comparisonIds:["mdf-enamel","hpl"],preferredId:"mdf-enamel",updatedAt:now,enamelView:{finish:1,profile:2,room:2,alternative:"hpl",galleryFinish:"Глянцевая",galleryMilling:"Гладкая",galleryLayout:"Прямая",limit:12,photo:"enamel-straight-gloss"}},now);
  assert.equal(s.enamelView.finish,1);
  assert.equal(s.enamelView.photo,"enamel-straight-gloss");
  assert.equal(s.preferredId,"mdf-enamel");
  assert.equal(s.updatedAt,now);
  const invalid=sanitizeMaterialState({...s,enamelView:{finish:99,profile:99,room:-1,alternative:"PRIVATE",galleryFinish:"PRIVATE",galleryMilling:"PRIVATE",galleryLayout:"PRIVATE",limit:Infinity,photo:"https://evil.test"}},now);
  assert.deepEqual(invalid.enamelView,EMPTY_MATERIAL_STATE.enamelView);
  const lead=normalizeMaterialLead(s);
  assert.deepEqual(lead.comparisonIds,["mdf-enamel","hpl"]);
  assert.ok(!("enamelView" in lead));
});
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
