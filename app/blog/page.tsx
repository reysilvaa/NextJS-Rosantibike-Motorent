import BlogPageContent from "@/components/blog/blog-page-content"
import { generateMetadata } from '@/lib/seo/config';

export const metadata = generateMetadata({
  title: 'Blog - Rosanti Bike Rental',
  description: 'Explore motorcycle riding tips, travel guides, and adventure stories on our blog.',
  openGraph: {
    url: 'https://rosantibike.com/blog',
    images: ['/images/blog-og.jpg'],
  },
});

export default function BlogPage() {
  return <BlogPageContent />
}

