import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "../../middleware";

test("public watermarked images keep the route's indexing policy", async () => {
  const response = await middleware(new NextRequest("https://kuhni.minsk.by/kapi/watermarked-image?src=/images/blog/generated-guides/custom-vs-ready-cover.webp&w=800"));
  assert.equal(response.headers.get("X-Robots-Tag"), null);
});

test("API routes and nested image paths retain noindex", async () => {
  for (const path of ["/kapi/leads", "/kapi/watermarked-image/private", "/api/test", "/admin/login"]) {
    const response = await middleware(new NextRequest(`https://kuhni.minsk.by${path}`));
    assert.match(response.headers.get("X-Robots-Tag") || "", /noindex/);
  }
});

test("public pages stay indexable and selection variants stay excluded", async () => {
  const clean = await middleware(new NextRequest("https://kuhni.minsk.by/catalog/malenkie-kuhni"));
  assert.equal(clean.headers.get("X-Robots-Tag"), null);
  const selected = await middleware(new NextRequest("https://kuhni.minsk.by/?sourceType=home_3d_ideas"));
  assert.equal(selected.headers.get("X-Robots-Tag"), "noindex, follow, noarchive");
});
