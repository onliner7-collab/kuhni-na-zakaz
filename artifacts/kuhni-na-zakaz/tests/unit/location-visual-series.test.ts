import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  getLocationVisualSeries,
  locationVisualContracts,
  locationVisualSeries,
} from "@/data/location-visual-series";

const protectedRoutes = new Set([
  "/locations/minsk",
  "/locations/minskaya-oblast",
  "/locations/borisov",
]);

test("location corrective registry has 28 unique route contracts", () => {
  assert.equal(locationVisualContracts.length, 28);
  assert.equal(new Set(locationVisualContracts.map((item) => item.route)).size, 28);
  assert.ok(locationVisualContracts.every((item) => item.visualLogic.length === 4));
  assert.ok(locationVisualContracts.every((item) => !protectedRoutes.has(item.route)));
});

test("L0 activates only three pilot series with four distinct states", () => {
  assert.deepEqual(
    locationVisualSeries.map((item) => item.route).sort(),
    ["/locations/fanipol", "/locations/gomel", "/locations/soligorsk"],
  );

  for (const item of locationVisualSeries) {
    assert.equal(item.states.length, 4);
    assert.equal(new Set(item.states.map((state) => state.id)).size, 4);
    assert.equal(new Set(item.states.map((state) => state.image)).size, 4);
    assert.equal(item.initialStateId, item.states[0].id);
  }
});

test("pilot files and WebP/AVIF parity exist in public", () => {
  for (const item of locationVisualSeries) {
    for (const state of item.states) {
      for (const publicPath of [state.image, state.avifImage]) {
        assert.equal(publicPath.startsWith("/uploads/locations/"), true);
        assert.equal(fs.existsSync(path.join(process.cwd(), "public", publicPath)), true, publicPath);
      }
    }
  }
});

test("pilot labels, alt and disclosure are Russian and meaningful", () => {
  const cyrillic = /[А-Яа-яЁё]/;
  for (const item of locationVisualSeries) {
    assert.match(item.userQuestion, cyrillic);
    assert.match(item.uniquePromise, cyrillic);
    for (const state of item.states) {
      assert.match(state.controlLabelRu, cyrillic);
      assert.match(state.altRu, cyrillic);
      assert.match(state.disclosureRu, cyrillic);
      assert.ok(state.nextRoutes.length >= 1 && state.nextRoutes.length <= 4);
      assert.equal(state.nextRoutes.includes(item.route), false);
    }
  }
});

test("protected and not-yet-deployed routes receive no active generic config", () => {
  for (const route of protectedRoutes) assert.equal(getLocationVisualSeries(route), null);
  assert.equal(getLocationVisualSeries("/locations/vitebsk"), null);
});

test("different pilot routes do not share complete image series", () => {
  const signatures = locationVisualSeries.map((item) => item.states.map((state) => state.image).join("|"));
  assert.equal(new Set(signatures).size, signatures.length);
});
