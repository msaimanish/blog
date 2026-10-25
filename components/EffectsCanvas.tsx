'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';


type Particle = {
  x: number;
  y: number;
  phase: number;
  speed: number;
  radius: number;
  offsetX: number;
  offsetY: number;
  pushVX: number;
  pushVY: number;
};

type TrailPoint = { x: number; y: number; time: number; speed: number };
type ProtectedRect = { left: number; top: number; right: number; bottom: number };

const TRAIL_LIFETIME_MS = 110;
const TRAIL_MAX_POINTS = 18;
const POINTER_RADIUS = 190;

// ---------------------------------------------------------------------------
// Liquid-glass interaction layer (styles live at the end of app/globals.css)
// ---------------------------------------------------------------------------

/**
 * Shared liquid-glass behaviour, wired up once for the whole site with event delegation:
 *  - a specular highlight that follows the pointer across any glass surface,
 *  - a gentle lift on cards (no rotation: tilting a card softens its text),
 *  - a magnetic pull on buttons,
 *  - a ripple where you press,
 *  - cards that condense into view as you scroll to them.
 * Everything is driven by CSS variables (see app/liquid.css). Nothing renders.
 */
const SURFACE = '.glass, .nav-glass, .theme-toggle, .skill-chip, .timeline article, .contact-item';
const MAGNET = '.social-button, .email-cta, .theme-toggle, .chat-launch, .nav-resume';
const REVEAL = '.project-card, .skill-card, .education-card, .post-card, .empty-post, .contact-note, .email-cta';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function useGlassEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    root.classList.add('lg-ready');
    if (reduced) return () => root.classList.remove('lg-ready');

    let px = -1;
    let py = -1;
    let raf = 0;
    let hot = new Set<HTMLElement>();
    let pulled: HTMLElement | null = null;

    // Buttons lean toward the pointer, eased so they never snap.
    const pulls = new Map<HTMLElement, { x: number; y: number; tx: number; ty: number }>();
    let pullRaf = 0;
    const pullTick = () => {
      pullRaf = 0;
      let moving = false;
      pulls.forEach((p, el) => {
        p.x += (p.tx - p.x) * 0.2;
        p.y += (p.ty - p.y) * 0.2;
        const settled = Math.abs(p.x - p.tx) < 0.02 && Math.abs(p.y - p.ty) < 0.02;
        if (settled && p.tx === 0 && p.ty === 0) {
          el.style.removeProperty('--lg-mgx');
          el.style.removeProperty('--lg-mgy');
          pulls.delete(el);
          return;
        }
        if (!settled) moving = true;
        el.style.setProperty('--lg-mgx', `${p.x.toFixed(2)}px`);
        el.style.setProperty('--lg-mgy', `${p.y.toFixed(2)}px`);
      });
      if (moving) pullRaf = requestAnimationFrame(pullTick);
    };
    const setPull = (el: HTMLElement, tx: number, ty: number) => {
      const p = pulls.get(el) ?? { x: 0, y: 0, tx: 0, ty: 0 };
      p.tx = tx;
      p.ty = ty;
      pulls.set(el, p);
      if (!pullRaf) pullRaf = requestAnimationFrame(pullTick);
    };

    const update = () => {
      raf = 0;
      const under = px >= 0 ? document.elementFromPoint(px, py) : null;

      // Every glass surface the pointer is over (a chip inside a card lights both).
      const next = new Set<HTMLElement>();
      for (let el = under as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
        if (el.matches(SURFACE)) next.add(el);
      }
      hot.forEach((el) => {
        if (!next.has(el)) el.removeAttribute('data-lg-hot');
      });
      next.forEach((el) => {
        if (!hot.has(el)) el.setAttribute('data-lg-hot', '');
        const r = el.getBoundingClientRect();
        el.style.setProperty('--lg-mx', `${(px - r.left).toFixed(0)}px`);
        el.style.setProperty('--lg-my', `${(py - r.top).toFixed(0)}px`);
      });
      hot = next;

      const pull = under?.closest<HTMLElement>(MAGNET) ?? null;
      if (pull !== pulled) {
        if (pulled) setPull(pulled, 0, 0);
        pulled = pull;
      }
      if (pull) {
        const r = pull.getBoundingClientRect();
        setPull(
          pull,
          clamp((px - (r.left + r.width / 2)) * 0.16, -5, 5),
          clamp((py - (r.top + r.height / 2)) * 0.2, -4, 4),
        );
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX;
      py = e.clientY;
      schedule();
    };
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      px = py = -1;
      schedule();
    };

    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(SURFACE);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--lg-rx', `${(e.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty('--lg-ry', `${(e.clientY - r.top).toFixed(0)}px`);
      el.classList.remove('lg-ripple');
      void el.offsetWidth; // restart the animation if it is already running
      el.classList.add('lg-ripple');
      window.setTimeout(() => el.classList.remove('lg-ripple'), 900);
    };

    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('scroll', schedule, { passive: true });
      document.addEventListener('mouseout', onOut);
    }
    window.addEventListener('pointerdown', onDown, { passive: true });

    // Cards below the fold condense into view the first time they are reached.
    const items = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.96,
    );
    items.forEach((el) => el.setAttribute('data-lg-in', 'pending'));
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty('--lg-d', `${n * 80}ms`);
          el.setAttribute('data-lg-in', 'done');
          window.setTimeout(() => el.style.removeProperty('--lg-d'), 1600); // the stagger delay must not linger on hover
          io.unobserve(el);
          n += 1;
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    items.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('pointerdown', onDown);
      hot.forEach((el) => el.removeAttribute('data-lg-hot'));
      cancelAnimationFrame(pullRaf);
      pulls.forEach((_, el) => {
        el.style.removeProperty('--lg-mgx');
        el.style.removeProperty('--lg-mgy');
      });
      items.forEach((el) => el.removeAttribute('data-lg-in'));
      root.classList.remove('lg-ready');
    };
  }, []);
}

