import { notFound } from 'next/navigation';
import { fetchBlogPostBySlug } from '@/lib/network/api';
import BlogPostDetail from '@/components/blog/blog-post-detail';
import PageSeo from '@/components/shared/seo/page-seo';
import type { BlogPost } from '@/lib/types/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
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

  return (
    <div className="pb-16">
      <PageSeo
        title={post.judul}
        description={description}
        canonicalPath={`/blog/${slug}`}
        ogImage={post.featuredImage || post.thumbnail || '/images/blog-default-og.jpg'}
      />
      <div className="pt-16">
        <BlogPostDetail post={post} />
      </div>
    </div>
  );
}