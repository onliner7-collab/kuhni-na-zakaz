import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=path.resolve('public/images/mdf-enamel-20261017');
const manifest=JSON.parse(await fs.readFile('../../docs/seo/materials-comparison/stage-4/image-prompts.json','utf8'));
await fs.mkdir(root,{recursive:true});
const result=[];
for(const item of manifest){
 if(item.source==='pending')throw Error('Image not ready: '+item.name);
 const source=path.join(root,item.name+'.png');
 await fs.copyFile(item.source,source);
 const output=path.join(root,item.name+'.webp');
 await sharp(source).resize(1200,800,{fit:'cover'}).webp({quality:80,effort:6}).toFile(output);
 const stat=await fs.stat(output);const meta=await sharp(output).metadata();
 result.push({name:item.name,source:source,output,width:meta.width,height:meta.height,bytes:stat.size});
}
await fs.writeFile('../../docs/seo/materials-comparison/stage-4/image-assets.json',JSON.stringify(result,null,2),'utf8');
console.log(JSON.stringify(result.map(({name,bytes})=>({name,bytes})),null,2));
