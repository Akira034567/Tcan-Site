import type { APIRoute } from 'astro';
import { url } from '../lib/url.ts';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'TCAN Assessoria de Negócios',
      short_name: 'TCAN',
      lang: 'pt-BR',
      start_url: url('/'),
      scope: url('/'),
      display: 'browser',
      background_color: '#141714',
      theme_color: '#141714',
      icons: [
        { src: url('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
        { src: url('/icon-512.png'), sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
