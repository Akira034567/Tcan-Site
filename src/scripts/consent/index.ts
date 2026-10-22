/**
 * Consent manager (LGPD + ANPD cookie guide).
 * - Nothing optional runs before an explicit choice; no pre-ticked boxes.
 * - Accept and reject are equally easy; the choice can be changed or withdrawn at any time.
 * - GA4 is injected only after opt-in; withdrawing disables it and deletes its cookies.
 */
type Choices = { analytics: boolean };
type Stored = { v: number; ts: string; choices: Choices };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    tcanConsent?: { get: () => Choices | null; open: () => void };
    [key: `ga-disable-${string}`]: boolean;
  }
}

const COOKIE = 'tcan_consent';
// Scope the choice to this site (it may live under a sub-path, e.g. GitHub Pages).
const COOKIE_PATH = import.meta.env.BASE_URL;
const MAX_AGE = 180 * 24 * 60 * 60;
const GA_COOKIE_SECONDS = 395 * 24 * 60 * 60;

const root = document.querySelector<HTMLElement>('[data-consent-root]');
if (root) init(root);

function init(root: HTMLElement) {
  const version = Number(root.dataset.policyVersion ?? '1');
  const gaId = root.dataset.ga4Id || '';
  const banner = root.querySelector<HTMLElement>('[data-consent-banner]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-consent-dialog]')!;
  const analyticsInput = root.querySelector<HTMLInputElement>('[data-consent-analytics]')!;
  let lastTrigger: HTMLElement | null = null;
  let gaLoaded = false;

  /* ------------------------------------------------------------ storage */
  function read(): Stored | null {
    const raw = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
    if (!raw) return null;
    try {
      const data = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Stored;
      return data.v === version ? data : null; // policy changed: ask again
    } catch {
      return null;
    }
  }

  function write(choices: Choices) {
    const value: Stored = { v: version, ts: new Date().toISOString(), choices };
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=${COOKIE_PATH}; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  }

  /* ------------------------------------------------------------ Google Analytics 4 */
  function enableAnalytics() {
    if (!gaId) {
      if (import.meta.env.DEV) console.info('[consent] analytics accepted; GA4 not loaded because PUBLIC_GA4_ID is empty.');
      return;
    }
    window[`ga-disable-${gaId}`] = false;
    if (gaLoaded) {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js expects the Arguments object, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      cookie_expires: GA_COOKIE_SECONDS,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=Lax;Secure',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.append(script);
  }

  function disableAnalytics() {
    if (gaId) {
      window[`ga-disable-${gaId}`] = true;
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    }
    deleteGaCookies();
  }

  function deleteGaCookies() {
    const names = document.cookie
      .split('; ')
      .map((c) => c.split('=')[0])
      .filter((n) => /^_ga(_.+)?$/.test(n));
    const parts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) {
      const d = parts.slice(i).join('.');
      domains.push(`; Domain=${d}`, `; Domain=.${d}`);
    }
    for (const name of names) {
      for (const domain of domains) document.cookie = `${name}=; Path=/; Max-Age=0${domain}`;
    }
  }

  /* ------------------------------------------------------------ apply */
  function apply(choices: Choices, persist: boolean) {
    if (persist) write(choices);
    analyticsInput.checked = choices.analytics;
    if (choices.analytics) enableAnalytics();
    else disableAnalytics();
    banner.hidden = true;
    document.documentElement.style.removeProperty('--consent-h');
    document.dispatchEvent(new CustomEvent('tcan:consent', { detail: choices }));
  }

  function showBanner() {
    banner.hidden = false;
    // Keep focused elements clear of the fixed banner (WCAG 2.4.11).
    const sync = () => document.documentElement.style.setProperty('--consent-h', `${banner.offsetHeight + 24}px`);
    sync();
    new ResizeObserver(sync).observe(banner);
  }

  function openDialog(trigger: HTMLElement | null) {
    lastTrigger = trigger;
    analyticsInput.checked = read()?.choices.analytics ?? false;
    dialog.showModal();
  }

  dialog.addEventListener('close', () => {
    (lastTrigger && document.contains(lastTrigger) ? lastTrigger : document.body).focus?.();
  });

  root.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-consent]');
    if (!button) return;
    const action = button.dataset.consent;
    const choices = { analytics: action === 'accept' ? true : action === 'reject' ? false : analyticsInput.checked };
    apply(choices, true);
    if (dialog.open) dialog.close();
  });

  document.addEventListener('click', (event) => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-consent-open]');
    if (trigger) {
      event.preventDefault();
      openDialog(trigger);
    }
  });

  window.tcanConsent = { get: () => read()?.choices ?? null, open: () => openDialog(null) };

  const stored = read();
  if (stored) apply(stored.choices, false);
  else showBanner();

  /* ------------------------------------------------------------ measurement (consent-gated) */
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!link || !read()?.choices.analytics || !window.gtag) return;
    const href = link.getAttribute('href') ?? '';
    const channel = href.startsWith('https://wa.me')
      ? 'whatsapp'
      : href.startsWith('mailto:')
        ? 'email'
        : href.includes('linkedin.com')
          ? 'linkedin'
          : null;
    if (channel) window.gtag('event', 'contact_click', { channel, link_location: link.dataset.location ?? 'page' });
  });
}

export {};
