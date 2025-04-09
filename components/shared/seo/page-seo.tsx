import { NextSeo } from 'next-seo';
import { getPageSeoProps } from '@/lib/seo';

interface PageSeoProps {
  title?: string;
  description?: string;
  canonicalPath?: string; // e.g., /motorcycles/honda-beat
  ogImage?: string;
}

export default function PageSeo({
  title,
  description,
  canonicalPath,
  ogImage,
}: PageSeoProps) {
  const seoProps = getPageSeoProps({
    title,
    description,
    canonicalPath,
    ogImage,
  });

  return <NextSeo {...seoProps} />;
} 