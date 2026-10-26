import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { MATERIAL_ROUTES, MATERIAL_SOLUTIONS, MATERIAL_PRICE_SCENARIOS } from '../data/material-solutions';
import { MATERIAL_MARKET_OFFERS, MATERIAL_RESEARCH_DATE } from '../data/material-pricing';
const base='http://127.0.0.1:3046';
const out=path.resolve('../../docs/seo/materials-comparison/finalization-2026-10-26');
async function main(){
 const html=new Map<string,string>();const covers=[];
 for(const route of MATERIAL_ROUTES){
  const response=await fetch(base+route);assert.equal(response.status,200);const body=await response.text();html.set(route,body);
  assert.ok(body.includes(`dateTime="${MATERIAL_RESEARCH_DATE}"`)||body.includes(`datetime="${MATERIAL_RESEARCH_DATE}"`));
  const og=body.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]?.replaceAll('&amp;','&');
  if(og){const url=new URL(og,'https://kuhni.minsk.by');assert.equal(url.hostname,'kuhni.minsk.by');const image=await fetch(base+url.pathname+url.search);assert.equal(image.status,200,route+' social cover');assert.ok(image.headers.get('content-type')?.startsWith('image/'));covers.push({route,path:url.pathname+url.search,status:image.status,contentType:image.headers.get('content-type')});}
 }
 const hub=html.get('/materials')!;const checked=[];
 for(const offer of MATERIAL_MARKET_OFFERS.filter(o=>o.publicExample&&o.materialConfirmed)){
  const detail=MATERIAL_SOLUTIONS.find(m=>m.id===offer.materialId)!.href.split('#')[0];
  const regex=new RegExp('<article[^>]*data-offer-id="'+offer.id+'"[^>]*>([\\s\\S]*?)</article>');
  const a=hub.match(regex)?.[1],b=html.get(detail)!.match(regex)?.[1];assert.ok(a,offer.id);assert.equal(a,b,offer.id+' identical price/composition/source');checked.push(offer.id);
 }
 for(const m of MATERIAL_SOLUTIONS)for(const scenario of MATERIAL_PRICE_SCENARIOS){
  const token=`data-price-status="${m.id}:${scenario.id}"`;
  assert.ok(hub.includes(token));assert.ok(html.get(m.href.split('#')[0])!.includes(token));
 }
 const result={checkedAt:new Date().toISOString(),identicalExamples:checked,scenarioStatuses:12,covers,allPassed:true};
 fs.writeFileSync(path.join(out,'consistency-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({identicalExamples:checked.length,scenarioStatuses:12,covers:covers.length,passed:true}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
