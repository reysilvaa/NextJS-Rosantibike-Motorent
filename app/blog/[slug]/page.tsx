import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '@/lib/network/api';
import BlogPostDetail from '@/components/blog/blog-post-detail';
import type { BlogPost } from '@/lib/types/blog';
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
        title: 'Article Not Found - Rosanti Bike Rental',
        description: 'The article you are looking for could not be found.',
        keywords: generateKeywords('not-found', { 
          additionalKeywords: ['blog article', params.slug] 
        }),
        robots: {
          index: true,
          follow: true,
        },
      });
    }

    // Create a description from the content if needed
    const description = post.konten 
      ? post.konten.replace(/<[^>]*>/g, '').substring(0, 157) + '...'
      : `${post.judul} - Rosanti Bike Rental`;

    // Generate keywords using our dynamic utility
    const tagNames = post.tags?.map(tag => tag.tag.nama) || [];
    const contentWords = post.konten
      ? post.konten.replace(/<[^>]*>/g, '').split(' ')
        .filter(word => word.length > 4)
        .slice(0, 5)
      : [];

    return baseSeoMetadata({
      title: post.judul,
      description,
      keywords: generateKeywords('blog-detail', {
        title: post.judul,
        category: post.kategori,
        tags: tagNames,
        contentWords: contentWords,
      }),
      openGraph: {
        title: post.judul,
        description,
        images: [post.featuredImage || post.thumbnail || '/images/blog-og.jpg'],
        url: `https://rosantibike.com/blog/${slug}`,
        type: 'article',
      },
      robots: {
        index: true,
        follow: true,
      },
    });
  } catch (error) {
    return baseSeoMetadata({
      title: 'Blog - Rosanti Bike Rental',
      description: 'Explore motorcycle riding tips, travel guides, and adventure stories on our blog.',
      keywords: generateKeywords('blog'),
      robots: {
        index: true,
        follow: true,
      },
    });
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="pb-16">
      <div className="pt-16">
        <BlogPostDetail post={post} />
      </div>
    </div>
  );
}