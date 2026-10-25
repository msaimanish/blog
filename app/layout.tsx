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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts load in parallel with the stylesheet (this replaces the @import that used to sit at the top of globals.css). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap" />
        {/* Apply the saved theme before first paint so dark-mode visitors never see a white flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('manish-portfolio-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}",
          }}
        />
      </head>
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
