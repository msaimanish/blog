'use client';

import { useEffect, useState } from 'react';

const NAME = 'Sai Manish Reddy M';
const TYPE_DELAY_MS = 85;
const START_DELAY_MS = 250;

export default function NameReveal() {
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCharacters(NAME.length);
      return;
    }

    let count = 0;
    let typeTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      typeTimer = window.setInterval(() => {
        count += 1;
        setVisibleCharacters(count);
        if (count >= NAME.length && typeTimer !== undefined) {
          window.clearInterval(typeTimer);
        }
      }, TYPE_DELAY_MS);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
      if (typeTimer !== undefined) window.clearInterval(typeTimer);
    };
  }, []);

  return (
    <h1 className="name-script name-typing" aria-label={NAME}>
      <span className="name-typed" aria-hidden="true">
        {NAME.slice(0, visibleCharacters)}
      </span>
      {visibleCharacters < NAME.length && (
        <span className="name-caret" aria-hidden="true" />
      )}
    </h1>
  );
}
