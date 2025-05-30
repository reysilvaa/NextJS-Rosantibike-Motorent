import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Our Motorcycles - Rosantibike Motorent',
  description:
    'Browse our collection of premium motorcycles available for rent. From sports bikes to adventure motorcycles, find the perfect ride for your journey.',
  keywords: generateKeywords('motorcycles'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/motorcycles',
    images: ['/images/motorcycles-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rosantibikemotorent.com/motorcycles',
  },
});

export default function MotorcyclesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
