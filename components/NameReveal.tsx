'use client';
import { useEffect, useState } from 'react';
export default function NameReveal(){const [ready,setReady]=useState(false);useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setReady(true);return;}const key='manish-name-revealed';if(sessionStorage.getItem(key)){setReady(true);return;}const t=window.setTimeout(()=>{setReady(true);sessionStorage.setItem(key,'1');},120);return()=>clearTimeout(t);},[]);return <h1 className={`name-script ${ready?'revealed':''}`} aria-label="Sai Manish Reddy M"><span>Sai Manish Reddy M</span></h1>}
