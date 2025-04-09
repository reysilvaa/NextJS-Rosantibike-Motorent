import { MetadataRoute } from 'next'

// Define all routes for the sitemap
// Add any dynamic routes as needed
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rosantibike.com'
  
  // Define static routes
  const staticRoutes = [
    '',
    '/motorcycles',
    '/contact',
    '/blog',
    '/availability',
    '/booking-history',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // In a real application, you would fetch dynamic routes from your API/database
  // Example for blog posts or motorcycle details pages:
  /*
  const blogPosts = await fetchBlogPosts()
  const blogRoutes = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const motorcycles = await fetchMotorcycles()
  const motorcycleRoutes = motorcycles.map(motorcycle => ({
    url: `${baseUrl}/motorcycles/${motorcycle.slug}`,
    lastModified: new Date(motorcycle.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  */

  return [
    ...staticRoutes,
    // ...blogRoutes,
    // ...motorcycleRoutes,
  ]
} 