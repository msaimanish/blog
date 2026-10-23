import type { Metadata } from 'next';
import './globals.css';
import NavSlider from '@/components/NavSlider';
import EffectsCanvas from '@/components/EffectsCanvas';
import ChatBubble from '@/components/ChatBubble';

export const metadata: Metadata = {
  title: 'Sai Manish Reddy M — AI/ML Engineer',
  description: 'Building intelligent systems through machine learning, thoughtful engineering, and continuous experimentation.',
  metadataBase: new URL('https://example.com'),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><EffectsCanvas /><NavSlider /><main className="site-shell">{children}</main><ChatBubble /></body></html>;
}
