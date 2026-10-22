/**
 * Business-card faces as self-contained SVG (90 × 50 mm → 900 × 500 units).
 * Geometry traced from photos of the printed card. Used by:
 *  - /cartao/<face>.svg      (poster, CSS 3D fallback, WebGL color textures)
 *  - /cartao/<face>-uv.svg   (spot-UV gloss mask for the WebGL clearcoat)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { encode } from 'uqr';
import { siWhatsapp } from 'simple-icons';
import { founders, type Founder } from '../../data/founders.ts';
import { company } from '../../data/company.ts';
import { textPath, measure } from './outline.ts';

export const CARD_W = 900;
export const CARD_H = 500;
export const CARD_RADIUS = 14;

export const C = {
  card: '#2B2B2B',
  lime: '#70BF3C',
  green: '#56B14A',
  white: '#FFFFFF',
};

export type FaceId = 'frente' | 'verso-tricia' | 'verso-ricardo';
export const FACES: FaceId[] = ['frente', 'verso-tricia', 'verso-ricardo'];

// Palette-compressed logo keeps each face SVG small (it is the hero image).
const logoHref = await (async () => {
  // Resolved from the project root: bundled build chunks run from dist/.
  const file = resolve(process.cwd(), 'src/assets/brand/tcan-white.png');
  const png = await sharp(readFileSync(file)).png({ palette: true, colors: 48, compressionLevel: 9, effort: 10 }).toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
})();
const LOGO_RATIO = 674 / 233;

const svg = (body: string, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CARD_W} ${CARD_H}" width="${CARD_W}" height="${CARD_H}">` +
  `<defs><clipPath id="card"><rect width="${CARD_W}" height="${CARD_H}" rx="${CARD_RADIUS}"/></clipPath>${defs}</defs>` +
  `<g clip-path="url(#card)">${body}</g></svg>`;

const poly = (fill: string, pts: [number, number][]) =>
  `<polygon fill="${fill}" points="${pts.map(([x, y]) => `${x},${y}`).join(' ')}"/>`;

const path = (d: string, fill: string) => `<path fill="${fill}" d="${d}"/>`;

/* ------------------------------------------------------------------ front */
// The two stripes form the brand "tick": a steep lime stripe and a shallower one meeting it at the bottom.
const FRONT_STRIPE_MAIN: [number, number][] = [[503, 500], [598, 500], [803, 0], [706, 0]];
const FRONT_STRIPE_SECOND: [number, number][] = [[634, 412], [900, 312], [900, 414], [714, 500], [598, 500]];

function front(uv: boolean): string {
  const fg = (c: string) => (uv ? C.white : c);
  const logoW = 316;
  const logo = `<image href="${logoHref}" x="70" y="70" width="${logoW}" height="${logoW / LOGO_RATIO}"${uv ? ' filter="url(#white)"' : ''}/>`;
  const tagline = uv
    ? ''
    : path(textPath(company.tagline, { font: 'inter-500', size: 19, x: 62, y: 430 }).d, C.lime);
  return svg(
    `<rect width="${CARD_W}" height="${CARD_H}" fill="${uv ? '#000' : C.card}"/>` +
      poly(fg(C.lime), FRONT_STRIPE_MAIN) +
      poly(fg(C.green), FRONT_STRIPE_SECOND) +
      logo +
      tagline,
    uv ? WHITE_FILTER : '',
  );
}

const WHITE_FILTER =
  '<filter id="white"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>';

/* ------------------------------------------------------------------ back */
const BACK_STRIPE_A: [number, number][] = [[80, 0], [206, 0], [72, 500], [0, 500], [0, 432]];
const BACK_STRIPE_B: [number, number][] = [[0, 0], [58, 0], [0, 300]];

