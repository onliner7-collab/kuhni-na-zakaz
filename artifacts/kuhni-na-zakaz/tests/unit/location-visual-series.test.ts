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

test("L2A activates pilots, L1 and four satellite/house routes with four distinct states", () => {
  assert.deepEqual(
    locationVisualSeries.map((item) => item.route).sort(),
    [
      "/locations/brest",
      "/locations/dzerzhinsk",
      "/locations/fanipol",
      "/locations/gomel",
      "/locations/grodno",
      "/locations/logoisk",
      "/locations/maryina-gorka",
      "/locations/mogilev",
      "/locations/molodechno",
      "/locations/slutsk",
      "/locations/smolevichi",
      "/locations/soligorsk",
      "/locations/vitebsk",
      "/locations/zaslavl",
      "/locations/zhodino",
    ],
  );

  for (const item of locationVisualSeries) {
    assert.equal(item.states.length, 4);
    assert.equal(new Set(item.states.map((state) => state.id)).size, 4);
    assert.equal(new Set(item.states.map((state) => state.image)).size, 4);
    assert.equal(item.initialStateId, item.states[0].id);
  }
});

test("active files and WebP/AVIF parity exist in public", () => {
  for (const item of locationVisualSeries) {
    for (const state of item.states) {
      for (const publicPath of [state.image, state.avifImage]) {
        assert.equal(publicPath.startsWith("/uploads/locations/"), true);
        assert.equal(fs.existsSync(path.join(process.cwd(), "public", publicPath)), true, publicPath);
      }
    }
  }
});

test("L1A, L1B and L2A states have lightweight mobile WebP derivatives", () => {
  const waveSeries = locationVisualSeries.filter((item) =>
    ["vitebsk", "grodno", "brest", "mogilev", "molodechno", "zhodino", "slutsk", "maryina-gorka", "smolevichi", "dzerzhinsk", "zaslavl", "logoisk"].some((city) => item.route.endsWith(`/${city}`)),
  );

  for (const item of waveSeries) {
    for (const state of item.states) {
      const mobilePath = state.image.replace(/\.webp$/, "-mobile.webp");
      const absolutePath = path.join(process.cwd(), "public", mobilePath);
      assert.equal(fs.existsSync(absolutePath), true, mobilePath);
      assert.ok(fs.statSync(absolutePath).size < 25_000, mobilePath);
    }
  }
});

test("active labels, alt and disclosure are Russian and meaningful", () => {
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

test("active next routes exist in the canonical sitemap", () => {
  const sitemap = fs.readFileSync(path.join(process.cwd(), "public", "sitemap-static.xml"), "utf8");
  for (const item of locationVisualSeries) {
    for (const state of item.states) {
      for (const route of state.nextRoutes) {
        assert.match(sitemap, new RegExp(`<loc>https://kuhni\\.minsk\\.by${route.replaceAll("/", "\\/")}</loc>`), route);
      }
    }
  }
});

test("protected and not-yet-deployed routes receive no active generic config", () => {
  for (const route of protectedRoutes) assert.equal(getLocationVisualSeries(route), null);
  assert.equal(getLocationVisualSeries("/locations/vileyka"), null);
});

test("different active routes do not share complete image series", () => {
  const signatures = locationVisualSeries.map((item) => item.states.map((state) => state.image).join("|"));
  assert.equal(new Set(signatures).size, signatures.length);
});
