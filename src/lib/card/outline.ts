/**
 * Build-time text → SVG path outlines (fontkit), so generated SVGs (card faces, OG art)
 * render identically everywhere, including inside <img> and WebGL textures where web
 * fonts are not available.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import * as fontkit from 'fontkit';

type FontKey = 'inter-400' | 'inter-500' | 'inter-600' | 'inter-700' | 'outfit-500' | 'outfit-600' | 'outfit-700';

// Resolve from the project root: bundled build chunks run from dist/.
const require = createRequire(join(process.cwd(), 'package.json'));
const cache = new Map<FontKey, fontkit.Font>();

function load(key: FontKey): fontkit.Font {
  let font = cache.get(key);
  if (!font) {
    const [family, weight] = key.split('-');
    const file = require.resolve(`@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`);
    font = fontkit.create(readFileSync(file)) as fontkit.Font;
    cache.set(key, font);
  }
  return font;
}

export type TextOptions = {
  font: FontKey;
  size: number;
  x: number;
  /** Baseline y. */
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  /** Extra tracking in em (e.g. 0.02). */
  tracking?: number;
};

const r = (n: number) => Math.round(n * 100) / 100;

/** Returns path data for `text` laid out on one line, plus its advance width. */
export function textPath(text: string, o: TextOptions): { d: string; width: number } {
  const font = load(o.font);
  const scale = o.size / font.unitsPerEm;
  const run = font.layout(text);
  const tracking = (o.tracking ?? 0) * o.size;
  const width = run.advanceWidth * scale + tracking * Math.max(0, run.glyphs.length - 1);
  let x = o.x - (o.anchor === 'middle' ? width / 2 : o.anchor === 'end' ? width : 0);
  let d = '';
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const gx = x + pos.xOffset * scale;
    const gy = o.y - pos.yOffset * scale;
    // Font units are y-up; SVG is y-down.
    const path = glyph.path.scale(scale, -scale).translate(gx, gy);
    d += path.toSVG();
    x += pos.xAdvance * scale + tracking;
  });
  return { d: d.replace(/-?\d+\.\d+/g, (n) => String(r(Number(n)))), width };
}

/** Wraps words to fit maxWidth; returns lines. */
export function wrap(text: string, o: Omit<TextOptions, 'x' | 'y'>, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && textPath(next, { ...o, x: 0, y: 0 }).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function measure(text: string, o: Omit<TextOptions, 'x' | 'y'>): number {
  return textPath(text, { ...o, x: 0, y: 0 }).width;
}
