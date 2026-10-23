'use client';
import { useEffect, useRef } from 'react';

type Particle = { x:number; y:number; vx:number; vy:number; r:number };
export default function EffectsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    let w=0,h=0,raf=0,last=0; const pointer={x:-9999,y:-9999,px:-9999,py:-9999}; const strokes:{x:number;y:number;life:number;speed:number}[]=[]; let particles:Particle[]=[];
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,1.5);w=window.innerWidth;h=window.innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);const count=reduced?0:Math.min(touch?220:850,Math.floor(w*h/1500));particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.4+.35}));};
    const move=(e:PointerEvent)=>{pointer.px=pointer.x;pointer.py=pointer.y;pointer.x=e.clientX;pointer.y=e.clientY;const dx=pointer.x-pointer.px,dy=pointer.y-pointer.py;strokes.push({x:pointer.x,y:pointer.y,life:1,speed:Math.hypot(dx,dy)});if(strokes.length>50)strokes.shift();};
    const draw=(time:number)=>{raf=requestAnimationFrame(draw);if(document.hidden)return;if(time-last<24)return;last=time;ctx.clearRect(0,0,w,h);
      for(const p of particles){const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);if(d<105&&d>0){const force=(105-d)/105*.65;p.vx+=(dx/d)*force;p.vy+=(dy/d)*force;}p.vx+=(Math.random()-.5)*.012;p.vy+=(Math.random()-.5)*.012;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(180,205,255,.42)';ctx.fill();}
      strokes.forEach(s=>{s.life-=.025;if(s.life<=0)return;ctx.beginPath();ctx.arc(s.x,s.y,Math.min(2.6,1+s.speed*.025),0,Math.PI*2);ctx.fillStyle=`rgba(180,210,255,${s.life*.22})`;ctx.fill();});for(let i=strokes.length-1;i>=0;i--)if(strokes[i].life<=0)strokes.splice(i,1);
    };
    resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});if(!reduced)raf=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);};
  },[]);
  return <canvas ref={ref} className="effects-canvas" aria-hidden="true" />;
}
