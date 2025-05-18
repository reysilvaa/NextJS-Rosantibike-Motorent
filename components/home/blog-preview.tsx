'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronRight, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppTranslations } from '@/i18n/hooks';
import { fetchBlogPosts } from '@/lib/network/api';
import type { BlogPost } from '@/lib/types/';

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { t  } = useAppTranslations();

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchBlogPosts(1, 10);

        // Ambil data dari respons
        const blogData = response.data || [];

        // Pastikan kita mempunyai array
        if (Array.isArray(blogData)) {
          setPosts(blogData.slice(0, 6)); // Ambil 6 post pertama
        } else {
          // Jika data bukan array, tampilkan pesan error
          setError(t('invalidDataFormat'));
          console.error('Format data blog tidak valid:', blogData);
        }

        setIsLoading(false);
      } catch (err) {
        setError(t('loadingFailed'));
        setIsLoading(false);
        console.error('Error saat memuat blog posts:', err);
      }
    };

    getBlogPosts();
  }, [t]);

  const displayPosts = posts.length > 0 ? posts : [];

  // Add missing properties to posts if needed
  const enhancedPosts = displayPosts.map(post => {
    // Calculate read time based on content length if not present
    const readTime = `${Math.max(3, Math.floor(post.konten.length / 500))} min read`;

    // Get author name from author object if available
    const authorName = post.author ? post.author.nama : 'Admin Rosantibike';

    return {
      ...post,
      readTime,
      authorName,
    };
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get unique categories
  const categories = ['all', ...new Set(enhancedPosts.map(post => post.kategori))];

  // Filter posts by category
  const filteredPosts =
    activeCategory === 'all'
      ? enhancedPosts
      : enhancedPosts.filter(post => post.kategori === activeCategory);

  // Featured post is the first one
  const featuredPost = enhancedPosts[0];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Simplified local accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background/80 -z-10"> {/* Above global -z-20 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/5),transparent_70%)] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t('latestBlogTitle')}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">{t('latestBlogDescription')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-primary/20 hover:border-primary hover:bg-primary/5 group"
              >
                {t('viewAllArticles')}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Category tabs */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="bg-background/50 border border-border p-1 rounded-full inline-flex">
              {categories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full capitalize data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {category === 'all' ? t('allCategories') : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-card/50 border-border overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-5">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
                  <div className="h-16 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>{t('tryAgain')}</Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured post */}
            {activeCategory === 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="overflow-hidden border-primary/10 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative h-64 md:h-auto">
                        <Image
                          src={
                            featuredPost.featuredImage || '/placeholder.svg?height=600&width=800'
                          }
                          alt={featuredPost.judul}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-white">{featuredPost.kategori}</Badge>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center text-muted-foreground text-sm mb-3 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(featuredPost.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {featuredPost.readTime}
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                          {featuredPost.judul}
                        </h3>
                        <p className="text-foreground/80 mb-6 line-clamp-3">
                          {featuredPost.konten}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">
                              {featuredPost.author ? featuredPost.author.nama : 'Admin'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            className="text-primary hover:text-primary/90 hover:bg-primary/5 group"
                          >
                            {t('readMore')}
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Regular posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(activeCategory === 'all' ? 1 : 0).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
                      <div className="relative h-48 overflow-hidden group">
                        <Image
                          src={post.featuredImage || '/placeholder.svg?height=400&width=600'}
                          alt={post.judul}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-white">{post.kategori}</Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between text-muted-foreground text-sm mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(post.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.judul}</h3>
                        <p className="text-foreground/80 line-clamp-3 mb-4">{post.konten}</p>
                      </CardContent>
                      <CardFooter className="px-5 py-4 border-t flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-2">
                            <User className="h-3 w-3" />
                          </div>
                          <span className="text-sm">
                            {post.author ? post.author.nama : 'Admin'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90 hover:bg-primary/5 group p-0"
                        >
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
