import { Metadata } from 'next';

export type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
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