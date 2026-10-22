/**
 * Internal link builder. The site can live at a domain root (tcan.com.br) or under a sub-path
 * (GitHub Pages project site: /Tcan-Site/), so every internal path goes through here.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;
