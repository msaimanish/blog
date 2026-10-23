# Sai Manish Reddy M — Portfolio & Blog

A personal portfolio and source-controlled blog built around a dark, Apple-inspired **liquid glass** interface. The site showcases my work in AI/ML, agentic AI, NLP, computer vision, and MLOps, with interactive motion and an optional AI portfolio assistant.

> “I build things, break things, learn new things, and occasionally make something cool.”

## Overview

This is a three-page personal website:

- **About (`/`)** — introduction, featured projects, technical skills, experience, achievements, and education.
- **Contact (`/contact`)** — email and social links.
- **Blog (`/blog`)** — a list of posts authored in Markdown/MDX, with individual post pages at `/blog/[slug]`.

Blog content is maintained directly in the source code. There is no CMS or database requirement.

## Features

- **Liquid-glass UI** — translucent panels, soft highlights, backdrop blur, and rounded glass surfaces.
- **Animated navigation** — a floating About / Contact / Blog pill with a spring-animated active indicator.
- **Interactive background** — canvas-based particles react to pointer movement, creating space around the cursor and leaving brush-like trails.
- **Fluid name hover** — a subtle per-character hover treatment for the hero name.
- **Responsive design** — layouts adapt for desktop and mobile.
- **Reduced-motion support** — respects `prefers-reduced-motion`.
- **Source-controlled blog** — add posts as `.md` or `.mdx` files, with frontmatter and draft filtering.
- **Optional AI assistant** — a floating chat interface designed to answer questions about my portfolio using NVIDIA's OpenAI-compatible API.
- **Static-first content** — portfolio and blog pages do not require a separate application server or database.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js App Router, React, TypeScript |
| Styling | CSS, Tailwind CSS v4 |
| Animation | Framer Motion, custom Canvas API |
| Blog | Markdown/MDX, `gray-matter`, `next-mdx-remote` |
| Icons | Lucide React |
| AI assistant | Vercel AI SDK, OpenAI-compatible NVIDIA API |
| Deployment | Vercel (recommended) |

## Getting Started

### Requirements

- Node.js **20.9 or newer**
- npm
- Git (recommended)

### Install and run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The website can run without AI credentials. Until the NVIDIA environment variables are configured, the chat assistant will show a friendly unavailable message.

### Production build

```bash
npm run build
npm start
```

## Project Structure

```text
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Server-side AI chat endpoint
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx       # Individual blog post
│   │   └── page.tsx           # Blog index
│   ├── contact/
│   │   └── page.tsx           # Contact page
│   ├── globals.css            # Global styles and liquid-glass tokens
│   ├── layout.tsx             # Root layout, navigation, effects and chat
│   └── page.tsx               # About / home page
├── components/
│   ├── ChatBubble.tsx         # Floating AI assistant
│   ├── EffectsCanvas.tsx      # Particle field and pointer trails
│   ├── FluidText.tsx          # Hero-name hover effect
│   ├── Glass.tsx              # Reusable glass surface
│   └── NavSlider.tsx          # Animated page navigation
├── content/
│   ├── about-me.md            # Portfolio assistant reference content
│   └── blog/
│       └── first-post.mdx     # Example draft post
├── lib/
│   └── posts.ts               # Blog discovery, metadata and reading time
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

## Writing a Blog Post

Create a Markdown or MDX file inside `content/blog/`. The filename becomes the post URL slug.

For example, create `content/blog/my-first-article.mdx`:

```md
---
title: "My First Article"
date: "2026-11-01"
summary: "A short description shown on the blog index."
tags: ["AI", "Engineering", "Learning"]
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
| `summary` | Short description displayed in the blog listing |
| `tags` | Array of topic labels |
| `draft` | Set to `true` to hide the post from the public listing |

Posts are sorted newest first. The reading-time estimate is calculated from the post body.

### Publish a post

1. Add or edit a file in `content/blog/`.
2. Set `draft: false` when it is ready to publish.
3. Commit and push your changes to GitHub.
4. Your connected Vercel project can rebuild and deploy the update automatically.

There is no admin dashboard, CMS, or database to maintain.

## AI Portfolio Assistant (Optional)

The chat interface uses a Next.js route handler at `/api/chat` and is designed to call NVIDIA's hosted OpenAI-compatible endpoint.

1. Create or obtain an NVIDIA API key from the NVIDIA developer platform.
2. Check NVIDIA's current model catalog and confirm the model identifier available to your account.
3. Add the following variables to `.env.local`:

```dotenv
NVIDIA_API_KEY=your_nvidia_api_key
NVIDIA_MODEL=your_confirmed_model_identifier
```

4. Restart the development server.

**Security notes**

- Keep API keys on the server. Never use a `NEXT_PUBLIC_` prefix for `NVIDIA_API_KEY`.
- Do not commit `.env.local` or real credentials.
- The assistant is intended to answer questions based on the portfolio information in `app/api/chat/route.ts`. Update that knowledge when portfolio details change.
- Before exposing the endpoint to significant public traffic, add and test appropriate rate limiting and abuse protection.
- Confirm the selected model's compatibility with the configured SDK and streaming response format before production deployment.

The AI feature is optional; the main portfolio and blog should remain usable without it.

## Deploying to Vercel

1. Push the project to a GitHub repository.
2. Import the repository into [Vercel](https://vercel.com/).
3. Use the detected Next.js build settings.
4. If enabling the assistant, add `NVIDIA_API_KEY` and `NVIDIA_MODEL` in the project's Environment Variables settings.
5. Deploy and verify the home, contact, blog, and chat experiences.

Before using a custom domain, update the `metadataBase` value in `app/layout.tsx` to match the actual domain.

## About Me

I'm a Computer Science undergraduate at **GITAM University, Hyderabad**, interested in building intelligent systems that combine machine learning, software engineering, and infrastructure.

### Featured Projects

- **SIFSentinel** — AI-powered safety intelligence for identifying potential Serious Injury and Fatality precursors in incident reports, including semantic retrieval with PostgreSQL and pgvector.
- **NexCord** — an agentic incident-management system designed to detect scheduling and resource conflicts and propose resolution plans with human approval.
- **ClassSense AI** — a classroom attendance and analytics system using computer vision, deep-learning embeddings, Firestore, and natural-language analytics.

### Links

- GitHub: [@msaimanish](https://github.com/msaimanish)
- LinkedIn: [msaimanish](https://www.linkedin.com/in/msaimanish/)
- X: [@msaimanish](https://x.com/msaimanish)
- Bluesky: [msaimanish.bsky.social](https://bsky.app/profile/msaimanish.bsky.social)
- Email: [msaimanishreddy123@gmail.com](mailto:msaimanishreddy123@gmail.com)

