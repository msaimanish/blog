import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Posts live in content/blog as .md or .mdx files; the file name becomes the URL.
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  draft: boolean;
  content: string;
  readingTime: number;
};

// Front matter dates may arrive as a string or, unquoted, as a Date; always return YYYY-MM-DD.
function toIsoDate(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const slug = file.replace(/\.mdx?$/i, '');
  return {
    slug,
    title: String(data.title || slug),
    date: toIsoDate(data.date),
    summary: String(data.summary || ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    content,
    readingTime: Math.max(1, Math.ceil(words / 220)),
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/i.test(file))
    .map(readPost)
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}
