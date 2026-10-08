import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {routes} from '../src/templates.mjs';
const titles=new Set();let checked=0;
for(const [route] of routes){
 const html=await readFile(path.join('dist',route,'index.html'),'utf8');
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${route}: exactly one h1`);
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert(title&&!titles.has(title),`${route}: unique title`);titles.add(title);
 assert(html.includes('name="description"'),`${route}: description`);
 assert(!/[—–]/.test(html),`${route}: copy uses plain punctuation`);
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(match[1]);
 for(const [,href] of html.matchAll(/(?:href|src)="([^"<>]+)"/g)){
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
console.log(`PASS: ${routes.length} pages, unique metadata, structured data, ${checked} internal assets/links, safe form fallback.`);
