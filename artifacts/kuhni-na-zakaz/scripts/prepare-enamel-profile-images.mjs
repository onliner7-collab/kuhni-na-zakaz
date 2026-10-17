import fs from 'node:fs/promises';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile('../../docs/seo/materials-comparison/stage-4/profile-fix/image-prompts.json','utf8'));
const root='public/images/mdf-enamel-20261017';const files=[];
for(const item of manifest){await fs.copyFile(item.source,`${root}/${item.name}.png`);await sharp(item.source).resize(1200,800,{fit:'cover'}).webp({quality:82,effort:6}).toFile(`${root}/${item.name}.webp`);files.push({name:item.name,bytes:(await fs.stat(`${root}/${item.name}.webp`)).size});}
await fs.writeFile('../../docs/seo/materials-comparison/stage-4/profile-fix/image-assets.json',JSON.stringify(files,null,2));console.log(files);
