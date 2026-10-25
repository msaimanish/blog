'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const NAME = 'Sai Manish Reddy M';
const TYPE_DELAY_MS = 85;
const START_DELAY_MS = 250;

export default function NameReveal() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const visibleCharacters = reduced ? NAME.length : typed;
  const ref = useRef<HTMLHeadingElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const done = visibleCharacters >= NAME.length;

  // Typing effect (unchanged behaviour).
  useEffect(() => {
    if (reduced) return;

    let count = 0;
    let typeTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      typeTimer = window.setInterval(() => {
        count += 1;
        setTyped(count);
        if (count >= NAME.length && typeTimer !== undefined) {
          window.clearInterval(typeTimer);
        }
      }, TYPE_DELAY_MS);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
      if (typeTimer !== undefined) window.clearInterval(typeTimer);
    };
  }, [reduced]);

  // A glint that follows the pointer across the letters.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;

    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      const r = (typedRef.current ?? el).getBoundingClientRect();
      el.style.setProperty('--lg-nx', `${(px - r.left).toFixed(0)}px`);
      el.style.setProperty('--lg-ny', `${(py - r.top).toFixed(0)}px`);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h1 ref={ref} className="name-script name-typing" data-done={done ? 'true' : undefined} aria-label={NAME}>
      <span ref={typedRef} className="name-typed" aria-hidden="true">
        {NAME.slice(0, visibleCharacters)}
      </span>
      {!done && <span className="name-caret" aria-hidden="true" />}
    </h1>
  );
}
