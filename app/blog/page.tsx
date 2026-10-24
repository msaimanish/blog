import type { Metadata } from 'next';
import Link from 'next/link';
import Glass from '@/components/Glass';
import { getPosts } from '@/lib/blog';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on machine learning, systems, experiments, and lessons from building software.',
  alternates: { canonical: 'https://www.msaimanish.tech/blog' },
  openGraph: {
    title: 'Blog',
    description: 'Notes on machine learning, systems, experiments, and lessons from building software.',
    url: 'https://www.msaimanish.tech/blog',
    type: 'website',
  },
};

export default function Blog() {
  const posts = getPosts();

  return (
    <div className="inner-page blog-page">
      <div className="section-kicker">FIELD NOTES / IDEAS IN PROGRESS</div>
      <h1 className="page-title">Thinking out <em>loud.</em></h1>
      <p className="page-intro">Notes on machine learning, systems, experiments, and the things I learn while building.</p>
      <div className="post-list">
        {posts.length ? posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug}>
            <Glass className="post-card">
              <div className="post-meta"><time dateTime={post.date}>{post.date}</time><span>{post.readingTime} MIN READ</span></div>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <div className="post-bottom">
                <div className="chips">{post.tags.map((tag) => <span className="skill-chip" key={tag}>{tag}</span>)}</div>
                <span className="post-arrow" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" /></span>
              </div>
            </Glass>
          </Link>
        )) : (
          <Glass className="empty-post">
            <span className="muted">FIRST ENTRY / COMING SOON</span>
            <h2>The notebook is open.</h2>
            <p>Add a Markdown post with frontmatter to <code>content/blog/</code> to publish it. No CMS, no admin panel—just writing and Git.</p>
          </Glass>
        )}
      </div>
    </div>
  );
}
