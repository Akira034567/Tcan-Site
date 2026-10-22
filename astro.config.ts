import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL. Override with SITE_URL when deploying (e.g. a preview domain).
const site = process.env.SITE_URL ?? 'https://www.tcan.com.br';
// Sub-path when the site is not at the domain root (GitHub Pages project site: /Tcan-Site).
const base = process.env.BASE_PATH ?? '/';

const variable = (pkg: string, file: string) => ({
  src: [`${pkg}/files/${file}`] as [string],
  weight: '100 900',
  style: 'normal' as const,
});

export default defineConfig({
  site,
  base,
  output: 'static',
  // e2e tests build into their own folder so they never overwrite the release build.
  outDir: process.env.ASTRO_OUT_DIR ?? './dist',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // 'jsx' (the v7 default) can glue Portuguese words around inline tags.
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-body',
      fallbacks: ['system-ui', 'sans-serif'],
      options: { variants: [variable('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2')] },
    },
    {
      provider: fontProviders.local(),
      name: 'Outfit',
      cssVariable: '--font-display',
      fallbacks: ['system-ui', 'sans-serif'],
      options: { variants: [variable('@fontsource-variable/outfit', 'outfit-latin-wght-normal.woff2')] },
    },
  ],
  vite: {
    // Never inline scripts into the HTML: keeps a strict CSP (script-src 'self') possible.
    build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 700 },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(contato\/obrigado|404)\/?$/.test(page),
    }),
  ],
});
