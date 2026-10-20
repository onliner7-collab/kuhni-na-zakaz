import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const project = process.cwd();
const evidence = path.resolve(project, '../../docs/seo/materials-comparison/stage-5');
const manifest = JSON.parse(await fs.readFile(path.join(evidence, 'image-prompts.json'), 'utf8'));
const target = path.join(project, 'public/images/hpl-20261020');
await fs.mkdir(target, {recursive:true});
const records = [];
const thumbs = [];
for (const [index, item] of manifest.entries()) {
  const source = path.join(target, `${item.name}.png`);
  try { await fs.access(source); } catch { await fs.copyFile(item.sourcePath, source, fs.constants.COPYFILE_EXCL); }
  const webp = path.join(target, `${item.name}.webp`);
  await sharp(source).rotate().resize(1200, 800, {fit:'cover'}).webp({quality:80, effort:6}).toFile(webp);
  const mobile = path.join(target, `${item.name}-mobile.webp`);
  await sharp(source).rotate().resize(720, 480, {fit:'cover'}).webp({quality:78, effort:6}).toFile(mobile);
  const metadata = await sharp(webp).metadata();
  records.push({name:item.name, original:item.projectSource, src:item.webp, width:metadata.width, height:metadata.height, bytes:(await fs.stat(webp)).size, mobileBytes:(await fs.stat(mobile)).size});
  thumbs.push({input:await sharp(webp).resize(360,240).toBuffer(),left:(index%2)*360,top:Math.floor(index/2)*240});
}
await sharp({create:{width:720,height:Math.ceil(manifest.length/2)*240,channels:3,background:'#f7f5f2'}}).composite(thumbs).jpeg({quality:85}).toFile(path.join(evidence,'image-contact-sheet.jpg'));
await fs.writeFile(path.join(evidence,'image-assets.json'), JSON.stringify(records,null,2)+'\n','utf8');
console.log(JSON.stringify(records,null,2));
