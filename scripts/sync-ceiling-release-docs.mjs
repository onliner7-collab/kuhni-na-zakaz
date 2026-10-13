import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const release = path.join(root, 'outputs/ceiling-kitchens-20261013/release');
for (const file of ['docs/seo/2026-10-13-kuhni-do-potolka-implementation.md', 'scripts/prepare-ceiling-release.mjs', 'scripts/deploy-ceiling-kitchens-20261013.sh', 'scripts/ceiling-protected-snapshot.mjs', 'scripts/sync-ceiling-release-docs.mjs']) { fs.mkdirSync(path.dirname(path.join(release, file)), { recursive: true }); fs.copyFileSync(path.join(root, file), path.join(release, file)); }
for (const file of ['docs/11_PAGE_REGISTRY.md', 'docs/12_COMPONENT_REGISTRY.md', 'docs/13_MEDIA_REGISTRY.md', 'docs/14_DECISION_LOG.md', 'docs/15_HANDOFF.md']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
  const first = source.indexOf('## 2026-10-13');
  const end = source.indexOf('\n## ', first + 3);
  const section = source.slice(first, end < 0 ? undefined : end).trim();
  if (first < 0) throw new Error(`Missing new registry section: ${file}`);
  const target = path.join(release, file);
  const original = fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n');
  if (!original.includes(section)) {
    const headerEnd = original.indexOf('\n');
    fs.writeFileSync(target, original.slice(0, headerEnd) + '\n\n' + section + '\n' + original.slice(headerEnd), 'utf8');
  }
}
console.log('Synced only new ceiling kitchen report and registry sections');
