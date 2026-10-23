# Sai Manish Reddy M — Portfolio & Blog

A personal portfolio and source-controlled blog for **Sai Manish Reddy M**, a Computer Science undergraduate at GITAM University, Hyderabad, focused on AI/ML engineering, agentic AI, NLP, computer vision, and MLOps.

> I build things, break things, learn new things, and occasionally make something cool.

The site uses a minimal monochrome visual system with light/dark themes, restrained liquid-glass surfaces, pointer-reactive particles, an animated name reveal, and a portfolio-aware AI chat assistant.

## Features

- **About page (`/`)** — hero, featured projects, about section, technical toolkit, milestones, education, and social links.
- **Contact page (`/contact`)** — email and social links without requiring a separate backend.
- **Blog (`/blog`)** — source-controlled Markdown/MDX posts with individual article pages at `/blog/[slug]`.
- **Source-only publishing** — create or edit a post in `content/blog/` and push it to Git; no CMS, admin panel, or database is required.
- **Monochrome light/dark themes** — white/black palette, accessible contrast, and a circular reveal when switching themes. The preference is stored locally in the browser.
- **Liquid-glass styling** — translucent surfaces, soft highlights, restrained borders, backdrop blur, and subtle depth.
- **Animated navigation** — the About / Contact / Blog pill uses a spring-animated active indicator. On desktop it can move into a vertical dock while scrolling; on mobile it remains horizontal.
- **Interactive canvas** — moving particles react to the pointer and settle back into their flow; a short brush/slicing trail follows cursor movement. The canvas uses a shared drawing layer rather than a DOM element per particle.
- **Animated name** — “Sai Manish Reddy M” types onto the page and has a subtle pointer-responsive depth/tilt treatment.
- **Portrait branding** — `public/AI_scientist.JPG` is the supplied portrait asset, with `app/icon.jpg` used for the browser-tab icon and the portrait available for the chat assistant avatar.
- **Responsive and reduced-motion support** — layouts adapt to small screens and motion is reduced when the browser requests it.
- **Optional AI portfolio assistant** — a floating chat panel calls NVIDIA's OpenAI-compatible chat-completions endpoint through a Next.js route handler. The API key stays server-side.
- **Static-first content** — the portfolio and blog do not need a standalone backend, Docker, or database.

## Tech stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js App Router, React, TypeScript |
| Styling | CSS, Tailwind CSS v4 |
| Animation | Framer Motion, CSS transitions, Canvas API |
| Blog | Markdown/MDX, frontmatter, build-time post generation |
| AI assistant | Next.js Route Handler, NVIDIA hosted OpenAI-compatible API |
| Deployment | Vercel |

## Getting started

### Requirements

- Node.js **20.9 or newer** (Node.js 22 LTS is a good default)
- npm
- Git (recommended)

### Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional AI chat configuration

The portfolio and blog can run without AI credentials. To enable the chat assistant, create a local environment file and add an NVIDIA API key and model identifier:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```dotenv
NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

Use a model identifier currently supported by your NVIDIA account and endpoint. Restart the development server after changing environment variables. If chat configuration is absent or the upstream service fails, the site should show a friendly fallback.

### Security notes

- Never commit `.env.local` or real API credentials.
- Keep `NVIDIA_API_KEY` server-side; do not give it a `NEXT_PUBLIC_` prefix.
- The chat route uses portfolio information as its reference context. Update the route's knowledge notes when portfolio facts change.
- Before opening the assistant to significant public traffic, add and test rate limiting and abuse protection.

## Editing the site

- **Home/About content:** `app/page.tsx`
- **Global colours, themes, typography, and layout styling:** `app/globals.css`
- **Root layout and shared components:** `app/layout.tsx`
- **Navigation:** `components/NavSlider.tsx`
- **Light/dark toggle:** `components/ThemeToggle.tsx`
- **Name animation:** `components/NameReveal.tsx`
- **Particles and pointer trail:** `components/EffectsCanvas.tsx`
- **Chat UI:** `components/ChatBubble.tsx`
- **Chat API and portfolio knowledge:** `app/api/chat/route.ts`
- **Contact page:** `app/contact/page.tsx`
- **Blog content:** `content/blog/`
- **Portrait asset:** `public/AI_scientist.JPG`
- **Browser-tab icon:** `app/icon.jpg`

## Writing a blog post

Create a `.md` or `.mdx` file under `content/blog/`. The filename becomes the URL slug.

Example: `content/blog/my-first-article.mdx`

```md
---
title: "My First Article"
date: "2026-11-01"
summary: "A short description shown on the blog index."
tags: [AI, Engineering, Learning]
draft: false
---

