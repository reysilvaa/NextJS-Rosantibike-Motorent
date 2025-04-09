/**
 * File konfigurasi sentral untuk SEO
 * Semua nilai default dan konstanta SEO disimpan di sini
 */

// Konfigurasi dasar situs
export const SITE_CONFIG = {
  name: 'Rosantibike Motorent',
  title: 'Rental Motor Terpercaya di Malang',
  description: 'Rental motor terpercaya dengan harga terjangkau dan layanan terbaik di Malang. Berbagai pilihan motor untuk kebutuhan Anda.',
  url: 'https://rosantibike.com',
  locale: 'id_ID',
  twitterHandle: '@rosantibike',
}

// Konfigurasi SEO default untuk gambar
export const DEFAULT_OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Rosantibike Motorent',
}

// Konfigurasi SEO default untuk metadata
export const META_KEYWORDS = 'rental motor, sewa motor, malang, rosantibike, motorent, rental motor malang, sewa motor malang';

// Konfigurasi untuk theme color
export const THEME_COLORS = [
  { media: "(prefers-color-scheme: light)", color: "white" },
  { media: "(prefers-color-scheme: dark)", color: "black" }
];

// Konfigurasi robots default sesuai dengan tipe Robots dari Next.js
export const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
  },
}; 