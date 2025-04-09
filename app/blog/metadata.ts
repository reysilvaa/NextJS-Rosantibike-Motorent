import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Blog - Rosanti Bike Rental',
  description: 'Explore motorcycle riding tips, travel guides, and adventure stories on our blog.',
  keywords: generateKeywords('blog'),
  openGraph: {
    url: 'https://rosantibike.com/blog',
    images: ['/images/blog-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}); 