# The article begins here

Write your post using Markdown or MDX.

## A section

Share an idea, code example, experiment, or lesson learned.
```

### Frontmatter fields

| Field | Purpose |
| --- | --- |
| `title` | Post title |
| `date` | Publication date in `YYYY-MM-DD` format |
| `summary` | Description shown in the blog listing |
| `tags` | Topic labels |
| `draft` | Set to `true` to hide a post from the public listing |

Posts are listed newest first. Publishing a post means setting `draft: false`, committing the file, and pushing it to the connected Git repository. Vercel can then rebuild and deploy the site automatically.

## Featured projects

- **NexCord** — an agentic incident-management system that detects scheduling and resource conflicts and proposes resolution plans. Its observe–analyze–approve–execute–verify–recover workflow emphasises human approval, auditability, and recovery.
- **SIFSentinel** — an AI/NLP safety-intelligence platform for identifying potential Serious Injury and Fatality precursors in incident and near-miss reports, using classification, precursor extraction, risk prioritisation, and semantic retrieval.
- **ClassSense AI** — a classroom attendance and analytics application using face embeddings, cloud-backed attendance records, and natural-language analytics.

## About Manish

Manish is pursuing a B.Tech in Computer Science at GITAM University, Hyderabad (2024–expected April 2028), with a CGPA of 9.67/10.0. Before GITAM, he studied Mathematical and Physical Sciences at the University of Toronto and was named to the Dean's List in 2023.

He served as Web Development Lead at G-ELECTRA Tech Club, GITAM University, from August 2025 to August 2026.

### Selected achievements

- **EduHacks 2022** — First Overall Winner for Slidesmart (Major League Hacking, December 2022).
- **NewHacks 2022** — Winner of the Synopsys Smart Everything Sponsor Prize for tPay (November 2022).
- **Harvest Hacks** — 2nd Place Overall for Weed Detech (November 2022).
- **Smart India Hackathon 2026** — Internal-round qualifier among 154 teams with SIFSentinel for Oil India Limited; this was an internal qualification, not an overall win.

### Links

- GitHub: [@msaimanish](https://github.com/msaimanish)
- LinkedIn: [msaimanish](https://www.linkedin.com/in/msaimanish/)
- X: [@msaimanish](https://x.com/msaimanish)
- Bluesky: [msaimanish.bsky.social](https://bsky.app/profile/msaimanish.bsky.social)
- Email: [msaimanishreddy123@gmail.com](mailto:msaimanishreddy123@gmail.com)

## Production build

Run a local production build before deployment:

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/).
3. Use the detected Next.js build settings.
4. Add `NVIDIA_API_KEY` and `NVIDIA_MODEL` to Vercel Environment Variables if enabling the assistant.
5. Deploy and test the About, Contact, Blog, theme toggle, mobile navigation, and chat experience.

Set the production branch to `main` and use feature branches for UI changes so you can review Vercel preview deployments before merging to production.

## Project structure

```text
.
├── app/
│   ├── api/chat/route.ts       # Server-side AI chat endpoint
│   ├── blog/                   # Blog index and individual post pages
│   ├── contact/page.tsx        # Contact page
│   ├── globals.css             # Global design system and themes
│   ├── icon.jpg                # Browser-tab icon
│   ├── layout.tsx              # Root layout and shared components
│   └── page.tsx                # About / home page
├── components/
│   ├── ChatBubble.tsx          # Floating AI assistant
│   ├── EffectsCanvas.tsx       # Particle field and cursor trail
│   ├── FluidText.tsx           # Hero slogan text wrapper
│   ├── Glass.tsx               # Reusable glass surface
│   ├── NameReveal.tsx          # Typing and depth effect for the name
│   ├── NavSlider.tsx           # Animated page navigation
│   └── ThemeToggle.tsx         # Light/dark mode switch
├── content/
│   ├── about-me.md             # Optional assistant knowledge reference
│   └── blog/                   # Source-controlled Markdown/MDX posts
├── public/
│   └── AI_scientist.JPG        # Portrait used by the site
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

The exact files may vary slightly as the project evolves; update this structure when routes or components are added or removed.
