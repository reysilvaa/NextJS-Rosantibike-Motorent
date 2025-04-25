import { generateMetadata } from '@/lib/seo/config';
import { generateKeywords } from '@/lib/seo/keywords';

export const metadata = generateMetadata({
  title: 'Rosantibike Motorent | Rental Motor Berkualitas di Malang',
  description:
    'Rosantibike Motorent menyediakan layanan rental motor premium di Malang dengan harga terjangkau. Motor berkualitas untuk petualangan Anda di seluruh kota Malang.',
  keywords: generateKeywords('home', {
    additionalKeywords: [
      'rental motor malang',
      'sewa motor murah malang',
      'rental motor berkualitas',
      'rosantibike motorent',
      'rosantibike malang',
      'sewa motor malang',
      'rental motor premium malang',
    ],
  }),
  openGraph: {
    url: 'https://rosantibikemotorent.com',
    images: ['/images/home-og.jpg'],
    title: 'Rosantibike Motorent | Rental Motor Berkualitas di Malang',
    description:
      'Rosantibike Motorent menyediakan layanan rental motor premium di Malang dengan harga terjangkau. Motor berkualitas untuk petualangan Anda di seluruh kota Malang.',
    siteName: 'Rosantibike Motorent',
  },
  robots: {
    index: true,
    follow: true,
  },
});
