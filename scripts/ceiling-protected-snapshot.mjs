import https from 'node:https';
import fs from 'node:fs/promises';
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Pass before or after');
const paths = ['/', '/locations/borisov', '/locations/minsk', '/locations/minskaya-oblast', '/design-proekt-kuhni', '/materials/furnitura'];
function fetchPublic(route) {
  return new Promise((resolve, reject) => {
    const req = https.get({ hostname: 'kuhni.minsk.by', servername: 'kuhni.minsk.by', path: route, lookup: (_name, options, callback) => options.all ? callback(null, [{ address: '5.42.108.140', family: 4 }]) : callback(null, '5.42.108.140', 4), timeout: 20000 }, response => { let body = ''; response.setEncoding('utf8'); response.on('data', chunk => body += chunk); response.on('end', () => resolve({ status: response.statusCode, body })); });
    req.on('timeout', () => req.destroy(new Error('HTTP timeout'))); req.on('error', reject);
  });
}
const result = [];
for (const route of paths) {
  const { status, body } = await fetchPublic(route);
  if (status !== 200) throw new Error(`${route}: ${status}`);
  const title = body.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '');
  const canonical = body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  result.push({ route, status, title, h1, canonical });
}
await fs.mkdir('outputs/ceiling-kitchens-20261013', { recursive: true });
await fs.writeFile(`outputs/ceiling-kitchens-20261013/protected-${phase}.json`, JSON.stringify(result, null, 2), 'utf8');
if (phase === 'after') {
  const previous = JSON.parse(await fs.readFile('outputs/ceiling-kitchens-20261013/protected-before.json', 'utf8'));
  if (JSON.stringify(previous) !== JSON.stringify(result)) throw new Error('Protected page metadata or H1 changed');
}
console.log(`Protected ${phase}: ${result.length} pages PASS`);
