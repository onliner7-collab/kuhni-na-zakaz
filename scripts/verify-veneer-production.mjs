import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
const cwd=path.resolve('artifacts/kuhni-na-zakaz');
const child=spawn(process.execPath,[path.join(cwd,'node_modules/@playwright/test/cli.js'),'test','-c','playwright.smoke.config.ts','tests/smoke/veneer-page.spec.ts','tests/smoke/materials-legacy-tab.spec.ts','--project=desktop','--workers=1','--timeout=120000','--reporter=json','--output=../../docs/seo/materials-comparison/stage-7/production-browser-artifacts'],{cwd,env:{...process.env,PLAYWRIGHT_BASE_URL:'https://kuhni.minsk.by'},stdio:['ignore','pipe','pipe']});
let stdout='',stderr='';child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);const code=await new Promise(r=>child.on('close',r));
try{const report=JSON.parse(stdout);const evidence={stats:report.stats,suites:report.suites,errors:report.errors};await fs.writeFile('docs/seo/materials-comparison/stage-7/production-browser-results.json',JSON.stringify(evidence,null,2),'utf8');console.log(evidence.stats);for(const suite of report.suites||[])for(const spec of suite.specs||[])if(!spec.ok)console.log(JSON.stringify(spec));}catch{console.log(stderr.slice(-2500));console.log(stdout.slice(-2500));}process.exitCode=Number(code)||0;
