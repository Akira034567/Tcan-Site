import type { APIRoute } from 'astro';
import { pngIcon } from '../lib/og.ts';

// iOS rounds the corners itself: square art.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await pngIcon(180, 0)), { headers: { 'Content-Type': 'image/png' } });
