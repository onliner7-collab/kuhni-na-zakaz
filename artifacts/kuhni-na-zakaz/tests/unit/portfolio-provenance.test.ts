import test from "node:test";
import assert from "node:assert/strict";
import { GENERATED_MINSK_PORTFOLIO_CASES, toPortfolioProject, withoutPortfolioGeography } from "@/data/portfolio-projects";
import { PORTFOLIO_EVIDENCE } from "@/data/portfolio-evidence";

test("all seven generated examples lose unverified geography, amounts and completion claims", () => {
  for (const source of GENERATED_MINSK_PORTFOLIO_CASES) {
    const project = toPortfolioProject(source);
    assert.equal(project.provenance, "ai_concept");
    assert.equal(project.city, "");
    assert.equal(project.cityKey, "");
    assert.equal(project.district, "");
    assert.equal(project.price, "");
    assert.equal(project.priceFrom, 0);
    assert.equal(project.workDuration, "");
    assert.equal(project.size, "");
    assert.deepEqual(project.relatedLocationSlugs, []);
    assert.doesNotMatch([project.title, project.shortTitle, project.description, project.alt, ...project.images.flatMap(image => [image.alt, image.caption])].join(" "), /минск|первомайск|центральн|3D|Japandi/i);
    assert.match(project.alt, /^ИИ-иллюстрация:/);
  }
});

test("a published record and portfolio file path cannot establish a real installation", () => {
  const source = { ...GENERATED_MINSK_PORTFOLIO_CASES[0], slug: "imported-test", mainImage: "/uploads/kitchens/portfolio/photo.webp", images: ["/uploads/kitchens/portfolio/photo.webp"], color: "belaya" };
  const project = toPortfolioProject(source);
  assert.equal(project.provenance, "unverified");
  assert.match(project.provenanceLabel, /не подтверждён/);
  assert.equal(project.color, "Белая");
  assert.equal(project.city, "");
  assert.equal(project.price, "");
  assert.match(project.images[0].alt, /^Идея кухни:/);
});

test("geographical claims are removed without changing slugs", () => {
  for (const city of ["Минске", "Минск", "Гомеле", "Бресте", "Гродно", "Витебске", "Могилёве"]) {
    assert.equal(withoutPortfolioGeography(`Кухня в ${city}`), "Кухня");
  }
  const source = GENERATED_MINSK_PORTFOLIO_CASES[0];
  assert.equal(toPortfolioProject(source).slug, source.slug);
});

test("unverified or reversed source price ranges never become offers", () => {
  const source = GENERATED_MINSK_PORTFOLIO_CASES[0];
  for (const [priceFrom, priceTo] of [[3900, 5600], [9000, 1000], [-10, 0], [NaN, Infinity]]) {
    const project = toPortfolioProject({ ...source, priceFrom, priceTo });
    assert.equal(project.price, "");
    assert.equal(project.priceFrom, 0);
    assert.match(project.priceNote, /индивидуальной смете/);
  }
});

test("publication projection does not mutate source values needed for rollback", () => {
  const source = GENERATED_MINSK_PORTFOLIO_CASES[0];
  const before = JSON.stringify(source);
  toPortfolioProject(source);
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.keys(PORTFOLIO_EVIDENCE).length, 0);
});
