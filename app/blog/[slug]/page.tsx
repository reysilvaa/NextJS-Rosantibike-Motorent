'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

import BlogPostDetail from '@/components/blog/blog-post-detail';
import { fetchBlogPostBySlug } from '@/lib/network/api';
import type { BlogPost } from '@/lib/types/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await fetchBlogPostBySlug(slug);
        setPost(postData);
        if (!postData) notFound();
      } catch (error) {
        console.error('Error loading blog post:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  if (isLoading) {
    return <div className="pb-16 pt-16">Loading...</div>;
  }

  if (!post) {
    return null; // Akan di-handle oleh notFound
  }

  return (
    <div className="pb-16">
      <div className="pt-16">
        <BlogPostDetail post={post} />
      </div>
    </div>
  );
}
