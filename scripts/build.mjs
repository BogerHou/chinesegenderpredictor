import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {routes,shell,home} from '../src/templates.mjs';
import {pages} from '../src/pages.mjs';
let origin=process.env.SITE_URL?.replace(/\/$/,'')||'';
if(origin){const u=new URL(origin);if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash)throw Error('SITE_URL must be a bare HTTPS origin.');origin=u.origin;}
const indexable=Boolean(origin)&&process.env.VERCEL_ENV!=='preview';
await fs.rm('dist',{recursive:true,force:true});
await fs.mkdir('dist/assets',{recursive:true});
await fs.cp('public','dist',{recursive:true});
await build({entryPoints:['src/styles.css'],bundle:true,minify:true,outfile:'dist/assets/style.css',external:['/assets/*'],legalComments:'eof'});
await build({entryPoints:['src/client.mjs'],bundle:true,minify:true,outdir:'dist/assets',splitting:true,format:'esm',target:'es2022',legalComments:'eof'});
await fs.writeFile('dist/index.html',shell('/',home(),{origin,indexable}));
for(const [route,render] of Object.entries(pages)){
  const directory=path.join('dist',route);
  await fs.mkdir(directory,{recursive:true});
  await fs.writeFile(path.join(directory,'index.html'),shell(route,render(),{origin,indexable}));
}
await fs.writeFile('dist/404.html',shell('/404/',`<section class="container not-found"><p>Page not found</p><h1>Let’s find your way back.</h1><a class="button primary" href="/">Open predictor</a></section>`,{origin,indexable:false}));
await fs.writeFile('dist/robots.txt',indexable?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(indexable)await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([route])=>`<url><loc>${new URL(route,origin).href}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${routes.length} pages. ${indexable?'Production indexing enabled.':'Preview: noindex (set SITE_URL for production).'}`);
