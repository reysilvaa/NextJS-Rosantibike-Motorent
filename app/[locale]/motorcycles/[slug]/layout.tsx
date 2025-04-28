import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const generateMetadataParams = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  
  return generateMetadata({
    title: `${slug} - Motorcycle Detail - Rosantibike Motorent`,
    description: `Details, specifications, and availability for the ${slug} motorcycle. Book now for your next journey.`,
    keywords: generateKeywords('motorcycle-detail'),
    openGraph: {
      url: `https://rosantibikemotorent.com/motorcycles/${slug}`,
      images: ['/images/motorcycle-detail-og.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://rosantibikemotorent.com/motorcycles/${slug}`,
    },
  });
};

export default function MotorcycleDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
} 