/**
 * Minimal static server for built output (tests and screenshots), independent of `astro preview`.
 * Usage: node scripts/serve.ts <dir> <port>
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 4322);
const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let path = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!path.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(path) && statSync(path).isDirectory()) {
    if (!url.pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
      return;
    }
    path = join(path, 'index.html');
  }
  const found = existsSync(path) && statSync(path).isFile();
  const file = found ? path : join(root, '404.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404');
    return;
  }
  res.writeHead(found ? 200 : 404, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}/`));
