import type { APIRoute, GetStaticPaths } from 'astro';
import { pages, ogSlug } from '../../data/pages.ts';
import { ogImage } from '../../lib/og.ts';

export const getStaticPaths = (() =>
  pages.map((p) => ({ params: { slug: ogSlug(p.path) }, props: { title: p.ogTitle, eyebrow: p.ogEyebrow } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await ogImage(props.title as string, props.eyebrow as string | undefined)), {
    headers: { 'Content-Type': 'image/png' },
  });
