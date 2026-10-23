import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SITE_URL = 'https://msaimanish.tech';

function getPublishedPosts() {
  const blogDirectory = path.join(process.cwd(), 'content', 'blog');

  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  return fs.readdirSync(blogDirectory)
    .filter((file) => /\.mdx?$/i.test(file))
    .flatMap((file) => {
      const filePath = path.join(blogDirectory, file);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(source);

      if (data.draft === true) {
        return [];
      }

      return [{
        url: `${SITE_URL}/blog/${file.replace(/\.mdx?$/i, '')}`,
        lastModified: fs.statSync(filePath).mtime,
      }];
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getPublishedPosts(),
  ];
}