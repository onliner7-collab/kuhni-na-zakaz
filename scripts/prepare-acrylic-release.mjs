import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), release='C:/Users/User/Desktop/kuhni-acrylic-20261021',app='artifacts/kuhni-na-zakaz/';
const base='39d84165bf9df533d336ce4bbed4a0a25020aa55';
if(execFileSync('git',['rev-parse','HEAD'],{cwd:release,encoding:'utf8'}).trim()!==base)throw Error('Unexpected baseline');
const shared=['components/materials/MaterialsSelection.tsx','lib/material-selection.ts','data/material-hub-gallery.ts','lib/image-disclosure.ts','data/material-solutions.ts','tests/unit/material-selection.test.ts'];
for(const file of shared){
  const from=path.join(root,app,file),dst=path.join(release,app,file);
  const original=fs.readFileSync(dst,'utf8'),updated=fs.readFileSync(from,'utf8');
  fs.writeFileSync(dst,updated,'utf8');
  console.log('\nREVIEW '+file);
  console.log(execFileSync('git',['diff','--',app+file],{cwd:release,encoding:'utf8'}));
}
for(const file of ['app/materials/akril/page.tsx','components/materials/AcrylicVisualJourney.tsx','data/acrylic-content.ts','tests/smoke/acrylic-page.spec.ts','scripts/prepare-acrylic-images.mjs']){const dst=path.join(release,app,file);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(root,app,file),dst);}
const fallback=path.join(release,app,'data/material-fallbacks.ts');let text=fs.readFileSync(fallback,'utf8');
const source=fs.readFileSync(path.join(root,app,'data/material-fallbacks.ts'),'utf8');
for(const field of ['description','intro']){const start=text.indexOf(field+': ',text.indexOf('slug: "akril"')),end=text.indexOf('\n',start);const s=source.indexOf(field+': ',source.indexOf('slug: "akril"'));if(start<0||s<0)throw Error('Missing acrylic fallback field');text=text.slice(0,start)+source.slice(s,source.indexOf('\n',s))+text.slice(end);}
fs.writeFileSync(fallback,text,'utf8');
const sitemap=path.join(release,app,'app/sitemap.ts');text=fs.readFileSync(sitemap,'utf8');
const anchor='  const effectiveLastModified = ';if(!text.includes(anchor))throw Error('Missing sitemap anchor');
text=text.replace(anchor,anchor+'normalizePath(path) === "/materials/akril"\n    ? new Date("2026-10-21T00:00:00.000Z")\n    : ');fs.writeFileSync(sitemap,text,'utf8');
fs.cpSync(path.join(root,app,'public/images/acrylic-20261021'),path.join(release,app,'public/images/acrylic-20261021'),{recursive:true});
const docs=path.join(release,'docs/seo/materials-comparison/stage-6');fs.mkdirSync(docs,{recursive:true});
for(const file of fs.readdirSync(path.join(root,'docs/seo/materials-comparison/stage-6'))){if(/\.(md|csv|json)$/.test(file))fs.copyFileSync(path.join(root,'docs/seo/materials-comparison/stage-6',file),path.join(docs,file));}
console.log('\nRelease prepared; review shared diffs before commit.');
