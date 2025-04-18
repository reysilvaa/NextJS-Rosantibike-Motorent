/**
 * Dynamic SEO keyword generator
 * This file handles dynamic keyword generation for all pages
 */

export type PageType =
  | 'home'
  | 'motorcycles'
  | 'motorcycle-detail'
  | 'blog'
  | 'blog-detail'
  | 'availability'
  | 'booking-history'
  | 'booking-success'
  | 'contact'
  | 'not-found';

interface KeywordParams {
  title?: string;
  category?: string;
  tags?: string[];
  contentWords?: string[];
  additionalKeywords?: string[];
}

/**
 * Generate SEO keywords dynamically based on page type and optional parameters
 */
export function generateKeywords(pageType: PageType, params: KeywordParams = {}): string[] {
  // Base keywords for all pages
  const baseKeywords = ['Rosanti Bike', 'motorcycle rental', 'bike rental'];

  // Page-specific keywords
  const pageKeywords: Record<PageType, string[]> = {
    home: [
      'premium motorcycles',
      'adventure bikes',
      'motorbike rental',
      'rental service',
      'motorcycle tours',
      'quality bikes',
    ],
    motorcycles: [
      'motorcycle models',
      'bike collection',
      'sports bikes',
      'adventure motorcycles',
      'motorcycle specs',
      'motorcycle gallery',
      'rental bikes',
      'bike options',
    ],
    'motorcycle-detail': [
      'motorcycle details',
      'bike specifications',
      'rental motorcycle',
      'bike features',
      'motorcycle specs',
      'rental model',
      'premium bike',
    ],
    blog: [
      'motorcycle blog',
      'riding tips',
      'travel guides',
      'bike adventures',
      'motorcycling stories',
      'rider resources',
      'biking guides',
    ],
    'blog-detail': [
      'blog article',
      'motorcycle blog',
      'bike story',
      'riding guide',
      'motorcycle tips',
    ],
    availability: [
      'motorcycle availability',
      'bike booking',
      'online reservation',
      'rental dates',
      'available motorcycles',
      'instant booking',
      'rental calendar',
    ],
    'booking-history': [
      'booking history',
      'rental reservations',
      'motorcycle bookings',
      'reservation management',
      'rental tracking',
      'booking status',
    ],
    'booking-success': [
      'booking confirmation',
      'reservation success',
      'motorcycle rental confirmation',
      'rental details',
      'successful booking',
    ],
    contact: [
      'contact us',
      'motorcycle rental support',
      'customer service',
      'rental inquiries',
      'Rosanti Bike contact',
      'bike rental help',
    ],
    'not-found': ['page not found', 'error page', 'motorcycle rental'],
  };

  // Combine base keywords with page-specific keywords
  let keywords = [...baseKeywords, ...pageKeywords[pageType]];

  // Add title-based keywords if provided
  if (params.title) {
    const titleWords = params.title
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .filter(word => !keywords.includes(word));

    keywords = [...keywords, ...titleWords];
  }

  // Add category if provided
  if (params.category) {
    keywords.push(params.category.toLowerCase());
  }

  // Add tags if provided
  if (params.tags && params.tags.length > 0) {
    const tagKeywords = params.tags
      .map(tag => tag.toLowerCase())
      .filter(tag => !keywords.includes(tag));

    keywords = [...keywords, ...tagKeywords];
  }

  // Add content words if provided
  if (params.contentWords && params.contentWords.length > 0) {
    const contentKeywords = params.contentWords
      .filter(word => word.length > 3)
      .filter(word => !keywords.includes(word));

    keywords = [...keywords, ...contentKeywords];
  }

  // Add additional keywords if provided
  if (params.additionalKeywords && params.additionalKeywords.length > 0) {
    keywords = [...keywords, ...params.additionalKeywords];
  }

  // Remove duplicates and limit to 10 keywords
  return [...new Set(keywords)].slice(0, 10);
}
