import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const source=process.cwd(),release='C:/Users/User/Desktop/kuhni-veneer-20261021',app='artifacts/kuhni-na-zakaz/';
const base='d27492037e0986d8e4bd8d8fac21d5b4ee7ae6b6';
if(execFileSync('git',['rev-parse','HEAD'],{cwd:release,encoding:'utf8'}).trim()!==base)throw Error('Unexpected release baseline');
const shared=['components/materials/MaterialsSelection.tsx','lib/material-selection.ts','data/material-hub-gallery.ts','lib/image-disclosure.ts','data/material-solutions.ts','tests/unit/material-selection.test.ts'];
const added=['app/materials/shpon/page.tsx','components/materials/VeneerVisualJourney.tsx','data/veneer-content.ts','tests/smoke/veneer-page.spec.ts'];
for(const file of [...shared,...added]){const dest=path.join(release,app,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(source,app,file),dest);}
const fallback=path.join(release,app,'data/material-fallbacks.ts');let s=fs.readFileSync(fallback,'utf8');
const reference=fs.readFileSync(path.join(source,app,'data/material-fallbacks.ts'),'utf8');
for(const field of ['title','description']){const a=s.indexOf(field+': ',s.indexOf('slug: "shpon"'));const b=reference.indexOf(field+': ',reference.indexOf('slug: "shpon"'));if(a<0||b<0)throw Error('Missing veneer fallback');s=s.slice(0,a)+reference.slice(b,reference.indexOf('\n',b))+s.slice(s.indexOf('\n',a));}
fs.writeFileSync(fallback,s,'utf8');
const sitemap=path.join(release,app,'app/sitemap.ts');s=fs.readFileSync(sitemap,'utf8');const anchor='const effectiveLastModified = normalizePath(path) === "/materials/akril"';
if(!s.includes(anchor))throw Error('Unexpected sitemap baseline');s=s.replace(anchor,'const effectiveLastModified = ["/materials/akril", "/materials/shpon"].includes(normalizePath(path))');fs.writeFileSync(sitemap,s,'utf8');
fs.cpSync(path.join(source,app,'public/images/veneer-20261021'),path.join(release,app,'public/images/veneer-20261021'),{recursive:true});
const docs='docs/seo/materials-comparison';fs.mkdirSync(path.join(release,docs,'stage-7'),{recursive:true});
for(const name of fs.readdirSync(path.join(source,docs,'stage-7')))if(/\.(md|csv|json)$/.test(name))fs.copyFileSync(path.join(source,docs,'stage-7',name),path.join(release,docs,'stage-7',name));
for(const name of ['status.md','architecture.md'])fs.copyFileSync(path.join(source,docs,name),path.join(release,docs,name));
for(const name of ['prepare-veneer-images.mjs','research-veneer-20261021.mjs','prepare-veneer-release.mjs','check-veneer-sources.mjs','verify-veneer.mjs'])fs.copyFileSync(path.join(source,'scripts',name),path.join(release,'scripts',name));
console.log(execFileSync('git',['diff','--stat'],{cwd:release,encoding:'utf8'}));
for(const file of [...shared,'data/material-fallbacks.ts','app/sitemap.ts'])console.log(execFileSync('git',['diff','--',app+file],{cwd:release,encoding:'utf8'}));
