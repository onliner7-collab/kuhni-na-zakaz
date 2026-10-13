import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const release = path.join(root, 'outputs/ceiling-kitchens-20261013/release');
const app = 'artifacts/kuhni-na-zakaz/';
for (const folder of ['components/catalog/ceiling-kitchens', 'public/images/ceiling-kitchens/20261013']) fs.cpSync(path.join(root, app, folder), path.join(release, app, folder), { recursive: true });
for (const file of ['scripts/prepare-ceiling-kitchen-images.mjs', 'tests/smoke/ceiling-kitchens.spec.ts']) { const target = path.join(release, app, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, app, file), target); }
for (const file of ['docs/seo/2026-10-13-kuhni-do-potolka-strategy.md']) fs.copyFileSync(path.join(root, file), path.join(release, file));
function edit(file, before, after) {
  const target = path.join(release, app, file);
  const original = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  if (original.split(before).length !== 2) throw new Error(`Anchor is not unique: ${file}`);
  fs.writeFileSync(target, original.replace(before, after), 'utf8');
}
const route = 'app/catalog/[slug]/page.tsx';
edit(route, 'import { StraightKitchenPage, STRAIGHT_HERO } from "@/components/catalog/straight-kitchens/StraightKitchenPage";', 'import { StraightKitchenPage, STRAIGHT_HERO } from "@/components/catalog/straight-kitchens/StraightKitchenPage";\nimport { CeilingKitchenPage } from "@/components/catalog/ceiling-kitchens/CeilingKitchenPage";\nimport { CEILING_HERO } from "@/components/catalog/ceiling-kitchens/ceiling-data";');
edit(route, 'alt: "Светлая прямая кухня вдоль одной стены" }] } : undefined),', 'alt: "Светлая прямая кухня вдоль одной стены" }] } : slug === "kuhni-do-potolka" ? { images: [{ url: CEILING_HERO, width: 1200, height: 800, alt: "Светлая угловая кухня до потолка с антресолями" }] } : undefined),');
edit(route, 'slug === "pryamye-kuhni" ? STRAIGHT_HERO : undefined),', 'slug === "pryamye-kuhni" ? STRAIGHT_HERO : slug === "kuhni-do-potolka" ? CEILING_HERO : undefined),');
edit(route, '  if (slug === "pryamye-kuhni") {\n    return <StraightKitchenPage />;\n  }', '  if (slug === "pryamye-kuhni") {\n    return <StraightKitchenPage />;\n  }\n  if (slug === "kuhni-do-potolka") return <CeilingKitchenPage />;');
edit('next.config.ts', '"/media/visual-rescue/kuhni-do-potolka/avif/ceiling-overview.avif"', '"/images/ceiling-kitchens/20261013/hero.webp"');
edit('app/sitemap.ts', 'const effectiveLastModified = normalizePath(path) === "/calculator"', 'const effectiveLastModified = normalizePath(path) === "/catalog/kuhni-do-potolka" || normalizePath(path) === "/calculator"');
edit('lib/image-disclosure.ts', 'const GENERATED_IMAGE_PREFIXES = [', 'const GENERATED_IMAGE_PREFIXES = [\n  "/images/ceiling-kitchens/20261013/",');
console.log('Prepared isolated ceiling kitchen release from production 263bf0a');
