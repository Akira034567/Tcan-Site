/** Pillar colour coding (always paired with text/icons, never colour alone). */
import type { Pillar } from '../data/pillars.ts';

export const pillarTone: Record<Pillar['id'], { bg: string; fg: string }> = {
  marca: { bg: '#70BF3C', fg: '#0C0F0D' },
  esg: { bg: '#17592A', fg: '#FFFFFF' },
  pessoas: { bg: '#B7DF97', fg: '#0F3D22' },
  inovacao: { bg: '#2B2B2B', fg: '#70BF3C' },
};
