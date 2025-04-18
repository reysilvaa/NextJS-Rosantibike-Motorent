import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Rosantibike - Premium Motorcycle Rental Service',
  description:
    'Rosantibike Motorent menyediakan layanan rental motor terbaik di Malang dengan harga terjangkau. Nikmati pengalaman berkendara dengan motor berkualitas untuk petualangan Anda.',
  keywords: generateKeywords('home', {
    additionalKeywords: [
      'rental motor malang',
      'sewa motor murah',
      'rental motor berkualitas',
      'rosantibike',
    ],
  }),
  openGraph: {
    url: 'https://rosantibikemotorent.com',
    images: ['/images/home-og.jpg'],
    title: 'Rosantibike - Premium Motorcycle Rental Service',
    description:
      'Rosantibike Motorent menyediakan layanan rental motor terbaik di Malang dengan harga terjangkau. Nikmati pengalaman berkendara dengan motor berkualitas untuk petualangan Anda.',
    siteName: 'Rosantibike Motorent',
  },
  robots: {
    index: true,
    follow: true,
  },
});
