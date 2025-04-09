import { Metadata } from 'next';
import { DefaultSeoProps } from 'next-seo';

export type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
};

// Default SEO configuration for Next-SEO
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

export function getSeoMetadata({
  title,
  description,
  canonicalPath,
  ogImage,
  noIndex = false,
}: SeoProps): Metadata {
  const siteName = 'Rosantibike Motorent';
  const defaultTitle = 'Rental Motor Terpercaya di Malang';
  const defaultDescription = 'Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang. Berbagai pilihan motor untuk kebutuhan Anda.';
  const baseUrl = 'https://rosantibike.com';

  return {
    title: title ? `${title} | ${siteName}` : `${siteName} - ${defaultTitle}`,
    description: description || defaultDescription,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl,
      siteName,
      title: title ? `${title} | ${siteName}` : `${siteName} - ${defaultTitle}`,
      description: description || defaultDescription,
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ] : [
        {
          url: `${baseUrl}/images/default-og.jpg`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    alternates: {
      canonical: canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Client-side SEO props for NextSeo component
export function getClientSeoProps({
  title,
  description,
  canonicalPath,
  ogImage,
  noIndex = false,
}: SeoProps) {
  const siteName = 'Rosantibike Motorent';
  const defaultTitle = 'Rental Motor Terpercaya di Malang';
  const defaultDescription = 'Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang. Berbagai pilihan motor untuk kebutuhan Anda.';
  const baseUrl = 'https://rosantibike.com';
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - ${defaultTitle}`;
  
  return {
    title: fullTitle,
    description: description || defaultDescription,
    canonical: canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl,
    noindex: noIndex,
    nofollow: noIndex,
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      url: canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl,
      siteName,
      locale: 'id_ID',
      type: 'website',
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ] : [
        {
          url: `${baseUrl}/images/default-og.jpg`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
  };
} 