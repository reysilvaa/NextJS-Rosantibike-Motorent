import { MetadataRoute } from 'next'

// Define all routes for the sitemap
// Add any dynamic routes as needed
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch blog posts from API or database
  // This is a placeholder - implement actual data fetching
  let blogRoutes: { url: string; lastModified: Date; changeFrequency: 'monthly'; priority: number }[] = [];
  try {
    // Example: const response = await fetch('https://rosantibike.com/api/blog-posts');
    // const blogPosts = await response.json();
    
    // For demo purposes, using sample data
    const blogPosts = [
      { slug: 'tips-berkendara-aman', updatedAt: new Date() },
      { slug: 'panduan-wisata-malang', updatedAt: new Date() },
      { slug: 'perawatan-motor-matic', updatedAt: new Date() }
    ];
    
    blogRoutes = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Fetch motorcycles from API or database
  let motorcycleRoutes: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = [];
  try {
    // Example: const response = await fetch('https://rosantibike.com/api/motorcycles');
    // const motorcycles = await response.json();
    
    // For demo purposes, using sample data
    const motorcycles = [
      { id: 'honda-beat', updatedAt: new Date() },
      { id: 'honda-vario', updatedAt: new Date() },
      { id: 'yamaha-nmax', updatedAt: new Date() }
    ];
    
    motorcycleRoutes = motorcycles.map(motorcycle => ({
      url: `${baseUrl}/motorcycles/${motorcycle.id}`,
      lastModified: new Date(motorcycle.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching motorcycles for sitemap:', error);
  }

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...motorcycleRoutes,
  ]
} 