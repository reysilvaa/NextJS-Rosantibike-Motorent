import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '@/lib/network/api';
import BlogPostDetail from '@/components/blog/blog-post-detail';
import type { BlogPost } from '@/lib/types/blog';
import { getSeoMetadata } from '@/lib/shared/seo';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return getSeoMetadata({
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang anda cari tidak ditemukan',
      noIndex: true
    });
  }

  // Create description by shortening the content
  let description = `${post.judul} - Rental Motor Terpercaya di Malang`;
  
  if (post.konten) {
    // Remove HTML tags and get first 150 characters
    const plainText = post.konten.replace(/<[^>]*>/g, '');
    description = plainText.length > 150 
      ? plainText.substring(0, 150).trim() + '...'
      : plainText;
  }

  return getSeoMetadata({
    title: post.judul,
    description,
    canonicalPath: `/blog/${slug}`,
    ogImage: post.featuredImage || post.thumbnail || '/images/blog-default-og.jpg',
  });
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