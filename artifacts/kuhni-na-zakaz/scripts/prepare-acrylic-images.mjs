import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const report = path.resolve('../../docs/seo/materials-comparison/stage-6');
const {images} = JSON.parse(await fs.readFile(path.join(report,'image-prompts.json'),'utf8'));
const root = path.resolve('public/images/acrylic-20261021');
await fs.mkdir(root,{recursive:true});
const assets=[];
for (const image of images) {
  const source = path.join(root,image.name+'.png');
  try { await fs.access(source); } catch { await fs.copyFile(image.source,source); }
  for (const [suffix,width,height] of [['',1200,800],['-mobile',720,480]]) {
    const target=path.join(root,image.name+suffix+'.webp');
    await sharp(source).resize(width,height,{fit:'cover'}).webp({quality:80,effort:5}).toFile(target);
    assets.push({file:target,width,height,bytes:(await fs.stat(target)).size,provenance:'imagegen',status:'visual-only'});
  }
}
await fs.writeFile(path.join(report,'image-assets.json'),JSON.stringify(assets,null,2)+'\n','utf8');
console.log(JSON.stringify({images:images.length,webp:assets.length,maxBytes:Math.max(...assets.map(x=>x.bytes)),totalBytes:assets.reduce((n,x)=>n+x.bytes,0)}));
