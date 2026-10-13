import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const sources = JSON.parse(await fs.readFile('../../docs/seo/2026-10-13-budget-image-sources.json', 'utf8'));
const destination = path.resolve('public/images/budget-kitchens-20261013');
await fs.mkdir(destination, { recursive: true });
const manifest = [];
for (const [id, source] of Object.entries(sources)) {
  const png = path.join(destination, `${id}.png`);
  await fs.copyFile(source, png);
  const image = path.join(destination, `${id}.webp`);
  await sharp(png).resize(1200, 800, { fit: 'cover' }).webp({ quality: 78, effort: 6 }).toFile(image);
  await sharp(png).resize(320, 213, { fit: 'cover' }).webp({ quality: 65, effort: 6 }).toFile(path.join(destination, `${id}-thumb.webp`));
  for (const width of [480, 800]) await sharp(png).resize(width, Math.round(width * 2 / 3), { fit: 'cover' }).webp({ quality: 74, effort: 6 }).toFile(path.join(destination, `${id}-${width}.webp`));
  const { size } = await fs.stat(image);
  if (size > 250 * 1024) throw Error(`Oversized: ${id}`);
  manifest.push({ id, source: `${id}.png`, image: `${id}.webp`, bytes: size, width: 1200, height: 800, provenance: 'OpenAI built-in imagegen; design example' });
}
await fs.writeFile(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log({ images: manifest.length, totalBytes: manifest.reduce((sum, item) => sum + item.bytes, 0) });