function qr(url: string, x: number, y: number, size: number, color: string): string {
  const { data } = encode(url, { ecc: 'H', border: 0 });
  const n = data.length;
  const m = size / n;
  // Clear a centre square for the WhatsApp mark (ECC H tolerates ~30% damage; this is ~8%).
  const hole = Math.round(n * 0.28) | 1;
  const h0 = (n - hole) / 2;
  let d = '';
  for (let row = 0; row < n; row++) {
    let col = 0;
    while (col < n) {
      if (!data[row][col] || (row >= h0 && row < h0 + hole && col >= h0 && col < h0 + hole)) {
        col++;
        continue;
      }
      let end = col;
      while (end + 1 < n && data[row][end + 1] && !(row >= h0 && row < h0 + hole && end + 1 >= h0 && end + 1 < h0 + hole)) end++;
      const rx = (x + col * m).toFixed(2);
      const ry = (y + row * m).toFixed(2);
      d += `M${rx} ${ry}h${((end - col + 1) * m).toFixed(2)}v${m.toFixed(2)}h-${((end - col + 1) * m).toFixed(2)}z`;
      col = end + 1;
    }
  }
  const c = x + size / 2;
  const cy = y + size / 2;
  const badge = hole * m * 0.92;
  const s = (badge * 0.62) / 24;
  return (
    path(d, color) +
    `<circle cx="${c}" cy="${cy}" r="${badge / 2}" fill="${color}"/>` +
    `<path fill="${C.card}" transform="translate(${c - 12 * s} ${cy - 12 * s}) scale(${s})" d="${siWhatsapp.path}"/>`
  );
}

// Footer icons (24-unit boxes)
const icon = {
  linkedin: (x: number, y: number, s: number, fill: string) =>
    `<g transform="translate(${x} ${y}) scale(${s / 24})"><rect width="24" height="24" rx="4" fill="${fill}"/>` +
    `<rect x="5" y="9.5" width="3.2" height="9.5" fill="${C.card}"/><circle cx="6.6" cy="6.4" r="1.9" fill="${C.card}"/>` +
    `<path fill="${C.card}" d="M10.6 9.5h3.05v1.4c.45-.85 1.55-1.65 3.15-1.65 3.1 0 3.6 2 3.6 4.65V19h-3.2v-4.4c0-1.1-.05-2.45-1.5-2.45-1.5 0-1.75 1.15-1.75 2.35V19h-3.35z"/></g>`,
  whatsapp: (x: number, y: number, s: number, fill: string) =>
    `<path fill="${fill}" transform="translate(${x} ${y}) scale(${s / 24})" d="${siWhatsapp.path}"/>`,
  mail: (x: number, y: number, s: number, stroke: string) =>
    `<g transform="translate(${x} ${y}) scale(${s / 24})" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    `<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></g>`,
};

function back(f: Founder, uv: boolean): string {
  const bg = `<rect width="${CARD_W}" height="${CARD_H}" fill="${uv ? '#000' : C.card}"/>`;
  const stripes = poly(uv ? C.white : C.lime, BACK_STRIPE_A) + poly(uv ? C.white : C.green, BACK_STRIPE_B);
  if (uv) return svg(bg + stripes);

  const name = textPath(f.name, { font: 'inter-600', size: 41, x: 216, y: 128, tracking: -0.01 });
  const role = textPath(f.role, { font: 'inter-500', size: 23, x: 218, y: 166 });
  const sign = textPath(company.signature, { font: 'inter-500', size: 19.5, x: 836, y: 352, anchor: 'end' });
  const rule = `<rect x="104" y="376" width="732" height="1.6" fill="${C.lime}"/>`;

  const fs = 17.5;
  const baseline = 441;
  const iconS = 22;
  const iconY = baseline - 17;
  const items = [
    { icon: icon.linkedin, text: f.linkedinLabel, kind: 'fill' },
    { icon: icon.whatsapp, text: f.phoneDisplay.replace(/[()]/g, '').replace(/\s+/, ' '), kind: 'fill' },
    { icon: icon.mail, text: f.email, kind: 'stroke' },
  ];
  // Left item starts after the stripe; right item ends at the QR edge; middle centred between.
  const widths = items.map((it) => iconS + 12 + measure(it.text, { font: 'inter-500', size: fs }));
  const xs = [112, 0, 836 - widths[2]];
  xs[1] = (xs[0] + widths[0] + xs[2]) / 2 - widths[1] / 2;
  let footer = '';
  items.forEach((it, i) => {
    footer += it.icon(xs[i], iconY, iconS, C.white);
    footer += path(textPath(it.text, { font: 'inter-500', size: fs, x: xs[i] + iconS + 12, y: baseline }).d, C.white);
  });

  return svg(
    bg +
      stripes +
      path(name.d, C.white) +
      path(role.d, C.white) +
      qr(`https://wa.me/${f.phoneE164}`, 671, 70, 165, C.lime) +
      path(sign.d, C.lime) +
      rule +
      footer,
  );
}

export function cardFace(id: FaceId, uv = false): string {
  if (id === 'frente') return front(uv);
  const f = founders.find((p) => `verso-${p.id}` === id);
  if (!f) throw new Error(`Unknown card face ${id}`);
  return back(f, uv);
}
