'use client';

import { Fragment, useEffect, useRef } from 'react';

/**
 * Hero slogan. Letters near the pointer swell and lift, then settle back like liquid.
 * Words stay whole (they only wrap at spaces) and nothing here changes a letter's width,
 * so the lines never reflow while you hover.
 */
export default function FluidText({
  children,
  radius = 110,
  grow = 0.24,
  lift = 5,
}: {
  children: string;
  radius?: number;
  grow?: number;
  lift?: number;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;

    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-l]'));
    const level = letters.map(() => 0);
    let centers: { x: number; y: number }[] = [];
    let raf = 0;
    let inside = false;
    let px = 0;
    let py = 0;

    const measure = () => {
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    const tick = () => {
      let moving = false;
      letters.forEach((l, i) => {
        const c = centers[i];
        const target = inside && c ? Math.max(0, 1 - Math.hypot(px - c.x, py - c.y) / radius) : 0;
        level[i] += (target - level[i]) * 0.17;
        if (Math.abs(target - level[i]) > 0.003) moving = true;
        else level[i] = target;
        const t = level[i] * level[i] * (3 - 2 * level[i]); // smoothstep, so the swell has a soft shoulder
        l.style.transform = t ? `translateY(${(-lift * t).toFixed(2)}px) scale(${(1 + grow * t).toFixed(3)})` : '';
      });
      raf = moving || inside ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const enter = (e: PointerEvent) => {
      inside = true;
      px = e.clientX;
      py = e.clientY;
      measure();
      kick();
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const leave = () => {
      inside = false;
      kick();
    };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [children, radius, grow, lift]);

  const words = children.split(' ');
  return (
    <>
      <span ref={root} className="fx-text" aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            <span className="fx-word">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} data-l className="fx-letter">
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{children}</span>
    </>
  );
}
