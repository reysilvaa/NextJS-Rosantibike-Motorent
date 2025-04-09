import { MetadataRoute } from 'next'
import { fetchAllMotorcycles, fetchAllBlogPosts } from '@/lib/network/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = 'https://rosantibike.com'
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/availability',
    '/booking-history',
    '/motorcycles',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Blog posts
  const blogPosts = await fetchAllBlogPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Motorcycle units
  const motorcycles = await fetchAllMotorcycles();
  const motorcycleRoutes = motorcycles.map((motorcycle) => ({
    url: `${baseUrl}/motorcycles/${motorcycle.slug}`,
    lastModified: new Date(motorcycle.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...motorcycleRoutes,
  ];
} 