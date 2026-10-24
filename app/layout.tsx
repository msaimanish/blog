import type { Metadata } from 'next';
import './globals.css';
import NavSlider from '@/components/NavSlider';
import EffectsCanvas from '@/components/EffectsCanvas';
import ChatBubble from '@/components/ChatBubble';
import ThemeToggle from '@/components/ThemeToggle';

const SITE_URL = 'https://www.msaimanish.tech';
const SITE_DESCRIPTION =
  'Personal portfolio of Sai Manish Reddy M, exploring AI/ML engineering, agentic AI, software development, and the projects behind the code.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Manish',
    template: '%s | Manish',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Sai Manish Reddy M',
    title: 'Sai Manish Reddy M',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sai Manish Reddy M',
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <EffectsCanvas />
        <NavSlider />
        <ThemeToggle />
        <main className="site-shell">{children}</main>
        <ChatBubble />
      </body>
    </html>
  );
}
