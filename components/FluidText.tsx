import type { CSSProperties } from 'react';

export default function FluidText({ children }: { children: string }) {
  return (
    <>
      <span className="fluid-text" aria-hidden="true">
        {Array.from(children).map((character, index) => (
          <span
            className="fluid-letter"
            key={`${character}-${index}`}
            style={{ '--i': index } as CSSProperties}
          >
            {character === ' ' ? '\u00a0' : character}
          </span>
        ))}
      </span>
      <span className="sr-only">{children}</span>
    </>
  );
}
