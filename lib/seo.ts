import { DefaultSeoProps } from 'next-seo';

// Default SEO configuration
export const DEFAULT_SEO_CONFIG: DefaultSeoProps = {
  titleTemplate: '%s | Rosantibike Motorent',
  defaultTitle: 'Rosantibike Motorent - Rental Motor di Malang',
  description: 'Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang. Berbagai pilihan motor untuk kebutuhan Anda.',
  canonical: 'https://rosantibike.com',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://rosantibike.com',
    siteName: 'Rosantibike Motorent',
    title: 'Rosantibike Motorent - Rental Motor di Malang',
    description: 'Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang. Berbagai pilihan motor untuk kebutuhan Anda.',
    images: [
      {
        url: 'https://rosantibike.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rosantibike Motorent',
      },
    ],
  },
  twitter: {
    handle: '@rosantibike',
    site: '@rosantibike',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'rental motor, sewa motor, malang, rosantibike, motorent, rental motor malang, sewa motor malang',
    },
    {
      name: 'author',
      content: 'Rosantibike Motorent',
    },
  ],
  robotsProps: {
    nosnippet: false,
    notranslate: false,
    noimageindex: false,
    noarchive: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1,
  },
};

// Helper function for generating SEO props for specific pages
export function getPageSeoProps({
  title,
  description,
  canonicalPath,
  ogImage,
}: {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
}) {
  return {
    title,
    description,
    canonical: canonicalPath ? `https://rosantibike.com${canonicalPath}` : undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `https://rosantibike.com${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
    },
  };
} 