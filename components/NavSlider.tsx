'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '/', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
];

const DOCK_SCROLL_THRESHOLD = 90;
// The vertical dock sits in the left margin, so it only appears when the page is wide enough
// to leave that margin free (content column is 1120px plus the dock). Below this it stays a top pill.
const DOCK_MIN_WIDTH = 1320;

export default function NavSlider() {
  const path = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isDocked, setIsDocked] = useState(false);
  const [squish, setSquish] = useState(false);
  const previous = useRef<string | null>(null);

  const active = path.startsWith('/blog')
    ? '/blog'
    : path.startsWith('/contact')
      ? '/contact'
      : '/';

  useEffect(() => {
    let frame = 0;

    const updateDockState = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setIsDocked(window.innerWidth >= DOCK_MIN_WIDTH && window.scrollY > DOCK_SCROLL_THRESHOLD);
        frame = 0;
      });
    };

    updateDockState();
    window.addEventListener('scroll', updateDockState, { passive: true });
    window.addEventListener('resize', updateDockState, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateDockState);
      window.removeEventListener('resize', updateDockState);
    };
  }, []);

  // When the active page changes, the glass pill squashes and settles as it arrives.
  useEffect(() => {
    if (previous.current === null) {
      previous.current = active;
      return;
    }
    if (previous.current === active || prefersReducedMotion) return;
    previous.current = active;
    setSquish(true);
    const timer = window.setTimeout(() => setSquish(false), 900);
    return () => window.clearTimeout(timer);
  }, [active, prefersReducedMotion]);

  const spring = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 360, damping: 32, mass: 0.82 };

  return (
    <motion.header
      className={`nav-wrap${isDocked ? ' nav-wrap--docked' : ''}`}
      initial={false}
      animate={{ top: isDocked ? 16 : 24 }}
      transition={spring}
    >
      <motion.nav
        layout
        className={`nav-glass${isDocked ? ' nav-glass--docked' : ''}${squish ? ' nav-glass--squish' : ''}`}
        aria-label="Main navigation"
        transition={spring}
      >
        {links.map((link) => (
          <motion.div layout key={link.href} className="nav-item" transition={spring}>
            <Link
              href={link.href}
              className={`nav-link${active === link.href ? ' active' : ''}`}
              aria-current={active === link.href ? 'page' : undefined}
            >
              {active === link.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="nav-pill"
                  transition={spring}
                />
              )}
              <span>{link.label}</span>
            </Link>
          </motion.div>
        ))}
        <motion.div layout key="/resume" className="nav-item nav-item--resume" transition={spring}>
          <a
            href="/cv_manish.pdf"
            download
            className="nav-link nav-resume"
            aria-label="Download resume (PDF)"
            title="Download resume (PDF)"
          >
            Resume
          </a>
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
