'use client';

import { useEffect, useRef } from 'react';

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

export default function EffectsCanvas() {
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
      width = window.innerWidth;
      height = window.innerHeight;
      sizeCanvas(particlesCanvas, particlesContext);
      sizeCanvas(cursorCanvas, cursorContext);

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

      if (reducedMotion) drawStaticParticles();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reducedMotion) return;
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
      drawSlicingTrail(now);
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
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    if (!reducedMotion) frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
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
