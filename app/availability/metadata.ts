import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Check Availability - Rosanti Bike Rental',
  description: 'Check motorcycle availability and book your preferred bike for your trip. Easy online booking with instant confirmation.',
  keywords: generateKeywords('availability'),
  openGraph: {
    url: 'https://rosantibike.com/availability',
    images: ['/images/availability-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}); 