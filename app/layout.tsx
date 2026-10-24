import type { Metadata } from 'next';
import './globals.css';
import NavSlider from '@/components/NavSlider';
import EffectsCanvas from '@/components/EffectsCanvas';
import ChatBubble from '@/components/ChatBubble';
import ThemeToggle from '@/components/ThemeToggle';

const SITE_URL = 'https://www.msaimanish.tech';

const SITE_TITLE =
  'Manish';

const SITE_DESCRIPTION =
  'I\'m Sai Manish Reddy M, a Computer Science undergraduate at GITAM University, Hyderabad. I build AI/ML applications, agentic AI systems, computer vision projects, and full-stack software. Explore my projects, experience, and technical writing.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: '%s | Sai Manish Reddy M',
  },

  description: SITE_DESCRIPTION,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Sai Manish Reddy M',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
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
