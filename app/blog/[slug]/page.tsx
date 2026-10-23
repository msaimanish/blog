import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getPosts,getPost } from '@/lib/blog';
export function generateStaticParams(){return getPosts().map(p=>({slug:p.slug}));}
export default async function BlogPost({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const post=getPost(slug);if(!post)notFound();return <article className="article-page"><Link href="/blog" className="back-link">← All writing</Link><div className="section-kicker">FIELD NOTES / {post.date}</div><h1 className="article-title">{post.title}</h1><p className="article-summary">{post.summary}</p><div className="chips article-tags">{post.tags.map(t=><span className="skill-chip" key={t}>{t}</span>)}</div><div className="article-content"><ReactMarkdown>{post.content}</ReactMarkdown></div><div className="article-end">— <Link href="/contact">Continue the conversation</Link></div></article>}
