/**
 * three.js business card. Loaded lazily by boot.ts (never part of the initial bundle).
 * Geometry: 90 × 50 mm card (9 × 5 units), extruded with a tiny bevel.
 * Faces are the same SVGs used by the CSS fallback, rasterised at runtime.
 * Spot UV: clearcoat masked by a black/white SVG (logo and stripes glossy, rest matte).
 */
import {
  CanvasTexture,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  NoColorSpace,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type BufferGeometry,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type Side = 'front' | 'back';
export type CardScene = {
  setSide: (side: Side) => void;
  setPerson: (id: string) => void;
  destroy: () => void;
};
type Options = {
  side: Side;
  person: string;
  persons: string[];
  onSide: (side: Side) => void;
};

/** Card face SVGs (the site may live under a sub-path, e.g. GitHub Pages). */
const FACES = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/cartao/`;
const W = 9;
const H = 5;
const R = 0.14;
const DEPTH = 0.035;
const BEVEL = 0.007;
const BASE_X = 0.14;
const BASE_Y = -0.34;
const BASE_Z = 0.035;

function cardShape(): Shape {
  const s = new Shape();
  const x = -W / 2;
  const y = -H / 2;
  s.moveTo(x + R, y);
  s.lineTo(x + W - R, y);
  s.absarc(x + W - R, y + R, R, -Math.PI / 2, 0, false);
  s.lineTo(x + W, y + H - R);
  s.absarc(x + W - R, y + H - R, R, 0, Math.PI / 2, false);
  s.lineTo(x + R, y + H);
  s.absarc(x + R, y + H - R, R, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + R);
  s.absarc(x + R, y + R, R, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Caps map the whole card to 0..1; the back cap is mirrored so it reads correctly when flipped. */
const uvGenerator = {
  generateTopUV(_g: unknown, v: number[], a: number, b: number, c: number) {
    return [a, b, c].map((i) => {
      const x = v[i * 3];
      const y = v[i * 3 + 1];
      const z = v[i * 3 + 2];
      const u = (x + W / 2) / W;
      return new Vector2(z < DEPTH / 2 ? 1 - u : u, (y + H / 2) / H);
    });
  },
  generateSideWallUV() {
    return [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1)];
  },
};

function buildGeometry(): BufferGeometry {
  const geo = new ExtrudeGeometry(cardShape(), {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 2,
    curveSegments: 10,
    UVGenerator: uvGenerator as never,
  });
  // ExtrudeGeometry puts both lids in group 0 (bottom lid first, then top) and walls in group 1.
  const [lids, walls] = geo.groups;
  const half = lids.count / 2;
  geo.clearGroups();
  geo.addGroup(lids.start, half, 0); // back (z < 0 side)
  geo.addGroup(lids.start + half, half, 1); // front (faces the camera)
  geo.addGroup(walls.start, walls.count, 2); // edge
  geo.translate(0, 0, -DEPTH / 2);
  return geo;
}

async function svgTexture(url: string, width: number, color: boolean, anisotropy: number): Promise<CanvasTexture> {
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.round((width * H) / W);
  const ctx = canvas.getContext('2d')!;
  if (!color) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = color ? SRGBColorSpace : NoColorSpace;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

export async function createCardScene(container: HTMLElement, opts: Options): Promise<CardScene> {
  const cores = navigator.hardwareConcurrency ?? 8;
  const dpr = Math.min(window.devicePixelRatio || 1, cores <= 4 ? 1.5 : 2);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  pmrem.dispose();
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.55;

  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(-5, 6, 9);
  scene.add(key);

  const camera = new PerspectiveCamera(24, 1, 0.1, 100);

  // Textures: resolution follows the rendered size (crisp text, QR stays scannable).
  const texWidth = Math.min(2048, Math.max(1024, Math.ceil((container.clientWidth * dpr * 1.3) / 256) * 256));
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const [frontMap, frontUv, backUv, ...backMaps] = await Promise.all([
    svgTexture(`${FACES}frente.svg`, texWidth, true, aniso),
    svgTexture(`${FACES}frente-uv.svg`, 1024, false, aniso),
    svgTexture(`${FACES}verso-${opts.persons[0]}-uv.svg`, 1024, false, aniso),
    ...opts.persons.map((p) => svgTexture(`${FACES}verso-${p}.svg`, texWidth, true, aniso)),
  ]);
  const backByPerson = new Map<string, Texture>(opts.persons.map((p, i) => [p, backMaps[i]]));

  const paper = { roughness: 0.82, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12 };
  const backMat = new MeshPhysicalMaterial({ ...paper, map: backByPerson.get(opts.person), clearcoatMap: backUv });
  const frontMat = new MeshPhysicalMaterial({ ...paper, map: frontMap, clearcoatMap: frontUv });
  const edgeMat = new MeshStandardMaterial({ color: 0x242424, roughness: 0.7 });

  const geometry = buildGeometry();
  const mesh = new Mesh(geometry, [backMat, frontMat, edgeMat]);
  const pivot = new Group();
  pivot.add(mesh);
  scene.add(pivot);

  /* ---------------------------------------------------------- state */
  let spin = opts.side === 'back' ? Math.PI : 0;
  let target = spin;
  let velocity = 0;
  let pendingPerson: string | null = null;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let dragging = false;
  let running = false;
  let visible = true;
  let frame = 0;
  let last = performance.now();
  const born = last;
  // Render on demand: float for a few seconds after load or interaction, then idle (saves battery/CPU).
  let floatUntil = born + 7000;
  const wake = (ms = 4000) => {
    floatUntil = Math.max(floatUntil, performance.now() + ms);
    requestFrame();
  };

  const sideOf = (angle: number): Side => ((((Math.round(angle / Math.PI) % 2) + 2) % 2 === 0 ? 'front' : 'back'));

  /* ---------------------------------------------------------- layout */
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tan = Math.tan((camera.fov * Math.PI) / 360);
    const byWidth = (W / 0.84) / (2 * tan * camera.aspect);
    const byHeight = (H * 1.45) / (2 * tan);
    camera.position.set(0, 0, Math.max(byWidth, byHeight));
    camera.updateProjectionMatrix();
    requestFrame();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  /* ---------------------------------------------------------- loop */
  function requestFrame() {
    if (!running && visible) {
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!dragging) {
      // Critically damped spring towards the target face.
      const k = 80;
      const c = 2 * Math.sqrt(k);
      velocity += (-k * (spin - target) - c * velocity) * dt;
      spin += velocity * dt;
    }
    if (pendingPerson && Math.abs(Math.cos(BASE_Y + spin)) < 0.2) {
      backMat.map = backByPerson.get(pendingPerson) ?? backMat.map;
      backMat.needsUpdate = true;
      pendingPerson = null;
    }
    const ease = 1 - Math.exp(-dt * 6);
    tilt.x += (tilt.tx - tilt.x) * ease;
    tilt.y += (tilt.ty - tilt.y) * ease;

    const t = (now - born) / 1000;
    pivot.position.y = Math.sin(t * 0.9) * 0.07;
    pivot.rotation.set(BASE_X + tilt.x + Math.sin(t * 0.7) * 0.015, BASE_Y + spin + tilt.y, BASE_Z + Math.sin(t * 0.5) * 0.012);
    key.position.x = -5 + tilt.y * 8;

    renderer.render(scene, camera);

    running = false;
    const settling =
      dragging ||
      Math.abs(spin - target) > 1e-4 ||
      Math.abs(velocity) > 1e-4 ||
      Math.abs(tilt.x - tilt.tx) > 1e-4 ||
      Math.abs(tilt.y - tilt.ty) > 1e-4 ||
      pendingPerson !== null;
    if (visible && (settling || now < floatUntil)) requestFrame();
  }

  /* ---------------------------------------------------------- input */
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);

  const finePointer = matchMedia('(pointer: fine)').matches;
  const onHover = (e: PointerEvent) => {
    if (!finePointer || dragging) return;
    const r = container.getBoundingClientRect();
    tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.3;
    tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.22;
    wake(1500);
  };
  const onLeave = () => {
    tilt.tx = 0;
    tilt.ty = 0;
    wake(1500);
  };

  let startX = 0;
  let startY = 0;
  let startSpin = 0;
  let startTime = 0;
  let samples: { t: number; a: number }[] = [];

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startSpin = spin;
    startTime = performance.now();
    samples = [{ t: startTime, a: spin }];
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return onHover(e);
    const width = container.clientWidth || 1;
    spin = startSpin + ((e.clientX - startX) / (width * 0.55)) * Math.PI;
    const now = performance.now();
    samples.push({ t: now, a: spin });
    samples = samples.filter((s) => now - s.t < 80);
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    const now = performance.now();
    const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
    if (moved < 6 && now - startTime < 250) {
      // Tap: flip.
      target = Math.round(spin / Math.PI) * Math.PI + Math.PI;
    } else {
      const first = samples[0];
      const v = first && now > first.t ? ((spin - first.a) / (now - first.t)) * 1000 : 0;
      velocity = v;
      target = Math.round((spin + v * 0.22) / Math.PI) * Math.PI;
    }
    opts.onSide(sideOf(target));
    wake();
  };

  container.addEventListener('pointermove', onHover);
  container.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  /* ---------------------------------------------------------- visibility */
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && document.visibilityState === 'visible';
    if (visible) requestFrame();
  });
  io.observe(container);
  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    if (visible) requestFrame();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const onLost = (e: Event) => {
    e.preventDefault();
    container.dispatchEvent(new CustomEvent('card:lost', { bubbles: true }));
  };
  canvas.addEventListener('webglcontextlost', onLost);

  resize();
  pivot.rotation.set(BASE_X, BASE_Y + spin, BASE_Z);
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);
  requestFrame();

  return {
    setSide(side) {
      if (sideOf(target) !== side) target += Math.PI;
      wake();
    },
    setPerson(id) {
      if (!backByPerson.has(id)) return;
      if (sideOf(target) === 'back' && sideOf(spin) === 'back') {
        // Back is showing: spin a full turn and swap the face while the card is edge-on.
        pendingPerson = id;
        target += 2 * Math.PI;
      } else {
        backMat.map = backByPerson.get(id)!;
        backMat.needsUpdate = true;
      }
      wake();
    },
    destroy() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onHover);
      container.removeEventListener('pointerleave', onLeave);
      geometry.dispose();
      [frontMat, backMat, edgeMat].forEach((m) => m.dispose());
      [frontMap, frontUv, backUv, ...backMaps].forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
