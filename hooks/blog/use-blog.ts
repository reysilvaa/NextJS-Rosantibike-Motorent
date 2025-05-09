import { useCallback, useEffect, useState } from 'react';

import { fetchBlogPostById, fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/network/api';
import type { BlogPost, BlogTag } from '@/lib/types/blog';

import { useLoading } from '../common/use-loading';

interface BlogMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  categories: string[];
  tags: BlogTag[];
}

export function useBlogPosts(
  page = 1,
  limit = 10,
  search?: string,
  status?: string,
  kategori?: string
) {
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BlogMeta>({
    totalItems: 0,
    itemsPerPage: limit,
    totalPages: 0,
    currentPage: page,
    categories: [],
    tags: [],
  });
  const { isLoading, withLoading } = useLoading(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await withLoading(fetchBlogPosts(page, limit, search, status, kategori));

      if (result && typeof result === 'object' && 'data' in result && Array.isArray(result.data)) {
        setData(result.data);
        if ('meta' in result && result.meta) {
          const responseMeta = result.meta as Partial<BlogMeta>;
          setMeta({
            totalItems: responseMeta.totalItems ?? 0,
            itemsPerPage: responseMeta.itemsPerPage ?? limit,
            totalPages: responseMeta.totalPages ?? 0,
            currentPage: responseMeta.currentPage ?? page,
            categories: responseMeta.categories ?? [],
            tags: responseMeta.tags ?? [],
          });
        }
      } else if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat blog posts');
      setData([]);
    }
  }, [page, limit, search, status, kategori, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, meta, isLoading, error, refetch };
}

export function useBlogPost(id?: string, slug?: string) {
  const [data, setData] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  const fetchData = useCallback(async () => {
    try {
      let result;
      if (id) {
        result = await withLoading(fetchBlogPostById(id));
      } else if (slug) {
        result = await withLoading(fetchBlogPostBySlug(slug));
      } else {
        setData(null);
        return;
      }

      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat blog post');
      setData(null);
    }
  }, [id, slug, withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}
