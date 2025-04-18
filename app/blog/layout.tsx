import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Blog - Rosanti Bike Rental',
  description:
    'Read our latest articles about motorcycles, travel tips, and rental information. Stay updated with Rosanti Bike Rental.',
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

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
