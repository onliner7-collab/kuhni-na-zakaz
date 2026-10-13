import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public');
const destination = path.join(root, 'images/ceiling-kitchens/20261013');
await fs.mkdir(destination, { recursive: true });
const generated = 'C:/Users/User/.codex/generated_images/01a13649-4e28-7e93-8fbe-4833f5ac5363';
const images = [
  ['hero', 'exec-3a83bd13-5ac4-4882-a726-53b43405f75b.png'],
  ['straight', 'exec-e4b09fae-2deb-4d72-a5ff-02aa7d94aa7a.png'],
  ['compact', 'exec-b5e21370-d14d-4ebf-bc8e-4a7b51660c12.png'],
  ['handleless', 'exec-d71c7d36-d7bd-472e-9244-41791c62826f.png'],
  ['wood', 'exec-ff738d92-5fc5-467b-8ec3-5c81c4c48ba3.png'],
  ['warm', 'exec-b112c2e6-511c-4940-a0c0-302ba933c07c.png'],
  ['small', 'exec-2d9e0e9c-620f-4d5d-b0c8-262183e29412.png'],
  ['house', 'exec-d730f49a-0d3c-4434-be90-34e614338436.png'],
  ['dacha', 'exec-07237f24-05df-43ae-b00b-bec5ed71e52d.png'],
  ['ceiling-overview', 'exec-e4b09fae-2deb-4d72-a5ff-02aa7d94aa7a.png'],
  ['ceiling-daily-zone', 'exec-c7fc3899-cc54-4cad-b876-d81b89cb2b9e.png'],
  ['ceiling-upper-tier', 'exec-933263b0-1241-48c1-b2e5-854e434ecbb6.png'],
  ['ceiling-seasonal', 'exec-8d1b9992-ac8c-46bd-9b28-7221090fdff0.png'],
  ['ceiling-access', 'exec-97270a8a-c61f-4286-970d-c907f99b0938.png'],
  ['ceiling-technical-gap', 'exec-2500509e-fb82-494d-adb8-211d740433d9.png'],
].map(([name, file]) => [name, path.join(generated, file)]);
const manifest = [];
for (const [name, source] of images) {
  await fs.copyFile(source, path.join(destination, `${name}-source.png`));
  const output = path.join(destination, `${name}.webp`);
  await sharp(source).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(output);
  if (name.startsWith('ceiling-')) await sharp(source).resize({ width: 1200, withoutEnlargement: true }).avif({ quality: 55, effort: 4 }).toFile(path.join(destination, `${name}.avif`));
  const info = await sharp(output).metadata();
  manifest.push({ name, source, src: `/images/ceiling-kitchens/20261013/${name}.webp`, width: info.width, height: info.height, bytes: (await fs.stat(output)).size, provenance: 'New Codex built-in imagegen for this page, 2026-10-13; design visualization' });
}
await fs.writeFile(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(manifest.map(({ name, bytes }) => `${name}: ${Math.round(bytes / 1024)} KB`).join('\n'));
