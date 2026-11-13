import { prefersReducedMotion } from './utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number;
  maxLife: number;
}

const COLORS = ['#0b3d2e', '#f59e0b', '#15803d', '#fbbf24', '#2c6e58'];

export function triggerConfettiBurst(originEl?: HTMLElement | null): void {
  if (typeof window === 'undefined' || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  canvas.setAttribute('aria-hidden', 'true');

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  let originX = window.innerWidth / 2;
  let originY = window.innerHeight * 0.38;
  if (originEl) {
    const rect = originEl.getBoundingClientRect();
    originX = rect.left + rect.width / 2;
    originY = Math.min(Math.max(rect.top + rect.height / 2, 80), window.innerHeight - 100);
  }

  const particles: Particle[] = Array.from({ length: 34 }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
    const speed = 3.5 + Math.random() * 5.5;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      size: 5 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      life: 0,
      maxLife: 48 + Math.floor(Math.random() * 20),
    };
  });

  let rafId = 0;

  const tick = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;

    for (const p of particles) {
      p.life += 1;
      if (p.life >= p.maxLife) continue;
      alive += 1;
      p.vy += 0.22;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;

      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      ctx.restore();
    }

    if (alive > 0) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      window.cancelAnimationFrame(rafId);
      canvas.remove();
    }
  };

  rafId = window.requestAnimationFrame(tick);
}
