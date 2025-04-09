import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '@/lib/network/api';
import BlogPostDetail from '@/components/blog/blog-post-detail';
import type { BlogPost } from '@/lib/types/blog';
import { generateMetadata as baseSeoMetadata } from '@/lib/seo/config';

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
        robots: {
          index: false,
          follow: false,
        },
      });
    }

    // Create a description from the content if needed
    const description = post.konten 
      ? post.konten.replace(/<[^>]*>/g, '').substring(0, 157) + '...'
      : `${post.judul} - Rosanti Bike Rental`;

    return baseSeoMetadata({
      title: post.judul,
      description,
      openGraph: {
        title: post.judul,
        description,
        images: [post.featuredImage || post.thumbnail || '/images/blog-og.jpg'],
        url: `https://rosantibike.com/blog/${slug}`,
        type: 'article',
      },
    });
  } catch (error) {
    return baseSeoMetadata({
      title: 'Blog - Rosanti Bike Rental',
      description: 'Explore motorcycle riding tips, travel guides, and adventure stories on our blog.',
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