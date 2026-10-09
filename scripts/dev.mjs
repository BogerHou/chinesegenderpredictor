import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
if (!process.argv.includes('--no-build')) await import('./build.mjs');
const root = path.resolve('dist');
const vercel = JSON.parse(await readFile('vercel.json','utf8'));
const securityHeaders = Object.fromEntries(vercel.headers[0].headers.map(({key,value})=>[key,value]));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    let file = path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if (!file.startsWith(root+path.sep) && file!==root) throw Error();
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    const data = await readFile(file);
    res.writeHead(200,{...securityHeaders,'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  } catch {
    res.writeHead(404,{...securityHeaders,'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(path.join(root,'404.html')).catch(()=> 'Not found'));
  }
});
server.listen(Number(process.env.PORT||4321),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
