/** Site-wide behaviour: header state, navigation disclosures, reveal-on-scroll. */
document.documentElement.classList.add('js');

/* ----------------------------------------------------------- header shadow */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------- disclosures (Soluções panel) */
const disclosures = [...document.querySelectorAll<HTMLButtonElement>('[data-disclosure]')];
const setOpen = (button: HTMLButtonElement, open: boolean) => {
  const panel = document.getElementById(button.getAttribute('aria-controls')!);
  if (!panel) return;
  button.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
};
for (const button of disclosures) {
  const panel = document.getElementById(button.getAttribute('aria-controls')!);
  button.addEventListener('click', () => setOpen(button, button.getAttribute('aria-expanded') !== 'true'));
  button.parentElement?.addEventListener('focusout', (event) => {
    const next = (event as FocusEvent).relatedTarget as Node | null;
    if (next && !button.parentElement!.contains(next)) setOpen(button, false);
  });
  panel?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(button, false);
      button.focus();
    }
  });
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(button, false);
  });
}
document.addEventListener('click', (event) => {
  for (const button of disclosures) {
    if (!button.parentElement?.contains(event.target as Node)) setOpen(button, false);
  }
});

/* ----------------------------------------------------------- mobile menu */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const label = document.querySelector<HTMLElement>('[data-menu-label]');
if (toggle && menu) {
  const setMenu = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('data-open', open);
    if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 60.01rem)').addEventListener('change', (e) => e.matches && setMenu(false));
}

/* ----------------------------------------------------------- reveal on scroll */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-visible'));
}
