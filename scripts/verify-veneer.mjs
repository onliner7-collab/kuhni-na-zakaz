import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const root='artifacts/kuhni-na-zakaz';
const args=process.argv.slice(2);
const child=spawn(process.execPath,[path.resolve(root,'node_modules/@playwright/test/cli.js'),'test','-c','playwright.smoke.config.ts',...args,'--workers=1','--reporter=json','--output=../../docs/seo/materials-comparison/stage-7/test-results'],{cwd:root,env:{...process.env,PORT:'3038',PLAYWRIGHT_BASE_URL:'http://127.0.0.1:3038'},stdio:['ignore','pipe','pipe']});
let stdout='',stderr='';child.stdout.on('data',d=>stdout+=d);child.stderr.on('data',d=>stderr+=d);
const code=await new Promise(resolve=>child.on('close',resolve));
try{
 const report=JSON.parse(stdout); delete report.config;
 const file='docs/seo/materials-comparison/stage-7/'+(args.includes('--project=mobile')?'mobile':'desktop')+'-qa.json';
 await fs.writeFile(file,JSON.stringify(report,null,2),'utf8');
 console.log(JSON.stringify({code,stats:report.stats,errors:report.errors,file}));
 const failures=[];const visit=s=>{for(const x of s.specs||[])for(const t of x.tests||[])for(const r of t.results||[])if(r.status!=='passed')failures.push({test:x.title,status:r.status,errors:r.errors});for(const x of s.suites||[])visit(x);};visit(report);if(failures.length)console.log(JSON.stringify(failures));
}catch{console.log(stderr.slice(-1600));console.log(stdout.slice(-1600));}
process.exitCode=Number(code)||0;
