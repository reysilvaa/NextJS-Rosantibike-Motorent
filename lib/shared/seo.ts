import { Metadata, Viewport } from 'next';
import { DefaultSeoProps } from 'next-seo';
import { 
  SITE_CONFIG,
  DEFAULT_OG_IMAGE,
  META_KEYWORDS,
  THEME_COLORS,
  DEFAULT_ROBOTS
} from './seo-config';

export type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
};

// Konfigurasi Viewport untuk layout utama
export function getDefaultViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    themeColor: THEME_COLORS,
  };
}

// Konfigurasi Metadata untuk layout utama
export function getDefaultMetadata(): Metadata {
  return {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' }
      ],
      apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
      other: [
        { rel: 'manifest', url: '/site.webmanifest' }
      ]
    },
    robots: DEFAULT_ROBOTS,
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: {
        'id-ID': SITE_CONFIG.url,
      },
    },
    verification: {
      google: 'your-google-site-verification-code', // Replace with your verification code
    },
  };
}

// Default SEO configuration for Next-SEO
export const DEFAULT_SEO_CONFIG: DefaultSeoProps = {
  titleTemplate: `%s | ${SITE_CONFIG.name}`,
  defaultTitle: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
  description: SITE_CONFIG.description,
  canonical: SITE_CONFIG.url,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE.url}`,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    handle: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: META_KEYWORDS,
    },
    {
      name: 'author',
      content: SITE_CONFIG.name,
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
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`;
  
  return {
    title: fullTitle,
    description: description || SITE_CONFIG.description,
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: canonicalPath ? `${SITE_CONFIG.url}${canonicalPath}` : SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description: description || SITE_CONFIG.description,
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ] : [
        {
          url: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE.url}`,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
          alt: SITE_CONFIG.name,
        },
      ],
    },
    alternates: {
      canonical: canonicalPath ? `${SITE_CONFIG.url}${canonicalPath}` : SITE_CONFIG.url,
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
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - ${SITE_CONFIG.title}`;
  
  return {
    title: fullTitle,
    description: description || SITE_CONFIG.description,
    canonical: canonicalPath ? `${SITE_CONFIG.url}${canonicalPath}` : SITE_CONFIG.url,
    noindex: noIndex,
    nofollow: noIndex,
    openGraph: {
      title: fullTitle,
      description: description || SITE_CONFIG.description,
      url: canonicalPath ? `${SITE_CONFIG.url}${canonicalPath}` : SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: 'website',
      images: ogImage ? [
        {
          url: ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ] : [
        {
          url: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE.url}`,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
          alt: SITE_CONFIG.name,
        },
      ],
    },
  };
} 