/** A thin bar at the top of blog posts that fills as you read. */
function useReadingProgress() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname.startsWith('/blog/') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bar = document.createElement('div');
    bar.className = 'lg-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--lg-progress', String(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      bar.remove();
    };
  }, [pathname]);
}

export default function EffectsCanvas() {
  useGlassEffects();
  useReadingProgress();
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const particlesCanvas = particlesCanvasRef.current;
    const cursorCanvas = cursorCanvasRef.current;
    const particlesContext = particlesCanvas?.getContext('2d');
    const cursorContext = cursorCanvas?.getContext('2d');
    if (!particlesCanvas || !cursorCanvas || !particlesContext || !cursorContext) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let isDark = document.documentElement.dataset.theme === 'dark';
    let particles: Particle[] = [];
    let trail: TrailPoint[] = [];
    let lastPointerMove = -Infinity;

    const pointer = { x: -10_000, y: -10_000, previousX: -10_000, previousY: -10_000 };
    const particleColor = () =>
      isDark ? 'rgba(225,225,225,0.43)' : 'rgba(54,54,54,0.30)';

    // Natural, non-orbital flow. Particles drift through a smooth changing field.
    const flowAngle = (particle: Particle, time: number) => {
      const nx = particle.x / Math.max(width, 1);
      const ny = particle.y / Math.max(height, 1);
      return (
        Math.sin(ny * Math.PI * 3.2 + time * 0.58 + particle.phase) * 0.88 +
        Math.cos(nx * Math.PI * 2.4 - time * 0.39 + particle.phase * 0.71) * 0.58 +
        Math.sin((nx + ny) * Math.PI * 1.7 + particle.phase) * 0.22
      );
    };

    const sizeCanvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getProtectedRects = (): ProtectedRect[] => {
      // Keep the ambient particles from cluttering the name and hero copy.
      // Cursor slicing is rendered on a separate top layer and is not clipped here.
      const selectors = ['.hero .name-script', '.hero .role-line', '.hero .hero-line'];
      return selectors.flatMap((selector) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > height) return [];
        const pad = selector.endsWith('name-script') ? 22 : selector.endsWith('role-line') ? 14 : 18;
        return [{
          left: Math.max(0, rect.left - pad),
          top: Math.max(0, rect.top - pad),
          right: Math.min(width, rect.right + pad),
          bottom: Math.min(height, rect.bottom + pad),
        }];
      });
    };

    const pointIsProtected = (x: number, y: number, rects: ProtectedRect[]) =>
      rects.some((rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);

    const drawStaticParticles = () => {
      particlesContext.clearRect(0, 0, width, height);
      cursorContext.clearRect(0, 0, width, height);
      particlesContext.fillStyle = particleColor();
      const protectedRects = getProtectedRects();
      for (const particle of particles) {
        if (pointIsProtected(particle.x, particle.y, protectedRects)) continue;
        particlesContext.beginPath();
        particlesContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particlesContext.fill();
      }
    };

    const resize = () => {
      const previousWidth = width;
      const previousHeight = height;
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;

      width = nextWidth;
      height = nextHeight;
      sizeCanvas(particlesCanvas, particlesContext);
      sizeCanvas(cursorCanvas, cursorContext);

      if (particles.length === 0) {
        const areaCount = Math.floor((width * height) / 1550);
        const count = Math.max(160, Math.min(coarsePointer ? 250 : 520, areaCount));
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          phase: Math.random() * Math.PI * 2,
          speed: 23 + Math.random() * 25,
          radius: 2.2 + Math.random() * 1.5,
          offsetX: 0,
          offsetY: 0,
          pushVX: 0,
          pushVY: 0,
        }));
      } else if (previousWidth > 0 && previousHeight > 0) {
        // Keep particle positions instead of randomising the whole field on resize.
        // Mobile browsers can emit resize events when their address bar expands/collapses.
        const widthChanged = Math.abs(width - previousWidth) > 2;
        const heightChanged = Math.abs(height - previousHeight) > 2;
        const likelyMobileBrowserChromeResize = coarsePointer && !widthChanged;

        if (widthChanged || (heightChanged && !likelyMobileBrowserChromeResize)) {
          const scaleX = width / previousWidth;
          const scaleY = height / previousHeight;
          for (const particle of particles) {
            if (widthChanged) {
              particle.x *= scaleX;
              particle.offsetX *= scaleX;
              particle.pushVX *= scaleX;
            }
            if (heightChanged && !likelyMobileBrowserChromeResize) {
              particle.y *= scaleY;
              particle.offsetY *= scaleY;
              particle.pushVY *= scaleY;
            }
          }
        }
      }

      if (coarsePointer) trail = [];
      if (reducedMotion) drawStaticParticles();
    };

    const onPointerMove = (event: PointerEvent) => {
      // Touchscreens get a calm, continuously moving background only.
      if (coarsePointer || event.pointerType === 'touch' || reducedMotion) return;
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      const now = performance.now();
      const hasPreviousPoint = pointer.previousX >= 0 && pointer.previousY >= 0;
      if (hasPreviousPoint) {
        const dx = pointer.x - pointer.previousX;
        const dy = pointer.y - pointer.previousY;
        const speed = Math.hypot(dx, dy);
        // A short pause breaks the cut, so it ends with the cursor instead of lingering.
        if (now - lastPointerMove > 52) trail = [];
        trail.push({ x: pointer.x, y: pointer.y, time: now, speed });
        if (trail.length > TRAIL_MAX_POINTS) trail = trail.slice(-TRAIL_MAX_POINTS);
      }
      lastPointerMove = now;
    };

    const updateParticles = (deltaSeconds: number, protectedRects: ProtectedRect[]) => {
      const dt = Math.min(deltaSeconds, 0.035);
      for (const particle of particles) {
        const angle = flowAngle(particle, elapsed);
        particle.x += Math.cos(angle) * particle.speed * dt;
        particle.y += Math.sin(angle) * particle.speed * dt;

        const padding = 12;
        if (particle.x < -padding) particle.x = width + padding;
        else if (particle.x > width + padding) particle.x = -padding;
        if (particle.y < -padding) particle.y = height + padding;
        else if (particle.y > height + padding) particle.y = -padding;

        // Repulsion is a desktop-only effect; on mobile particles only follow the flow field.
        if (!coarsePointer) {
          const drawX = particle.x + particle.offsetX;
          const drawY = particle.y + particle.offsetY;
          const dx = drawX - pointer.x;
          const dy = drawY - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.001 && distance < POINTER_RADIUS) {
            const strength = (1 - distance / POINTER_RADIUS) * 520 * dt;
            particle.pushVX += (dx / distance) * strength;
            particle.pushVY += (dy / distance) * strength;
          }
        }

        particle.pushVX += -particle.offsetX * 16 * dt;
        particle.pushVY += -particle.offsetY * 16 * dt;
        const damping = Math.exp(-7.5 * dt);
        particle.pushVX *= damping;
        particle.pushVY *= damping;
        particle.offsetX += particle.pushVX * dt;
        particle.offsetY += particle.pushVY * dt;

        if (
          Math.abs(particle.offsetX) < 0.08 &&
          Math.abs(particle.offsetY) < 0.08 &&
          Math.abs(particle.pushVX) < 0.1 &&
          Math.abs(particle.pushVY) < 0.1
        ) {
          particle.offsetX = 0;
          particle.offsetY = 0;
          particle.pushVX = 0;
          particle.pushVY = 0;
        }

        const renderX = particle.x + particle.offsetX;
        const renderY = particle.y + particle.offsetY;
        if (pointIsProtected(renderX, renderY, protectedRects)) continue;

        particlesContext.beginPath();
        particlesContext.arc(renderX, renderY, particle.radius, 0, Math.PI * 2);
        particlesContext.fillStyle = particleColor();
        particlesContext.fill();
      }
    };

    const drawSlicingTrail = (now: number) => {
      cursorContext.clearRect(0, 0, width, height);
      cursorContext.lineCap = 'round';
      cursorContext.lineJoin = 'round';

      for (let index = 1; index < trail.length; index += 1) {
        const start = trail[index - 1];
        const end = trail[index];
        const age = now - end.time;
        if (age < 0 || age > TRAIL_LIFETIME_MS || end.time - start.time > 45) continue;

        const opacity = Math.pow(1 - age / TRAIL_LIFETIME_MS, 0.78);
        const strokeWidth = Math.max(5.8, Math.min(8.2, 8.2 - end.speed * 0.012));
        cursorContext.beginPath();
        cursorContext.moveTo(start.x, start.y);
        cursorContext.lineTo(end.x, end.y);
        // White is intentionally used with CSS mix-blend-mode:difference.
        // Pixels underneath the cut invert from black to white and vice versa.
        cursorContext.strokeStyle = `rgba(255,255,255,${opacity * 0.98})`;
        cursorContext.lineWidth = strokeWidth;
        cursorContext.stroke();
      }

      trail = trail.filter((point) => now - point.time <= TRAIL_LIFETIME_MS);
    };

    const draw = (now: number) => {
      frame = window.requestAnimationFrame(draw);
      if (document.hidden) return;

      const deltaSeconds = lastFrame
        ? Math.min((now - lastFrame) / 1000, 0.035)
        : 1 / 60;
      lastFrame = now;
      elapsed += deltaSeconds;
      particlesContext.clearRect(0, 0, width, height);
      const protectedRects = getProtectedRects();
      updateParticles(deltaSeconds, protectedRects);
      if (coarsePointer) {
        cursorContext.clearRect(0, 0, width, height);
      } else {
        drawSlicingTrail(now);
      }
    };

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.dataset.theme === 'dark';
      if (reducedMotion) drawStaticParticles();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    resize();
    window.addEventListener('resize', resize);
    if (!coarsePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    if (!reducedMotion) frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      if (!coarsePointer) {
        window.removeEventListener('pointermove', onPointerMove);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={particlesCanvasRef}
        className="effects-canvas effects-canvas--particles"
        aria-hidden="true"
      />
      <canvas
        ref={cursorCanvasRef}
        className="effects-canvas effects-canvas--cursor"
        aria-hidden="true"
      />
    </>
  );
}
