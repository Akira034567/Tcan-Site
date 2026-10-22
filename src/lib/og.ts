/** Open Graph images (1200 × 630) and app icons, rendered at build time with sharp. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { textPath, wrap } from './card/outline.ts';

const logo = `data:image/png;base64,${readFileSync(resolve(process.cwd(), 'src/assets/brand/tcan-white.png')).toString('base64')}`;
const LOGO_RATIO = 674 / 233;

export async function ogImage(title: string, eyebrow = 'TCAN Assessoria de Negócios'): Promise<Buffer> {
  const W = 1200;
  const H = 630;
  const font = { font: 'outfit-600' as const, size: 68 };
  const lines = wrap(title, font, 700).slice(0, 3);
  const top = 300 - ((lines.length - 1) * 78) / 2;
  const titlePaths = lines.map((l, i) => textPath(l, { ...font, x: 72, y: top + i * 78, tracking: -0.02 }).d).join('');
  const eyebrowPath = textPath(eyebrow.toUpperCase(), { font: 'inter-600', size: 20, x: 72, y: top - 88, tracking: 0.14 }).d;
  const footer = textPath('Seguimos ticando suas metas', { font: 'inter-500', size: 24, x: 72, y: 566 }).d;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="g" cx="0.82" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#17592A" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#141714" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="#141714"/>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <polygon fill="#70BF3C" points="${[[850, 630], [960, 630], [1200, 60], [1200, 0], [1100, 0]].map((p) => p.join(',')).join(' ')}"/>
    <polygon fill="#56B14A" points="${[[960, 630], [1080, 630], [1200, 530], [1200, 420]].map((p) => p.join(',')).join(' ')}"/>
    <image href="${logo}" x="72" y="64" width="190" height="${190 / LOGO_RATIO}"/>
    <path fill="#70BF3C" d="${eyebrowPath}"/>
    <path fill="#FFFFFF" d="${titlePaths}"/>
    <path fill="#A3AAA2" d="${footer}"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, effort: 10 }).toBuffer();
}

/** Brand mark: the card's "tick" stripes on charcoal. */
export const markSvg = (size = 512, radius = 112) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <rect width="512" height="512" rx="${radius}" fill="#2B2B2B"/>
  <polygon fill="#70BF3C" points="121,430 207,430 363,82 277,82"/>
  <polygon fill="#56B14A" points="207,430 293,430 391,318 391,236"/>
</svg>`;

export const pngIcon = (size: number, radius = 112) =>
  sharp(Buffer.from(markSvg(size, radius))).resize(size, size).png().toBuffer();

/** Minimal .ico container wrapping PNG images (supported by all current browsers). */
export async function icoFile(sizes = [16, 32, 48]): Promise<Buffer> {
  const pngs = await Promise.all(sizes.map((s) => pngIcon(s, 96)));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(s >= 256 ? 0 : s, e);
    header.writeUInt8(s >= 256 ? 0 : s, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(pngs[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  return Buffer.concat([header, ...pngs]);
}
