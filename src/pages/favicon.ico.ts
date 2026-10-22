import type { APIRoute } from 'astro';
import { icoFile } from '../lib/og.ts';

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await icoFile()), { headers: { 'Content-Type': 'image/x-icon' } });
