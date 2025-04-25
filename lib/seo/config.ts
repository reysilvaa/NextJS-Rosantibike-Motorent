import { Metadata } from 'next';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  metadataBase?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
    url?: string;
    type?:
      | 'article'
      | 'website'
      | 'book'
      | 'profile'
      | 'music.song'
      | 'music.album'
      | 'music.playlist'
      | 'music.radio_station'
      | 'video.movie'
      | 'video.episode'
      | 'video.tv_show'
      | 'video.other';
    siteName?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'player' | 'app';
    title?: string;
    description?: string;
    images?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
}

export const defaultSeoConfig: SeoConfig = {
  title: 'Rosantibike - Motorcycle Rental Service',
  description:
    'Rent high-quality motorcycles for your adventures. Best motorcycle rental service with competitive prices and excellent customer service.',
  keywords: ['motorcycle rental', 'bike rental', 'rental service', 'adventure bikes'],
  metadataBase: 'https://rosantibikemotorent.com',
  openGraph: {
    type: 'website',
    siteName: 'Rosantibike',
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const generateMetadata = (config: Partial<SeoConfig> = {}): Metadata => {
  const mergedConfig = { ...defaultSeoConfig, ...config };
  const metadataBaseUrl = mergedConfig.metadataBase || 'https://rosantibikemotorent.com';

  // Pastikan description selalu tersedia
  const description = mergedConfig.description || defaultSeoConfig.description;

  return {
    title: mergedConfig.title,
    description: description,
    keywords: mergedConfig.keywords?.join(', '),
    metadataBase: new URL(metadataBaseUrl),
    openGraph: mergedConfig.openGraph
      ? {
          title: mergedConfig.openGraph.title || mergedConfig.title,
          description: mergedConfig.openGraph.description || description,
          images: mergedConfig.openGraph.images,
          url: mergedConfig.openGraph.url,
          siteName: mergedConfig.openGraph.siteName,
          ...(mergedConfig.openGraph.type ? { type: mergedConfig.openGraph.type } : {}),
        }
      : undefined,
    twitter: mergedConfig.twitter
      ? {
          title: mergedConfig.twitter.title || mergedConfig.title,
          description: mergedConfig.twitter.description || description,
          images: mergedConfig.twitter.images,
          ...(mergedConfig.twitter.card ? { card: mergedConfig.twitter.card } : {}),
        }
      : undefined,
    robots: mergedConfig.robots
      ? {
          index: mergedConfig.robots.index,
          follow: mergedConfig.robots.follow,
        }
      : undefined,
  };
};
