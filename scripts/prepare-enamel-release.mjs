import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd();
const base='38680594b376668de9561a5abd8207582a5d42d6';
const release=path.join(root,'outputs/enamel-20261017/release');
if(fs.existsSync(release))throw Error('Release directory already exists; inspect before reusing');
fs.mkdirSync(release,{recursive:true});
const archive=path.join(root,'outputs/enamel-20261017/base.tar');
execFileSync('git',['archive','--format=tar','--output='+archive,base],{cwd:root});
execFileSync('tar',['-xf',archive,'-C',release]);
execFileSync('git',['init'],{cwd:release});
execFileSync('git',['fetch',root,base],{cwd:release});
execFileSync('git',['reset','--mixed',base],{cwd:release});
execFileSync('git',['switch','-c','codex/mdf-enamel-20261017'],{cwd:release});
const app='artifacts/kuhni-na-zakaz/';
const files=['app/materials/mdf-emal/page.tsx','components/materials/EnamelVisualJourney.tsx','data/enamel-content.ts','lib/material-selection.ts','components/materials/MaterialsSelection.tsx','data/material-solutions.ts','data/material-hub-gallery.ts','lib/image-disclosure.ts','tests/unit/material-selection.test.ts','scripts/check-enamel.ts','scripts/prepare-enamel-images.mjs'];
for(const file of files){const dst=path.join(release,app,file);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(root,app,file),dst);}
fs.cpSync(path.join(root,app,'public/images/mdf-enamel-20261017'),path.join(release,app,'public/images/mdf-enamel-20261017'),{recursive:true});
const sitemap=app+'app/sitemap.ts';
const original=execFileSync('git',['show',base+':'+sitemap],{cwd:root,encoding:'utf8'});
const anchor='const effectiveLastModified = normalizePath(path) === "/materials/ldsp"';
if(!original.includes(anchor))throw Error('Unexpected sitemap anchor');
fs.writeFileSync(path.join(release,sitemap),original.replace(anchor,'const effectiveLastModified = ["/materials/ldsp", "/materials/mdf-emal"].includes(normalizePath(path))'),'utf8');
const docs='docs/seo/materials-comparison/stage-4';
fs.mkdirSync(path.join(release,docs),{recursive:true});
for(const entry of fs.readdirSync(path.join(root,docs),{withFileTypes:true}))if(entry.isFile())fs.copyFileSync(path.join(root,docs,entry.name),path.join(release,docs,entry.name));
for(const name of ['11_PAGE_REGISTRY.md','12_COMPONENT_REGISTRY.md','13_MEDIA_REGISTRY.md','14_DECISION_LOG.md','15_HANDOFF.md']){
 const file='docs/'+name;const previous=execFileSync('git',['show',base+':'+file],{cwd:root,encoding:'utf8'});const current=fs.readFileSync(path.join(root,file),'utf8');const start=current.indexOf('## 2026-10-17');const end=current.indexOf('\n## ',start+4);if(start<0||end<0)throw Error('Missing scoped registry section '+name);
 fs.writeFileSync(path.join(release,file),previous.trimEnd()+'\n\n'+current.slice(start,end).trim()+'\n','utf8');
}
for(const name of ['status.md','architecture.md']){
 const file='docs/seo/materials-comparison/'+name;const previous=execFileSync('git',['show',base+':'+file],{cwd:root,encoding:'utf8'});const current=fs.readFileSync(path.join(root,file),'utf8');
 if(name==='status.md'){const row=current.split(/\r?\n/).find(s=>s.startsWith('| 4 |'));if(!row)throw Error('Missing stage 4 status');fs.writeFileSync(path.join(release,file),previous.replace(/^\| 4 \|.*$/m,row),'utf8');}
 else {const start=current.indexOf('## Дополнения этапа 4');const end=current.indexOf('## Дополнения этапа 3');if(start<0||end<0)throw Error('Missing stage 4 architecture');fs.writeFileSync(path.join(release,file),previous.trimEnd()+'\n\n'+current.slice(start,end).trim()+'\n','utf8');}
}
for(const name of ['enamel-semantics.mjs','enamel-protected-snapshot.mjs','deploy-enamel-20261017.sh','prepare-enamel-release.mjs']){fs.copyFileSync(path.join(root,'scripts',name),path.join(release,'scripts',name));}
execFileSync('git',['remote','add','origin','https://github.com/onliner7-collab/kuhni-na-zakaz.git'],{cwd:release});
console.log('Scoped release: '+release);
