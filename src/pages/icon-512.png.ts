import type { APIRoute } from 'astro';
import { pngIcon } from '../lib/og.ts';

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await pngIcon(512, 0)), { headers: { 'Content-Type': 'image/png' } });
