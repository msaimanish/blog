import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPosts, getPost } from '@/lib/blog';

const SITE_URL = 'https://www.msaimanish.tech';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="article-page">
      <Link href="/blog" className="back-link">← All writing</Link>
      <div className="section-kicker">FIELD NOTES / {post.date}</div>
      <h1 className="article-title">{post.title}</h1>
      <p className="article-summary">{post.summary}</p>
      <div className="chips article-tags">
        {post.tags.map((tag) => <span className="skill-chip" key={tag}>{tag}</span>)}
      </div>
      <div className="article-content"><ReactMarkdown>{post.content}</ReactMarkdown></div>
      <div className="article-end">— <Link href="/contact">Continue the conversation</Link></div>
    </article>
  );
}
