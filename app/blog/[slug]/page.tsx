import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '@/lib/network/api';
import BlogPostDetail from '@/components/blog/blog-post-detail';
import type { BlogPost } from '@/lib/types/types';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang anda cari tidak ditemukan',
    };
  }

  return {
    title: post.judul,
    description: post.meta_description || `${post.judul} - Rental Motor`,
    openGraph: {
      title: post.judul,
      description: post.meta_description || `${post.judul} - Rental Motor`,
      images: post.featuredImage || post.thumbnail || '/placeholder.svg',
    },
  };
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