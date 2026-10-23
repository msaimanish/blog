'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'manish-portfolio-theme';

function setDocumentTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const initial: Theme = saved === 'dark' ? 'dark' : 'light';
      setDocumentTheme(initial);
      setTheme(initial);
    } catch {
      setDocumentTheme('light');
    }
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setDocumentTheme(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The toggle still works for the current page if storage is unavailable.
    }
  }

  const nextLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20.2 15.1A8.3 8.3 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        )}
      </span>
      <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
