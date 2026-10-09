import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {routes} from '../src/templates.mjs';
const origin=process.env.SITE_URL?new URL(process.env.SITE_URL).origin:'';
const indexable=Boolean(origin)&&process.env.VERCEL_ENV!=='preview';
assert(process.env.VERCEL_ENV!=='production'||origin,'Production deployment requires SITE_URL; refusing to publish a noindex site.');
const titles=new Set(),descriptions=new Set();let checked=0;
for(const [route] of routes){
 const html=await readFile(path.join('dist',route,'index.html'),'utf8');
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${route}: exactly one h1`);
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert(title&&!titles.has(title),`${route}: unique title`);titles.add(title);
 const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
 assert(description&&!descriptions.has(description),`${route}: unique description`);descriptions.add(description);
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 assert.equal(canonical,origin?new URL(route,origin).href:undefined,`${route}: canonical matches the configured public origin`);
 assert(html.includes(`name="robots" content="${indexable?'index,follow':'noindex,nofollow'}"`),`${route}: correct indexing policy`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(ids).size,ids.length,`${route}: unique element IDs`);
 assert(!/[—–]/.test(html),`${route}: copy uses plain punctuation`);
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(match[1]);
 const references=[...html.matchAll(/(?:href|src)="([^"<>]+)"/g)].map(([,href])=>href);
 for(const [,set] of html.matchAll(/\bsrcset="([^"<>]+)"/g))references.push(...set.split(',').map(item=>item.trim().split(/\s+/)[0]));
 for(const href of references){
   if(!href.startsWith('/')&&!href.startsWith('#'))continue;
   const [pathname,anchor]=href.split('#');
   const dest=pathname||route;
   const file=path.join('dist',path.extname(dest)?dest:dest+'/index.html');
   await access(file).catch(()=>assert.fail(`${route}: missing internal target ${href}`));
   if(anchor){const target=await readFile(file,'utf8');assert(target.includes(`id="${anchor}"`),`${route}: missing anchor ${href}`);}
   checked++;
 }
 if(html.includes('id="predictor-form"')||html.includes('id="age-form"')){
   assert(/type="submit" disabled/.test(html),`${route}: no-JS submission protected`);
   assert(!/id="(?:birth|target)-date"[^>]*name=/.test(html),`${route}: dates excluded from form submission`);
 }
}
const robots=await readFile('dist/robots.txt','utf8');
if(indexable){
 assert(robots.includes('Allow: /')&&!robots.includes('Disallow: /'), 'Production robots allows crawling.');
 assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`),'Production robots declares the public sitemap.');
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'),'Sitemap has the standard namespace.');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
 assert.deepEqual(urls.sort(),routes.map(([route])=>new URL(route,origin).href).sort(),'Sitemap contains each public route exactly once.');
}else{
 assert(robots.includes('Disallow: /')&&!robots.includes('Sitemap:'),'Preview robots blocks crawling.');
 await assert.rejects(access('dist/sitemap.xml'),{code:'ENOENT'},'Preview must not publish an indexable sitemap.');
}
const notFound=await readFile('dist/404.html','utf8');
assert(notFound.includes('name="robots" content="noindex,nofollow"'),'404 page must not be indexed.');
console.log(`PASS: ${routes.length} pages, unique metadata and IDs, canonical/robots/sitemap policy, structured data, ${checked} internal assets/links, safe form fallback.`);
