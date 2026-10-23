'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
const links = [{ href: '/', label: 'About' }, { href: '/contact', label: 'Contact' }, { href: '/blog', label: 'Blog' }];
export default function NavSlider() {
  const path = usePathname();
  const active = path.startsWith('/blog') ? '/blog' : path.startsWith('/contact') ? '/contact' : '/';
  return <header className="nav-wrap"><nav className="nav-glass" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} className={`nav-link ${active === link.href ? 'active' : ''}`} aria-current={active === link.href ? 'page' : undefined}>{active === link.href && <motion.span layoutId="nav-pill" className="nav-pill" transition={{type:'spring', stiffness:420, damping:32}}/>}<span>{link.label}</span></Link>)}</nav></header>;
}
