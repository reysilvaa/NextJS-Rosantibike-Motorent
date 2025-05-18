'use client';

import { format } from 'date-fns';
import { Calendar, Folder, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlogPosts } from '@/hooks/blog/use-blog';
import { useAppTranslations } from '@/i18n/hooks';
import { BlogPost } from '@/lib/types/blog';

export default function BlogList() {
  const { t } = useAppTranslations();
  const _router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [_selectedTag, setSelectedTag] = useState<string | null>(null);

  const {
    data: blogPosts,
    isLoading,
    error,
    meta,
  } = useBlogPosts(currentPage, 10, searchQuery, undefined, selectedCategory || undefined);

  // Initialize from URL params
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
    if (tag) setSelectedTag(tag);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const _handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const _handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const _handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-card/50 border-border">
              <CardContent className="p-0">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : blogPosts?.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">{t('noBlogPostsFound')}</p>
          </div>
        ) : (
          blogPosts?.map((post: BlogPost) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors group h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.thumbnail || '/blog-placeholder.svg'}
                      alt={post.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                  <div className="p-4 space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(post.createdAt), 'd MMMM yyyy')}</span>
                    </div>
                    <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.judul}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{post.konten}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <Folder className="h-3 w-3 mr-1" />
                        {post.kategori}
                      </Badge>
                      {post.tags?.map(tag => (
                        <Badge key={tag.tagId} variant="outline" className="hover:bg-muted">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.tag.nama}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
