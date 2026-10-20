import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const release='C:/Users/User/Desktop/kuhni-hpl-20261020';
const app='artifacts/kuhni-na-zakaz/';
const files=['app/materials/plastik-hpl/page.tsx','components/materials/HplVisualJourney.tsx','data/hpl-content.ts','components/materials/MaterialsSelection.tsx','lib/material-selection.ts','data/material-hub-gallery.ts','lib/image-disclosure.ts','data/material-solutions.ts','tests/unit/material-selection.test.ts','tests/smoke/hpl-page.spec.ts','playwright.hpl.config.ts','scripts/prepare-hpl-images.mjs'];
for(const file of files){const dst=path.join(release,app,file);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(root,app,file),dst);}
// Keep later production changes on every other material.
const fallback=path.join(release,app,'data/material-fallbacks.ts');
let text=fs.readFileSync(fallback,'utf8');
const hpl=text.indexOf('slug: "plastik-hpl"');
if(hpl<0)throw Error('Missing HPL fallback');
const at=text.indexOf('description: ',hpl), end=text.indexOf('\n',at);
const source=fs.readFileSync(path.join(root,app,'data/material-fallbacks.ts'),'utf8');
const updated=source.slice(source.indexOf('description: ',source.indexOf('slug: "plastik-hpl"'))).split('\n')[0];
text=text.slice(0,at)+updated+text.slice(end);fs.writeFileSync(fallback,text,'utf8');
const sitemap=path.join(release,app,'app/sitemap.ts');text=fs.readFileSync(sitemap,'utf8');
const anchor='  const effectiveLastModified = ';
if(!text.includes(anchor))throw Error('Missing sitemap anchor');
text=text.replace(anchor,anchor+'normalizePath(path) === "/materials/plastik-hpl"\n    ? new Date("2026-10-20T00:00:00.000Z")\n    : ');
fs.writeFileSync(sitemap,text,'utf8');
fs.cpSync(path.join(root,app,'public/images/hpl-20261020'),path.join(release,app,'public/images/hpl-20261020'),{recursive:true});
fs.cpSync(path.join(root,'docs/seo/materials-comparison/stage-5'),path.join(release,'docs/seo/materials-comparison/stage-5'),{recursive:true,filter:(s)=>!s.includes('browser-artifacts')&&!s.endsWith('browser-results.json')&&!s.endsWith('.png')});
for(const name of ['deploy-hpl-20261020.sh','hpl-protected-snapshot.mjs','prepare-hpl-release.mjs'])fs.copyFileSync(path.join(root,'scripts',name),path.join(release,'scripts',name));
console.log('Prepared scoped HPL release on production a0c0ac34; retained other material fallbacks.');
