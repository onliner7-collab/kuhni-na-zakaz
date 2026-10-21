import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const cwd=process.cwd()+'/artifacts/kuhni-na-zakaz';
const run=spawnSync('cmd.exe',['/d','/s','/c','pnpm exec playwright test -c playwright.smoke.config.ts tests/smoke/acrylic-page.spec.ts tests/smoke/materials-legacy-tab.spec.ts --project=desktop --workers=1 --timeout=120000 --reporter=json --output=../../docs/seo/materials-comparison/stage-6/production-browser-artifacts'],{cwd,encoding:'utf8',maxBuffer:16*1024*1024,env:{...process.env,PLAYWRIGHT_BASE_URL:'https://kuhni.minsk.by'}});
let report;
try {const start=run.stdout.indexOf('{');report=JSON.parse(run.stdout.slice(start));}catch {console.error((run.stderr||run.stdout||'No test output').slice(-3000));process.exit(1);}
const evidence={stats:report.stats,suites:report.suites,errors:report.errors};
fs.writeFileSync('docs/seo/materials-comparison/stage-6/production-browser-results.json',JSON.stringify(evidence,null,2)+'\n','utf8');
console.log(JSON.stringify(evidence.stats));
if(run.status!==0){console.error(JSON.stringify(evidence.errors));for(const s of report.suites||[])for(const x of s.specs||[])if(!x.ok)console.error(JSON.stringify(x));process.exit(run.status||1);}
