'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'manish-portfolio-theme';

const listeners = new Set<() => void>();
const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function setDocumentTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  listeners.forEach((callback) => callback());
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  // The document owns the theme (a script in the layout applies the saved one before first paint).
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light' as Theme);
  const [swapped, setSwapped] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === 'dark' && readTheme() !== 'dark') setDocumentTheme('dark');
    } catch {
      // Storage unavailable: stay on the default theme.
    }
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setSwapped(true);
    const commit = () => setDocumentTheme(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The toggle still works for the current page if storage is unavailable.
    }

    // The new theme spreads out from the button like a drop of liquid (where the browser supports it).
    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !doc.startViewTransition || !button.current) {
      commit();
      return;
    }
    const rect = button.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = doc.startViewTransition(() => {
      flushSync(commit);
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 780, easing: 'cubic-bezier(.22,.8,.24,1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  }

  const nextLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      ref={button}
      type="button"
      className={`theme-toggle${swapped ? ' theme-toggle--swapped' : ''}`}
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light' ? (
          <svg key="moon" viewBox="0 0 24 24" fill="none">
            <path d="M20.2 15.1A8.3 8.3 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
          </svg>
        ) : (
          <svg key="sun" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        )}
      </span>
      <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
