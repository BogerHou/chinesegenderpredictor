// Read-only production acceptance check. No browser interaction.
// Usage: node scripts/verify-live.mjs https://chinesegenderpredictor.net
// For the Vercel hostname before custom-domain readiness, add --skip-host-redirects.
import { readFile, readdir } from 'node:fs/promises';
import { routes } from '../src/templates.mjs';

const argv = process.argv.slice(2);
const base = new URL(argv.find(arg => !arg.startsWith('--')) || 'https://chinesegenderpredictor.net');
const canonicalOrigin = 'https://chinesegenderpredictor.net';
const checks = [];
const report = (name, pass, details) => checks.push({name, pass: Boolean(pass), ...details});
const expectedHeaders = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8')).headers[0].headers;
const request = async (url, redirect = 'follow') => {
  const response = await fetch(url, {redirect, signal: AbortSignal.timeout(20000)});
  const body = await response.text();
  return {response, body};
};
async function inspect(name, action) {
  try { await action(); }
  catch (error) { report(name, false, {error: error.cause?.code || error.message}); }
}
function headersFor(response, name) {
  const absent = expectedHeaders.filter(({key, value}) => response.headers.get(key) !== value).map(({key}) => key);
  report(`${name} security headers`, absent.length === 0, {missingOrDifferent: absent});
}

await Promise.all(routes.map(([path]) => inspect(path, async () => {
  const {response, body} = await request(new URL(path, base));
  const canonical = body.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  const robots = body.match(/<meta\s+name="robots"\s+content="([^"]+)"/)?.[1];
  const headerRobots = response.headers.get('x-robots-tag') || '';
  const jsonLd = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  let validJsonLd = jsonLd.length > 0;
  try { jsonLd.forEach(([, json]) => JSON.parse(json)); } catch { validJsonLd = false; }
  report(path, response.status === 200 && canonical === canonicalOrigin + path && robots === 'index,follow' && !/noindex|none/i.test(headerRobots) && validJsonLd && [...body.matchAll(/<h1\b/g)].length === 1, {
    status: response.status, canonical, robots, headerRobots, validJsonLd
  });
  if (path === '/') headersFor(response, 'Homepage');
})));

await Promise.all([
  inspect('robots.txt', async () => {
    const {response, body} = await request(new URL('/robots.txt', base));
    report('robots.txt', response.status === 200 && !/^Disallow:\s*\/\s*$/mi.test(body) && body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), {status: response.status, body: body.trim()});
  }),
  inspect('sitemap.xml', async () => {
    const {response, body} = await request(new URL('/sitemap.xml', base));
    const urls = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url).sort();
    const expected = routes.map(([path]) => canonicalOrigin + path).sort();
    report('sitemap.xml', response.status === 200 && JSON.stringify(urls) === JSON.stringify(expected), {status: response.status, count: urls.length, urls});
  }),
  inspect('404', async () => {
    const {response, body} = await request(new URL('/__launch-check-not-a-page__/', base));
    const robots = body.match(/<meta\s+name="robots"\s+content="([^"]+)"/)?.[1];
    report('404', response.status === 404 && robots?.includes('noindex') && body.includes('Let’s find your way back.'), {status: response.status, robots});
    headersFor(response, '404');
  })
]);

const pdfs=(await readdir(new URL('../dist/downloads/',import.meta.url))).filter(file=>file.endsWith('.pdf')).map(file=>'/downloads/'+file);
const assets = ['/favicon.svg', '/third-party-notices.txt', ...pdfs, ...(await readdir(new URL('../dist/assets/', import.meta.url))).map(file => '/assets/' + file)];
const failedAssets = [];
await Promise.all(assets.map(path => inspect(path, async () => {
  const response = await fetch(new URL(path, base), {signal: AbortSignal.timeout(20000)});
  const data = await response.arrayBuffer();
  const type = response.headers.get('content-type') || '';
  const isPdf = path.endsWith('.pdf');
  const pass = response.status === 200 && data.byteLength > 0 && !type.includes('text/html') && (!isPdf || (type.includes('application/pdf') && new TextDecoder().decode(data.slice(0,5)) === '%PDF-'));
  if (!pass) failedAssets.push({path, status: response.status, type, bytes: data.byteLength});
})));
report('Static assets', failedAssets.length === 0, {checked: assets.length, failed: failedAssets});

async function redirectCheck(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    const response = await fetch(current, {redirect: 'manual', signal: AbortSignal.timeout(20000)});
    const location = response.headers.get('location');
    chain.push({url: current, status: response.status, location});
    await response.body?.cancel();
    if (response.status >= 300 && response.status < 400 && location) current = new URL(location, current).href;
    else break;
  }
  report(`Redirect ${url}`, chain.length > 1 && chain[0].status >= 300 && chain[0].status < 400 && chain.at(-1).url === canonicalOrigin + '/' && chain.at(-1).status === 200, {chain});
}
if (!argv.includes('--skip-host-redirects')) {
  await Promise.all(['http://chinesegenderpredictor.net/', 'https://www.chinesegenderpredictor.net/'].map(url => inspect(url, () => redirectCheck(url))));
}

await inspect('Removed Vercel project alias',async()=>{const {response}=await request('https://chinesegenderpredictor.vercel.app/');report('Removed Vercel project alias',response.status===404,{status:response.status});});

for (const check of checks) console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}: ${JSON.stringify(Object.fromEntries(Object.entries(check).filter(([key]) => !['name','pass'].includes(key))))}`);
const failed = checks.filter(check => !check.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed for ${base.origin}.`);
if (failed.length) process.exitCode = 1;
