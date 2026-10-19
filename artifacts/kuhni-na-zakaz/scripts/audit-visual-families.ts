import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { STYLE_FAMILY, SCENARIO_FAMILY } from '../data/exploration-families';
import { locationVisualSeries } from '../data/location-visual-series';
import { MATERIAL_PHOTOS } from '../data/material-hub-gallery';
import { catalogModels } from '../data/catalog-showcase';
import { priceExamples, exampleImage } from '../data/prices-showcase';
const output = 'C:/Users/User/Desktop/kuhni-na-zakaz/outputs/site-visual-20261018';
async function main() {
 const rows: unknown[] = [];
 for (const [family, configs] of Object.entries({styles: STYLE_FAMILY, scenarios: SCENARIO_FAMILY})) {
  for (const [slug, config] of Object.entries(configs)) {
   const frames = config.visualFrames || [];
   const tiles: sharp.OverlayOptions[] = [];
   for (const [index, frame] of frames.entries()) {
    const file=path.join('public',frame.webp);const exists=fs.existsSync(file);
    rows.push({route:`/${family}/${slug}`,id:frame.id,label:frame.label,alt:frame.alt,caption:frame.caption,result:frame.result,webp:frame.webp,exists,hash:exists?crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null});
    if (!exists) continue;
    const thumb=await sharp(file).resize(400,267,{fit:'inside',background:'#eee'}).extend({bottom:38,background:'#ffffff'}).png().toBuffer();
    tiles.push({input:thumb,left:(index%3)*400,top:Math.floor(index/3)*305});
   }
   if(tiles.length) await sharp({create:{width:1200,height:Math.ceil(frames.length/3)*305,channels:3,background:'#ddd'}}).composite(tiles).jpeg({quality:85}).toFile(path.join(output,`${family}-${slug}.jpg`));
  }
 }
 fs.writeFileSync(path.join(output,'family-variants.json'),JSON.stringify(rows,null,2));
 const locationRows: unknown[] = [];
 for (const config of locationVisualSeries) {
  const tiles: sharp.OverlayOptions[] = [];
  for (const [index, frame] of config.states.entries()) {
   const file=path.join('public',frame.image);const exists=fs.existsSync(file);
   locationRows.push({route:config.route,id:frame.id,label:frame.controlLabelRu,alt:frame.altRu,result:frame.consequenceRu,webp:frame.image,exists,hash:exists?crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null});
   if(!exists)continue;
   tiles.push({input:await sharp(file).resize(400,267,{fit:'contain',background:'#eee'}).png().toBuffer(),left:index%2*400,top:Math.floor(index/2)*267});
  }
  if(tiles.length)await sharp({create:{width:800,height:Math.ceil(config.states.length/2)*267,channels:3,background:'#ddd'}}).composite(tiles).jpeg({quality:80}).toFile(path.join(output,`series-${config.route.split('/').pop()}.jpg`));
 }
 fs.writeFileSync(path.join(output,'location-variants.json'),JSON.stringify(locationRows,null,2));
 fs.writeFileSync(path.join(output,'material-gallery-variants.json'),JSON.stringify(MATERIAL_PHOTOS,null,2));
 const modelGroups = {
  catalog: catalogModels.map(m=>({id:m.id,name:m.name,images:m.images})),
  prices: priceExamples.map(m=>({id:m.id,name:m.name,images:[0,1,2,3].map(v=>exampleImage(m,v))})),
 };
 fs.writeFileSync(path.join(output,'model-gallery-variants.json'),JSON.stringify(modelGroups,null,2));
 for(const [family,models] of Object.entries(modelGroups)){
  for(let start=0;start<models.length;start+=4){
   const tiles: sharp.OverlayOptions[]=[];
   for(let row=start;row<Math.min(start+4,models.length);row++){
    const model=models[row];
    for(const [col,src] of model.images.entries()){
     const file=path.join('public',src);if(!fs.existsSync(file))throw new Error(`Нет файла: ${src}`);
     tiles.push({input:await sharp(file).resize(280,187,{fit:'contain',background:'#eee'}).png().toBuffer(),left:col*280,top:(row-start)*215});
    }
    const label=Buffer.from(`<svg width="1400" height="28"><rect width="100%" height="100%" fill="white"/><text x="8" y="19" font-family="Arial" font-size="13">${model.id}: ${model.name.replaceAll('&','&amp;').replaceAll('<','&lt;')}</text></svg>`);
    tiles.push({input:label,left:0,top:(row-start)*215+187});
   }
   await sharp({create:{width:1400,height:Math.min(4,models.length-start)*215,channels:3,background:'#ddd'}}).composite(tiles).jpeg({quality:83}).toFile(path.join(output,`${family}-galleries-${start/4}.jpg`));
  }
 }
 for(let start=0;start<MATERIAL_PHOTOS.length;start+=12){
  const tiles: sharp.OverlayOptions[]=[];
  for(let i=start;i<Math.min(start+12,MATERIAL_PHOTOS.length);i++){
   const photo=MATERIAL_PHOTOS[i],file=path.join('public',photo.src);if(!fs.existsSync(file))continue;
   const n=i-start;
   tiles.push({input:await sharp(file).resize(360,240,{fit:'contain',background:'#eee'}).png().toBuffer(),left:n%3*360,top:Math.floor(n/3)*240});
  }
  if(tiles.length)await sharp({create:{width:1080,height:Math.ceil(Math.min(12,MATERIAL_PHOTOS.length-start)/3)*240,channels:3,background:'#ddd'}}).composite(tiles).jpeg({quality:80}).toFile(path.join(output,`material-gallery-${start/12}.jpg`));
 }
 console.log('Variants',rows.length);
}
main();
