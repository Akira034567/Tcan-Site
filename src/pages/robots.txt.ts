import type { APIRoute } from 'astro';
import { absolute } from '../lib/seo.ts';
import { url } from '../lib/url.ts';

// Only production (PUBLIC_INDEXING=true) may be indexed; previews and local builds are blocked.
export const GET: APIRoute = ({ site }) => {
  const indexing = import.meta.env.PUBLIC_INDEXING === 'true';
  const body = indexing
    ? `User-agent: *\nAllow: /\nDisallow: ${url('/contato/obrigado/')}\n\nSitemap: ${absolute(site, '/sitemap-index.xml')}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
