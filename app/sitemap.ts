import { MetadataRoute } from 'next'
import { fetchAllMotorcycles, fetchAllBlogPosts } from '@/lib/network/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = 'https://rosantibike.com'
  
  // Get current date for lastModified
  const currentDate = new Date()

  // Static routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/motorcycles`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/availability`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/booking-history`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/booking-success`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Fetch dynamic routes for blog posts and motorcycles
  try {
    // Fetch all blog posts
    const blogPosts = await fetchAllBlogPosts();
    const blogRoutes = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    
    // Fetch all motorcycles
    const motorcycles = await fetchAllMotorcycles();
    const motorcycleRoutes = motorcycles.map(motorcycle => ({
      url: `${baseUrl}/motorcycles/${motorcycle.id}`,
      lastModified: new Date(motorcycle.updatedAt || motorcycle.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Combine all routes
    return [...routes, ...blogRoutes, ...motorcycleRoutes];
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
    // Return just the static routes if there's an error with the dynamic ones
    return routes;
  }
} 