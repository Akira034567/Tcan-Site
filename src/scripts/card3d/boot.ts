/**
 * Card controller. Works in CSS mode (no WebGL) and upgrades to three.js when the device can
 * afford it: WebGL2, no reduced motion, no data saver, not low-end, card visible, after the first interaction.
 */
import type { CardScene, Side } from './scene.ts';

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

const stage = document.querySelector<HTMLElement>('[data-card-stage]');
if (stage) setup(stage);

function setup(stage: HTMLElement) {
  const sideInputs = [...stage.querySelectorAll<HTMLInputElement>('[data-card-side]')];
  const personInputs = [...stage.querySelectorAll<HTMLInputElement>('[data-card-person]')];
  const status = stage.querySelector<HTMLElement>('[data-card-status]')!;
  const gl = stage.querySelector<HTMLElement>('[data-gl]')!;
  let scene: CardScene | null = null;

  const side = () => (sideInputs.find((i) => i.checked)?.value ?? 'front') as Side;
  const person = () => personInputs.find((i) => i.checked)?.value ?? personInputs[0].value;
  const label = (id: string) => personInputs.find((i) => i.value === id)?.dataset.label ?? id;

  const announce = () => {
    status.textContent =
      side() === 'front' ? 'Mostrando a frente do cartão da TCAN.' : `Mostrando o verso do cartão de ${label(person())}.`;
  };

  const setSideInput = (value: Side) => {
    const input = sideInputs.find((i) => i.value === value);
    if (input && !input.checked) input.checked = true;
  };

  for (const input of sideInputs) {
    input.addEventListener('change', () => {
      scene?.setSide(side());
      announce();
    });
  }
  for (const input of personInputs) {
    input.addEventListener('change', () => {
      scene?.setPerson(person());
      // Choosing a person shows their side of the card.
      if (side() === 'front') {
        setSideInput('back');
        scene?.setSide('back');
      }
      announce();
    });
  }

  /* -------------------------------------------------------------- capability gate */
  const nav = navigator as NavigatorExtras;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '');
  const lowEnd = (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2;
  if (reduce || saveData || lowEnd || !supportsWebGL2()) return;

  const start = async () => {
    try {
      const { createCardScene } = await import('./scene.ts');
      scene = await createCardScene(gl, {
        side: side(),
        person: person(),
        persons: personInputs.map((i) => i.value),
        onSide: (value) => {
          setSideInput(value);
          announce();
        },
      });
      stage.classList.add('is-3d');
    } catch (error) {
      console.warn('[card] staying in CSS mode', error);
    }
  };

  stage.addEventListener('card:lost', () => {
    stage.classList.remove('is-3d');
    scene?.destroy();
    scene = null;
  });

  // Import on interaction: three.js is only fetched after the visitor moves, touches, scrolls or types
  // (desktop users trigger it almost immediately) and once the card is on screen. Page load stays light.
  const interacted = new Promise<void>((resolve) => {
    const events = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;
    const done = () => {
      events.forEach((e) => removeEventListener(e, done));
      resolve();
    };
    events.forEach((e) => addEventListener(e, done, { once: true, passive: true }));
  });
  const whenVisible = new Promise<void>((resolve) => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        resolve();
      }
    });
    io.observe(stage);
  });
  Promise.all([interacted, whenVisible]).then(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => void start(), { timeout: 600 });
    else setTimeout(() => void start(), 100);
  });
}

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2');
    ctx?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!ctx;
  } catch {
    return false;
  }
}
