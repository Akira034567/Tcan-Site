/**
 * Release gate. Fails when the built site is not ready to go public:
 *  - pending client data (data-pending) in any page, including the legal-review banner;
 *  - solution copy still in draft;
 *  - partner/client/confidential names (denylist in .private/denylist.txt) in src/ or dist/;
 *  - imports from the confidential apresentacao/ folder;
 *  - robots.txt blocking indexing (build with PUBLIC_INDEXING=true);
 *  - analytics without a valid GA4 measurement ID.
 * Usage: node scripts/check-release.ts
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const errors: string[] = [];
const warnings: string[] = [];

const walk = (dir: string, exts: string[]): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path, exts);
    return exts.some((e) => name.endsWith(e)) ? [path] : [];
  });

if (!existsSync(join(root, 'dist'))) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}
const html = walk(join(root, 'dist'), ['.html']);
const srcFiles = walk(join(root, 'src'), ['.ts', '.astro', '.css', '.md']);

// 1. Pending client data
const pending = new Map<string, Set<string>>();
for (const file of html) {
  for (const m of readFileSync(file, 'utf8').matchAll(/data-pending="([^"]+)"/g)) {
    if (!pending.has(m[1])) pending.set(m[1], new Set());
    pending.get(m[1])!.add(relative(join(root, 'dist'), file));
  }
}
for (const [label, files] of pending) errors.push(`Pendente: ${label} (${[...files].slice(0, 3).join(', ')}${files.size > 3 ? '…' : ''})`);

// 2. Draft copy
const pillarsSrc = readFileSync(join(root, 'src/data/pillars.ts'), 'utf8');
const drafts = (pillarsSrc.match(/reviewStatus:\s*draft/g) ?? []).length;
if (drafts) errors.push(`${drafts} solução(ões) ainda em rascunho: aprove os textos e marque reviewStatus: 'approved' em src/data/pillars.ts`);

// 3. Denylist
const denyFile = join(root, '.private/denylist.txt');
if (existsSync(denyFile)) {
  const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const terms = readFileSync(denyFile, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = terms.map((t) => ({ term: t, re: new RegExp(`(^|[^\\p{L}\\p{N}])${escape(fold(t))}(?=$|[^\\p{L}\\p{N}])`, 'u') }));
  const visibleText = (s: string) =>
    s
      .replace(/<script[\s\S]*?<\/script>/gi, (m) => (m.includes('ld+json') ? m : ' '))
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/data:[^"')\s]+/g, ' ');
  for (const file of [...html, ...srcFiles]) {
    const content = fold(file.endsWith('.html') ? visibleText(readFileSync(file, 'utf8')) : readFileSync(file, 'utf8'));
    for (const { term, re } of patterns) {
      if (re.test(content)) errors.push(`Termo proibido "${term}" em ${relative(root, file)}`);
    }
  }
} else {
  warnings.push('.private/denylist.txt não encontrado: verificação de nomes de parceiros/clientes não executada.');
}

// 4. Confidential folder
for (const file of srcFiles) {
  if (/apresentacao\//.test(readFileSync(file, 'utf8'))) errors.push(`Referência à pasta confidencial apresentacao/ em ${relative(root, file)}`);
}

// 5. Indexing
const robots = existsSync(join(root, 'dist/robots.txt')) ? readFileSync(join(root, 'dist/robots.txt'), 'utf8') : '';
if (!/Allow: \//.test(robots)) errors.push('robots.txt bloqueia indexação: gere o build de produção com PUBLIC_INDEXING=true');
if (html.some((f) => !f.includes('obrigado') && !f.endsWith('404.html') && readFileSync(f, 'utf8').includes('name="robots" content="noindex'))) {
  errors.push('Páginas com noindex: gere o build de produção com PUBLIC_INDEXING=true');
}

// 6. Analytics
const ga = process.env.PUBLIC_GA4_ID ?? '';
if (!/^G-[A-Z0-9]+$/.test(ga)) errors.push('PUBLIC_GA4_ID ausente ou inválido (formato G-XXXXXXXXXX)');

// 7. Site URL
if (!process.env.SITE_URL) warnings.push('SITE_URL não definido: usando https://www.tcan.com.br');
if (!process.env.PUBLIC_CONTACT_ENDPOINT) warnings.push('Formulário sem endpoint: funcionando em modo WhatsApp/e-mail.');

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error(`\n✖ Não está pronto para publicar (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('✔ Pronto para publicar.');
