/** Performance budgets (gzip): initial JS and CSS per page, fonts, and the lazy 3D chunk. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = join(process.cwd(), 'dist');
const KB = 1024;
const budget = { initialJs: 20 * KB, css: 30 * KB, fonts: 120 * KB, threeChunk: 180 * KB, html: 40 * KB };

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const gz = (file: string) => gzipSync(readFileSync(file)).length;
const fmt = (n: number) => `${(n / KB).toFixed(1)} KB`;

let failed = false;
const check = (label: string, value: number, limit: number) => {
  const ok = value <= limit;
  if (!ok) failed = true;
  console.log(`${ok ? '✔' : '✖'} ${label}: ${fmt(value)} (limite ${fmt(limit)})`);
};

const files = walk(dist);
for (const page of files.filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(page, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]+src="(\/_astro\/[^"]+\.js)"/g)].map((m) => join(dist, m[1]));
  const styles = [...html.matchAll(/<link[^>]+href="(\/_astro\/[^"]+\.css)"/g)].map((m) => join(dist, m[1]));
  const name = relative(dist, page);
  check(`${name} · JS inicial`, scripts.reduce((n, f) => n + gz(f), 0), budget.initialJs);
  check(`${name} · CSS`, styles.reduce((n, f) => n + gz(f), 0), budget.css);
  check(`${name} · HTML`, gzipSync(html).length, budget.html);
}
const fonts = files.filter((f) => f.endsWith('.woff2'));
check('Fontes (total)', fonts.reduce((n, f) => n + statSync(f).size, 0), budget.fonts);
const three = files.filter((f) => /[\\/]_astro[\\/]scene\.[^\\/]+\.js$/.test(f));
for (const f of three) check('Chunk 3D (lazy)', gz(f), budget.threeChunk);
if (failed) process.exit(1);
