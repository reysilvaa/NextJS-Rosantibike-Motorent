import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Blog - Rosantibike Motorent',
  description:
    'Read our latest articles about motorcycle riding tips, adventure destinations around Malang, and other useful information for riders.',
  keywords: generateKeywords('blog'),
  openGraph: {
    url: 'https://rosantibikemotorent.com/blog',
    images: ['/images/blog-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rosantibikemotorent.com/blog',
  }
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
