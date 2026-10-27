import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import React, { createElement } from "react";
import Link from "@/components/navigation/Link";
import { resolvePublicPath, isRetiredScenario, RETIRED_SMALL_SCENARIO, SMALL_KITCHEN_CANONICAL } from "@/lib/retired-public-routes";
import { getTransitionRegistry } from "@/lib/transition-registry";
import sitemap from "@/app/sitemap";

// tsx runs the project's preserved JSX in classic mode outside the Next compiler.
Object.assign(globalThis, { React });

test("retired scenario redirects exactly and preserves query and hash", () => {
  for (const suffix of ["", "/", "?from=guide", "#example", "?from=guide#example"]) {
    assert.equal(resolvePublicPath(RETIRED_SMALL_SCENARIO + suffix), SMALL_KITCHEN_CANONICAL + (suffix === "/" ? "" : suffix));
  }
  for (const href of ["/scenarios/dlya-semi", "/catalog/malenkie-kuhni", "https://example.com/scenarios/dlya-malenkoy-kuhni", "/scenarios/dlya-malenkoy-kuhni-other"]) {
    assert.equal(resolvePublicPath(href), href);
  }
  assert.equal(isRetiredScenario("dlya-malenkoy-kuhni"), true);
  assert.equal(isRetiredScenario("dlya-semi"), false);
});

test("server links render the canonical destination, including DB-driven URLs", () => {
  const html = renderToStaticMarkup(createElement(Link, { href: RETIRED_SMALL_SCENARIO }, "Маленькие кухни"));
  assert.ok(html.includes('href="/catalog/malenkie-kuhni"'));
  assert.ok(!html.includes(RETIRED_SMALL_SCENARIO));
});

test("active transition registry has no retired destination or origin", () => {
  assert.ok(getTransitionRegistry().every(item => item.toRoute !== RETIRED_SMALL_SCENARIO && item.fromRoute !== RETIRED_SMALL_SCENARIO));
});

test("sitemap omits retired URL even with static fallbacks", async () => {
  const entries = await sitemap();
  assert.ok(entries.some(item => item.url === "https://kuhni.minsk.by/catalog/malenkie-kuhni"));
  assert.ok(entries.every(item => item.url !== "https://kuhni.minsk.by" + RETIRED_SMALL_SCENARIO));
});
