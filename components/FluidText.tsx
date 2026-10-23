'use client';
export default function FluidText({children}:{children:string}){return <span className="fluid-text" aria-label={children}>{children.split('').map((char,i)=><span aria-hidden="true" key={`${char}-${i}`} style={{'--i':i} as React.CSSProperties}>{char===' '?'\u00a0':char}</span>)}</span>}
