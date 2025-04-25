import { Metadata } from 'next';

import { fetchBlogPostBySlug } from '@/lib/network/api';
import { generateMetadata as baseSeoMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = params;
    const post = await fetchBlogPostBySlug(slug);

    if (!post) {
      return baseSeoMetadata({
        title: 'Article Not Found - Rosantibike Motorent',
        description: 'The article you are looking for could not be found.',
        keywords: generateKeywords('not-found', {
          additionalKeywords: ['blog article', params.slug],
        }),
        robots: {
          index: true,
          follow: true,
        },
      });
    }

    return baseSeoMetadata({
      title: `${post.judul} - Rosanti Bike Rental Blog`,
      description: post.konten.slice(0, 160) || post.judul,
      keywords: generateKeywords('blog', {
        additionalKeywords: [...post.tags.map(tag => tag.tag.nama), post.judul],
      }),
      openGraph: {
        url: `https://rosantibikemotorent.com/blog/${post.slug}`,
        images: post.thumbnail ? [post.thumbnail] : ['/images/blog-og.jpg'],
      },
      robots: {
        index: true,
        follow: true,
      },
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return baseSeoMetadata({
      title: 'Blog Post - Rosantibikemotorent',
      description: 'Read our latest blog post about motorcycles and adventures.',
      keywords: generateKeywords('blog'),
      robots: {
        index: true,
        follow: true,
      },
    });
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
