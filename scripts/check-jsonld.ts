/**
 * Validates the JSON-LD of every built page: parses, every {"@id"} reference resolves inside
 * the page graph, and key types carry their required properties.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = join(process.cwd(), 'dist');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : n.endsWith('.html') ? [p] : [];
  });

const required: Record<string, string[]> = {
  ProfessionalService: ['name', 'url', 'logo', 'description'],
  WebSite: ['name', 'url'],
  WebPage: ['name', 'url'],
  AboutPage: ['name', 'url'],
  ContactPage: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  Person: ['name', 'jobTitle'],
  Service: ['name', 'provider'],
  FAQPage: ['mainEntity'],
};

let problems = 0;
let pages = 0;
for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) continue;
  pages++;
  const name = relative(dist, file);
  for (const [, json] of blocks) {
    let data: { '@graph'?: Record<string, unknown>[] };
    try {
      data = JSON.parse(json);
    } catch (e) {
      console.error(`✖ ${name}: JSON inválido (${(e as Error).message})`);
      problems++;
      continue;
    }
    const graph = data['@graph'] ?? [];
    const ids = new Set(graph.map((n) => n['@id']).filter(Boolean));
    const refs: string[] = [];
    const collect = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(collect);
      else if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>;
        if (Object.keys(o).length === 1 && typeof o['@id'] === 'string') refs.push(o['@id']);
        else Object.values(o).forEach(collect);
      }
    };
    graph.forEach((node) => Object.entries(node).forEach(([k, v]) => k !== '@id' && collect(v)));
    for (const ref of refs) {
      // Service nodes live on pillar pages; the home catalog may point to them.
      if (!ids.has(ref) && !/\/solucoes\/[^/]+\/#/.test(ref)) {
        console.error(`✖ ${name}: referência @id sem nó: ${ref}`);
        problems++;
      }
    }
    for (const node of graph) {
      const type = String(node['@type']);
      for (const prop of required[type] ?? []) {
        if (node[prop] === undefined) {
          console.error(`✖ ${name}: ${type} sem "${prop}"`);
          problems++;
        }
      }
    }
  }
}
if (problems) process.exit(1);
console.log(`✔ JSON-LD válido em ${pages} páginas.`);
