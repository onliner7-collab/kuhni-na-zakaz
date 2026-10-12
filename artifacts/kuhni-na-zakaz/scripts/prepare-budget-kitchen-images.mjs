import { mkdir, copyFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = "C:/Users/User/.codex/generated_images/01a1315b-d4ae-7662-a2e9-a7c0290b195d";
const destination = path.resolve("public/images/budget-kitchens-20261012");
const files = {
  overview: "exec-941a2f45-9b5f-4580-8499-ba45f4ff31a2.png",
  facades: "exec-279c3c0e-a820-41dc-a8b5-d18cc0f3b556.png",
  worktop: "exec-3e05f6e6-5663-4c25-89c9-03374e150d42.png",
  storage: "exec-fa6aa758-6cfb-4430-8b59-17224864923c.png",
  corner: "exec-a9d574a5-be0c-46d8-9c01-2f6c3af169ef.png",
  rural: "exec-b93d86a1-c313-459d-9575-68107bfab2b9.png",
  wooden: "exec-7fe0c780-3483-4798-a4e3-f93e6c3d7818.png",
  "layout-side": "exec-88de4550-75c7-4e56-a617-c4cfe664d982.png",
  "facade-detail": "exec-e06d8f7d-e118-42b8-a0a0-4d493557d21b.png",
  "worktop-joint": "exec-66720133-b69a-474a-ad53-f22c07b38855.png",
  "storage-side": "exec-0248b298-9389-40e6-b36e-77b068dbf4f1.png",
  "handles-detail": "exec-84e76799-488a-45ed-8219-7d64fdd97937.png",
  "corner-side": "exec-179be122-5311-44f8-9917-1ab152adfa7e.png",
  "upper-side": "exec-d679265f-4b38-435d-ab01-e5332ba2d451.png",
  "rural-side": "exec-a23a3e54-f073-42f8-841f-cbde03615a31.png",
  "wooden-side": "exec-ed8f8ae9-8622-4a5a-a789-cdffb023694c.png",
  "dacha-storage": "exec-d7744bf5-ef1a-4457-ae81-7b5e68d05f7c.png",
};
await mkdir(destination, { recursive: true });
const manifest = [];
for (const [id, filename] of Object.entries(files)) {
  const png = path.join(destination, `${id}.png`);
  const webp = path.join(destination, `${id}.webp`);
  await copyFile(path.join(source, filename), png);
  await sharp(png).resize(1200, 800, { fit: "cover" }).webp({ quality: 78, effort: 6 }).toFile(webp);
  await sharp(png).resize(320, 213, { fit: "cover" }).webp({ quality: 65, effort: 6 }).toFile(path.join(destination, `${id}-thumb.webp`));
  const { size } = await stat(webp);
  if (size > 250 * 1024) throw new Error(`Oversized image: ${id} (${size})`);
  manifest.push({ id, source: `${id}.png`, image: `${id}.webp`, bytes: size, width: 1200, height: 800, provenance: "OpenAI built-in imagegen; design example" });
}
await writeFile(path.join(destination, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(JSON.stringify(manifest, null, 2));
