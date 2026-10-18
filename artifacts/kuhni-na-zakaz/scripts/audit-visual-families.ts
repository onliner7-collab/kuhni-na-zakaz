import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { STYLE_FAMILY, SCENARIO_FAMILY } from '../data/exploration-families';
import { locationVisualSeries } from '../data/location-visual-series';
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
 console.log('Variants',rows.length);
}
main();
