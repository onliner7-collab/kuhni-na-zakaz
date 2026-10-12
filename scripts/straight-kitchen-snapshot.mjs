import fs from 'node:fs/promises';
const dest = process.argv[2];
if (!dest) throw new Error('Snapshot destination is required');
const sitemapResponse = await fetch('https://kuhni.minsk.by/sitemap.xml');
if (!sitemapResponse.ok) throw new Error(`Sitemap ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const results = [];
for (let index = 0; index < urls.length; index += 6) {
  results.push(...await Promise.all(urls.slice(index, index + 6).map(async url => {
    const response = await fetch(url);
    const html = await response.text();
    return { url, status: response.status, title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1], h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => match[1].replace(/<[^>]*>/g, '')), canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1], robots: html.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/)?.[1], xRobots: response.headers.get('x-robots-tag') };
  })));
}
await fs.mkdir(dest, { recursive: true });
await fs.writeFile(`${dest}/sitemap.xml`, sitemap);
await fs.writeFile(`${dest}/pages.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ urls: urls.length, failures: results.filter(item => item.status !== 200 || item.h1.length !== 1 || !item.canonical), dest }));
