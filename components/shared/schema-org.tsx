import Script from 'next/script';

interface SchemaOrgProps {
  type?: 'home' | 'about' | 'contact' | 'blog' | 'motorcycle' | 'motorcycleList';
  motorcycleData?: {
    name?: string;
    description?: string;
    image?: string;
    model?: string;
    brand?: string;
    price?: string;
    availability?: string;
  };
  articleData?: {
    title?: string;
    description?: string;
    image?: string;
    publishedDate?: string;
    modifiedDate?: string;
    authorName?: string;
  };
}

// Tipe untuk semua kemungkinan schema
type SchemaType = Record<string, any>;

export default function SchemaOrg({ type = 'home', motorcycleData, articleData }: SchemaOrgProps) {
  // Schema data dasar untuk bisnis
  const businessSchema: SchemaType = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://rosantibikemotorent.com/#business',
    name: 'Rosantibike Motorent',
    description: 'Rental motor premium dan berkualitas di Malang dengan harga terjangkau',
    url: 'https://rosantibikemotorent.com',
    telephone: '+6282143209XXX',
    email: 'contact@rosantibikemotorent.com',
    logo: 'https://rosantibikemotorent.com/logo/logo1.svg',
    image: 'https://rosantibikemotorent.com/images/storefront.jpg',
    priceRange: '$$',
    openingHours: 'Mo-Su 06:00-21:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Bauksit No. 90C',
      addressLocality: 'Malang',
      addressRegion: 'Jawa Timur',
      postalCode: '65122',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -7.956090384349396,
      longitude: 112.64813689658952,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -7.956090384349396,
        longitude: 112.64813689658952,
      },
      geoRadius: '20000',
    },
    sameAs: [
      'https://facebook.com/rosantibikemotorent',
      'https://instagram.com/rosantibikemotorent',
      'https://tiktok.com/@rosantibikemotorent',
    ],
  };

  // Schema data untuk halaman beranda
  const homePageSchema: SchemaType = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://rosantibikemotorent.com/#webpage',
    url: 'https://rosantibikemotorent.com',
    name: 'Rosantibike Motorent | Rental Motor Berkualitas di Malang',
    description:
      'Rosantibike Motorent menyediakan layanan rental motor premium di Malang dengan harga terjangkau. Motor berkualitas untuk petualangan Anda di seluruh kota Malang.',
    inLanguage: 'id-ID',
    isPartOf: { '@id': 'https://rosantibikemotorent.com/#website' },
    about: { '@id': 'https://rosantibikemotorent.com/#business' },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      '@id': 'https://rosantibikemotorent.com/#primaryimage',
      url: 'https://rosantibikemotorent.com/images/home-og.jpg',
      width: 1200,
      height: 630,
    },
  };

  // Schema data untuk website
  const websiteSchema: SchemaType = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://rosantibikemotorent.com/#website',
    url: 'https://rosantibikemotorent.com',
    name: 'Rosantibike Motorent',
    description: 'Rental motor premium dan berkualitas di Malang',
    publisher: { '@id': 'https://rosantibikemotorent.com/#business' },
    inLanguage: 'id-ID',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: 'https://rosantibikemotorent.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    ],
  };

  // Schema data untuk motor (jika disediakan)
  const motorcycleSchema: SchemaType | null = motorcycleData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `https://rosantibikemotorent.com/motorcycles/${
          motorcycleData.name?.toLowerCase().replace(/\s+/g, '-') || 'motorcycle'
        }/#product`,
        name: motorcycleData.name || 'Motor Rental',
        description: motorcycleData.description || 'Rental motor berkualitas di Malang',
        image: motorcycleData.image || 'https://rosantibikemotorent.com/images/default-motor.jpg',
        brand: {
          '@type': 'Brand',
          name: motorcycleData.brand || 'Honda',
        },
        model: motorcycleData.model || 'Vario 125',
        offers: {
          '@type': 'Offer',
          price: motorcycleData.price || '75000',
          priceCurrency: 'IDR',
          availability: motorcycleData.availability || 'https://schema.org/InStock',
          url: `https://rosantibikemotorent.com/motorcycles/${
            motorcycleData.name?.toLowerCase().replace(/\s+/g, '-') || 'motorcycle'
          }`,
          seller: { '@id': 'https://rosantibikemotorent.com/#business' },
        },
      }
    : null;

  // Schema data untuk artikel (jika disediakan)
  const articleSchema: SchemaType | null = articleData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `https://rosantibikemotorent.com/blog/${
          articleData.title?.toLowerCase().replace(/\s+/g, '-') || 'article'
        }/#article`,
        headline: articleData.title || 'Artikel Rental Motor',
        description: articleData.description || 'Informasi tentang rental motor di Malang',
        image: articleData.image || 'https://rosantibikemotorent.com/images/default-blog.jpg',
        datePublished: articleData.publishedDate || new Date().toISOString(),
        dateModified: articleData.modifiedDate || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: articleData.authorName || 'Admin Rosantibike',
        },
        publisher: { '@id': 'https://rosantibikemotorent.com/#business' },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://rosantibikemotorent.com/blog/${
            articleData.title?.toLowerCase().replace(/\s+/g, '-') || 'article'
          }/#webpage`,
        },
      }
    : null;

  let schemaToRender: SchemaType[] = [];

  // Tambahkan schema yang sesuai berdasarkan tipe halaman
  switch (type) {
    case 'home':
      schemaToRender = [businessSchema, websiteSchema, homePageSchema];
      break;
    case 'motorcycle':
      schemaToRender = [businessSchema, websiteSchema];
      if (motorcycleSchema) schemaToRender.push(motorcycleSchema);
      break;
    case 'blog':
      schemaToRender = [businessSchema, websiteSchema];
      if (articleSchema) schemaToRender.push(articleSchema);
      break;
    default:
      schemaToRender = [businessSchema, websiteSchema];
      break;
  }

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaToRender) }}
      strategy="afterInteractive"
    />
  );
} 