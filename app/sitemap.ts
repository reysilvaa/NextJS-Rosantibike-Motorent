import { MetadataRoute } from 'next'
import { fetchAllMotorcycles, fetchAllBlogPosts } from '@/lib/network/api'

type SitemapItem = {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
};

// Helper function to ensure a valid slug
function ensureValidSlug(str: string | undefined | null, fallback: string): string {
  if (!str) return fallback;
  
  // Remove special characters and spaces, replace with dashes
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .trim();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = 'https://rosantibikemotorent.com'
  
  // Static routes
  const staticRoutes: SitemapItem[] = [
    '/', // home
    '/about/',
    '/contact/',
    '/blog/',
    '/availability/',
    '/availability/booking/',
    '/booking-history/',
    '/booking-success/',
    '/motorcycles/',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '/' ? 1 : 0.9, // home page has highest priority
  }));

  // Blog posts
  let blogRoutes: SitemapItem[] = [];
  try {
    const blogPosts = await fetchAllBlogPosts();
    blogRoutes = blogPosts
      .filter(post => post) // Filter out any null/undefined posts
      .map((post) => {
        const slug = post.slug ? post.slug : ensureValidSlug(post.judul, `post-${post.id}`);
        return {
          url: `${baseUrl}/blog/${slug}/`,
          lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Motorcycle units
  let motorcycleRoutes: SitemapItem[] = [];
  try {
    const motorcycles = await fetchAllMotorcycles();
    motorcycleRoutes = motorcycles
      .filter(motorcycle => motorcycle) // Filter out any null/undefined motorcycles
      .map((motorcycle) => {
        const slug = motorcycle.slug 
          ? motorcycle.slug 
          : ensureValidSlug(`${motorcycle.merk} ${motorcycle.model}`, `motor-${motorcycle.id}`);
        return {
          url: `${baseUrl}/motorcycles/${slug}/`,
          lastModified: new Date(motorcycle.updatedAt || motorcycle.createdAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
  } catch (error) {
    console.error('Error fetching motorcycles for sitemap:', error);
  }

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...motorcycleRoutes,
  ];
} 